const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
// allow your frontend origin (or use `app.use(cors())` to allow all origins)

const app = express();
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb://localhost:27017/notification-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const notificationSchema = new mongoose.Schema({
  userId: mongoose.Schema.Types.ObjectId,
  message: String,
  type: String,
  taskId: mongoose.Schema.Types.ObjectId,
  createdAt: { type: Date, default: Date.now },
  read: { type: Boolean, default: false },
});
const Notification = mongoose.model('Notification', notificationSchema);

app.post('/notifications', async (req, res) => {
  const { userId, message, type, taskId } = req.body;
  if (!userId || !message) return res.status(400).json({ message: 'Missing fields' });
  try {
    const notif = new Notification({ userId, message, type, taskId });
    await notif.save();
    res.json(notif);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating notification' });
  }
});

app.get('/notifications', async (req, res) => {
  const { userId } = req.query;
  if (!userId) return res.status(400).json({ message: 'Missing userId' });
  try {
    const notifs = await Notification.find({ userId }).sort({ createdAt: -1 });
    res.json(notifs);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching notifications' });
  }
});

app.put('/notifications/:id/read', async (req, res) => {
  try {
    const notif = await Notification.findByIdAndUpdate(req.params.id, { read: true }, { new: true });
    if (!notif) return res.status(404).json({ message: 'Notification not found' });
    res.json(notif);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error marking as read' });
  }
});

const PORT = process.env.PORT || 3002;
app.listen(PORT, () => console.log(`Notification service listening on port ${PORT}`));