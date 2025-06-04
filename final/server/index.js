require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: process.env.CLIENT_URL || 'http://localhost:5173',
    methods: ['GET', 'POST']
  }
});

// 中间件配置
app.use(cors());
app.use(express.json());

// 数据库连接
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/elderly-care', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => {
  console.log('Connected to MongoDB');
}).catch((error) => {
  console.error('MongoDB connection error:', error);
});

// WebSocket 连接处理
io.on('connection', (socket) => {
  console.log('New client connected');

  socket.on('join-room', (roomId) => {
    socket.join(roomId);
    socket.to(roomId).emit('user-connected');
  });

  socket.on('send-message', (message, roomId) => {
    socket.to(roomId).emit('receive-message', message);
  });

  socket.on('start-call', (data) => {
    socket.to(data.roomId).emit('incoming-call', data);
  });

  socket.on('accept-call', (roomId) => {
    socket.to(roomId).emit('call-accepted');
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

// 路由配置
const authRoutes = require('./routes/auth');
const communicationRoutes = require('./routes/communication');
const friendRoutes = require('./routes/friends');

app.use('/auth', authRoutes);
app.use('/communications', communicationRoutes);
app.use('/friends', friendRoutes);

app.get('/', (req, res) => {
  res.send('Elderly Care Backend API');
});

// 启动服务器
const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});