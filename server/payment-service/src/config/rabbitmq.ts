import * as amqplib from 'amqplib';
import logger from './logger';

interface CustomConnection {
  createChannel(): Promise<CustomChannel>;
  close(): Promise<void>;
}

interface CustomChannel {
  assertQueue(queue: string, options?: any): Promise<any>;
  sendToQueue(queue: string, content: Buffer, options?: any): boolean;
  consume(queue: string, onMessage: (msg: any) => void, options?: any): Promise<any>;
  ack(message: any, allUpTo?: boolean): void;
  nack(message: any, allUpTo?: boolean, requeue?: boolean): void;
  close(): Promise<void>;
}

let connection: CustomConnection | null = null;
let channel: CustomChannel | null = null;

export const connectRabbitMQ = async (url: string): Promise<void> => {
  try {
    logger.info(`Attempting to connect to RabbitMQ at: ${url}`);
    connection = await amqplib.connect(url);
    
    if (connection) {
      logger.info('RabbitMQ connection established, creating channel');
      channel = await connection.createChannel();
      
      if (channel) {
        logger.info('Channel created, asserting queues');
        await channel.assertQueue('online_payment', { durable: true });
        
        logger.info('✅ RabbitMQ connected and queues asserted');
      }
    }
  } catch (error) {
    logger.error('❌ RabbitMQ connection failed:', error);
    if (error instanceof Error) {
      logger.error(`Error name: ${error.name}`);
      logger.error(`Error message: ${error.message}`);
      logger.error(`Error stack: ${error.stack}`);
    }
    process.exit(1);
  }
};

export const getChannel = (): CustomChannel => {
  if (!channel) {
    throw new Error('RabbitMQ channel not initialized');
  }
  return channel;
};

export const publishMessage = async (queue: string, message: any): Promise<void> => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    
    channel.sendToQueue(queue, Buffer.from(JSON.stringify(message)), {
      persistent: true
    });
    
    logger.info(`Message published to queue: ${queue}`);
  } catch (error) {
    logger.error(`Error publishing message to queue ${queue}:`, error);
    throw error;
  }
};

export const consumeMessages = async (
  queue: string, 
  callback: (message: any) => Promise<void>
): Promise<void> => {
  try {
    if (!channel) {
      throw new Error('RabbitMQ channel not initialized');
    }
    
    channel.consume(queue, async (msg) => {
      if (msg) {
        try {
          const content = JSON.parse(msg.content.toString());
          await callback(content);
          channel?.ack(msg);
        } catch (error) {
          logger.error(`Error processing message from queue ${queue}:`, error);
          channel?.nack(msg);
        }
      }
    });
    
    logger.info(`Consumer registered for queue: ${queue}`);
  } catch (error) {
    logger.error(`Error consuming messages from queue ${queue}:`, error);
    throw error;
  }
};