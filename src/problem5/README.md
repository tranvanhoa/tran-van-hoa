# 99Tech Code Challenge

- Applied Position: Backend Developer

## Problems

- [x] [Problem 5: A Crude Server](https://s5tech.notion.site/Problem-5-A-Crude-Server-b2978984b3c64b7dae6451f1c215bef7)

## Solution

This project is a NestJS application that serves as a basic API server.

- NodeJs
- Express, NestJs with CQRS
- Sqlite

Below are the steps to set up and run the server.

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```sh
   git clone git@github.com:tranvanhoa/tran-van-hoa.git
   cd problem5
   ```
2. Install the dependencies:

```sh
npm install
# or
yarn install
```

Configuration
The application uses a configuration file located at `src/problem5/config/default.json`. You can override these settings using environment variables.

Running the Application
To start the application:

```sh
npm run start
# or
yarn start
```

Default Login Credential:

- username: admin@gmail.com
- password: 123456

Swagger is set up for API documentation at /api (e.g., http://localhost:3000/api). Visit this endpoint for more information on API endpoints, requests, and response bodies.

Testing
To run the tests:

```sh
npm test
# or
yarn test
```

Additional Information
The application uses JWT for authentication.
