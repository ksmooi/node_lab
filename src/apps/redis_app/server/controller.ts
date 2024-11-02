import { Request, Response } from 'express';
import RedisService from './redisService';
import logger from './logger';

class Controller {
  private redisService: RedisService;

  constructor() {
    this.redisService = new RedisService();
  }

  // Create or Update a key
  public async setKey(req: Request, res: Response): Promise<void> {
    const { key, value } = req.body;
    if (!key || !value) {
      res.status(400).json({ message: 'Key and value are required.' });
      return;
    }

    try {
      await this.redisService.setKey(key, value);
      res.status(200).json({ message: `Key '${key}' set successfully.` });
    } catch (error: any) {
      logger.error('Error setting key:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Get a key's value
  public async getKey(req: Request, res: Response): Promise<void> {
    const { key } = req.params;
    if (!key) {
      res.status(400).json({ message: 'Key is required.' });
      return;
    }

    try {
      const value = await this.redisService.getKey(key);
      if (value === null) {
        res.status(404).json({ message: `Key '${key}' not found.` });
      } else {
        res.status(200).json({ key, value });
      }
    } catch (error: any) {
      logger.error('Error getting key:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Delete a key
  public async deleteKey(req: Request, res: Response): Promise<void> {
    const { key } = req.params;
    if (!key) {
      res.status(400).json({ message: 'Key is required.' });
      return;
    }

    try {
      const result = await this.redisService.deleteKey(key);
      if (result === 0) {
        res.status(404).json({ message: `Key '${key}' not found.` });
      } else {
        res.status(200).json({ message: `Key '${key}' deleted successfully.` });
      }
    } catch (error: any) {
      logger.error('Error deleting key:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Get all keys
  public async getAllKeys(req: Request, res: Response): Promise<void> {
    try {
      const keys = await this.redisService.getAllKeys();
      res.status(200).json({ keys });
    } catch (error: any) {
      logger.error('Error getting all keys:', error);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default Controller;
