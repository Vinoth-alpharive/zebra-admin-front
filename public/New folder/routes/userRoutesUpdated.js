const express = require('express');

const router = express.Router();

const matchController = require('../controllers/matchController')


router.get('/cricket-list-tournament',matchController.listCricketTournamentVersion2)
router.post('/cricket-list-matches',matchController.listCricketMatchesVersion2)
router.post('/cricket-list-matches-players',matchController.listCricketTeamPlayersVersion2)
router.get('/get_today_cricket_match',matchController.getTodayCricketMatch)
router.post('/cricket-real-time-data',matchController.cricketRealTimeDataSocket)

module.exports = router;