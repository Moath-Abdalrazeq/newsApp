const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3001; // Replace with your desired port

let activeBroadcasterId = null;

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('startStream', () => {
    console.log('User started streaming:', socket.id);
    activeBroadcasterId = socket.id; // Set the active broadcaster ID
    const streamURL = 'http://192.168.1.104:3001'; // Replace with the actual stream URL
    io.emit('streamURL', streamURL); // Send the streamURL to all connected clients
  });

  socket.on('watchStream', () => {
    console.log('User wants to watch the stream:', socket.id);
    if (activeBroadcasterId) {
      const streamURL = 'http://192.168.1.104:3001'; // Replace with the actual stream URL
      socket.emit('streamURL', streamURL); // Send the streamURL to the specific client who wants to watch
    } else {
      socket.emit('noActiveBroadcaster');
    }
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    if (socket.id === activeBroadcasterId) {
      // If the active broadcaster disconnects, reset the activeBroadcasterId
      activeBroadcasterId = null;
    }
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
