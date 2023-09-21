const Utils = require("../helpers/utils");
const APIRes = require("../helpers/result");
const { signAccessToken, signToken, signRefreshToken, verifyRefreshToken, verifyPassword, authenticateToken, } = require("../middleware/auth");
const { validationResult } = require("express-validator");
const AdminUser = require('../models/adminModel')
const adminWalletModel = require('../models/adminWalletModel');
const walletModel = require('../models/walletModel');
const userModel = require('../models/appuserModel');
const matchModel = require('../models/matchModel')
const MatchModel = require('../models/tournamentModel');
const AssetModel = require('../models/assetModel')
const WithdrawModel = require('../models/withdrawModel')
const TransactionModel = require('../models/overallTransactionsModel')
var axios = require('axios');
const speakeasy = require("speakeasy");
const Cryptr = require('cryptr');
const cryptr = new Cryptr('betting');
const { overAllTransaction } = require('../helpers/calc')
const siteModel = require('../models/siteModel')
const deviceModel = require('../models/deviceModel')
const moment = require('moment-timezone')
const {sendNotification}=require('../helpers/pushNotification')


exports.createAdminUser = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId, userRole } = req.user;
    const userInput = Utils.getReqValues(req);
    if (userRole !== "SUPERADMIN") {
      return APIRes.getErrorResult("Invalid token provide a super admin token", res);
    }
    if (!userInput.email || !userInput.password || !userInput.name || !userInput.roleType) {
      return APIRes.getErrorResult("required email, password, name and role type", res);
    }
    if (userInput.roleType !== "ADMIN") {
      return APIRes.getErrorResult("Invalid role Type", res);
    }
    const findData = await AdminUser.findOne({ email: userInput.email })
    if (findData) {
      return APIRes.getErrorResult("email already exist", res);
    } else {
      const saveData = {};
      saveData.email = userInput.email;
      saveData.password = await Utils.password(userInput.password);
      saveData.name = userInput.name;
      saveData.roleType = userInput.roleType;
      saveData.createdBy = userId;
      let adminUser = await AdminUser.create(saveData);
      let result = await AdminUser.findOne({ email: adminUser.email }).select("email name active rolyType")
      result.msg = "Admin added successfully!"
      return APIRes.getSuccessResult(result, res)
    }
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}

exports.login = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    if (!userInput.email || !userInput.password) {
      return APIRes.getErrorResult("required email and password", res);
    }
    const user = await AdminUser.findOne({ email: userInput.email }).select("password roleType");
    if (!user) {
      return APIRes.getErrorResult("Invalid email", res);
    } else if (!(await verifyPassword(userInput.password, user.password))) {
      return APIRes.getErrorResult("Invalid password", res);
    } else if (user.active === false) {
      return APIRes.getErrorResult("User not active please contact admin", res);
    } else {
      let userId = user.id;
      const accessToken = await signAccessToken(userId, user.roleType === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN");
      const refreshToken = await signRefreshToken(userId, user.roleType === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN");
      let result = {};
      result.result = await AdminUser.findById({ _id: userId }).select('-password').lean();
      result.msg = "Login successfully!";
      result.accessToken = accessToken;
      result.refreshToken = refreshToken;
      return APIRes.getSuccessResult(result, res)
    }
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}

exports.changePassword = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    const { userId, userRole } = req.user;
    const user = await AdminUser.findById({ _id: userId }).select('password is_first_log roleType').lean();
    if (userRole !== "ADMIN") {
      return APIRes.getErrorResult("Admin only can change password", res);
    }
    if (!userInput.password) {
      return APIRes.getErrorResult("required password", res);
    }
    if (!user.is_first_log) {
      if (!userInput.oldpassword) {
        return APIRes.getErrorResult("required oldpassword", res);
      }
    }
    if (!user) {
      return APIRes.getErrorResult("user not found", res);
    } else {
      const find = await AdminUser.findById({ _id: userId }).lean()
      if (find && find.roleType === "ADMIN") {
        if (!find.is_first_log) {
          const compare = await Utils.comparePassword(userInput.oldpassword, user.password);
          if (compare) {
            const compare1 = await Utils.comparePassword(userInput.password, user.password);
            if (!compare1) {
              let password = await Utils.password(userInput.password);
              const update = await AdminUser.updateOne({ _id: userId }, { $set: { password: password } }, { new: true });
            } else {
              return APIRes.getErrorResult("Old password and new password same", res);
            }
          } else {
            return APIRes.getErrorResult("Old password not valid", res);
          }
        }

        let password = await Utils.password(userInput.password);
        const update = await AdminUser.updateOne({ _id: userId }, { $set: { password: password } }, { new: true });
        if (find.is_first_log) {
          const deleteData = await AdminUser.update({ _id: userId }, { $unset: { is_first_log: 1 } }, { new: true });
        }
        return APIRes.getSuccessResult("Password change successfully", res)
      } else {
        return APIRes.getErrorResult("User not found", res);
      }
    }
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
}

