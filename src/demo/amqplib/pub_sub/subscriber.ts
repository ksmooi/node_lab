// npx ts-node src/demo/amqplib/pub_sub/subscriber.ts

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
      await this.channel.assertExchange('logs', 'fanout', {
        durable: false,
      });
      console.log(' [*] Connected to RabbitMQ and exchange asserted.');
    } catch (error) {
      console.error('Error initializing RabbitMQ:', error);
      process.exit(1);
    }
  }

  // Method to subscribe a consumer (subscriber) to the 'logs' exchange
  public async subscribe(subscriberName: string): Promise<void> {
    try {
      // Create a queue with a random name ('') and set it to be exclusive (auto-deleted the queue when connection closes)
      // Exclusive queues are often used in scenarios where each consumer requires its own private, temporary queue,
      // such as in a fanout or topic exchange pattern, or in RPC-style communication where each request needs a unique reply queue.
      const q = await this.channel.assertQueue('', { exclusive: true });

      // Bind the newly created queue to the 'logs' exchange
      // In a fanout exchange, the routing key is ignored (hence the empty string ''). 
      // The fanout exchange simply delivers all messages to every queue bound to it, so the routing key is irrelevant in this context.
      this.channel.bindQueue(q.queue, 'logs', '');

      console.log(` [*] ${subscriberName} waiting for logs. To exit press CTRL+C`);

      // Consume messages from the queue
      this.channel.consume(
        q.queue,
        (msg: ConsumeMessage | null) => {
          if (msg) {
            // When a message arrives, print it with the subscriber's name
            const log = msg.content.toString();
            console.log(` [x] ${subscriberName} received '${log}'`);
          }
        },
        { noAck: true } // noAck: true means RabbitMQ doesn't wait for an acknowledgment of message reception (no guarantee that messages are processed)
      );
    } catch (error) {
      // Log any error during subscription
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

  const subscribers = ['Subscriber 1', 'Subscriber 2', 'Subscriber 3'];

  subscribers.forEach((name) => rabbitMQService.subscribe(name));

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log(' [*] Caught interrupt signal. Closing connection.');
    await rabbitMQService.close();
    process.exit(0);
  });
};

startSubscribers();
