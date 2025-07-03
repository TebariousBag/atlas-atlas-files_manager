// import library
import { createClient } from 'redis';


class RedisClient {
  constructor () {
    // create the client
    this.rClient = createClient();
    this.connection = false;
    this.rClient.on('error', (err) => {
      console.log(err);
      this.connection = false;
    });
    this.rClient.on('connect', () => {
      this.connection = true;
    });
  }

  isAlive () {
    return this.connection;
  }
  
  async get(key) {
    const data = this.rClient.get(key);
    try {
      return await data
  } catch (err) {
      console.log('GET error', err);
      return null;
  }
  }

  async set(key, value, duration) {
    const data = this.rClient.set(key, value, duration);
    try {
      return await data[3]
    } catch (err) {
      console.log('SET error', err)
    }
  }

  async del(key) {
    try {
      this.rClient.del(key);
    } catch (err) {
      console.log('DEL error', err)
    }
  }

}

// create the new object redisClient
const redisClient = new RedisClient();
// export function
export default redisClient;