//get Access Token
exports.generateAccessToken = async (req, res, next) => {
  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw errors.array();
  }
  const userInput = Utils.getReqValues(req);
  if (!userInput.token) {
    return APIRes.getErrorResult("token is required ", res);
  }
  if (!userInput.userid) {
    return APIRes.getErrorResult("userid is required ", res);
  }
  try {
    const user = await AdminUser.findById({ _id: userInput.userid });
    if (!user) {
      return APIRes.getErrorResult("user not found", res);
    }
    else if (!user.active) {
      return APIRes.getErrorResult("Account has been deactivated ", res);
    }
    let isValidToken = await verifyRefreshToken(userInput.token);
    if (isValidToken) {
      const accessToken = await signAccessToken(user.id, user.roleType === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN");
      const refreshToken = await signRefreshToken(user.id, user.roleType === "SUPERADMIN" ? "SUPERADMIN" : "ADMIN");
      let result = {};
      result.accessToken = accessToken;
      result.refreshToken = refreshToken;
      return APIRes.getSuccessResult(result, res)
    } else {
      return APIRes.getErrorResult("Invalid token", res);
    }
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

//get super Admin users
exports.listAdminUser = async (req, res) => {
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
    whereCodn.roleType = "ADMIN";
    whereCodn.active = true;
    const listedData = await AdminUser.find(whereCodn).sort({ created: "DESC" }).lean();
    listedData.msg = "fetch data successfully!";
    return APIRes.getSuccessResult(listedData, res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

//update super admin users
exports.updateAdminUser = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    const { userId, userRole } = req.user;
    const user = await AdminUser.findById({ _id: userId });
    if (userRole !== "SUPERADMIN") {
      return APIRes.getErrorResult("Invalid token provide a super admin token", res);
    }
    if (!userInput.userid) {
      return APIRes.getErrorResult("required userid", res);
    }
    if (!user) {
      return APIRes.getErrorResult("user not found", res);
    } else if (user.roleType === "ADMIN") {
      return APIRes.getErrorResult("can't access please contact admin!", res);
    } else {
      const find = await AdminUser.findById({ _id: userInput.userid })
      if (find && find.roleType === "ADMIN") {
        delete userInput.userid;
        const update = await AdminUser.findByIdAndUpdate({ _id: find._id }, { $set: userInput }, { new: true });
        return APIRes.getSuccessResult("Update successfully", res)
      } else {
        return APIRes.getErrorResult("User not found", res);
      }
    }
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
}

//admin wallet address generation
exports.generateAdminAddress = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId, userRole } = req.user;
    const userInput = Utils.getReqValues(req);
    if (userRole !== "SUPERADMIN") {
      return APIRes.getErrorResult("Invalid token provide a super admin token", res);
    }
    var config = { method: 'post', url: 'https://api.blockcypher.com/v1/eth/main/addrs', headers: {} };
    const response = await axios(config);
    const result = response.data;
    let saveData = {}
    saveData.address = "0x" + result.address;
    const publicFirst = result.public.substring(0, Math.ceil(result.public.length / 2))
    const publicSecond = result.public.substring(Math.ceil(result.public.length / 2), Math.ceil(result.public.length))
    const privateFirst = result.private.substring(0, Math.ceil(result.private.length / 2))
    const privateSecond = result.private.substring(Math.ceil(result.private.length / 2), Math.ceil(result.private.length))
    saveData.pubping = cryptr.encrypt(publicFirst)
    saveData.pubpong = cryptr.encrypt(publicSecond)
    saveData.priping = cryptr.encrypt(privateFirst)
    saveData.pripong = cryptr.encrypt(privateSecond)
    const insert = await adminWalletModel.create(saveData)
    return APIRes.getSuccessResult("Admin wallet created successfully", res);

  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
}

//2fa create secret
exports.createSecret = async (req, res, next) => {
  try {
    const { userId } = req.user;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const findData = await AdminUser.findById({ _id: userId });
    if (!findData?.f2A_creds || findData.f2A_creds === undefined) {
      let whereCodn = {};
      whereCodn.name = findData.email || findData.phoneNumber
      const temp_secret = await speakeasy.generateSecret({
        name: "Gaming" + whereCodn.name,
      });
      const updateData = await AdminUser.findOneAndUpdate(
        { _id: userId },
        { "f2A_creds.state": false, "f2A_creds.temp_secret": temp_secret },
        { new: true }
      );
      if (updateData) {
        return APIRes.getMessageResult({ secret: updateData.f2A_creds.temp_secret.base32 }, "successfully generating secret key", res);
      }
    } else if (findData.f2A_creds && findData.f2A_creds.state == false) {
      return APIRes.getMessageResult({ secret: findData.f2A_creds.temp_secret.base32 }, "successfully generating secret key", res);
    } else if (findData.f2A_creds && findData.f2A_creds.state == true) {
      return APIRes.getErrorResult("Already secret key exist", res);
    }
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
};

//2fa verify secret
exports.verifySecret = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId } = req.user;
    let userInput = Utils.getReqValues(req);
    const user = await AdminUser.findOne({ _id: userId }).lean();
    if (!userInput.token) {
      return APIRes.getErrorResult("required token", res);
    }
    const { base32: secret } = user.f2A_creds.temp_secret;
    const verified = await speakeasy.totp.verify({ secret: secret, encoding: "base32", token: userInput.token });
    if (verified) {
      if (user?.f2A_creds?.state === false) {
        const updateData = await AdminUser.findOneAndUpdate({ _id: userId }, { "f2A_creds.state": true, f2A_enable: true, twofa: "google_otp", f2a_type: 0, }, { new: true });
        var respBody = { verified: true };
        return APIRes.getMessageResult(respBody, "success", res);
      } else if (userInput?.revoke) {
        const updateData = await AdminUser.findOneAndUpdate({ _id: userId }, { f2A_enable: false }, { new: true });
        const deleteData = await AdminUser.findOneAndUpdate({ _id: userId }, { $unset: { f2A_creds: 1, f2a_type: 1 } }, { new: true });
        var respBody = { verified: false };
        return APIRes.getMessageResult(respBody, "success", res);
      } else {
        return APIRes.getNotExistsResult("Already enabled", res);
      }
    } else {
      return APIRes.getNotExistsResult("Invalid code", res);
    }
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}

