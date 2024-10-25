# A Comprehensive Guide to `CircularQueue<T>` in TypeScript: Implementation, Usage, and Examples

In **TypeScript**, implementing custom data structures can provide better control and optimization, especially when dealing with fixed-size data collections. One such structure is the **Circular Queue**, a **First-In-First-Out (FIFO)** data structure that efficiently utilizes space by "wrapping around" when it reaches the end of the queue.

This article explains how to implement a **generic `CircularQueue<T>`** in TypeScript and provides rich examples of accessing, iterating, manipulating (insert, update, delete), and using advanced methods.

---

### Table of Contents

1. What is a Circular Queue?
2. Why Use a Circular Queue?
3. Implementing `CircularQueue<T>` in TypeScript
4. Accessing Elements in a Circular Queue
5. Iterating Over a Circular Queue
6. Manipulating the Queue (Insert, Update, Delete)
7. Advanced Queue Methods
8. Conclusion

---

### 1. What is a Circular Queue?

A **Circular Queue** is a **FIFO** data structure with a **fixed size**, where the elements are stored in an array and the rear of the queue "wraps around" to the front when the end of the array is reached. This circular nature helps optimize memory usage by reusing previously emptied slots at the front of the queue.

---

### 2. Why Use a Circular Queue?

- **Efficient Memory Use**: Circular Queues avoid the issue of wasted space that regular queues may face once elements are dequeued.
- **Constant Time Operations**: Both enqueue (`O(1)`) and dequeue (`O(1)`) operations are performed in constant time.
- **Useful in Real-Time Systems**: Circular queues are ideal for buffering data streams, task scheduling, and other time-critical applications.

---

### 3. Implementing `CircularQueue<T>` in TypeScript

Here’s the implementation of a **generic `CircularQueue<T>`** in TypeScript that supports enqueue, dequeue, peek, and iteration in both directions (front-to-rear and rear-to-front).

