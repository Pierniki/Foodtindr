import { Server, Socket } from 'socket.io';
import registerRoomHandlers from './rooms';

const init = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    socket.leave(socket.id);
    registerRoomHandlers(io, socket);
    socket.on('disconnect', () => {
      console.log('disconnect', socket.id);
      console.log(io.sockets.adapter.rooms);
    });
  });
};

export default init;