exports.afterSecret = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    // const { userId } = req.user;
    let userInput = Utils.getReqValues(req);
    const user = await AdminUser.findById({ _id: userId });
    if (!userInput.token) {
      return APIRes.getErrorResult("required token", res);
    }
    if (!userInput.userid) {
      return APIRes.getErrorResult("required userid", res);
    }
    if (!user.f2A_enable) {
      return APIRes.getNotExistsResult("2fa not enabled", res);
    }
    if (!user.f2A_creds) {
      return APIRes.getNotExistsResult("2fa not enabled nd generate secret key", res);
    }
    const { base32: secret } = user.f2A_creds.temp_secret;
    const verified = await speakeasy.totp.verify({ secret: secret, encoding: "base32", token: userInput.token });
    if (verified) {
      var respBody = { verified: true };
      return APIRes.getMessageResult(respBody, "success", res);
    } else {
      return APIRes.getNotExistsResult("Invalid code", res);
    }
  } catch (error) {
    console.error(error);
    return APIRes.getErrorResult(error, res);
  }
};

//reset admin password
exports.resetPassword = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    const { userId, userRole } = req.user;
    const user = await AdminUser.findById({ _id: userInput.userid });
    if (userRole !== "SUPERADMIN") {
      return APIRes.getErrorResult("super Admin only can chanage password", res);
    }
    if (!userInput.userid) {
      return APIRes.getErrorResult("required userid", res);
    }
    if (!userInput.password) {
      return APIRes.getErrorResult("required password", res);
    }
    if (!user) {
      return APIRes.getErrorResult("user not found", res);
    } else {
      const find = await AdminUser.findById({ _id: userInput.userid })
      if (find && find.roleType === "ADMIN") {
        let password = await Utils.password(userInput.password);
        const update = await AdminUser.updateOne({ _id: userInput.userid }, { $set: { password: password, is_first_log: true } }, { new: true });
        return APIRes.getSuccessResult("Password change successfully", res)
      } else {
        return APIRes.getErrorResult("User not found", res);
      }
    }
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}

