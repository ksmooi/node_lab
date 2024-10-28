# A Comprehensive Guide to Rest Parameters in TypeScript: With Rich Examples

**Rest parameters** in TypeScript offer a flexible way to handle **variable-length arguments** in functions. Introduced in ES6 and fully supported by TypeScript, rest parameters allow you to create functions that accept an arbitrary number of arguments. This feature is particularly useful when you need a function to handle different numbers of inputs while still maintaining the readability and type safety of TypeScript.

In this guide, we'll explore **what rest parameters are**, how they work in TypeScript, and how to use them with **rich examples**. We'll also explain how rest parameters differ from the older `arguments` object and show how to combine them with other function parameters.

---

### Table of Contents

1. What are Rest Parameters?
2. Syntax of Rest Parameters
3. Using Rest Parameters with Rich Examples
   - Handling Multiple Arguments
   - Dynamic Calculations
   - Passing Rest Parameters to Other Functions
   - Using Rest Parameters in Constructor Functions
4. Combining Rest Parameters with Regular Parameters
5. Type Annotations for Rest Parameters
6. Rest Parameters vs. `arguments` Object
7. Conclusion

---

### 1. What are Rest Parameters?

**Rest parameters** allow a function to accept an indefinite number of arguments and store them in an array. The rest parameter syntax looks similar to the **spread operator** (`...`), but while the spread operator expands elements from an array, rest parameters **gather** them into an array.

Rest parameters are especially useful when:
- You don't know how many arguments will be passed to the function.
- You need to handle a **variable number of inputs**.

---

### 2. Syntax of Rest Parameters

The syntax for defining rest parameters is simple:

```typescript
function functionName(...parameterName: type[]) {
  // function body
}
```

- **`...parameterName`**: This is the rest parameter, which captures all the remaining arguments into an array.
- **`type[]`**: Specifies the type of elements that will be stored in the array.

#### Example: Basic Syntax of Rest Parameters

```typescript
function logNumbers(...numbers: number[]): void {
  console.log(numbers);
}

logNumbers(1, 2, 3);  // Output: [1, 2, 3]
logNumbers(10, 20);   // Output: [10, 20]
logNumbers(5);        // Output: [5]
```

Here, the function `logNumbers` accepts any number of arguments and logs them as an array.

---

### 3. Using Rest Parameters with Rich Examples

Let's look at a variety of examples to understand how rest parameters can be effectively used.

#### Example 1: Handling Multiple Arguments

In this example, rest parameters are used to sum an arbitrary number of numbers.

```typescript
function sum(...numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

console.log(sum(1, 2, 3));  // Output: 6
console.log(sum(10, 20, 30, 40));  // Output: 100
console.log(sum());  // Output: 0
```

- The rest parameter `...numbers` collects all the arguments into an array, and `reduce()` is used to sum them.

#### Example 2: Dynamic Calculations

This example multiplies a variable number of factors using rest parameters.

```typescript
function multiply(...factors: number[]): number {
  return factors.reduce((acc, curr) => acc * curr, 1);
}

console.log(multiply(2, 3));     // Output: 6
console.log(multiply(2, 3, 4));  // Output: 24
console.log(multiply(5));        // Output: 5
```

#### Example 3: Passing Rest Parameters to Other Functions

Rest parameters can be passed from one function to another using the **spread operator**.

```typescript
function logItems(...items: string[]): void {
  console.log(items.join(", "));
}

function addItemsAndLog(...newItems: string[]): void {
  logItems(...newItems);
}

addItemsAndLog("apple", "banana", "cherry");
// Output: apple, banana, cherry
```

- The `logItems` function accepts the rest parameter `...items` and prints them as a comma-separated string.
- The `addItemsAndLog` function uses the spread operator to pass rest parameters to `logItems`.

#### Example 4: Using Rest Parameters in Constructor Functions

Rest parameters can also be used in class constructors to handle multiple arguments.

```typescript
class ShoppingCart {
  items: string[];

  constructor(...items: string[]) {
    this.items = items;
  }

  displayItems(): void {
    console.log("Cart contains:", this.items.join(", "));
  }
}

const cart = new ShoppingCart("Laptop", "Phone", "Tablet");
cart.displayItems();  
// Output: Cart contains: Laptop, Phone, Tablet
```

Here, the `ShoppingCart` class uses a rest parameter to gather multiple items and store them in an `items` array. The `displayItems` method prints the items.

