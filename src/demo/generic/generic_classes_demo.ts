// npx ts-node -r tsconfig-paths/register src/demo/generic/generic_classes_demo.ts

// 1. Basic Generic Class Example: Box<T>
/**
 * A generic class `Box<T>` that can store and retrieve a value of any type.
 * 
 * @template T - The type of the content stored in the Box.
 */
class Box<T> {
    private _content: T;

    constructor(content: T) {
        this._content = content;
    }

    // Get the content of the Box
    getContent(): T {
        return this._content;
    }

    // Set a new content value for the Box
    setContent(newContent: T): void {
        this._content = newContent;
    }
}

// === Example Usage: Basic Generic Class ===
const numberBox = new Box<number>(123);                     // Box storing a number
console.log("Number Box Content:", numberBox.getContent()); // Output: 123

const stringBox = new Box<string>("Hello, TypeScript!");    // Box storing a string
console.log("String Box Content:", stringBox.getContent()); // Output: Hello, TypeScript!

numberBox.setContent(456);  // Update the content of the number box
console.log("Updated Number Box Content:", numberBox.getContent()); // Output: 456


// 2. Generic Class with Constraints Example: Collection<T extends HasLength>
/**
 * Interface that enforces a `length` property.
 */
interface HasLength {
    length: number;
}

/**
 * A generic class `Collection<T>` that works with types that have a `length` property.
 * It stores an array of items and provides methods to retrieve them.
 * 
 * @template T - The type of items in the collection, constrained to have a length property.
 */
class Collection<T extends HasLength> {
    private items: T[];

    constructor(items: T[]) {
        this.items = items;
    }

    // Get the first item in the collection
    getFirstItem(): T {
        return this.items[0];
    }

    // Calculate the total length of all items in the collection
    getTotalLength(): number {
        return this.items.reduce((acc, item) => acc + item.length, 0);
    }
}

// === Example Usage: Generic Class with Constraints ===
const stringCollection = new Collection<string>(["apple", "banana", "cherry"]);
console.log("First item in the collection:", stringCollection.getFirstItem()); // Output: apple
console.log("Total length of strings:", stringCollection.getTotalLength());    // Output: 16 (length of all strings)

const arrayCollection = new Collection<number[]>([[1, 2], [3, 4, 5]]);
console.log("First array in the collection:", arrayCollection.getFirstItem()); // Output: [1, 2]
console.log("Total length of all arrays:", arrayCollection.getTotalLength());  // Output: 5 (sum of lengths of arrays)


// 3. Generic Class with Multiple Type Parameters: Pair<T, U>
/**
 * A generic class `Pair<T, U>` that stores a pair of values of different types.
 * 
 * @template T - The type of the first value.
 * @template U - The type of the second value.
 */
class Pair<T, U> {
    private first: T;
    private second: U;

    constructor(first: T, second: U) {
        this.first = first;
        this.second = second;
    }

    // Get the first value
    getFirst(): T {
        return this.first;
    }

    // Get the second value
    getSecond(): U {
        return this.second;
    }
}

// === Example Usage: Generic Class with Multiple Type Parameters ===
const numberStringPair = new Pair<number, string>(1, "one");
console.log("First value (number):", numberStringPair.getFirst());   // Output: 1
console.log("Second value (string):", numberStringPair.getSecond()); // Output: one

const booleanArrayPair = new Pair<boolean, number[]>(true, [100, 200]);
console.log("First value (boolean):", booleanArrayPair.getFirst());  // Output: true
console.log("Second value (array):", booleanArrayPair.getSecond());  // Output: [100, 200]


// 4. Generic Stack Class Example Using Type Alias
/**
 * Type alias `StackItem<T>` for individual stack items.
 */
type StackItem<T> = T;

/**
 * A generic class `Stack<T>` implementing a stack (LIFO - Last In, First Out).
 * 
 * @template T - The type of elements in the stack.
 */
class Stack<T> {
    private items: StackItem<T>[] = [];

    // Push an item onto the stack
    push(item: StackItem<T>): void {
        this.items.push(item);
    }

    // Pop an item off the stack
    pop(): StackItem<T> | undefined {
        return this.items.pop();
    }

    // Peek at the top item without removing it
    peek(): StackItem<T> | undefined {
        return this.items[this.items.length - 1];
    }

    // Get the number of items in the stack
    size(): number {
        return this.items.length;
    }
}

// === Example Usage: Generic Stack Class ===
const numberStack = new Stack<number>();
numberStack.push(10);
numberStack.push(20);
numberStack.push(30);

console.log("Top of the stack:", numberStack.peek());  // Output: 30
console.log("Stack size:", numberStack.size());        // Output: 3

numberStack.pop();  // Removes 30
console.log("New top of the stack after pop:", numberStack.peek());  // Output: 20
console.log("Stack size after pop:", numberStack.size());            // Output: 2
