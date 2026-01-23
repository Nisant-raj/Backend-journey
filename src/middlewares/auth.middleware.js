const jwt = require('jsonwebtoken');
const userModel = require('../models/user.model')

const auth = async(req, res, next) => {
  const token = req.headers.authorization?.split(' ')[1];
  if (!token) return res.status(401).json({ message: 'Unauthorized' });

  try {
    const decoded = jwt.verify(token, 'ABC123');

     // 🔑 Fetch full user document
  const user = await userModel.findById(decoded.id);

  if (!user) return res.status(401).json({ message: 'Invalid user' })
    req.user = user;
    next();
  } catch {
    res.status(401).json({ message: 'Invalid token' });
  }
};

module.exports = auth;
