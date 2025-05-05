const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb://mongo:27017/taskdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Notification schema + model (updated)
const notificationSchema = new mongoose.Schema({
  userId:    { type: String, required: true },
  message:   { type: String, required: true },
  createdAt: { type: Date, default: Date.now }
});
const Notification = mongoose.model('Notification', notificationSchema);

// Function to create a new notification (updated)
async function createNotification(userId, message) {
  try {
    const note = await Notification.create({ userId, message });
    console.log(`Notification: [${userId}] ${message}`);
    return { success: true, note };
  } catch (error) {
    console.error('Error creating notification:', error);
    return { success: false, message: 'Failed to create notification' };
  }
}

// POST /notify — general notification
app.post('/notify', async (req, res) => {
  const { userId, message } = req.body;
  if (!userId || !message) {
    return res.status(400).json({ success: false, message: 'userId & message required' });
  }
  const result = await createNotification(userId, message);
  res.json(result);
});

// POST /notify/login-success
app.post('/notify/login-success', async (req, res) => {
  const { userId } = req.body;
  if (!userId) {
    return res.status(400).json({ success: false, message: 'userId required' });
  }
  const message = `User ${userId} logged in successfully.`;
  const result = await createNotification(userId, message);
  res.json(result);
});

// POST /notify/task-created — now includes userId
app.post('/notify/task-created', async (req, res) => {
  const { userId, taskId, taskTitle } = req.body;
  if (!userId || !taskId || !taskTitle) {
    return res.status(400).json({ success: false, message: 'userId, taskId, and taskTitle required' });
  }
  const message = `Task "${taskTitle}" (ID: ${taskId}) created successfully.`;
  const result = await createNotification(userId, message);
  res.json(result);
});

// POST /notify/task-expires — now includes userId
app.post('/notify/task-expires', async (req, res) => {
  const { userId, taskId, taskTitle, expiryTime } = req.body;
  if (!userId || !taskId || !taskTitle || !expiryTime) {
    return res.status(400).json({ success: false, message: 'userId, taskId, taskTitle, and expiryTime required' });
  }
  const expiryDate = new Date(expiryTime);
  const message = `Task "${taskTitle}" (ID: ${taskId}) will expire at ${expiryDate.toLocaleString()}.`;
  const result = await createNotification(userId, message);
  res.json(result);
});

// GET /notifications — list all notifications
app.get('/notifications', async (req, res) => {
  const notes = await Notification.find().sort({ createdAt: -1 }).limit(50);
  res.json(notes);
});

app.listen(3002, () => console.log('Notification Service → http://localhost:3002'));
