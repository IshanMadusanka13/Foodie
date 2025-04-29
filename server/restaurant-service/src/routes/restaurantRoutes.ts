import express, { Request, Response, NextFunction } from 'express';
import controller from '../controllers/restaurantController';
//import { authenticate, verifyRole } from '../middlewares/auth';  
import upload from '../middlewares/upload';

const router = express.Router();

router.get(
    '/',
    controller.getAllRestaurants
);

router.get(
    '/:id',
    controller.getRestaurantById
);

router.delete(
    '/:id',
    // authenticate,
    // verifyRole(['admin']),
    controller.deleteRestaurant
);

router.post(
    '/',
    upload.single('image'),
    controller.createRestaurant
);

router.put(
    '/:id',
    // authenticate,
    // verifyRole(['admin']),
    upload.single('image'),
    controller.updateRestaurant
);

export default router;
