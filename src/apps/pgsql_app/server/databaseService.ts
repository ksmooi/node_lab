import { Pool } from 'pg';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = new Pool({
      host: process.env.PG_HOST,
      port: Number(process.env.PG_PORT),
      user: process.env.PG_USER,
      password: process.env.PG_PASSWORD,
      database: process.env.PG_DATABASE,
    });

    this.pool.on('connect', () => {
      logger.info('Connected to PostgreSQL');
    });

    this.pool.on('error', (err) => {
      logger.error('Unexpected error on idle PostgreSQL client', err);
      process.exit(-1);
    });
  }

  // Create a new user
  public async createUser(name: string, email: string, age: number): Promise<void> {
    const query = 'INSERT INTO users (name, email, age) VALUES ($1, $2, $3)';
    const values = [name, email, age];
    await this.pool.query(query, values);
  }

  // Read a user by ID
  public async getUserById(id: number): Promise<any> {
    const query = 'SELECT * FROM users WHERE id = $1';
    const values = [id];
    const result = await this.pool.query(query, values);
    return result.rows[0];
  }

  // Read all users
  public async getAllUsers(): Promise<any[]> {
    const query = 'SELECT * FROM users';
    const result = await this.pool.query(query);
    return result.rows;
  }

  // Update a user
  public async updateUser(id: number, name: string, email: string, age: number): Promise<void> {
    const query = 'UPDATE users SET name = $1, email = $2, age = $3 WHERE id = $4';
    const values = [name, email, age, id];
    await this.pool.query(query, values);
  }

  // Delete a user
  public async deleteUser(id: number): Promise<void> {
    const query = 'DELETE FROM users WHERE id = $1';
    const values = [id];
    await this.pool.query(query, values);
  }

  // Close the pool (used for graceful shutdown)
  public async closePool(): Promise<void> {
    await this.pool.end();
    logger.info('PostgreSQL pool has ended');
  }
}

export default DatabaseService;
