// npx ts-node -r tsconfig-paths/register src/demo/async/async_await_demo1.ts

// This demo showcases the usage of async/await in TypeScript
// It simulates fetching user data and posts from an API

// Simulated delay function to mimic API calls
function delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
}

// Simulated API function to fetch user data
async function fetchUserData(userId: number): Promise<{ id: number; name: string }> {
    // Simulate API delay
    await delay(1000);
    // Return mock user data
    return { id: userId, name: `User ${userId}` };
}

// Simulated API function to fetch user posts
async function fetchUserPosts(userId: number): Promise<string[]> {
    // Simulate API delay
    await delay(1500);
    // Return mock post data
    return [
        `Post 1 by User ${userId}`,
        `Post 2 by User ${userId}`,
        `Post 3 by User ${userId}`,
    ];
}

// Main function to demonstrate async/await usage
async function asyncMain1() {
    console.log("Starting async operations...");

    try {
        // Fetch user data
        console.log("Fetching user data...");
        const userData = await fetchUserData(1);
        console.log("User data:", userData);

        // Fetch user posts
        console.log("Fetching user posts...");
        const userPosts = await fetchUserPosts(userData.id);
        console.log("User posts:", userPosts);

        // Demonstrate concurrent API calls using Promise.all
        console.log("Fetching data for multiple users concurrently...");
        const userIds = [2, 3, 4];
        const userPromises = userIds.map(id => fetchUserData(id));
        const users = await Promise.all(userPromises);
        console.log("Multiple users data:", users);

    } catch (error) {
        // Error handling
        console.error("An error occurred:", error);
    }

    console.log("Async operations completed.");
}

// Run the main function
asyncMain1().then(() => console.log("Program finished."));
