import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import { Server } from 'socket.io';
import router from './routes';
import initIo from './socket.io';

const corsDomain = 'http://localhost:3001';

config();
const app = express();
app.use(cors({ origin: corsDomain }));
app.use(express.json());
app.use('/api', router);

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`App running on port ${process.env.PORT || 3000}.`);
});

const io = new Server(server, {
  cors: { origin: corsDomain, methods: ['GET', 'POST'] },
});
initIo(io);
