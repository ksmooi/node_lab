# Mastering the `Queue<T>` Data Structure in TypeScript: A Comprehensive Guide with Rich Examples

In **TypeScript**, implementing custom data structures allows developers to optimize solutions for specific use cases. One such data structure is the **Queue**. A **queue** is a **FIFO** (First In, First Out) data structure, meaning that the first element added to the queue will be the first one to be removed. This structure is widely used in algorithms, scheduling tasks, and real-world scenarios like customer service lines.

In this article, we will walk through how to implement a **generic Queue class (`Queue<T>`)** in TypeScript, and provide detailed examples covering **accessing**, **iterating**, **manipulating** (insert, update, delete), and **advanced methods**.

---

### Table of Contents

1. What is a Queue?
2. Implementing `Queue<T>` in TypeScript
3. Accessing Queue Elements
4. Iterating Over a Queue
5. Manipulating a Queue (Insert, Update, Delete)
6. Advanced Queue Methods
7. Conclusion

---

### 1. What is a Queue?

A **queue** is a linear data structure that follows the **FIFO (First In, First Out)** principle. This means that the first element added to the queue will be the first one to be removed, much like a real-world queue (e.g., a line of people waiting for a service).

#### Common operations in a Queue:
- **`enqueue(item)`**: Adds an element to the end of the queue.
- **`dequeue()`**: Removes an element from the front of the queue.
- **`peek()`**: Returns the element at the front of the queue without removing it.
- **`size()`**: Returns the number of elements in the queue.
- **`isEmpty()`**: Returns `true` if the queue is empty, otherwise `false`.

---

### 2. Implementing `Queue<T>` in TypeScript

Here is a simple implementation of a **generic Queue class** in TypeScript:

```typescript
class Queue<T> {
    private storage: T[] = [];

    // Adds an item to the queue
    enqueue(item: T): void {
        this.storage.push(item);
    }

    // Removes an item from the queue (FIFO)
    dequeue(): T | undefined {
        return this.storage.shift();
    }

    // Returns the item at the front of the queue without removing it
    peek(): T | undefined {
        return this.storage[0];
    }

    // Returns the size of the queue
    size(): number {
        return this.storage.length;
    }

    // Returns true if the queue is empty, false otherwise
    isEmpty(): boolean {
        return this.size() === 0;
    }

    // Makes the queue iterable
    [Symbol.iterator](): Iterator<T> {
        let index = 0;
        const storage = this.storage;

        return {
            next(): IteratorResult<T> {
                if (index < storage.length) {
                    return { value: storage[index++], done: false };
                } else {
                    return { value: undefined, done: true };
                }
            }
        };
    }
}
```

This implementation uses an internal array (`storage`) to hold the elements in the queue. The class is generic (`<T>`), meaning it can store items of any type.

---

### 3. Accessing Queue Elements

#### Example 1: Using `peek()` to Access the Front of the Queue

The `peek()` method allows you to access the item at the front of the queue without removing it.

```typescript
const queue = new Queue<number>();
queue.enqueue(10);
queue.enqueue(20);
queue.enqueue(30);

console.log(queue.peek());  // Output: 10
console.log(queue.size());  // Output: 3
```

- **`enqueue()`** adds items to the queue.
- **`peek()`** returns the first element (10) without removing it.
- **`size()`** returns the number of elements (3).

#### Example 2: Checking if the Queue is Empty

```typescript
console.log(queue.isEmpty());  // Output: false

queue.dequeue();  // Removes 10
queue.dequeue();  // Removes 20
queue.dequeue();  // Removes 30

console.log(queue.isEmpty());  // Output: true
```

- After dequeuing all elements, **`isEmpty()`** returns `true`, indicating the queue is empty.

---

### 4. Iterating Over a Queue

We’ve implemented the `[Symbol.iterator]()` method, making the queue iterable using constructs like `for...of`.

#### Example 3: Iterating Over Queue Elements

```typescript
const queue = new Queue<string>();
queue.enqueue("apple");
queue.enqueue("banana");
queue.enqueue("cherry");

for (const item of queue) {
    console.log(item);  // Output: apple, banana, cherry
}
```

- By implementing the **iterator protocol**, you can use `for...of` to loop through the elements of the queue.
- The queue is not modified during iteration.

---

