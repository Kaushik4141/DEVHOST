const express = require('express');
const { Ingest } = require('../models/Ingest');

const router = express.Router();

// Create a new ingest document
router.post('/', async (req, res, next) => {
  try {
    const payload = req.body;
    if (payload == null || typeof payload !== 'object') {
      return res.status(400).json({ error: 'Request body must be JSON' });
    }

    // Optional source metadata
    const source = req.query.source || req.header('x-ingest-source') || undefined;

    // Guard against MongoDB 16MB document limit
    const approxSize = Buffer.byteLength(JSON.stringify(payload), 'utf8');
    const maxDoc = 16 * 1024 * 1024;
    if (approxSize > maxDoc) {
      return res.status(413).json({ error: 'Payload exceeds MongoDB 16MB document limit' });
    }

    const doc = await Ingest.create({ source, payload });
    return res.status(201).json({ id: doc._id, createdAt: doc.createdAt });
  } catch (err) {
    return next(err);
  }
});

// List ingests (most recent first) with optional source filter and pagination
router.get('/', async (req, res, next) => {
  try {
    const limit = Math.min(Math.max(parseInt(req.query.limit || '10', 10), 1), 500);
    const page = Math.max(parseInt(req.query.page || '1', 10), 1);
    const source = (req.query.source || req.query.stack || '').trim();
    const q = {};
    if (source) {
      // Case-insensitive match for source to avoid casing mismatches (e.g., Motia vs motia)
      q.source = { $regex: new RegExp(`^${source.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`, 'i') };
    }

    const [items, total] = await Promise.all([
      Ingest.find(q)
        .sort({ createdAt: -1 })
        .skip((page - 1) * limit)
        .limit(limit)
        .lean(),
      Ingest.countDocuments(q),
    ]);

    res.json({ items, page, limit, total });
  } catch (err) {
    next(err);
  }
});

// Get a single ingest by id
router.get('/:id', async (req, res, next) => {
  try {
    const doc = await Ingest.findById(req.params.id).lean();
    if (!doc) return res.status(404).json({ error: 'Not found' });
    res.json(doc);
  } catch (err) {
    next(err);
  }
});

module.exports = router;
