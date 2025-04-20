import { Request, Response, NextFunction } from 'express';
import MenuItemService from '../services/menuItemService';
import MenuItem from '../models/MenuItem';

interface MulterRequest extends Request {
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

const createMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const menuItem = await MenuItemService.createMenuItem(req.body);
        res.status(201).json({ status: 'Success', data: { menuItem } });
    } catch (error) {
        next(error); 
    }
};

const getMenuItemsByRestaurant = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { available, category } = req.query;

        const filters: Record<string, any> = {};
        if (available) filters.isAvailable = available === 'true';
        if (category) filters.category = category;

        const items = await MenuItemService.getMenuItemsByRestaurant(req.params.restaurantId, filters);
        res.status(200).json({ status: 'Success', data: { items } });
    } catch (error) {
        next(error);
    }
};

const getAllMenuItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const items = await MenuItem.find().populate('restaurantId', 'name address');
        res.status(200).json({ status: 'Success', data: { items } });
    } catch (error) {
        next(error);
    }
};

const updateMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const item = await MenuItemService.updateMenuItem(req.params.id, req.body);
        res.status(200).json({ status: 'Success', data: { item } });
    } catch (error) {
        next(error);
    }
};


const deleteMenuItem = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const result = await MenuItemService.deleteMenuItem(req.params.id);
        res.status(200).json({ status: 'Success', data: { result } });
    } catch (error) {
        next(error);
    }
};

const getPaginatedMenuItems = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {

        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const search = (req.query.search as string) || "";

        const { available, category} = req.query;

        const filters: Record<string, any> = {};
        if (available) filters.isAvailable = available === 'true';
        if (category) filters.category = category;

        const result = await MenuItemService.getPaginatedMenuItems(
            req.params.restaurantId,
            filters,
            page,
            limit,
            search || ""
        );

        res.status(200).json({ status: 'Success', data: result });

    } catch (error) {
        next(error);
    }
};

const uploadMultipleImages = async (req: MulterRequest, res: Response, next: NextFunction): Promise<void> => {
    try {
        const files = req.files as Express.Multer.File[];

        if (!files || !Array.isArray(files) || files.length === 0) {
            res.status(400).json({ error: 'No images uploaded' });
            return;
        }

        const imageUrls = files.map((file) => `/uploads/${file.filename}`);

        res.status(200).json({
            message: 'Images uploaded successfully',
            imageUrls
        });
    } catch (error) {
        next(error);
    }
};

export default {
    createMenuItem,
    getMenuItemsByRestaurant,
    getAllMenuItems,
    updateMenuItem,
    deleteMenuItem,
    getPaginatedMenuItems,
    uploadMultipleImages
};
