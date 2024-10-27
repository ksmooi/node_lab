# A Comprehensive Guide to `TypedArray` in TypeScript: Examples and Advanced Usage

**`TypedArray`** is a family of data structures in **TypeScript** (and JavaScript) that allows working with **binary data** in a highly efficient and optimized way. Unlike regular arrays, `TypedArray` is designed for handling fixed-size, contiguous data buffers, such as integers and floating-point numbers, stored in raw binary form. This makes `TypedArray` ideal for performance-critical applications, such as WebGL, audio processing, and binary protocols.

In this article, we will explore the `TypedArray` data structure in TypeScript, showing how to access, iterate, manipulate, and use advanced methods. We will also provide a comparison table to highlight the differences between `TypedArray` and regular arrays.

---

### Table of Contents

1. What is a `TypedArray`?
2. Accessing Elements in a `TypedArray`
3. Iterating Over a `TypedArray`
4. Manipulating `TypedArray` Elements (Insert, Update, Delete)
5. Advanced `TypedArray` Methods
6. Comparison: `TypedArray` vs. Array
7. Conclusion

---

### 1. What is a `TypedArray`?

A **`TypedArray`** in TypeScript is a special array-like object that provides a way to interact with raw binary data stored in an **ArrayBuffer**. It is designed for handling binary data efficiently, allowing operations on fixed-size integers and floating-point numbers. The `TypedArray` family includes various types like `Int8Array`, `Uint8Array`, `Float32Array`, `Uint16Array`, etc., each corresponding to a specific data type.

- **`Int8Array`**: 8-bit signed integer
- **`Uint8Array`**: 8-bit unsigned integer
- **`Uint8ClampedArray`**: 8-bit unsigned integer (clamped)
- **`Int16Array`**: 16-bit signed integer
- **`Uint16Array`**: 16-bit unsigned integer
- **`Int32Array`**: 32-bit signed integer
- **`Uint32Array`**: 32-bit unsigned integer
- **`Float32Array`**: 32-bit floating point
- **`Float64Array`**: 64-bit floating point

#### Example: Creating a `TypedArray`

```typescript
const int8 = new Int8Array([10, 20, -30]);
const float32 = new Float32Array([0.5, 1.5, 2.5]);

console.log(int8);     // Output: Int8Array(3) [10, 20, -30]
console.log(float32);  // Output: Float32Array(3) [0.5, 1.5, 2.5]
```

Each `TypedArray` works with a specific binary format, and its elements are stored in contiguous memory, allowing for faster access and manipulation compared to regular arrays, especially when working with large datasets.

---

### 2. Accessing Elements in a `TypedArray`

You can access elements in a `TypedArray` using the familiar bracket notation just like with regular arrays. The indices are zero-based, and out-of-bound access will return `undefined`.

#### Example: Accessing Elements

```typescript
const int16 = new Int16Array([100, 200, 300]);

console.log(int16[0]); // Output: 100
console.log(int16[1]); // Output: 200
console.log(int16[2]); // Output: 300
console.log(int16[3]); // Output: undefined (index out of bounds)
```

Since `TypedArray` elements are fixed in size, you cannot dynamically grow the array like with regular arrays.

---

### 3. Iterating Over a `TypedArray`

You can iterate over a `TypedArray` using multiple methods such as `for...of`, `forEach()`, and `map()`. These methods behave similarly to their counterparts in regular arrays.

#### Example 1: Iterating Using `for...of`

```typescript
const uint8 = new Uint8Array([10, 20, 30]);

for (const value of uint8) {
  console.log(value);
}
// Output:
// 10
// 20
// 30
```

#### Example 2: Iterating Using `forEach()`

```typescript
uint8.forEach((value, index) => {
  console.log(`Index ${index}: ${value}`);
});
// Output:
// Index 0: 10
// Index 1: 20
// Index 2: 30
```

#### Example 3: Mapping a `TypedArray` Using `map()`

The `map()` function allows you to transform the elements of a `TypedArray` just like with regular arrays.

```typescript
const squares = uint8.map(value => value * value);
console.log(squares);  // Output: Uint8Array(3) [100, 144, 255] (Note: Uint8 maxes out at 255)
```

---

### 4. Manipulating `TypedArray` Elements (Insert, Update, Delete)

Since `TypedArray` has a fixed length, you cannot insert or delete elements directly, but you can update elements and manipulate data by creating new `TypedArray` instances or by working with **slices**.

#### Example 1: Updating Elements

You can update elements in a `TypedArray` by directly setting values using index-based access.

```typescript
const int32 = new Int32Array([1, 2, 3]);
int32[1] = 20;  // Update the second element

console.log(int32);  // Output: Int32Array(3) [1, 20, 3]
```

#### Example 2: Deleting Elements by Creating a New `TypedArray`

Since you cannot directly delete elements, you can filter the array and create a new one.

