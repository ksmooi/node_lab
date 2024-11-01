// npx ts-node src/demo/amqplib/pub_sub/publisher.ts

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

      // Assert (declare) a 'fanout' exchange named 'logs', with durable set to false (non-persistent)
      await this.channel.assertExchange('logs', 'fanout', {
        durable: false, // Since this is a logging system, messages are transient and don't need to survive a RabbitMQ restart
      });

      console.log(' [*] Connected to RabbitMQ and exchange asserted.');
    } catch (error) {
      console.error('Error initializing RabbitMQ:', error);
      process.exit(1);
    }
  }

  public async publishLog(message: string): Promise<void> {
    try {
      // Publish the message to the 'logs' exchange
      // The second argument is the routing key, which is ignored by 'fanout' exchanges (hence empty string '')
      // NOTE: In a fanout exchange, the routing key has no effect.
      // Buffer.from(message) converts the message (which is typically a string) into a Buffer.
      this.channel.publish('logs', '', Buffer.from(message));

      console.log(` [x] Sent '${message}'`);
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
    'Log Entry 1: User login',
    'Log Entry 2: File uploaded',
    'Log Entry 3: Error encountered',
  ];

  logs.forEach((log) => rabbitMQService.publishLog(log));

  setTimeout(() => {
    rabbitMQService.close();
    process.exit(0);
  }, 500);
};

sendLogs();
