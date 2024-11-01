// npx ts-node src/demo/amqplib/exchange_exchange/exchange_subscriber.ts

import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';
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

      // Assert Durable Exchanges
      await this.channel.assertExchange('exchange_a', 'topic', { durable: true });
      await this.channel.assertExchange('exchange_b', 'direct', { durable: true });

      // Bind Exchange A to Exchange B with routing key 'route.#'
      await this.channel.bindExchange('exchange_a', 'exchange_b', 'route.#');

      // Assert Durable Queues and Bind to Exchange B
      await this.channel.assertQueue('alpha_queue', { durable: true });
      await this.channel.assertQueue('beta_queue', { durable: true });

      await this.channel.bindQueue('alpha_queue', 'exchange_b', 'route.alpha');
      await this.channel.bindQueue('beta_queue', 'exchange_b', 'route.beta');

      console.log(' [*] Connected to RabbitMQ, exchanges and queues asserted.');
    } catch (error: any) {
      console.error('Error initializing RabbitMQ:', error.message);
      process.exit(1);
    }
  }

  public async startSubscriber(queue: string, subscriberName: string): Promise<void> {
    try {
      this.channel.consume(
        queue,
        (msg: ConsumeMessage | null) => {
          if (msg) {
            const routingKey = msg.fields.routingKey;
            const message = msg.content.toString();
            console.log(` [x] ${subscriberName} received '${routingKey}':'${message}'`);
          }
        },
        { noAck: true }
      );

      console.log(` [*] ${subscriberName} waiting for messages in '${queue}'. To exit press CTRL+C`);
    } catch (error: any) {
      console.error('Error starting subscriber:', error.message);
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

const startSubscribers = async () => {
  await rabbitMQService.initialize();

  const subscribers = [
    { queue: 'alpha_queue', name: 'AlphaSubscriber' },
    { queue: 'beta_queue', name: 'BetaSubscriber' },
  ];

  subscribers.forEach((sub) => {
    rabbitMQService.startSubscriber(sub.queue, sub.name);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log(' [*] Caught interrupt signal. Closing connection.');
    await rabbitMQService.close();
    process.exit(0);
  });
};

startSubscribers();
