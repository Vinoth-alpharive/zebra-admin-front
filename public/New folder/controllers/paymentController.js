const Utils = require("../helpers/utils");
const APIRes = require("../helpers/result");
const { validationResult } = require("express-validator");
const paymentModel = require("../models/paymentModel");
const walletModel = require("../models/walletModel");
const assetModel = require("../models/assetModel");
const createTransactionModel = require("../models/createTransactionIpnModel");
const ipnTransactionInfoModel = require("../models/ipnTransactionInfoModel");
const overAllTransactionModel = require("../models/overallTransactionsModel");
const withdrawModel = require("../models/withdrawModel");
const deviceModel = require("../models/deviceModel")
const adminWalletModel = require("../models/adminWalletModel");
const { ncMul, overAllTransaction } = require("../helpers/calc");
var axios = require("axios");
const Coinpayments = require("coinpayments");
const { default: mongoose } = require("mongoose");
const moment = require('moment-timezone')
var WAValidator = require('multicoin-address-validator');
const {sendNotification} = require('../helpers/pushNotification')
const paymentTransaction = require("../models/paymentModel");

//coinpayment instance creation
var client = new Coinpayments({
  key: process.env.COINPAYMENT_PUBLIC_KEY,
  secret: process.env.COINPAYMENT_PRIVATE_KEY,
});

