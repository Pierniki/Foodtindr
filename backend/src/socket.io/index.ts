import { nanoid } from 'nanoid';
import { Server } from 'socket.io';

const init = (io: Server) => {
  io.on('connection', (socket) => {
    socket.leave(socket.id);
    socket.on('room:create', () => {
      const roomId = nanoid(6);
      socket.join(roomId);
      console.log(`${socket.id} JOINED A ROOM WITH ID: ${roomId}`);
      socket.emit('room:joined', roomId);
    });
    socket.on('room:join', (roomId: string) => {
      const roomsMap = io.sockets.adapter.rooms;
      const isJoinable = roomsMap.get(roomId)?.size === 1;

      if (!isJoinable) return socket.emit('room:missing');
      socket.join(roomId);
      console.log(`${socket.id} JOINED A ROOM WITH ID: ${roomId}`);
      socket.emit('room:joined', roomId);
    });
  });
};

export default init;
