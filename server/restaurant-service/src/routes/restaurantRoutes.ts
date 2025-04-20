import express, { Request, Response, NextFunction } from 'express';
import controller from '../controllers/restaurantController';
import { authenticate, verifyRole } from '../middlewares/auth';  

const router = express.Router();

router.post(
    '/',
    authenticate,
    verifyRole(['restaurant_admin']),
    controller.createRestaurant
);

router.get(
    '/',
    controller.getAllRestaurants
);

router.get(
    '/:id',
    controller.getRestaurantById
);

router.put(
    '/:id',
    authenticate,
    verifyRole(['restaurant_admin']),
    controller.updateRestaurant
);

router.delete(
    '/:id',
    authenticate,
    verifyRole(['restaurant_admin']),
    controller.deleteRestaurant
);

export default router;
