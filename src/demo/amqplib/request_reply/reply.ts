// npx ts-node src/demo/amqplib/request_reply/reply.ts

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
      await this.channel.assertQueue('rpc_queue', { durable: false });
      this.channel.prefetch(1);
      console.log(' [*] Connected to RabbitMQ and rpc_queue asserted.');
    } catch (error: any) {
      console.error('Error initializing RabbitMQ:', error.message);
      process.exit(1);
    }
  }

  // Method to start listening and responding to RPC requests
  public async startResponder(): Promise<void> {
    // Start consuming messages from 'rpc_queue'
    this.channel.consume(
      'rpc_queue',
      async (msg: ConsumeMessage | null) => {
        if (msg) {
          // Extract and parse the message content (e.g., 'add:5:3')
          const content = msg.content.toString();
          console.log(` [x] Received request: '${content}'`);

          // Split the message content into an operation and two numbers
          const [operation, num1Str, num2Str] = content.split(':');
          const num1 = parseFloat(num1Str); // First number (e.g., 5)
          const num2 = parseFloat(num2Str); // Second number (e.g., 3)
          let result: number | string; // Variable to store the result

          // Perform the requested operation
          switch (operation) {
            case 'add':
              result = num1 + num2; // Addition
              break;
            case 'subtract':
              result = num1 - num2; // Subtraction
              break;
            case 'multiply':
              result = num1 * num2; // Multiplication
              break;
            case 'divide':
              result = num2 !== 0 ? num1 / num2 : 'Error: Division by zero'; // Division, with zero check
              break;
            default:
              result = 'Error: Unknown operation'; // Handle unknown operations
          }

          // Send the result back to the client using the 'replyTo' queue and correlation ID
          this.channel.sendToQueue(
            msg.properties.replyTo!, // The reply queue provided by the client
            Buffer.from(result.toString()), // Convert the result to a string and buffer
            { correlationId: msg.properties.correlationId } // Attach the correlation ID so the client knows the response matches their request
          );

          console.log(` [x] Sent response: '${result}'`);

          // Acknowledge that the message has been processed successfully
          this.channel.ack(msg);
        }
      },
      { noAck: false } // Enable manual acknowledgment so the message is acknowledged after processing
    );

    console.log(' [*] Awaiting RPC requests. To exit press CTRL+C');
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

const startResponder = async () => {
  await rabbitMQService.initialize();
  await rabbitMQService.startResponder();

  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log(' [*] Caught interrupt signal. Closing connection.');
    await rabbitMQService.close();
    process.exit(0);
  });
};

startResponder();
