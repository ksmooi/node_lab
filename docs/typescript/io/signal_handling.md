# Best Practices for Signal Handling in Node.js using TypeScript

Handling OS signals in Node.js is an essential aspect when you need to properly terminate your application or gracefully handle system events such as `SIGINT`, `SIGTERM`, or `SIGHUP`. These signals are sent to the Node.js process when, for instance, a user interrupts the program with `Ctrl+C` or when the operating system wants to shut down the application.

When using **TypeScript** in Node.js, the best practices for handling these signals include clean shutdown procedures, resource management (closing open files, database connections, etc.), and ensuring consistent typing and error handling.

## Best Practices for Handling Signals in TypeScript

1. **Use Graceful Shutdown for Signal Handling**:
    - Make sure to perform cleanup tasks such as closing database connections, stopping servers, or releasing other resources when receiving signals like `SIGINT` or `SIGTERM`.
  
2. **Use Process Event Listeners**:
    - The Node.js `process` object emits events for system signals such as `SIGINT`, `SIGTERM`, etc. You can listen for these events and handle them gracefully.

3. **Clean up Resources Properly**:
    - Ensure all resources (e.g., database connections, file handlers, servers) are properly cleaned up when the process is about to exit.

4. **TypeScript Types**:
    - Explicitly define types for your signal handlers, promises, and asynchronous tasks to ensure your code is reliable and consistent.

5. **Prevent Multiple Shutdown Attempts**:
    - Prevent the application from attempting to shut down multiple times by ignoring subsequent signals after the first one.

## Example: Graceful Shutdown in TypeScript

Here’s an example of how you can handle signals gracefully using **TypeScript** and ensure proper typing:

### Project Setup
First, ensure your TypeScript project is set up with Node.js:
```bash
npm init -y
npm install typescript @types/node
npx tsc --init
```

## Example Code: Gracefully Handling `SIGINT` and `SIGTERM`

```typescript
import { Server } from 'http';
import { promisify } from 'util';

// Simulate a running HTTP server
const server = new Server((req, res) => {
    res.writeHead(200, { 'Content-Type': 'text/plain' });
    res.end('Hello, World!\n');
});

// Start the server on port 3000
server.listen(3000, () => {
    console.log('Server listening on port 3000');
});

// Graceful shutdown function to handle cleanup
async function gracefulShutdown(signal: string): Promise<void> {
    console.log(`Received signal: ${signal}. Gracefully shutting down...`);

    try {
        // Close the server and wait for all open connections to close
        const closeServer = promisify(server.close).bind(server);
        await closeServer();
        console.log('Server closed successfully.');
    } catch (err) {
        console.error('Error during server shutdown:', err);
    }

    // Perform other cleanup tasks here (e.g., closing database connections)
    process.exit(0);
}

// Track whether the app is already shutting down
let isShuttingDown = false;

// Handle OS signals for graceful shutdown
['SIGINT', 'SIGTERM'].forEach((signal) => {
    process.on(signal, async () => {
        if (isShuttingDown) return;  // Prevent multiple signal handling
        isShuttingDown = true;
        await gracefulShutdown(signal);
    });
});

// Catch unhandled rejections for better error handling
process.on('unhandledRejection', (reason, promise) => {
    console.error('Unhandled Promise Rejection:', reason);
    // Optionally shut down or log more details
});

// Catch uncaught exceptions
process.on('uncaughtException', (error) => {
    console.error('Uncaught Exception:', error);
    // Depending on your app, you might want to shut down the server here
    process.exit(1);
});
```

## Breakdown of the Example

1. **Starting a Server**:
   - We create a simple HTTP server that listens on port 3000 and responds with "Hello, World!".

2. **Graceful Shutdown Function**:
   - The `gracefulShutdown` function is responsible for closing the server and any other resources (e.g., database connections). It uses `promisify()` to convert the callback-based `server.close()` into a Promise for cleaner asynchronous handling.
   - After completing the shutdown tasks, it terminates the process with `process.exit(0)`.

3. **Signal Handlers**:
   - The `process.on(signal)` function listens for OS signals (`SIGINT`, `SIGTERM`) and calls `gracefulShutdown` when such a signal is received.
   - `SIGINT` is typically sent when you press `Ctrl+C`, and `SIGTERM` is the signal used by some process managers to stop a service.
   - A boolean `isShuttingDown` prevents the shutdown logic from running multiple times if more signals are received during the shutdown process.

4. **Error Handling for Promises and Exceptions**:
   - `unhandledRejection`: Catches any Promise rejections that are not handled by `try-catch` and logs them.
   - `uncaughtException`: Catches any synchronous errors or exceptions that are not caught by `try-catch`. This is important for logging and potentially shutting down the application in case of fatal errors.

## Additional Considerations

1. **Database and External Resources**:
   - In production environments, you'll often want to close external resources (e.g., database connections, queues) during shutdown. Ensure that all these resources are closed before exiting.

   Example for closing a database connection:
   ```typescript
   async function closeDatabaseConnection(): Promise<void> {
       // Simulate database connection close
       console.log('Closing database connection...');
       // Close your real database connection here (e.g., await db.close())
   }
   
   async function gracefulShutdown(signal: string): Promise<void> {
       console.log(`Received signal: ${signal}. Gracefully shutting down...`);
   
       try {
           // Close the server
           const closeServer = promisify(server.close).bind(server);
           await closeServer();
           console.log('Server closed successfully.');
   
           // Close the database connection
           await closeDatabaseConnection();
       } catch (err) {
           console.error('Error during shutdown:', err);
       }
   
       process.exit(0);
   }
   ```

2. **Preventing Instant Kill**:
   - If your application takes too long to shut down, the operating system may still forcefully kill it. To avoid data corruption, ensure that shutdown logic is quick and responsive.

3. **Handling Multiple Signals**:
   - Sometimes, multiple signals might be sent (e.g., if the user presses `Ctrl+C` multiple times). It's crucial to ensure that your shutdown procedure only runs once by using a flag like `isShuttingDown` in the example above.

4. **Using TypeScript Types**:
   - Ensure all your functions are strongly typed, especially when using Promises for asynchronous operations.
   - Example of typed function:
   ```typescript
   async function shutdownServer(server: Server): Promise<void> {
       const closeServer = promisify(server.close).bind(server);
       await closeServer();
   }
   ```

## Running the Example

1. Save the above code in a file named `server.ts`.
2. Compile the TypeScript file using `npx tsc`.
3. Run the server:
   ```bash
   node dist/server.js
   ```
4. Press `Ctrl+C` to send a `SIGINT` signal, or send a `SIGTERM` signal by killing the process from another terminal.

## Conclusion

Handling signals in **TypeScript** for Node.js applications is essential for gracefully terminating applications and cleaning up resources. By following best practices like using scoped variables, error handling, and preventing multiple shutdown attempts, you can ensure a reliable shutdown process. The example provided demonstrates how to properly handle signals like `SIGINT` and `SIGTERM` in a Node.js environment, using TypeScript's type system to catch errors early and write more maintainable code.

