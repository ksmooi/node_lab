// npx ts-node src/apps/mysql_app/server/server.ts

// create .env file
//   MYSQL_HOST=localhost
//   MYSQL_PORT=3306
//   MYSQL_USER=app_user
//   MYSQL_PASSWORD=app_pwd
//   MYSQL_DATABASE=app_db
//   MYSQL_APP_SERVER_PORT=5000

import express, { Application, Request, Response, NextFunction } from 'express';
import Routes from './routes';
import cors from 'cors';
import dotenv from 'dotenv';
import errorHandler from './errorHandler';
import logger from './logger';
import DatabaseService from './databaseService';

dotenv.config();

class Server {
  public app: Application;
  private PORT: number;
  private dbService: DatabaseService;

  constructor() {
    this.app = express();
    this.PORT = Number(process.env.MYSQL_APP_SERVER_PORT) || 5000;
    this.dbService = new DatabaseService();
    this.middleware();
    this.routes();
    this.errorHandling();
  }

  private middleware(): void {
    this.app.use(express.json());
    this.app.use(cors());
  }

  private routes(): void {
    this.app.use('/api', Routes);

    // Health Check Route
    this.app.get('/health', (req: Request, res: Response) => {
      res.status(200).json({ status: 'UP' });
    });
  }

  private errorHandling(): void {
    this.app.use(errorHandler);
  }

  public listen(): void {
    const server = this.app.listen(this.PORT, () => {
      logger.info(`Server is running on port ${this.PORT}`);
    });

    // Handle graceful shutdown
    const gracefulShutdown = () => {
      logger.info('Shutting down gracefully...');
      server.close(async () => {
        logger.info('HTTP server closed.');
        await this.dbService.closePool();
        process.exit(0);
      });
    };

    process.on('SIGTERM', gracefulShutdown);
    process.on('SIGINT', gracefulShutdown);
  }
}

const server = new Server();
server.listen();
