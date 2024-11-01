// npx ts-node src/demo/amqplib/topic_exchange/subscriber.ts

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
      await this.channel.assertExchange('topic_logs', 'topic', {
        durable: false,
      });
      console.log(' [*] Connected to RabbitMQ and topic exchange asserted.');
    } catch (error: any) {
      console.error('Error initializing RabbitMQ:', error.message);
      process.exit(1);
    }
  }

  public async subscribe(bindingKeys: string[], subscriberName: string): Promise<void> {
    try {
      const q = await this.channel.assertQueue('', { exclusive: true });

      bindingKeys.forEach((key) => {
        this.channel.bindQueue(q.queue, 'topic_logs', key);
      });

      console.log(` [*] ${subscriberName} waiting for logs with bindings: ${bindingKeys.join(', ')}. To exit press CTRL+C`);

      this.channel.consume(
        q.queue,
        (msg: ConsumeMessage | null) => {
          if (msg) {
            const routingKey = msg.fields.routingKey;
            const message = msg.content.toString();
            console.log(` [x] ${subscriberName} received '${routingKey}':'${message}'`);
          }
        },
        { noAck: true }
      );
    } catch (error: any) {
      console.error('Error subscribing to logs:', error.message);
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

  // The subscribers array defines different services (or consumers) that will listen for messages.
  // Each entry in the array has a name (representing the service or consumer) and
  // bindings (which are the routing key patterns that the subscriber is interested in).

  const subscribers = [
    { name: 'AuthService', bindings: ['auth.*'] },
    { name: 'PaymentService', bindings: ['payment.*'] },
    { name: 'AllLogs', bindings: ['#.info', 'auth.error', 'payment.error'] },
  ];

  subscribers.forEach((subscriber) => {
    rabbitMQService.subscribe(subscriber.bindings, subscriber.name);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log(' [*] Caught interrupt signal. Closing connection.');
    await rabbitMQService.close();
    process.exit(0);
  });
};

startSubscribers();
