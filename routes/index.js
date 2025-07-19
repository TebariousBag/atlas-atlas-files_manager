import express from 'express';
import AppController from '../controllers/AppController.js';

const newRouter = express.Router();
// our endpoints
newRouter.get('/status', AppController.getStatus);
newRouter.get('/stats', AppController.getStats);
// and then export
export default newRouter;
