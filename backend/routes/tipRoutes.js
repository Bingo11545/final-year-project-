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

    const [tips, people, users] = await Promise.all([store.listTips(), store.listPeople(), store.listUsers()]);
    const personMap = Object.fromEntries(people.map((p) => [p._id, p]));
    const userMap = Object.fromEntries(users.map((u) => [u._id, u]));

    const enriched = tips
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .map((tip) => ({
        ...tip,
        author: tip.createdBy && userMap[tip.createdBy]
          ? {
              _id: userMap[tip.createdBy]._id,
              username: userMap[tip.createdBy].username,
              role: userMap[tip.createdBy].role,
              profilePhoto: userMap[tip.createdBy].profilePhoto || null
            }
          : null,
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

router.get('/person/:personId', auth(), async (req, res) => {
  try {
    const person = await store.getPersonById(req.params.personId);
    if (!person) return res.status(404).json({ msg: 'Case not found' });

    const isElevated = ['law_enforcement', 'admin'].includes(req.user.role);
    if (!isElevated && String(person.reportedBy) !== String(req.user.id)) {
      return res.status(403).json({ msg: 'Access Denied' });
    }

    const [tips, users] = await Promise.all([store.listTips(), store.listUsers()]);
    const userMap = Object.fromEntries(users.map((u) => [u._id, u]));

    const notes = tips
      .filter((tip) => String(tip.person) === String(req.params.personId))
      .sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0))
      .map((tip) => ({
        ...tip,
        author: tip.createdBy && userMap[tip.createdBy]
          ? {
              _id: userMap[tip.createdBy]._id,
              username: userMap[tip.createdBy].username,
              role: userMap[tip.createdBy].role,
              profilePhoto: userMap[tip.createdBy].profilePhoto || null
            }
          : null
      }));

    return res.json(notes);
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

router.post('/person/:personId', auth(), async (req, res) => {
  try {
    const person = await store.getPersonById(req.params.personId);
    if (!person) return res.status(404).json({ msg: 'Case not found' });

    const isElevated = ['law_enforcement', 'admin'].includes(req.user.role);
    if (!isElevated && String(person.reportedBy) !== String(req.user.id)) {
      return res.status(403).json({ msg: 'Access Denied' });
    }

    const author = await store.getUserById(req.user.id);
    const message = String(req.body.message || '').trim();
    if (!message) return res.status(400).json({ msg: 'Message is required' });

    const noteType = req.body.noteType === 'tip' ? 'tip' : 'comment';
    const note = await store.createTip({
      person: req.params.personId,
      message,
      noteType,
      status: 'internal-note',
      createdBy: req.user.id,
      reporterName: author?.username || req.user.id,
      isAnonymous: false,
      contactInfo: author?.email || '',
      location: req.body.location || ''
    });

    if (String(person.reportedBy) !== String(req.user.id)) {
      await store.createNotification({
        user: person.reportedBy,
        message: `${author?.username || 'An officer'} added a ${noteType} on your report (${person.fullName || req.params.personId}).`,
        relatedPersonId: person._id
      });
    }

    return res.json({ msg: 'Note added successfully', note });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
