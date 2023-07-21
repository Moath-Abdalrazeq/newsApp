const express = require('express');
const http = require('http');
const socketIO = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIO(server);

const PORT = 3001; // Replace with your desired port

io.on('connection', (socket) => {
  console.log('User connected:', socket.id);

  socket.on('startStream', () => {
    console.log('User started streaming:', socket.id);
    // Handle the incoming live stream here, e.g., set up WebRTC or media server.
    // Broadcast the stream URL to other connected clients (viewer devices).
    const streamURL = 'http://192.168.1.104:3001'; // Replace with the actual stream URL
    io.emit('streamURL', streamURL);
  });

  socket.on('disconnect', () => {
    console.log('User disconnected:', socket.id);
    // Handle disconnection here, clean up resources if needed.
  });
});

server.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
