import express from 'express';
import http from 'http';
import cors from 'cors';
import dotenv from 'dotenv';
import connectDB from './config/db';
import notificationRoutes from './routes/notificationRoutes';
import { initializeSocket } from './app';

dotenv.config();
connectDB();

const app = express();
const server = http.createServer(app);
const io = initializeSocket(server);
app.set('io', io);

app.use(cors());
app.use(express.json());
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));