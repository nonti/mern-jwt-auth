import express from 'express';
import userAuth from '../middlewares/userAuth.js';
import { getUserInfo } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.get('/info', userAuth, getUserInfo);

export default userRouter;