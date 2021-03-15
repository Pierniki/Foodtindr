import { nanoid } from 'nanoid';
import { Server, Socket } from 'socket.io';
import { fetchMealDetails } from '../api';
import Redis from '../redis';
import { Meal, MealDetails, Room } from '../types';
import { shuffle } from '../util';

const registerRoomHandlers = (io: Server, socket: Socket) => {
  socket.on('room:create', async () => {
    const roomId = nanoid(6);
    await socket.join(roomId);
    console.log('room:create', socket.id);

    console.log(socket.rooms);

    socket.emit('room:joined', roomId);
  });

  socket.on('room:join', async (roomId: string) => {
    console.log('room:join', socket.id);

    const room = io.sockets.adapter.rooms.get(roomId);
    const isJoinable = room && room.size === 1;

    if (!room || !isJoinable) return socket.emit('room:missing');

    const roomFromDbString = await Redis.asyncGet(roomId);
    const isRejoin = Boolean(roomFromDbString);

    await socket.join(roomId);
    if (!isRejoin) socket.emit('room:joined', roomId);

    const roomToDb = isRejoin
      ? getUpdatedRoom(roomFromDbString as string, room, socket.id)
      : await getNewRoom(room);

    Redis.client.setex(roomId, 60 * 60, JSON.stringify(roomToDb));

    const meal: Meal = await getMealToSend(roomToDb, socket);
    const target = isRejoin ? socket : io.in(roomId);
    target.emit('room:meals', meal);
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
      const mealDetails: MealDetails = await fetchMealDetails(
        roomFromDb.meals[voteList.length - 1]
      );
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

const getUpdatedRoom = (
  roomFromDbString: string,
  room: Set<string>,
  socketId: string
): Room => {
  const roomFromDb = JSON.parse(roomFromDbString);
  const [_, id1, id2] = Object.keys(roomFromDb);
  const activeId = Array.from(room)[0];
  const oldId = activeId === id1 ? id2 : id1;

  return {
    meals: roomFromDb.meals,
    [activeId]: roomFromDb[activeId],
    [socketId]: roomFromDb[oldId],
  };
};

const getNewRoom = async (room: Set<string>): Promise<Room> => {
  const userIds = Array.from(room);

  const randomMealIds = await getRandomMeals();
  return {
    meals: randomMealIds,
    [userIds[0]]: [],
    [userIds[1]]: [],
  };
};

const getMealToSend = async (roomToDb: Room, socket: Socket) => {
  const lastMealId =
    roomToDb.meals[roomToDb[socket.id] ? roomToDb[socket.id].length : 0];
  const meal = await Redis.get(lastMealId);
  return meal;
};

const getRandomMeals = async () => {
  const mealIdsString = await Redis.get('mealIds');
  const shuffledMealIds: string[] = shuffle(mealIdsString);
  return shuffledMealIds;
};

export default registerRoomHandlers;
