const mongoose = require('mongoose');

const hashtagSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      match: /^[a-zA-Z0-9_]+$/
    }
  },
  { timestamps: true }
);

// Index for better query performance
hashtagSchema.index({ name: 1 });

const Hashtag = mongoose.model('Hashtag', hashtagSchema);

module.exports = { Hashtag };
