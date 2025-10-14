const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
  {
    clerkId: { type: String, index: true, unique: true, required: true },
    email: { type: String, index: true },
    username: { type: String, required: true },
    avatarUrl: { type: String },
    domain: { type: String },
  },
  { timestamps: true }
);

userSchema.index({ email: 1 });
userSchema.index({ username: 1 });

const User = mongoose.model('User', userSchema);

module.exports = { User };
