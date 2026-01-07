const express = require('express');
const {healthCheck,createUser}= require('../controllers/user.controller');

const router =express.Router();

router.get('/health',healthCheck);
router.post('/create',createUser);

module.exports = router;