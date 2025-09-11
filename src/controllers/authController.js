const User = require('../models/User');
const jwt = require('jsonwebtoken');

function signToken(user) {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '2h'
  });
}

exports.register = async (req, res) => {
  try {
    const { name, email, password, adminCode } = req.body;
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ error: 'Email already registered' });

    const role = (adminCode && adminCode === process.env.ADMIN_SECRET) ? 'admin' : 'user';
    const user = await User.create({ name, email, password, role });
    const token = signToken(user);
    res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Registration failed' });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ error: 'Invalid credentials' });

    const valid = await user.comparePassword(password);
    if (!valid) return res.status(400).json({ error: 'Invalid credentials' });

    const token = signToken(user);
    res.json({ token, user: { id: user._id, name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    res.status(500).json({ error: 'Login failed' });
  }
};


exports.updateUserRole = async (req, res) => {
  try {
    if (req.user.role !== 'admin') {
      return res.status(403).json({ error: 'Admin access required' });
    }

    const { role } = req.body;
    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ error: 'Invalid role value' });
    }

    const userId = req.params.id;
    const user = await User.findByIdAndUpdate(
      userId,
      { role },
      { new: true, select: '-password' }
    );

    if (!user) return res.status(404).json({ error: 'User not found' });

    res.json({ message: 'Role updated successfully', user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
