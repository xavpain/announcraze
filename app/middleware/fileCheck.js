const multer = require('multer');

const upload = multer({
    storage: multer.memoryStorage(), // store files in memory
    limits: {
        fileSize: 1024 * 1024 * 5 // limit file size to 5MB
    },
    fileFilter: (req, file, cb) => {
        if (!file.mimetype.startsWith('image/')) {
            cb(new multer.MulterError('LIMIT_UNEXPECTED_FILE', file.fieldname));
        }
        cb(null, true);
    }
});

module.exports = upload;