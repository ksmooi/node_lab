# Introduction to `async` Functions and `await` Keyword

`async` and `await` are powerful constructs in JavaScript (and TypeScript) that simplify working with asynchronous code by making it look and behave more like synchronous code. They are built on top of **Promises** and provide a more intuitive and readable way to handle asynchronous operations.

## What is an `async` Function?

An `async` function is a function that always returns a **Promise**. It allows you to write asynchronous code using a synchronous style. By marking a function as `async`, you're telling the runtime that this function will return a promise, and you can use the `await` keyword inside it to wait for other asynchronous operations.

### Syntax:
```typescript
async function someAsyncFunction() {
    // asynchronous logic
}
```

## Characteristics of an `async` Function:

1. **Always Returns a Promise**:
   - An `async` function always returns a promise, even if you don't explicitly return one.
   - If the function returns a value, it will be automatically wrapped in a resolved promise.
   - If an error is thrown, it will be wrapped in a rejected promise.

### Example:
```typescript
async function greet() {
    return "Hello, World!";
}

greet().then(message => console.log(message));  // Logs: "Hello, World!"
```

- Here, the function `greet()` returns a string `"Hello, World!"`, but since it's marked as `async`, it actually returns a promise that resolves to `"Hello, World!"`.
- The `.then()` method is used to log the resolved value.

### Error Handling in `async` Functions:
- If an error is thrown inside an `async` function, the function will return a rejected promise.
  
```typescript
async function throwError() {
    throw new Error("Oops!");
}

throwError().catch(err => console.error(err));  // Logs: "Error: Oops!"
```

- The error is automatically converted into a rejected promise, and the `.catch()` method handles it.

## What is `await`?

The **`await`** keyword can only be used inside an `async` function. It is used to pause the execution of an `async` function until a promise is either **resolved** or **rejected**. When the promise resolves, `await` returns the value that the promise was resolved with. If the promise is rejected, `await` throws the error.

### Syntax:
```typescript
let result = await someAsyncFunction();
```

- The `await` keyword waits for the promise returned by `someAsyncFunction()` to resolve and assigns the resolved value to `result`.
- If `someAsyncFunction()` rejects, the `await` keyword throws the error, which can be caught with a `try-catch` block.

## Example: Using `async` and `await`

Let’s look at how to use `async` and `await` with a promise-returning function like `fetch`:

```typescript
async function fetchData(url: string) {
    try {
        let response = await fetch(url);  // Wait until the fetch promise resolves
        let data = await response.json();  // Wait until the json promise resolves
        return data;  // Return the fetched data
    } catch (error) {
        console.error("Error fetching data:", error);
        throw error;  // Rethrow the error if needed
    }
}

fetchData('https://api.example.com/data')
    .then(data => console.log(data))
    .catch(err => console.error(err));
```

## Key Points About `await`:

1. **Pauses the Function**:
   - When `await` is used, it pauses the execution of the `async` function until the promise settles (either resolves or rejects).
   
2. **Works Only in `async` Functions**:
   - `await` can only be used inside functions marked as `async`. If you try to use it outside an `async` function, you’ll get a syntax error.

3. **Error Handling**:
   - Errors that occur when awaiting a promise can be caught using `try-catch`, making error handling straightforward and readable.

## Example: Handling Errors with `await`

```typescript
async function getData(url: string) {
    try {
        let response = await fetch(url);
        if (!response.ok) {
            throw new Error("Network error");
        }
        return await response.json();
    } catch (error) {
        console.error("Failed to fetch data:", error);
    }
}

getData('https://invalid-url.com');
```

In this example:
- If the fetch call fails (e.g., due to a network error), the error is caught and logged.

## Using `await` with Non-Promise Values

If you `await` a non-promise value, `await` simply returns the value immediately, without any delay.

```typescript
async function example() {
    let result = await 10;
    console.log(result);  // Logs: 10
}

example();
```

## `await` and Promise.all

You can use `await` with **`Promise.all()`** to wait for multiple asynchronous operations to complete in parallel, instead of sequentially.

### Example:
```typescript
async function fetchMultipleUrls(urls: string[]) {
    let promises = urls.map(url => fetch(url));
    let responses = await Promise.all(promises);  // Wait for all promises to resolve
    let data = await Promise.all(responses.map(response => response.json()));
    return data;
}

fetchMultipleUrls(['https://api.example.com/1', 'https://api.example.com/2'])
    .then(data => console.log(data))
    .catch(err => console.error(err));
```

## `async` and `await` with Loops

Be cautious when using `await` inside loops, as it can cause sequential execution when parallel execution is desired.

### Sequential Execution with `await` in a Loop:
```typescript
async function processUrlsSequentially(urls: string[]) {
    for (const url of urls) {
        let response = await fetch(url);  // Wait for each fetch to complete one after another
        console.log(await response.json());
    }
}
```

### Parallel Execution with `Promise.all()`:
```typescript
async function processUrlsInParallel(urls: string[]) {
    let promises = urls.map(url => fetch(url));
    let responses = await Promise.all(promises);  // Fetch all URLs in parallel
    let data = await Promise.all(responses.map(response => response.json()));
    data.forEach(result => console.log(result));
}
```

- **Sequential**: In the first example, the URLs are fetched one after another.
- **Parallel**: In the second example, all URLs are fetched in parallel, and `Promise.all` waits for all the promises to resolve.

## Summary

- **`async`**: Declares an asynchronous function that always returns a promise. It allows you to use `await` inside it.
  
- **`await`**: Pauses the execution of the `async` function until the promise settles. It makes asynchronous code look synchronous, improving readability and maintainability.

## Key Benefits:
1. **Simplicity**: `async`/`await` simplifies promise-based asynchronous code, removing the need for nested `.then()` and `.catch()` chains.
2. **Readability**: Code using `async`/`await` is more readable and easier to reason about, as it looks like synchronous code.
3. **Error Handling**: You can use `try-catch` with `await` to handle errors more intuitively compared to promise-based chains.

In conclusion, `async`/`await` provides a clean, powerful way to work with asynchronous operations in TypeScript, making it easier to handle promises and work with asynchronous tasks in a readable and maintainable way.

