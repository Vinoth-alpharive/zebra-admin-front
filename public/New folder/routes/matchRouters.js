const express = require('express');
const matchController = require('../controllers/matchController');
const router = express.Router();

router.get('/matches',matchController.cricketMatchLists)

module.exports = router;