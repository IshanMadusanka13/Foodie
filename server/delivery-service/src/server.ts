import app from './app';
import http from 'http';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { connectRabbitMQ, consumeMessages, publishMessage } from './config/rabbitmq';
import { DeliveryService } from './services/impl/DeliveryServiceImpl';
import logger from './config/logger';
import { Server } from 'socket.io';

dotenv.config();

const PORT = process.env.PORT || 5005;
const MONGO_URI = process.env.MONGO_URI || "";
const RABBITMQ_URI = process.env.RABBITMQ_URI || "amqp://localhost";

const deliveryService = new DeliveryService();

// Create HTTP server
const server = http.createServer(app);


// Initialize Socket.io with explicit path
const io = new Server(server, {
  cors: {
    origin: '*',
    methods: ['GET', 'POST']
  },
  path: '/socket.io/', // Make sure this path is explicitly set
  transports: ['websocket', 'polling'] // Ensure WebSocket transport is enabled
});

// Make io available to controllers
app.set('io', io);

// Socket.io connection handling
io.on('connection', (socket) => {
  logger.info(`Client connected: ${socket.id}`);
  
  // Handle rider location updates
  // Enhance the rider:location event handler
    socket.on('rider:location', async (data) => {
      try {
        // Validate the data
        if (!data.deliveryId || !data.latitude || !data.longitude) {
          logger.warn('Invalid location data received');
          return;
        }
        
        // Store the location update in database (optional)
        // This could be in a separate collection for location history
        
        // Broadcast to clients tracking this delivery
        io.to(`delivery:${data.deliveryId}`).emit('delivery:location', {
          deliveryId: data.deliveryId,
          location: {
            latitude: data.latitude,
            longitude: data.longitude
          },
          timestamp: new Date()
        });
        
        logger.info({ 
          deliveryId: data.deliveryId, 
          location: { lat: data.latitude, lng: data.longitude } 
        }, 'Rider location updated');
      } catch (error) {
        logger.error({ error, data }, 'Error processing rider location update');
      }
    });

  
  // Join a delivery tracking room
  socket.on('join:delivery', (deliveryId) => {
    socket.join(`delivery:${deliveryId}`);
    logger.info(`Client ${socket.id} joined tracking for delivery ${deliveryId}`);
  });
  
  // Leave a delivery tracking room
  socket.on('leave:delivery', (deliveryId) => {
    socket.leave(`delivery:${deliveryId}`);
    logger.info(`Client ${socket.id} left tracking for delivery ${deliveryId}`);
  });
  
  socket.on('disconnect', () => {
    logger.info(`Client disconnected: ${socket.id}`);
  });
});

// Handle order created events
const handleOrderCreated = async (orderData: any) => {
  try {
    logger.info({ orderId: orderData.order_id }, 'Received order created event');
    
    // Create a new delivery for the order
    const delivery = await deliveryService.createDelivery({
      order_id: orderData.order_id,
      restaurant_location: orderData.restaurant_location,
      customer_location: orderData.customer_location,
      status: 'pending'
    });
    
    logger.info({ orderId: orderData.order_id, deliveryId: delivery.delivery_id }, 'Delivery created for order');
    
    // Try to auto-assign a rider
    const assignedDelivery = await deliveryService.autoAssignRider(delivery.delivery_id);
    
    if (assignedDelivery) {
      logger.info({ 
        orderId: orderData.order_id, 
        deliveryId: delivery.delivery_id,
        riderId: assignedDelivery.rider_id 
      }, 'Rider auto-assigned to delivery');
      
      // Publish delivery assigned event
      await publishMessage('delivery_assigned', {
        delivery_id: assignedDelivery.delivery_id,
        order_id: assignedDelivery.order_id,
        rider_id: assignedDelivery.rider_id,
        status: assignedDelivery.status
      });
    } else {
      logger.warn({ 
        orderId: orderData.order_id, 
        deliveryId: delivery.delivery_id 
      }, 'Could not auto-assign rider to delivery');
    }
  } catch (error) {
    logger.error({ error, orderId: orderData.order_id }, 'Failed to process order created event');
  }
};

// Handle delivery status updates
const handleDeliveryStatusUpdated = async (statusData: any) => {
  try {
    logger.info({ 
      deliveryId: statusData.delivery_id,
      status: statusData.status
    }, 'Received delivery status update event');

    // Update the delivery in the database
    const updatedDelivery = await deliveryService.updateDeliveryStatus(
      statusData.delivery_id, 
      statusData.status
    );

    if (!updatedDelivery) {
      logger.warn(`Delivery ${statusData.delivery_id} not found for status update`);
      return;
    }
    
    // Notify connected clients about the status change via Socket.io
    logger.info(`Emitting delivery:status_updated event for delivery ${statusData.delivery_id}`);
    io.to(`delivery:${statusData.delivery_id}`).emit('delivery:status_updated', {
      deliveryId: statusData.delivery_id,
      status: statusData.status,
      timestamp: new Date(),
      order_id: updatedDelivery.order_id
    });
    
    // Publish notification event for the order service and customer notifications
    await publishMessage('delivery_status_updated', {
      delivery_id: statusData.delivery_id,
      order_id: statusData.order_id,
      status: statusData.status,
      timestamp: new Date()
    });
    
    logger.info({ deliveryId: statusData.delivery_id }, 'Delivery status update processed');
  } catch (error) {
    logger.error({ error, deliveryId: statusData.delivery_id }, 'Failed to process delivery status update');
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
    await consumeMessages('delivery_status_updated', handleDeliveryStatusUpdated);
    
    // Start HTTP server with Socket.io
    server.listen(PORT, () => {
      logger.info(`🚀 Delivery service running on port ${PORT} as of ${new Date().toISOString()}`);
    });
  } catch (error) {
    logger.error('Failed to start server:', error);
    process.exit(1);
  }
};

// Handle graceful shutdown
process.on('SIGINT', async () => {
  logger.info('Received SIGINT. Shutting down gracefully...');
  // Close server and database connections
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGTERM', async () => {
  logger.info('Received SIGTERM. Shutting down gracefully...');
  // Close server and database connections
  server.close(() => {
    logger.info('HTTP server closed');
    process.exit(0);
  });
});

// Start the server
startServer();
