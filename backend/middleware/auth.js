const jwt = require('jsonwebtoken');
const User = require('../models/user');
const JWT_SECRET = process.env.JWT_SECRET || 'change_this_secret';

async function authMiddleware(req, res, next) {
  try {
    const auth = req.headers.authorization;
    if (!auth || !auth.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
    const token = auth.split(' ')[1];
    const payload = jwt.verify(token, JWT_SECRET);
    const user = await User.findById(payload.id).lean();
    if (!user) return res.status(401).json({ error: 'Invalid token' });
    if (user.role !== 'admin') return res.status(403).json({ error: 'Forbidden' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized', details: err.message });
  }
}

module.exports = authMiddleware;
