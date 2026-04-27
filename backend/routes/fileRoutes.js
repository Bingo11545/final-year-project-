const express = require('express');
const router = express.Router();
const store = require('../services/firebaseStore');

router.get('/:id', async (req, res) => {
  try {
    const file = await store.getFileById(req.params.id);
    if (!file) return res.status(404).json({ msg: 'File not found' });

    const buffer = Buffer.from(file.data || '', 'base64');
    res.setHeader('Content-Type', file.contentType || 'application/octet-stream');
    res.setHeader('Content-Length', buffer.length);
    res.setHeader('Cache-Control', 'public, max-age=31536000, immutable');
    return res.send(buffer);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

module.exports = router;
