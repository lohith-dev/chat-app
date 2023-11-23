const path = require('path');

const express = require('express');

const chatController = require('../controllers/groupController.js');

const router = express.Router();

const {authenticate}=require('../middleware/authentication.js');



router.get('/',authenticate,chatController.getGroups);

router.get('/:id',authenticate,chatController.getEditGroup);

router.post('/',authenticate,chatController.creatGroups);

router.put('/:id',authenticate,chatController.UpdateGroup);



// /admin/products => GET




module.exports = router;
