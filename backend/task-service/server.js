const express = require('express');
const mongoose = require('mongoose');
const axios = require('axios');
const bodyParser = require('body-parser');
const cors = require('cors');

// allow your frontend origin (or use `app.use(cors())` to allow all origins)

const app = express();
app.use(bodyParser.json());
app.use(cors());

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://localhost:3002';

mongoose.connect('mongodb://mongodb:27017/task-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const taskSchema = new mongoose.Schema({
  userId: String,
  title: String,
  description: String,
  deadline: Date,
  status: { type: String, enum: ['pending', 'done'], default: 'pending' },
});
const Task = mongoose.model('Task', taskSchema);

// Routes assuming userId is directly passed

app.get('/tasks', async (req, res) => {
  const { userId } = req.query; // from query instead of req.body
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  try {
    const tasks = await Task.find({ userId }).sort({ deadline: 1 });
    res.json(tasks);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching tasks' });
  }
});


app.post('/tasks', async (req, res) => {
  const { userId, title, description, deadline } = req.body;

  // Validate required fields
  if (!userId || !title || !deadline) {
    return res.status(400).json({ message: 'UserId, title, and deadline are required' });
  }

  try {
    const task = new Task({
      userId,
      title,
      description,
      deadline: new Date(deadline),
    });

    await task.save();

    // Respond immediately with the created task ID
    res.status(201).json({ taskId: task._id });

    // Schedule reminder (1 hour before deadline)
    const now = new Date();
    const remindAt = new Date(task.deadline.getTime() - 60 * 60 * 1000); // 1 hour before deadline
    const ms = remindAt.getTime() - now.getTime();

    if (ms > 0) {
      setTimeout(() => {
        axios.post(`${NOTIFICATION_SERVICE_URL}/notifications`, {
          userId,
          message: `Deadline approaching for task: ${title}`,
          type: 'deadline',
          taskId: task._id,
        }).catch(err => console.error('Notification error:', err.message));
      }, ms);
    }

  } catch (err) {
    console.error('Task creation error:', err);
    res.status(500).json({ message: 'Error creating task' });
  }
});


app.put('/tasks/:id/done', async (req, res) => {
  const { userId } = req.body; // Get userId from request body
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, userId },
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

app.delete('/tasks/:id', async (req, res) => {
  const { userId } = req.body; // Get userId from request body
  if (!userId) return res.status(400).json({ message: 'Missing userId' });

  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, userId });
    if (!task) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error deleting task' });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`Task service listening on port ${PORT}`));
