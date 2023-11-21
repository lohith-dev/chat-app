const path = require('path');

const express = require('express');

const chatController = require('../controllers//chatController.js');

const router = express.Router();
const {authenticate}=require('../middleware/authentication.js')

router.post('/',authenticate,chatController.createMessage)


// /admin/products => GET




module.exports = router;
