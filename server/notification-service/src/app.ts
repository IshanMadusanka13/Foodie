import express from 'express';
import cors from 'cors';
import http from 'http';
import { Server } from 'socket.io';
import dotenv from 'dotenv';
import notificationRoutes from './routes/notificationRoutes';

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
    cors: { origin: "*"}
});

app.use(cors());
app.use(express.json());

app.use('/api/notifications', notificationRoutes);

io.on('connection', (socket) => {
    console.log('Client connected:', socket.id);

    socket.on('newOrder', (data) => {
        socket.broadcast.emit('orderUpdate', data);
    });
});

export default app;
