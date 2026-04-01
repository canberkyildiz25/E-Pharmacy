const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, path.join(__dirname, '../../uploads')),
  filename: (req, file, cb) => {
    const suffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, suffix + path.extname(file.originalname));
  },
});

const fileFilter = (req, file, cb) => {
  const ok = /jpeg|jpg|png|gif|webp/.test(path.extname(file.originalname).toLowerCase())
          && /jpeg|jpg|png|gif|webp/.test(file.mimetype);
  cb(ok ? null : new Error('Sadece görsel dosyaları yüklenebilir'), ok);
};

module.exports = multer({ storage, limits: { fileSize: 5 * 1024 * 1024 }, fileFilter });
