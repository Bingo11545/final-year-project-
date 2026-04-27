const express = require('express');
const router = express.Router();
const StoredFile = require('../models/StoredFile');

// Public read endpoint for files stored in MongoDB.
router.get('/:id', async (req, res) => {
  try {
    const file = await StoredFile.findById(req.params.id).select('+data');
    if (!file) {
      return res.status(404).json({ msg: 'File not found' });
    }

    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
    res.setHeader('Content-Length', file.size);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(file.data);
  } catch (err) {
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
