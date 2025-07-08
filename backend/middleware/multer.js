const multer = require('multer');

// Configure multer to use memory storage (files are stored in memory, not disk)
const storage = multer.memoryStorage();

// Initialize multer with configuration
const upload = multer({
  storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // Limit file size to 5MB
    files: 5, // Limit to 5 files
  },
  fileFilter: (req, file, cb) => {
    // Accept only image files
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only image files are allowed'), false);
    }
    cb(null, true);
  },
});

module.exports = upload;