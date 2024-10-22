# Building a Banking System in Node.js with TypeScript: An OOAD Approach

In this article, we will walk through the process of building a simple banking system using **Node.js** and **TypeScript**, applying **Object-Oriented Analysis and Design (OOAD)** principles. We will model real-world entities such as users and accounts using TypeScript's object-oriented features like classes, inheritance, and encapsulation. By the end, you’ll have a working Node.js application with TypeScript that demonstrates the power of OOAD.

---

## Project Overview

In this project, we will build a simple banking system that:
- Allows users to create accounts (savings and checking).
- Supports deposits, withdrawals, and interest calculations.
- Demonstrates the core OOAD principles applied in TypeScript.

The project structure will look like this:

```plaintext
banking-system/
│
├── src/                  # TypeScript source files
│   ├── config/           # Configuration (e.g., environment variables)
│   ├── controllers/      # Business logic and request handlers
│   ├── models/           # Object models (User, Account, Transaction)
│   ├── services/         # Core business logic (UserService, AccountService)
│   └── app.ts            # Main application entry point
│
├── dist/                 # Compiled JavaScript files (output directory)
├── node_modules/         # Installed dependencies
├── tsconfig.json         # TypeScript configuration
└── package.json          # Project dependencies and scripts
```

---

## Setting Up the Project

### Step 1: Initialize the Project

First, create a new directory for the project and initialize it using NPM:

```bash
mkdir banking-system
cd banking-system
npm init -y
```

This will generate a `package.json` file with default configurations.

### Step 2: Install Dependencies

Next, install the required dependencies, including **TypeScript**, **ts-node** (for running TypeScript directly), **nodemon** (for development), and **dotenv** for environment variables:

```bash
npm install express dotenv
npm install --save-dev typescript ts-node @types/node @types/express nodemon
```

### Step 3: Configure TypeScript

Run the following command to create a `tsconfig.json` file that will define how TypeScript should be compiled:

```bash
npx tsc --init
```

Modify the `tsconfig.json` to configure the output directory (`dist/`) for compiled JavaScript files and the root directory (`src/`) for TypeScript source files:

```json
{
  "compilerOptions": {
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true
  }
}
```

This configuration tells TypeScript to compile `.ts` files from the `src/` directory into JavaScript files in the `dist/` directory.

### Step 4: Modify `package.json` Scripts

To make it easier to run and build your application, add the following scripts in your `package.json`:

```json
{
  "scripts": {
    "build": "tsc",                               // Compile TypeScript into JavaScript
    "start": "node dist/app.js",                  // Run the compiled app
    "dev": "nodemon --exec ts-node src/app.ts",   // Run in development mode using nodemon and ts-node
    "test": "echo \"Error: no test specified\" && exit 1"
  }
}
```

With these scripts:
- **`npm run build`** will compile TypeScript files.
- **`npm start`** will run the compiled JavaScript files.
- **`npm run dev`** will run the application in development mode with `nodemon`, which automatically restarts on file changes.

---

## Project Code Implementation

Now, let's implement the core components of the banking system using TypeScript and OOAD principles.

### 1. **Main Application Entry: `app.ts`**

The main entry point initializes the Express app, loads environment variables, and sets up an example to demonstrate the user and account services.

```typescript
// src/app.ts
import express, { Application } from 'express';
import dotenv from 'dotenv';
import { UserService } from './services/userService';
import { AccountService } from './services/accountService';

// Load environment variables
dotenv.config();

const app: Application = express();
app.use(express.json());

const userService = new UserService();
const accountService = new AccountService();

// Example usage of services
const user = userService.createUser('Alice');
const savingsAccount = accountService.createSavingsAccount(user, 1000, 0.05);
const checkingAccount = accountService.createCheckingAccount(user, 500);

savingsAccount.addInterest();
checkingAccount.issueCheck(200);

console.log(`User: ${user.name}, Total Balance: ${accountService.getTotalBalance(user)}`);

// Start Express server (optional)
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

### 2. **Models: Representing Users and Accounts**

The **model layer** defines the structure of users and accounts. These classes encapsulate both data and behavior.

#### **User Model: `userModel.ts`**

```typescript
// src/models/userModel.ts
export class User {
  // In TypeScript, you can define class properties directly in the constructor's parameter list using access modifiers 
  // like public, private, protected, or readonly. This feature is called parameter properties.
  constructor(public id: number, public name: string) {}
}
```

#### **Account Models: `accountModel.ts`**

```typescript
// src/models/accountModel.ts
export abstract class Account {
  private balance: number;

