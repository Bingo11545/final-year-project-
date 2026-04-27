const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config({ path: path.join(__dirname, '..', '.env') });

const User = require('../models/User');
const MissingPerson = require('../models/MissingPerson');
const StoredFile = require('../models/StoredFile');

const UPLOADS_DIR = path.join(__dirname, '..', 'uploads');
const fileIdCache = new Map();

function isLegacyUploadPath(value) {
  if (!value || typeof value !== 'string') return false;
  const v = value.replace(/\\/g, '/').trim();
  if (v.includes('api/files/')) return false;
  return v.includes('uploads/');
}

function normalizeLegacyPath(value) {
  const v = value.replace(/\\/g, '/').trim();
  const idx = v.indexOf('uploads/');
  if (idx === -1) return null;
  return v.slice(idx + 'uploads/'.length);
}

function contentTypeFromExt(filename) {
  const ext = path.extname(filename).toLowerCase();
  if (ext === '.jpg' || ext === '.jpeg') return 'image/jpeg';
  if (ext === '.png') return 'image/png';
  if (ext === '.pdf') return 'application/pdf';
  if (ext === '.webp') return 'image/webp';
  return 'application/octet-stream';
}

async function storeLegacyFile({ legacyUrl, uploadedBy, purpose }) {
  const normalized = normalizeLegacyPath(legacyUrl);
  if (!normalized) return null;

  if (fileIdCache.has(normalized)) {
    return fileIdCache.get(normalized);
  }

  const absolutePath = path.join(UPLOADS_DIR, normalized);
  if (!fs.existsSync(absolutePath)) {
    console.warn(`[skip] File not found on disk: ${absolutePath}`);
    return null;
  }

  const data = fs.readFileSync(absolutePath);
  const stored = await StoredFile.create({
    originalName: path.basename(normalized),
    contentType: contentTypeFromExt(normalized),
    size: data.length,
    data,
    uploadedBy: uploadedBy || undefined,
    purpose
  });

  const newUrl = `api/files/${stored._id}`;
  fileIdCache.set(normalized, newUrl);
  return newUrl;
}

async function migrateUsers() {
  const users = await User.find({ verificationDocument: { $exists: true, $ne: null } });
  let updated = 0;

  for (const user of users) {
    const docPath = user.verificationDocument;
    if (!isLegacyUploadPath(docPath)) continue;

    const newUrl = await storeLegacyFile({
      legacyUrl: docPath,
      uploadedBy: user._id,
      purpose: 'verification-doc'
    });

    if (!newUrl) continue;

    user.verificationDocument = newUrl;
    await user.save();
    updated += 1;
    console.log(`[user] migrated ${user.email} -> ${newUrl}`);
  }

  return updated;
}

async function migrateMissingPeople() {
  const people = await MissingPerson.find({ 'images.0': { $exists: true } });
  let updatedPeople = 0;
  let updatedImages = 0;

  for (const person of people) {
    let changed = false;

    for (const image of person.images) {
      if (!isLegacyUploadPath(image.url)) continue;

      const newUrl = await storeLegacyFile({
        legacyUrl: image.url,
        uploadedBy: person.reportedBy,
        purpose: 'person-image'
      });

      if (!newUrl) continue;

      image.url = newUrl;
      changed = true;
      updatedImages += 1;
    }

    if (changed) {
      await person.save();
      updatedPeople += 1;
      console.log(`[person] migrated ${person._id} (${person.fullName})`);
    }
  }

  return { updatedPeople, updatedImages };
}

async function run() {
  const mongoUri = process.env.MONGO_URI;
  if (!mongoUri) {
    throw new Error('MONGO_URI is missing. Set it in backend/.env before running migration.');
  }

  await mongoose.connect(mongoUri, {
    useNewUrlParser: true,
    useUnifiedTopology: true
  });

  console.log('Connected to MongoDB. Starting legacy uploads migration...');

  const migratedUsers = await migrateUsers();
  const { updatedPeople, updatedImages } = await migrateMissingPeople();

  console.log('\nMigration complete.');
  console.log(`Users updated: ${migratedUsers}`);
  console.log(`MissingPerson records updated: ${updatedPeople}`);
  console.log(`Image references updated: ${updatedImages}`);
  console.log(`New StoredFile documents created in this run: ${fileIdCache.size}`);

  await mongoose.disconnect();
}

run().catch(async (err) => {
  console.error('Migration failed:', err.message);
  try {
    await mongoose.disconnect();
  } catch (e) {}
  process.exit(1);
});
