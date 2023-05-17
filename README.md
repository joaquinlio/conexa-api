# Backend Developer Project

This repository contains two separate microservices, "login" and "business," which communicate with each other using Redis. This document provides instructions on how to set up and run both microservices.

## Prerequisites

Before proceeding, ensure that you have the following dependencies installed on your system:

- Node.js (version X.X.X)
- Redis (version X.X.X)
- MongoDB (version X.X.X)

## Installation

1. Clone this repository to your local machine.
2. Run the following command to install the dependencies:

## Configuration

Both microservices require certain configuration parameters to establish connections and settings. Follow these steps to configure the microservices:

1. In the root directory, create a `.env` file.
2. Add the following configuration parameters to the `.env` file:

```bash
PORT=3000
JWT_SECRET=conexaapi
DB_NAME=conexa-api
DB_HOST=mongodb://127.0.0.1:27017/
TRANSPORT_SERVICE_NAME=BUSINESS_SERVICE
TRANSPORT_HOST=localhost
TRANSPORT_PORT=6379
```

## Running the Microservices

To start the microservices, follow the steps below:

1. Run the following command to start the microservice:

```bash
npm run start login
```

3. Open another terminal.
4. Run the following command to start the microservice:

```bash
npm run start business
```

## Interacting with the Microservices

Once both microservices are running, you can interact with them using the following endpoints:

```bash
[POST] http://localhost:3000/users
[Body]
{
    "email": "juan@gmail.com",
    "password": "123asd"
}

[POST] http://localhost:3000/users/login
[Body]
{
    "email": "juan@gmail.com",
    "password": "123asd"
}

[GET] http://localhost:3000/users
[Avaliable params] 'page - limit - email'
```

Refer to the API documentation of each microservice for details on the available endpoints and how to use them.

## Testing

To run the tests for the microservices, follow these steps:

1. Run the following command to execute the tests:

```bash
npm run test
```

## Things I Would Have Liked to Implement

During the development of this project, there are a few enhancements I would have liked to include:

1. More Test Cases: Although the existing test suite covers critical functionality, additional test cases would have improved code quality and robustness. This includes covering edge cases, error handling, and boundary conditions.

2. End-to-End (E2E) Tests: Integrating E2E tests would have ensured seamless interaction between microservices and Redis. These tests simulate real-world scenarios, validating the behavior of the entire system and providing greater confidence in its functionality and integration.

3. Modularized Message Sending: Separating the logic for sending messages between microservices would have improved maintainability and scalability. By extracting this logic into a separate module or class, code reusability and overall architecture would be enhanced.
