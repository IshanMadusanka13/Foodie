import { IDeliveryService } from '../DeliveryService';
import Delivery, { IDelivery } from '../../models/Delivery';
import logger from '../../config/logger';

export class DeliveryService implements IDeliveryService {
  async createDelivery(deliveryData: Partial<IDelivery>): Promise<IDelivery> {
    logger.info('Creating new delivery');
    try {
      const delivery_id = await this.generateDeliveryId();
      const newDelivery = new Delivery({
        ...deliveryData,
        delivery_id,
        status: 'pending'
      });
      
      const savedDelivery = await newDelivery.save();
      logger.info({ delivery_id }, 'Delivery created successfully');
      return savedDelivery;
    } catch (error) {
      logger.error({ error, deliveryData }, 'Failed to create delivery');
      throw error;
    }
  }

  async getDeliveryById(deliveryId: string): Promise<IDelivery | null> {
    logger.info({ deliveryId }, 'Fetching delivery by ID');
    try {
      const delivery = await Delivery.findOne({ delivery_id: deliveryId });
      if (delivery) {
        logger.info('Delivery found');
      } else {
        logger.warn('Delivery not found');
      }
      return delivery;
    } catch (error) {
      logger.error({ error, deliveryId }, 'Error fetching delivery by ID');
      throw error;
    }
  }

  async getDeliveriesByStatus(status: string): Promise<IDelivery[]> {
    logger.info({ status }, 'Fetching deliveries by status');
    try {
      const deliveries = await Delivery.find({ status });
      logger.info(`Found ${deliveries.length} deliveries with status ${status}`);
      return deliveries;
    } catch (error) {
      logger.error({ error, status }, 'Error fetching deliveries by status');
      throw error;
    }
  }

  async getNearbyDeliveries(longitude: number, latitude: number, maxDistance: number = 10000): Promise<IDelivery[]> {
    logger.info({ longitude, latitude, maxDistance }, 'Fetching nearby deliveries');
    try {
      // Find pending deliveries with restaurant location within maxDistance (in meters)
      // This is a simplified approach - in a real app, you'd use geospatial queries
      const deliveries = await Delivery.find({ status: 'pending' });
      
      // Filter deliveries based on distance
      const nearbyDeliveries = deliveries.filter(delivery => {
        const distance = this.calculateDistance(
          latitude, 
          longitude, 
          delivery.restaurant_location.latitude, 
          delivery.restaurant_location.longitude
        );
        return distance <= maxDistance;
      });
      
      logger.info(`Found ${nearbyDeliveries.length} nearby deliveries`);
      return nearbyDeliveries;
    } catch (error) {
      logger.error({ error, longitude, latitude }, 'Error fetching nearby deliveries');
      throw error;
    }
  }

  async acceptDelivery(deliveryId: string, riderId: string): Promise<IDelivery | null> {
    logger.info({ deliveryId, riderId }, 'Rider accepting delivery');
    try {
      const delivery = await Delivery.findOneAndUpdate(
        { delivery_id: deliveryId, status: 'pending' },
        { 
          rider_id: riderId, 
          status: 'accepted',
          accepted_at: new Date()
        },
        { new: true }
      );
      
      if (delivery) {
        logger.info('Delivery accepted successfully');
      } else {
        logger.warn('Delivery not found or already accepted');
      }
      
      return delivery;
    } catch (error) {
      logger.error({ error, deliveryId, riderId }, 'Error accepting delivery');
      throw error;
    }
  }

  async updateDeliveryStatus(deliveryId: string, status: string, timestamp: Date = new Date()): Promise<IDelivery | null> {
    logger.info({ deliveryId, status }, 'Updating delivery status');
    try {
      const updateData: any = { status };
      
      // Add timestamp based on status
      if (status === 'collected') {
        updateData.collected_at = timestamp;
      } else if (status === 'delivered') {
        updateData.delivered_at = timestamp;
      }
      
      const delivery = await Delivery.findOneAndUpdate(
        { delivery_id: deliveryId },
        updateData,
        { new: true }
      );
      
      if (delivery) {
        logger.info(`Delivery status updated to ${status}`);
      } else {
        logger.warn('Delivery not found for status update');
      }
      
      return delivery;
    } catch (error) {
      logger.error({ error, deliveryId, status }, 'Error updating delivery status');
      throw error;
    }
  }

  async getDeliveriesByRider(riderId: string): Promise<IDelivery[]> {
    logger.info({ riderId }, 'Fetching deliveries by rider');
    try {
      const deliveries = await Delivery.find({ rider_id: riderId });
      logger.info(`Found ${deliveries.length} deliveries for rider ${riderId}`);
      return deliveries;
    } catch (error) {
      logger.error({ error, riderId }, 'Error fetching deliveries by rider');
      throw error;
    }
  }

  async generateDeliveryId(): Promise<string> {
    logger.info('Generating new delivery ID');
    try {
      const count = await Delivery.countDocuments();
      const nextSequence = count + 1;
      const formattedSequence = nextSequence.toString().padStart(4, '0');
      const deliveryId = `D${formattedSequence}`;
      logger.debug({ deliveryId }, 'Delivery ID generated');
      return deliveryId;
    } catch (error) {
      logger.error({ error }, 'Failed to generate delivery ID');
      throw error;
    }
  }

  // Helper method to calculate distance between two points using Haversine formula
  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = lat1 * Math.PI/180;
    const φ2 = lat2 * Math.PI/180;
    const Δφ = (lat2-lat1) * Math.PI/180;
    const Δλ = (lon2-lon1) * Math.PI/180;

    const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
              Math.cos(φ1) * Math.cos(φ2) *
              Math.sin(Δλ/2) * Math.sin(Δλ/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

    return R * c; // Distance in meters
  }
}
