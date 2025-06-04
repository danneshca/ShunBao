const express = require('express');
const router = express.Router();
const { CallRecord, Message } = require('../models/Communication');
const User = require('../models/User');

// 获取联系人列表
router.get('/contacts', async (req, res) => {
  try {
    const user = await User.findById(req.user._id)
      .populate('contacts', 'name username phone');
    res.json(user.contacts);
  } catch (error) {
    res.status(500).json({ message: '获取联系人失败', error: error.message });
  }
});

// 添加联系人
router.post('/contacts', async (req, res) => {
  try {
    const { contactId } = req.body;
    const user = await User.findById(req.user._id);
    
    if (user.contacts.includes(contactId)) {
      return res.status(400).json({ message: '该联系人已存在' });
    }

    user.contacts.push(contactId);
    await user.save();

    const contact = await User.findById(contactId).select('name username phone');
    res.json(contact);
  } catch (error) {
    res.status(500).json({ message: '添加联系人失败', error: error.message });
  }
});

// 获取通话记录
router.get('/calls', async (req, res) => {
  try {
    const calls = await CallRecord.find({
      $or: [
        { caller: req.user._id },
        { receiver: req.user._id }
      ]
    })
    .populate('caller receiver', 'name')
    .sort({ startTime: -1 });

    res.json(calls);
  } catch (error) {
    res.status(500).json({ message: '获取通话记录失败', error: error.message });
  }
});

// 创建通话记录
router.post('/calls', async (req, res) => {
  try {
    const { receiverId, type, status } = req.body;
    
    const call = new CallRecord({
      caller: req.user._id,
      receiver: receiverId,
      type,
      status,
      startTime: new Date()
    });

    await call.save();
    res.status(201).json(call);
  } catch (error) {
    res.status(500).json({ message: '创建通话记录失败', error: error.message });
  }
});

// 更新通话记录
router.put('/calls/:id', async (req, res) => {
  try {
    const { endTime, status } = req.body;
    const call = await CallRecord.findById(req.params.id);

    if (!call) {
      return res.status(404).json({ message: '通话记录不存在' });
    }

    call.endTime = endTime;
    call.status = status;
    if (endTime) {
      call.duration = (new Date(endTime) - new Date(call.startTime)) / 1000; // 转换为秒
    }

    await call.save();
    res.json(call);
  } catch (error) {
    res.status(500).json({ message: '更新通话记录失败', error: error.message });
  }
});

// 获取消息记录
router.get('/messages/:contactId', async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user._id, receiver: req.params.contactId },
        { sender: req.params.contactId, receiver: req.user._id }
      ]
    })
    .populate('sender receiver', 'name')
    .sort({ timestamp: -1 });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: '获取消息记录失败', error: error.message });
  }
});

// 发送消息
router.post('/messages', async (req, res) => {
  try {
    const { receiverId, content, type = 'text' } = req.body;
    
    const message = new Message({
      sender: req.user._id,
      receiver: receiverId,
      content,
      type
    });

    await message.save();
    res.status(201).json(message);
  } catch (error) {
    res.status(500).json({ message: '发送消息失败', error: error.message });
  }
});

// 更新消息状态
router.put('/messages/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    const message = await Message.findById(req.params.id);

    if (!message) {
      return res.status(404).json({ message: '消息不存在' });
    }

    message.status = status;
    await message.save();
    res.json(message);
  } catch (error) {
    res.status(500).json({ message: '更新消息状态失败', error: error.message });
  }
});

module.exports = router;