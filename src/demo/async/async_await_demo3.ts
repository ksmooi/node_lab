// npx ts-node -r tsconfig-paths/register src/demo/async/async_await_demo3.ts

// This demo showcases the usage of async/await in TypeScript using Object-Oriented Programming
// It simulates a simple banking system with accounts and transactions

// Utility function to simulate delay (representing network or processing time)
function delay3( ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Enum for transaction types
enum TransactionType {
    Deposit,
    Withdrawal,
    Transfer
}

// Class representing a bank account
class BankAccount {
    private balance: number = 0;

    constructor(
        public readonly id: string,
        public readonly ownerName: string
    ) {}

    async getBalance(): Promise<number> {
        await delay3( 500); // Simulate delay in fetching balance
        return this.balance;
    }

    async deposit(amount: number): Promise<void> {
        await delay3( 1000); // Simulate processing time
        this.balance += amount;
    }

    async withdraw(amount: number): Promise<void> {
        await delay3( 1000); // Simulate processing time
        if (amount > this.balance) {
            throw new Error("Insufficient funds");
        }
        this.balance -= amount;
    }
}

// Class representing a transaction
class Transaction {
    constructor(
        public readonly id: string,
        public readonly type: TransactionType,
        public readonly amount: number,
        public readonly fromAccountId: string,
        public readonly toAccountId?: string
    ) {}

    async execute(bankingSystem: BankingSystem): Promise<void> {
        await delay3( 1500); // Simulate transaction processing time
        switch (this.type) {
            case TransactionType.Deposit:
                await bankingSystem.deposit(this.fromAccountId, this.amount);
                break;
            case TransactionType.Withdrawal:
                await bankingSystem.withdraw(this.fromAccountId, this.amount);
                break;
            case TransactionType.Transfer:
                if (!this.toAccountId) throw new Error("Transfer requires a destination account");
                await bankingSystem.transfer(this.fromAccountId, this.toAccountId, this.amount);
                break;
        }
    }
}

// Class representing the banking system
class BankingSystem {
    private accounts: Map<string, BankAccount> = new Map();

    async createAccount(id: string, ownerName: string): Promise<BankAccount> {
        await delay3( 1000); // Simulate account creation time
        const account = new BankAccount(id, ownerName);
        this.accounts.set(id, account);
        return account;
    }

    async getAccount(id: string): Promise<BankAccount> {
        await delay3( 500); // Simulate account retrieval time
        const account = this.accounts.get(id);
        if (!account) throw new Error(`Account ${id} not found`);
        return account;
    }

    async deposit(accountId: string, amount: number): Promise<void> {
        const account = await this.getAccount(accountId);
        await account.deposit(amount);
    }

    async withdraw(accountId: string, amount: number): Promise<void> {
        const account = await this.getAccount(accountId);
        await account.withdraw(amount);
    }

    async transfer(fromAccountId: string, toAccountId: string, amount: number): Promise<void> {
        const [fromAccount, toAccount] = await Promise.all([
            this.getAccount(fromAccountId),
            this.getAccount(toAccountId)
        ]);
        await fromAccount.withdraw(amount);
        await toAccount.deposit(amount);
    }

    async processTransaction(transaction: Transaction): Promise<void> {
        await transaction.execute(this);
    }
}

// Main function to demonstrate the usage
async function asyncMain3() {
    console.log("Starting banking system demo...");

    const bankingSystem = new BankingSystem();

    try {
        // Create accounts
        console.log("Creating accounts...");
        const account1 = await bankingSystem.createAccount("A001", "Alice");
        const account2 = await bankingSystem.createAccount("A002", "Bob");

        // Perform transactions
        console.log("Performing transactions...");
        const transactions = [
            new Transaction("T001", TransactionType.Deposit, 1000, "A001"),
            new Transaction("T002", TransactionType.Deposit, 500, "A002"),
            new Transaction("T003", TransactionType.Transfer, 300, "A001", "A002"),
            new Transaction("T004", TransactionType.Withdrawal, 100, "A002")
        ];

        for (const transaction of transactions) {
            await bankingSystem.processTransaction(transaction);
            console.log(`Transaction ${transaction.id} completed.`);
        }

        // Check final balances
        console.log("Checking final balances...");
        const balance1 = await account1.getBalance();
        const balance2 = await account2.getBalance();
        console.log(`Alice's balance: $${balance1}`);
        console.log(`Bob's balance: $${balance2}`);

        // Attempt an invalid transaction
        console.log("Attempting invalid withdrawal...");
        await bankingSystem.processTransaction(
            new Transaction("T005", TransactionType.Withdrawal, 1000, "A002")
        );

    } catch (error) {
        console.error("An error occurred:", error instanceof Error ? error.message : String(error));
    }

    console.log("Banking system demo completed.");
}

// Run the main function
asyncMain3().then(() => console.log("Program finished."));

// Let's break the example down:
//
// 1. "Starting banking system demo...": The program begins.
//
// 2. "Creating accounts...": Two accounts are created for Alice and Bob.
//
// 3. "Performing transactions...": 
//    - T001: Deposit to Alice's account (likely $1000)
//    - T002: Deposit to Bob's account (likely $500)
//    - T003: Transfer from Alice to Bob (likely $300)
//    - T004: Withdrawal from Bob's account (likely $100)
//
// 4. "Checking final balances...":
//    - Alice's balance: $700 (1000 initial deposit - 300 transfer = 700)
//    - Bob's balance: $700 (500 initial deposit + 300 transfer - 100 withdrawal = 700)
//
// 5. "Attempting invalid withdrawal...": The program tries to withdraw $1000 from Bob's account.
//
// 6. "An error occurred: Insufficient funds": This error is correctly caught and displayed, as Bob only has $700 in his account.
//
// 7. "Banking system demo completed.": The main function finishes executing.
//
// 8. "Program finished.": The program ends.
