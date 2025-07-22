import dbClient from '../utils/db.js';
// import crypto for hashing
import crypto from 'crypto';
import redisClient from '../utils/redis.js';
import { ObjectId } from 'mongodb';


class UsersController {
  static async postNew(req, res) {
	// getemail and password
    const email = req.body.email;
	const password = req.body.password;
	// get a list of users from db
	const usersList = dbClient.db.collection("users");
    // checks if no email or password with code 400
    if (!email) return res.status(400).json({ error: 'Missing email' });
    if (!password) return res.status(400).json({ error: 'Missing password' });
    // Check if user exists
    const alreadyExists = await usersList.findOne({ email });
    if (alreadyExists) {
		// if the user is already there then return error 400
		return res.status(400).json({ error: 'Already exist' });
	}
    // need to hash the password
	// we are using sha1 to hash the users password
	// digest hex converts it into a hex string
    const hashedPw = crypto.createHash('sha1').update(password).digest('hex');
    // Insert user
    const result = await usersList.insertOne({ email, password: hashedPw });
    // Return created user
    return res.status(201).json({ id: result.insertedId, email });
  }

    static async getMe(req, res) {
	// get xtoken from header
    const token = req.header('X-Token');
    if (!token) {
      return res.status(401).json({ error: 'Unauthorized, no token' });
    }
	// auth token and user get key
    const key = `auth_${token}`;
    const userId = await redisClient.get(key);

    if (!userId) {
      return res.status(401).json({ error: 'Unauthorized, no userid' });
    }
	// find user and ensure it exists
    const user = await dbClient.db.collection('users').findOne({ _id: new ObjectId(userId) });
    if (!user) {
      return res.status(401).json({ error: 'Unauthorized, no user found' });
    }
	// return email and id only
    return res.status(200).json({ id: user._id.toString(), email: user.email });
  }
}

export default UsersController;
