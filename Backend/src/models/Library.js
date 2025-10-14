const mongoose = require('mongoose');

/**
 * MongoDB schema for Library data from libraries.io API
 */
const librarySchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: { type: String },
    language: { type: String },
    homepage: { type: String },
    repository_url: { type: String },
    stars: { type: Number },
    forks: { type: Number },
    latest_release_number: { type: String },
    latest_release_published_at: { type: String },
    package_manager_url: { type: String },
    rank: { type: Number },
    status: { type: String },
    created_at: { type: String },
    updated_at: { type: String },
    type: { type: String, enum: ['trending', 'recent'], required: true },
    fetched_at: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

// Create indexes for faster queries
librarySchema.index({ type: 1, fetched_at: -1 });
librarySchema.index({ name: 1 });

const Library = mongoose.model('Library', librarySchema);

module.exports = { Library };