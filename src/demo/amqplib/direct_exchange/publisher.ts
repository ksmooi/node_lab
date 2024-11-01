// npx ts-node src/demo/amqplib/direct_exchange/publisher.ts

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
      await this.channel.assertExchange('direct_logs', 'direct', {
        durable: false, // Non-durable since logs are transient
      });
      console.log(' [*] Connected to RabbitMQ and exchange asserted.');
    } catch (error) {
      console.error('Error initializing RabbitMQ:', error);
      process.exit(1);
    }
  }

  public async publishLog(severity: string, message: string): Promise<void> {
    try {
      this.channel.publish('direct_logs', severity, Buffer.from(message));
      console.log(` [x] Sent '${severity}':'${message}'`);
    } catch (error) {
      console.error('Error publishing log:', error);
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

const sendLogs = async () => {
  await rabbitMQService.initialize();

  const logs = [
    { severity: 'info', message: 'User signed in' },
    { severity: 'warning', message: 'Disk space low' },
    { severity: 'error', message: 'Unhandled exception occurred' },
  ];

  logs.forEach((log) => rabbitMQService.publishLog(log.severity, log.message));

  setTimeout(() => {
    rabbitMQService.close();
    process.exit(0);
  }, 500);
};

sendLogs();
