# Mastering Generic Functions in TypeScript

In **TypeScript**, **generic functions** allow us to define functions that can work with various data types while maintaining type safety. Generics provide flexibility by letting us pass in types as parameters, which means that the function can adapt to different types without losing the benefits of strong typing.

### 1. Basic Example of a Generic Function

This simple example demonstrates how to use a generic type parameter in a function. The function works with any type but ensures type safety.

```typescript
function identity<T>(arg: T): T {
  return arg;
}

// Usage:
console.log(identity<string>("Hello, TypeScript!")); // Output: Hello, TypeScript!
console.log(identity<number>(42));                   // Output: 42
```

#### Explanation:
- **`<T>`**: The type parameter `T` can be any type (string, number, boolean, etc.).
- When calling the function, we specify the type explicitly (`identity<string>`) or let TypeScript infer it.

### 2. Generic Function with Arrays

Here's an example of a generic function that works with arrays.

```typescript
function getFirstElement<T>(arr: T[]): T {
  return arr[0];
}

// Usage:
console.log(getFirstElement<number>([1, 2, 3]));       // Output: 1
console.log(getFirstElement<string>(["a", "b", "c"])); // Output: "a"
```

#### Explanation:
- **`<T>`**: The type parameter `T` applies to the type of the elements in the array.
- The function returns the first element of the array, and TypeScript infers the correct type for `T`.

### 3. Generic Function with Multiple Type Parameters

You can define generic functions that accept multiple type parameters.

```typescript
function mergeObjects<T, U>(obj1: T, obj2: U): T & U {
  return { ...obj1, ...obj2 };
}

// Usage:
const merged = mergeObjects({ name: "John" }, { age: 30 });
console.log(merged);  // Output: { name: "John", age: 30 }
```

#### Explanation:
- **`<T, U>`**: The function takes two type parameters, `T` and `U`, which can represent different types.
- The function returns a new object that combines the properties of both input objects, and the type of the result is inferred as `T & U` (intersection type).

### 4. Constraints in Generic Functions

You can impose constraints on the type parameter to ensure that it meets certain criteria. For example, requiring that the type passed has a specific property.

```typescript
interface Lengthwise {
  length: number;
}

function logLength<T extends Lengthwise>(arg: T): T {
  console.log(arg.length);
  return arg;
}

// Usage:
logLength("Hello");             // Output: 5 (length of the string)
logLength([1, 2, 3]);           // Output: 3 (length of the array)
// logLength(123);               // Error: Type 'number' does not have a 'length' property
```

#### Explanation:
- **`<T extends Lengthwise>`**: The generic type `T` must have a `length` property (i.e., it must extend the `Lengthwise` interface).
- The function logs the `length` of the argument and returns it.

### 5. Generic Function with Default Types

You can provide default types for the generic parameters in case they are not specified explicitly.

```typescript
function createPair<T = string, U = number>(first: T, second: U): [T, U] {
  return [first, second];
}

// Usage:
console.log(createPair("Hello", 42));     // Output: ["Hello", 42]
console.log(createPair("John", 30));      // Output: ["John", 30]
console.log(createPair(100, "Test"));     // Output: [100, "Test"]
```

#### Explanation:
- **`<T = string, U = number>`**: The type parameters `T` and `U` have default values (`string` and `number`), which are used if no explicit types are provided.

### 6. Generic Function with Type Inference

TypeScript can often infer the types based on the arguments passed, so you don't always need to specify the types explicitly.

```typescript
function reverseArray<T>(arr: T[]): T[] {
  return arr.reverse();
}

// Usage (TypeScript infers the types):
console.log(reverseArray([1, 2, 3]));     // Output: [3, 2, 1]
console.log(reverseArray(["a", "b", "c"])); // Output: ["c", "b", "a"]
```

#### Explanation:
- **Type Inference**: TypeScript automatically infers the type of `T` from the arguments passed, so there is no need to explicitly specify `<number>` or `<string>`.

### 7. Generic Function with Promises

Here's an example of a generic function that returns a `Promise`.

```typescript
function fetchData<T>(url: string): Promise<T> {
  return fetch(url).then(response => response.json());
}

// Usage:
interface User {
  id: number;
  name: string;
}

fetchData<User>('https://api.example.com/user/1')
  .then(user => console.log(user.id, user.name)); // Output: 1 "John Doe"
```

#### Explanation:
- **Promise<T>**: The function returns a `Promise` that resolves to the type `T`, which is inferred or specified based on the expected result.
- **User Interface**: We specify the `User` interface to inform TypeScript of the shape of the expected data.

---

### Conclusion

Generics in TypeScript allow you to write functions that are reusable across different types while maintaining type safety. By using **generic functions**, you can create more flexible and robust code that can adapt to a variety of use cases without losing TypeScript's powerful static typing capabilities.

Some key takeaways:
- **Reusability**: Generics let you write reusable, type-safe functions.
- **Type Inference**: TypeScript can often infer the types for you, making the syntax clean and concise.
- **Type Constraints**: You can constrain the types passed to generics to ensure they meet certain requirements.

Generics are a powerful tool in TypeScript for writing maintainable, flexible, and type-safe code.

