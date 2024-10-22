# Converting Blocking Functions to Asynchronous in TypeScript with `async/await`

Node.js is designed to handle I/O operations asynchronously, which allows it to process multiple requests concurrently. However, when it comes to CPU-bound or computationally expensive tasks, a **blocking function** can still hinder the event loop and degrade performance. Such tasks can lock the entire application until they are completed, which is undesirable in a real-world, scalable application.

In this article, we'll explore how to convert blocking functions to asynchronous using **`async/await`** and **Worker Threads** in TypeScript. We’ll also walk through practical examples, including running multiple blocking functions asynchronously.

---

## What is a Blocking Function?

A **blocking function** is one that prevents further execution of code until it has finished running. For example, a CPU-bound operation such as calculating a large factorial or performing a complex mathematical task can block the event loop.

### Example of a Blocking Function:

```typescript
function blockingTask(n: number): number {
  if (n <= 1) return 1;
  return n * blockingTask(n - 1);
}

const result = blockingTask(10);
console.log(`Blocking Task Result: ${result}`);
```

In this example, the `blockingTask` function recursively calculates the factorial of `n`, and since it's a synchronous operation, it will block any further execution until it is finished. While this works for small inputs, large numbers would make this function block the event loop for a considerable amount of time.

---

## Converting a Blocking Function to Asynchronous Using `async/await`

To handle blocking functions asynchronously, we can wrap the function in a **Promise** and use **`async/await`** to execute it without blocking the main thread. This ensures that the event loop can continue processing other requests while the heavy task is being performed.

### Example: Wrapping the Blocking Function in a `Promise`

```typescript
function blockingTask(n: number): number {
  if (n <= 1) return 1;
  return n * blockingTask(n - 1);
}

// Wrapping the blocking function in a Promise
function asyncBlockingTask(n: number): Promise<number> {
  return new Promise((resolve) => {
    const result = blockingTask(n);
    resolve(result);
  });
}

// Using async/await to handle the blocking task asynchronously
async function runTask() {
  console.log("Starting async task...");
  const result = await asyncBlockingTask(10);
  console.log(`Async Task Result: ${result}`);
}

runTask();
```

### Explanation:
1. **`blockingTask()`**: The original blocking function calculates the factorial of a number.
2. **`asyncBlockingTask()`**: This wraps the blocking function in a **`Promise`**, making it non-blocking.
3. **`runTask()`**: The async function that waits for the task to complete using **`await`**, ensuring non-blocking behavior for the main thread.

By using **`Promise`**, we make the blocking function asynchronous, allowing us to use **`await`** to manage execution without halting the event loop.

---

## Using Worker Threads for CPU-Intensive Tasks

For truly CPU-intensive tasks, using **Worker Threads** is a better approach. Worker Threads allow us to execute JavaScript/TypeScript code in parallel, without blocking the main event loop. This is especially useful for tasks that require significant processing power, such as parsing large datasets, cryptography, or image processing.

### Setting Up Worker Threads

Worker Threads run in isolated environments (threads) and communicate with the main thread via messages.

### Example: Using Worker Threads to Handle Blocking Functions

#### Step 1: Worker Code (`worker.ts`)

```typescript
import { parentPort } from 'worker_threads';

// A CPU-bound task (e.g., factorial calculation)
function blockingTask(n: number): number {
  if (n <= 1) return 1;
  return n * blockingTask(n - 1);
}

// Handle messages from the main thread
if (parentPort) {
  parentPort.on('message', (n: number) => {
    const result = blockingTask(n);
    parentPort.postMessage(result);  // Send result back to the main thread
  });
}
```

In this worker file, we listen for a message from the main thread, execute the blocking function, and then send the result back.

#### Step 2: Main Thread Code (`main.ts`)

```typescript
import { Worker } from 'worker_threads';
import path from 'path';

// Function to create a worker and run the blocking task asynchronously
function runBlockingTaskAsync(n: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'));

    worker.postMessage(n);

    worker.on('message', (result: number) => resolve(result));

    worker.on('error', reject);

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// Using async/await to execute the worker task
async function runTask() {
  console.log("Starting task with worker...");
  const result = await runBlockingTaskAsync(10);
  console.log(`Task Result from worker: ${result}`);
}

runTask();
```

