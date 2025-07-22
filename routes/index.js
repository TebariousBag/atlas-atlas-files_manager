import express from 'express';
import AppController from '../controllers/AppController.js';
import UsersController from '../controllers/UsersController.js';
import AuthController from '../controllers/AuthController.js';

const newRouter = express.Router();
// our endpoints for get status and stats
newRouter.get('/status', AppController.getStatus);
newRouter.get('/stats', AppController.getStats);
//endpoint for post
newRouter.post('/users', UsersController.postNew);
// endpoints or authconroller
newRouter.get('/connect', AuthController.getConnect);
newRouter.get('/disconnect', AuthController.getDisconnect);
// endpoint for getme
newRouter.get('/users/me', UsersController.getMe);
// and then export
export default newRouter;
