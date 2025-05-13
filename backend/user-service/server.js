const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const axios = require('axios');
const bodyParser = require('body-parser');
const app = express();
const cors = require('cors');

// allow your frontend origin (or use `app.use(cors())` to allow all origins)
app.use(cors());

app.use(bodyParser.json());

const NOTIFICATION_SERVICE_URL = process.env.NOTIFICATION_SERVICE_URL || 'http://notification-service:3002';

mongoose.connect('mongodb://mongodb:27017/user-service', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  passwordHash: String,
});
const User = mongoose.model('User', userSchema);

app.post('/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ message: 'Missing fields' });
  try {
    const passwordHash = await bcrypt.hash(password, 10);
    const user = new User({ name, email, passwordHash });
    await user.save();
    // notify
    axios.post(`${NOTIFICATION_SERVICE_URL}/notifications`, {
      userId: user._id,
      message: 'Welcome! You signed up.',
      type: 'login',
    }).catch(console.error);
    res.status(200).json({
      message: 'Login successful',
      userId: user._id.toString() // send userId explicitly
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error creating user' });
  }
});

app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ message: 'Missing fields' });
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'Invalid credentials' });
    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(400).json({ message: 'Invalid credentials' });
    res.status(200).json({
      message: 'Login successful',
      userId: user._id.toString() // send userId explicitly
    });
    
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error logging in' });
  }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`User service listening on port ${PORT}`));
