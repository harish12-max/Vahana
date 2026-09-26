const express = require('express');

const {
  getCurrentUser,
  login,
  logout,
  register,
} = require('../controllers/auth.controller');
const authenticate = require('../middlewares/authenticate');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);
router.post('/logout', logout);
router.get('/me', authenticate, getCurrentUser);

module.exports = router;
