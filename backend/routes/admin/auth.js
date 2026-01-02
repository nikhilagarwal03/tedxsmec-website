// backend/routes/admin/auth.js
const express = require('express');
const router = express.Router();
const User = require('../../models/user'); // your User model
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    // find user
    const user = await User.findOne({ email }).lean();
    if (!user) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // If you stored bcrypt hashes:
    const ok = await bcrypt.compare(password, user.password).catch(()=>false);
    // If you stored plain text (not recommended), use:
    // const ok = user.password === password;

    if (!ok) return res.status(401).json({ success: false, message: 'Invalid credentials' });

    // create token
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET || 'devsecret', { expiresIn: '8h' });

    return res.json({ success: true, token, user: { name: user.name, email: user.email, role: user.role } });
  } catch (err) {
    console.error('Admin login error', err);
    return res.status(500).json({ success: false, message: 'Server error' });
  }
});

module.exports = router;
