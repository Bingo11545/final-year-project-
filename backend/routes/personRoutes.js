const express = require('express');
const router = express.Router();
const auth = require('../middleware/auth');
const MissingPerson = require('../models/MissingPerson');
const multer = require('multer');
const path = require('path');
const axios = require('axios');
const fs = require('fs');
const FormData = require('form-data');
const sendEmail = require('../utils/sendEmail');
const User = require('../models/User');
const Notification = require('../models/Notification');

// Multer Configuration
const storage = multer.diskStorage({
    destination: function(req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function(req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 5000000 }, // 5MB limit
    fileFilter: function(req, file, cb) {
        const filetypes = /jpeg|jpg|png/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error("Error: Images Only!"));
    }
});

// Helper: Calculate Cosine Similarity
function cosineSimilarity(vecA, vecB) {
    let dotProduct = 0;
    let normA = 0;
    let normB = 0;
    for (let i = 0; i < vecA.length; i++) {
        dotProduct += vecA[i] * vecB[i];
        normA += vecA[i] * vecA[i];
        normB += vecB[i] * vecB[i];
    }
    return dotProduct / (Math.sqrt(normA) * Math.sqrt(normB));
}

// GET All (Filtered) - Public only sees Approved
// MOVED TO TOP to avoid conflicts with /:id
router.get('/', async (req, res) => {
    try {
        const { status, name, minAge, maxAge, city, sort, date, dashboardMode } = req.query; // dashboardMode check
        let query = {};
        
        // Default to approved only, unless dashboardMode is passed (which implies internal usage, 
        // but we can't secure it here easily without Auth middleware on this route.
        // For security, strict separation is better. 
        // We will default to approved=true here.
        // If a police user wants all, they should use the /manage routes or we add optional auth.
        
        query.isApproved = true; 

        if (status) query.status = status;
        if (name) query.fullName = { $regex: name, $options: 'i' };
        if (city) query.city = { $regex: city, $options: 'i' };
        
        if (minAge || maxAge) {
            query.age = {};
            if (minAge) query.age.$gte = parseInt(minAge);
            if (maxAge) query.age.$lte = parseInt(maxAge);
        }
        
        if (date) {
            query.lastSeenDate = { $gte: new Date(date) };
        }

        let sortOption = { createdAt: -1 }; 
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'alpha_asc') sortOption = { fullName: 1 };
        if (sort === 'alpha_desc') sortOption = { fullName: -1 };
        if (sort === 'date_desc') sortOption = { lastSeenDate: -1 };

        const people = await MissingPerson.find(query)
            .sort(sortOption)
            .populate('reportedBy', 'username role isVerified'); 

        res.json(people);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// --- POLICE / MANAGEMENT ROUTES ---
// MOVED TO TOP to avoid conflicts with /:id
// Get Pending Approvals (Police Only)
router.get('/pending', auth(), async (req, res) => {
    try {
        if(req.user.role !== 'law_enforcement' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access Denied' });
        }
        const pending = await MissingPerson.find({ isApproved: false }).sort({ createdAt: 1 });
        res.json(pending);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get All Cases Including Unapproved/Hidden (Police Only)
router.get('/police/all', auth(), async (req, res) => {
    try {
        if(req.user.role !== 'law_enforcement' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access Denied' });
        }
        const { status } = req.query;
        let q = {};
        if (status) q.status = status;
        
        const people = await MissingPerson.find(q).sort({ createdAt: -1 });
        res.json(people);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// GET Single Person
router.get('/:id', async (req, res) => {
    try {
        const person = await MissingPerson.findById(req.params.id);
        if (!person) {
            return res.status(404).json({ msg: 'Person not found' });
        }
        res.json(person);
    } catch (err) {
        if (err.kind === 'ObjectId') {
            return res.status(404).json({ msg: 'Person not found' });
        }
        res.status(500).send('Server Error');
    }
});

// 1. Report Missing Person / Sighting
router.post('/', [auth(), upload.single('image')], async (req, res) => {
    try {
        const { 
            fullName, age, gender, description, lastSeenDate, lastSeenLocation, city, region, contactPhone, status, isAnonymous,
            policeDistrict, policeCaseNumber, isPoliceReported, vehicleInformation, socialMediaAccounts,
            height, weight, eyeColor, hairColor, race, complexion, distinguishingMarks, classification
        } = req.body;
        
        // DUPLICATE CHECK (Simple Name + Status check first, then AI check later)
        // Note: Simple name check could be added here if desired

        // 1. Create Base Record
        // Check Role for Auto-Approval
        let isApproved = false;
        try {
            const user = await User.findById(req.user.id);
            if (user && (user.role === 'law_enforcement' || user.role === 'admin')) {
                isApproved = true;
            }
        } catch(e) {}

        const newPerson = new MissingPerson({
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
            // Extended Characteristics
            height, weight, eyeColor, hairColor, race, complexion, distinguishingMarks, classification,
            // Original fields
            reportedBy: req.user.id,
            isAnonymous: isAnonymous === 'true' || isAnonymous === true,
            isApproved: isApproved, // Set flag
            // New Fields
            policeDistrict,
            policeCaseNumber,
            isPoliceReported: isPoliceReported === 'true' || isPoliceReported === true,
            vehicleInformation,
            socialMediaAccounts,
            images: [], // Initialize images array
            faceEmbeddings: [] // Initialize embeddings
        });

        // 2. Handle Image & AI Processing
        if (req.file) {
            const imagePath = req.file.path.replace('\\', '/'); 
            newPerson.images.push({ url: imagePath });

            try {
                const formData = new FormData();
                formData.append('image', fs.createReadStream(req.file.path));

                const aiResponse = await axios.post(`${process.env.AI_SERVICE_URL}/generate-embedding`, formData, {
                     headers: { ...formData.getHeaders() }
                });

                if (aiResponse.data.embedding) {
                    newPerson.faceEmbeddings = aiResponse.data.embedding; 
                    
                    // DUPLICATE CHECK VIA AI (Prevent posting same person twice as "Missing")
                    if (status === 'Missing') {
                        const others = await MissingPerson.find({ 
                            status: 'Missing',
                            faceEmbeddings: { $exists: true, $not: { $size: 0 } } 
                        }).select('+faceEmbeddings');
                        
                        for (const other of others) {
                             const sim = cosineSimilarity(newPerson.faceEmbeddings, other.faceEmbeddings);
                             if (sim > 0.90) { // High threshold for "Identity"
                                 // It's likely the same person
                                 // Reject and cleanup
                                 fs.unlink(req.file.path, (err) => { if (err) console.error(err); }); 
                                 return res.status(400).json({ msg: 'This person is already listed as missing. Please update the existing record or report a sighting.' });
                             }
                        }
                    }
                }
            } catch (aiError) {
                console.error("AI Service Error:", aiError.message);
                // Continue without embedding if AI fails
            }
        }

        await newPerson.save();

        // 3. Trigger Auto-Matching & Notifications
        let matches = [];
        if (newPerson.faceEmbeddings && newPerson.faceEmbeddings.length > 0) {
            const query = { 
                _id: { $ne: newPerson._id },
                faceEmbeddings: { $exists: true, $not: { $size: 0 } } 
            };
            
            const others = await MissingPerson.find(query).select('+faceEmbeddings');

            for (const other of others) {
                const similarity = cosineSimilarity(newPerson.faceEmbeddings, other.faceEmbeddings);
                if (similarity > 0.6) { 
                    matches.push({ person: other, similarity: similarity });

                    // NOTIFY REPORTER Logic
                    if (newPerson.status === 'Found' && other.status === 'Missing') {
                         try {
                            const originalReporter = await User.findById(other.reportedBy);
                            if (originalReporter) {
                                // 1. Email
                                sendEmail({
                                    email: originalReporter.email,
                                    subject: 'Potential Match Found!',
                                    message: `Good news! A match has been found for (${other.fullName}). Go to your dashboard for details.`
                                });
                                // 2. In-App Notification
                                await Notification.create({
                                    user: originalReporter._id,
                                    message: `A sighting matched your missing report for ${other.fullName} (Similarity: ${(similarity*100).toFixed(1)}%).`,
                                    relatedPersonId: newPerson._id
                                });
                            }
                        } catch (e) { console.error(e); }
                    }
                }
            }
        }

        res.json({ 
            msg: 'Report submitted', 
            person: newPerson,
            potentialMatches: matches 
        });

    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error ' + err.message);
    }
});

// Update Report (Edit)
router.put('/:id', auth(), async (req, res) => {
    try {
        const { status, description, fullName, age, city } = req.body;
        
        let person = await MissingPerson.findById(req.params.id);
        if (!person) {
            return res.status(404).json({ msg: 'Record not found' });
        }

        // Check ownership or police access
        const isPolice = (req.user.role === 'law_enforcement' || req.user.role === 'admin');
        if (person.reportedBy.toString() !== req.user.id && !isPolice) {
            return res.status(401).json({ msg: 'Not authorized to edit this report' });
        }

        if (status) person.status = status;
        if (description) person.description = description;
        if (fullName) person.fullName = fullName;
        if (age) person.age = age;
        if (city) person.city = city;
        
        // Extended Fields
        if (req.body.classification) person.classification = req.body.classification;
        if (req.body.policeDistrict) person.policeDistrict = req.body.policeDistrict;
        if (req.body.policeCaseNumber) person.policeCaseNumber = req.body.policeCaseNumber;
        if (req.body.weight) person.weight = req.body.weight;
        if (req.body.height) person.height = req.body.height;
        if (req.body.hairColor) person.hairColor = req.body.hairColor;
        if (req.body.eyeColor) person.eyeColor = req.body.eyeColor;
        if (req.body.distinguishingMarks) person.distinguishingMarks = req.body.distinguishingMarks;

        await person.save();
        res.json(person);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// Get User Notifications
router.get('/notifications', auth(), async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id }).sort({ createdAt: -1 });
        res.json(notifications);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get All (Filtered) - Public only sees Approved
router.get('/', async (req, res) => {
    try {
        const { status, name, minAge, maxAge, city, sort, date, dashboardMode } = req.query; // dashboardMode check
        let query = {};
        
        // Default to approved only, unless dashboardMode is passed (which implies internal usage, 
        // but we can't secure it here easily without Auth middleware on this route.
        // For security, strict separation is better. 
        // We will default to approved=true here.
        // If a police user wants all, they should use the /manage routes or we add optional auth.
        
        query.isApproved = true; 

        if (status) query.status = status;
        if (name) query.fullName = { $regex: name, $options: 'i' };
        if (city) query.city = { $regex: city, $options: 'i' };
        
        if (minAge || maxAge) {
            query.age = {};
            if (minAge) query.age.$gte = parseInt(minAge);
            if (maxAge) query.age.$lte = parseInt(maxAge);
        }
        
        if (date) {
            query.lastSeenDate = { $gte: new Date(date) };
        }

        let sortOption = { createdAt: -1 }; 
        if (sort === 'oldest') sortOption = { createdAt: 1 };
        if (sort === 'alpha_asc') sortOption = { fullName: 1 };
        if (sort === 'alpha_desc') sortOption = { fullName: -1 };
        if (sort === 'date_desc') sortOption = { lastSeenDate: -1 };

        const people = await MissingPerson.find(query)
            .sort(sortOption)
            .populate('reportedBy', 'username role isVerified'); 

        res.json(people);
    } catch (err) {
        console.error(err);
        res.status(500).send('Server Error');
    }
});

// --- POLICE / MANAGEMENT ROUTES ---

// Get Pending Approvals (Police Only)
router.get('/pending', auth(), async (req, res) => {
    try {
        if(req.user.role !== 'law_enforcement' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access Denied' });
        }
        const pending = await MissingPerson.find({ isApproved: false }).sort({ createdAt: 1 });
        res.json(pending);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Get All Cases Including Unapproved/Hidden (Police Only)
router.get('/police/all', auth(), async (req, res) => {
    try {
        if(req.user.role !== 'law_enforcement' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access Denied' });
        }
        const { status } = req.query;
        let q = {};
        if (status) q.status = status;
        
        const people = await MissingPerson.find(q).sort({ createdAt: -1 });
        res.json(people);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Approve Case
router.put('/:id/approve', auth(), async (req, res) => {
     try {
        if(req.user.role !== 'law_enforcement' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access Denied' });
        }
        const person = await MissingPerson.findById(req.params.id);
        if(!person) return res.status(404).json({ msg: 'Not found' });
        
        person.isApproved = true;
        await person.save();
        
        // Notify user?
        
        res.json(person);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

// Update Status (Found/Missing etc) - Specific for Police Control
router.put('/:id/status', auth(), async (req, res) => {
     try {
        if(req.user.role !== 'law_enforcement' && req.user.role !== 'admin') {
            return res.status(403).json({ msg: 'Access Denied' });
        }
        const person = await MissingPerson.findById(req.params.id);
        if(!person) return res.status(404).json({ msg: 'Not found' });
        
        person.status = req.body.status;
        await person.save();
        res.json(person);
    } catch (err) {
        res.status(500).send('Server Error');
    }
});

module.exports = router;
