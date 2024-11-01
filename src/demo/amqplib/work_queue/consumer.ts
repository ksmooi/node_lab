// npx ts-node src/demo/amqplib/work_queue/consumer.ts

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
      await this.channel.assertQueue('task_queue', {
        durable: true,
      });
      this.channel.prefetch(1); // Fair dispatch
      console.log(' [*] Connected to RabbitMQ and queue asserted.');
    } catch (error) {
      console.error('Error initializing RabbitMQ:', error);
      process.exit(1);
    }
  }

  public async consumeTasks(): Promise<void> {
    try {
      this.channel.consume(
        'task_queue',
        async (msg: ConsumeMessage | null) => {
          if (msg) {
            const task = msg.content.toString();
            console.log(` [x] Received '${task}'`);
            await this.processTask(task);
            this.channel.ack(msg);
          }
        },
        { noAck: false }
      );
      console.log(' [*] Waiting for messages in task_queue. To exit press CTRL+C');
    } catch (error) {
      console.error('Error consuming tasks:', error);
    }
  }

  private async processTask(task: string): Promise<void> {
    // Simulate task processing time based on the number of words
    const processingTime = task.split(' ').length * 500;
    return new Promise((resolve) => {
      setTimeout(() => {
        console.log(` [x] Done processing '${task}'`);
        resolve();
      }, processingTime);
    });
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

const startConsumer = async () => {
  await rabbitMQService.initialize();
  await rabbitMQService.consumeTasks();

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log(' [*] Caught interrupt signal. Closing connection.');
    await rabbitMQService.close();
    process.exit(0);
  });
};

startConsumer();
