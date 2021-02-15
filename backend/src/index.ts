import cors from 'cors';
import { config } from 'dotenv';
import express from 'express';
import path from 'path';
import { Server } from 'socket.io';
import Redis from './redis';
import initIo from './socket.io';

const corsDomain = 'http://localhost:3001';

config();
const app = express();
app.use(cors({ origin: corsDomain }));
app.use(express.json());

app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (_, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

const server = app.listen(process.env.PORT || 3000, () => {
  console.log(`App running on port ${process.env.PORT || 3000}.`);
});

Redis.client.on('connect', () => {
  console.log('Connected to redis.');
});

const io = new Server(server, {
  cors: { origin: corsDomain, methods: ['GET', 'POST'] },
});
initIo(io);
