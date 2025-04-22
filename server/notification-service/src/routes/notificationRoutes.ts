import express from 'express';
import { notifyUser } from '../controllers/notificationController';

const router = express.Router();

router.post('/notify', notifyUser);

export default router;