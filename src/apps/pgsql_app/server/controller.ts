import { Request, Response } from 'express';
import DatabaseService from './databaseService';
import logger from './logger';

class Controller {
  private dbService: DatabaseService;

  constructor() {
    this.dbService = new DatabaseService();
  }

  // Create a new user
  public async createUser(req: Request, res: Response): Promise<void> {
    const { name, email, age } = req.body;

    if (!name || !email || age === undefined) {
      res.status(400).json({ message: 'Name, email, and age are required.' });
      return;
    }

    try {
      await this.dbService.createUser(name, email, age);
      logger.info(`User created: ${name}, ${email}, ${age}`);
      res.status(201).json({ message: 'User created successfully.' });
    } catch (error: any) {
      logger.error(`Error creating user: ${error.message}`);
      if (error.code === '23505') { // Unique violation
        res.status(409).json({ message: 'Email already exists.' });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }

  // Get a user by ID
  public async getUserById(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID.' });
      return;
    }

    try {
      const user = await this.dbService.getUserById(id);
      if (!user) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }
      res.status(200).json(user);
    } catch (error: any) {
      logger.error(`Error fetching user by ID: ${error.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Get all users
  public async getAllUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await this.dbService.getAllUsers();
      res.status(200).json(users);
    } catch (error: any) {
      logger.error(`Error fetching all users: ${error.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }

  // Update a user
  public async updateUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);
    const { name, email, age } = req.body;

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID.' });
      return;
    }

    if (!name || !email || age === undefined) {
      res.status(400).json({ message: 'Name, email, and age are required.' });
      return;
    }

    try {
      const existingUser = await this.dbService.getUserById(id);
      if (!existingUser) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }

      await this.dbService.updateUser(id, name, email, age);
      logger.info(`User updated: ID ${id}`);
      res.status(200).json({ message: 'User updated successfully.' });
    } catch (error: any) {
      logger.error(`Error updating user: ${error.message}`);
      if (error.code === '23505') { // Unique violation
        res.status(409).json({ message: 'Email already exists.' });
      } else {
        res.status(500).json({ message: 'Internal Server Error' });
      }
    }
  }

  // Delete a user
  public async deleteUser(req: Request, res: Response): Promise<void> {
    const id = parseInt(req.params.id, 10);

    if (isNaN(id)) {
      res.status(400).json({ message: 'Invalid user ID.' });
      return;
    }

    try {
      const existingUser = await this.dbService.getUserById(id);
      if (!existingUser) {
        res.status(404).json({ message: 'User not found.' });
        return;
      }

      await this.dbService.deleteUser(id);
      logger.info(`User deleted: ID ${id}`);
      res.status(200).json({ message: 'User deleted successfully.' });
    } catch (error: any) {
      logger.error(`Error deleting user: ${error.message}`);
      res.status(500).json({ message: 'Internal Server Error' });
    }
  }
}

export default Controller;
