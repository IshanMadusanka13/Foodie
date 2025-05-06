import app from './app';
import dotenv from 'dotenv';
import { connectRabbitMQ } from './config/rabbitmq';

dotenv.config();

const PORT = process.env.PORT;
const RABBITMQ_URI = process.env.RABBITMQ_URI || "amqp://localhost";

connectRabbitMQ(RABBITMQ_URI).then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
});
