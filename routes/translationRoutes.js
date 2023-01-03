const express = require('express');
const router = express.Router();
const translateController = require('../controllers/translateController');

router.get('/',  translateController.translate);


module.exports = router;