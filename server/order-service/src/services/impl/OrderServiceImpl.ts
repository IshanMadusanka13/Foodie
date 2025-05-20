import Order, { IOrder, IOrderCreate } from '../../models/Order';
import { IOrderService } from '../OrderService';
import logger from '../../config/logger';
import axios from 'axios';

export class OrderService implements IOrderService {
    async generateOrderId(): Promise<string> {
        logger.info('Generating new Order ID');
        try {
            const count = await Order.countDocuments();
            const nextSequence = count + 1;
            const formattedSequence = nextSequence.toString().padStart(4, '0');
            const orderId = `ORD${formattedSequence}`;
            logger.debug('Order ID generated');
            return orderId;

        } catch (error) {
            logger.error({ error }, 'Failed to generate user ID');
            throw error;
        }
    }

    async createOrder(order: IOrderCreate): Promise<IOrder> {
        logger.info(`Creating new order for customer ${order.customer}`);
        const newOrder = new Order(order);
        const savedOrder = await newOrder.save();

        try {
            await axios.post('http://localhost:5005/api/deliveries', {
                order_id: savedOrder.order_id,
                customer: savedOrder.customer,
                restaurant: savedOrder.restaurant,
                payment_method: savedOrder.paymentMethod,
                restaurant_location: order.restaurantLocation,
                customer_location: order.customerLocation,
                total: savedOrder.total
            });
            logger.info(`Order created with ID: ${savedOrder.order_id}`);
        } catch (error) {
            logger.error(`Failed to create order: ${error}`);
        }
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

    async verifyOrder(orderId: string, status: number): Promise<IOrder | null> {
        logger.info(`Verifying order ${orderId}`);
        let updated;

        if (status == 1) {
            updated = await Order.findOneAndUpdate({ order_id: orderId }, { status: 'accepted' }, { new: true });
        } else if (status == 0) {
            updated = await Order.findOneAndUpdate({ order_id: orderId }, { status: 'declined' }, { new: true });
        }

        if (updated) {
            logger.info(`Order ${orderId} Verified successfully`);
        } else {
            logger.warn(`Order ${orderId} not found for verify`);
        }
        return updated || null;
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

    async getUnverifiedOrders(restaurantId: string): Promise<IOrder[] | null> {
        logger.info(`Fetching Unverified Orders for : ${restaurantId}`);
        return await Order.find({ restaurant: restaurantId, status: 'pending' });
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
