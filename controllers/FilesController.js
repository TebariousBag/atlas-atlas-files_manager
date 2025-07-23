import fs from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';
import dbClient from '../utils/db.js';
import redisClient from '../utils/redis.js';
import { ObjectId } from 'mongodb';

class FilesController {
  static async postUpload(req, res) {
    try {
		// get xtoken from header
      const token = req.header('X-Token');
      if (!token) {
        return res.status(401).json({ error: 'Unauthorized, no token' });
      }
	  // auth token
      const redisKey = `auth_${token}`;
	  // get key and make sure it exists
      const userId = await redisClient.get(redisKey);
      if (!userId) {
        return res.status(401).json({ error: 'Unauthorized, no userid' });
      }
	  // get properties from request body
	  // with some defaults for optionalfields
      const { name,
		type,
		parentId = '0',
		isPublic = false,
		data } = req.body;
      // error checks for fields that are missing
      if (!name) return res.status(400).json({ error: 'Missing name' });
      const validTypes = ['folder', 'file', 'image'];
      if (!type || !validTypes.includes(type)) {
        return res.status(400).json({ error: 'Missing type' });
      }
      if (type !== 'folder' && !data) {
        return res.status(400).json({ error: 'Missing data' });
      }
	  // grab collection of files
      const filesCollection = dbClient.db.collection('files');
      // check that parent id is set
      if (parentId !== '0') {
        const parentFile = await filesCollection.findOne({ _id: new ObjectId(parentId) });
        if (!parentFile) {
          return res.status(400).json({ error: 'Parent not found' });
        }
        if (parentFile.type !== 'folder') {
          return res.status(400).json({ error: 'Parent is not a folder' });
        }
      }
      // fields for the document
      const fileDoc = {
        userId,
        name,
        type,
        isPublic,
        parentId,
      };
	  // if folder add and return it
      if (type === 'folder') {
        // Just insert folder doc
        const result = await filesCollection.insertOne(fileDoc);
        return res.status(201).json({ id: result.insertedId, ...fileDoc });
      }
      // path to save if not a folder
      const folderPath = process.env.FOLDER_PATH && process.env.FOLDER_PATH.trim() !== ''
        ? process.env.FOLDER_PATH
        : '/tmp/files_manager';

      // make sure folder is there
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath, { recursive: true });
      }
      // unique filename
      const filename = uuidv4();
      // join the paths to have a full path
      const localPath = path.join(folderPath, filename);
      // decode data
      const fileBuffer = Buffer.from(data, 'base64');
      // save the decoded data to our full path
      fs.writeFileSync(localPath, fileBuffer);
      // add localPath to the doc
      fileDoc.localPath = localPath;
      // now we can insert the file to db
      const result = await filesCollection.insertOne(fileDoc);
      return res.status(201).json({ id: result.insertedId, ...fileDoc });

    } catch (err) {
      console.error('Error in postUpload:', err);
      return res.status(500).json({ error: 'Internal server error' });
    }
  }
}
// always export
export default FilesController;
