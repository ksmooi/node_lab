# Parallel and Sequential Execution with Promise

In modern Node.js applications, efficiently handling multiple asynchronous operations is crucial for performance and reliability. Depending on the nature of the tasks, you may need to run asynchronous functions either in parallel or sequentially based on certain conditions. In this article, we will explore the best practices for executing multiple async functions using **TypeScript**, utilizing both **parallel** and **sequential** strategies with examples.

### Table of Contents
1. [Introduction to Asynchronous Operations](#introduction)
2. [Parallel Execution Using `Promise.all()`](#parallel-execution)
3. [Sequential Execution with Conditional Logic](#sequential-execution)
4. [Conclusion](#conclusion)

---

<a name="introduction"></a>
## Introduction to Asynchronous Operations

Asynchronous operations are at the core of Node.js. Whether you're fetching data from APIs, reading from a database, or performing file operations, handling these tasks without blocking the main thread is vital. In TypeScript, **async/await** and **Promises** are standard tools to manage these operations. 

Depending on your application's requirements, you may need to execute multiple asynchronous tasks either **concurrently (parallel)** or in **sequence**. TypeScript, with its type safety, helps ensure you handle these cases correctly.

---

<a name="parallel-execution"></a>
## Parallel Execution Using `Promise.all()`

When multiple asynchronous functions are **independent of each other**, you can execute them in parallel to save time. TypeScript's `Promise.all()` allows you to wait for all the promises to resolve and then handle their results collectively.

### Example: Parallel Execution of API Calls

In this example, we fetch data from three different APIs. Depending on the condition, we choose which API requests to execute:

```typescript
async function fetchData1(): Promise<string> {
    return new Promise((resolve) => setTimeout(() => resolve('Data from API 1'), 1000));
}

async function fetchData2(): Promise<string> {
    return new Promise((resolve) => setTimeout(() => resolve('Data from API 2'), 1500));
}

async function fetchData3(): Promise<string> {
    return new Promise((resolve) => setTimeout(() => resolve('Data from API 3'), 500));
}

async function callAsyncFunctions(condition: string): Promise<void> {
    const promises: Promise<string>[] = [];

    if (condition === 'option1') {
        promises.push(fetchData1());
        promises.push(fetchData2());
    } else if (condition === 'option2') {
        promises.push(fetchData3());
    }

    try {
        // `Promise.all` runs the functions in parallel and waits for all to complete
        const results = await Promise.all(promises);
        console.log('Results:', results);
    } catch (error) {
        console.error('Error occurred while fetching data:', error);
    }
}

// Example usage
callAsyncFunctions('option1');  // Calls fetchData1 and fetchData2 concurrently
callAsyncFunctions('option2');  // Calls fetchData3
```

### Explanation:
- **`Promise.all()`**: Executes an array of promises concurrently. It waits for all promises to resolve before proceeding. If any promise rejects, it will return an error.
- **Use Case**: Ideal for API calls, database queries, or file system operations that do not depend on each other.

### Benefits:
- **Time-saving**: Since all operations start simultaneously, it minimizes the total execution time compared to sequential execution.
- **Error Handling**: `Promise.all()` fails fast. If one of the promises rejects, the `catch` block handles the error immediately.

---

<a name="sequential-execution"></a>
## Sequential Execution with Conditional Logic

In cases where the execution order matters, or where one operation depends on the result of another, you can execute the functions sequentially. In this case, we use **async/await** along with conditional logic to control the flow.

### Example: Sequential Execution Based on Conditions

Here, we demonstrate how to run asynchronous functions in sequence, ensuring one completes before the next begins:

```typescript
async function executeConditionally(condition: string): Promise<void> {
    if (condition === 'option1') {
        const result1 = await fetchData1();
        console.log('Result from API 1:', result1);

        const result2 = await fetchData2();
        console.log('Result from API 2:', result2);
    } else if (condition === 'option2') {
        const result3 = await fetchData3();
        console.log('Result from API 3:', result3);
    }
}

// Example usage
executeConditionally('option1');  // Calls fetchData1 and fetchData2 in sequence
executeConditionally('option2');  // Calls fetchData3
```

### Explanation:
- **Sequential Execution**: Each function waits for the previous one to complete before moving to the next.
- **Use Case**: Suitable when the operations are dependent on each other, such as querying a database where each query relies on the result of the previous one.

### Benefits:
- **Order of Execution**: Guarantees that operations happen in a specific sequence.
- **Error Handling**: Errors can be caught at each step, and subsequent operations can be adjusted based on prior results.

---

<a name="conclusion"></a>
## Conclusion

In **TypeScript**, handling multiple asynchronous functions can be done efficiently by leveraging both **parallel** and **sequential** execution strategies:

- **Parallel Execution (`Promise.all()`)**: Ideal for tasks that can run concurrently, like independent API calls or file system operations. It reduces overall execution time by performing operations in parallel.
- **Sequential Execution**: Use when the order of execution matters, or when subsequent tasks depend on the results of earlier ones.

### Key Takeaways:
- **Use `Promise.all()`** when you need to run tasks concurrently and wait for all results.
- **Use async/await with conditional logic** when you need to control the order of execution.

By using TypeScript's type safety features along with `Promise.all()` and `async/await`, you can build robust, maintainable, and efficient asynchronous operations in your Node.js applications.

