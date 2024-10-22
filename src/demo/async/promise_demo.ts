// npx ts-node -r tsconfig-paths/register src/demo/async/promise_demo.ts

// Demo of using Promises in TypeScript with sequential execution:
// These examples (1-6) are executed one after another, ensuring each completes before the next starts.
// We achieve this by using async and await, providing a clean and manageable way to handle asynchronous execution in TypeScript.

// A helper function simulating an asynchronous task with a random delay
function asyncTask(taskName: string, delay: number): Promise<string> {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const success = Math.random() > 0.3; // 70% chance of success
            if (success) {
                resolve(`${taskName} completed`); // Resolves the promise if the task is successful
            } else {
                reject(`${taskName} failed`); // Rejects the promise if the task fails
            }
        }, delay); // The task simulates a delay (in milliseconds) before completion
    });
}

// Example 1: Using `Promise.resolve()` and `Promise.reject()`
async function example1(): Promise<void> {
    console.log("\nExample 1: Promise.resolve() and Promise.reject()");
    // `Promise.resolve()` creates a promise that resolves immediately with the provided value
    Promise.resolve("Resolved value").then(console.log);  // Output: Resolved value

    // `Promise.reject()` creates a promise that rejects immediately with the provided reason
    Promise.reject("Rejected value").catch(console.log);  // Output: Rejected value

    // This async function adds a delay of 1 second (1000 ms) before proceeding to the next example
    await new Promise(resolve => setTimeout(resolve, 1000)); // Simulating async delay
}

// Example 2: Using `Promise.all()`
async function example2(): Promise<void> {
    console.log("\nExample 2: Promise.all()");

    // We create three asynchronous tasks with varying delays
    const tasks = [
        asyncTask("Task 1", 1000),
        asyncTask("Task 2", 2000),
        asyncTask("Task 3", 1500)
    ];

    // `Promise.all()` runs all tasks concurrently and resolves if all promises resolve
    // If any promise rejects, the entire `Promise.all()` rejects
    try {
        const results = await Promise.all(tasks); // Wait for all tasks to complete
        console.log("All tasks completed:", results);  // Outputs the results of all tasks if they succeed
    } catch (error) {
        console.log("One of the tasks failed:", error);  // Outputs the error if any task fails
    }
}

// Example 3: Using `Promise.allSettled()`
async function example3(): Promise<void> {
    console.log("\nExample 3: Promise.allSettled()");

    // Creating tasks with the possibility of failure
    const tasksWithFailures = [
        asyncTask("Task A", 1000),
        asyncTask("Task B", 2000),
        asyncTask("Task C", 1500)
    ];

    // `Promise.allSettled()` waits for all tasks to settle (whether resolved or rejected)
    const results = await Promise.allSettled(tasksWithFailures);
    results.forEach((result, index) => {
        // Checking if each result is fulfilled or rejected
        if (result.status === "fulfilled") {
            console.log(`Task ${index + 1} succeeded:`, result.value); // Log success for fulfilled tasks
        } else {
            console.log(`Task ${index + 1} failed:`, result.reason); // Log failure for rejected tasks
        }
    });
}

// Example 4: Using `Promise.race()`
async function example4(): Promise<void> {
    console.log("\nExample 4: Promise.race()");

    // Similar to `Promise.all()`, we create three asynchronous tasks
    const tasks = [
        asyncTask("Task 1", 1000),
        asyncTask("Task 2", 2000),
        asyncTask("Task 3", 1500)
    ];

    // `Promise.race()` resolves or rejects as soon as the first task is settled
    try {
        const result = await Promise.race(tasks); // Returns the result of the first completed task (resolved or rejected)
        console.log("First task completed:", result);  // Outputs the first completed task's result
    } catch (error) {
        console.log("First task failed:", error);  // Outputs if the first completed task fails
    }
}

// Example 5: Using `Promise.any()`
async function example5(): Promise<void> {
    console.log("\nExample 5: Promise.any()");

    // Similar to the previous example, we create tasks with possible failure
    const tasksWithFailures = [
        asyncTask("Task A", 1000),
        asyncTask("Task B", 2000),
        asyncTask("Task C", 1500)
    ];

    // `Promise.any()` resolves when the first successful task resolves
    // It only rejects if all tasks reject
    try {
        const result = await Promise.any(tasksWithFailures);  // Waits for the first successful task
        console.log("At least one task succeeded:", result);  // Outputs the result of the first successful task
    } catch (error) {
        console.log("All tasks failed:", error);  // Outputs if all tasks fail
    }
}

// Example 6: Using `Promise.finally()`
async function example6(): Promise<void> {
    console.log("\nExample 6: Promise.finally()");

    // `Promise.finally()` is called whether the promise resolves or rejects
    await asyncTask("Final Task", 1000)
        .then(result => console.log(result))  // Logs result if task succeeds
        .catch(error => console.log(error))   // Logs error if task fails
        .finally(() => console.log("Cleanup after task execution"));  // Runs cleanup code regardless of success or failure
}

// Run all examples sequentially
async function runPromiseExamples(): Promise<void> {
    // Sequentially await each example function
    await example1();
    await example2();
    await example3();
    await example4();
    await example5();
    await example6();
}

// Trigger the execution of all examples in sequence
runPromiseExamples().catch(err => console.error(err));