import express, { Request, Response, NextFunction } from 'express';
import controller from '../controllers/restaurantController';
import { authenticate, verifyRole } from '../middlewares/auth';  
//import upload from '../middlewares/upload';
import multer from 'multer';
const upload = multer({ dest: 'uploads/' });
const router = express.Router();

router.post(
    '/',
    //authenticate,
    //verifyRole(['restaurant_admin']),
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
    //authenticate,
    //verifyRole(['restaurant_admin']),
    controller.updateRestaurant
);

router.delete(
    '/:id',
    //authenticate,
    //verifyRole(['restaurant_admin']),
    controller.deleteRestaurant
);

// router.post(
//     '/',
//     upload.single('image'),
//     controller.createRestaurant
// );

// router.put(
//     '/:id',
//     upload.single('image'),
//     controller.updateRestaurant
// );

export default router;
