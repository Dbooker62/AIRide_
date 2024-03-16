const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const router = express.Router();
const { isAuthenticated } = require('./middleware/authMiddleware');

router.get('/auth/register', (req, res) => {
  res.render('register');
});

router.post('/auth/register', async (req, res) => {
  try {
    const { username, password } = req.body;
    // User model will automatically hash the password using bcrypt
    await User.create({ username, password });
    res.redirect('/auth/login');
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).send(error.message);
  }
});

router.get('/auth/login', (req, res) => {
  res.render('login');
});

router.post('/auth/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('User not found');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (isMatch) {
      req.session.userId = user._id;
      return res.redirect('/');
    } else {
      return res.status(400).send('Password is incorrect');
    }
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).send(error.message);
  }
});

router.get('/auth/logout', (req, res) => {
  req.session.destroy(err => {
    if (err) {
      console.error('Error during session destruction:', err);
      console.error(err.stack);
      return res.status(500).send('Error logging out');
    }
    console.log('Session destroyed successfully.');
    res.redirect('/auth/login');
  });
});

router.post('/user/update', isAuthenticated, async (req, res) => {
  const { firstName, lastName, address, state, city } = req.body;
  if (!firstName || !lastName || !address || !state || !city) {
    return res.status(400).send('All fields are required.');
  }

  try {
    await User.findByIdAndUpdate(req.session.userId, {
      $set: { firstName, lastName, address, state, city }
    });
    console.log(`User profile updated successfully for user ID: ${req.session.userId}`);
    res.redirect('/dashboard'); 
  } catch (error) {
    console.error('Profile update error:', error);
    console.error(error.stack);
    res.status(500).send('Failed to update profile.');
  }
});

module.exports = router;