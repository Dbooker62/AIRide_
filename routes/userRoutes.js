const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const { isAuthenticated } = require('./middleware/authMiddleware');
const router = express.Router();

router.get('/user/profile', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.error(`User not found with ID: ${req.session.userId}`);
      return res.status(404).send('User not found');
    }
    res.render('profileSettings', { user, section: 'profile' });
  } catch (error) {
    console.error('Error fetching user profile:', error);
    console.error(error.stack);
    res.status(500).send('Failed to load profile settings.');
  }
});

router.get('/user/security', isAuthenticated, async (req, res) => {
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.error(`User not found with ID: ${req.session.userId}`);
      return res.status(404).send('User not found');
    }
    res.render('profileSettings', { user, section: 'security' });
  } catch (error) {
    console.error('Error fetching user security settings:', error);
    console.error(error.stack);
    res.status(500).send('Failed to load security settings.');
  }
});

router.post('/user/update', isAuthenticated, async (req, res) => {
  const { firstName, lastName, state, city } = req.body;
  try {
    await User.findByIdAndUpdate(req.session.userId, {
      $set: { firstName, lastName, state, city }
    }, { new: true });
    console.log(`User profile updated successfully for user ID: ${req.session.userId}`);
    res.redirect('/user/profile');
  } catch (error) {
    console.error('Profile update error:', error);
    console.error(error.stack);
    res.status(500).send('Failed to update profile.');
  }
});

router.post('/user/change-password', isAuthenticated, async (req, res) => {
  const { oldPassword, newPassword } = req.body;
  try {
    const user = await User.findById(req.session.userId);
    if (!user) {
      console.error(`User not found with ID: ${req.session.userId}`);
      return res.status(404).send('User not found');
    }
    const isMatch = await bcrypt.compare(oldPassword, user.password);
    if (!isMatch) {
      console.log('Old password does not match.');
      return res.redirect('/user/security?error=Old password is incorrect');
    }
    const hashedNewPassword = await bcrypt.hash(newPassword, 10);
    user.password = hashedNewPassword;
    await user.save();
    console.log(`Password updated successfully for user ID: ${req.session.userId}`);
    res.redirect('/user/profile');
  } catch (error) {
    console.error('Error changing password:', error);
    console.error(error.stack);
    res.status(500).send('Failed to change password.');
  }
});

module.exports = router;