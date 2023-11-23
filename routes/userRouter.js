const path = require('path');

const express = require('express');

const authController = require('../controllers/authController.js');

const userController = require('../controllers/usersController.js');
const {authenticate}=require('../middleware/authentication.js');

const router = express.Router();


router.post('/signup',authController.signup)
router.post('/signin',authController.signin)


router.get('/users',authenticate,userController.getUsers)

// /admin/products => GET




module.exports = router;
