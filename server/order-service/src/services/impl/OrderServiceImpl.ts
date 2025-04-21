import Order, { IOrder } from '../../models/Order';
import { IOrderService } from '../OrderService';
import logger from '../../config/logger';

export class OrderService implements IOrderService {
    async generateOrderId(): Promise<string> {
        logger.info('Generating new Order ID');
        try {
            const count = await Order.countDocuments();
            const nextSequence = count + 1;
            const formattedSequence = nextSequence.toString().padStart(4, '0');
            const orderId = `F${formattedSequence}`;
            logger.debug('Order ID generated');
            return orderId;

        } catch (error) {
            logger.error({ error }, 'Failed to generate user ID');
            throw error;
        }
    }

    async createOrder(order: IOrder): Promise<IOrder> {
        logger.info(`Creating new order for customer ${order.customer}`);
        const newOrder = new Order(order);
        const savedOrder = await newOrder.save();
        logger.info(`Order created with ID: ${savedOrder.order_id}`);
        return savedOrder;
    }

    async updateOrder(orderId: string, order: Partial<IOrder>): Promise<IOrder | null> {
        logger.info(`Updating order ${orderId}`);
        const updated = await Order.findOneAndUpdate({ order_id: orderId }, order, {
            new: true,
        });
        if (updated) {
            logger.info(`Order ${orderId} updated successfully`);
        } else {
            logger.warn(`Order ${orderId} not found for update`);
        }
        return updated;
    }

    async deleteOrder(orderId: string): Promise<boolean> {
        logger.info(`Deleting order ${orderId}`);
        const result = await Order.deleteOne({ order_id: orderId });
        if (result.deletedCount > 0) {
            logger.info(`Order ${orderId} deleted`);
            return true;
        } else {
            logger.warn(`Order ${orderId} not found for deletion`);
            return false;
        }
    }

    async getOrderById(orderId: string): Promise<IOrder | null> {
        logger.info(`Fetching order by ID: ${orderId}`);
        return await Order.findOne({ order_id: orderId });
    }

    async getOrdersByUserId(userId: string): Promise<IOrder[] | null> {
        logger.info(`Fetching orders for user ID: ${userId}`);
        return await Order.find({ customer: userId });
    }

    async getAllOrders(): Promise<IOrder[]> {
        logger.info(`Fetching all orders`);
        return await Order.find({});
    }
}
