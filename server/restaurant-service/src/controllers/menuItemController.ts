import { Request, Response, NextFunction } from 'express';
import MenuItemService from '../services/menuItemService';
import MenuItem from '../models/MenuItem';
import { uploadImagesToSupabase } from '../utils/supabaseUpload';

interface MulterRequest extends Request {
    files?: Express.Multer.File[] | { [fieldname: string]: Express.Multer.File[] };
}

const createMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const price = parseFloat(req.body.price);
        if (isNaN(price) || price < 0) {
            res.status(400).json({ status: 'Error', message: 'Invalid price. Price must be a number ≥ 0.' });
        }

        const files = req.files as Express.Multer.File[];
        const imageUrls = files ? await uploadImagesToSupabase(files, 'menu-items') : [];

        const menuItem = await MenuItemService.createMenuItem({
            ...req.body,
            price,
            imageUrls
        });

        res.status(201).json({ status: 'Success', data: { menuItem } });
    } catch (error: any) {
        res.status(400).json({ status: 'Error', message: error.message });
    }
};

const updateMenuItem = async (req: Request, res: Response): Promise<void> => {
    try {
        const price = parseFloat(req.body.price);
        if (!isNaN(price) && price < 0) {
            res.status(400).json({ status: 'Error', message: 'Invalid price. Price must be ≥ 0.' });
        }

        const files = req.files as Express.Multer.File[];
        const imageUrls = files && Array.isArray(files) && files.length
            ? await uploadImagesToSupabase(files, 'menu-items')
            : undefined;

        const item = await MenuItemService.updateMenuItem(req.params.id, {
            ...req.body,
            ...(imageUrls && { imageUrls }),
        });

        res.status(200).json({ status: 'Success', data: { item } });
    } catch (error: any) {
        res.status(error.message?.includes('not found') ? 404 : 400).json({ status: 'Error', message: error.message });
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

const getMenuItemsByCategory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
        const { category } = req.query;
        console.log("Category being queried:", category);

        if (!category || typeof category !== 'string') {
            res.status(400).json({ status: 'Error', message: 'Category is required' });
            return;
        }
        const items = await MenuItemService.getMenuItemsByCategory(category);
        console.log("Found items:", items); 
        res.status(200).json({ status: 'Success', data: { items } });
    } catch (error) {
        next(error);
    }
};

const getMenuItemById = async (req: Request, res: Response): Promise<void> => {
    try {
        const item = await MenuItemService.getMenuItemById(req.params.id);
        if (!item) {
            res.status(404).json({ status: 'Error', message: 'Menu item not found' });
            return;
        }
        res.status(200).json({ status: 'Success', data: { item } });
    } catch (error) {
        res.status(400).json({ status: 'Error', message: 'Invalid ID format' });
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

        const imageUrls = await uploadImagesToSupabase(files, 'menu-items');

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
    getMenuItemById,
    getMenuItemsByCategory,
    updateMenuItem,
    deleteMenuItem,
    getPaginatedMenuItems,
    uploadMultipleImages
};
