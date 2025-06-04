import io from 'socket.io-client';

class SocketService {
  constructor() {
    this.socket = null;
    this.callbacks = {
      onMessage: null,
      onIncomingCall: null,
      onCallAccepted: null,
      onUserConnected: null,
      onUserDisconnected: null
    };
  }

  connect() {
    if (this.socket) return;

    this.socket = io('http://localhost:3000', {
      auth: {
        token: localStorage.getItem('token')
      }
    });

    this.socket.on('connect', () => {
      console.log('Connected to WebSocket server');
    });

    this.socket.on('receive-message', (message) => {
      if (this.callbacks.onMessage) {
        this.callbacks.onMessage(message);
      }
    });

    this.socket.on('incoming-call', (data) => {
      if (this.callbacks.onIncomingCall) {
        this.callbacks.onIncomingCall(data);
      }
    });

    this.socket.on('call-accepted', () => {
      if (this.callbacks.onCallAccepted) {
        this.callbacks.onCallAccepted();
      }
    });

    this.socket.on('user-connected', () => {
      if (this.callbacks.onUserConnected) {
        this.callbacks.onUserConnected();
      }
    });

    this.socket.on('disconnect', () => {
      console.log('Disconnected from WebSocket server');
      if (this.callbacks.onUserDisconnected) {
        this.callbacks.onUserDisconnected();
      }
    });
  }

  disconnect() {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  joinRoom(roomId) {
    if (this.socket) {
      this.socket.emit('join-room', roomId);
    }
  }

  sendMessage(message, roomId) {
    if (this.socket) {
      this.socket.emit('send-message', message, roomId);
    }
  }

  startCall(data) {
    if (this.socket) {
      this.socket.emit('start-call', data);
    }
  }

  acceptCall(roomId) {
    if (this.socket) {
      this.socket.emit('accept-call', roomId);
    }
  }

  // 设置回调函数
  onMessage(callback) {
    this.callbacks.onMessage = callback;
  }

  onIncomingCall(callback) {
    this.callbacks.onIncomingCall = callback;
  }

  onCallAccepted(callback) {
    this.callbacks.onCallAccepted = callback;
  }

  onUserConnected(callback) {
    this.callbacks.onUserConnected = callback;
  }

  onUserDisconnected(callback) {
    this.callbacks.onUserDisconnected = callback;
  }
}

// 创建单例实例
const socketService = new SocketService();
export default socketService;