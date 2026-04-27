const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');
const sendEmail = require('../utils/sendEmail');
const store = require('../services/firebaseStore');

function getRedirectPath(role) {
  if (role === 'admin') return '/system_admin/index.html';
  if (role === 'law_enforcement') return '/police_admin/dashboard.html';
  return '/user/dashboard.html';
}

function signToken(user) {
  return jwt.sign(
    { user: { id: user._id, role: user.role } },
    process.env.JWT_SECRET,
    { expiresIn: '1d' }
  );
}

function stripSensitiveUser(user) {
  if (!user) return user;
  const clone = { ...user };
  delete clone.password;
  delete clone.resetPasswordToken;
  delete clone.resetPasswordExpire;
  return clone;
}

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5000000 },
  fileFilter: function fileFilter(req, file, cb) {
    const filetypes = /jpeg|jpg|png|pdf/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    if (mimetype && extname) return cb(null, true);
    cb(new Error('Error: Images and PDFs Only!'));
  }
});

router.post('/register', upload.single('verificationDoc'), async (req, res) => {
  const { username, email, password, role, organizationName } = req.body;

  try {
    const existing = await store.findUserByEmail(email);
    if (existing) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    let verificationDocument = '';
    if (req.file) {
      const savedFile = await store.createFile({
        originalName: req.file.originalname,
        contentType: req.file.mimetype,
        size: req.file.size,
        dataBuffer: req.file.buffer,
        purpose: 'verification-doc'
      });
      verificationDocument = `api/files/${savedFile._id}`;
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const needsApproval = role === 'law_enforcement' || role === 'authorized_org';

    const user = await store.createUser({
      username,
      email,
      password: passwordHash,
      role,
      organizationName: organizationName || '',
      verificationDocument,
      isVerified: !needsApproval,
      verificationStatus: needsApproval ? 'pending' : 'approved',
      verificationRejectionReason: ''
    });

    try {
      await sendEmail({
        email: user.email,
        subject: needsApproval ? 'Registration Received - Pending Admin Approval' : 'Welcome to FindThem.AI',
        message: needsApproval
          ? `Hi ${user.username}, your registration has been submitted and is pending system admin ID verification. You will be notified after approval or rejection.`
          : `Hi ${user.username}, thank you for registering. You can now report missing persons.`
      });
    } catch (emailErr) {
      console.error(emailErr);
    }

    if (needsApproval) {
      return res.status(201).json({
        requiresApproval: true,
        msg: 'Registration submitted. A system admin will verify your ID document before account activation.'
      });
    }

    return res.json({
      token: signToken(user),
      role: user.role,
      redirectPath: getRedirectPath(user.role)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error: ' + err.message });
  }
});

router.post('/login', async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await store.findUserByEmail(email);
    if (!user) return res.status(400).json({ msg: 'Invalid Credentials' });

    const ok = await bcrypt.compare(password, user.password || '');
    if (!ok) return res.status(400).json({ msg: 'Invalid Credentials' });

    const verificationStatus = user.verificationStatus || (user.isVerified ? 'approved' : 'pending');
    if ((user.role === 'law_enforcement' || user.role === 'authorized_org') && verificationStatus !== 'approved') {
      if (verificationStatus === 'rejected') {
        return res.status(403).json({
          msg: `Registration rejected. Please resubmit your verification document.${user.verificationRejectionReason ? ` Reason: ${user.verificationRejectionReason}` : ''}`,
          verificationStatus: 'rejected'
        });
      }
      return res.status(403).json({
        msg: 'Registration pending system admin approval. You will be notified once review is complete.',
        verificationStatus: 'pending'
      });
    }

    return res.json({
      token: signToken(user),
      role: user.role,
      redirectPath: getRedirectPath(user.role)
    });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.get('/pending-registrations', auth(['admin']), async (req, res) => {
  try {
    const pendingUsers = await store.listUsers((u) =>
      ['law_enforcement', 'authorized_org'].includes(u.role) && u.verificationStatus === 'pending'
    );

    pendingUsers.sort((a, b) => new Date(a.createdAt || 0) - new Date(b.createdAt || 0));
    return res.json(pendingUsers.map(stripSensitiveUser));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/registrations/:id/approve', auth(['admin']), async (req, res) => {
  try {
    const user = await store.getUserById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (!['law_enforcement', 'authorized_org'].includes(user.role)) {
      return res.status(400).json({ msg: 'Only authority registrations require approval' });
    }

    await store.updateUser(user._id, {
      isVerified: true,
      verificationStatus: 'approved',
      verificationRejectionReason: ''
    });

    await store.createNotification({
      user: user._id,
      message: 'Your registration has been approved. You can now log in and use your account.'
    });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Registration Approved',
        message: `Hi ${user.username}, your registration was approved by system admin. You can now sign in.`
      });
    } catch (emailErr) {
      console.error(emailErr);
    }

    return res.json({ msg: 'Registration approved successfully' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.put('/registrations/:id/reject', auth(['admin']), async (req, res) => {
  try {
    const reason = (req.body.reason || '').trim();
    const user = await store.getUserById(req.params.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    if (!['law_enforcement', 'authorized_org'].includes(user.role)) {
      return res.status(400).json({ msg: 'Only authority registrations require approval' });
    }

    await store.updateUser(user._id, {
      isVerified: false,
      verificationStatus: 'rejected',
      verificationRejectionReason: reason
    });

    await store.createNotification({
      user: user._id,
      message: `Your registration was not approved. Please resubmit your ID document.${reason ? ` Reason: ${reason}` : ''}`
    });

    try {
      await sendEmail({
        email: user.email,
        subject: 'Registration Needs Resubmission',
        message: `Hi ${user.username}, your registration was not approved. Please resubmit your ID document.${reason ? ` Reason: ${reason}` : ''}`
      });
    } catch (emailErr) {
      console.error(emailErr);
    }

    return res.json({ msg: 'Registration rejected. User has been notified to resubmit.' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server error' });
  }
});

router.post('/forgotpassword', async (req, res) => {
  try {
    const user = await store.findUserByEmail(req.body.email);
    if (!user) return res.status(404).json({ msg: 'User not found' });

    const resetToken = crypto.randomBytes(20).toString('hex');
    const resetPasswordToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetPasswordExpire = Date.now() + 10 * 60 * 1000;

    await store.updateUser(user._id, { resetPasswordToken, resetPasswordExpire });

    const frontendBase = process.env.FRONTEND_URL || 'https://missingpersonfinder.netlify.app';
    const resetUrl = `${frontendBase}/reset_password.html?token=${resetToken}`;

    try {
      await sendEmail({
        email: user.email,
        subject: 'Password Reset Token',
        message: `You requested a password reset. Use this link: ${resetUrl}`
      });
      return res.status(200).json({ success: true, data: 'Email sent' });
    } catch (err) {
      await store.updateUser(user._id, { resetPasswordToken: null, resetPasswordExpire: null });
      return res.status(500).json({ msg: 'Email could not be sent' });
    }
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

router.post('/resetpassword/:resettoken', async (req, res) => {
  try {
    const resetPasswordToken = crypto.createHash('sha256').update(req.params.resettoken).digest('hex');
    const users = await store.listUsers((u) =>
      u.resetPasswordToken === resetPasswordToken && Number(u.resetPasswordExpire || 0) > Date.now()
    );

    const user = users[0];
    if (!user) return res.status(400).json({ msg: 'Invalid token' });

    const passwordHash = await bcrypt.hash(req.body.password, 10);
    await store.updateUser(user._id, {
      password: passwordHash,
      resetPasswordToken: null,
      resetPasswordExpire: null
    });

    return res.status(200).json({ success: true, data: 'Password updated' });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

router.get('/me', auth(), async (req, res) => {
  try {
    const user = await store.getUserById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    return res.json(stripSensitiveUser(user));
  } catch (err) {
    console.error(err);
    return res.status(500).json({ msg: 'Server Error' });
  }
});

module.exports = router;
