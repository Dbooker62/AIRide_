const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const userSchema = new mongoose.Schema({
  username: { type: String, unique: true, required: true },
  password: { type: String, required: true },
  firstName: { type: String, required: false }, 
  lastName: { type: String, required: false }, 
  address: { type: String, required: false }, 
  state: { type: String, required: false }, 
  city: { type: String, required: false }, 
});

userSchema.pre('save', function(next) {
  const user = this;
  if (!user.isModified('password')) return next();
  bcrypt.hash(user.password, 10, (err, hash) => {
    if (err) {
      console.error('Error hashing password:', err);
      return next(err);
    }
    user.password = hash;
    next();
  });
});

const User = mongoose.model('User', userSchema);

module.exports = User;