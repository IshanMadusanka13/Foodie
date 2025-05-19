import { Request, Response } from 'express';
import { NotificationService } from '../services/NotificationService';
import { NotificationServiceImpl } from '../services/impl/NotificationServiceImpl';
import logger from '../config/logger';

export class NotificationController {
  private notificationService: NotificationService;

  constructor() {
    this.notificationService = new NotificationServiceImpl();
  }

  orderPlacedNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, order_id, email, phone } = req.body;

      if (!user_id || !order_id || !email || !phone) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }

      const notification = await this.notificationService.orderPlacedNotification(
        user_id,
        order_id,
        email,
        phone,
      );

      res.status(200).json({ success: true, notification });
    } catch (error) {
      logger.error(`Error in sendCustomerNotification: ${error}`);
      res.status(500).json({ message: 'Failed to send customer notification' });
    }
  };

  orderCompletedNotification = async (req: Request, res: Response): Promise<void> => {
    try {
      const { user_id, order_id, email, phone } = req.body;

      if (!user_id || !order_id || !email || !phone) {
        res.status(400).json({ message: 'Missing required fields' });
        return;
      }

      const notification = await this.notificationService.orderPlacedNotification(
        user_id,
        order_id,
        email,
        phone,
      );

      res.status(200).json({ success: true, notification });
    } catch (error) {
      logger.error(`Error in sendCustomerNotification: ${error}`);
      res.status(500).json({ message: 'Failed to send customer notification' });
    }
  };

}
