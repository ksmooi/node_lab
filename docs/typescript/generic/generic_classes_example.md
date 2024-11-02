# Mastering Generic Classes in TypeScript

**TypeScript**'s support for **generics** allows developers to build flexible, reusable, and type-safe components. In this article, we will explore **generic classes** in TypeScript, focusing on how they work and how you can use **type aliases** to enhance readability and flexibility. By using generics and type aliases, you can write code that adapts to a variety of data types while maintaining strict type safety.

### Table of Contents

1. What are Generic Classes?
2. Benefits of Using Type Aliases
3. Example 1: Basic Generic Class
4. Example 2: Generic Class with Constraints
5. Example 3: Multiple Type Parameters
6. Example 4: Stack Data Structure Using Generics
7. Example 5: Key-Value Storage Class
8. Example 6: Default Types in Generic Classes
9. Conclusion

---

### 1. What are Generic Classes?

**Generic classes** are classes that can operate on any data type. They are similar to generic functions but allow you to apply the generic logic to a class, making the class reusable across multiple types while ensuring type safety.

### 2. Benefits of Using Type Aliases

**Type aliases** in TypeScript provide a convenient way to name a type and reuse it across the codebase. When combined with generics, type aliases can improve the readability and maintainability of your generic classes by clearly labeling complex types.

Let’s explore some examples of generic classes in TypeScript, making use of **type aliases** where appropriate.

---

### 3. Example 1: Basic Generic Class

Here’s a basic example of a generic class that stores and retrieves a value of any type.

```typescript
class Box<T> {
  private _content: T;

  constructor(content: T) {
    this._content = content;
  }

  // Get the content
  getContent(): T {
    return this._content;
  }

  // Set new content
  setContent(newContent: T): void {
    this._content = newContent;
  }
}

// Usage:
const numberBox = new Box<number>(123);
console.log(numberBox.getContent()); // Output: 123

const stringBox = new Box<string>("Hello, TypeScript");
console.log(stringBox.getContent()); // Output: Hello, TypeScript
```

#### Explanation:
- **`<T>`**: This is a type parameter, making the class work with any type. When creating an instance, you specify the type you want.
- The same class can store numbers, strings, or any other type depending on how it’s instantiated.

---

### 4. Example 2: Generic Class with Constraints

You can constrain the type parameters to ensure they meet certain criteria. For example, you can require that the type used in the generic class has a specific property or extends a certain interface.

```typescript
interface HasLength {
  length: number;
}

class Collection<T extends HasLength> {
  private items: T[];

  constructor(items: T[]) {
    this.items = items;
  }

  getFirstItem(): T {
    return this.items[0];
  }

  getTotalLength(): number {
    return this.items.reduce((acc, item) => acc + item.length, 0);
  }
}

// Usage:
const stringCollection = new Collection<string>(["apple", "banana", "cherry"]);
console.log(stringCollection.getFirstItem()); // Output: apple
console.log(stringCollection.getTotalLength()); // Output: 16 (length of all strings)
```

#### Explanation:
- **`T extends HasLength`**: The type `T` must have a `length` property (like `string[]` or an object that has a `length` field).
- The class calculates the total length of all items in the collection.

---

### 5. Example 3: Multiple Type Parameters

You can define a generic class that works with multiple type parameters, allowing for flexible type combinations.

```typescript
type Pair<T, U> = [T, U];

class DualBox<T, U> {
  private pair: Pair<T, U>;

  constructor(first: T, second: U) {
    this.pair = [first, second];
  }

  getFirst(): T {
    return this.pair[0];
  }

  getSecond(): U {
    return this.pair[1];
  }
}

// Usage:
const numberStringPair = new DualBox<number, string>(1, "one");
console.log(numberStringPair.getFirst());  // Output: 1
console.log(numberStringPair.getSecond()); // Output: one
```

#### Explanation:
- **`type Pair<T, U>`**: This type alias defines a tuple of two elements, which is used in the `DualBox` class to handle pairs of different types.
- The class can hold two values of different types and return them independently.

---

### 6. Example 4: Stack Data Structure Using Generics

Stacks follow the **LIFO** (Last In, First Out) principle. Here's a generic class implementing a stack, with a type alias for the stack items.

```typescript
type StackItem<T> = T;

class Stack<T> {
  //private items: T[] = [];
  private items: StackItem<T>[] = [];

  push(item: StackItem<T>): void {
    this.items.push(item);
  }

  pop(): StackItem<T> | undefined {
    return this.items.pop();
  }

  peek(): StackItem<T> | undefined {
    return this.items[this.items.length - 1];
  }

  size(): number {
    return this.items.length;
  }
}

// Usage:
const numberStack = new Stack<number>();
numberStack.push(10);
numberStack.push(20);
console.log(numberStack.peek()); // Output: 20
console.log(numberStack.size()); // Output: 2
```

