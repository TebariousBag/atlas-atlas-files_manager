// import library
import { createClient } from 'redis';


class RedisClient {
  constructor () {
    // create the client
    this.rClient = createClient();
    this.connection = false;
    this.rClient.on('error', (err) => {
      console.log(err);
    });
    this.rClient.on('connect', () => {
      this.connection = true;
    })
    }

    isAlive () {
      return this.connection
    }
  }

// create the new object redisClient
const redisClient = new RedisClient();
// export function
export default redisClient;
