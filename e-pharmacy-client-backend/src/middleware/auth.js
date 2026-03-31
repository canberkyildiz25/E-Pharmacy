const jwt = require('jsonwebtoken');
const ClientUser = require('../models/ClientUser');

const auth = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(401).json({ message: 'No token provided. Authorization denied.' });
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = await ClientUser.findById(decoded.id).select('-password');
    if (!req.user) return res.status(401).json({ message: 'User not found' });
    next();
  } catch {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

module.exports = auth;
