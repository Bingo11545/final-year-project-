const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const User = require('../models/User');
const Notification = require('../models/Notification');
const StoredFile = require('../models/StoredFile');
const sendEmail = require('../utils/sendEmail');
const multer = require('multer');
const path = require('path');
const auth = require('../middleware/auth');

function getRedirectPath(role) {
    if (role === 'admin') return '/system_admin/index.html';
    if (role === 'law_enforcement') return '/police_admin/dashboard.html';
    return '/user/dashboard.html';
}

// Multer Configuration for Documents
const storage = multer.memoryStorage();

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        // Accept images and PDFs
        const filetypes = /jpeg|jpg|png|pdf/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Images and PDFs Only!"));
    }
});

// Register User
router.post('/register', upload.single('verificationDoc'), async (req, res) => {
    const { username, email, password, role, organizationName } = req.body;

    try {
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        user = new User({
            username,
            email,
            password,
            role,
            organizationName
        });

        if (req.file) {
            const storedDoc = await StoredFile.create({
                originalName: req.file.originalname,
                contentType: req.file.mimetype,
                size: req.file.size,
                data: req.file.buffer,
                purpose: 'verification-doc'
            });

            user.verificationDocument = `api/files/${storedDoc._id}`;
        }

        if (role === 'law_enforcement' || role === 'authorized_org') {
               user.isVerified = false; // Requires admin verification
               user.verificationStatus = 'pending';
        } else {
             user.isVerified = true;
               user.verificationStatus = 'approved';
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        await user.save();

        // Send registration email
        try {
            if (role === 'law_enforcement' || role === 'authorized_org') {
                await sendEmail({
                    email: user.email,
                    subject: 'Registration Received - Pending Admin Approval',
                    message: `Hi ${user.username}, your registration has been submitted and is pending system admin ID verification. You will be notified after approval or rejection.`
                });
            } else {
                await sendEmail({
                    email: user.email,
                    subject: 'Welcome to FindThem.AI',
                    message: `Hi ${user.username}, thank you for registering. You can now report missing persons.`
                });
            }
        } catch (emailErr) {
            console.error(emailErr); 
        }

        if (role === 'law_enforcement' || role === 'authorized_org') {
            return res.status(201).json({
                requiresApproval: true,
                msg: 'Registration submitted. A system admin will verify your ID document before account activation.'
            });
        }

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                role: user.role,
                redirectPath: getRedirectPath(user.role)
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error: ' + err.message });
    }
});

// Login User
router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

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

        const payload = {
            user: {
                id: user.id,
                role: user.role
            }
        };

        jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1d' }, (err, token) => {
            if (err) throw err;
            res.json({
                token,
                role: user.role,
                redirectPath: getRedirectPath(user.role)
            });
        });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Admin: Get pending authority registrations
router.get('/pending-registrations', auth(['admin']), async (req, res) => {
    try {
        const pendingUsers = await User.find({
            role: { $in: ['law_enforcement', 'authorized_org'] },
            verificationStatus: 'pending'
        })
            .select('-password -resetPasswordToken -resetPasswordExpire')
            .sort({ createdAt: 1 });

        res.json(pendingUsers);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Admin: Approve authority registration
router.put('/registrations/:id/approve', auth(['admin']), async (req, res) => {
    try {
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!['law_enforcement', 'authorized_org'].includes(user.role)) {
            return res.status(400).json({ msg: 'Only authority registrations require approval' });
        }

        user.isVerified = true;
        user.verificationStatus = 'approved';
        user.verificationRejectionReason = '';
        await user.save();

        await Notification.create({
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

        res.json({ msg: 'Registration approved successfully' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Admin: Reject authority registration
router.put('/registrations/:id/reject', auth(['admin']), async (req, res) => {
    try {
        const { reason } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        if (!['law_enforcement', 'authorized_org'].includes(user.role)) {
            return res.status(400).json({ msg: 'Only authority registrations require approval' });
        }

        user.isVerified = false;
        user.verificationStatus = 'rejected';
        user.verificationRejectionReason = (reason || '').trim();
        await user.save();

        await Notification.create({
            user: user._id,
            message: `Your registration was not approved. Please resubmit your ID document.${user.verificationRejectionReason ? ` Reason: ${user.verificationRejectionReason}` : ''}`
        });

        try {
            await sendEmail({
                email: user.email,
                subject: 'Registration Needs Resubmission',
                message: `Hi ${user.username}, your registration was not approved. Please resubmit your ID document.${user.verificationRejectionReason ? ` Reason: ${user.verificationRejectionReason}` : ''}`
            });
        } catch (emailErr) {
            console.error(emailErr);
        }

        res.json({ msg: 'Registration rejected. User has been notified to resubmit.' });
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server error' });
    }
});

// Forgot Password
router.post('/forgotpassword', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) {
            return res.status(404).json({ msg: 'User not found' });
        }

        // Get reset token
        const resetToken = crypto.randomBytes(20).toString('hex');

        // Hash token and set to field
        user.resetPasswordToken = crypto
            .createHash('sha256')
            .update(resetToken)
            .digest('hex');

        // Set expire (10 mins)
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

        await user.save();

        const resetUrl = `http://localhost:8080/reset_password.html?token=${resetToken}`;
        const message = `You are receiving this email because you (or someone else) has requested the reset of a password. Please make a PUT request to: \n\n ${resetUrl}`;

        try {
            await sendEmail({
                email: user.email,
                subject: 'Password Reset Token',
                message
            });

            res.status(200).json({ success: true, data: 'Email sent' });
        } catch (err) {
            console.error(err);
            user.resetPasswordToken = undefined;
            user.resetPasswordExpire = undefined;
            await user.save();
            return res.status(500).json({ msg: 'Email could not be sent' });
        }
    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// Reset Password
router.post('/resetpassword/:resettoken', async (req, res) => {
    try {
        const resetPasswordToken = crypto
            .createHash('sha256')
            .update(req.params.resettoken)
            .digest('hex');

        const user = await User.findOne({
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) {
            return res.status(400).json({ msg: 'Invalid token' });
        }

        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(req.body.password, salt);
        
        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, data: 'Password updated' });

    } catch (err) {
         console.error(err);
         res.status(500).json({ msg: 'Server Error' });
    }
});

// Get User (Projected)
router.get('/me', auth(), async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select('-password');
        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;
