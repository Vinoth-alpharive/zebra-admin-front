const express = require("express");
const paymentController = require("../controllers/paymentController");

const router = express.Router();
// create coinpayment transaction
router.post("/create", paymentController.coinPaymentCreateTransaction);
//withdraw coinpayment transaction
router.post("/withdraw", paymentController.coinPaymentWithdrawTransaction);
//List Transaction
router.get("/listtransactions", paymentController.listTransactions);
//ipn URL
router.post('/ipn/response',paymentController.ipnResponse);

//ipn Success URL
router.get('/ipn/success',paymentController.ipnSuccess);

//ipn failure URL
router.get('/ipn/failure',paymentController.ipnFailure);
//create withdraw request
router.post('/create-withdraw',paymentController.withdraw);
router.get('/withdraw-requests',paymentController.listWithdrawRequest);

router.get('/withdraw-history',paymentController.withdrawHistory)
router.get('/deposit-history',paymentController.depositHistory)

router.get('/checking',paymentController.updateWalletModel)

router.post('/withdraw_from_admin',paymentController.coinPaymentWithdrawTransaction)

router.put('/withdraw-edit',paymentController.editWithdraw)


module.exports = router;
