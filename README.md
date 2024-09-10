# Culture Canvas

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
- [Contribution](#contribution)

## Project Structure

The project is divided into two main parts: the frontend (`client`) and the backend (`server`).

```bash
Group-Assigment-Social-Network/
│
├── client/
│   ├── .vite/                 # Vite dependencies
│   ├── public/                # Static assets
│   ├── src/                   # Source files
│   │   ├── assets/            # Images, SVGs, etc.
│   │   ├── components/        # React components
│   │   ├── context/           # Context providers
│   │   ├── slices/            # Redux slices for state management
│   │   ├── main.jsx           # Main application component
│   │   └── store.js           # Redux store
│   ├── .eslintrc.js           # ESLint configuration
│   ├── index.html             # Main HTML file
│   ├── package.json           # Frontend dependencies
│   ├── package-lock.json      # Lock file
│   └── vite.config.js         # Vite configuration
│
├── server/
│   ├── .vscode/               # VSCode settings and configurations
│   ├── controllers/           # Route controllers
│   ├── middleware/            # Custom Express middleware
│   ├── models/                # Mongoose models for MongoDB
│   ├── routes/                # API route definitions
│   ├── .env                   # Environment variables
│   ├── app.js                 # Main application file
│   ├── package.json           # Backend dependencies
│   └── package-lock.json      # Lock file
│
├── README.md                  # Project README
└── .gitignore                 # Git ignore file
```

## Features

- **User Authentication**: Registration and login system using Express sessions.
- **Group Management**: Create and manage groups, send and accept group join requests.
- **Friends Management**: Send and accept friend requests, manage friend lists.
- **Post Creation**: Create posts with comment sections, like functionality.
- **Notifications**: Notifications for actions like friend requests and group invites.

## Installation

### Prerequisites

- **Node.js** (v20.12.0 or higher)
- **npm** (v10.8.2 or higher)

### Steps

1. **Open `Group-Assigment-Social-Network`** in VS Code.
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

3. **Run the application**:

   - Backend:
     ```bash
     cd server
     npm start
     ```
   - Open another terminal

   - Frontend:
     ```bash
     cd client
     npm run dev
     ```

## Configuration

- **Frontend**: Configuration is managed through `vite.config.js` and environment variables (if applicable).
- **Backend**: Configuration is primarily handled via the `.env` file and `app.js`.

### Environment variables

- If not exist, create a `.env` in `/server` file with the following content:

```json
PORT="8000"
MONGO_URI="mongodb+srv://Singani:singani1530@groupproject.m8wl1tq.mongodb.net/?retryWrites=true&w=majority&appName=GroupProject"
SECRET="CrystalCrusherisbetterthanCodependenceeventhoughitisharderchangemymindlmaooo"
```

## Usage

- Access the frontend of the application via `http://localhost:5173` (default Vite port).
- The backend API runs on `http://localhost:8000` (or as configured in the `.env` file).

### Site admin account credentials

- **Username**:

```
MarkOppenheimer@admin
```

- **Password**:

```
Disassemble/*-+1239876
```

## Dependencies

### Frontend

- **React**: A JavaScript library for building user interfaces.
- **Redux Toolkit**: For state management.
- **Vite**: For fast build and hot-reload during development.
- **Bootstrap**: For styling.
- **Bootstrap Icons**: For icons.
- **React Icons**: For icons.
- **React Router DOM**: For routing.
- **Redux Persist**: To persist Redux state across sessions.
- **Sass**: For styling with SCSS.

### Backend

- **Express**: Web framework for Node.js to handle HTTP requests and routing.
- **Mongoose**: MongoDB object modeling tool to interact with MongoDB.
- **Bcrypt**: For password hashing to secure user passwords.
- **Cors**: For enabling Cross-Origin Resource Sharing (CORS) to allow resource sharing between different origins.
- **Dotenv**: For loading environment variables from a `.env` file into `process.env`. For secret keys, ports, etc.
- **Express-Session**: For managing sessions, allowing server-side sessions to track user sessions.
- **Nodemon**: For automatic server restarts during development, enabling live reloading.

## Demonstrations

- **Presentation**: https://drive.google.com/file/d/1CXJrmmWQ-HztlJ4Aa1hSlDCCVWiFRB5B/view?usp=sharing

- **Demo**: https://drive.google.com/file/d/1fCqYBCWyZMwsVJ7KYMb3gRKGIRdz4LVm/view?usp=sharing

## Contribution

(Contribution here)