```typescript
const int32 = new Int32Array([10, 20, 30, 40]);
const filtered = new Int32Array([...int32].filter(value => value !== 20));

console.log(filtered);  // Output: Int32Array(3) [10, 30, 40]
```

#### Example 3: Inserting Elements by Concatenation

You cannot directly insert elements into a `TypedArray`, but you can concatenate two arrays to create a new one.

```typescript
const uint8 = new Uint8Array([1, 2, 3]);
const toAdd = new Uint8Array([4, 5]);
const newArray = new Uint8Array([...uint8, ...toAdd]);

console.log(newArray);  // Output: Uint8Array(5) [1, 2, 3, 4, 5]
```

---

### 5. Advanced `TypedArray` Methods

`TypedArray` comes with a set of advanced methods to manipulate and work with binary data more efficiently.

#### Example 1: Copying Elements Using `set()`

The `set()` method allows you to copy values from another array (or `TypedArray`) into the current `TypedArray`.

```typescript
const uint8 = new Uint8Array(5);
uint8.set([10, 20, 30], 1);  // Start copying at index 1

console.log(uint8);  // Output: Uint8Array(5) [0, 10, 20, 30, 0]
```

#### Example 2: Slicing a `TypedArray` Using `slice()`

You can create a shallow copy of a portion of a `TypedArray` using the `slice()` method.

```typescript
const int16 = new Int16Array([100, 200, 300, 400, 500]);
const slice = int16.slice(1, 4);

console.log(slice);  // Output: Int16Array(3) [200, 300, 400]
```

#### Example 3: Filling a `TypedArray` Using `fill()`

The `fill()` method allows you to fill all elements in the `TypedArray` with a static value.

```typescript
const float32 = new Float32Array(5);
float32.fill(3.14);

console.log(float32);  // Output: Float32Array(5) [3.14, 3.14, 3.14, 3.14, 3.14]
```

#### Example 4: Sorting a `TypedArray` Using `sort()`

You can sort the elements of a `TypedArray` using the `sort()` method, similar to regular arrays.

```typescript
const int8 = new Int8Array([30, -5, 20, 15]);
int8.sort();

console.log(int8);  // Output: Int8Array(4) [-5, 15, 20, 30]
```

#### Example 5: Reversing a `TypedArray` Using `reverse()`

The `reverse()` method reverses the elements in the `TypedArray`.

```typescript
const int8 = new Int8Array([1, 2, 3, 4]);
int8.reverse();

console.log(int8);  // Output: Int8Array(4) [4, 3, 2, 1]
```

---

### 6. Comparison: `TypedArray` vs. Array

Here’s a comparison between `TypedArray` and regular arrays in TypeScript to help you understand when to use each.

| Feature                   | `TypedArray`                          | Array                                  |
|---------------------------|---------------------------------------|----------------------------------------|
| **Type of Data**          | Only holds one specific data type     | Can hold any type (mixed data types)   |
| **Memory Efficiency**     | More efficient with fixed-size data   | Less efficient (dynamic resizing)      |
| **Size**                  | Fixed size                            | Dynamic (can grow or shrink)           |
| **Access Speed**          | Faster for large datasets             | Slower compared to `TypedArray`        |
| **Range of Data Types**   | Limited to numeric types              | Can hold any type, including objects   |
| **Purpose**               | Best for handling binary data         | Best for general-purpose collections   |
| **Methods**               | Supports a subset of array methods    | Full range of array methods            |
| **Memory Layout**         | Contiguous block of memory            | Non-contiguous, pointer-based          |
| **Use Cases**             | WebGL, audio processing, binary data  | General-purpose data storage           |

#### When to Use `TypedArray`:
- When working with binary data.
- For performance-critical applications like image processing, audio manipulation, or 3D graphics.
- When memory efficiency and fixed-size elements are required.

#### When to Use Array:
- For general-purpose collections with mixed types.
- When dynamic resizing and flexible data storage are needed.

---

### 7. Conclusion

`TypedArray` is an essential data structure in **TypeScript** for handling binary data efficiently. It provides high-performance access and manipulation of fixed-size numerical values, making it ideal for performance-intensive applications like WebGL, audio processing, and more.

**Key Takeaways**:
- **Efficient data handling**: `TypedArray` is optimized for handling contiguous binary data.
- **Fixed size**: The size of a `TypedArray` is fixed at creation, making it ideal for scenarios where data size is known in advance.
- **Advanced methods**: `TypedArray` provides advanced methods such as `set()`, `slice()`, `fill()`, and more, for efficient manipulation.
- **Great for performance**: If you need to process large volumes of numeric data or need fine-grained control over memory layout, `TypedArray` is the way to go.

By mastering `TypedArray`, you can improve the performance and memory efficiency of your applications, particularly those dealing with large-scale binary data processing in TypeScript.

