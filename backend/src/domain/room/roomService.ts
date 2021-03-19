import { nanoid } from 'nanoid';
import Redis from '../../redis';
import { reviver } from '../../util/jsonHelper';
import MealService from '../meal/mealService';
import Room from './room';

class RoomService {
  private static readonly redisExpiration = 60 * 60;

  public static async getRoomById(id: string): Promise<Room> {
    const roomFromDbString = await Redis.asyncGet(id);
    if (!roomFromDbString) return Promise.reject('No room with id: ' + id);
    return new Room(JSON.parse(roomFromDbString, reviver));
  }

  public static async initializeRoom(userId: string) {
    const room = new Room({
      id: nanoid(6),
      maxUsers: 2,
      mealIds: await MealService.getRandomMeals(),
      userIds: new Set([userId]),
    });
    Redis.client.setex(
      room.getId(),
      RoomService.redisExpiration,
      room.toString()
    );
    return room;
  }

  public static updateRoom(room: Room) {
    return Redis.client.setex(
      room.getId(),
      RoomService.redisExpiration,
      room.toString()
    );
  }

  public static deleteRoomById(id: string) {
    return Redis.client.del(id);
  }
}

export default RoomService;
