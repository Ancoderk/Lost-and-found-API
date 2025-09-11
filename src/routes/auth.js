const express = require('express');
const router = express.Router();
const { register, login } = require('../controllers/authController');
const { auth, adminOnly } = require('../middleware/auth');
const { updateUserRole } = require('../controllers/authController');
const { loginLimiter } = require('../middleware/ratelimit');

router.post('/register', register);
router.post('/login', login);
router.post('/login', loginLimiter, login);

router.patch('/user/:id/role', auth, adminOnly, updateUserRole);

module.exports = router;
