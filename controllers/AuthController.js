import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
import crypto from 'crypto';
import { v4 as uuidv4 } from 'uuid';

class AuthController {
  static async getConnect(req, res) {
    try {
      // first get the auth header
      const authHeader = req.headers.authorization;
      // check if it is there and if it starts with Basic
      if (!authHeader || !authHeader.startsWith('Basic ')) {
        return res.status(401).json({ error: 'Unauthorized' });
      }
      // remove "Basic " and trim whitespace from header
      const trimHeader = authHeader.slice(6).trim();
      // variables to hold email and pw
      let email = '';
      let password = '';

      try {
        // tak our trimmed header and convert to utf8 string
        const loginData = Buffer.from(trimHeader, 'base64').toString('utf8');
        // now we split into email and password at the :
        [email, password] = loginData.split(':');
        // if email or password missing, then error 400
        if (!email || !password) {
          return res.status(401).json({ error: 'Unauthorized, missing email or password' });
        }
        // catch any other errors
        } catch (error) {
        return res.status(401).json({ error: 'Unauthorized, something went wrong decoding' });
      }

      // hash password with sha1
      const hashedPw = crypto.createHash('sha1').update(password).digest('hex');
      // find user by email and hashed pw
      const user = await dbClient.db.collection('users').findOne({ email, password: hashedPw });
      // error check for no user
      if (!user) {
        return res.status(401).json({ error: 'Unauthorized, no user' });
      }

      // create a token and a redis key with that token
      const token = uuidv4();
      const redisKey = `auth_${token}`;
      // store the key with a 24 hour duration
      await redisClient.set(redisKey, user._id.toString(), 86400);
      // return the token with code 200
      return res.status(200).json({ token });
    } catch (err) {
      console.error('getConnect, some sort of error', err);
      return 0;
    }
  }

  static async getDisconnect(req, res) {
    //
  }
}

export default AuthController;