//token added by admin
exports.adminTokenCredit = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    const { userId, userRole } = req.user;
    if (!(userRole == "ADMIN" || userRole == "SUPERADMIN")) {
      return APIRes.getErrorResult("Invalid role Type", res);
    }
    if (!userInput.userid) {
      return APIRes.getErrorResult("required userid", res);
    }
    if (!userInput.no_of_token) {
      return APIRes.getErrorResult("required number of token", res);
    }
    const adminToken = await adminWalletModel.findOne();
    const wallet = await walletModel.findOne({ user_id: userInput.userid }).populate('user_id').lean();
    if (wallet) {
      if (adminToken.balance > userInput.no_of_token) {
        let balance = parseInt(adminToken.balance) - parseInt(userInput.no_of_token)
        const update = await adminWalletModel.findOneAndUpdate({ _id: adminToken._id }, { $set: { balance: balance } }, { new: true });
        const user = await walletModel.findOneAndUpdate({ user_id: userInput.userid }, { "$inc": { balance: userInput.no_of_token } }, { new: true });
        let deviceIds = [];
        let alreadyDeviceSaved = await deviceModel.findOne({
        user_id: userInput.userid 
        });
        message = `Dear ${wallet.user_id.name}, Your ${process.env.APP_NAME}  App Token has been credited with ${parseFloat(userInput.no_of_token)}LWIN  from Admin side on ${moment(Date.now()).tz('Asia/Kolkata').format('llll')} The Available LWIN Token is ${parseFloat(user.balance)}LWIN`;
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
        const overall = await overAllTransaction(userInput.userid, null, 'CREDIT', parseFloat(userInput.no_of_token), wallet.balance, user.balance, "admin", "admin", userId, "credit token admin to user", userInput.no_of_token, null);
        return APIRes.getSuccessResult("Token transfer successfully!", res);
      } else {
        return APIRes.getErrorResult("Insufficient token", res);
      }
    } else {
      return APIRes.getErrorResult("Wallet not found", res);
    }
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
}

