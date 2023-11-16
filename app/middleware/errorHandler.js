const multer = require('multer');

module.exports = errorHandler;

function errorHandler(err, req, res, next) {
    console.log(err);
    switch (true) {
        case typeof err === 'string':
            // custom application error
            const is404 = err.toLowerCase().endsWith('not found');
            const statusCode = is404 ? 404 : 400;
            return res.status(statusCode).json({ message: err });
        case err.name === 'ValidationError':  // JOI validation error
            return res.status(400).json({ message: err.message });
        case err.name === 'UnauthorizedError': // JWT Auth error
            return res.status(401).json({ message: 'Unauthorized' });
        case err.name === 'MulterError': // multer filecheck error
            return res.status(400).json({ message: "Error: File is too large (limit: 5MB) or wrong format." });
        default:
            return res.status(500).json({ message: err.message });
    }
}