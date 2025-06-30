require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const WebSocket = require('ws');
const Message = require('./models/Message');

const app = express();
const server = http.createServer(app); // Create an HTTP server for WebSocket
const wss = new WebSocket.Server({ server }); // Attach WebSocket to the server

app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('✅ MongoDB connected'))
  .catch(err => console.error('❌ MongoDB error:', err));

// Sample route
app.get('/', (req, res) => {
  res.send('Server is running and WebSocket is ready!');
});

// WebSocket handling
wss.on('connection', async (ws) => {
  console.log('🔌 New client connected');

  // On receiving a message from client
  ws.on('message', async (data) => {
    try {
      const parsed = JSON.parse(data);

      // Handle join event
      if (parsed.type === 'join') {
        ws.username = parsed.username;

        // Send last 50 messages from MongoDB
        const messages = await Message.find().sort({ timestamp: -1 }).limit(50);
        ws.send(JSON.stringify({ type: 'history', messages: messages.reverse() }));
      }

      // Handle new chat message
      if (parsed.type === 'message') {
        const newMsg = new Message({
          username: ws.username,
          message: parsed.message,
          timestamp: new Date()
        });

        await newMsg.save();

        const outgoing = {
          type: 'new_message',
          username: ws.username,
          message: parsed.message,
          timestamp: newMsg.timestamp
        };

        // Broadcast to all clients
        wss.clients.forEach(client => {
          if (client.readyState === WebSocket.OPEN) {
            client.send(JSON.stringify(outgoing));
          }
        });
      }
    } catch (err) {
      console.error('Error handling message:', err);
    }
  });

  ws.on('close', () => {
    console.log(`❌ Client ${ws.username || 'unknown'} disconnected`);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
