// npx ts-node src/demo/amqplib/topic_exchange/publisher.ts

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
      await this.channel.assertExchange('topic_logs', 'topic', {
        durable: false,
      });
      console.log(' [*] Connected to RabbitMQ and topic exchange asserted.');
    } catch (error: any) {
      console.error('Error initializing RabbitMQ:', error.message);
      process.exit(1);
    }
  }

  public async publishLog(routingKey: string, message: string): Promise<void> {
    try {
      this.channel.publish('topic_logs', routingKey, Buffer.from(message));
      console.log(` [x] Sent '${routingKey}':'${message}'`);
    } catch (error: any) {
      console.error('Error publishing log:', error.message);
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

const sendLogs = async () => {
  await rabbitMQService.initialize();

  // A topic exchange routes messages to queues based on a pattern-matching system using routing keys.
  // The routing key is a string of words separated by dots (e.g., auth.info, payment.error).
  // Consumers can subscribe to queues by binding them to specific routing key patterns using wildcards like * and #.
  // - * (star) matches exactly one word.
  // - # (hash) matches zero or more words.

  // In this case, the routing keys in the log messages (e.g., auth.info, payment.error) follow a pattern
  // that describes different types of events (authentication events, payment events) and their severity (info, warning, error).

  const logs = [
    { routingKey: 'auth.info', message: 'User logged in successfully.' },
    { routingKey: 'payment.warning', message: 'Payment processing delayed.' },
    { routingKey: 'auth.error', message: 'Failed login attempt detected.' },
    { routingKey: 'payment.error', message: 'Payment transaction failed.' },
  ];

  logs.forEach((log) => rabbitMQService.publishLog(log.routingKey, log.message));

  setTimeout(() => {
    rabbitMQService.close();
    process.exit(0);
  }, 500);
};

sendLogs();
