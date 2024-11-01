# RabbitMQ Messaging Patterns Examples with Node.js, TypeScript, and amqplib

Welcome to the **RabbitMQ Messaging Patterns Examples** repository! This project showcases various RabbitMQ messaging patterns implemented using **Node.js**, **TypeScript**, and the **amqplib** library. Each pattern is organized into its own directory with corresponding publisher and subscriber scripts, demonstrating how to effectively utilize RabbitMQ for different communication scenarios in distributed systems.

## Table of Contents

- [Overview](#overview)
- [Project Structure](#project-structure)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Messaging Patterns](#messaging-patterns)
  - [1. Work Queue Pattern](#1-work-queue-pattern)
  - [2. Publish-Subscribe Pattern (Fanout Exchange)](#2-publish-subscribe-pattern-fanout-exchange)
  - [3. Direct Exchange Pattern](#3-direct-exchange-pattern)
  - [4. Topic Exchange Pattern](#4-topic-exchange-pattern)
  - [5. Request-Reply Pattern](#5-request-reply-pattern)
  - [6. Exchange-Exchange Pattern](#6-exchange-exchange-pattern)
- [Running the Examples](#running-the-examples)
  - [Starting RabbitMQ Server](#starting-rabbitmq-server)
  - [Executing Publishers and Subscribers](#executing-publishers-and-subscribers)
- [Troubleshooting](#troubleshooting)
- [Best Practices](#best-practices)
- [Additional Resources](#additional-resources)
- [Contributing](#contributing)

---

## Overview

RabbitMQ is a robust message broker that facilitates communication between different components of distributed systems. By implementing various messaging patterns, developers can design scalable, reliable, and efficient applications. This repository provides practical examples of the following RabbitMQ messaging patterns:

1. **Work Queue Pattern**
2. **Publish-Subscribe Pattern (Fanout Exchange)**
3. **Direct Exchange Pattern**
4. **Topic Exchange Pattern**
5. **Request-Reply Pattern**
6. **Exchange-Exchange Pattern**

Each pattern is demonstrated through TypeScript scripts that act as producers (publishers) and consumers (subscribers), showcasing how messages are routed, processed, and managed within RabbitMQ.

---

## Project Structure

The project is organized under the `src/demo/amqplib/` directory, with each messaging pattern residing in its own subdirectory. Here's an overview of the structure:

```
src/demo/amqplib/
├── work_queue
│   ├── consumer.ts
│   └── producer.ts
├── direct_exchange
│   ├── publisher.ts
│   └── subscriber.ts
├── pub_sub
│   ├── publisher.ts
│   └── subscriber.ts
├── topic_exchange
│   ├── publisher.ts
│   └── subscriber.ts
├── request_reply
│   ├── reply.ts
│   └── request.ts
├── exchange_exchange
│   ├── publisher.ts
│   └── subscriber.ts
└── README.md
```

### Description of Directories and Scripts

- **direct/**
  - **direct_publisher.ts:** Sends messages with specific routing keys to a direct exchange.
  - **direct_subscriber.ts:** Listens to queues bound with specific routing keys from the direct exchange.

- **exchange_exchange/**
  - **exchange_publisher.ts:** Publishes messages to an initial exchange, which routes them to another exchange based on binding rules.
  - **exchange_subscriber.ts:** Subscribes to queues that receive messages routed through chained exchanges.

- **fanout/**
  - **fanout_publisher.ts:** Broadcasts messages to a fanout exchange.
  - **fanout_subscriber.ts:** Subscribes to queues that receive all messages from the fanout exchange.

- **request_reply/**
  - **request.ts:** Sends request messages and awaits replies from responders.
  - **reply.ts:** Receives requests, processes them, and sends back replies.

- **topic_exchange/**
  - **topic_publisher.ts:** Publishes messages with complex routing keys to a topic exchange.
  - **topic_subscriber.ts:** Subscribes to queues with binding patterns using wildcards to receive relevant messages.

- **work_queue/**
  - **producer.ts:** Sends tasks to a work queue for processing.
  - **consumer.ts:** Processes tasks from the work queue, demonstrating load balancing among multiple consumers.

---

## Prerequisites

Before running the examples, ensure you have the following installed on your system:

- **Node.js** (v14 or later)
- **npm** (comes with Node.js) or **yarn**
- **TypeScript** (`npm install -g typescript`)
- **amqplib** (`npm install amqplib`)
- **dotenv** (`npm install dotenv`)
- **UUID** (`npm install uuid`)
- **@types/uuid** (`npm install --save-dev @types/uuid`)
- **RabbitMQ Server:** Installed locally or accessible via a remote server.

### Installing RabbitMQ Locally

If you don't have RabbitMQ installed locally, follow the instructions below based on your operating system:

- **Ubuntu:**

  ```bash
  sudo apt update
  sudo apt install rabbitmq-server
  ```

  **Start RabbitMQ Service:**

  ```bash
  sudo systemctl start rabbitmq-server
  sudo systemctl enable rabbitmq-server
  ```

- **macOS (using Homebrew):**

  ```bash
  brew update
  brew install rabbitmq
  ```

  **Start RabbitMQ Server:**

  ```bash
  brew services start rabbitmq
  ```

- **Windows:**

  Download and install RabbitMQ from the [official website](https://www.rabbitmq.com/download.html). Follow the installation instructions to set up RabbitMQ and configure the server.

---

## Installation

1. **Clone the Repository:**

   ```bash
   git clone https://github.com/yourusername/rabbitmq-messaging-patterns.git
   cd rabbitmq-messaging-patterns
   ```

2. **Install Dependencies:**

   Ensure you're in the project root directory and run:

   ```bash
   npm install
   ```

   This will install all necessary packages, including `amqplib`, `dotenv`, `uuid`, and their respective type definitions.

3. **Configure Environment Variables:**

   Create a `.env` file in the project root (if not already present) and add your RabbitMQ connection details:

   ```env
   # .env
   RABBITMQ_URL=amqp://your_username:your_password@localhost:5672
   ```

   **Note:** Replace `your_username` and `your_password` with your actual RabbitMQ credentials.

---

## Messaging Patterns

This repository demonstrates six RabbitMQ messaging patterns, each with its unique communication flow and use cases.

### 1. Work Queue Pattern

**Directory:** `work_queue/`

**Description:** Distributes tasks among multiple workers (consumers), ensuring efficient and reliable processing.

**Use Cases:**
- Task distribution in background processing.
- Load balancing across multiple workers.

**Scripts:**
- `producer.ts`: Sends tasks to the work queue.
- `consumer.ts`: Processes tasks from the work queue.

### 2. Publish-Subscribe Pattern (Fanout Exchange)

**Directory:** `pub_sub/`

**Description:** Broadcasts messages to all bound queues simultaneously, allowing multiple consumers to receive the same message.

**Use Cases:**
- Real-time notifications.
- Broadcasting events to multiple services.

**Scripts:**
- `publisher.ts`: Broadcasts messages to a fanout exchange.
- `subscriber.ts`: Subscribes to the fanout exchange to receive all messages.

### 3. Direct Exchange Pattern

**Directory:** `direct_exchange/`

**Description:** Routes messages to specific queues based on exact matching of routing keys.

**Use Cases:**
- Routing messages to specific services based on criteria.
- Selective message delivery.

**Scripts:**
- `publisher.ts`: Sends messages with specific routing keys to a direct exchange.
- `subscriber.ts`: Listens to queues bound with specific routing keys from the direct exchange.

### 4. Topic Exchange Pattern

**Directory:** `topic_exchange/`

**Description:** Routes messages to queues based on pattern matching of routing keys using wildcards (`*` and `#`).

**Use Cases:**
- Complex routing scenarios.
- Categorizing messages based on topics and subtopics.

**Scripts:**
- `publisher.ts`: Publishes messages with complex routing keys to a topic exchange.
- `subscriber.ts`: Subscribes to queues with binding patterns using wildcards to receive relevant messages.

### 5. Request-Reply Pattern

**Directory:** `request_reply/`

**Description:** Facilitates synchronous communication between services where a requester sends a request and awaits a reply from a responder.

**Use Cases:**
- Remote Procedure Calls (RPC).
- Operations requiring immediate feedback.

**Scripts:**
- `request.ts`: Sends request messages and awaits replies.
- `reply.ts`: Receives requests, processes them, and sends back replies.

### 6. Exchange-Exchange Pattern

**Directory:** `exchange_exchange/`

**Description:** Enables complex routing by chaining exchanges, allowing messages to flow through multiple exchanges before reaching queues.

**Use Cases:**
- Hierarchical routing architectures.
- Modular and scalable message routing.

**Scripts:**
- `publisher.ts`: Publishes messages to an initial exchange that routes them to another exchange.
- `subscriber.ts`: Subscribes to queues that receive messages routed through chained exchanges.

---

## Running the Examples

Follow the steps below to execute each messaging pattern. Ensure RabbitMQ is running before starting any scripts.

### Starting RabbitMQ Server

1. **Ubuntu:**

   ```bash
   sudo systemctl start rabbitmq-server
   sudo systemctl enable rabbitmq-server
   ```

2. **macOS (using Homebrew):**

   ```bash
   brew services start rabbitmq
   ```

3. **Windows:**

   - Start RabbitMQ service via the **Services** management console.

### Executing Publishers and Subscribers

For each messaging pattern, start the **subscriber** scripts **before** running the **publisher** scripts to ensure that queues are declared and bound correctly.

#### Example: Topic Exchange Pattern

1. **Start Subscribers:**

   Open terminal windows for each subscriber and run:

   ```bash
   npx ts-node src/demo/amqplib/topic_exchange/topic_subscriber.ts
   ```

   **Expected Output:**

   ```
    [*] Connected to RabbitMQ and topic exchange asserted.
    [*] AuthService waiting for logs with bindings: auth.*. To exit press CTRL+C
    [*] PaymentService waiting for logs with bindings: payment.*. To exit press CTRL+C
    [*] AllLogs waiting for logs with bindings: #.info, auth.error, payment.error. To exit press CTRL+C
   ```

2. **Run Publisher:**

   In another terminal, execute:

   ```bash
   npx ts-node src/demo/amqplib/topic_exchange/topic_publisher.ts
   ```

   **Expected Output:**

   ```
    [*] Connected to RabbitMQ and topic exchange asserted.
    [x] Sent 'auth.info':'User logged in successfully.'
    [x] Sent 'payment.warning':'Payment processing delayed.'
    [x] Sent 'auth.error':'Failed login attempt detected.'
    [x] Sent 'payment.error':'Payment transaction failed.'
    [*] RabbitMQ connection closed.
   ```

3. **Observe Subscriber Outputs:**

   - **AuthService:**
     ```
      [x] AuthService received 'auth.info':'User logged in successfully.'
      [x] AuthService received 'auth.error':'Failed login attempt detected.'
     ```
   - **PaymentService:**
     ```
      [x] PaymentService received 'payment.warning':'Payment processing delayed.'
      [x] PaymentService received 'payment.error':'Payment transaction failed.'
     ```
   - **AllLogs:**
     ```
      [x] AllLogs received 'auth.info':'User logged in successfully.'
      [x] AllLogs received 'auth.error':'Failed login attempt detected.'
      [x] AllLogs received 'payment.error':'Payment transaction failed.'
     ```

#### Running Other Patterns

Repeat similar steps for other messaging patterns:

1. **Work Queue Pattern:**

   - **Start Consumers:**
     ```bash
     npx ts-node src/demo/amqplib/work_queue/consumer.ts
     ```
   - **Run Producer:**
     ```bash
     npx ts-node src/demo/amqplib/work_queue/producer.ts
     ```

2. **Publish/Subscribe Pattern (Fanout Exchange):**

   - **Start Subscribers:**
     ```bash
     npx ts-node src/demo/amqplib/fanout/fanout_subscriber.ts
     ```
   - **Run Publisher:**
     ```bash
     npx ts-node src/demo/amqplib/fanout/fanout_publisher.ts
     ```

3. **Direct Exchange Pattern:**

   - **Start Subscribers:**
     ```bash
     npx ts-node src/demo/amqplib/direct/direct_subscriber.ts
     ```
   - **Run Publisher:**
     ```bash
     npx ts-node src/demo/amqplib/direct/direct_publisher.ts
     ```

4. **Request-Reply Pattern:**

   - **Start Responder:**
     ```bash
     npx ts-node src/demo/amqplib/request_reply/reply.ts
     ```
   - **Run Requester:**
     ```bash
     npx ts-node src/demo/amqplib/request_reply/request.ts
     ```

5. **Exchange-Exchange Pattern:**

   - **Start Subscribers:**
     ```bash
     npx ts-node src/demo/amqplib/exchange_exchange/exchange_subscriber.ts
     ```
   - **Run Publisher:**
     ```bash
     npx ts-node src/demo/amqplib/exchange_exchange/exchange_publisher.ts
     ```

---

## Troubleshooting

If you encounter issues while running the examples, consider the following steps:

1. **Check RabbitMQ Server Status:**

   Ensure that RabbitMQ is running and accessible.

   ```bash
   sudo systemctl status rabbitmq-server
   ```

2. **Verify Exchange and Queue Declarations:**

   Use the RabbitMQ Management Interface (`http://localhost:15672/`) to confirm that exchanges and queues are declared with the correct properties.

3. **Ensure Correct Execution Order:**

   Always start subscriber scripts **before** running publisher scripts to prevent message loss.

4. **Handle TypeScript Errors:**

   If you encounter TypeScript compilation errors, ensure all type declarations are installed. For example, install `@types/uuid` if using the `uuid` package:

   ```bash
   npm install --save-dev @types/uuid
   ```

5. **Review Console Logs:**

   Check the terminal outputs for any error messages or logs that indicate the nature of the issue.

6. **Restart RabbitMQ (If Necessary):**

   If you've made changes to exchange or queue configurations that conflict with existing declarations, consider restarting RabbitMQ:

   ```bash
   sudo systemctl restart rabbitmq-server
   ```

---

## Best Practices

To build robust and maintainable RabbitMQ-based applications, adhere to the following best practices:

1. **Reuse Connections and Channels:**
   - Implement connection pooling or use singleton patterns to manage RabbitMQ connections and channels efficiently.

2. **Declare Durable Exchanges and Queues:**
   - Use durable exchanges and queues to ensure they persist across RabbitMQ restarts.
   - Mark messages as persistent to prevent loss during crashes.

3. **Handle Errors Gracefully:**
   - Implement comprehensive error handling to manage unexpected scenarios without crashing your application.

4. **Implement Graceful Shutdowns:**
   - Ensure that your application properly closes connections and channels upon termination to prevent resource leaks.

5. **Use Environment Variables for Configuration:**
   - Manage sensitive information like RabbitMQ credentials using environment variables and the `dotenv` package.

6. **Monitor RabbitMQ:**
   - Utilize the RabbitMQ Management Interface to monitor exchanges, queues, and message flows for effective debugging and optimization.

7. **Maintain Consistent Exchange and Queue Declarations:**
   - Ensure that all scripts declare exchanges and queues with identical properties to prevent precondition failures.

8. **Implement Logging:**
   - Use logging libraries (e.g., Winston) to track application behavior and message flows.

---

## Additional Resources

- **RabbitMQ Official Documentation:** [https://www.rabbitmq.com/documentation.html](https://www.rabbitmq.com/documentation.html)
- **amqplib GitHub Repository:** [https://github.com/squaremo/amqp.node](https://github.com/squaremo/amqp.node)
- **TypeScript Documentation:** [https://www.typescriptlang.org/docs/](https://www.typescriptlang.org/docs/)
- **Node.js Documentation:** [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
- **dotenv GitHub Repository:** [https://github.com/motdotla/dotenv](https://github.com/motdotla/dotenv)
- **UUID Package:** [https://www.npmjs.com/package/uuid](https://www.npmjs.com/package/uuid)
- **RabbitMQ Tutorials:** [https://www.rabbitmq.com/getstarted.html](https://www.rabbitmq.com/getstarted.html)
- **Winston Logging Library:** [https://github.com/winstonjs/winston](https://github.com/winstonjs/winston)
- **Inquirer.js for CLI Interfaces:** [https://github.com/SBoudrias/Inquirer.js/](https://github.com/SBoudrias/Inquirer.js/)

---

## Contributing

Contributions are welcome! If you'd like to enhance the examples, fix bugs, or add new patterns, please follow these steps:

1. **Fork the Repository:**

   Click the "Fork" button at the top-right corner of the repository page.

2. **Create a Feature Branch:**

   ```bash
   git checkout -b feature/YourFeatureName
   ```

3. **Commit Your Changes:**

   ```bash
   git commit -m "Add your detailed message here"
   ```

4. **Push to the Branch:**

   ```bash
   git push origin feature/YourFeatureName
   ```

5. **Open a Pull Request:**

   Navigate to the original repository and click on "Compare & pull request."

6. **Describe Your Changes:**

   Provide a clear description of what you've done and why.

---

**Happy Coding! 🚀**