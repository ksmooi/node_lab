// npx ts-node -r tsconfig-paths/register src/demo/async/async_await_demo2.ts

// This demo showcases the usage of async/await in TypeScript using Object-Oriented Programming
// It simulates a simple e-commerce system with users and orders

// Utility function to simulate delay (representing network latency)
function delay2(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// User class representing a customer
class User {
    constructor(public id: number, public name: string) { }

    // Simulate fetching user details from a database
    static async fetch(id: number): Promise<User> {
        await delay2(1000); // Simulate network delay
        return new User(id, `User ${id}`);
    }
}

// Order class representing a purchase
class Order {
    constructor(public id: number, public userId: number, public amount: number) { }

    // Simulate fetching orders for a user from a database
    static async fetchForUser(userId: number): Promise<Order[]> {
        await delay2(1500); // Simulate network delay
        return [
            new Order(1, userId, 100),
            new Order(2, userId, 200),
            new Order(3, userId, 300),
        ];
    }
}

// ECommerceSystem class to manage users and orders
class ECommerceSystem {
    // Fetch user and their orders
    async getUserWithOrders(userId: number): Promise<{ user: User; orders: Order[] }> {
        // Fetch user and orders concurrently
        const [user, orders] = await Promise.all([
            User.fetch(userId),
            Order.fetchForUser(userId)
        ]);

        return { user, orders };
    }

    // Calculate total spent by a user
    async calculateTotalSpent(userId: number): Promise<number> {
        const { orders } = await this.getUserWithOrders(userId);
        return orders.reduce((total, order) => total + order.amount, 0);
    }
}

// Main function to demonstrate the usage
async function asyncMain2() {
    console.log("Starting e-commerce system demo...");

    const ecommerce = new ECommerceSystem();

    try {
        // Fetch user with orders
        console.log("Fetching user data and orders...");
        const { user, orders } = await ecommerce.getUserWithOrders(1);
        console.log(`User: ${user.name}`);
        console.log("Orders:", orders);

        // Calculate total spent
        console.log("Calculating total spent...");
        const totalSpent = await ecommerce.calculateTotalSpent(1);
        console.log(`Total spent by ${user.name}: $${totalSpent}`);

        // Demonstrate error handling
        console.log("Attempting to fetch non-existent user...");
        await ecommerce.getUserWithOrders(-1); // This should throw an error

    } catch (error) {
        console.error("An error occurred:", error);
    }

    console.log("E-commerce system demo completed.");
}

// Run the main function
asyncMain2().then(() => console.log("Program finished."));
