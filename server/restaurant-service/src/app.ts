import express from 'express';
import cors from 'cors';
import menuItemRouter from './routes/MenuItemRoutes';
import restaurantRouter from './routes/RestaurantRoutes';

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/restaurant', restaurantRouter);
app.use('/api/menu', menuItemRouter);

export default app;