exports.coinPaymentCreateTransaction = async (req, res) => {
  try {
    const { userId } = req.user;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    var userInput = Utils.getReqValues(req);

    if (!userInput.currency) {
      return APIRes.getErrorResult("Please fill the currency field", res);
    }
    if (!userInput.no_of_token) {
      return APIRes.getErrorResult("Please fill the token Amount", res);
    }
    if (!userInput.buyerEmail) {
      return APIRes.getErrorResult("Please fill the Email Amount", res);
    }
    if (!userInput.address) {
      return APIRes.getErrorResult("Please fill the User Address", res);
    }
    const assetData = await assetModel.findOne({
      symbol: userInput.currency.toUpperCase(),
    });
    if (!assetData) {
      return APIRes.getErrorResult("Invalid asset", res);
    }

    const createTransaction = await client.createTransaction({
      currency1: userInput.currency,
      currency2: userInput.currency,
      amount: userInput.tokenAmount,
      buyer_email: userInput.buyerEmail,
      address: userInput.address,
      ipn_url: process.env.IPN_URL,
      success_url: process.env.IPN_SUCCESS,
      cancel_url: process.env.IPN_FAILURE,
      merchant: process.env.MERCHANT,
      ipn_id: process.env.IPN_SECRET,
    });

    if (createTransaction) {
      createTransaction.userId = userId;
      createTransaction.no_of_token = userInput.no_of_token;
      createTransaction.live_price = assetData.price;
      createTransaction.user_address = userInput.address;
      createTransaction.asset = userInput.currency;
      createTransaction.transaction_type = "BUY";
      createTransaction.buyer_email = userInput.buyerEmail;
      await createTransactionModel.create(createTransaction);
      //get information in coinpayment and updated in database
      const getInfo = await client.getTx({
        txid: createTransaction.txn_id,
        ipn_url: process.env.IPN_URL,
        success_url: process.env.IPN_SUCCESS,
        cancel_url: process.env.IPN_FAILURE,
        merchant: process.env.MERCHANT,
        ipn_id: process.env.IPN_SECRET,
      });
      if (getInfo) {
        if (!createTransaction.txn_id) {
          return APIRes.getErrorResult("required transaction id", res);
        }
        const findData = await walletModel.find({ user_id: userId });

        if (findData.length >= 0) {
          const assetData = await assetModel.findOne({
            symbol: userInput.currency.toUpperCase(),
          });

          if (assetData) {
            let insertData = {};
            insertData.asset = assetData.symbol;
            insertData.user_id = userId;
            insertData.price = assetData.price;
            insertData.no_of_token = parseInt(userInput.no_of_token);
            insertData.txId = createTransaction.txn_id;
            insertData.transaction = getInfo;
            insertData.transaction_type = userInput.transaction_type;
            insertData.payment_type = 1;
            insertData.totalPrice = parseFloat(
              userInput.no_of_token * assetData.price
            );
            insertData.status = getInfo.status;
            insertData.status_text = getInfo.status_text;

            const payment = await paymentModel.create(insertData);

            //  console.log(createTransaction.checkout_url);

            const paymentData = {
              payment: payment,
              checkoutURL: createTransaction.checkout_url,
            };

            return APIRes.getMessageResult(paymentData, "success", res);
          } else {
            return APIRes.getErrorResult("Invalid asset", res);
          }
        } else {
          return APIRes.getErrorResult("No data found", res);
        }
      }
    }
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

exports.coinPaymentWithdrawTransaction = async (req, res) => {
  try {
    const { userId } = req.user;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    var userInput = Utils.getReqValues(req);
    //coinpayment withdraw transaction
    const assetData = await assetModel.findOne({
      symbol: userInput.currency.toUpperCase(),
    });
    if (!assetData) {
      return APIRes.getErrorResult("invalid asset", res);
    }

    const withdraw = await client.createWithdrawal({
      amount: userInput.tokenAmount,
      currency: userInput.currency,
      address: userInput.withdrawAddress,
      ipn_url: process.env.IPN_URL,
      success_url: process.env.IPN_SUCCESS,
      cancel_url: process.env.IPN_FAILURE,
      userId: userId,
    });
    if (withdraw) {
      withdraw.userId = userId;
      withdraw.no_of_token = userInput.no_of_token;
      withdraw.live_price = assetData.price;
      // await withdrawModel.create(withdraw);
      //get information in coinpayment and updated in database
      const getInfo = await client.getWithdrawalInfo({
        id: withdraw.id,
        ipn_url: process.env.IPN_URL,
        success_url: process.env.IPN_SUCCESS,
        cancel_url: process.env.IPN_FAILURE,
      });

      getInfo.userId = userId;
      getInfo.txn_id = withdraw.id;
      // const getInformation = await ipnTransactionInfoModel.create(getInfo);
      // return APIRes.getMessageResult(getInformation, "success", res);

      if (!withdraw.id) {
        return APIRes.getErrorResult("required transaction id", res);
      }
      const findData = await walletModel.find({ user_id: userId });

      if (findData.length >= 0) {
        const assetData = await assetModel.findOne({
          symbol: userInput.currency.toUpperCase(),
        });
        if (assetData) {
          let insertData = {};
          insertData.asset = assetData.symbol;
          insertData.user_id = userId;
          insertData.price = assetData.price;
          insertData.no_of_token = parseFloat(userInput.no_of_token);
          insertData.txId = withdraw.id;
          insertData.transaction = getInfo;
          insertData.transaction_type = userInput.transaction_type;
          insertData.payment_type = 1;
          insertData.totalPrice = parseFloat(userInput.no_of_token * assetData.price);
          // insertData.balance = ncMul(userInput.no_of_token, assetData.price);
          insertData.balance = userInput.no_of_token;
          insertData.status = getInfo.status;
          insertData.status_text = getInfo.status_text;
          const payment = await paymentModel.create(insertData);
          const updateWithdraw = await withdrawModel.findByIdAndUpdate(
            { _id: userInput.withdraw_id },
            { $set: { tx_id: withdraw.id } },
            { new: true }
          );
          payment.checkout_url = withdraw.checkout_url;
          return APIRes.getMessageResult(payment, "success", res);
        } else {
          return APIRes.getErrorResult("Invalid asset", res);
        }
      } else {
        return APIRes.getErrorResult("No data found", res);
      }
    }
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
};

exports.listTransactions = async (req, res) => {
  try {
    console.log("asfasf");
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
   
    let payload = {};
    if (userInput.transaction_type) {
      payload.transaction_type = userInput.transaction_type;
    } else if (userInput.id) {
      payload._id = mongoose.Types.ObjectId(userInput.id);
    }
    if (userInput.type) {
      payload.type = userInput.type;
    }
    const listedData = await paymentModel.aggregate([{ $match: payload }]);
    listedData.msg = "fetch data successfully!";
    return APIRes.getSuccessResult(listedData, res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

exports.withdraw = async (req, res) => {
  try {
    const { userId } = req.user;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    var userInput = Utils.getReqValues(req);
    if (!userInput.coin || !userInput.no_of_token) {
      return APIRes.getErrorResult("required coin name total token", res);
    }
    const assetData = await assetModel.findOne({
      symbol: userInput.coin.toUpperCase(),
    });
    if (!assetData) {
      return APIRes.getErrorResult("invalid asset", res);
    }


//  var valid = WAValidator.validate(userInput.send_address, userInput.coin.toUpperCase());

    
  //  if(!valid){
   //   return APIRes.getErrorResult(`Invalid ${userInput.coin.toUpperCase()} address`, res);
  //  }


    const admin = await adminWalletModel.findOne();
    const startOfDay = moment.utc().startOf('day')
    const endOfDay = moment.utc().endOf('day')
    const withdrawLimit = await withdrawModel.aggregate([
      {
        $match: {
          $and: [
            {
              user_id: require("mongoose").Types.ObjectId(userId),
            },
            {
              transaction_type: "SELL",
            },
            {
              createdAt: {
                $gte: moment().startOf('day').toDate(),
                $lte: moment(moment().startOf('day').toDate()).endOf('day').toDate(),
              },
            },
          ],
        },
      },
    ]);
 
    let insert = {};
    insert.user_id = userId;
    insert.live_price = assetData.price;
    insert.coin = assetData.symbol;
    insert.send_address = userInput.send_address;
    insert.no_of_token = parseInt(userInput.no_of_token);
    insert.transaction_type = "SELL";
    insert.status_text="Waiting for Admin Approval";
    insert.totalPrice= parseFloat(userInput.no_of_token)*parseFloat(assetData.price);
    const walletData = await walletModel.findOne({ user_id: userId });
    if (admin.withdraw_limit >= withdrawLimit.length) {
      if (admin.minimum_withdraw <= userInput.no_of_token) {
        if (admin.maximum_withdraw >= userInput.no_of_token) {
          if (walletData) {
            if (walletData.balance > parseInt(userInput.no_of_token)) {
              const insertData = await withdrawModel.create(insert);
              return APIRes.getMessageResult(insertData, "success", res);
            } else {
              return APIRes.getErrorResult("Insufficient token", res);
            }
          } else {
            return APIRes.getErrorResult("Wallet not found", res);
          }
        } else {
          return APIRes.getErrorResult(
            `Maximum withdraw limit is ${admin.maximum_withdraw}`,
            res
          );
        }
      } else {
        return APIRes.getErrorResult(
          `Minimum withdraw limit is ${admin.minimum_withdraw}`,
          res
        );
      }
    } else {
      return APIRes.getErrorResult("Reached your withdraw limit", res);
    }
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

exports.listWithdrawRequest = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    
    let whereCodn = {};
    if (userInput._id) {
      whereCodn._id = userInput._id;
    }
   whereCodn.status = { $eq: "0" };


    const listedData= await withdrawModel
      .find(whereCodn)
      .populate({
        path: "user_id",
        model: "AppUsers",
        select: {
          f2A_creds: 0,
          password: 0,
          emailVerificationCode: 0,
          mobileVerificationCode: 0,
          signup_type: 0,
          forgot_otp: 0,
          otpExpire: 0,
        },
      })
      .sort({ created: "DESC" })
      .lean();
    return APIRes.getMessageResult(listedData, "fetch data successfully!",res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

module.exports.editWithdraw = async (req, res) => {
  try {
    let userInput = Utils.getReqValues(req);
    let whereCodn = {};
    const { userId ,userRole} = req.user;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    if(!(userRole =="ADMIN" || userRole =="SUPERADMIN")){
      return APIRes.getErrorResult("Invalid token provide a super admin or admin token", res);
    }
    if (!userInput._id) {
      return APIRes.getErrorResult("required withdraw id", res);
      }
     if (userInput._id) {
      whereCodn._id = userInput._id;
    }
    delete userInput._id;
    let updateQuery = {
      $set: userInput,
    };
    const editedData = await withdrawModel.findByIdAndUpdate( whereCodn,updateQuery,{ new: true });
    editedData.msg = "Update successfully!"
    return APIRes.getSuccessResult(editedData, res)
  } catch (err) {
    return APIRes.getErrorResult(err, res);
  }
};


exports.withdrawHistory = async(req,res)=>{
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    const { userId ,userRole} = req.user;
    let whereCodn = {};
    if (userInput._id) {
      whereCodn._id = userInput._id;
    }
    if (userRole === "User") {
      whereCodn.user_id = userId;
    }
    // whereCodn.status = { $ne: "0" };
    let listedData = {};
    listedData = await withdrawModel
      .find(whereCodn)
      .populate({
        path: "user_id",
        model: "AppUsers",
        select: {
          f2A_creds: 0,
          password: 0,
          emailVerificationCode: 0,
          mobileVerificationCode: 0,
          signup_type: 0,
          forgot_otp: 0,
          otpExpire: 0,
        },
      }).sort({ created: "DESC" }).lean();
       const result =  listedData.map((item,i)=>{
    return {
      _id:item?._id,
      user_id:item?.user_id,
      status:item?.status,
      status_text:item?.status_text,
      coin:item?.coin,
      transaction_type:item?.transaction_type,
      no_of_token:item?.no_of_token,
      live_price:item?.live_price,
      totalPrice:item?.totalPrice,
      send_address:item?.send_address,
      createdAt : moment(item.createdAt).format('x'),
      updatedAt: moment(item.updatedAt).format('x'),
      __v:item?.__v
    }
  })


    result.msg="Fetch Data Successfully!";
    return APIRes.getSuccessResult(result,res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}



exports.depositHistory = async(req,res)=>{
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    const { userId ,userRole} = req.user;
    let whereCodn = {};
    if (userInput._id) {
      whereCodn._id = userInput._id;
    }
    if (userRole === "User") {
      whereCodn.user_id = userId;
    }
    whereCodn.transaction_type = "BUY";
    let listedData = {};
    listedData = await paymentModel
      .find(whereCodn)
      .populate({
        path: "user_id",
        model: "AppUsers",
        select: {
          f2A_creds: 0,
          password: 0,
          emailVerificationCode: 0,
          mobileVerificationCode: 0,
          signup_type: 0,
          forgot_otp: 0,
          otpExpire: 0,
        },
      }).sort({ created: "DESC" }).lean();
  
      const listResult = listedData?.map((item,i)=>{
        return {
          user_id :item.user_id,
          _id:item._id,
          payment_type:item.payment_type,
          transaction_type:item.transaction_type,
          txId:item.txId,
          asset:item.asset,
          no_of_token:item.no_of_token,
          price:item.price,
          totalPrice:item.totalPrice,
          status:item.status,
          status_text:item.status_text,
          createdAt:moment(item.createdAt).format('x'),
         updatedAt:moment(item.updatedAt).format('x'),
         __v:item.__v,
         transaction:{
          status_text:item?.transaction?.status_text?item?.transaction?.status_text:"",
          fee:item?.transaction?.fee?item?.transaction?.fee:"",
          send_tx:item?.transaction?.send_tx?item?.transaction?.send_tx:"",
          net:item?.transaction?.net?item?.transaction?.net:""
         }
        }
      })

  
    listResult.msg = "fetch data successfully!"
      return APIRes.getSuccessResult(listResult,res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}





exports.overAllTransaction = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    const { userId, userRole } = req.user;
    
    let whereCodn = {};
    let checkCodn = {}
    if (userInput._id) {
      whereCodn._id = userInput._id;
      checkCodn._id = userInput._id
    }
    if (userInput.type) {
      whereCodn.type = userInput.type;
      checkCodn.type = userInput.type
  
    }
    if (userRole === "User") {
      whereCodn.user_id = userId;
      checkCodn.user_id = userId;
    }

    // const listedData = await overAllTransactionModel
    //   .find(whereCodn)
    //   .populate([
    //     {
    //       path: "user_id",
    //       model: "AppUsers",
    //       select: {
    //         email: 1,
    //         phoneNumber: 1,
    //         name: 1,
    //         f2A_enable: 1,
    //         profilePicture: 1,
    //         coverPicture: 1,
    //       },
    //     },
    //   ])
    //   .populate("actionid")
    //   .sort({ created: "DESC" })
    //   .lean();
    // listedData.msg = "fetch data successfully!";


    const listedData = await paymentTransaction.find({user_id:userId,status:{"$ne":"100"}}).sort({createdAt:"DESC"}).lean()
    const secondListedData = await overAllTransactionModel
      .find(whereCodn)
      .populate([
        {
          path: "user_id",
          model: "AppUsers",
          select: {
            email: 1,
            phoneNumber: 1,
            name: 1,
            f2A_enable: 1,
            profilePicture: 1,
            coverPicture: 1,
          },
        },
      ])
      .populate("actionid")
      .sort({ created: "DESC" })
      .lean();


 const resultData = listedData.concat(secondListedData).sort((a,b)=> new Date().toLocaleString(a.createdAt) - new Date().toLocaleString(b.createdAt)).slice(0,5).map((item)=>{
    return{
      status:item.status?item?.status:100,
      status_text:item.status_text?item.status_text:"Complete",
      transaction_coin_type:item?.asset?item.asset:item?.coin,
      amount:item?.totalPrice?item?.totalPrice:item?.totalPrice,
      no_of_token:item?.no_of_token?item?.no_of_token:item?.no_of_token,
     date: moment(item.createdAt).format('x'),
    }
 })

 


    return APIRes.getMessageResult(resultData, "Fetch data successfully!", res);
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
};


exports.overAllTransactionAdmin = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    const { userId, userRole } = req.user;
    let whereCodn = {};
    if (userInput._id) {
      whereCodn._id = userInput._id;
    }
   if (userInput.user_id) {
      whereCodn.user_id = userInput.user_id;
    }
    if (userInput.type) {
      whereCodn.type = userInput.type;
    }
    if (userRole === "User") {
      whereCodn.user_id = userId;
    }
    const listedData = await overAllTransactionModel
      .find(whereCodn)
      .populate([
        {
          path: "user_id",
          model: "AppUsers",
          select: {
            email: 1,
            phoneNumber: 1,
            name: 1,
            f2A_enable: 1,
            profilePicture: 1,
            coverPicture: 1,
          },
        },
      ])
      .populate("actionid")
      .sort({ created: "DESC" })
      .lean();
    // listedData.msg = "fetch data successfully!";
    return APIRes.getMessageResult(listedData, "Fetch data successfully!", res);
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
};






exports.ipnResponse = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    var userInput = Utils.getReqValues(req);
    if (userInput.ipn_type === "api") {
      const whereCodn = {};

      if (userInput.status) {
        whereCodn.status = userInput.status;
      }
      if (userInput.status_text) {
        whereCodn.status_text = userInput.status_text;
      }
      if (userInput.send_tx) {
        whereCodn.send_tx = userInput.send_tx;
      }
      if (userInput) {
        whereCodn.transaction = userInput;
      }

console.log("This is IPN");

      // const updatePaymentModel = await ipnTransactionInfoModel.findOneAndUpdate(
      //   {
      //     buyTransactionId: userInput.txn_id,
      //     status: { $ne: 100 },
      //   },
      //   { $set: whereCodn },
      //   { new: true }
      // );

      const updateDeposit = await createTransactionModel.findOneAndUpdate(
        {
          txn_id: userInput.txn_id,
          status: { $ne: 100 },
        },
        { $set: whereCodn },
        { new: true }
      );

 const getTransaction = await paymentModel.findOne({txId:userInput.txn_id,status:{$ne:"100"}}).lean()

      if (userInput.status === "100"&&getTransaction!==null) {
        const updatePaymentTransaction = await paymentModel.findOneAndUpdate(
          {
            txId: userInput.txn_id,
          },
          {
            $set: whereCodn,
          },
          { new: true }
        );

        const updateWallet = await walletModel.findOneAndUpdate(
          {
            user_id: updatePaymentTransaction?.user_id,
          },
          { $inc: { balance: updatePaymentTransaction.no_of_token } },
          { new: true }
        );
        const walletUser = await walletModel.findOne({user_id: updatePaymentTransaction?.user_id}).populate('user_id').lean()
        let deviceIds = [];
        let alreadyDeviceSaved = await deviceModel.findOne({
        user_id: updatePaymentTransaction?.user_id
        });
        message = `Dear ${walletUser.user_id.name}, Your ${process.env.APP_NAME}  App Account has been debited with ${updatePaymentTransaction.price} ${updatePaymentTransaction.asset}in LWIN Token (${parseFloat(updatePaymentTransaction.no_of_token)}LWIN Token) on ${moment(walletUser.updatedAt).tz('Asia/Kolkata').format('llll')} The Available LWIN Token is ${parseFloat(walletUser.balance)}LWIN`;
        if(alreadyDeviceSaved && alreadyDeviceSaved.push_token){
          deviceIds.push(alreadyDeviceSaved.push_token);
          if (
            alreadyDeviceSaved &&
            alreadyDeviceSaved.pushenabled &&
            deviceIds.length > 0
          ) {
            msgData = {};
            await sendNotification(deviceIds, message, msgData);
          }
        }
        const overAllTransaction = async (
          userId = null,
          coin = null,
          type = null,
          amount = null,
          totalPrice = null,
          no_of_token = null,
          actionfrom = null,
          updatefrom = null,
          actionid = null,
          remark = null,
          credit = null,
          debit = null
        ) => {
          try {
            let whereCodn = {};
            whereCodn.user_id = userId;
            whereCodn.coin = coin;
            whereCodn.type = type;
            whereCodn.price = amount;
            whereCodn.totalPrice = totalPrice;
            whereCodn.no_of_token = no_of_token;
            whereCodn.credit = no_of_token;
            whereCodn.availablebalance = updateWallet.balance;
            whereCodn.oldbalance =
              updateWallet.balance - updatePaymentTransaction.no_of_token;
            // if(credit){
            // whereCodn.credit=credit;
            // }
            // if(debit){
            // whereCodn.debit =debit;
            // }
            whereCodn.actionid = actionid;
            whereCodn.remark = remark;
            whereCodn.actionfrom = actionfrom;

            const createData = await overAllTransactionModel.create(whereCodn);

            return {
              isError: false,
              message: "success",
              result: createData,
            };
          } catch (error) {
            return { isError: true, message: error };
          }
        };

        const overall = await overAllTransaction(
          updatePaymentTransaction?.user_id,
          updatePaymentTransaction.asset,
          updatePaymentTransaction.transaction_type,
          updatePaymentTransaction.price,
          updatePaymentTransaction.totalPrice,
          updatePaymentTransaction.no_of_token,
          "user",
          (updatefrom = null),
          updatePaymentTransaction?.user_id,
          updatePaymentTransaction.transaction_type,
          "credit",
          null
        );



        const depositHistory = await createTransactionModel.find()
    global.depositHistoryCall(depositHistory)
      }
    }
    if (userInput.ipn_type === "withdrawal") {
      const whereCodn = {};

      if (userInput.status) {
        whereCodn.status = userInput.status;
      }
      if (userInput.status_text) {
        whereCodn.status_text = userInput.status_text;
      }
      if (userInput) {
        whereCodn.transaction = userInput;
      }
      if (userInput) {
        whereCodn.transaction_type = "SELL";
      }
const getPaymentTransaction = await paymentModel.findOne(
        {
          txId: userInput.id,
 status:{$ne:"2"}
        }).lean()



      if (userInput.status === "2"&&getPaymentTransaction!==null) {
        const updatePaymentTransaction = await paymentModel.findOneAndUpdate(
          {
            txId: userInput.id,
          },
          {
            $set: whereCodn,
          },
          { new: true }
        );

        const updateWithdrawModel = await withdrawModel.findOneAndUpdate(
          { tx_id: userInput.id },
          { $set: whereCodn },
          { new: true }
        );

        const updateWallet = await walletModel.findOneAndUpdate(
          {
            user_id: updateWithdrawModel?.user_id,
          },
          { $inc: { balance: -updatePaymentTransaction.no_of_token } },
          { new: true }
        );
        const walletUser = await walletModel.findOne({user_id: updatePaymentTransaction?.user_id}).populate('user_id').lean()
        let deviceIds = [];
        let alreadyDeviceSaved = await deviceModel.findOne({
        user_id: updatePaymentTransaction?.user_id
        });
        message = `Dear ${walletUser.user_id.name}, Your ${process.env.APP_NAME}  App Account has been credited with ${updatePaymentTransaction.price} ${updatePaymentTransaction.asset} in LWIN Token(${parseFloat(updatePaymentTransaction.no_of_token)}LWIN Token) on ${moment(walletUser.updatedAt).tz('Asia/Kolkata').format('llll')} The Available LWIN Token is ${parseFloat(walletUser.balance)}LWIN`;
        if(alreadyDeviceSaved && alreadyDeviceSaved.push_token){
          deviceIds.push(alreadyDeviceSaved.push_token);
          if (
            alreadyDeviceSaved &&
            alreadyDeviceSaved.pushenabled &&
            deviceIds.length > 0
          ) {
            msgData = {};
            await sendNotification(deviceIds, message, msgData);
          }
        }
        const overAllTransaction = async (
          userId = null,
          coin = null,
          type = null,
          amount = null,
          oldbalance = null,
          availablebalance = null,
          actionfrom = null,
          updatefrom = null,
          actionid = null,
          remark = null,
          credit = null,
          debit = null
        ) => {
          try {
            let whereCodn = {};
            whereCodn.user_id = userId;
            whereCodn.coin = coin;
            whereCodn.type = type;
            whereCodn.price = amount;
            whereCodn.no_of_token = oldbalance;
            whereCodn.totalPrice = availablebalance;
            whereCodn.availablebalance = updateWallet.balance;
            whereCodn.oldbalance =
              updateWallet.balance + updatePaymentTransaction.no_of_token;
            // if(credit){
            // whereCodn.credit=credit;
            // }
            // if(debit){
            // whereCodn.debit =debit;
            // }
            whereCodn.actionid = actionid;
            whereCodn.remark = remark;
            whereCodn.actionfrom = actionfrom;
            whereCodn.debit = updateWithdrawModel.no_of_token;
            const createData = await overAllTransactionModel.create(whereCodn);

            return {
              isError: false,
              message: "success",
              result: createData,
            };
          } catch (error) {
            return { isError: true, message: error };
          }
        };

        const overall = await overAllTransaction(
          updatePaymentTransaction?.user_id,
          updatePaymentTransaction.asset,
          updatePaymentTransaction.transaction_type,
          updatePaymentTransaction.price,
          updatePaymentTransaction.no_of_token,
          updatePaymentTransaction.totalPrice,
          "user",
          (updatefrom = null),
          updatePaymentTransaction?.user_id,
          updatePaymentTransaction.transaction_type,
          "debit",
          null
        );

        
        const withdrawHistory = await withdrawModel.find({status:{"$ne":0}});
        global.withdrawHistoryCall(withdrawHistory);
      }
    }
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

exports.ipnSuccess = async (req, res) => {
  try {
    await res.render("../views/payment/ipn_success.ejs", {
      link: "https://www.google.com",
    });
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

exports.ipnFailure = async (req, res) => {
  try {
    await res.render("../views/payment/ipn_failure.ejs", {
      link: "https://www.google.com",
    });
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

exports.updateWalletModel = async (req, res) => {
  try {
    const overAllTransaction = async (
      userId = null,
      coin = null,
      type = null,
      amount = null,
      oldbalance = null,
      availablebalance = null,
      actionfrom = null,
      updatefrom = null,
      actionid = null,
      remark = null,
      credit = null,
      debit = null
    ) => {
      try {
        let whereCodn = {};
        whereCodn.user_id = userId;
        whereCodn.coin = coin;
        whereCodn.type = type;
        whereCodn.amount = amount;
        whereCodn.oldbalance = oldbalance;
        whereCodn.availablebalance = availablebalance;
        // if(credit){
        // whereCodn.credit=credit;
        // }
        // if(debit){
        // whereCodn.debit =debit;
        // }
        whereCodn.actionid = actionid;
        whereCodn.remark = remark;
        whereCodn.actionfrom = actionfrom;
        const createData = await overAllTransactionModel.create(whereCodn);

        return {
          isError: false,
          message: "success",
          result: createData,
        };
      } catch (error) {
        return { isError: true, message: error };
      }
    };

    const overall = await overAllTransaction(
      req.body?.userId,
      req.body.coin,
      req.body.transaction_type,
      req.body.balance,
      req.body.balance,
      req.body.totalBalance,
      "user",
      (updatefrom = null),
      req.body?.userId,
      req.body.transaction_type,
      "credit",
      null
    );

    return APIRes.getMessageResult(overall, "success", res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};