```typescript
/**
 * Circular Queue implementation using an array.
 * 
 * The Circular Queue is a data structure that follows the FIFO principle 
 * (First In First Out) with a fixed size. When it reaches the end, it wraps 
 * around to the beginning (circular behavior). It supports enqueueing, 
 * dequeueing, peeking, and iteration in both front-to-rear and rear-to-front directions.
 * 
 * @template T The type of the elements in the queue.
 * @param {T[]} queue The array that holds the elements of the queue.
 * @param {number} frontIndex The index of the front element in the queue.
 * @param {number} rearIndex The index of the rear element in the queue.
 * @param {number} size The total size of the queue.
 */
export class CircularQueue<T> {
  private queue: T[];
  private frontIndex: number;
  private rearIndex: number;
  private size: number;

  /**
   * Initializes the circular queue with a fixed size.
   * @param {number} size The maximum size of the queue.
   */
  constructor(size: number) {
    this.queue = new Array(size);  // Initialize the queue with the given size
    this.frontIndex = -1;  // Set front index to -1 indicating an empty queue
    this.rearIndex = -1;   // Set rear index to -1 indicating an empty queue
    this.size = size;      // Set the total capacity of the queue
  }

  /**
   * Adds an item to the queue. If the queue is full, throws an error.
   * 
   * @param item The item being added to the queue.
   */
  enqueue(item: T): void {
    // Check if the queue is full
    if (
      (this.frontIndex == 0 && this.rearIndex == this.size - 1) ||
      this.rearIndex == (this.frontIndex - 1) % (this.size - 1)
    ) {
      throw new Error('Queue is full');
    } else if (this.frontIndex == -1) {
      // If queue is empty, initialize front and rear index
      this.frontIndex = 0;
      this.rearIndex = 0;
      this.queue[this.rearIndex] = item;
    } else if (this.rearIndex == this.size - 1 && this.frontIndex != 0) {
      // Wrap around if we reach the end of the array and there is space at the start
      this.rearIndex = 0;
      this.queue[this.rearIndex] = item;
    } else {
      // Increment rear index and add the item
      this.rearIndex++;
      this.queue[this.rearIndex] = item;
    }
  }

  /**
   * Removes and returns an item from the front of the queue. 
   * If the queue is empty, throws an error.
   * 
   * @returns {T | undefined} The item that was removed from the queue.
   */
  dequeue(): T | undefined {
    // Check if the queue is empty
    if (this.frontIndex == -1) {
      throw new Error('Queue is empty');
    }

    const item = this.queue[this.frontIndex];  // Get the item at the front

    // If there is only one element left, reset the queue
    if (this.frontIndex == this.rearIndex) {
      this.frontIndex = -1;
      this.rearIndex = -1;
    } else if (this.frontIndex == this.size - 1) {
      // Wrap around if we reach the end of the array
      this.frontIndex = 0;
    } else {
      // Move the front index forward
      this.frontIndex++;
    }

    return item;
  }

  /**
   * Returns the item at the front of the queue without removing it.
   * 
   * @returns {T | null | undefined} The item at the front or null if the queue is empty.
   */
  peek(): T | null | undefined {
    if (this.frontIndex == -1) {
      return null;  // Return null if the queue is empty
    }
    return this.queue[this.frontIndex];  // Return the front element
  }

  /**
   * Checks if the queue is empty.
   * 
   * @returns {boolean} True if the queue is empty, false otherwise.
   */
  isEmpty(): boolean {
    return this.frontIndex == -1;
  }

  /**
   * Returns the current number of elements in the queue.
   * 
   * @returns {number} The number of items in the queue.
   */
  length(): number {
    if (this.frontIndex == -1) {
      return 0;  // Return 0 if the queue is empty
    }

    if (this.rearIndex >= this.frontIndex) {
      // When rear index is ahead of front index, calculate normally
      return this.rearIndex - this.frontIndex + 1;
    }

    // If rear index has wrapped around, calculate the total count
    return this.size - (this.frontIndex - this.rearIndex - 1);
  }

  /**
   * Default iteration from front to rear.
   * Makes the CircularQueue iterable using `for...of` and similar constructs.
   * 
   * @returns {Iterator<T>} An iterator to iterate over the queue from front to rear.
   */
  [Symbol.iterator](): Iterator<T> {
    let index = this.frontIndex;  // Start at the front index
    let count = 0;  // Track the number of items iterated over
    const storage = this.queue;
    const totalItems = this.length();  // Total number of elements in the queue

    return {
      next: (): IteratorResult<T> => {
        if (count >= totalItems || index === -1) {
          // Stop iteration if all items have been iterated
          return { value: undefined, done: true };
        }

        const value = storage[index];  // Get the current item
        index = (index + 1) % this.size;  // Move index forward circularly
        count++;
        return { value: value, done: false };
      }
    };
  }

  /**
   * Reverse iteration from rear to front.
   * Allows iterating over the queue from rear to front using a custom iterator.
   * 
   * @returns {Iterator<T>} An iterator to iterate over the queue from rear to front.
   */
  reverseIterator(): Iterator<T> {
    let index = this.rearIndex;  // Start at the rear index
    let count = 0;
    const storage = this.queue;
    const totalItems = this.length();  // Total number of elements in the queue

    return {
      next: (): IteratorResult<T> => {
        if (count >= totalItems || index === -1) {
          // Stop iteration if all items have been iterated
          return { value: undefined, done: true };
        }

        const value = storage[index];  // Get the current item
        index = (index - 1 + this.size) % this.size;  // Move index backward circularly
        count++;
        return { value: value, done: false };
      }
    };
  }
}

// Example usage:
const circularQueue = new CircularQueue<number>(5);
circularQueue.enqueue(10);  // Adds 10
circularQueue.enqueue(20);  // Adds 20
circularQueue.enqueue(30);  // Adds 30
circularQueue.enqueue(40);  // Adds 40
circularQueue.enqueue(50);  // Adds 50

// Iterating from front to rear
console.log('Front to Rear:');
for (const item of circularQueue) {
  console.log(item);  // Output: 10, 20, 30, 40, 50
}

// Iterating from rear to front
console.log('Rear to Front:');
const reverseIterator = circularQueue.reverseIterator();
let result = reverseIterator.next();
while (!result.done) {
  console.log(result.value);  // Output: 50, 40, 30, 20, 10
  result = reverseIterator.next();
}
```

---

