// requireRole('admin') veya requireRole('admin','franchise') şeklinde kullanılır
const requireRole = (...roles) => (req, res, next) => {
  if (!req.user) return res.status(401).json({ message: 'Giriş yapınız' });
  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ message: 'Bu işlem için yetkiniz yok' });
  }
  next();
};

module.exports = requireRole;
