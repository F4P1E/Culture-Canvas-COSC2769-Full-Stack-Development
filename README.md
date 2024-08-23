Here is the updated `README.md` file for the project, **Culture Canvas**:

```markdown
# Culture Canvas

## Project Description
Culture Canvas is a web application built with React, designed to provide a seamless and intuitive user experience. The project uses a modern UI framework, efficient state management, and integrates various libraries and tools to ensure scalability and maintainability.

## Technologies and Libraries

### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Material UI**: A popular React UI framework for creating modern, responsive layouts.
  ```bash
  npm install @mui/material @emotion/react @emotion/styled
  ```
- **Redux Toolkit**: Simplifies Redux development for state management in your application.
  ```bash
  npm install react-redux
  ```
- **React Router**: For managing routes in your single-page application.
  ```bash
  npm install react-router-dom@6
  ```
- **Redux Persist**: Persist Redux state across sessions.
  ```bash
  npm install redux-persist
  ```
- **React Drop-Zone**: For file uploads using drag-and-drop functionality.
  ```bash
  npm install --save react-dropzone
  ```

### Backend
- **Nodemon**: A utility that monitors your Node.js application and automatically restarts the server when file changes are detected.
  ```bash
  npm install -g nodemon
  ```
- **Dotenv**: For managing environment variables in your Node.js application.
  ```bash
  npm install dotenv --save
  ```
- **Mongoose**: An ODM (Object Data Modeling) library for MongoDB and Node.js.
  ```bash
  npm install mongoose
  ```
- **Jsonwebtoken**: For implementing JWT-based authentication.
  ```bash
  npm install jsonwebtoken
  ```
- **Multer**: Middleware for handling `multipart/form-data`, primarily used for file uploads.
  ```bash
  npm install --save multer
  ```
- **GridFS**: For storing and retrieving large files in MongoDB.
  ```bash
  npm install multer-gridfs-storage --save
  ```

### Validation
- **YUP**: A schema builder for value parsing and validation.
  ```bash
  npm install -S yup
  ```

## Getting Started

### Prerequisites
Ensure you have the following installed on your machine:
- [Node.js](https://nodejs.org/)
- [npm](https://www.npmjs.com/)

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/F4P1E/Group-Assigment-Social-Network.git
   ```
   **Clone specific branch**:
   ```bash
   git clone -b my-branch git@github.com:user/myproject.git
   ```
3. **Install dependencies**:
   ```bash
   cd culture-canvas
   npm install
   ```
4. **Create a `.env` file**:
   Create a `.env` file in the root of your project and configure your environment variables.

5. **Start the development server**:
   ```bash
   npm start
   ```

### Running the Server with Nodemon
To run the server with Nodemon, use the following command:
```bash
nodemon server.js
```

## Usage

### Frontend
- The frontend is built using React and styled with Material UI components. The state is managed using Redux Toolkit with persistence enabled through Redux Persist.

### Backend
- The backend handles API requests, authentication, and file storage. It utilizes MongoDB for data storage, JWT for authentication, and Multer/GridFS for file handling.

## File Uploads
- Implemented using React Drop-Zone on the frontend and Multer/GridFS on the backend.

## Authentication
- The application uses JSON Web Tokens (JWT) for secure user authentication.

## Validation
- YUP is used for form validation, ensuring all user input is verified before being processed.
