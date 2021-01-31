import express from 'express';
import cors from 'cors';
import { Server } from 'socket.io';
import { config } from 'dotenv';

import router from './routes';
import initIo from './socket.io';
import connectWithMongoDb from './mongo';

config();
const app = express();
app.use(cors({ origin: 'http://localhost:3001' }));
app.use(express.json());
app.use('/api', router);
connectWithMongoDb();

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`App running on port ${process.env.PORT || 3000}.`);
});

const io = new Server(server);
initIo(io);
