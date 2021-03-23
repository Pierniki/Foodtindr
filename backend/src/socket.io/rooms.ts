import { Server, Socket } from 'socket.io';
import MealService from '../domain/meal/mealService';
import RoomService from '../domain/room/roomService';

const registerRoomHandlers = (io: Server, socket: Socket) => {
  socket.on('room:create', () => onCreate().catch(handleErrors));
  socket.on('room:join', (roomId: string) =>
    onJoin(roomId).catch(handleErrors)
  );
  socket.on('room:start', () => onStart().catch(handleErrors));
  socket.on('room:vote', (vote: boolean) => onVote(vote).catch(handleErrors));

  const handleErrors = (error: any) => {
    console.log(error);
    socket.emit('room:error', error.toString());
  };

  const isUserJoinable = (socket: Socket) => {
    return socket.rooms.size === 0;
  };

  const onCreate = async () => {
    const room = await RoomService.initializeRoom(socket.id);
    if (!isUserJoinable(socket)) throw Error('Unable to join, already joined.');
    await socket.join(room.getId());
    return socket.emit(
      'room:joined',
      room.getId(),
      Array.from(room.getUserIds())
    );
  };

  const onJoin = async (roomId: string) => {
    const userIds = io.sockets.adapter.rooms.get(roomId);
    if (!userIds) throw Error('Room missing');
    if (!isUserJoinable(socket)) throw Error('Unable to join, already joined.');
    const room = await RoomService.getRoomById(roomId);
    console.log(room);
    room.join(socket.id);
    RoomService.updateRoom(room);
    await socket.join(room.getId());
    io.in(room.getId()).emit(
      'room:joined',
      room.getId(),
      Array.from(room.getUserIds())
    );
  };

  const onStart = async () => {
    const roomId = socket.rooms.keys().next().value;
    const room = await RoomService.getRoomById(roomId);
    const meal = await MealService.getMealById(room.getFirstMealId());
    return io.in(room.getId()).emit('room:meals', meal);
  };

  const onVote = async (vote: boolean) => {
    console.log('vote');
    const roomId = socket.rooms.keys().next().value;
    const room = await RoomService.getRoomById(roomId);
    const voteIdx = room.vote(socket.id, vote);
    RoomService.updateRoom(room);
    if (room.isVoteMatch(voteIdx)) socket.emit('room:match', voteIdx);
    const nextMealId = room.getNextMealId(socket.id);
    if (!nextMealId) return socket.emit('room:end');
    const meal = await MealService.getMealById(nextMealId);
    console.log(meal);
    return socket.emit('room:meals', meal);
  };
};

export default registerRoomHandlers;
