# PostgreSQL CRUD Application with Node.js and TypeScript

A robust **PostgreSQL CRUD (Create, Read, Update, Delete) Application** built with **Node.js** and **TypeScript**, utilizing the **pg** library for seamless PostgreSQL interactions. The application is designed with **Object-Oriented (OO)** principles, featuring both a **server** and a **Command-Line Interface (CLI) client** to facilitate testing and interaction with the PostgreSQL database. Environment variables are securely managed using a `.env` file.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup](#setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Setup PostgreSQL Database](#4-setup-postgresql-database)
- [Running the Application](#running-the-application)
  - [1. Start the PostgreSQL Server](#1-start-the-postgresql-server)
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

- **CRUD Operations:** Create, Read, Update, and Delete records in a PostgreSQL database.
- **CLI Client:** Interactive Command-Line Interface to perform database operations.
- **RESTful API:** Server-side API built with Express and pg for database interactions.
- **TypeScript:** Enhanced type safety and developer experience.
- **Environment Configuration:** Securely manage configuration using `.env` files.
- **Error Handling & Logging:** Comprehensive error reporting and logging using Winston.

---

## Prerequisites

Before setting up and running the PostgreSQL CRUD Application, ensure you have the following installed on your machine:

- **Node.js** (v14 or later)
- **npm** or **yarn**
- **TypeScript** (`npm install -g typescript`)
- **ts-node** (`npm install -g ts-node`)
- **PostgreSQL** (installed locally or accessible via a remote server)

### Installing PostgreSQL Locally

If you don't have PostgreSQL installed locally, you can install it using the following methods based on your operating system:

- **Ubuntu:**

  ```bash
  sudo apt update
  sudo apt install postgresql postgresql-contrib
  ```

  **Start PostgreSQL Service:**

  ```bash
  sudo systemctl start postgresql
  sudo systemctl enable postgresql
  ```

- **macOS (using Homebrew):**

  ```bash
  brew update
  brew install postgresql
  ```

  **Start PostgreSQL Server:**

  ```bash
  brew services start postgresql
  ```

- **Windows:**

  Download and install PostgreSQL from the [official website](https://www.postgresql.org/download/windows/). Follow the installation wizard to set up PostgreSQL and configure the server.

---

## Project Structure

```
src/apps/pgsql_app/
├── client
│   ├── apiService.ts
│   ├── cliClient.ts
│   └── client.ts
├── README.md
└── server
    ├── controller.ts
    ├── databaseService.ts
    ├── errorHandler.ts
    ├── logger.ts
    ├── routes.ts
    └── server.ts
```

- **server/**: Contains all server-side logic, including database interactions, API endpoints, error handling, and logging.
  - **databaseService.ts**: Handles PostgreSQL connections and queries.
  - **controller.ts**: Handles incoming HTTP requests and interacts with the DatabaseService.
  - **routes.ts**: Defines Express routes and maps them to controller methods.
  - **logger.ts**: Configures logging using Winston.
  - **errorHandler.ts**: Centralized error handling middleware for Express.
  - **server.ts**: Initializes and starts the Express server.

- **client/**: Contains all client-side logic, including API interactions and the CLI interface.
  - **apiService.ts**: Handles HTTP requests to the server using axios.
  - **cliClient.ts**: Manages the Command-Line Interface interactions using inquirer.
  - **client.ts**: Entry point for the CLI client.

- **README.md**: Documentation for the `pgsql_app` project.

- **.env**: Environment variables configuration file located at the root (`node_ts_lab/.env`).

---

## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/pgsql_app.git
cd pgsql_app
```

### 2. Install Dependencies

Navigate to both the server and client directories to install their respective dependencies.

```bash
# Install server dependencies
cd src/apps/pgsql_app/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the root directory (`node_ts_lab/.env`) to store environment-specific configurations.

**`node_ts_lab/.env`**

```env
# PostgreSQL Configuration
PG_HOST=localhost
PG_PORT=5432
PG_USER=your_pg_username
PG_PASSWORD=your_pg_password
PG_DATABASE=your_pg_database

# Server Configuration
PORT=5000

# Client Configuration
SERVER_BASE_URL=http://localhost:5000/api
```

**Explanation:**

- **PG_HOST**: Host address of your PostgreSQL server.
- **PG_PORT**: Port on which PostgreSQL is running (default is `5432`).
- **PG_USER**: PostgreSQL username.
- **PG_PASSWORD**: PostgreSQL password.
- **PG_DATABASE**: PostgreSQL database name.
- **PORT**: Port number on which the server will run.
- **SERVER_BASE_URL**: Base URL for the server's API endpoints (used by the client).

**Ensure `.env` is Ignored by Version Control**

Add `.env` to your `.gitignore` file to prevent exposing sensitive information.

**`.gitignore`:**

```gitignore
node_modules/
dist/
.env
```

### 4. Setup PostgreSQL Database

Ensure that you have a PostgreSQL database set up and accessible with the credentials specified in your `.env` file.

#### A. Create a New Database and User

1. **Access PostgreSQL Shell:**

   ```bash
   sudo -u postgres psql
   ```

2. **Create a New Database:**

   ```sql
   CREATE DATABASE your_pg_database;
   ```

3. **Create a New User with Password:**

   ```sql
   CREATE USER your_pg_username WITH PASSWORD 'your_pg_password';
   ```

4. **Grant All Privileges on the Database to the User:**

   ```sql
   GRANT ALL PRIVILEGES ON DATABASE your_pg_database TO your_pg_username;
   ```

5. **Exit PostgreSQL Shell:**

   ```sql
   \q
   ```

#### B. Create a Table for CRUD Operations

For demonstration purposes, let's create a simple `users` table.

1. **Connect to the Database:**

   ```bash
   psql -h localhost -U your_pg_username -d your_pg_database
   ```

2. **Create `users` Table:**

   ```sql
   CREATE TABLE users (
     id SERIAL PRIMARY KEY,
     name VARCHAR(100) NOT NULL,
     email VARCHAR(100) UNIQUE NOT NULL,
     age INTEGER,
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
   \dt
   \d users
   ```

5. **Exit PostgreSQL Shell:**

   ```sql
   \q
   ```

---

## Running the Application

Follow these steps to run both the server and client components of the application.

### 1. Start the PostgreSQL Server

Ensure that the PostgreSQL server is running and properly configured.

- **Local Installation:**

  - **Ubuntu:**

    ```bash
    sudo systemctl start postgresql
    sudo systemctl status postgresql
    ```

  - **macOS (using Homebrew):**

    ```bash
    brew services start postgresql
    brew services list
    ```

  - **Windows:**

    Start the PostgreSQL service via the Services management console or your chosen installation method.

### 2. Start the Server

Navigate to the server directory and start the server using **ts-node**.

```bash
cd src/apps/pgsql_app/server
npx ts-node server.ts
```

**Expected Output:**

```
Connected to PostgreSQL
Server is running on port 5000
```

**Troubleshooting:**

- **Authentication Errors:** Ensure that the credentials in your `.env` file match those set in PostgreSQL.
- **Port Conflicts:** If port `5000` is in use, change it in the `.env` file and restart the server.

### 3. Run the CLI Client

Open a new terminal window, navigate to the client directory, and start the CLI client.

```bash
cd src/apps/pgsql_app/client
npx ts-node client.ts
```

**Alternative: Using npm Scripts**

For convenience, you can add scripts to your `package.json` to run the server and client.

**Update `package.json`:**

```json
{
  "scripts": {
    "start:server": "ts-node -r tsconfig-paths/register src/apps/pgsql_app/server/server.ts",
    "start:client": "ts-node -r tsconfig-paths/register src/apps/pgsql_app/client/client.ts"
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

Upon running the CLI client, you'll be greeted with a menu to perform various actions related to PostgreSQL CRUD operations.

**Sample Interaction:**

```
Welcome to the PostgreSQL CRUD CLI Client!

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
  created_at: 2023-08-01T12:34:56.789Z
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
   - **Description:** Fetch and display all users stored in the PostgreSQL database.

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

The server exposes the following RESTful API endpoints for managing user records in PostgreSQL.

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

1. **PostgreSQL Authentication Failed**

   - **Error Message:**
     ```
     Error creating user: password authentication failed for user "your_pg_username"
     ```
   - **Cause:** Incorrect PostgreSQL credentials or user does not have the necessary privileges.
   - **Solution:**
     - Verify that the `PG_USER` and `PG_PASSWORD` in your `.env` file match the PostgreSQL user credentials.
     - Ensure that the PostgreSQL user has the required permissions on the specified database.
     - Check that the PostgreSQL server is running and accessible at `PG_HOST:PG_PORT`.

2. **PostgreSQL Server Not Running**

   - **Error Message:**
     ```
     Error: connect ECONNREFUSED 127.0.0.1:5432
     ```
   - **Cause:** PostgreSQL service is not running or not accessible at the specified host and port.
   - **Solution:**
     - Start the PostgreSQL service using your operating system's service manager.
     - Verify the host and port in the `.env` file match your PostgreSQL server's configuration.
     - Check firewall settings to ensure the PostgreSQL port is open.

3. **TypeScript Compilation Errors**

   - **Error Message:**
     ```
     TSError: ⨯ Unable to compile TypeScript:
     src/apps/pgsql_app/server/databaseService.ts:10:5 - error TS2322: Type 'Pool' is not assignable to type 'any'.
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
     TypeError: Cannot read property 'PG_HOST' of undefined
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
- [pg](https://node-postgres.com/) - PostgreSQL client for Node.js
- [TypeScript](https://www.typescriptlang.org/) - Typed superset of JavaScript
- [Axios](https://axios-http.com/) - Promise based HTTP client for the browser and Node.js
- [Inquirer](https://www.npmjs.com/package/inquirer) - A collection of common interactive command-line user interfaces
- [Winston](https://www.npmjs.com/package/winston) - A versatile logging library for Node.js

---

**Happy Coding! 🚀**

