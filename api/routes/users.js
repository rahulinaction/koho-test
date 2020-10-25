const express = require('express');
const router = express.Router();
const db = require('./../db');
const userController = require('../controllers/users');

router.get('/', function(req, res, next) {
    res.render('index', { title: ' Welcome Users ' });
});
//Calling controller to fetch data
router.post('/userData', userController.getData);
module.exports = router;
