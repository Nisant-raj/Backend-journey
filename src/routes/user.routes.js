const express = require('express');
const {healthCheck,createUser,register,login,profile}= require('../controllers/user.controller');
const auth = require('../middlewares/auth.middleware')
const router =express.Router();

router.get('/health',healthCheck);
router.post('/create',createUser);
router.post('/register',register);
router.post('/login',login);
router.post('/profile',auth,profile);

module.exports = router;