import { MongoClient } from 'mongodb';

class DBClient {
	constructor() {
    // defaults are on the right side of ||
    const host = process.env.DB_HOST || 'localhost';
    const port = process.env.DB_PORT || '27017';
    const database = process.env.DB_DATABASE || 'files_manager';
    // this one is confusing to figure out
    const url = `mongodb://${host}:${port}`;
    // create the client with url we were given
    this.client = new MongoClient(url);
    // boolean to see if we are connected
    this.connected = false;
    // save the database for use out of constructor
    this.files_manager = database;
    // and then connect
    this.connect();
	}

  async connect() {
    try {
      await this.client.connect();
      this.connected = true;
      this.db = this.client.db(this.files_manager);
      console.log('we are connected');
    } catch (err) {
      console.error('we are not connected', err);
      this.connected = false;
    }
  }

// no isOpen in Mongo, so we use our boolean to check
isAlive() {
  return this.connected;
}

async nbUsers() {
  try {
    // first get collection of users
    const users = this.db.collection('users');
    // then count the documents of users
    return await users.countDocuments();
  } catch (error) {
    console.error('counting failed', error);
    return 0;
  }
}

}
// always export
const dbClient = new DBClient();
export default dbClient;
