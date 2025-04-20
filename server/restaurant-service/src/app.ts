import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

// Import the routes
import restaurantRouter from './routes/restaurantRoutes';
import menuItemRoutes from './routes/menuItemRoutes';
import userRouter from './routes/UserRouter';

dotenv.config(); // Load environment variables from .env file

// Create an instance of express
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Example test route
app.get('/', (req, res) => {
    res.send('Restaurant service is running');
});

// Use the imported routes
app.use('/api/restaurant', restaurantRouter);
app.use('/api/users', userRouter);
app.use('/api/menu-items', menuItemRoutes);
app.use('/uploads', express.static('uploads'));

export default app;
