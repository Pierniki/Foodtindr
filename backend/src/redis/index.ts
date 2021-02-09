import redis from 'redis';
import util from 'util';

const REDIS_PORT = 6379;
class Redis {
  public static client = redis.createClient(REDIS_PORT);
  public static asyncGet = util.promisify(Redis.client.get).bind(Redis.client);
  public static get = async (key: string) => {
    const resultString = await Redis.asyncGet(key);
    if (!resultString) throw Error(`Key ${key} has no value.`);
    return JSON.parse(resultString);
  };
  public static isPresent = async (key: string) => {
    const resultString = await Redis.asyncGet(key);
    if (resultString) return true;
    return false;
  };
}

export default Redis;
