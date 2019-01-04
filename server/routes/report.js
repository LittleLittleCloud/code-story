var express = require('express');
var router = express.Router();
var recordController = require('../controllers/recordController');
router.get('/basicReport',recordController.basic_report);
router.post('/detailReport',recordController.detail_report_post);
router.get('/detailReport',recordController.detail_report_get);
module.exports=router