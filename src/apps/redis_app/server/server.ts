// npx ts-node src/apps/redis_app/server/server.ts
// create file `APP_HOME/.env`
//   REDIS_HOST=127.0.0.1
//   REDIS_PORT=6379
//   REDIS_PASSWORD=secret
//   REDIS_APP_SERVER_PORT=5000

import express, { Application, Request, Response, NextFunction } from 'express';
import Routes from './routes';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './errorHandler'; // Import the error handler

dotenv.config();

class Server {
  public app: Application;
  private PORT: number;

  constructor() {
    this.app = express();
    this.PORT = Number(process.env.REDIS_APP_SERVER_PORT) || 5000;
    this.middleware();
    this.routes();
    this.errorHandling();
  }

  private middleware(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private routes(): void {
    this.app.use('/api/redis', Routes);

    // Health Check Route
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'UP' });
    });
  }

  private errorHandling(): void {
    this.app.use(errorHandler); // Use the error handler middleware
  }

  public listen(): void {
    this.app.listen(this.PORT, () => {
      console.log(`Server is running on port ${this.PORT}`);
    });
  }
}

const server = new Server();
server.listen();
