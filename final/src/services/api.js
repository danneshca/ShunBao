import axios from 'axios';

const API_URL = 'http://localhost:3000';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// 请求拦截器：添加token到请求头
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 用户认证相关API
export const auth = {
  register: async (userData) => {
    const response = await api.post('/auth/register', userData);
    return response.data;
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);
    if (response.data.token) {
      localStorage.setItem('token', response.data.token);
    }
    return response.data;
  },
  logout: () => {
    localStorage.removeItem('token');
  },
  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  }
};

// 好友相关API
export const friends = {
  getFriendList: async () => {
    const response = await api.get('/friends');
    return response.data;
  },
  addFriend: async (friendId) => {
    const response = await api.post('/friends/add', { friendId });
    return response.data;
  },
  removeFriend: async (friendId) => {
    const response = await api.delete(`/friends/${friendId}`);
    return response.data;
  }
};

// 通讯相关API
export const communications = {
  getChatHistory: async (friendId) => {
    const response = await api.get(`/communications/messages/${friendId}`);
    return response.data;
  },
  sendMessage: async (friendId, message) => {
    const response = await api.post('/communications/messages', {
      receiverId: friendId,
      content: message
    });
    return response.data;
  },
  getLastMessage: async (friendId) => {
    const response = await api.get(`/communications/messages/${friendId}?limit=1`);
    const messages = response.data;
    return messages.length > 0 ? messages[0] : null;
  },
  getCallHistory: async () => {
    const response = await api.get('/communications/calls');
    return response.data;
  }
};