### Explanation:

1. **Worker Thread (`worker.ts`)**: The worker executes the blocking task and sends the result back to the main thread.
2. **Main Thread (`main.ts`)**: The main thread spawns a worker and handles the result asynchronously using `async/await`.

In this example, the blocking function is offloaded to a separate worker thread, preventing the main thread from being blocked.

---

## Example: Running Multiple Blocking Functions Asynchronously

In real-world applications, you may need to run multiple blocking tasks asynchronously. This can be achieved by spawning multiple workers or using **`Promise.all()`** to run multiple promises in parallel.

### Example: Running Multiple Workers in Parallel

#### Step 1: Updated Worker Code (`worker.ts`)

The worker code remains the same as before. It performs a CPU-intensive task and returns the result.

#### Step 2: Main Thread Code for Multiple Workers (`main.ts`)

```typescript
import { Worker } from 'worker_threads';
import path from 'path';

// Function to create a worker and return a promise for the result
function runBlockingTaskAsync(n: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const worker = new Worker(path.resolve(__dirname, 'worker.js'));

    worker.postMessage(n);

    worker.on('message', (result: number) => resolve(result));

    worker.on('error', reject);

    worker.on('exit', (code) => {
      if (code !== 0) {
        reject(new Error(`Worker stopped with exit code ${code}`));
      }
    });
  });
}

// Using async/await to run multiple workers in parallel
async function runMultipleTasks() {
  console.log("Running multiple tasks in parallel...");

  // Run two blocking tasks in parallel
  const [result1, result2] = await Promise.all([
    runBlockingTaskAsync(10),
    runBlockingTaskAsync(15)
  ]);

  console.log(`Result 1: ${result1}`);  // Outputs factorial of 10
  console.log(`Result 2: ${result2}`);  // Outputs factorial of 15
}

runMultipleTasks();
```

### Explanation:

- **`Promise.all()`**: This method allows us to run multiple promises in parallel. In this case, it runs two worker threads simultaneously, processing the factorial calculations in parallel.
- **Multiple Workers**: We create two workers, each calculating a different factorial, and wait for both results before logging them.

This approach ensures that multiple CPU-bound tasks can be handled concurrently without blocking the main thread.

---

## Error Handling in Worker Threads

Handling errors in worker threads is essential for building robust applications. You should always listen for errors in both the worker and the main thread.

### Example: Handling Errors in Workers

#### Worker Code (`worker.ts`)

Modify the worker to simulate an error when a negative number is received:

```typescript
import { parentPort } from 'worker_threads';

function blockingTask(n: number): number {
  if (n < 0) throw new Error("Negative numbers are not allowed");
  if (n <= 1) return 1;
  return n * blockingTask(n - 1);
}

if (parentPort) {
  parentPort.on('message', (n: number) => {
    try {
      const result = blockingTask(n);
      parentPort.postMessage(result);
    } catch (error) {
      parentPort.postMessage(error.message);
    }
  });
}
```

In the main thread, ensure you handle worker errors:

```typescript
worker.on('message', (result) => {
  if (typeof result === 'string' && result.startsWith('Error')) {
    console.error(`Worker error: ${result}`);
  } else {
    console.log(`Result: ${result}`);
  }
});
```

---

## Conclusion

Handling blocking functions in Node.js and TypeScript can be challenging, but by converting them into asynchronous tasks using **`async/await`** or **Worker Threads**, you can significantly improve performance and ensure non-blocking behavior. Whether you’re dealing with simple CPU-bound tasks or multiple parallel processes, these techniques ensure that your application remains responsive and scalable.

- **Wrap blocking functions in Promises**: This allows you to use `async/await` to make blocking operations asynchronous.
- **Leverage Worker Threads**: For CPU-bound tasks, using worker threads ensures parallel execution without blocking the event loop.
- **Run multiple tasks in parallel**: Using `Promise.all()` allows you to run several asynchronous operations concurrently, improving efficiency.

By following these best practices, you can handle blocking functions more effectively in your TypeScript applications.

