const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const FormData = require('form-data');
const sendEmail = require('../utils/sendEmail');
const store = require('../services/firebaseStore');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000000 },
  fileFilter: function fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Error: Images Only!'));
  }
});

function cosineSimilarity(vecA, vecB) {
  let dotProduct = 0;
  let normA = 0;
  let normB = 0;
  for (let i = 0; i < Math.min(vecA.length, vecB.length); i++) {
    dotProduct += vecA[i] * vecB[i];
    normA += vecA[i] * vecA[i];
    normB += vecB[i] * vecB[i];
  }
  return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB) || 1);
}

function normalizePerson(person, userMap = {}) {
  const mapped = { ...person };
  const reporter = userMap[person.reportedBy];
  if (reporter) {
    mapped.reportedBy = {
      _id: reporter._id,
      username: reporter.username,
      role: reporter.role,
      isVerified: reporter.isVerified
    };
  }
  return mapped;
}

function applyFilters(people, query) {
  let result = [...people];
  if (query.status) result = result.filter((p) => p.status === query.status);
  if (query.name) result = result.filter((p) => (p.fullName || '').toLowerCase().includes(String(query.name).toLowerCase()));
  if (query.city) result = result.filter((p) => (p.city || '').toLowerCase().includes(String(query.city).toLowerCase()));

  if (query.minAge || query.maxAge) {
    const minAge = query.minAge ? Number(query.minAge) : -Infinity;
    const maxAge = query.maxAge ? Number(query.maxAge) : Infinity;
    result = result.filter((p) => Number(p.age || 0) >= minAge && Number(p.age || 0) <= maxAge);
  }

  if (query.date) {
    const date = new Date(query.date).getTime();
    result = result.filter((p) => new Date(p.lastSeenDate || 0).getTime() >= date);
  }

  const sortKey = query.sort;
  if (sortKey === 'oldest') result.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
  else if (sortKey === 'alpha_asc') result.sort((a, b) => (a.fullName || '').localeCompare(b.fullName || ''));
  else if (sortKey === 'alpha_desc') result.sort((a, b) => (b.fullName || '').localeCompare(a.fullName || ''));
  else if (sortKey === 'date_desc') result.sort((a, b) => new Date(b.lastSeenDate || 0) - new Date(a.lastSeenDate || 0));
  else result.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return result;
}