### 5. Manipulating a Queue (Insert, Update, Delete)

#### Example 4: Inserting Elements (`enqueue()`)

```typescript
const taskQueue = new Queue<string>();
taskQueue.enqueue("Task 1");
taskQueue.enqueue("Task 2");
taskQueue.enqueue("Task 3");

console.log(taskQueue.size());  // Output: 3
```

- **`enqueue()`** adds new elements to the end of the queue.

#### Example 5: Removing Elements (`dequeue()`)

```typescript
console.log(taskQueue.dequeue());  // Output: Task 1
console.log(taskQueue.size());     // Output: 2
```

- **`dequeue()`** removes the first element (FIFO) from the queue, and the size is updated accordingly.

#### Example 6: Updating or Reordering Queue (Manual Approach)

While there is no built-in "update" method in a typical queue, you can dequeue all elements, modify them, and then enqueue them again in the desired order.

```typescript
let item = taskQueue.dequeue();  // Remove the first item
taskQueue.enqueue(item!);        // Re-enqueue it to the back

// Now "Task 2" is at the front, and "Task 1" is moved to the back
for (const task of taskQueue) {
    console.log(task);  // Output: Task 2, Task 3, Task 1
}
```

---

### 6. Advanced Queue Methods

#### Example 7: Using the Queue with Custom Objects

You can store custom objects in the queue by leveraging TypeScript’s generics.

```typescript
interface Customer {
    name: string;
    priority: number;
}

const customerQueue = new Queue<Customer>();

customerQueue.enqueue({ name: "Alice", priority: 1 });
customerQueue.enqueue({ name: "Bob", priority: 2 });
customerQueue.enqueue({ name: "Charlie", priority: 1 });

// Processing customers in the order they were added
while (!customerQueue.isEmpty()) {
    const customer = customerQueue.dequeue();
    console.log(`Processing customer: ${customer?.name}, Priority: ${customer?.priority}`);
}
// Output:
// Processing customer: Alice, Priority: 1
// Processing customer: Bob, Priority: 2
// Processing customer: Charlie, Priority: 1
```

This example demonstrates how you can use the queue to handle more complex data types such as objects.

#### Example 8: Limiting the Queue Size

You can extend the `Queue` class to add a maximum size limit.

```typescript
class LimitedQueue<T> extends Queue<T> {
    private maxSize: number;

    constructor(maxSize: number) {
        super();
        this.maxSize = maxSize;
    }

    enqueue(item: T): void {
        if (this.size() < this.maxSize) {
            super.enqueue(item);
        } else {
            console.log("Queue is full, cannot add more items.");
        }
    }
}

const limitedQueue = new LimitedQueue<number>(2);
limitedQueue.enqueue(10);
limitedQueue.enqueue(20);
limitedQueue.enqueue(30);  // Output: Queue is full, cannot add more items.
```

This **`LimitedQueue`** class adds a **maxSize** constraint, preventing elements from being added when the queue is full.

#### Example 9: Reversing the Queue (Custom Method)

You can create a custom method to reverse the queue’s elements.

```typescript
class Queue<T> {
    // existing methods...

    reverse(): void {
        this.storage.reverse();
    }
}

// Reversing queue elements
queue.reverse();
for (const item of queue) {
    console.log(item);  // Output: cherry, banana, apple
}
```

- The **`reverse()`** method reverses the order of the elements in the queue, which may be useful in specific scenarios.

---

### 7. Conclusion

The **`Queue<T>`** data structure is a versatile and essential tool in TypeScript for handling tasks where **FIFO (First In, First Out)** ordering is required. By implementing this class, you gain a deeper understanding of core data structure principles, and the use of TypeScript generics ensures that it can work with any data type.

**Key Takeaways:**
- **Queue Basics**: Operations like **enqueue**, **dequeue**, and **peek** are foundational.
- **Iteration Support**: With the implementation of **`[Symbol.iterator]()`**, the queue can be iterated using `for...of`.
- **Manipulation**: You can insert, remove, and modify elements in the queue while maintaining the FIFO order.
- **Advanced Methods**: Custom methods like **`reverse()`** or constraints like **`LimitedQueue`** add more flexibility to the queue.

By mastering the **`Queue<T>`** class, you can handle real-world problems like task scheduling, buffering, and customer service systems with ease.


