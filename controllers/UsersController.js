import dbClient from '../utils/db.js';
// import crypto for hashing
import crypto from 'crypto';


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
}

export default UsersController;
