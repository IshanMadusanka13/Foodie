import { Notification } from '../models/notification';

export const createNotification = async (data: any) => {
    const notification = new Notification(data);
    await notification.save();
    return notification;
};