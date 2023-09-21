const express = require('express');
const router = express.Router();
//create admin or super admin route
const matchController = require('../controllers/matchController')

router.get('/cricket-list-tournament',matchController.listCricketTournamentVersion2)
router.post('/cricket-list-matches',matchController.listCricketMatchesVersion2)

router.post('/cricket-betting-admin',matchController.cricketBettingAdmin)
router.get('/cricket-betting-admin-list',matchController.cricketBettingAdminList)
router.post('/cricket-betting-admin-edit',matchController.cricketBettingAdminEdit)
router.get('/get_today_cricket_match_admin',matchController.getTodayCricketMatchAdmin)
router.post('/cricket-real-time-data',matchController.cricketRealTimeDataSocket)
router.post('/cricket-list-matches-players',matchController.listCricketTeamPlayersVersion2)
router.get('/cricket-user-betting-history-admin',matchController.cricketUserBettingHistoryAdmin)
// router.post('/football-list-matches',matchController.listFootballMatches)
// router.post('/football-betting-admin',matchController.footballBettingAdmin)
// router.get('/football-betting-admin-list',matchController.footballBettingAdminList)
// router.post('/football-betting-admin-edit',matchController.footballBettingAdminEdit)
// router.post('/football-user-betting-history',matchController.footballUserBettingHistory)
// router.post('/football-match-betting-history',matchController.footballMatchBettingHistory)
// router.post('/football-realtime-data',matchController.footballRealTimeDataSocket)




module.exports = router;