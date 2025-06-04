const express = require('express');
const router = express.Router();
const User = require('../models/User');

// 获取好友列表
router.get('/', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('friends', 'name username phone');
    
    const friendsList = user.friends.map(friend => ({
      id: friend._id,
      name: friend.name,
      username: friend.username,
      phone: friend.phone
    }));

    res.json(friendsList);
  } catch (error) {
    res.status(500).json({ message: '获取好友列表失败', error: error.message });
  }
});

// 添加好友
router.post('/add', async (req, res) => {
  try {
    const { friendId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (user.friends.includes(friendId)) {
      return res.status(400).json({ message: '该好友已存在' });
    }

    user.friends.push(friendId);
    await user.save();

    const friend = await User.findById(friendId).select('name username phone');
    res.json(friend);
  } catch (error) {
    res.status(500).json({ message: '添加好友失败', error: error.message });
  }
});

// 删除好友
router.delete('/:friendId', async (req, res) => {
  try {
    const { friendId } = req.params;
    const user = await User.findById(req.user._id);
    
    const friendIndex = user.friends.indexOf(friendId);
    if (friendIndex === -1) {
      return res.status(404).json({ message: '好友不存在' });
    }

    user.friends.splice(friendIndex, 1);
    await user.save();

    res.json({ message: '删除好友成功' });
  } catch (error) {
    res.status(500).json({ message: '删除好友失败', error: error.message });
  }
});

module.exports = router;