import express from 'express';
import { UserController } from '../controllers/UserController';

const userRouter = express.Router();
const controller = new UserController();

userRouter.post('/', controller.create);
userRouter.get('/', controller.getAll);
userRouter.get('/:id', controller.getById);
userRouter.put('/:id', controller.update);
userRouter.delete('/:id', controller.delete);

export default userRouter;
