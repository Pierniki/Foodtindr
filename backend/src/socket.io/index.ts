import { Socket } from 'dgram';
import { Server } from 'socket.io';

const init = (io: Server) => {
  io.on('connection', (socket) => {
    console.log(socket.id);
  });
};

export default init;
