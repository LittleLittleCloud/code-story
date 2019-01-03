var express = require('express');
var router = express.Router();
var recordController = require('../controllers/recordController');
router.get('/basicReport',recordController.basic_report);
module.exports=router