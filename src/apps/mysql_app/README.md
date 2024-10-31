# MySQL CRUD Application with Node.js and TypeScript

Welcome to the **MySQL CRUD Application**, a comprehensive project designed to help you practice and master using **MySQL** in a **Node.js** environment with **TypeScript**. This application leverages the **mysql2** library to perform seamless CRUD (Create, Read, Update, Delete) operations on a MySQL database. Both the **server** and **client** are architected using **Object-Oriented (OO)** principles, ensuring modularity, scalability, and maintainability. Environment variables are securely managed using a `.env` file.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup](#setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Setup MySQL Database](#4-setup-mysql-database)
- [Running the Application](#running-the-application)
  - [1. Start the MySQL Server](#1-start-the-mysql-server)
  - [2. Start the Server](#2-start-the-server)
  - [3. Run the CLI Client](#3-run-the-cli-client)
- [Usage](#usage)
  - [CLI Client Commands](#cli-client-commands)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [Acknowledgements](#acknowledgements)

---

## Features

- **CRUD Operations:** Perform Create, Read, Update, and Delete operations on a MySQL database.
- **CLI Client:** Interactive Command-Line Interface to interact with the server and manage database records.
- **RESTful API:** Server-side API built with Express and mysql2 for robust database interactions.
- **TypeScript:** Enhanced type safety and developer experience with TypeScript.
- **Environment Configuration:** Securely manage configuration using `.env` files.
- **Error Handling & Logging:** Comprehensive error reporting and logging using Winston.

---

## Prerequisites

Before setting up and running the MySQL CRUD Application, ensure you have the following installed on your machine:

- **Node.js** (v14 or later)
- **npm** or **yarn**
- **TypeScript** (`npm install -g typescript`)
- **ts-node** (`npm install -g ts-node`)
- **MySQL** (installed locally or accessible via a remote server)

### Installing MySQL Locally

If you don't have MySQL installed locally, you can install it using the following methods based on your operating system:

- **Ubuntu:**

  ```bash
  sudo apt update
  sudo apt install mysql-server
  ```

  **Start MySQL Service:**

  ```bash
  sudo systemctl start mysql
  sudo systemctl enable mysql
  ```

- **macOS (using Homebrew):**

  ```bash
  brew update
  brew install mysql
  ```

  **Start MySQL Server:**

  ```bash
  brew services start mysql
  ```

- **Windows:**

  Download and install MySQL from the [official website](https://dev.mysql.com/downloads/installer/). Follow the installation wizard to set up MySQL and configure the server.

---

## Project Structure

```
src/apps/mysql_app/
├── client
│   ├── apiService.ts
│   ├── cliClient.ts
│   └── client.ts
├── README.md
└── server
    ├── controller.ts
    ├── databaseService.ts
    ├── errorHandler.ts
    ├── logger.ts
    ├── routes.ts
    └── server.ts

node_ts_lab/.env
```

- **server/**: Contains all server-side logic, including database interactions, API endpoints, error handling, and logging.
  - **databaseService.ts**: Manages connections and queries to the MySQL database using the mysql2 library.
  - **controller.ts**: Handles incoming HTTP requests and interacts with the DatabaseService.
  - **routes.ts**: Defines Express routes and maps them to controller methods.
  - **logger.ts**: Configures logging using Winston.
  - **errorHandler.ts**: Centralized error handling middleware for Express.
  - **server.ts**: Initializes and starts the Express server.

- **client/**: Contains all client-side logic, including API interactions and the CLI interface.
  - **apiService.ts**: Handles HTTP requests to the server using axios.
  - **cliClient.ts**: Manages the Command-Line Interface interactions using inquirer.
  - **client.ts**: Entry point for the CLI client.

- **README.md**: Documentation for the `mysql_app` project.

- **.env**: Environment variables configuration file located at the root (`node_ts_lab/.env`).

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/mysql_app.git
cd mysql_app
```

### 2. Install Dependencies

Navigate to both the server and client directories to install their respective dependencies.

```bash
# Install server dependencies
cd src/apps/mysql_app/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (`node_ts_lab/.env`) to store environment-specific configurations.

**`node_ts_lab/.env`**

```env
# MySQL Configuration
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_USER=your_mysql_username
MYSQL_PASSWORD=your_mysql_password
MYSQL_DATABASE=your_mysql_database

# Server Configuration
PORT=5000
```

**Explanation:**

- **MYSQL_HOST**: Host address of your MySQL server.
- **MYSQL_PORT**: Port on which MySQL is running (default is `3306`).
- **MYSQL_USER**: MySQL username.
- **MYSQL_PASSWORD**: MySQL password.
- **MYSQL_DATABASE**: MySQL database name.
- **PORT**: Port number on which the server will run.

**Ensure `.env` is Ignored by Version Control**

Add `.env` to your `.gitignore` file to prevent exposing sensitive information.

**`.gitignore`:**

```gitignore
node_modules/
dist/
.env
```

### 4. Setup MySQL Database

Ensure that you have a MySQL database set up and accessible with the credentials specified in your `.env` file.

#### A. Create a New Database and User

1. **Access MySQL Shell:**

   ```bash
   mysql -u root -p
   ```

   Enter your root password when prompted.

2. **Create a New Database:**

   ```sql
   CREATE DATABASE your_mysql_database;
   ```

3. **Create a New User with Password:**

   ```sql
   CREATE USER 'your_mysql_username'@'localhost' IDENTIFIED BY 'your_mysql_password';
   ```

4. **Grant All Privileges on the Database to the User:**

   ```sql
   GRANT ALL PRIVILEGES ON your_mysql_database.* TO 'your_mysql_username'@'localhost';
   ```

5. **Flush Privileges and Exit:**

   ```sql
   FLUSH PRIVILEGES;
   EXIT;
   ```

#### B. Create a Table for CRUD Operations

For demonstration purposes, let's create a simple `users` table.

1. **Connect to the Database:**

   ```bash
   mysql -u your_mysql_username -p your_mysql_database
   ```

2. **Create `users` Table:**

   ```sql
   CREATE TABLE users (
     id INT AUTO_INCREMENT PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     age INT,
     created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
   );
   ```

3. **Insert Sample Data (Optional):**

   ```sql
   INSERT INTO users (name, email, age) VALUES
   ('Alice', 'alice@example.com', 30),
   ('Bob', 'bob@example.com', 25);
   ```

4. **Verify Table Creation:**

   ```sql
   SHOW TABLES;
   DESCRIBE users;
   ```

5. **Exit MySQL Shell:**

   ```sql
   EXIT;
   ```

---

## Running the Application

Follow these steps to run both the server and client components of the application.

### 1. Start the MySQL Server

Ensure that the MySQL server is running and properly configured.

- **Local Installation:**

  - **Ubuntu:**

    ```bash
    sudo systemctl start mysql
    sudo systemctl status mysql
    ```

  - **macOS (using Homebrew):**

    ```bash
    brew services start mysql
    brew services list
    ```

  - **Windows:**

    Start the MySQL service via the Services management console or your chosen installation method.

### 2. Start the Server

Navigate to the server directory and start the server using **ts-node**.

```bash
cd src/apps/mysql_app/server
npx ts-node server.ts
```

**Expected Output:**

```
Connected to MySQL
Server is running on port 5000
```

**Troubleshooting:**

- **Authentication Errors:** Ensure that the credentials in your `.env` file match those set in MySQL.
- **Port Conflicts:** If port `5000` is in use, change it in the `.env` file and restart the server.

### 3. Run the CLI Client

Open a new terminal window, navigate to the client directory, and start the CLI client.

```bash
cd src/apps/mysql_app/client
npx ts-node client.ts
```

**Alternative: Using npm Scripts**

For convenience, you can add scripts to your `package.json` to run the server and client.

**Update `package.json`:**

```json
{
  "scripts": {
    "start:server": "ts-node src/apps/mysql_app/server/server.ts",
    "start:client": "ts-node src/apps/mysql_app/client/client.ts"
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

Upon running the CLI client, you'll be greeted with a menu to perform various actions related to MySQL CRUD operations.

**Sample Interaction:**

```
Welcome to the MySQL CRUD CLI Client!

? Select an action: Create a New User
✔ Enter the user name: Charlie
✔ Enter the user email: charlie@example.com
✔ Enter the user age: 28

User 'Charlie' created successfully.

? Select an action: View a User by ID
✔ Enter the user ID: 1

User Details:
 {
  id: 1,
  name: 'Alice',
  email: 'alice@example.com',
  age: 30,
  created_at: '2023-08-01T12:34:56.789Z'
 }

? Select an action: View All Users

All Users:

ID: 1
Name: Alice
Email: alice@example.com
Age: 30
Created At: 2023-08-01T12:34:56.789Z
-------------------------
ID: 2
Name: Bob
Email: bob@example.com
Age: 25
Created At: 2023-08-02T09:20:15.123Z
-------------------------
ID: 3
Name: Charlie
Email: charlie@example.com
Age: 28
Created At: 2023-08-03T14:45:30.456Z
-------------------------

? Select an action: Update a User
✔ Enter the user ID to update: 2
✔ Enter the new name: Robert
✔ Enter the new email: robert@example.com
✔ Enter the new age: 26

User ID '2' updated successfully.

? Select an action: Delete a User
✔ Enter the user ID to delete: 3
? Are you sure you want to delete user ID '3'? Yes

User ID '3' deleted successfully.

? Select an action: Exit
Goodbye!
```

### CLI Client Commands

1. **Create a New User**
   - **Description:** Allows you to create a new user by providing name, email, and age.
   - **Inputs:**
     - **Name:** The user's name.
     - **Email:** The user's email address.
     - **Age:** The user's age.

2. **View a User by ID**
   - **Description:** Retrieve details of a specific user by their unique ID.
   - **Inputs:**
     - **User ID:** The unique identifier of the user.

3. **View All Users**
   - **Description:** Fetch and display all users stored in the MySQL database.

4. **Update a User**
   - **Description:** Update the details of an existing user.
   - **Inputs:**
     - **User ID:** The unique identifier of the user to update.
     - **New Name:** The updated name.
     - **New Email:** The updated email address.
     - **New Age:** The updated age.

5. **Delete a User**
   - **Description:** Remove a user from the database.
   - **Inputs:**
     - **User ID:** The unique identifier of the user to delete.
     - **Confirmation:** Confirmation prompt to prevent accidental deletions.

6. **Exit**
   - **Description:** Exit the CLI client gracefully.

---

## API Endpoints

The server exposes the following RESTful API endpoints for managing user records in MySQL.

### Base URL

```
http://localhost:5000/api
```

### Endpoints

1. **Create a New User**

   - **URL:** `/api/users`
   - **Method:** `POST`
   - **Body:**
     ```json
     {
       "name": "Alice",
       "email": "alice@example.com",
       "age": 30
     }
     ```
   - **Success Response:**
     - **Code:** `201 Created`
     - **Content:**
       ```json
       {
         "message": "User created successfully."
       }
       ```

2. **Get a User by ID**

   - **URL:** `/api/users/:id`
   - **Method:** `GET`
   - **Success Response:**
     - **Code:** `200 OK`
     - **Content:**
       ```json
       {
         "id": 1,
         "name": "Alice",
         "email": "alice@example.com",
         "age": 30,
         "created_at": "2023-08-01T12:34:56.789Z"
       }
       ```
   - **Error Response:**
     - **Code:** `404 Not Found`
     - **Content:**
       ```json
       {
         "message": "User not found."
       }
       ```

3. **Get All Users**

   - **URL:** `/api/users`
   - **Method:** `GET`
   - **Success Response:**
     - **Code:** `200 OK`
     - **Content:**
       ```json
       [
         {
           "id": 1,
           "name": "Alice",
           "email": "alice@example.com",
           "age": 30,
           "created_at": "2023-08-01T12:34:56.789Z"
         },
         {
           "id": 2,
           "name": "Bob",
           "email": "bob@example.com",
           "age": 25,
           "created_at": "2023-08-02T09:20:15.123Z"
         }
       ]
       ```

4. **Update a User**

   - **URL:** `/api/users/:id`
   - **Method:** `PUT`
   - **Body:**
     ```json
     {
       "name": "Robert",
       "email": "robert@example.com",
       "age": 26
     }
     ```
   - **Success Response:**
     - **Code:** `200 OK`
     - **Content:**
       ```json
       {
         "message": "User updated successfully."
       }
       ```
   - **Error Responses:**
     - **Code:** `404 Not Found`
       ```json
       {
         "message": "User not found."
       }
       ```
     - **Code:** `409 Conflict`
       ```json
       {
         "message": "Email already exists."
       }
       ```

5. **Delete a User**

   - **URL:** `/api/users/:id`
   - **Method:** `DELETE`
   - **Success Response:**
     - **Code:** `200 OK`
     - **Content:**
       ```json
       {
         "message": "User deleted successfully."
       }
       ```
   - **Error Response:**
     - **Code:** `404 Not Found`
       ```json
       {
         "message": "User not found."
       }
       ```

---

## Troubleshooting

### Common Issues and Solutions

1. **MySQL Authentication Failed**

   - **Error Message:**
     ```
     Error creating user: ER_ACCESS_DENIED_ERROR: Access denied for user 'your_mysql_username'@'localhost' (using password: YES)
     ```
   - **Cause:** Incorrect MySQL credentials or user does not have the necessary privileges.
   - **Solution:**
     - Verify that the `MYSQL_USER` and `MYSQL_PASSWORD` in your `.env` file match the MySQL user credentials.
     - Ensure that the MySQL user has the required permissions on the specified database.
     - Check that the MySQL server is running and accessible at `MYSQL_HOST:MYSQL_PORT`.

2. **MySQL Server Not Running**

   - **Error Message:**
     ```
     Error: connect ECONNREFUSED 127.0.0.1:3306
     ```
   - **Cause:** MySQL service is not running or not accessible at the specified host and port.
   - **Solution:**
     - Start the MySQL service using your operating system's service manager.
     - Verify the host and port in the `.env` file match your MySQL server's configuration.
     - Check firewall settings to ensure the MySQL port is open.

3. **TypeScript Compilation Errors**

   - **Error Message:**
     ```
     TSError: ⨯ Unable to compile TypeScript:
     src/apps/mysql_app/server/databaseService.ts:10:5 - error TS2322: Type 'Pool' is not assignable to type 'any'.
     ```
   - **Cause:** Type mismatches or incorrect type annotations in TypeScript files.
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
     - Terminate the process or change the server port in the `.env` file to an available port.

5. **Environment Variables Not Loaded**

   - **Error Message:**
     ```
     TypeError: Cannot read property 'MYSQL_HOST' of undefined
     ```
   - **Cause:** Environment variables are not properly loaded.
   - **Solution:**
     - Ensure that `dotenv.config()` is called at the very beginning of your entry files (`server.ts` and `client.ts`).
     - Verify that the `.env` file is correctly named and placed in the appropriate directory (`node_ts_lab/.env`).
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

## Acknowledgements

- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [mysql2](https://github.com/sidorares/node-mysql2) - Fast MySQL client for Node.js with focus on performance
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Axios](https://axios-http.com/) - Promise based HTTP client for the browser and Node.js
- [Inquirer](https://www.npmjs.com/package/inquirer) - A collection of common interactive command-line user interfaces
- [Winston](https://www.npmjs.com/package/winston) - A versatile logging library for Node.js

---

**Happy Coding! 🚀**

