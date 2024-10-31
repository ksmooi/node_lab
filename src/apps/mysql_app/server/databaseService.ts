import mysql, { Pool } from 'mysql2/promise';
import dotenv from 'dotenv';
import logger from './logger';

dotenv.config();

class DatabaseService {
  private pool: Pool;

  constructor() {
    this.pool = mysql.createPool({
      host: process.env.MYSQL_HOST,
      port: Number(process.env.MYSQL_PORT),
      user: process.env.MYSQL_USER,
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0,
    });

    this.pool.getConnection()
      .then(() => {
        logger.info('Connected to MySQL');
      })
      .catch((err) => {
        logger.error('Error connecting to MySQL:', err);
        process.exit(1);
      });
  }

  // Create a new user
  public async createUser(name: string, email: string, age: number): Promise<void> {
    const query = 'INSERT INTO users (name, email, age) VALUES (?, ?, ?)';
    const values = [name, email, age];
    await this.pool.execute(query, values);
  }

  // Read a user by ID
  public async getUserById(id: number): Promise<any> {
    const query = 'SELECT * FROM users WHERE id = ?';
    const [rows] = await this.pool.execute(query, [id]);
    return (rows as any[])[0];
  }

  // Read all users
  public async getAllUsers(): Promise<any[]> {
    const query = 'SELECT * FROM users';
    const [rows] = await this.pool.execute(query);
    return rows as any[];
  }

  // Update a user
  public async updateUser(id: number, name: string, email: string, age: number): Promise<void> {
    const query = 'UPDATE users SET name = ?, email = ?, age = ? WHERE id = ?';
    const values = [name, email, age, id];
    await this.pool.execute(query, values);
  }

  // Delete a user
  public async deleteUser(id: number): Promise<void> {
    const query = 'DELETE FROM users WHERE id = ?';
    await this.pool.execute(query, [id]);
  }

  // Close the pool (used for graceful shutdown)
  public async closePool(): Promise<void> {
    await this.pool.end();
    logger.info('MySQL pool has ended');
  }
}

export default DatabaseService;
