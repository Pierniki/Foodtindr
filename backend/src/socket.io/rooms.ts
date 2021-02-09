import { nanoid } from 'nanoid';
import { Server, Socket } from 'socket.io';
import { fetchMealDetails, Meal } from '../api';
import Redis from '../redis';
import { shuffle } from '../util';

const registerRoomHandlers = (io: Server, socket: Socket) => {
  socket.on('room:create', async () => {
    const roomId = nanoid(6);
    await socket.join(roomId);
    console.log(`${socket.id} JOINED A ROOM WITH ID: ${roomId}`);
    socket.emit('room:joined', roomId);
  });

  socket.on('room:join', async (roomId: string) => {
    const roomsMap = io.sockets.adapter.rooms;
    const room = roomsMap.get(roomId);
    const isJoinable = roomsMap.get(roomId)?.size === 1;

    if (!room || !isJoinable) return socket.emit('room:missing');

    const roomFromDbString = await Redis.asyncGet(roomId);

    // TODO REFACTOR
    if (roomFromDbString) {
      const roomFromDb = JSON.parse(roomFromDbString);
      const [_, id1, id2] = Object.keys(roomFromDb);
      const activeId = Array.from(room)[0];
      const oldId = activeId === id1 ? id2 : id1;

      const roomToDb = {
        meals: roomFromDb.meals,
        [activeId]: roomFromDb[activeId],
        [socket.id]: roomFromDb[oldId],
      };

      await socket.join(roomId);

      Redis.client.setex(roomId, 60 * 60, JSON.stringify(roomToDb));
      const lastMealId = roomToDb.meals[roomToDb[socket.id].length];
      const lastMeal = await Redis.get(lastMealId);

      return socket.emit('room:meals', lastMeal);
    }

    await socket.join(roomId);

    const userIds = Array.from(room);

    console.log(`${socket.id} JOINED A ROOM WITH ID: ${roomId}`);
    socket.emit('room:joined', roomId);

    // TODO Let users choose categories
    const randomMealIds = await getRandomMeals();
    const roomToDb = {
      meals: randomMealIds,
      [userIds[0]]: [],
      [userIds[1]]: [],
    };
    Redis.client.setex(roomId, 60 * 60, JSON.stringify(roomToDb));
    const meal: Meal = await Redis.get(randomMealIds[0]);
    io.in(roomId).emit('room:meals', meal);
  });

  socket.on('room:vote', async (vote: boolean) => {
    const roomId = socket.rooms.keys().next().value;
    const roomFromDb = await Redis.get(roomId);
    const voteList = [...roomFromDb[socket.id], vote];
    const roomToDb = { ...roomFromDb, ...{ [socket.id]: voteList } };

    const isVoteAMatch = isMatch(roomToDb, voteList.length - 1);

    console.log(roomFromDb.meals[voteList.length]);

    Redis.client.setex(roomId, 60 * 60, JSON.stringify(roomToDb));
    if (isVoteAMatch) {
      const mealDetails = await fetchMealDetails(
        roomFromDb.meals[voteList.length - 1]
      );
      console.log(mealDetails);
      return io.in(roomId).emit('room:match', mealDetails);
    }

    const nextMeal = await Redis.get(roomFromDb.meals[voteList.length]);
    socket.emit('room:meals', nextMeal);
  });
};

const isMatch = (roomToDb: any, voteIdx: number) => {
  const [_, id1, id2] = Object.keys(roomToDb);
  return roomToDb[id1][voteIdx] && roomToDb[id2][voteIdx];
};

const getRandomMeals = async () => {
  const mealIdsString = await Redis.get('mealIds');
  const shuffledMealIds: string[] = shuffle(mealIdsString);
  return shuffledMealIds;
};

export default registerRoomHandlers;
