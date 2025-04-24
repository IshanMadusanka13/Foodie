import Restaurant, { IRestaurant } from '../models/Restaurant';
import mongoose from 'mongoose';

type RestaurantWithOpenStatus = {
    _id: mongoose.Types.ObjectId;
    name: string;
    address: string;
    ownerId: mongoose.Types.ObjectId;
    openTime: string;
    closeTime: string;
    createdAt?: Date;
    updatedAt?: Date;
    isOpen: boolean;
};

// Utility function
const isCurrentlyOpen = (openTime: string, closeTime: string): boolean => {
    try {
        if (
            typeof openTime !== 'string' ||
            typeof closeTime !== 'string' ||
            !/^\d{1,2}:\d{2}$/.test(openTime) ||
            !/^\d{1,2}:\d{2}$/.test(closeTime)
        ) {
            return false;
        }

        const [openHour, openMinute] = openTime.split(':').map(Number);
        const [closeHour, closeMinute] = closeTime.split(':').map(Number);

        // Validate time ranges
        if (
            openHour < 0 || openHour > 23 || openMinute < 0 || openMinute > 59 ||
            closeHour < 0 || closeHour > 23 || closeMinute < 0 || closeMinute > 59
        ) {
            return false;
        }

        // Handle 24-hour open case
        if (openHour === closeHour && openMinute === closeMinute) {
            return true;
        }

        const now = new Date();
        let currentMinutes = now.getHours() * 60 + now.getMinutes();

        const openMinutes = openHour * 60 + openMinute;
        let closeMinutes = closeHour * 60 + closeMinute;

        // Handle next-day close times
        if (closeMinutes <= openMinutes) {
            closeMinutes += 24 * 60;
            if (currentMinutes < openMinutes) {
                currentMinutes += 24 * 60;
            }
        }

        return currentMinutes >= openMinutes && currentMinutes < closeMinutes;
    } catch (err: any) {
        console.warn(`[WARN] isCurrentlyOpen failed: ${err.message}`);
        return false;
    }
};

// Create
const createRestaurant = async (
    restaurantData: Partial<IRestaurant>
): Promise<IRestaurant> => {
    try {
        const restaurant = new Restaurant(restaurantData);
        await restaurant.save();
        return restaurant.toObject();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to create restaurant');
    }
};

// Get All
const getAllRestaurants = async (): Promise<RestaurantWithOpenStatus[]> => {
    try {
        const restaurants = await Restaurant.find({});
        return restaurants.map((r) => {
            const plain = r.toObject() as Omit<RestaurantWithOpenStatus, 'isOpen'>;

            return {
                ...plain,
                isOpen: isCurrentlyOpen(r.openTime, r.closeTime)
            };
        });

    } catch (error: any) {
        throw new Error(error.message || 'Failed to get restaurants');
    }
};

// Get By ID
const getRestaurantById = async (restaurantId: string): Promise<RestaurantWithOpenStatus> => {
    try {
        if (!restaurantId) throw new Error('restaurant ID is required');

        const restaurant = await Restaurant.findById(restaurantId);
        if (!restaurant) throw new Error('Restaurant not found');

        const plain = restaurant.toObject() as Omit<RestaurantWithOpenStatus, 'isOpen'>;
        return {
            ...plain,
            isOpen: isCurrentlyOpen(restaurant.openTime, restaurant.closeTime)
        };

    } catch (error: any) {
        throw new Error(error.message || 'Failed to get restaurant');
    }
};

// Update
const updateRestaurant = async (
    restaurantId: string,
    updateData: Partial<IRestaurant>
): Promise<IRestaurant> => {
    try {
        const restaurant = await Restaurant.findByIdAndUpdate(restaurantId, updateData, {
            new: true,
        });

        if (!restaurant) throw new Error('restaurant not found');

        return restaurant.toObject();
    } catch (error: any) {
        throw new Error(error.message || 'Failed to update restaurant');
    }
};

// Delete
const deleteRestaurant = async (
    restaurantId: string
): Promise<{ message: string }> => {
    try {
        const restaurant = await Restaurant.findByIdAndDelete(restaurantId);
        if (!restaurant) throw new Error('restaurant not found');

        return { message: `Restaurant '${restaurant.name}' deleted successfully` };
    } catch (error: any) {
        throw new Error(error.message || 'Failed to delete restaurant');
    }
};

export default {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant,
};
