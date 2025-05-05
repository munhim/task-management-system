const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors');
const bodyParser = require('body-parser');

const app = express();
app.use(cors()); // Enable CORS
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect('mongodb://mongo:27017/taskdb', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// User schema
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
});
const User = mongoose.model('User', userSchema);

// Signup Route
app.post('/users/signup', async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password)
    return res.status(400).json({ success: false, message: 'All fields required' });

  const exists = await User.findOne({ email });
  if (exists)
    return res.status(400).json({ success: false, message: 'User already exists' });

  const hash = await bcrypt.hash(password, 10);
  await User.create({ name, email, password: hash });

  res.status(201).json({
    success: true,
    message: 'Account created successfully! Redirecting to login...',
  });
});

// Login Route
app.post('/login', async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await bcrypt.compare(password, user.password))) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  const token = jwt.sign({ id: user._id }, 'SUPER_SECRET_KEY', { expiresIn: '1h' });
  res.json({ success: true, id:user._id });
});

app.listen(3000, () => console.log('User Service → http://localhost:3000'));