---

### 4. Combining Rest Parameters with Regular Parameters

You can use **rest parameters along with regular parameters**, but the **rest parameter must always be the last parameter** in the function definition.

#### Example: Rest Parameters with Other Parameters

```typescript
function greet(greeting: string, ...names: string[]): void {
  console.log(`${greeting}! ${names.join(", ")}`);
}

greet("Hello", "Alice", "Bob", "Charlie"); 
// Output: Hello! Alice, Bob, Charlie
```

- **`greeting`**: A regular parameter that must be passed first.
- **`...names`**: A rest parameter that gathers all remaining arguments into an array.

You can also combine multiple named parameters with rest parameters, but always remember that **rest parameters must come last**.

#### Example: Multiple Named Parameters and Rest Parameters

```typescript
function calculateDiscount(discount: number, taxRate: number, ...prices: number[]): number {
  const total = prices.reduce((sum, price) => sum + price, 0);
  const discountedTotal = total - total * (discount / 100);
  const totalWithTax = discountedTotal + discountedTotal * (taxRate / 100);
  return totalWithTax;
}

console.log(calculateDiscount(10, 5, 100, 200, 300));  
// Output: 598.5
```

- The function calculates the total price after applying a discount and tax rate to a list of prices.

---

### 5. Type Annotations for Rest Parameters

TypeScript allows you to specify the type of rest parameters, ensuring that the arguments passed to the function meet the expected type.

#### Example: Type Annotations for Rest Parameters

```typescript
function concatStrings(...strings: string[]): string {
  return strings.join(" ");
}

console.log(concatStrings("Hello", "World"));  // Output: Hello World
console.log(concatStrings("TypeScript", "is", "awesome"));  // Output: TypeScript is awesome
```

Here, `strings: string[]` ensures that all arguments passed to the function are strings.

You can also use **union types** with rest parameters to accept multiple types.

```typescript
function processValues(...values: (string | number)[]): void {
  values.forEach(value => {
    if (typeof value === "number") {
      console.log(`Number: ${value}`);
    } else {
      console.log(`String: ${value}`);
    }
  });
}

processValues(1, "hello", 42, "world");
// Output:
// Number: 1
// String: hello
// Number: 42
// String: world
```

---

### 6. Rest Parameters vs. `arguments` Object

Before the introduction of rest parameters, the **`arguments` object** was used to handle variable-length arguments in functions. While still usable, `arguments` has limitations compared to rest parameters.

| Feature                    | Rest Parameters (`...args`)            | `arguments` Object                       |
|----------------------------|----------------------------------------|------------------------------------------|
| **Type**                    | Real array                            | Array-like object (not a real array)     |
| **TypeScript Type Safety**  | Supports type annotations (`T[]`)      | No type annotations, untyped             |
| **Availability**            | Works in both arrow and normal functions| Only works in regular functions          |
| **Array Methods**           | Fully supports array methods           | Must be converted to a real array        |
| **Readability**             | Clear and explicit                     | Less explicit and less readable          |
| **Modern JavaScript**       | Preferred in modern JavaScript/TypeScript | Considered legacy for new code           |

#### Example: Rest Parameters vs. `arguments`

```typescript
// Using Rest Parameters
function sumRest(...numbers: number[]): number {
  return numbers.reduce((acc, curr) => acc + curr, 0);
}

// Using `arguments` Object
function sumArguments() {
  const args = Array.from(arguments);  // Convert to real array
  return args.reduce((acc, curr) => acc + curr, 0);
}

console.log(sumRest(1, 2, 3));      // Output: 6
console.log(sumArguments(1, 2, 3)); // Output: 6
```

Rest parameters are a modern, type-safe, and readable alternative to the `arguments` object.

---

### 7. Conclusion

**Rest parameters** in TypeScript provide a powerful and flexible way to handle an arbitrary number of arguments in functions. They simplify the handling of variable-length inputs and provide full array functionality, type safety, and better readability compared to the older `arguments` object.

**Key Takeaways**:
- Rest parameters must always come last in the function signature.
- TypeScript allows type annotations for rest parameters, providing better type safety.
- Rest parameters are preferred over the `arguments` object in modern JavaScript/TypeScript due to their flexibility, readability, and performance.

By mastering rest parameters, you can write more efficient, flexible, and maintainable functions in TypeScript, making your code cleaner and more robust for handling dynamic arguments.

