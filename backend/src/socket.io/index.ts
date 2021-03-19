import { Server, Socket } from 'socket.io';
import RoomService from '../domain/room/roomService';
import registerRoomHandlers from './rooms';

const init = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    socket.leave(socket.id);
    registerRoomHandlers(io, socket);
    socket.on('disconnecting', () => onDisconnecting());

    const onDisconnecting = async () => {
      console.log('disconnecting', socket.id);
      socket.rooms.forEach(async (roomId) => {
        await socket.leave(roomId);
        if (!io.sockets.adapter.rooms.get(roomId))
          RoomService.deleteRoomById(roomId);
      });
    };
  });
};

export default init;
