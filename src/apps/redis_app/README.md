# Redis CRUD Application

A robust **Redis CRUD (Create, Read, Update, Delete) Application** built with **Node.js** and **TypeScript**, utilizing the **ioredis** library for seamless Redis interactions. The application is designed with **Object-Oriented (OO)** principles, featuring both a **server** and a **Command-Line Interface (CLI) client** to facilitate testing and interaction with the Redis database.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup](#setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Setup Redis Server](#4-setup-redis-server)
- [Running the Application](#running-the-application)
  - [1. Start the Redis Server](#1-start-the-redis-server)
  - [2. Start the Server](#2-start-the-server)
  - [3. Run the CLI Client](#3-run-the-cli-client)
- [Usage](#usage)
  - [CLI Client Commands](#cli-client-commands)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)

---

## Features

- **CRUD Operations:** Create, Read, Update, and Delete key-value pairs in Redis.
- **CLI Client:** Interactive Command-Line Interface to perform Redis operations.
- **RESTful API:** Server-side API built with Express and ioredis for Redis interactions.
- **TypeScript:** Enhanced type safety and developer experience.
- **Authentication:** Secure connection to Redis with password protection.
- **Error Handling:** Comprehensive error reporting and logging using Winston.

---

## Prerequisites

Before setting up and running the Redis CRUD Application, ensure you have the following installed on your machine:

- **Node.js** (v14 or later)
- **npm** or **yarn**
- **TypeScript** (`npm install -g typescript`)
- **ts-node** (`npm install -g ts-node`)
- **Redis** (installed locally or accessible via a remote server)

### Installing Redis Locally

If you don't have Redis installed locally, you can install it using the following methods based on your operating system:

- **Ubuntu:**

  ```bash
  sudo apt update
  sudo apt install redis-server
  ```

  **Start Redis Service:**

  ```bash
  sudo systemctl start redis.service
  ```

- **macOS (using Homebrew):**

  ```bash
  brew install redis
  ```

  **Start Redis Server:**

  ```bash
  brew services start redis
  ```

- **Windows:**

  Windows doesn't have an official Redis release. You can use [Memurai](https://www.memurai.com/) or [Redis on Windows by Microsoft Open Tech](https://github.com/microsoftarchive/redis).

---

## Project Structure

```
src/apps/redis_app/
├── client
│   ├── apiService.ts
│   ├── cliClient.ts
│   └── client.ts
└── server
    ├── controller.ts
    ├── errorHandler.ts
    ├── logger.ts
    ├── redisService.ts
    ├── routes.ts
    └── server.ts
```

- **server/**: Contains all server-side logic, including Redis interactions, API endpoints, error handling, and logging.
  - **controller.ts**: Handles incoming HTTP requests and interacts with the RedisService.
  - **errorHandler.ts**: Centralized error handling middleware for Express.
  - **logger.ts**: Configures logging using Winston.
  - **redisService.ts**: Encapsulates all Redis operations using ioredis.
  - **routes.ts**: Defines Express routes and maps them to controller methods.
  - **server.ts**: Initializes and starts the Express server.
  
- **client/**: Contains all client-side logic, including API interactions and the CLI interface.
  - **apiService.ts**: Handles HTTP requests to the server using axios.
  - **cliClient.ts**: Manages the Command-Line Interface interactions using inquirer.
  - **client.ts**: Entry point for the CLI client.

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/redis-crud-app.git
cd redis-crud-app
```

### 2. Install Dependencies

Navigate to both the server and client directories to install their respective dependencies.

```bash
# Install server dependencies
cd src/apps/redis_app/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory to store environment-specific configurations.

**`src/apps/redis_app/server/.env`**

```env
REDIS_HOST=127.0.0.1
REDIS_PORT=6379
REDIS_PASSWORD=securePassword123
PORT=5000
```

**Explanation:**

- **REDIS_HOST**: Host address of your Redis server.
- **REDIS_PORT**: Port on which Redis is running (default is `6379`).
- **REDIS_PASSWORD**: Password for authenticating with Redis.
- **PORT**: Port number on which the server will run.

### 4. Setup Redis Server

Ensure that your Redis server is configured to require authentication.

#### **A. Modify Redis Configuration (`redis.conf`)**

1. **Locate `redis.conf`:**

   - **Linux/macOS:** Typically found at `/etc/redis/redis.conf` or `/usr/local/etc/redis.conf`.
   - **Windows:** Depending on the installation method, it might be located within the Redis installation directory.

2. **Set `requirepass`:**

   Open `redis.conf` in a text editor and set the `requirepass` directive.

   ```conf
   requirepass securePassword123
   ```

   **Note:** Replace `securePassword123` with a strong, secure password of your choice.

3. **Restart Redis Server:**

   - **Ubuntu:**

     ```bash
     sudo systemctl restart redis.service
     ```

   - **macOS (using Homebrew):**

     ```bash
     brew services restart redis
     ```

   - **Windows:**

     Restart the Redis service via your chosen Redis installation method.

#### **B. Verify Redis Authentication**

1. **Connect Using Redis CLI with Authentication:**

   ```bash
   redis-cli -h 127.0.0.1 -p 6379 -a securePassword123
   ```

2. **Test a Command:**

   ```bash
   SET testKey "Hello, Redis!"
   GET testKey
   ```

   **Expected Output:**

   ```
   OK
   "Hello, Redis!"
   ```

3. **Attempt Without Authentication:**

   ```bash
   redis-cli -h 127.0.0.1 -p 6379
   ```

   Then, execute:

   ```bash
   INFO
   ```

   **Expected Output:**

   ```
   (error) NOAUTH Authentication required.
   ```

---

## Running the Application

Follow these steps to run both the server and client components of the application.

### 1. Start the Redis Server

Ensure that the Redis server is running and properly configured with authentication.

- **Local Installation:**
  
  - **Ubuntu:**
    
    ```bash
    sudo systemctl start redis
    sudo systemctl status redis
    ```
  
  - **macOS (using Homebrew):**
    
    ```bash
    brew services start redis
    brew services list
    ```
  
  - **Windows:**
    
    Start the Redis service via your chosen installation method (e.g., Memurai).

### 2. Start the Server

Navigate to the server directory and start the server using **ts-node**.

```bash
cd src/apps/redis_app/server
npx ts-node server.ts
```

**Expected Output:**

```
Connected to Redis
Server is running on port 5000
```

**Troubleshooting:**

- **If You Encounter Authentication Errors:**
  - Double-check the credentials in your `.env` file.
  - Ensure that the Redis server is running and accessible.
  - Verify that the `requirepass` directive is correctly set in `redis.conf`.

### 3. Run the CLI Client

Open a new terminal window, navigate to the client directory, and start the CLI client.

```bash
cd src/apps/redis_app/client
npx ts-node client.ts
```

**Alternative: Using npm Scripts**

For convenience, you can add scripts to your `package.json` to run the server and client.

**Update `package.json`:**

```json
{
  "scripts": {
    "start:server": "ts-node -r tsconfig-paths/register src/apps/redis_app/server/server.ts",
    "start:client": "ts-node -r tsconfig-paths/register src/apps/redis_app/client/client.ts"
  },
  // ... other configurations
}
```

Run the server and client using:

```bash
# Start the server
npm run start:server

# Start the client
npm run start:client
```

---

## Usage

Upon running the CLI client, you'll be greeted with a menu to perform various actions related to Redis key-value operations.

**Sample Interaction:**

```
Welcome to the Redis CRUD CLI Client!

? Select an action: Create/Update a Key
✔ Enter the key: user:1
✔ Enter the value: {"name":"Alice","age":30}

Key 'user:1' set successfully.

? Select an action: Read a Key
✔ Enter the key to read: user:1

Value for key 'user:1': {"name":"Alice","age":30}

? Select an action: List All Keys

Keys in Redis:

1. user:1

? Select an action: Exit
Goodbye!
```

### CLI Client Commands

1. **Create/Update a Key**
   - **Description:** Allows you to create a new key-value pair or update an existing key with a new value.
   - **Inputs:**
     - **Key:** The identifier for the data.
     - **Value:** The data to store, typically as a string or JSON.

2. **Read a Key**
   - **Description:** Retrieve the value associated with a specific key.
   - **Inputs:**
     - **Key:** The identifier for the data you want to retrieve.

3. **Delete a Key**
   - **Description:** Remove a specific key and its associated value from Redis.
   - **Inputs:**
     - **Key:** The identifier for the data you want to delete.

4. **List All Keys**
   - **Description:** Fetch and display all keys currently stored in Redis.
   - **Note:** Use with caution in production environments, especially with large datasets.

5. **Exit**
   - **Description:** Exit the CLI client gracefully.

---

## API Endpoints

The server exposes the following RESTful API endpoints for managing Redis key-value pairs.

### Base URL

```
http://localhost:5000/api/redis
```

### Endpoints

1. **Create or Update a Key**

   - **URL:** `/api/redis/set`
   - **Method:** `POST`
   - **Body:**
     ```json
     {
       "key": "user:1",
       "value": "{\"name\":\"Alice\",\"age\":30}"
     }
     ```
   - **Success Response:**
     - **Code:** `200 OK`
     - **Content:**
       ```json
       {
         "message": "Key 'user:1' set successfully."
       }
       ```

2. **Get a Key's Value**

   - **URL:** `/api/redis/get/:key`
   - **Method:** `GET`
   - **Success Response:**
     - **Code:** `200 OK`
     - **Content:**
       ```json
       {
         "key": "user:1",
         "value": "{\"name\":\"Alice\",\"age\":30}"
       }
       ```
   - **Error Response:**
     - **Code:** `404 NOT FOUND`
     - **Content:**
       ```json
       {
         "message": "Key 'user:1' not found."
       }
       ```

3. **Delete a Key**

   - **URL:** `/api/redis/delete/:key`
   - **Method:** `DELETE`
   - **Success Response:**
     - **Code:** `200 OK`
     - **Content:**
       ```json
       {
         "message": "Key 'user:1' deleted successfully."
       }
       ```
   - **Error Response:**
     - **Code:** `404 NOT FOUND`
     - **Content:**
       ```json
       {
         "message": "Key 'user:1' not found."
       }
       ```

4. **Get All Keys**

   - **URL:** `/api/redis/keys`
   - **Method:** `GET`
   - **Success Response:**
     - **Code:** `200 OK`
     - **Content:**
       ```json
       {
         "keys": ["user:1", "session:abc123", "config:theme"]
       }
       ```

---

## Troubleshooting

### Common Issues and Solutions

1. **Redis Authentication Failed**

   - **Error Message:**
     ```
     Redis error: ReplyError: NOAUTH Authentication required.
     ```
   - **Cause:** Incorrect Redis password or missing authentication in the client configuration.
   - **Solution:**
     - Verify that the `REDIS_PASSWORD` in your `.env` file matches the password set in `redis.conf`.
     - Ensure that the `redisService.ts` is correctly loading environment variables and passing the password to the Redis client.
     - Restart the Redis server after making changes to `redis.conf`.
   
2. **Redis Server Not Running**

   - **Error Message:**
     ```
     Redis error: Error: connect ECONNREFUSED 127.0.0.1:6379
     ```
   - **Cause:** Redis server is not running or not accessible at the specified host and port.
   - **Solution:**
     - Start the Redis server using the appropriate command based on your OS.
     - Verify the host and port in the `.env` file match your Redis server's configuration.
     - Check firewall settings to ensure the Redis port is open.
   
3. **TypeScript Compilation Errors**

   - **Error Message:**
     ```
     TSError: ⨯ Unable to compile TypeScript:
     ```
   - **Cause:** Syntax errors or type mismatches in TypeScript files.
   - **Solution:**
     - Review the error messages to identify and fix the issues.
     - Ensure that all dependencies and type definitions are correctly installed.
     - Run `npx tsc` to compile TypeScript files and catch errors before running the application.

4. **Port Already in Use**

   - **Error Message:**
     ```
     Error: listen EADDRINUSE: address already in use :::5000
     ```
   - **Cause:** Another process is using port `5000`.
   - **Solution:**
     - Identify the process using the port:
       ```bash
       sudo lsof -i :5000
       ```
     - Terminate the process or change the server's port in the `.env` file to an available port.

5. **Environment Variables Not Loaded**

   - **Error Message:**
     ```
     TypeError: Cannot read property 'REDIS_HOST' of undefined
     ```
   - **Cause:** Environment variables are not properly loaded.
   - **Solution:**
     - Ensure that `dotenv.config()` is called at the very beginning of your entry files (`server.ts` and `client.ts`).
     - Verify that the `.env` file is correctly named and placed in the appropriate directory.
     - Check that there are no syntax errors in the `.env` file.

### Logs and Debugging

- **Server Logs:** Monitor the server terminal for detailed error messages and stack traces.
- **Client Errors:** The CLI client displays detailed error messages returned from the server.
- **Logging:** Utilize the integrated **Winston** logger to keep track of application events and errors.

---

## Contributing

Contributions are welcome! Please follow these steps to contribute:

1. **Fork the Repository**

2. **Create a New Branch**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Commit Your Changes**

   ```bash
   git commit -m "Add your message here"
   ```

4. **Push to the Branch**

   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Open a Pull Request**

Please ensure that your code adheres to the project's coding standards and includes appropriate tests.

---

## License

This project is licensed under the [MIT License](LICENSE).

---

## Acknowledgements

- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [ioredis](https://github.com/luin/ioredis) - A robust Redis client for Node.js
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Axios](https://axios-http.com/) - Promise based HTTP client for the browser and Node.js
- [Inquirer](https://www.npmjs.com/package/inquirer) - A collection of common interactive command-line user interfaces
- [Winston](https://www.npmjs.com/package/winston) - A versatile logging library for Node.js
- [Joi](https://joi.dev/) - Powerful schema description language and data validator for JavaScript

---

**Happy Coding! 🚀**

