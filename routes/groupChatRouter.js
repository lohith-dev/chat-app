const path = require('path');

const express = require('express');

const grpChatController = require('../controllers/groupChatController.js');

const router = express.Router();

const {authenticate}=require('../middleware/authentication.js');



router.get('/:id',authenticate,grpChatController.getgrpMessages);

router.post('/',authenticate,grpChatController.createGrpMessage);


// /admin/products => GET




module.exports = router;
