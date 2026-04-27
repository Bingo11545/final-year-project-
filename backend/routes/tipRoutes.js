const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const Tip = require('../models/Tip');
const MissingPerson = require('../models/MissingPerson');

// POST a new tip (Public or Auth)
router.post('/', async (req, res) => {
    try {
        const { personId, message, contactInfo, location, isAnonymous, reporterName } = req.body;
        
        const tipData = {
            person: personId,
            message,
            contactInfo,
            location,
            isAnonymous,
            reporterName
        };

        // If user is logged in (auth header present?), we can link them
        // For now, let's assume we can pass the user ID if available on client
        // Or we can rely on middleware if we enforce auth for tips
        // Let's check headers manually since `auth` middleware might be optional for tips
        
        if (req.headers.authorization) {
            // Decoding manually or using a middleware that doesn't block is better
            // Ideally use optional auth. 
        }

        const newTip = new Tip(tipData);
        await newTip.save();
        
        res.json({ msg: 'Tip submitted successfully', tip: newTip });

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// GET Tips (Police Only)
router.get('/', auth(), async (req, res) => {
    try {
        if(req.user.role !== 'law_enforcement' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access Denied' });
        }

        // Get all tips, populated with person details
        const tips = await Tip.find()
            .populate('person', 'fullName images status')
            .sort({ createdAt: -1 });
            
        res.json(tips);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

// UPDATE Tip Status (Verify/Reject)
router.put('/:id', auth(), async (req, res) => {
    try {
        if(req.user.role !== 'law_enforcement' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access Denied' });
        }

        const { status } = req.body;
        const tip = await Tip.findById(req.params.id);
        
        if(!tip) return res.status(404).json({ msg: 'Tip not found' });

        tip.status = status;
        await tip.save();

        res.json(tip);

    } catch (err) {
        console.error(err);
        res.status(500).json({ msg: 'Server Error' });
    }
});

module.exports = router;