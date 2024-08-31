
# Full-Stack Project

## Introduction
This project is a full-stack web application that integrates a React frontend with a Node.js and Express backend. It includes features such as user authentication, group management, post creation, and notifications, making it ideal for a social networking or collaborative platform.

## Table of Contents
- [Introduction](#introduction)
- [Project Structure](#project-structure)
- [Features](#features)
- [Installation](#installation)
- [Usage](#usage)
- [Configuration](#configuration)
- [Dependencies](#dependencies)
- [Contributing](#contributing)
- [License](#license)

## Project Structure
The project is divided into two main parts: the frontend (`client`) and the backend (`server`).

```
Full-Stack/
│
├── client/
│   ├── public/                # Static assets
│   ├── src/                   # Source files
│   │   ├── assets/            # Images, SVGs, etc.
│   │   ├── components/        # React components
│   │   ├── slices/            # Redux slices for state management
│   │   └── App.jsx            # Main application component
│   ├── index.html             # Main HTML file
│   ├── package.json           # Frontend dependencies
│   └── vite.config.js         # Vite configuration
│
├── server/
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom Express middleware
│   ├── models/                # Mongoose models for MongoDB
│   ├── routes/                # API route definitions
│   ├── .env                   # Environment variables
│   ├── app.js                 # Main application file
│   ├── package.json           # Backend dependencies
│   └── .vscode/               # VSCode settings and configurations
│
└── .gitignore                 # Git ignore file
```

## Features
- **User Authentication**: Registration and login system using JWT.
- **Group Management**: Create and manage groups, send and accept group join requests.
- **Friends Management**: Send and accept friend requests, manage friend lists.
- **Post Creation**: Create posts with comment sections, like functionality.
- **Notifications**: Real-time notifications for actions like friend requests and group invites.

## Installation

### Prerequisites
- **Node.js** (v14 or higher)
- **npm** (v6 or higher)
- **MongoDB** (local or cloud instance)

### Steps
1. **Clone the repository**:
   ```bash
   git clone https://github.com/F4P1E/Group-Assigment-Social-Network.git
   cd Full-Stack
   ```

2. **Install dependencies**:
   - Frontend:
     ```bash
     cd client
     npm install
     ```
   - Backend:
     ```bash
     cd ../server
     npm install
     ```

3. **Set up environment variables**:
   - Create a `.env` file in the `server` directory based on the `.env.example` provided (if any).

4. **Run the application**:
   - Backend:
     ```bash
     cd server
     npm start
     ```
   - Frontend:
     ```bash
     cd ../client
     npm run dev
     ```

## Usage
- Access the frontend of the application via `http://localhost:5173` (default Vite port).
- The backend API runs on `http://localhost:5000` (or as configured in the `.env` file).

## Configuration
- **Frontend**: Configuration is managed through `vite.config.js` and environment variables (if applicable).
- **Backend**: Configuration is primarily handled via the `.env` file and `app.js`.

## Dependencies
### Frontend
- **React**: A JavaScript library for building user interfaces.
- **Redux Toolkit**: For state management.
- **Vite**: For fast build and hot-reload during development.

### Backend
- **Express**: Web framework for Node.js.
- **Mongoose**: MongoDB object modeling tool.
- **JWT**: For handling authentication tokens.

## Contributing
Contributions are welcome! Please fork the repository and submit a pull request.

## License
This project is licensed under the MIT License.
