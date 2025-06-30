# Real-Time Chat Application (MERN Stack)

A full-stack real-time chat application built using MongoDB, Express.js, React.js, and Node.js. 

## Live Demo

- Frontend: https://chat-app-tau-beige.vercel.app
- Backend: https://chat-backend-wtq7.onrender.com
- WebSocket URL: wss://chat-backend-wtq7.onrender.com

## Project Structure

chat-app/
├── backend/ # Node.js + Express + WebSocket + MongoDB
├── frontend/ # React.js SPA with WebSocket client
└── README.md



## Features

- Real-time messaging using WebSockets (`ws` module)
- Join with a username
- Load last 50 messages on connect
- Messages are saved in MongoDB with timestamp and sender
- WebSocket broadcast to all connected clients
- Dark mode toggle
- Emoji picker integration
- Responsive, mobile-friendly UI
- Separate alignment and styles for self vs. other messages

## Technology Stack

- Frontend: React.js, WebSocket API
- Backend: Node.js, Express.js, ws (WebSocket module)
- Database: MongoDB Atlas using Mongoose
- Deployment: Render (backend), Vercel (frontend)

## Getting Started (Local Setup)

### Backend Setup

1. Navigate to the backend folder:

cd backend


2. Install dependencies:

npm install



3. Create a `.env` file:

MONGODB_URI=your_mongodb_connection_string
PORT=5000



4. Start the server:

node server.js


### Frontend Setup

1. Navigate to the frontend folder:

cd frontend



2. Install dependencies:

npm install



3. Create a `.env` file:

REACT_APP_WS_URL=ws://localhost:5000



4. Start the React development server:

npm start



## Deployment Details

- Frontend is deployed to Vercel from the `frontend/` directory
- Backend is deployed to Render from the `backend/` directory
- WebSocket URL is configured in the frontend via `.env` as `REACT_APP_WS_URL`

## Application Architecture

- Express server uses the `ws` module to handle WebSocket connections
- On client connection:
- Accepts username
- Sends last 50 chat messages from MongoDB
- On receiving a message:
- Saves it to MongoDB with sender and timestamp
- Broadcasts to all connected clients
- React frontend establishes WebSocket connection
- Displays messages in real-time
- Dark mode styling and emoji picker are handled on the client side

## Assumptions and Design Choices

- All users are anonymous and identified only by chosen usernames
- One shared public chat room for all users
- Messages are text-only for simplicity
- Styling is inspired by modern chat apps for familiarity and clarity

## Author
Name: Anushka Kumari
Email: anushkalaheri@gmail.com
