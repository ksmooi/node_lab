// npx ts-node src/demo/amqplib/direct_exchange/subscriber.ts

import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';

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
      this.connection = await amqp.connect('amqp://app_user:app_pwd@192.168.1.150:5672');
      this.channel = await this.connection.createChannel();
      await this.channel.assertExchange('direct_logs', 'direct', {
        durable: false,
      });
      console.log(' [*] Connected to RabbitMQ and exchange asserted.');
    } catch (error) {
      console.error('Error initializing RabbitMQ:', error);
      process.exit(1);
    }
  }

  public async subscribe(subscriberName: string, severity: string): Promise<void> {
    try {
      const q = await this.channel.assertQueue('', { exclusive: true });
      await this.channel.bindQueue(q.queue, 'direct_logs', severity);

      console.log(` [*] ${subscriberName} waiting for '${severity}' logs. To exit press CTRL+C`);

      this.channel.consume(
        q.queue,
        (msg: ConsumeMessage | null) => {
          if (msg) {
            const log = msg.content.toString();
            console.log(` [x] ${subscriberName} received '${msg.fields.routingKey}':'${log}'`);
          }
        },
        { noAck: true } // No need for acknowledgments since logs are transient
      );
    } catch (error) {
      console.error('Error subscribing to logs:', error);
    }
  }

  public async close(): Promise<void> {
    try {
      await this.channel.close();
      await this.connection.close();
      console.log(' [*] RabbitMQ connection closed.');
    } catch (error) {
      console.error('Error closing RabbitMQ connection:', error);
    }
  }
}

const rabbitMQService = RabbitMQService.getInstance();

const startSubscribers = async () => {
  await rabbitMQService.initialize();

  const subscribers = [
    { name: 'InfoLogger', severity: 'info' },
    { name: 'WarningLogger', severity: 'warning' },
    { name: 'ErrorLogger', severity: 'error' },
  ];

  subscribers.forEach((subscriber) => {
    rabbitMQService.subscribe(subscriber.name, subscriber.severity);
  });

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log(' [*] Caught interrupt signal. Closing connection.');
    await rabbitMQService.close();
    process.exit(0);
  });
};

startSubscribers();
