import app from './app';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { connectRabbitMQ, consumeMessages } from './config/rabbitmq';
import { DeliveryService } from './services/impl/DeliveryServiceImpl';
import logger from './config/logger';

dotenv.config();

const PORT = process.env.PORT || 5005;
const MONGO_URI = process.env.MONGO_URI || "";
const RABBITMQ_URI = process.env.RABBITMQ_URI || "amqp://localhost";

const deliveryService = new DeliveryService();

// Handle order created events
const handleOrderCreated = async (orderData: any) => {
  try {
    logger.info({ orderId: orderData.order_id }, 'Received order created event');
    
    // Create a new delivery for the order
    await deliveryService.createDelivery({
      order_id: orderData.order_id,
      restaurant_location: orderData.restaurant_location,
      customer_location: orderData.customer_location,
      status: 'pending'
    });
    
    logger.info({ orderId: orderData.order_id }, 'Delivery created for order');
  } catch (error) {
    logger.error({ error, orderId: orderData.order_id }, 'Failed to process order created event');
  }
};

const startServer = async () => {
  try {
    // Connect to MongoDB
    await connectDB(MONGO_URI);
    
    // Connect to RabbitMQ
    await connectRabbitMQ(RABBITMQ_URI);
    
    // Set up consumers
    await consumeMessages('order_created', handleOrderCreated);
    
    // Start Express server
    app.listen(PORT, () => {
      logger.info(`🚀 Delivery service running on port ${PORT}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

startServer();