exports.adminTokenDebit = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    const { userId, userRole } = req.user;
    if (!(userRole == "ADMIN" || userRole == "SUPERADMIN")) {
      return APIRes.getErrorResult("Invalid role Type", res);
    }
    if (!userInput.userid) {
      return APIRes.getErrorResult("required userid", res);
    }
    if (!userInput.no_of_token) {
      return APIRes.getErrorResult("required number of token", res);
    }
    const userToken = await walletModel.findOne({ user_id: userInput.userid }).populate('user_id').lean();
    const adminToken = await adminWalletModel.findOne().lean()
    if (userToken) {
      if (userToken.balance > userInput.no_of_token) {
        let balance = parseInt(userToken.balance) - parseInt(userInput.no_of_token);
        const adminUpdate = await adminWalletModel.findOneAndUpdate({ _id: adminToken._id }, { "$inc": { balance: userInput.no_of_token } }, { new: true })
        // const overall = await overAllTransaction(userInput.userid,null,'DEBIT',userInput.no_of_token,userToken.balance,wall,actionfrom="admin",updatefrom="admin",actionid=adminToken._id,remark=null,credit=null,debit=null)
        if (!adminUpdate) {
          return APIRes.getErrorResult("invalid admin wallet", res);
        }
        const user = await walletModel.findOneAndUpdate({ user_id: userInput.userid }, { $set: { balance: balance } }, { new: true });
        let deviceIds = [];
        let alreadyDeviceSaved = await deviceModel.findOne({
        user_id: userInput.userid 
        });
        message = `Dear ${userToken.user_id.name}, Your ${process.env.APP_NAME}  App Token has been debited with ${parseFloat(userInput.no_of_token)}LWIN  from Admin side on ${moment(Date.now()).tz('Asia/Kolkata').format('llll')} The Available LWIN Token is ${parseFloat(user.balance)}LWIN`;
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
        const overall = await overAllTransaction(userInput.userid, null, 'DEBIT', parseFloat(userInput.no_of_token), userToken.balance, user.balance, "admin", "admin", userId, "debit token user to admin", null, userInput.no_of_token);
        console.log(overall);
        return APIRes.getSuccessResult("Token transfer successfully!", res);
      } else {
        return APIRes.getErrorResult("Insufficient token", res);
      }
    } else {
      return APIRes.getErrorResult("Wallet not found", res);
    }
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
}
exports.listAdminWallet = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId, userRole } = req.user;
    let userInput = Utils.getReqValues(req);
    let whereCodn = {};
    if (!(userRole == "ADMIN" || userRole == "SUPERADMIN")) {
      return APIRes.getErrorResult("Invalid role Type", res);
    }
    if (userInput._id) {
      whereCodn._id = userInput._id;
    }
    const listedData = await adminWalletModel.find(whereCodn).lean();
    return APIRes.getMessageResult(listedData, "fetch data successfully", res);

  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}

exports.updateAdminWallet = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId, userRole } = req.user;
    let userInput = Utils.getReqValues(req);
    let whereCodn = {};
    if (!(userRole == "ADMIN" || userRole == "SUPERADMIN")) {
      return APIRes.getErrorResult("Invalid role Type", res);
    }
    if (!userInput._id) {
      return APIRes.getErrorResult("required admin wallet id", res);
    }
    if (userInput._id) {
      whereCodn._id = userInput._id;
    }
    delete userInput._id;
    let updateQuery = {
      $set: userInput,
    };
    const editedData = await adminWalletModel.findByIdAndUpdate(whereCodn, updateQuery, { new: true });
    editedData.msg = "Update successfully!"
    return APIRes.getSuccessResult(editedData, res)
    // return APIRes.getMessageResult(listedData, "fetch data successfully", res);

  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}

