import { Request, Response } from 'express';
import { DeliveryService } from '../services/impl/DeliveryServiceImpl';
import logger from '../config/logger';

const deliveryService = new DeliveryService();

export class DeliveryController {
  createDelivery = async (req: Request, res: Response): Promise<void> => {
    try {
      const delivery = await deliveryService.createDelivery(req.body);
      res.status(201).json(delivery);
    } catch (err: any) {
      logger.error({ err }, 'Error in createDelivery controller');
      res.status(500).json({ message: err.message });
    }
  };

  getDeliveryById = async (req: Request, res: Response): Promise<void> => {
    try {
      const delivery = await deliveryService.getDeliveryById(req.params.id);
      if (!delivery) {
        res.status(404).json({ message: 'Delivery not found' });
      } else {
        res.json(delivery);
      }
    } catch (err: any) {
      logger.error({ err }, 'Error in getDeliveryById controller');
      res.status(500).json({ message: err.message });
    }
  };

  getDeliveriesByStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { status } = req.params;
      const deliveries = await deliveryService.getDeliveriesByStatus(status);
      res.json(deliveries);
    } catch (err: any) {
      logger.error({ err }, 'Error in getDeliveriesByStatus controller');
      res.status(500).json({ message: err.message });
    }
  };

  getNearbyDeliveries = async (req: Request, res: Response): Promise<void> => {
    try {
      const { longitude, latitude, maxDistance } = req.query;
      const deliveries = await deliveryService.getNearbyDeliveries(
        parseFloat(longitude as string),
        parseFloat(latitude as string),
        maxDistance ? parseFloat(maxDistance as string) : undefined
      );
      res.json(deliveries);
    } catch (err: any) {
      logger.error({ err }, 'Error in getNearbyDeliveries controller');
      res.status(500).json({ message: err.message });
    }
  };

  acceptDelivery = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { riderId } = req.body;
      
      if (!riderId) {
        res.status(400).json({ message: 'Rider ID is required' });
        return;
      }
      
      const delivery = await deliveryService.acceptDelivery(id, riderId);
      
      if (!delivery) {
        res.status(404).json({ message: 'Delivery not found or already accepted' });
      } else {
        res.json(delivery);
      }
    } catch (err: any) {
      logger.error({ err }, 'Error in acceptDelivery controller');
      res.status(500).json({ message: err.message });
    }
  };

  updateDeliveryStatus = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { status } = req.body;
      
      if (!status) {
        res.status(400).json({ message: 'Status is required' });
        return;
      }
      
      const delivery = await deliveryService.updateDeliveryStatus(id, status);
      
      if (!delivery) {
        res.status(404).json({ message: 'Delivery not found' });
      } else {
        res.json(delivery);
      }
    } catch (err: any) {
      logger.error({ err }, 'Error in updateDeliveryStatus controller');
      res.status(500).json({ message: err.message });
    }
  };

  getDeliveriesByRider = async (req: Request, res: Response): Promise<void> => {
    try {
      const { riderId } = req.params;
      const deliveries = await deliveryService.getDeliveriesByRider(riderId);
      res.json(deliveries);
    } catch (err: any) {
      logger.error({ err }, 'Error in getDeliveriesByRider controller');
      res.status(500).json({ message: err.message });
    }
  };

  autoAssignRider = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      
      const delivery = await deliveryService.autoAssignRider(id);
      
      if (!delivery) {
        res.status(404).json({ message: 'Delivery not found or no available riders' });
      } else {
        res.json(delivery);
      }
    } catch (err: any) {
      logger.error({ err }, 'Error in autoAssignRider controller');
      res.status(500).json({ message: err.message });
    }
  };

  updateRiderLocation = async (req: Request, res: Response): Promise<void> => {
    try {
      const { id } = req.params;
      const { latitude, longitude } = req.body;
      
      if (!latitude || !longitude) {
        res.status(400).json({ message: 'Latitude and longitude are required' });
        return;
      }
      
      // In a real implementation, this would update a rider's location in a separate collection
      // For now, we'll just acknowledge the update
      
      // Broadcast the location update to connected clients via WebSocket
      // This would be implemented with Socket.io or similar
      
      res.json({ success: true });
    } catch (err: any) {
      logger.error({ err }, 'Error in updateRiderLocation controller');
      res.status(500).json({ message: err.message });
    }
  };
}
