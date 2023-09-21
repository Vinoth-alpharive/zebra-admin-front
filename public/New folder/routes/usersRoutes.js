const express = require('express');
const userController = require('../controllers/appuserController');
const kycController = require('../controllers/kycController');
const walletController = require('../controllers/walletController');
const paymentController = require('../controllers/paymentController');
const deviceController = require('../controllers/deviceController');
const touranamentController = require('../controllers/tournamentController');
const matchController = require('../controllers/matchController');
const bettingController = require('../controllers/betInfoController')
const gameController = require('../controllers/gameController');
const betInfoController = require('../controllers/betInfoController')
const router = express.Router();
//register user create router
router.post('/createuser', userController.createAppUser);
//register user verify router
router.post('/signup',userController.verifyAppUser);
//login router
router.post('/signin',userController.login);
//logout router
router.post('/signout',userController.logout);
//get access token router
router.post('/accesstoken',userController.generateAccessToken);
//forgot password router
router.post('/forgot',userController.forgotPassword);
//forgot password verify router
router.post('/forgot-verify',userController.forgotPasswordVerify);
//get all users and particular user router
router.post('/getusers',userController.listUser)
//2fa create secret route
router.post('/2fa-create',userController.createSecret);
//2fa verify secret route
router.post('/2fa-verify',userController.verifySecret);
//2fa afer enable
router.post('/2fa-enable',userController.afterSecret)
//2fa email create;
router.post('/2faEmail-create',userController.create2faEmail);
//2fa email verify
router.post('/2faEmail-verify',userController.verify2faEmail);
//2fa email after enable
router.post('/2faEmail-enable',userController.after2faEmail);
//2fa sms create;
router.post('/2faSms-create',userController.create2faSms);
//2fa sms verify
router.post('/2faSms-verify',userController.verify2faSms);
//2fa sms after enable
router.post('/2faSms-enable',userController.after2faSms);
//kyc create 
router.post('/kyc',kycController.createKyc);
//kyc list
router.get('/kyc',kycController.listKyc);
//kyc change
router.put('/kyc',kycController.updateKyc);
//edit user
router.put('/update',userController.editUser);
//wallet list
router.get('/wallet',walletController.listWallets);
//over all transaction
router.get('/overall',paymentController.overAllTransaction);
router.post('/create-withdraw',paymentController.withdraw);
router.post('/buy',paymentController.coinPaymentCreateTransaction);
router.get('/device-info',deviceController.listDeviceInfo);
router.get('/withdraw-history',paymentController.withdrawHistory);
router.get('/deposit-history',paymentController.depositHistory);
router.post('/tournament',touranamentController.listtournament);
router.post('/player-info',touranamentController.listPlayers);
router.post('/match',touranamentController.listMatchFilter)
router.post('/football-user-betting-history',matchController.footballUserBettingHistory)
router.post('/football-match-betting-history',matchController.footballMatchBettingHistory)
router.post('/create-bet',bettingController.createBetting);
router.post('/list-bet',bettingController.getBet);
router.get('/match-info',matchController.matchInformation);
router.get('/game-info',gameController.getgameUser)
router.post('/get_user_result',bettingController.getUserBetResult)
router.get('/bet-info',betInfoController.getBetInfo);
router.get('/get_match_result',bettingController.getMatchBetResult);
router.post('/bet-details',bettingController.getBetDetailsAfterBet)
router.post('/get_live_game',gameController.getLiveGame)
router.get('/2day-matches',matchController.todayMatchList)
router.post('/get_document',userController.getDocument)
router.get('/get_match_transaction',matchController.getMatchTransaction)
router.get('/get_today_football_match',matchController.getTodayFootballMatch)

//football api
router.get('/football-list-tournament',matchController.listFootballTournament)
router.post('/football-list-matches',matchController.listFootballMatches)
router.post('/football-particular-player',matchController.getParticularPlayer)
router.post('/football-realtime-data',matchController.footballRealTimeData)
router.post('/football-timelines',matchController.footballMatchTimelines)
router.post('/football-lineup',matchController.footballMatchLineup)
router.post('/football-player-stats',matchController.footballMatchPlayerStatics)
router.post('/football-user-betting',betInfoController.createFootBallBetting)
router.post('/football-bet-matches',matchController.footballBetMatches)
router.post('/football-real-time-data',matchController.footballRealTimeDataSocket)
router.get('/get_match_transaction_football',matchController.getMatchTransactionFootball)
router.post('/get_match_football_details',matchController.getMatchFootballDetails)

module.exports = router;

