# Project Name - Backend

Welcome to the backend repository! This Node.js REST API powers the backend functionalities of our application.

## Table of Contents

1. [Getting Started](#getting-started)
    - [Prerequisites](#prerequisites)
    - [Setup](#setup)
    - [Run it](#run-it)
2. [Features](#features)
3. [Environment Variables](#environment-variables)
4. [Project Structure](#project-structure)
5. [Error handling](#error-handling)
6. [Authentication](#authentication)
7. [Authorization](#authorization)
8. [Logging](#logging)
9. [Linting](#linting)

## Getting Started

### Prerequisites

-   **Node.js**: [Install](https://nodejs.org/en/download)
-   **yarn**: [Install](https://classic.yarnpkg.com/lang/en/docs/install/#windows-stable)

### Setup

Clone the repo:

```bash
git clone <https://github.com/shayes20/is565-tool>
cd is565-tool
```

Install the dependencies:

```bash
yarn install
```

Set the environment variables:

```bash
cp .env.example .env

# open .env and modify the environment variables (if needed)
```

### Run it

Running locally:

```bash
yarn dev
```

Run in staging:

```bash
yarn stage
```

Running in production:

```bash
yarn start
```

Testing (not set up yet):

```bash
# run all tests
yarn test
```

Linting (automatic linting on save is already setup, but if you need to do it manually):

```bash
# run ESLint
yarn lint

# fix ESLint errors
yarn lint:fix

# run prettier
yarn prettier

# fix prettier errors
yarn prettier:fix
```

## Features

-   **MySQL database**: [MySQL](https://www.mysql.com/)
-   **Authentication and authorization**: using [passport](http://www.passportjs.org)
-   **Validation**: request data validation using [Joi](https://github.com/hapijs/joi)
-   **Logging**: using [winston](https://github.com/winstonjs/winston) and [morgan](https://github.com/expressjs/morgan)
-   **Testing**: No testing set up at this time
-   **Error handling**: centralized error handling mechanism
-   **Process management**: advanced production process management using [PM2](https://pm2.keymetrics.io)
-   **Dependency management**: with [Yarn](https://yarnpkg.com)
-   **Environment variables**: using [dotenv](https://github.com/motdotla/dotenv) and [cross-env](https://github.com/kentcdodds/cross-env#readme)
-   **Security**: set security HTTP headers using [helmet](https://helmetjs.github.io)
-   **Santizing**: sanitize request data against xss and query injection
-   **CORS**: Cross-Origin Resource-Sharing enabled using [cors](https://github.com/expressjs/cors)
-   **Compression**: gzip compression with [compression](https://github.com/expressjs/compression)
-   **CI**: Not set up at this time
-   **Code coverage**: Not set up at this time
-   **Code quality**: Not set up at this time
-   **Linting**: with [ESLint](https://eslint.org) and [Prettier](https://prettier.io)

## Environment Variables

The environment variables can be found and modified in the `.env` file.:

```bash
# Environment
NODE_ENV=development

# Port number
PORT=3001

# MySQL
# Host
MYSQL_HOST=localhost
# User
MYSQL_USER=username
# Password
MYSQL_PASSWORD=password
# Database
MYSQL_DATABASE=database
```

## Project Structure

```
src\
 |--config\         # Environment variables and configuration related things
 |--controllers\    # Route controllers (controller layer)
 |--middlewares\    # Custom express middlewares
 |--routes\         # Routes
 |--services\       # Business logic (service layer)
 |--utils\          # Utility classes and functions
 |--app.js          # Express app
 |--index.js        # App entry point
```

## Error Handling

The app has a centralized error handling mechanism.

Controllers should try to catch the errors and forward them to the error handling middleware (by calling `next(error)`). For convenience, you can also wrap the controller inside the catchAsync utility wrapper, which forwards the error.

```javascript
import catchAsync from '../utils/catchAsync';

const controller = catchAsync(async (req, res) => {
    // this error will be forwarded to the error handling middleware
    throw new Error('Something wrong happened');
});
```

The error handling middleware sends an error response, which has the following format:

```json
{
    "code": 404,
    "message": "Not found"
}
```

When running in development mode, the error response also contains the error stack.

The app has a utility ApiError class to which you can attach a response code and a message, and then throw it from anywhere (catchAsync will catch it).

For example, if you are trying to get a user from the DB who is not found, and you want to send a 404 error, the code should look something like:

```javascript
import httpStatus from 'http-status';
import ApiError from '../utils/ApiError';
import User from '../models/User';

const getUser = async (userId) => {
    const user = await User.findById(userId);
    if (!user) {
        throw new ApiError(httpStatus.NOT_FOUND, 'User not found');
    }
};
```

## Authentication

To require authentication for certain routes, you can use the `auth` middleware.

```javascript
import { Router } from 'express';
import auth from '../../middlewares/auth';
import { createUserController } from '../../controllers/user-controller';

const router = Router();

router.post('/users', auth(), createUserController);
```

These routes require a valid JWT access token in the Authorization request header using the Bearer schema. If the request does not contain a valid access token, an Unauthorized (401) error is thrown.

**Generating Access Tokens**:

An access token can be generated by making a successful call to the register (`POST /v1/auth/register`) or login (`POST /v1/auth/login`) endpoints. The response of these endpoints also contains refresh tokens (explained below).

An access token is valid for 30 minutes. You can modify this expiration time by changing the `JWT_ACCESS_EXPIRATION_MINUTES` environment variable in the .env file.

**Refreshing Access Tokens**:

After the access token expires, a new access token can be generated, by making a call to the refresh token endpoint (`POST /v1/auth/refresh-tokens`) and sending along a valid refresh token in the request body. This call returns a new access token and a new refresh token.

A refresh token is valid for 30 days. You can modify this expiration time by changing the `JWT_REFRESH_EXPIRATION_DAYS` environment variable in the .env file.

## Authorization

The `auth` middleware can also be used to require certain rights/permissions to access a route.

```javascript
import { Router } from 'express';
import auth from '../../middlewares/auth';
import { createUserController } from '../../controllers/user-controller';

const router = Router();

router.post('/users', auth('manageUsers'), createUserController);
```

In the example above, an authenticated user can access this route only if that user has the `manageUsers` permission.

The permissions are role-based. You can view the permissions/rights of each role in the database collection.

If the user making the request does not have the required permissions to access this route, a Forbidden (403) error is thrown.

## Logging

Import the logger from `src/config/logger.js`. It is using the [Winston](https://github.com/winstonjs/winston) logging library.

Logging should be done according to the following severity levels (ascending order from most important to least important):

```javascript
import logger from '<path to src>/config/logger';

logger.error('message'); // level 0
logger.warn('message'); // level 1
logger.info('message'); // level 2
logger.http('message'); // level 3
logger.verbose('message'); // level 4
logger.debug('message'); // level 5
```

In development mode, log messages of all severity levels will be printed to the console.

In production mode, only `info`, `warn`, and `error` logs will be printed to the console.\
It is up to the server (or process manager) to actually read them from the console and store them in log files.\
This app uses pm2 in production mode, which is already configured to store the logs in log files.

Note: API request information (request url, response code, timestamp, etc.) are also automatically logged (using [morgan](https://github.com/expressjs/morgan)).

## Linting

Linting is done using [ESLint](https://eslint.org/) and [Prettier](https://prettier.io).

In this app, ESLint is configured to follow the [Airbnb JavaScript style guide](https://github.com/airbnb/javascript/tree/master/packages/eslint-config-airbnb-base) with some modifications. It also extends [eslint-config-prettier](https://github.com/prettier/eslint-config-prettier) to turn off all rules that are unnecessary or might conflict with Prettier.

To modify the ESLint configuration, update the `.eslintrc.json` file. To modify the Prettier configuration, update the `.prettierrc.json` file.

To prevent a certain file or directory from being linted, add it to `.eslintignore` and `.prettierignore`.
