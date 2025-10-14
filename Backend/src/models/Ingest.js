const mongoose = require('mongoose');

const ingestSchema = new mongoose.Schema(
  {
    source: { type: String },
    payload: { type: mongoose.Schema.Types.Mixed, required: true },
  },
  { timestamps: true }
);

ingestSchema.index({ createdAt: -1 });

const Ingest = mongoose.model('Ingest', ingestSchema);

module.exports = { Ingest };
