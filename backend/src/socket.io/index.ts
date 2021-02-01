import { Server, Socket } from 'socket.io';
import registerRoomHandlers from './rooms';

const init = (io: Server) => {
  io.on('connection', (socket: Socket) => {
    socket.leave(socket.id);
    registerRoomHandlers(io, socket);
  });
};

export default init;