### 4. Accessing Elements in a Circular Queue

The **`peek()`** method allows you to view the element at the front of the queue without removing it, while **`isEmpty()`** checks if the queue is empty.

#### Example: Accessing Front Element and Checking if Empty

```typescript
const queue = new CircularQueue<number>(3);

queue.enqueue(10);
queue.enqueue(20);

console.log(queue.peek());  // Output: 10
console.log(queue.isEmpty());  // Output: false

queue.dequeue();
console.log(queue.peek());  // Output: 20
```

In this example:
- **`peek()`** returns the front element of the queue without removing it.
- **`isEmpty()`** returns `false` when the queue contains elements.

---

### 5. Iterating Over a Circular Queue

The **`[Symbol.iterator]()`** method allows iteration from **front-to-rear**, and the **`reverseIterator()`** method provides iteration from **rear-to-front**.

#### Example: Iterating from Front to Rear and Rear to Front

```typescript
const circularQueue = new CircularQueue<number>(5);
circularQueue.enqueue(1);
circularQueue.enqueue(2);
circularQueue.enqueue(3);
circularQueue.enqueue(4);
circularQueue.enqueue(5);

// Iterating front to rear
console.log('Front to Rear:');
for (const item of circularQueue) {
  console.log(item);          // Output: 1, 2, 3, 4, 5
}

// Iterating rear to front
console.log('Rear to Front:');
const reverseIter = circularQueue.reverseIterator();
for (let result = reverseIter.next(); !result.done; result = reverseIter.next()) {
  console.log(result.value);  // Output: 5, 4, 3, 2, 1
}
```

In this example:
- We use `for...of` to iterate from front to rear.
- We manually use the `reverseIterator()` method to traverse the queue from rear to front.

---

### 6. Manipulating the Queue (Insert, Update, Delete)

#### Example: Enqueuing and Dequeuing Elements

```typescript
const taskQueue = new CircularQueue<string>(3);

taskQueue.enqueue("Task 1");
taskQueue.enqueue("Task 2");
taskQueue.enqueue("Task 3");

console.log(taskQueue.dequeue());  // Output: Task 1
console.log(taskQueue.length());   // Output: 2

taskQueue.enqueue("Task 4");       // Reuses space from the dequeued Task 1
console.log(taskQueue.peek());     // Output: Task 2
```

- **`enqueue(item)`** adds elements to

 the queue.
- **`dequeue()`** removes elements from the queue in FIFO order.
- **`length()`** gives the number of elements currently in the queue.

---

### 7. Advanced Queue Methods

You can build on the basic `CircularQueue` functionality by adding custom methods for specific use cases like **limiting size**, **dynamic resizing**, or **priority queuing**.

#### Example: Adding Size Limiting

You can create a new `LimitedQueue` class that throws an error when adding elements beyond a specified limit.

```typescript
class LimitedQueue<T> extends CircularQueue<T> {
  constructor(size: number) {
    super(size);
  }

  enqueue(item: T): void {
    if (this.length() >= this.size) {
      throw new Error('Queue has reached its size limit');
    }
    super.enqueue(item);
  }
}

const limitedQueue = new LimitedQueue<number>(3);
limitedQueue.enqueue(1);
limitedQueue.enqueue(2);
limitedQueue.enqueue(3);
limitedQueue.enqueue(4);  // Throws Error: Queue has reached its size limit
```

---

### 8. Conclusion

The **`CircularQueue<T>`** is an efficient and powerful data structure that provides **constant time operations** for enqueueing and dequeueing while **optimizing space** through its circular nature. Whether used in task scheduling, buffering, or real-time systems, circular queues ensure that memory is used efficiently.

### Key Takeaways:
- **FIFO Order**: A Circular Queue follows the First-In-First-Out order.
- **Constant Time Operations**: Enqueueing and dequeueing are performed in constant time (`O(1)`).
- **Efficient Space Use**: The queue reuses space, making it more efficient than regular arrays for fixed-size collections.
- **Advanced Iteration**: The ability to iterate in both directions provides flexibility when working with this structure.

By mastering the **`CircularQueue`**, you can enhance your TypeScript applications that require optimized and predictable behavior for data storage and retrieval.

