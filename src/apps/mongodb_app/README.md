# Blog Application

A robust Blog Application built with **Node.js** and **TypeScript**, featuring a **RESTful API** server and a **Command-Line Interface (CLI)** client for seamless interaction. This application allows users to perform **CRUD** (Create, Read, Update, Delete) operations on blog posts stored in a **MongoDB** database.

## Table of Contents

- [Features](#features)
- [Prerequisites](#prerequisites)
- [Project Structure](#project-structure)
- [Setup](#setup)
  - [1. Clone the Repository](#1-clone-the-repository)
  - [2. Install Dependencies](#2-install-dependencies)
  - [3. Configure Environment Variables](#3-configure-environment-variables)
  - [4. Setup MongoDB User](#4-setup-mongodb-user)
- [Running the Application](#running-the-application)
  - [1. Start the Server](#1-start-the-server)
  - [2. Run the CLI Client](#2-run-the-cli-client)
- [Usage](#usage)
  - [CLI Client Commands](#cli-client-commands)
- [API Endpoints](#api-endpoints)
- [Troubleshooting](#troubleshooting)
- [Contributing](#contributing)
- [License](#license)


## Features

- **CRUD Operations:** Create, Read, Update, and Delete blog posts.
- **CLI Client:** Interact with the server through an intuitive Command-Line Interface.
- **RESTful API:** Robust server-side API built with Express and Mongoose.
- **TypeScript:** Enhanced type safety and developer experience.
- **Authentication:** Secure connection to MongoDB with authenticated users.
- **Error Handling:** Comprehensive error reporting for both server and client.


## Prerequisites

Before setting up and running the Blog Application, ensure you have the following installed on your machine:

- **Node.js** (v14 or later)
- **npm** or **yarn**
- **TypeScript** (`npm install -g typescript`)
- **ts-node** (`npm install -g ts-node`)
- **MongoDB** (local instance or MongoDB Atlas)


## Project Structure

```
src/apps/mongodb_app/
├── client
│   ├── apiService.ts
│   ├── blogClient.ts
│   └── client.ts
└── server
    ├── db.ts
    ├── logger.ts
    ├── postController.ts
    ├── postRoutes.ts
    ├── postService.ts
    ├── post.ts
    ├── errorHandler.ts
    └── server.ts
```

- **client/**: Contains the CLI client components.
  - **apiService.ts**: Handles HTTP requests to the server.
  - **blogClient.ts**: Implements the CLI logic for user interactions.
  - **client.ts**: Entry point for the CLI client.
  
- **server/**: Contains the server-side components.
  - **db.ts**: Handles MongoDB connection.
  - **logger.ts**: Configures logging using Winston.
  - **postController.ts**: Defines controller methods for API endpoints.
  - **postRoutes.ts**: Sets up Express routes for blog posts.
  - **postService.ts**: Contains business logic for blog posts.
  - **post.ts**: Defines the Mongoose schema and model for blog posts.
  - **errorHandler.ts**: Centralized error handling middleware.
  - **server.ts**: Entry point for the server.


## Setup

### 1. Clone the Repository

```bash
git clone https://github.com/yourusername/blog-application.git
cd blog-application
```

### 2. Install Dependencies

Navigate to both the server and client directories to install their respective dependencies.

```bash
# Install server dependencies
cd src/apps/mongodb_app/server
npm install

# Install client dependencies
cd ../client
npm install
```

### 3. Configure Environment Variables

Create a `.env` file in the `server` directory to store environment-specific configurations.

**`src/apps/mongodb_app/server/.env`**

```
MONGODB_URI=mongodb://blogUser:securePassword123@localhost:27017/blogDB?authSource=admin
PORT=5000
```

**Explanation:**

- **MONGODB_URI**: Connection string to your MongoDB instance, including the username (`blogUser`), password (`securePassword123`), database (`blogDB`), and authentication source (`admin`).
- **PORT**: Port number on which the server will run.

### 4. Setup MongoDB User

Ensure that you have a MongoDB user with the necessary permissions to access the `blogDB` database.
`blogDB` database have below collections:
- users
- posts
- comments

**Using `mongosh`:**

```bash
mongosh
```

**Within `mongosh`:**

```javascript
use admin
db.removeUser("blogUser")
db.createUser({
  user: "blogUser",
  pwd: "securePassword123",
  roles: [
    { role: 'readWrite', db: 'blogDB' },
    { role: 'readWrite', db: 'admin' }
  ]
})
db.getUser("blogUser")
```

**Explanation:**

- **Remove Existing User (Optional):** `db.removeUser("blogUser")` removes the `blogUser` if it already exists.
- **Create New User:** `db.createUser({...})` creates a new user with `readWrite` permissions on both `blogDB` and `admin` databases.
- **Verify User Creation:** `db.getUser("blogUser")` retrieves the user details to confirm successful creation.

**Note:** Replace `"securePassword123"` with a strong, secure password of your choice.


## Running the Application

### 1. Start the Server

Ensure that MongoDB is running and properly configured. Then, start the server.

```bash
cd src/apps/mongodb_app/server
npx ts-node server.ts
```

**Expected Output:**

```
MongoDB Connected
Server is running on port 5000
```

**Troubleshooting:**

- If you encounter authentication errors, double-check the credentials in your `.env` file and ensure that the MongoDB user has the correct roles.
- Ensure that MongoDB is running and accessible.

### 2. Run the CLI Client

In a separate terminal window, start the CLI client to interact with the server.

```bash
cd src/apps/mongodb_app/client
npx ts-node client.ts
```

**Alternative: Using npm Scripts**

You can add the following scripts to your `package.json` for easier execution:

**`package.json`**

```json
{
  "scripts": {
    "start:server": "ts-node -r tsconfig-paths/register src/apps/mongodb_app/server/server.ts",
    "start:client": "ts-node -r tsconfig-paths/register src/apps/mongodb_app/client/client.ts"
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


## Usage

Upon running the CLI client, you'll be greeted with a menu to perform various actions.

**Sample Interaction:**

```
Welcome to the Blog Application CLI Client!

? Select an action: Create a New Post
✔ Enter the post title: My First Blog
✔ Enter the post content: This is the content of my first blog post.
✔ Enter the author name: Alice

Post created successfully!
{
  _id: '60c72b2f9b1e8e5a5c8b4567',
  title: 'My First Blog',
  content: 'This is the content of my first blog post.',
  author: 'Alice',
  createdAt: '2023-08-01T12:34:56.789Z',
  updatedAt: '2023-08-01T12:34:56.789Z',
  __v: 0
}
✔ Select an action: View All Posts
```

### CLI Client Commands

1. **Create a New Post**
   - **Description:** Allows you to create a new blog post by entering the title, content, and author.
   
2. **View All Posts**
   - **Description:** Fetches and displays all blog posts from the database.
   
3. **View a Post by ID**
   - **Description:** Retrieve and display details of a specific post using its unique ID.
   
4. **Update a Post**
   - **Description:** Update the title, content, or author of an existing post by providing its ID.
   
5. **Delete a Post**
   - **Description:** Remove a post from the database by its ID after confirmation.
   
6. **Exit**
   - **Description:** Exit the CLI client.


## API Endpoints

The server exposes the following RESTful API endpoints for managing blog posts.

### Base URL

```
http://localhost:5000/api/posts
```

### Endpoints

1. **Create a New Post**

   - **URL:** `/api/posts`
   - **Method:** `POST`
   - **Body:**
     ```json
     {
       "title": "Post Title",
       "content": "Post Content",
       "author": "Author Name"
     }
     ```
   - **Success Response:**
     - **Code:** `201 CREATED`
     - **Content:**
       ```json
       {
         "_id": "60c72b2f9b1e8e5a5c8b4567",
         "title": "Post Title",
         "content": "Post Content",
         "author": "Author Name",
         "createdAt": "2023-08-01T12:34:56.789Z",
         "updatedAt": "2023-08-01T12:34:56.789Z",
         "__v": 0
       }
       ```

2. **Get All Posts**

   - **URL:** `/api/posts`
   - **Method:** `GET`
   - **Success Response:**
     - **Code:** `200 OK`
     - **Content:** Array of post objects.

3. **Get a Post by ID**

   - **URL:** `/api/posts/:id`
   - **Method:** `GET`
   - **Success Response:**
     - **Code:** `200 OK`
     - **Content:** Post object.

4. **Update a Post**

   - **URL:** `/api/posts/:id`
   - **Method:** `PUT`
   - **Body:** Any combination of `title`, `content`, and/or `author`.
     ```json
     {
       "title": "Updated Title"
     }
     ```
   - **Success Response:**
     - **Code:** `200 OK`
     - **Content:** Updated post object.

5. **Delete a Post**

   - **URL:** `/api/posts/:id`
   - **Method:** `DELETE`
   - **Success Response:**
     - **Code:** `200 OK`
     - **Content:**
       ```json
       {
         "message": "Post deleted successfully."
       }
       ```


## Troubleshooting

### Common Issues and Solutions

1. **Authentication Failed**

   - **Error Message:**
     ```
     MongoDB connection error: MongoServerError: Authentication failed.
     ```
     
   - **Cause:** Incorrect MongoDB credentials or insufficient user roles.
     
   - **Solution:**
     - Verify that the username and password in the `.env` file match those created in MongoDB.
     - Ensure that the user has `readWrite` permissions on both `admin` and `blogDB` databases.
     - Check that the `authSource=admin` parameter is included in the `MONGODB_URI`.

2. **MongoDB Not Running**

   - **Error Message:**
     ```
     MongoDB connection error: MongoNetworkError: failed to connect to server [localhost:27017] on first connect
     ```
     
   - **Cause:** MongoDB service is not running.
     
   - **Solution:**
     - Start the MongoDB service.
       ```bash
       sudo systemctl start mongod
       ```
     - Verify that MongoDB is running.
       ```bash
       sudo systemctl status mongod
       ```

3. **Port Already in Use**

   - **Error Message:**
     ```
     Error: listen EADDRINUSE: address already in use :::5000
     ```
     
   - **Cause:** Another process is using port `5000`.
     
   - **Solution:**
     - Identify the process using the port.
       ```bash
       sudo lsof -i :5000
       ```
     - Kill the process.
       ```bash
       sudo kill -9 <PID>
       ```
     - Alternatively, change the server port in the `.env` file to an available port.

4. **Invalid Post ID**

   - **Error Message:**
     ```
     Error fetching post: Cast to ObjectId failed for value "invalidID" at path "_id" for model "Post"
     ```
     
   - **Cause:** The provided post ID is not a valid MongoDB ObjectId.
     
   - **Solution:**
     - Ensure that the post ID is correctly copied from existing posts.
     - Validate the post ID format before making requests.

### Logs and Debugging

- **Server Logs:** Monitor the server terminal for detailed error messages and stack traces.
- **Client Errors:** The CLI client displays detailed error messages returned from the server.


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


## Acknowledgements

- [Express](https://expressjs.com/) - Fast, unopinionated, minimalist web framework for Node.js
- [Mongoose](https://mongoosejs.com/) - Elegant MongoDB object modeling for Node.js
- [Inquirer](https://www.npmjs.com/package/inquirer) - A collection of common interactive command-line user interfaces
- [Winston](https://www.npmjs.com/package/winston) - A versatile logging library for Node.js
