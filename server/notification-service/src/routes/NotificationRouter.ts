import { Router } from 'express';
import { NotificationController } from '../controllers/NotificationController';

const router = Router();
const notificationController = new NotificationController();

router.post('/place', notificationController.orderPlacedNotification);
router.post('/complete', notificationController.orderCompletedNotification);

export default router;
