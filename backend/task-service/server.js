const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const bodyParser = require('body-parser');

const cors = require('cors');

// allow your frontend origin (or use `app.use(cors())` to allow all origins)

const app = express();
app.use(bodyParser.json());
app.use(cors());


const JWT_SECRET = process.env.JWT_SECRET || 'your_jwt_secret';
const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3002';

mongoose.connect('mongodb://localhost:27017/task-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  title: String,
  description: String,
  deadline: Date,
  status: { type: String, enum: ['pending', 'done'], default: 'pending' },
});
const Task = mongoose.model('Task', taskSchema);

// auth middleware
const auth = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) return res.status(401).json({ message: 'Missing auth header' });
  const token = authHeader.split(' ')[1];
  try {
    const { userId } = jwt.verify(token, JWT_SECRET);
    req.userId = userId;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

app.get('/tasks', auth, async (req, res) => {
  const tasks = await Task.find({ userId: req.userId }).sort({ deadline: 1 });
  res.json(tasks);
});

app.post('/tasks', auth, async (req, res) => {
  const { title, description, deadline } = req.body;
  if (!title || !deadline) return res.status(400).json({ message: 'Title and deadline are required' });
  try {
    const task = new Task({
      userId: req.userId,
      title,
      description,
      deadline: new Date(deadline),
    });
    await task.save();
    res.json(task);
    // notify creation
    axios.post(`${NOTIFICATION_SERVICE_URL}/notifications`, {
      userId: req.userId,
      message: `Task created: ${title}`,
      type: 'task_created',
      taskId: task._id,
    }).catch(console.error);
    // schedule deadline reminder
    const now = new Date();
    const remindAt = new Date(task.deadline.getTime() - 60 * 60 * 1000);
    const ms = remindAt.getTime() - now.getTime();
    if (ms > 0) {
      setTimeout(() => {
        axios.post(`${NOTIFICATION_SERVICE_URL}/notifications`, {
          userId: req.userId,
          message: `Deadline approaching for task: ${title}`,
          type: 'deadline',
          taskId: task._id,
        }).catch(console.error);
      }, ms);
    }
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating task' });
  }
});

app.put('/tasks/:id/done', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId: req.userId },
      { status: 'done' },
      { new: true }
    );
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json(task);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error marking task done' });
  }
});

app.delete('/tasks/:id', auth, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId: req.userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Task service listening on port ${PORT}`));