#### Explanation:
- **`type StackItem<T>`**: This type alias represents individual items stored in the stack.
- The stack works with any type (`T`), making it versatile and reusable.

---

### 7. Example 5: Key-Value Storage Class

Here’s an example of a key-value storage system using multiple type parameters and type aliases for better readability.

```typescript
type KeyValue<K, V> = { key: K; value: V };

class KeyValueStore<K, V> {
  private store: KeyValue<K, V>[] = [];

  set(key: K, value: V): void {
    this.store.push({ key, value });
  }

  get(key: K): V | undefined {
    return this.store.find(item => item.key === key)?.value;
  }

  remove(key: K): void {
    this.store = this.store.filter(item => item.key !== key);
  }
}

// Usage:
const numberToStringStore = new KeyValueStore<number, string>();
numberToStringStore.set(1, "One");
numberToStringStore.set(2, "Two");
console.log(numberToStringStore.get(1));  // Output: One

const stringToBooleanStore = new KeyValueStore<string, boolean>();
stringToBooleanStore.set("enabled", true);
console.log(stringToBooleanStore.get("enabled"));  // Output: true
```

#### Explanation:
- **`type KeyValue<K, V>`**: This alias represents a key-value pair. The `KeyValueStore` class operates on an array of these key-value pairs.
- This makes the store capable of handling any combination of types for the key and value.


Here’s an example of a generic class that acts as a **key-value storage**, similar to a map or dictionary.

```typescript
class KeyValueStore<K, V> {
  private store: Map<K, V> = new Map();

  // Set a key-value pair
  set(key: K, value: V): void {
    this.store.set(key, value);
  }

  // Get a value by key
  get(key: K): V | undefined {
    return this.store.get(key);
  }

  // Remove a key-value pair
  remove(key: K): void {
    this.store.delete(key);
  }

  // Check if a key exists
  hasKey(key: K): boolean {
    return this.store.has(key);
  }
}

// Usage:
const numberToStringStore = new KeyValueStore<number, string>();
numberToStringStore.set(1, "One");
numberToStringStore.set(2, "Two");
console.log(numberToStringStore.get(1));  // Output: One
console.log(numberToStringStore.hasKey(2)); // Output: true

const stringToNumberStore = new KeyValueStore<string, number>();
stringToNumberStore.set("A", 100);
stringToNumberStore.set("B", 200);
console.log(stringToNumberStore.get("A"));  // Output: 100
```

#### Explanation:
- **`KeyValueStore<K, V>`**: This class uses two generic type parameters: `K` for the key and `V` for the value.
- It internally uses a **Map** to store key-value pairs and provides methods to add, retrieve, and remove entries.

---

### 8. Example 6: Default Types in Generic Classes

You can define default types for generic parameters to provide a fallback if no type is explicitly passed when the class is instantiated.

```typescript
type PairWithDefault<T = string, U = number> = [T, U];

class DefaultPair<T = string, U = number> {
  private pair: PairWithDefault<T, U>;

  constructor(first: T, second: U) {
    this.pair = [first, second];
  }

  getFirst(): T {
    return this.pair[0];
  }

  getSecond(): U {
    return this.pair[1];
  }
}

// Usage:
const defaultPair = new DefaultPair("Hello", 42);
console.log(defaultPair.getFirst());  // Output: Hello
console.log(defaultPair.getSecond()); // Output: 42

const customPair = new DefaultPair<boolean, string>(true, "Custom");
console.log(customPair.getFirst());   // Output: true
console.log(customPair.getSecond());  // Output: Custom
```

#### Explanation:
- **`PairWithDefault<T = string, U = number>`**: This type alias uses default types (`string` and `number`). If no types are provided, it defaults to these types.
- The `DefaultPair` class automatically falls back to the default types if no explicit types are specified.

---

### 9. Conclusion

Generic classes in TypeScript provide powerful tools to build **flexible**, **reusable**, and **type-safe** components. By leveraging **type aliases**, you can make your generic classes even more readable and maintainable, especially when dealing with complex types or multiple type parameters.

**Key Benefits of Generic Classes with Type Aliases:**
- **Reusability**: One class can work with multiple types while retaining type safety.
- **Type Safety**: Strong typing ensures that errors are caught early during development.
- **Readability**: Type aliases make complex types easier to manage and reuse, improving the readability of the code.

By mastering generics and type aliases in TypeScript, you can build scalable, maintainable, and efficient solutions for any use case, from data structures to complex business logic.

