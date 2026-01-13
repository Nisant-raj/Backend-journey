const express = require('express');
const {healthCheck,createUser,register,login,profile}= require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware');
const authorize = require('../middlewares/role.middleware');

const router =express.Router();

router.get('/health',healthCheck);
router.post('/create',createUser);
router.post('/register',register);
router.post('/login',login);
router.post('/profile',auth,profile);
router.get('/admin-data', auth, authorize('admin'), (req, res) => {
  res.json({ message: 'Admin content' });
});
module.exports = router;