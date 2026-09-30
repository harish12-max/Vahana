const multer = require('multer');
const allowed = ['application/pdf', 'image/jpeg', 'image/png'];
module.exports = multer({
    storage: multer.memoryStorage(),
    limits: { fileSize: 5 * 1024 * 1024, files: 1 },
    fileFilter: (req, file, done) => {
        if (!allowed.includes(file.mimetype)) {
            const error = new Error('Invalid document upload.');
            error.code = 'INVALID_FILE_TYPE'; return done(error);

        } return done(null, true);
    }
});
