import { Request, Response, NextFunction } from 'express';
import logger from './logger';

const errorHandler = (err: any, req: Request, res: Response, next: NextFunction) => {
  logger.error(`Unhandled Error: ${err.message}`, { stack: err.stack });
  res.status(500).json({ message: 'An unexpected error occurred.' });
};

export default errorHandler;
