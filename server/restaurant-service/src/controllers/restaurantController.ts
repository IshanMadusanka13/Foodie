import { Request, Response, NextFunction } from 'express';
import RestaurantService from '../services/restaurantService';

import { uploadImagesToSupabase } from '../utils/supabaseUpload';

// Create Restaurant
const createRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
        // Log the request body
        console.log('Request Body:', req.body);

        const { longitude, latitude, name, address, email, ownerId } = req.body;

        const lon = parseFloat(longitude);
        const lat = parseFloat(latitude);

        console.log('Longitude:', lon, 'Latitude:', lat);

        // Validate latitude and longitude
        if (isNaN(lon) || isNaN(lat) || lon < -180 || lon > 180 || lat < -90 || lat > 90) {
            console.log('Invalid latitude/longitude');
            res.status(400).json({ status: 'Error', message: 'Invalid longitude or latitude' });
            return;
        }

        // Ensure required fields
        if (!name || !address || !email || !ownerId) {
            console.log('Missing required fields');
            res.status(400).json({ status: 'Error', message: 'Missing required fields' });
            return;
        }

        // Handle image uploads
        const files = req.files as Express.Multer.File[] | undefined;
        console.log('Files:', files);

        const imageUrls = files && files.length > 0 ? await uploadImagesToSupabase(files, 'restaurants') : [];
        console.log('Image URLs:', imageUrls);

        if (imageUrls.length === 0) {
            imageUrls.push('https://waymjbgcpfbxrjxrlizr.supabase.co/storage/v1/object/public/foodie/Restaurants/default_restaurant.png');
        }

        const restaurantData = {
            ...req.body,
            imageUrls,
            location: {
                longitude: lon,
                latitude: lat,
            },
        };

        console.log('Restaurant Data:', restaurantData);

        const restaurant = await RestaurantService.createRestaurant(restaurantData);
        console.log('Created Restaurant:', restaurant);

        res.status(201).json({ status: 'Success', data: { restaurant } });
    } catch (error: any) {
        console.error('Error:', error);
        res.status(400).json({ status: 'Error', message: error.message || 'Failed to create restaurant' });
    }
};

// Update Restaurant
const updateRestaurant = async (req: Request, res: Response): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[] | undefined;
        let imageUrls = files && files.length > 0 ? await uploadImagesToSupabase(files, 'restaurants') : [];

        // If no images provided AND no imageUrls in body, use default
        if (imageUrls.length === 0 && (!req.body.imageUrls || req.body.imageUrls.length === 0)) {
            imageUrls = [
                'https://waymjbgcpfbxrjxrlizr.supabase.co/storage/v1/object/public/foodie/Restaurants/default_restaurant.png'
            ];
        }

        const updateData: any = {
            ...req.body,
            ...(imageUrls.length > 0 && { imageUrls }),
        };

        // Only update location if both longitude and latitude are provided
        const { longitude, latitude } = req.body;
        if (longitude !== undefined && latitude !== undefined) {
            const lon = parseFloat(longitude);
            const lat = parseFloat(latitude);

            if (isNaN(lon) || isNaN(lat) || lon < -180 || lon > 180 || lat < -90 || lat > 90) {
                res.status(400).json({ status: 'Error', message: 'Invalid longitude or latitude' });
            }

            updateData.location = { longitude: lon, latitude: lat };
        }

        const restaurant = await RestaurantService.updateRestaurant(req.params.id, updateData);
        res.status(200).json({ status: 'Success', data: { restaurant } });
    } catch (error: any) {
        res.status(error.message?.includes('not found') ? 404 : 400).json({ status: 'Error', message: error.message });
    }
};

// Get All Restaurants
const getAllRestaurants = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const restaurants = await RestaurantService.getAllRestaurants();
        res.status(200).json({
            status: 'Success',
            data: { restaurants }
        });
    } catch (error) {
        next(error);
    }
};

// Get Restaurant by ID
const getRestaurantById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const restaurant = await RestaurantService.getRestaurantById(req.params.id);
        res.status(200).json({
            status: 'Success',
            data: { restaurant }
        });
    } catch (error) {
        next(error);
    }
};

// Delete Restaurant
const deleteRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await RestaurantService.deleteRestaurant(req.params.id);
        res.status(200).json({
            status: 'Success',
            data: result
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createRestaurant,
    getAllRestaurants,
    getRestaurantById,
    updateRestaurant,
    deleteRestaurant
};
