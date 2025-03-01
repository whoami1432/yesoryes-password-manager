# YESORYES - User Management System

This project is a user management system built with Node.js, Express, and MongoDB. It provides APIs for user registration, login, email verification, password reset, and more.

## Project Setup

1. Clone the repository:

    ```sh
    git clone https://github.com/whoami1432/yesoryes-password-manager.git
    cd yesoryes-password-manager
    ```

2. Install dependencies:

    ```sh
    npm install
    ```

3. Create a [.env](http://_vscodecontentref_/1) file in the root directory and add the following environment variables:

    ```env
    PORT=8081
    MONGODB_CONNECTION_STRING=<your-mongodb-connection-string>
    ENCRYPTION_SECRET_KEY=<your-encryption-secret-key>
    ENCRYPTION_ALGORITHM=aes-256-ctr
    API_BASE_URL=http://localhost:8081
    ```

4. Start the development server:

    ```sh
    npm run dev
    ```

5. Start the production server:

    ```sh
    npm run start
    ```

6. Start lint the whole project:
    ```sh
    npm run prettify
    ```
7. Check if any circular dependency available:
    ```sh
    npm run find-circular-deps
    ```

## API Documentaion

    All the endpoint details available in /api-docs end point
    Swagger ui shows all the api documentation

    API DOCS URL -> http://localhost:8081/api-docs

## Tech Stack Used

1. Node JS (Express JS Framework)
2. MongoDb
3. Swagger - API Document
4. Jest - Unit Test

## Postman Collection

Postman collection has been added. You can import it and check the data using the file `yesoryespostman_collection.json`.

## Protections and features (middlewares) Added

- **Express**: Web framework for Node.js.
- **Rate Limiter**: Middleware to limit repeated requests to public APIs and/or endpoints.
- **Nodemon**: Automatically restarts the server for development.
- **Winston**: Logging library for application logs.
- **UUID**: Generates unique request IDs.
- **Compression**: Gzip compression for improved performance.
- **Helmet**: Security middleware for HTTP headers.
- **CORS**: Middleware to enable Cross-Origin Resource Sharing.
- **Body-Parser**: Middleware to parse incoming request bodies.
- **Error Handling**: Standardized error responses.
- **HPP**: Prevent HTTP Parameter Pollution.
- **Request Logging**: Logs request body, params, query, and headers.
- **Prettier**: Code formatter for consistent code style.
- **`.gitignore`**: Pre-configured to exclude sensitive files and directories.
- **Swagger**: API documentation and testing tool.

## User Schema

The `userModel` schema defines the structure of the user documents in the MongoDB database. Below are the details of each field:

- `name`: A required string field for the user's name.
- `email`: A required string field for the user's email, which must be unique and indexed.
- `mobileNumber`: A required number field for the user's mobile number.
- `password`: A required string field for the user's password.
- `country`: A required string field for the user's country.
- `city`: A required string field for the user's city.
- `state`: A required string field for the user's state.
- `gender`: A required string field for the user's gender, which can be 'Male', 'Female', or 'Other'.
- `createdDate`: A date field that defaults to the current date and time when the document is created.
- `modifiedDate`: A date field for the last modified date of the document.
- `isDeleted`: A boolean field that indicates whether the user is deleted, defaulting to `false`.
- `role`: A string field for the user's role, which can be 'public', 'user', or 'admin', defaulting to 'public'.
- `isEmailVerified`: A boolean field that indicates whether the user's email is verified, defaulting to `false`.
