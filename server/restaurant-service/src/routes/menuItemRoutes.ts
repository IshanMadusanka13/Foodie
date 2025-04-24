import express from 'express';
import controller from '../controllers/menuItemController';
import { authenticate, verifyRole } from '../middlewares/auth'; 
import upload from '../middlewares/upload';

const router = express.Router();

router.post(
    '/',
    //authenticate,
    //verifyRole(['restaurant_admin']),
    upload.array('images'),
    controller.createMenuItem
);

router.get(
    '/restaurant/:restaurantId',
    controller.getMenuItemsByRestaurant
);

router.put(
    '/:id',
    //authenticate,
    //verifyRole(['restaurant_admin']),
    upload.array('images'),
    controller.updateMenuItem
);

router.delete(
    '/:id',
    //authenticate,
    //verifyRole(['restaurant_admin']),
    controller.deleteMenuItem
);

router.get(
    '/restaurant/:restaurantId/paginated',
    controller.getPaginatedMenuItems
);

router.post(
    '/upload-multiple',
    //authenticate,
    //verifyRole(['restaurant_admin']),
    upload.array('images'),
    controller.uploadMultipleImages
);

router.get(
    '/all',
    //authenticate,
    //verifyRole(['admin']),
    controller.getAllMenuItems
);

export default router;
