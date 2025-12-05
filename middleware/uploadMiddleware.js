// middleware/uploadMiddleware.js

const multer = require('multer');
const path = require('path');
const fs = require('fs'); // CRITICAL: Import for directory creation

// Define storage location and filename
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Creates directory if it doesn't exist (robust solution)
        const dir = 'uploads/documents';
        if (!fs.existsSync(dir)){
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        // Use a safe, unique identifier (timestamp)
        const fileExtension = path.extname(file.originalname);
        cb(null, 'project-' + Date.now() + fileExtension);
    }
});

// Define file filter (only allow PDFs)
const fileFilter = (req, file, cb) => {
    if (file.mimetype === 'application/pdf') {
        cb(null, true);
    } else {
        cb(new Error('Only PDF documents are allowed!'), false);
    }
};

// Initialize Multer upload instance and EXPORT THE WRAPPER FUNCTION
// This is the cleanest way to ensure it only runs when needed.
const uploadDocument = multer({ 
    storage: storage,
    fileFilter: fileFilter,
    limits: { fileSize: 1024 * 1024 * 10 }
}).any();

module.exports = { uploadDocument };