// npx ts-node -r tsconfig-paths/register src/demo/generic/generic_functions_demo.ts

// 1. Basic Generic Function
/**
 * A simple generic function that returns the argument passed to it.
 * 
 * @param arg - The argument of type T.
 * @returns The argument of type T.
 */
function identity<T>(arg: T): T {
    return arg;
}

// Usage of the basic generic function
console.log(identity<string>("Hello, TypeScript!")); // Output: "Hello, TypeScript!"
console.log(identity<number>(42));                   // Output: 42


// 2. Generic Function with Arrays
/**
 * A generic function that returns the first element of an array.
 * 
 * @param arr - The array of elements of type T.
 * @returns The first element of the array of type T.
 */
function getFirstElement<T>(arr: T[]): T {
    return arr[0];
}

// Usage with arrays
console.log(getFirstElement<number>([10, 20, 30]));  // Output: 10
console.log(getFirstElement<string>(["apple", "banana", "cherry"])); // Output: "apple"


// 3. Generic Function with Multiple Type Parameters
/**
 * A generic function that merges two objects into one.
 * 
 * @param obj1 - The first object of type T.
 * @param obj2 - The second object of type U.
 * @returns The merged object of type T & U (intersection type).
 */
function mergeObjects<T, U>(obj1: T, obj2: U): T & U {
    return { ...obj1, ...obj2 };
}

// Usage of mergeObjects
const merged = mergeObjects({ name: "Alice" }, { age: 25 });
console.log(merged);  // Output: { name: "Alice", age: 25 }


// 4. Generic Function with Constraints
/**
 * A generic function that logs the length property of an argument.
 * The type T is constrained to objects that have a `length` property.
 * 
 * @param arg - An argument of type T which extends Lengthwise.
 * @returns The same argument of type T.
 */
interface Lengthwise {
    length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
    console.log(arg.length);
    return arg;
}

// Usage of logLength
logLength("Hello!");               // Output: 6 (length of the string)
logLength([1, 2, 3, 4, 5]);        // Output: 5 (length of the array)
// logLength(123);                  // Error: Type 'number' does not have a 'length' property


// 5. Generic Function with Default Types
/**
 * A generic function that creates a pair of elements.
 * Default types are provided: T = string, U = number.
 * 
 * @param first - The first element of type T.
 * @param second - The second element of type U.
 * @returns A tuple [T, U] containing the two elements.
 */
function createPair<T = string, U = number>(first: T, second: U): [T, U] {
    return [first, second];
}

// Usage with default types
console.log(createPair("Hello", 42));     // Output: ["Hello", 42]
console.log(createPair<number, string>(100, "Test"));  // Output: [100, "Test"]


// 6. Generic Function with Type Inference
/**
 * A generic function that reverses an array.
 * TypeScript infers the type T based on the array elements.
 * 
 * @param arr - The array of elements of type T.
 * @returns The reversed array of type T[].
 */
function reverseArray<T>(arr: T[]): T[] {
    return arr.reverse();
}

// Usage with type inference
console.log(reverseArray([1, 2, 3]));       // Output: [3, 2, 1]
console.log(reverseArray(["a", "b", "c"])); // Output: ["c", "b", "a"]


// 7. Generic Function with Promises
/**
 * A generic function that simulates asynchronous processing of data.
 * The function returns a promise that resolves with the provided value after a delay.
 * 
 * @template T - The type of the input and output value.
 * @param value - The input value to process.
 * @param delay - The delay in milliseconds before the promise is resolved.
 * @returns A Promise that resolves to the provided value.
 */
function asyncProcess<T>(value: T, delay: number): Promise<T> {
    return new Promise<T>((resolve, reject) => {
        setTimeout(() => {
            if (value) {
                console.log(`Processing completed for value: ${value}`);
                resolve(value);
            } else {
                reject("Error: No value provided!");
            }
        }, delay);
    });
}

// Example 1: Processing a string
async function processString() {
    try {
        const result = await asyncProcess<string>("Hello, Generic Promise!", 1000);
        console.log("Result (String):", result);
    } catch (error) {
        console.error(error);
    }
}

// Example 2: Processing a number
async function processNumber() {
    try {
        const result = await asyncProcess<number>(42, 500);
        console.log("Result (Number):", result);
    } catch (error) {
        console.error(error);
    }
}

// Example 3: Processing an object
interface User {
    id: number;
    name: string;
}

async function processObject() {
    const user: User = { id: 1, name: "Alice" };
    try {
        const result = await asyncProcess<User>(user, 700);
        console.log("Result (User):", result);
    } catch (error) {
        console.error(error);
    }
}

// Running the examples
processString();  // Expected output after 1 second: "Processing completed for value: Hello, Generic Promise!"
processNumber();  // Expected output after 0.5 second: "Processing completed for value: 42"
processObject();  // Expected output after 0.7 second: "Processing completed for value: { id: 1, name: 'Alice' }"



