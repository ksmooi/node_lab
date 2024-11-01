// npx ts-node src/demo/amqplib/exchange_exchange/exchange_publisher.ts

import amqp, { Connection, Channel } from 'amqplib';
import dotenv from 'dotenv';

dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL || 'amqp://app_user:app_pwd@192.168.1.150:5672';

class RabbitMQService {
  private static instance: RabbitMQService;
  private connection!: Connection;
  private channel!: Channel;

  private constructor() {}

  public static getInstance(): RabbitMQService {
    if (!RabbitMQService.instance) {
      RabbitMQService.instance = new RabbitMQService();
    }
    return RabbitMQService.instance;
  }

  public async initialize(): Promise<void> {
    try {
      this.connection = await amqp.connect(RABBITMQ_URL);
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange('exchange_a', 'topic', { durable: true });
      console.log(' [*] Connected to RabbitMQ and topic exchange asserted.');
    } catch (error: any) {
      console.error('Error initializing RabbitMQ:', error.message);
      process.exit(1);
    }
  }

  public async publishMessage(routingKey: string, message: string): Promise<void> {
    try {
      this.channel.publish('exchange_a', routingKey, Buffer.from(message), { persistent: true });
      console.log(` [x] Sent '${routingKey}':'${message}'`);
    } catch (error: any) {
      console.error('Error publishing message:', error.message);
    }
  }

  public async close(): Promise<void> {
    try {
      await this.channel.close();
      await this.connection.close();
      console.log(' [*] RabbitMQ connection closed.');
    } catch (error: any) {
      console.error('Error closing RabbitMQ connection:', error.message);
    }
  }
}

const rabbitMQService = RabbitMQService.getInstance();

const publishMessages = async () => {
  await rabbitMQService.initialize();

  const messages = [
    { routingKey: 'route.alpha', message: 'Message to Alpha' },
    { routingKey: 'route.beta', message: 'Message to Beta' },
    { routingKey: 'route.gamma', message: 'Message to Gamma' },
    { routingKey: 'other.delta', message: 'Message to Delta (should not be routed)' },
  ];

  messages.forEach((msg) => rabbitMQService.publishMessage(msg.routingKey, msg.message));

  setTimeout(() => {
    rabbitMQService.close();
    process.exit(0);
  }, 500);
};

publishMessages();
