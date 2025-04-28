import app from './app';
import dotenv from 'dotenv';
import connectDB from './config/db';
import { connectRabbitMQ } from './config/rabbitmq';

dotenv.config();

const PORT = process.env.PORT;
const MONGO_URI = process.env.MONGO_URI || "";
const RABBITMQ_URI = process.env.RABBITMQ_URI || "amqp://localhost";

connectDB(MONGO_URI).then(() => {
  connectRabbitMQ(RABBITMQ_URI).then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
});
