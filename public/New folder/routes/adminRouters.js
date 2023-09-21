const express = require('express');
const Routes = require('twilio/lib/rest/Routes');
const adminController = require('../controllers/adminController');
const assetController = require('../controllers/assetController');
const tournamentController = require('../controllers/tournamentController');
const paymentController = require('../controllers/paymentController');
const matchController = require('../controllers/matchController');
const gameController = require('../controllers/gameController');
const betInfoController = require('../controllers/betInfoController');
const userController = require('../controllers/appuserController');

const router = express.Router();
//create admin or super admin route
router.post('/create', adminController.createAdminUser);

//login admin or super admin route
router.post('/login', adminController.login);

//change super admin password
router.post('/change-password', adminController.changePassword);

//generate access token
router.post('/getaccesstoken', adminController.generateAccessToken);

//get all super admins
router.get('/listadmins', adminController.listAdminUser);

//update super admin details
router.put('/update', adminController.updateAdminUser);

//admin address generate
router.post('/address', adminController.generateAdminAddress);

//2fa sms create;
router.post('/2fa-create', adminController.createSecret);
//2fa sms verify
router.post('/2fa-verify', adminController.verifySecret);
//2fa sms after enable
router.post('/2fa-enable', adminController.afterSecret);
//admin wallet 
router.get('/adminwallet', adminController.listAdminWallet);
router.put('/adminwallet', adminController.updateAdminWallet)
//add token in user wallet by admin
router.post('/addtoken', adminController.adminTokenCredit);
//debit token in user wallet by admin
router.post('/debit-token', adminController.adminTokenDebit);
router.put('/asset', assetController.editAsset);
//list asset details
router.get('/asset', assetController.listAsset);

//reset password
router.post('/reset', adminController.resetPassword);

//create touranament 
router.post('/tournament', tournamentController.createTournament);
//edit touranament
router.get ('/tournament',tournamentController.listtournamentAdmin);
//list tournament
router.put('/tournament', tournamentController.edittournament);

//list over all transaction
router.get('/overall', paymentController.overAllTransactionAdmin);

router.get('/cri-matches', matchController.cricketMatchLists);
router.get('/tournament-info', matchController.touranamentInfo);

router.get('/admin-details', adminController.adminDetails);
router.post('/match', tournamentController.listMatchFilter)
router.post('/game',gameController.creategame);
router.get('/game',gameController.getgame);
router.put('/game',gameController.editgame)
router.get('/get_document',adminController.getDocument)
router.get('/list-bet',betInfoController.getBetAdmin);
router.post('/match', tournamentController.listMatchFilter);
router.get('/getusers', userController.listUser);
router.get('/deposit-history', paymentController.depositHistory);
router.get('/2day-matches',matchController.todayMatchListAdmin)
router.post('/get_live_game',gameController.getLiveGameForAdmin)
router.get('/football-betting-admin-list',matchController.footballBettingAdminList)
router.post('/football-lineup',matchController.footballMatchLineup)
router.get('/get_today_football_match_admin',matchController.getTodayFootballMatchAdmin)
router.get('/football-list-tournament',matchController.listFootballTournament)
router.post('/football-list-matches',matchController.listFootballMatches)

router.post('/create-notification',adminController.createNotification)

router.get('/list-football-tournament',matchController.listTournamentForAdmin)
router.post('/football-betting-admin',matchController.footballBettingAdmin)
router.post('/football-betting-admin-edit',matchController.footballBettingAdminEdit)
router.post('/football-realtime-data',matchController.footballRealTimeDataSocket)
router.get('/football-user-betting-history-admin',matchController.footballUserBettingHistoryAdmin)

module.exports = router;