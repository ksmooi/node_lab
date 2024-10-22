# Building a Node.js Application with TypeScript

Node.js is a popular runtime for building scalable, server-side applications, and when paired with TypeScript, it offers the added benefit of static typing, which improves code readability, maintainability, and reduces runtime errors. This article will walk you through the process of setting up a well-structured Node.js project using TypeScript. We’ll cover everything from setting up the project structure to implementing key components like controllers, services, routes, and configuration management.

## Table of Contents
1. Project Structure Overview
2. Initial Setup with NPM and TypeScript
3. Implementing Key Components
    - Configuration Management
    - Controllers
    - Services
    - Routes
    - Models
    - Utility Functions
4. Running and Building the Application
5. Conclusion

---

## 1. **Project Structure Overview**

To maintain scalability and cleanliness in a Node.js project, a clear and organized structure is essential. Here’s a recommended directory structure for a TypeScript-based Node.js project:

```plaintext
my-node-app/
│
├── src/                  # TypeScript source files
│   ├── config/           # Configuration (e.g., environment, constants)
│   ├── controllers/      # Controller logic (request handlers)
│   ├── routes/           # API route definitions
│   ├── models/           # Database models (e.g., Mongoose or Sequelize models)
│   ├── services/         # Business logic and services
│   ├── utils/            # Helper and utility functions
│   └── app.ts            # Main application entry point
│
├── dist/                 # Compiled JavaScript files (output directory)
├── node_modules/         # Installed dependencies
├── tsconfig.json         # TypeScript configuration
└── package.json          # NPM dependencies and scripts
```

Each directory serves a specific purpose:
- **`src/config/`**: Configuration management (e.g., environment variables).
- **`src/controllers/`**: Handles HTTP requests and responses.
- **`src/routes/`**: API route definitions.
- **`src/models/`**: Data models and schema (e.g., for databases like MongoDB).
- **`src/services/`**: Business logic that interacts with models.
- **`src/utils/`**: Helper functions and utilities.
- **`dist/`**: The output directory for compiled JavaScript files after TypeScript compilation.

---

## 2. **Initial Setup with NPM and TypeScript**

Before diving into the implementation of your Node.js application with TypeScript, let's set up the project.

### Step 1: Initialize the Project

First, create the project directory and initialize the `package.json` file:

```bash
mkdir my-node-app
cd my-node-app
npm init -y
```

This creates a `package.json` file with default values.

### Step 2: Install Dependencies

Next, install the required dependencies for your project, including TypeScript, `ts-node` (for running TypeScript directly), and `dotenv` for managing environment variables:

```bash
npm install express dotenv
npm install --save-dev typescript ts-node @types/express nodemon
```

### Step 3: Set Up TypeScript Configuration

Create a `tsconfig.json` file to configure TypeScript:

```bash
npx tsc --init
```

A basic `tsconfig.json` for this project might look like this:

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "commonjs",
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true
  },
  "include": ["src/**/*"]
}
```

This setup ensures that your TypeScript files in the `src/` directory will be compiled into JavaScript files in the `dist/` directory.

---

## 3. **Implementing Key Components**

With the project structure in place, let’s implement the core components of the application.

### a. **Main Application Entry Point: `app.ts`**

The `app.ts` file is the entry point of the application. It initializes Express, loads environment variables, sets up middleware, and registers routes.

```typescript
// src/app.ts
import express, { Application } from 'express';
import dotenv from 'dotenv';
import userRoutes from './routes/userRoutes';
import { config } from './config/config';

// Load environment variables
dotenv.config();

const app: Application = express();

// Middleware to parse JSON
app.use(express.json());

// Register routes
app.use('/api/users', userRoutes);

// Start the server
const PORT = config.port;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
```

### b. **Configuration Management: `config.ts`**

The `config.ts` file is used to manage configuration settings, such as the server port and database URL, which are typically stored in environment variables.

```typescript
// src/config/config.ts
interface Config {
  port: number;
  databaseUrl: string;
}

export const config: Config = {
  port: Number(process.env.PORT) || 3000,
  databaseUrl: process.env.DATABASE_URL || 'mongodb://localhost:27017/mydb'
};
```

### c. **Controllers: Handling Requests (`userController.ts`)**

The controller handles the logic of processing incoming HTTP requests. For example, in the `userController.ts` file, we handle user-related requests.

```typescript
// src/controllers/userController.ts
import { Request, Response } from 'express';
import { UserService } from '../services/userService';

const userService = new UserService();

export const getUsers = async (req: Request, res: Response) => {
  const users = await userService.getAllUsers();
  res.json(users);
};

export const createUser = async (req: Request, res: Response) => {
  const { name, email } = req.body;
  const newUser = await userService.createUser(name, email);
  res.status(201).json(newUser);
};
```

### d. **Routes: Defining API Endpoints (`userRoutes.ts`)**

The `userRoutes.ts` file defines the API endpoints for handling user-related requests. Each route is linked to a controller method.

```typescript
// src/routes/userRoutes.ts
import { Router } from 'express';
import { getUsers, createUser } from '../controllers/userController';

const router: Router = Router();

router.get('/', getUsers);
router.post('/', createUser);

export default router;
```

### e. **Models: Managing Data (`userModel.ts`)**

The model represents the schema of the data and typically interacts with the database. For simplicity, we'll use an in-memory database in this example.

```typescript
// src/models/userModel.ts
export interface User {
  id: number;
  name: string;
  email: string;
}

let users: User[] = [];

export const getUsersFromDB = (): User[] => users;

export const addUserToDB = (user: User): User => {
  users.push(user);
  return user;
};
```

### f. **Services: Business Logic (`userService.ts`)**

The service layer handles business logic. It interacts with the model to fetch or manipulate data.

```typescript
// src/services/userService.ts
import { User, getUsersFromDB, addUserToDB } from '../models/userModel';

export class UserService {
  private users: User[] = [];

  constructor() {
    this.users = getUsersFromDB();
  }

  getAllUsers(): User[] {
    return this.users;
  }

  createUser(name: string, email: string): User {
    const newUser: User = {
      id: this.users.length + 1,
      name,
      email,
    };
    return addUserToDB(newUser);
  }
}
```

### g. **Utility Functions: Logging (`logger.ts`)**

Utility functions help keep the code DRY (Don’t Repeat Yourself). In this case, we create a simple logging utility.

```typescript
// src/utils/logger.ts
export const log = (message: string): void => {
  console.log(`[LOG]: ${message}`);
};
```

---

## 4. **Running and Building the Application**

### Step 1: Install Dependencies

To install the required dependencies, run:

```bash
npm install
```

### Step 2: Running in Development Mode

During development, you can use `nodemon` to automatically restart the server whenever file changes are detected. The `dev` script will run the application with TypeScript using `ts-node`.

```bash
npm run dev
```

### Step 3: Building the Project

To compile the TypeScript code into JavaScript, run the `build` script:

```bash
npm run build
```

This will compile all TypeScript files from the `src` folder into the `dist` folder.

### Step 4: Running the Compiled Code

After building the project, you can run the compiled JavaScript code:

```bash
npm start
```

This will execute the JavaScript code located in the `dist` folder.

---

## 5. **Conclusion**

In this guide, we have walked through the complete process of building a scalable Node.js application using TypeScript. The application is structured with clear separation of concerns, including configuration management, controllers, services, models, routes, and utility functions. This approach not only makes the codebase maintainable but also prepares it for future expansion as the project grows.

By following these principles and best practices, you can ensure that your Node.js applications are scalable, maintainable, and easy to understand for future developers.

