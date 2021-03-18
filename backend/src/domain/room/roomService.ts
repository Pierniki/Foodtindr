import { nanoid } from 'nanoid';
import { getRandomMeals } from '../../api';
import Redis from '../../redis';
import { reviver } from '../../util/jsonHelper';
import Room from './room';

class RoomService {
  private static readonly redisExpiration = 60 * 60;

  public static async getRoomById(id: string): Promise<Room> {
    const roomFromDbString = await Redis.asyncGet(id);
    if (!roomFromDbString) return Promise.reject('No room with id: ' + id);
    console.log(JSON.parse(roomFromDbString, reviver));
    return new Room(JSON.parse(roomFromDbString, reviver));
  }

  public static async initializeRoom(userId: string) {
    const room = new Room({
      id: nanoid(6),
      maxUsers: 2,
      mealIds: await getRandomMeals(),
      userIds: new Set([userId]),
    });
    Redis.client.setex(
      room.getId(),
      RoomService.redisExpiration,
      room.toString()
    );
    return room;
  }

  public static async updateRoom(room: Room) {
    Redis.client.setex(
      room.getId(),
      RoomService.redisExpiration,
      room.toString()
    );
  }
}

export default RoomService;
