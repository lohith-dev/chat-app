const path = require('path');

const express = require('express');

const authController = require('../controllers/authController.js');

const router = express.Router();


router.post('/signup',authController.signup)
router.post('/signin',authController.signin)

// /admin/products => GET




module.exports = router;
