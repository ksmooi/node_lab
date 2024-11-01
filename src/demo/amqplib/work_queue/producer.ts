// npx ts-node src/demo/amqplib/work_queue/producer.ts

import amqp, { Connection, Channel } from 'amqplib';

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
        durable: true, // Ensure queue survives RabbitMQ restarts
      });
      console.log(' [*] Connected to RabbitMQ and queue asserted.');
    } catch (error) {
      console.error('Error initializing RabbitMQ:', error);
      process.exit(1);
    }
  }

  public async sendTask(task: string): Promise<void> {
    try {
      this.channel.sendToQueue('task_queue', Buffer.from(task), {
        persistent: true, // Ensure message survives RabbitMQ restarts
      });
      console.log(` [x] Sent '${task}'`);
    } catch (error) {
      console.error('Error sending task:', error);
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

const sendTasks = async () => {
  await rabbitMQService.initialize();

  const tasks = [
    'Task 1: Process image',
    'Task 2: Generate report',
    'Task 3: Send email',
  ];

  tasks.forEach((task) => rabbitMQService.sendTask(task));

  setTimeout(() => {
    rabbitMQService.close();
    process.exit(0);
  }, 500);
};

sendTasks();
