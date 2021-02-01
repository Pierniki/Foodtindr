import redis from 'redis';
import util from 'util';

const REDIS_PORT = 6379;
class Redis {
  public static client = redis.createClient(REDIS_PORT);
  public static asyncGet = util.promisify(Redis.client.get).bind(Redis.client);
}

export default Redis;
