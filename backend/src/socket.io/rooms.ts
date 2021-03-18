import { Server, Socket } from 'socket.io';
import RoomService from '../domain/room/roomService';
import Redis from '../redis';
import { Meal } from '../types';

const registerRoomHandlers = (io: Server, socket: Socket) => {
  socket.on('room:create', () => onCreate().catch(handleErrors));
  socket.on('room:join', (roomId: string) =>
    onJoin(roomId).catch(handleErrors)
  );
  socket.on('room:start', () => onStart().catch(handleErrors));
  socket.on('room:vote', (vote: boolean) => onVote(vote).catch(handleErrors));

  const handleErrors = (error: any) => {
    socket.emit('room:error', error.toString());
  };

  const isUserJoinable = (socket: Socket) => {
    return socket.rooms.size === 0;
  };

  const onCreate = async () => {
    const room = await RoomService.initializeRoom(socket.id);
    if (!isUserJoinable(socket)) throw Error('Unable to join, already joined.');
    await socket.join(room.getId());
    return socket.emit('room:joined', room.getId());
  };

  const onJoin = async (roomId: string) => {
    const userIds = io.sockets.adapter.rooms.get(roomId);
    if (!userIds) throw Error('Room missing');
    if (!isUserJoinable(socket)) throw Error('Unable to join, already joined.');
    const room = await RoomService.getRoomById(roomId);
    room.join(socket.id);
    await RoomService.updateRoom(room);
    await socket.join(room.getId());
    io.in(room.getId()).emit('room:joined', room.getId());
  };

  const onStart = async () => {
    const roomId = socket.rooms.keys().next().value;
    const room = await RoomService.getRoomById(roomId);
    // TODO Meal service
    const meal: Meal = await Redis.get(room.getFirstMealId());
    return io.in(room.getId()).emit('room:meals', meal);
  };

  const onVote = async (vote: boolean) => {
    const roomId = socket.rooms.keys().next().value;
    const room = await RoomService.getRoomById(roomId);
    const voteIdx = room.vote(socket.id, vote);
    await RoomService.updateRoom(room);
    if (room.isVoteMatch(voteIdx)) socket.emit('room:match', voteIdx);
    const nextMealId = room.getNextMealId(socket.id);
    if (!nextMealId) return socket.emit('room:end');
    // TODO Meal service
    const meal: Meal = await Redis.get(nextMealId);
    return socket.emit('room:meals', meal);
  };
};

export default registerRoomHandlers;