exports.adminDetails = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    let whereCodn = {};
    const AdminWalletData = await adminWalletModel.find().lean();
    const userData = await userModel.find().lean();
    const AssetData = await AssetModel.find().lean();
    const AdminData = await AdminUser.find().lean();
    const transactionData = await TransactionModel.find().lean();
    const withdrawnData = await WithdrawModel.find().lean();
    const MatchData = await MatchModel.find().lean();
    var data;
    if (AdminWalletData?.length === 1) {
      data = Object.assign({}, ...AdminWalletData);
    }
    let users = {
      "user": userData.length,
      "asset": AssetData.length,
      "admin": AdminData.length,
      "admin_wallet": data,
      "transaction": transactionData,
      "withdrawn": withdrawnData,
      "Match_list": MatchData
    };

    return APIRes.getMessageResult(users, "fetch data successfully", res);

  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}



exports.updateDocument = async(req,res)=>{
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId, userRole } = req.user;
    let userInput = Utils.getReqValues(req);

// const descriptionData = userInput.description.replace(/<!--[\s\S]*?-->/gm,"")
// .replace(/^(\s+)?|(\s+)?$/gm,"")
// .replace(/\r|\n/g,"");


if(!userInput.name){
  return APIRes.getErrorResult("Require name", res);
}
if(!userInput.key){
  return APIRes.getErrorResult("Require key", res);
}
if(!userInput.description){
  return APIRes.getErrorResult("Require description", res);
}

let whereId = {}
let whereCodn ={}
if(userInput.name){
whereId.name = userInput.name
}

if(userInput.description){
 whereCodn.description = userInput.description.replace(/&lt;/gi, "<").replace(/&nbsp;/gi, " ").replace(/&amp;/gi, "&").replace(/&quot;/gi, `"`).replace(/&gt;/gi, ">")
}

if(userInput.key){
  whereCodn.key = userInput.key
}

const updateQuery = {
  $set:whereCodn
}


 const updateData = await siteModel.findOneAndUpdate(whereId,updateQuery,{new:true,upsert:true})


    return APIRes.getMessageResult(updateData, "fetch data successfully", res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}

exports.getDocument = async (req, res) => {
  try {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw errors.array()
    }
    const { userId, userRole } = req.user
    let userInput = Utils.getReqValues(req)
    let whereCodn = {}

    if (userInput.key) {
      whereCodn.key = userInput.key
    }

    const getData = await siteModel.find(whereCodn).lean()

    getData.msg = 'fetch data successfully'
    return APIRes.getSuccessResult(getData, res)
  } catch (error) {
    return APIRes.getErrorResult(error, res)
  }
}
exports.createNotification = async(req,res)=>{
  try {
    let errors = validationResult(req)
    if (!errors.isEmpty()) {
      throw errors.array()
    }
    const { userId, userRole } = req.user
    let userInput = Utils.getReqValues(req)
    let whereCodn = {}
    if(userInput.match_id){
    whereCodn.match_key = userInput.match_id;
    }
    let deviceIds = [];
    const MatchData = await matchModel.findOne(whereCodn).lean();
    let deviceInfo = await deviceModel.find({pushenabled:true}).exec();
    console.log(moment(parseInt(MatchData.start_at) * 1000).format('llll'),MatchData.start_at)
    let message = `${MatchData.teams.a.code} vs${MatchData.teams.b.code} Time for victory! The ${MatchData.title} ${moment(parseInt(MatchData.start_at*1000 )).tz('Asia/Kolkata').format('llll')} deadline is alomost here! Have you created your bet yet?`;
    deviceInfo.forEach(async function (deviceData) {
      if(deviceData.pushenabled && deviceData.push_token !=''){        
        deviceIds.push(deviceData.push_token);
      }
    });
  
    if (deviceIds.length > 0) {
      msgData = {};
     const getData= await sendNotification(deviceIds, message, msgData);
      getData.msg = 'fetch data successfully'
      return APIRes.getSuccessResult(getData, res)
    }

    // return APIRes.getSuccessResult(getData, res);
  } catch (error) {
    console.log(error)
    return APIRes.getErrorResult(error, res);
  }
}

