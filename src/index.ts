import express from 'express';
import router from './routes';
import { Server } from 'socket.io';
import initIo from './socket.io';

const app = express();
app.use(express.json());
app.use('/api', router);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`App running on port ${process.env.PORT || 3000}.`);
});

const io = new Server(server);
initIo(io);
