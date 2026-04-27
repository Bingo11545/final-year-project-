const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const store = require('../services/firebaseStore');

router.post('/', async (req, res) => {
  try {
    const { personId, message, contactInfo, location, isAnonymous, reporterName } = req.body;

    const tip = await store.createTip({
      person: personId,
      message,
      contactInfo,
      location,
      isAnonymous: !!isAnonymous,
      reporterName: reporterName || '',
      status: 'pending'
    });

    return res.json({ msg: 'Tip submitted successfully', tip });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

router.get('/', auth(), async (req, res) => {
  try {
    if (!['law_enforcement', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access Denied' });
    }

    const [tips, people] = await Promise.all([store.listTips(), store.listPeople()]);
    const personMap = Object.fromEntries(people.map((p) => [p._id, p]));

    const enriched = tips
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .map((tip) => ({
        ...tip,
        person: personMap[tip.person]
          ? {
              _id: personMap[tip.person]._id,
              fullName: personMap[tip.person].fullName,
              images: personMap[tip.person].images || [],
              status: personMap[tip.person].status
            }
          : null
      }));

    return res.json(enriched);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

router.put('/:id', auth(), async (req, res) => {
  try {
    if (!['law_enforcement', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access Denied' });
    }

    const tip = await store.getTipById(req.params.id);
    if (!tip) return res.status(404).json({ msg: 'Tip not found' });

    const updated = await store.updateTip(req.params.id, { status: req.body.status });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
