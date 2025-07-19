import redisClient from '../utils/redis.js';
import dbClient from '../utils/db.js';
// i needed help with this one
class AppController {
  static getStatus(req, res) {
	// us our isAlive to see if true with status 200
    res.status(200).json({
      redis: redisClient.isAlive(),
      db: dbClient.isAlive(),
    });
  }

  static async getStats(req, res) {
	// get our users and files
    const users = await dbClient.nbUsers();
    const files = await dbClient.nbFiles();
    res.status(200).json({ users, files });
  }
}
// always export
export default AppController;
