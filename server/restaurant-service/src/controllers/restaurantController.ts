import { Request, Response, NextFunction } from 'express';
import RestaurantService from '../services/restaurantService';

// Create Restaurant
const createRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const restaurant = await RestaurantService.createRestaurant(req.body);
        res.status(201).json({
            status: 'Success',
            data: { restaurant }
        });
    } catch (error) {
        next(error);
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

// Update Restaurant
const updateRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const restaurant = await RestaurantService.updateRestaurant(req.params.id, req.body);
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