  constructor(public accountNumber: string, initialBalance: number) {
    this.balance = initialBalance;
  }

  public getBalance(): number {
    return this.balance;
  }

  public deposit(amount: number): void {
    this.balance += amount;
    console.log(`Deposited ${amount}. New balance: ${this.balance}`);
  }

  public withdraw(amount: number): void {
    if (amount > this.balance) {
      console.log('Insufficient funds');
      return;
    }
    this.balance -= amount;
    console.log(`Withdrew ${amount}. New balance: ${this.balance}`);
  }
}

export class SavingsAccount extends Account {
  private interestRate: number;

  constructor(accountNumber: string, initialBalance: number, interestRate: number) {
    super(accountNumber, initialBalance);
    this.interestRate = interestRate;
  }

  public addInterest(): void {
    const interest = this.getBalance() * this.interestRate;
    this.deposit(interest);
    console.log(`Interest added: ${interest}`);
  }
}

export class CheckingAccount extends Account {
  public issueCheck(amount: number): void {
    this.withdraw(amount);
    console.log(`Check issued for ${amount}`);
  }
}
```

### 3. **Services: Business Logic**

The **service layer** contains business logic related to users and accounts. It interacts with the models to perform operations like creating users and handling account transactions.

#### **User Service: `userService.ts`**

```typescript
// src/services/userService.ts
import { User } from '../models/userModel';

export class UserService {
  private users: User[] = [];
  private nextId = 1;

  public createUser(name: string): User {
    const newUser = new User(this.nextId++, name);
    this.users.push(newUser);
    return newUser;
  }

  public getAllUsers(): User[] {
    return this.users;
  }
}
```

#### **Account Service: `accountService.ts`**

```typescript
// src/services/accountService.ts
import { User } from '../models/userModel';
import { Account, SavingsAccount, CheckingAccount } from '../models/accountModel';

export class AccountService {
  private accounts: Map<User, Account[]> = new Map();

  public createSavingsAccount(user: User, initialBalance: number, interestRate: number): SavingsAccount {
    const account = new SavingsAccount(`SA${Date.now()}`, initialBalance, interestRate);
    this.addAccount(user, account);
    return account;
  }

  public createCheckingAccount(user: User, initialBalance: number): CheckingAccount {
    const account = new CheckingAccount(`CA${Date.now()}`, initialBalance);
    this.addAccount(user, account);
    return account;
  }

  private addAccount(user: User, account: Account): void {
    if (!this.accounts.has(user)) {
      this.accounts.set(user, []);
    }
    this.accounts.get(user)?.push(account);
  }

  public getTotalBalance(user: User): number {
    const accounts = this.accounts.get(user) || [];
    return accounts.reduce((sum, account) => sum + account.getBalance(), 0);
  }
}
```

---

## Running the Project

### Step 1: Build the Project

To compile the TypeScript files into JavaScript, run:

```bash
npm run build
```

This will create the compiled JavaScript files in the `dist/` directory.

### Step 2: Run the Compiled Application

After building the project, run the compiled code with:

```bash
npm start
```

This will execute the `dist/app.js` file.

### Step 3: Run in Development Mode (Optional)

If you want to run the project in development mode with automatic reloading, use:

```bash
npm run dev
```

This will run the project using `nodemon` and `ts-node` so that changes are reflected without needing to manually rebuild the project.

---

## Conclusion

By following this guide, we successfully built a simple banking system using **Node.js** and **TypeScript**, applying **OOAD** principles. We modeled real-world entities like users and accounts, encapsulating their data and behavior in classes. The project demonstrates the power of TypeScript’s type safety and object-oriented features, which help create a more robust and maintainable system.

You can expand this system further by adding more features like transaction history, different account types, or user authentication. With TypeScript and OOAD, you have the tools to design scalable, clean, and maintainable Node.js applications.

