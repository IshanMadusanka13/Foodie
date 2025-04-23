import express from 'express';
import { DeliveryController } from '../controllers/DeliveryController';

const deliveryRouter = express.Router();
const controller = new DeliveryController();

// Create a new delivery
deliveryRouter.post('/', controller.createDelivery);

// Get nearby deliveries
deliveryRouter.get('/nearby', controller.getNearbyDeliveries);

// Get deliveries by status
deliveryRouter.get('/status/:status', controller.getDeliveriesByStatus);

// Get deliveries by rider
deliveryRouter.get('/rider/:riderId', controller.getDeliveriesByRider);

// Get delivery by ID
deliveryRouter.get('/:id', controller.getDeliveryById);

// Accept a delivery
deliveryRouter.put('/:id/accept', controller.acceptDelivery);

// Update delivery status
deliveryRouter.put('/:id/status', controller.updateDeliveryStatus);

export default deliveryRouter;