router.get('/notifications', auth(), async (req, res) => {
  try {
    const notifications = await store.listNotificationsByUser(req.user.id);
    return res.json(notifications);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

router.get('/pending', auth(), async (req, res) => {
  try {
    if (!['law_enforcement', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access Denied' });
    }
    const people = await store.listPeople((p) => !p.isApproved);
    people.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    return res.json(people);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

router.get('/police/all', auth(), async (req, res) => {
  try {
    if (!['law_enforcement', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access Denied' });
    }

    const people = await store.listPeople((p) => !req.query.status || p.status === req.query.status);
    people.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
    return res.json(people);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

router.get('/', async (req, res) => {
  try {
    const users = await store.listUsers();
    const userMap = Object.fromEntries(users.map((u) => [u._id, u]));

    let people = await store.listPeople((p) => p.isApproved === true);
    people = applyFilters(people, req.query).map((p) => normalizePerson(p, userMap));
    return res.json(people);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

router.get('/:id', async (req, res) => {
  try {
    const person = await store.getPersonById(req.params.id);
    if (!person) return res.status(404).json({ msg: 'Person not found' });
    return res.json(person);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

router.post('/', [auth(), upload.single('image')], async (req, res) => {
  try {
    const {
      fullName,
      age,
      gender,
      description,
      lastSeenDate,
      lastSeenLocation,
      city,
      region,
      contactPhone,
      status,
      isAnonymous,
      policeDistrict,
      policeCaseNumber,
      isPoliceReported,
      vehicleInformation,
      socialMediaAccounts,
      height,
      weight,
      eyeColor,
      hairColor,
      race,
      complexion,
      distinguishingMarks,
      classification
    } = req.body;

    const reporter = await store.getUserById(req.user.id);
    const isApproved = !!(reporter && ['law_enforcement', 'admin'].includes(reporter.role));

    const payload = {
      fullName,
      age,
      gender,
      description,
      lastSeenDate,
      lastSeenLocation,
      city,
      region,
      contactPhone,
      status,
      height,
      weight,
      eyeColor,
      hairColor,
      race,
      complexion,
      distinguishingMarks,
      classification,
      reportedBy: req.user.id,
      isAnonymous: isAnonymous === 'true' || isAnonymous === true,
      isApproved,
      policeDistrict,
      policeCaseNumber,
      isPoliceReported: isPoliceReported === 'true' || isPoliceReported === true,
      vehicleInformation,
      socialMediaAccounts,
      images: [],
      faceEmbeddings: []
    };

    if (req.file) {
      try {
        const formData = new FormData();
        formData.append('image', req.file.buffer, {
          filename: req.file.originalname || `image${path.extname(req.file.originalname || '.jpg')}`,
          contentType: req.file.mimetype
        });

        const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/generate-embedding`, formData, {
          headers: { ...formData.getHeaders() }
        });

        if (Array.isArray(aiResponse.data.embedding)) {
          payload.faceEmbeddings = aiResponse.data.embedding;

          if (status === 'Missing') {
            const existingMissing = await store.listPeople(
              (p) => p.status === 'Missing' && Array.isArray(p.faceEmbeddings) && p.faceEmbeddings.length
            );
            for (const other of existingMissing) {
              const sim = cosineSimilarity(payload.faceEmbeddings, other.faceEmbeddings);
              if (sim > 0.9) {
                return res.status(400).json({
                  msg: 'This person is already listed as missing. Please update the existing record or report a sighting.'
                });
              }
            }
          }
        }
      } catch (aiError) {
        console.error('AI Service Error:', aiError.message);
      }

      const image = await store.createFile({
        originalName: req.file.originalname,
        contentType: req.file.mimetype,
        size: req.file.size,
        dataBuffer: req.file.buffer,
        uploadedBy: req.user.id,
        purpose: 'person-image'
      });

      payload.images.push({ url: `api/files/${image._id}` });
    }

    const newPerson = await store.createPerson(payload);

    const matches = [];
    if (Array.isArray(newPerson.faceEmbeddings) && newPerson.faceEmbeddings.length) {
      const others = await store.listPeople(
        (p) => p._id !== newPerson._id && Array.isArray(p.faceEmbeddings) && p.faceEmbeddings.length
      );

      for (const other of others) {
        const similarity = cosineSimilarity(newPerson.faceEmbeddings, other.faceEmbeddings);
        if (similarity > 0.6) {
          matches.push({ person: other, similarity });

          if (newPerson.status === 'Found' && other.status === 'Missing') {
            const originalReporter = await store.getUserById(other.reportedBy);
            if (originalReporter) {
              try {
                await sendEmail({
                  email: originalReporter.email,
                  subject: 'Potential Match Found!',
                  message: `Good news! A match has been found for (${other.fullName}). Go to your dashboard for details.`
                });
              } catch (e) {
                console.error(e);
              }

              await store.createNotification({
                user: originalReporter._id,
                message: `A sighting matched your missing report for ${other.fullName} (Similarity: ${(similarity * 100).toFixed(1)}%).`,
                relatedPersonId: newPerson._id
              });
            }
          }
        }
      }
    }

    return res.json({ msg: 'Report submitted', person: newPerson, potentialMatches: matches });
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error ' + err.message);
  }
});

router.put('/:id', auth(), async (req, res) => {
  try {
    const person = await store.getPersonById(req.params.id);
    if (!person) return res.status(404).json({ msg: 'Record not found' });

    const isPolice = ['law_enforcement', 'admin'].includes(req.user.role);
    if (String(person.reportedBy) !== String(req.user.id) && !isPolice) {
      return res.status(401).json({ msg: 'Not authorized to edit this report' });
    }

    const patch = {};
    const allowed = [
      'status',
      'description',
      'fullName',
      'age',
      'city',
      'classification',
      'policeDistrict',
      'policeCaseNumber',
      'weight',
      'height',
      'hairColor',
      'eyeColor',
      'distinguishingMarks'
    ];

    for (const key of allowed) {
      if (req.body[key] !== undefined) patch[key] = req.body[key];
    }

    const updated = await store.updatePerson(req.params.id, patch);
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

router.put('/:id/approve', auth(), async (req, res) => {
  try {
    if (!['law_enforcement', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access Denied' });
    }
    const person = await store.getPersonById(req.params.id);
    if (!person) return res.status(404).json({ msg: 'Not found' });
    const updated = await store.updatePerson(req.params.id, { isApproved: true });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

router.put('/:id/status', auth(), async (req, res) => {
  try {
    if (!['law_enforcement', 'admin'].includes(req.user.role)) {
      return res.status(403).json({ msg: 'Access Denied' });
    }
    const person = await store.getPersonById(req.params.id);
    if (!person) return res.status(404).json({ msg: 'Not found' });
    const updated = await store.updatePerson(req.params.id, { status: req.body.status });
    return res.json(updated);
  } catch (err) {
    console.error(err);
    return res.status(500).send('Server Error');
  }
});

module.exports = router;
