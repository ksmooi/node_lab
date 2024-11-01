// npx ts-node src/demo/amqplib/request_reply/request.ts

import amqp, { Connection, Channel, ConsumeMessage } from 'amqplib';
import { v4 as uuidv4 } from 'uuid';
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
      console.log(' [*] Connected to RabbitMQ.');
    } catch (error: any) {
      console.error('Error initializing RabbitMQ:', error.message);
      process.exit(1);
    }
  }
  
  // Method to send a request message to a queue and wait for a response
  public async sendRequest(queue: string, message: string): Promise<string> {
    const correlationId = uuidv4(); // Generate a unique correlation ID for this request
    const replyQueue = await this.channel.assertQueue('', { exclusive: true }); // Create a temporary, exclusive queue for replies

    return new Promise((resolve, reject) => {
      // Set a timeout to reject the request if no response is received in 5 seconds
      const timer = setTimeout(() => {
        reject(new Error('Request timed out')); // Reject promise if timeout occurs
      }, 5000); // 5 seconds timeout

      // Consume messages from the reply queue (waiting for a response)
      this.channel.consume(
        replyQueue.queue, // The queue to consume from (the temporary reply queue)
        (msg: ConsumeMessage | null) => {
          // Check if the message has the correct correlation ID
          if (msg && msg.properties.correlationId === correlationId) {
            clearTimeout(timer); // Clear the timeout since a response was received
            resolve(msg.content.toString()); // Resolve the promise with the message content
          }
        },
        { noAck: true } // No manual acknowledgment required for the message
      ).then(() => {
        // Send the request message to the specified queue, along with the correlation ID and reply queue
        this.channel.sendToQueue(queue, Buffer.from(message), {
          correlationId: correlationId, // Attach correlation ID to the message
          replyTo: replyQueue.queue, // Attach the name of the reply queue for the server to send the response
        });
        console.log(` [x] Sent request '${message}' with Correlation ID: ${correlationId}`);
      }).catch((error) => {
        // Reject the promise if there's an error in consuming or sending the message
        reject(error);
      });
    });
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

const sendRequests = async () => {
  await rabbitMQService.initialize();

  const requests = [
    'add:5:3',
    'multiply:4:7',
    'subtract:10:4',
    'divide:20:5',
  ];

  for (const req of requests) {
    try {
      const response = await rabbitMQService.sendRequest('rpc_queue', req);
      console.log(` [.] Got response: ${response}`);
    } catch (error: any) {
      console.error(` [!] Error: ${error.message}`);
    }
  }

  rabbitMQService.close();
};

sendRequests();
