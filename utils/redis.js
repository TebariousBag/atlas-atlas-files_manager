// import the library
import { createClient } from 'redis';


class RedisClient {
  constructor() {
    // create client
    this.client = createClient();
    // is it connected? found isOpen instead
    // this.connected = false;
    // on cases, error or connected
    this.client.on('error', (err) => console.log('RedisClient Error:', err));
    this.client.on('connect', () => console.log('we are connected redis'));
    // connect to client
    this.connect();
  }

  async connect() {
    try {
      await this.client.connect();
      // not needed anymore with isOpen
       // this.connected = true;
    } catch (err) {
      console.error('conncetion failed', err);
    }
  }

  // is it connected?
  // is open shows real time status
  isAlive() {
    return this.client.isOpen;
  }

  // get the value by key
  async get(key) {
    try {
      // get key
      const data = await this.client.get(key);
      return data;
    } catch (err) {
      console.error('could not get', err);
      return null
    }
  }

  // store with an epiration
  async set(key, value, duration) {
    try {
      // need to make sure value is a string
      // and set with expiration
      await this.client.setEx(key, duration, String(value));
    } catch (err) {
      console.error('could not set', err);
    }
    }

  // delete the key
  async del(key) {
    try {
      await this.client.del(key);
    } catch (err) {
      console.error('could not delete', err);
    }
  }
}

// create redisClient
const redisClient = new RedisClient();

// export always export
export default redisClient;
