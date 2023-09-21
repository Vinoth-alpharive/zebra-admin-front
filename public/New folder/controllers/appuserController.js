const Utils = require("../helpers/utils");
const APIRes = require("../helpers/result");
const { signAccessToken, signToken, signRefreshToken, verifyRefreshToken, verifyPassword, authenticateToken, } = require("../middleware/auth");
const AppUser = require("../models/appuserModel");
const { validationResult } = require("express-validator");
const { sendEmail } = require("../helpers/mailer");
const { sendSMS, sendForgotSMS } = require("../helpers/sms");
const ejs = require("ejs");
const speakeasy = require("speakeasy");
const generateUniqueId = require("generate-unique-id");
const DeviceInfo = require('../models/deviceModel');
const moment = require('moment')
const mongoose = require('mongoose')
const {generateUsersAddress}= require('./addressController')
const siteModel = require('../models/siteModel')
//register user create function 
exports.createAppUser = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    if (!userInput.signup_type) {
      return APIRes.getErrorResult("required signup type", res);
    }
    switch (parseInt(userInput.signup_type)) {
      case 1:
        try {
          if (!userInput.email) {
            return APIRes.getErrorResult("required email", res);
          }
          if (!userInput.name) {
            return APIRes.getErrorResult("required name", res);
          }
          if (!userInput.password) {
            return APIRes.getErrorResult("required password", res);
          }
          const findData = await AppUser.findOne({ email: userInput.email });
          const emailVerificationCode = generateUniqueId({ length: 5, useLetters: false });
          const referral_id = generateUniqueId({ length: 6, useLetters: true, includeSymbols: ["#"], excludeSymbols: ["0"] });
          const body_html = await ejs.renderFile("./views/email/email.ejs", { name: userInput.email, siteurl: process.env.SITE_URL, token: emailVerificationCode });
          emailParam = { senderAddress: process.env.MAIL_FROM_NAME + "<" + process.env.MAIL_FROM_ADDRESS + ">", toAddress: userInput.email, subject: "Welcome to  Gaming", body_html: body_html };
          if (findData) {
            if (findData.email_verify === false) {
              let timeDiff;
              if (findData) {
                  const diff = new Date() -findData.updatedAt;
                  timeDiff = diff / 60000;
                } else {
                  timeDiff = 2;
                }
                if (timeDiff < 1) {
                return APIRes.getErrorResult("wait for a minute to get otp", res);
                } else {
              // const deleted = await AppUser.findOneAndDelete({_id:findData._id});
              let updateData = {};
              if(userInput.referral_id){
                const find = await AppUser.aggregate([{ '$match': {'parent_id': userInput.referral_id}}])
                if(find && find.length > 0){
                  updateData.referral_id = userInput.referral_id;
                }else{
                  return APIRes.getErrorResult("Invalid referral id", res); 
                }
              }
              let response = await sendEmail(emailParam);
              updateData.emailVerificationCode = emailVerificationCode;
              const appUser = await AppUser.findOneAndUpdate({ email: userInput.email }, updateData, { new: true });
              var result = await AppUser.findOne({ email: findData.email }).select('signup_type email email_verify');
              // result.msg = "Email code sent successfully!"
              return APIRes.getMessageResult(result,"Email code sent successfully!",res)
              }
            } else {
              return APIRes.getErrorResult("Email already registered", res)
            }
          } else {
            let response = await sendEmail(emailParam);
            const saveData = {};
            saveData.email = userInput.email.toLowerCase();
            saveData.password = await Utils.password(userInput.password);
            saveData.signup_type = 1;
            saveData.emailVerificationCode = emailVerificationCode;
            saveData.parent_id = referral_id;
            saveData.name = userInput.name;
            if(userInput.referral_id){
              const findData = await AppUser.aggregate([{ '$match': {'parent_id': userInput.referral_id}}])
              if(findData && findData.length > 0){
                saveData.referral_id = userInput.referral_id;
              }else{
                return APIRes.getErrorResult("Invalid referral id", res); 
              }
            }
            const appUser = await AppUser.create(saveData);
            var result = await AppUser.findOne({ email: appUser.email }).select('signup_type email email_verify');
            // result.msg = "Email code sent successfully!"
            return APIRes.getMessageResult(result,"Email code sent successfully!" ,res)
          }
        } catch (error) {
          console.log(error);
          return APIRes.getErrorResult(error, res);
        }
        break;
      case 2:
        try {
          if (!userInput.phoneNumber) {
            return APIRes.getErrorResult("required phone number", res);
          }
          if (!userInput.password) {
            return APIRes.getErrorResult("required password", res);
          }
          if(!userInput.name){
            return APIRes.getErrorResult("required name", res);
          }
          const user = await AppUser.findOne({ phoneNumber: userInput.phoneNumber });
          const verify_id = generateUniqueId({ length: 5, useLetters: false });
          const referral_id = generateUniqueId({ length: 6, useLetters: true, includeSymbols: ["#"], excludeSymbols: ["0"] });
          if (user) {
            if (user.mobile_verify === false) {
              let timeDiff;
              if (user) {
                  const diff = new Date() -user.updatedAt;
                  timeDiff = diff / 60000;
                } else {
                  timeDiff = 2;
                }
                if (timeDiff < 1) {
                return APIRes.getErrorResult("wait for a minute to get otp", res);
                } else {
                //   const deleted = await AppUser.findOneAndDelete({_id:user._id});
                // }
                let updateData = {};
                if(userInput.referral_id){
                  const find = await AppUser.aggregate([{ '$match': {'parent_id': userInput.referral_id}}])
                  if(find && find.length > 0){
                    updateData.referral_id = userInput.referral_id;
                  }else{
                    return APIRes.getErrorResult("Invalid referral id", res); 
                  }
                }
              const message = await sendSMS(verify_id, userInput.phoneNumber);
              if (message) {
                updateData.mobileVerificationCode = verify_id;
                const appUser = await AppUser.findOneAndUpdate({ phoneNumber: userInput.phoneNumber }, updateData, { new: true });
                var result = await AppUser.findOne({ phoneNumber: appUser.phoneNumber }).select('signup_type phoneNumber mobile_verify');
                // result.msg = "mobile code sent successfully!"
                return APIRes.getMessageResult(result,"mobile code sent successfully!" ,res)
              }
            }
            } else {
              return APIRes.getErrorResult("mobile already verified", res)
            }
          } else {
            const message = await sendSMS(verify_id, userInput.phoneNumber);
            if (message) {
              const saveData = {};
              saveData.phoneNumber = userInput.phoneNumber;
              saveData.password = await Utils.password(userInput.password);
              saveData.signup_type = 2;
              saveData.verificationCode = verify_id;
              saveData.parent_id = referral_id;
              saveData.name = userInput.name;
              if(userInput.referral_id){
                const findData = await AppUser.aggregate([{ '$match': {'parent_id': userInput.referral_id}}])
                if(findData && findData.length > 0){
                  saveData.referral_id = userInput.referral_id;
                }else{
                  return APIRes.getErrorResult("Invalid referral id", res); 
                }
              }
              const appUser = await AppUser.create(saveData);
              var result = await AppUser.findOne({ phoneNumber: appUser.phoneNumber }).select('signup_type phoneNumber mobile_verify');
              // result.msg = "mobile code sent successfully!"
              return APIRes.getMessageResult(result,"mobile code sent successfully!" ,res)
            }
          }
        } catch (error) {
          console.log(error);
          return APIRes.getErrorResult(error, res);
        }

        break;
      default:
        return APIRes.getErrorResult("bad request", res);
        break;
    }
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
}

//register user verify function
exports.verifyAppUser = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    if (!userInput.signup_type) {
      return APIRes.getErrorResult("required signup type", res);
    }
    switch (parseInt(userInput.signup_type)) {
      case 1:
        try {
          if (!userInput.email) {
            return APIRes.getErrorResult("required email", res);
          }
          if (!userInput.emailVerificationCode) {
            return APIRes.getErrorResult("required email verification code", res);
          }
          const user = await AppUser.findOne({ email: userInput.email });
          if (user) {
            if (user.email_verify === false) {
              if (user.emailVerificationCode === parseInt(userInput.emailVerificationCode)) {
                let updateData = {};
                updateData.emailVerifiedAt = new Date();
                updateData.email_verify = true;
                if (userInput.referral_id) {
                  updateData.referral_id = userInput.referral_id;
                }
                const appUser = await AppUser.findOneAndUpdate({ email: userInput.email }, updateData, { new: true });
                var result = await AppUser.findOne({ email: appUser.email }).select('signup_type email email_verify name');
                // result.msg = "Register successfully!"
                return APIRes.getMessageResult(result,"Register successfully!", res)
              } else {
                return APIRes.getErrorResult("Verification code not valid!", res);
              }
            } else {
              return APIRes.getErrorResult("Email already exist", res);
            }
          } else {
            return APIRes.getErrorResult("Invalid user", res);
          }
        } catch (error) {
          console.log(error);
          return APIRes.getErrorResult(error, res);
        }
        break;
      case 2:
        try {
          if (!userInput.phoneNumber) {
            return APIRes.getErrorResult("required phone number", res);
          }
          if (!userInput.mobileVerificationCode) {
            return APIRes.getErrorResult("required mobile verification code", res);
          }
          const user = await AppUser.findOne({ phoneNumber: userInput.phoneNumber });
          if (user) {
            if (user.mobile_verify === false) {
              if (user.mobileVerificationCode === parseInt(userInput.mobileVerificationCode)) {
                let updateData = {};
                updateData.mobileVerifiedAt = new Date();
                updateData.mobile_verify = true;
                if (userInput.referral_id) {
                  updateData.referral_id = userInput.referral_id;
                }
                const appUser = await AppUser.findOneAndUpdate({ phoneNumber: userInput.phoneNumber }, updateData, { new: true });
                var result = await AppUser.findOne({ phoneNumber:user.phoneNumber }).select('signup_type phoneNumber mobile_verify name');
                //result.msg = "Register successfully!";
                return APIRes.getMessageResult(result, "Register successfully!",res)
              } else {
                return APIRes.getErrorResult("Verification code not valid!", res);
              }
            } else {
              return APIRes.getErrorResult("Phone Number already exist", res);
            }
          } else {
            return APIRes.getErrorResult("Invaild user", res);
          }
        } catch (error) {
          console.log(error);
          return APIRes.getErrorResult(error, res);
        }
        break;
      default:
        return APIRes.getErrorResult("bad request", res);
        break;
    }
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}

//login after email verify function
exports.login = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    var userId;
    if (!userInput.signin_type) {
      return APIRes.getErrorResult("required signin type", res);
    }
    if (!userInput.push_token) {
      return APIRes.getErrorResult("required push token", res);
    }
    switch (parseInt(userInput.signin_type)) {
      case 1:
        try {
          if (!userInput.email) {
            return APIRes.getErrorResult("required email", res);
          }
          if (!userInput.password) {
            return APIRes.getErrorResult("required password", res);
          }
          const user = await AppUser.findOne({ email: userInput.email.toLowerCase() });
          if (!user) {
            return APIRes.getErrorResult("Invalid email", res);
          } else if (!(await verifyPassword(userInput.password, user.password))) {
            return APIRes.getErrorResult("Invalid password", res);
          } else if (user.email_verify === false) {
            return APIRes.getErrorResult("email not verified", res);
          } else {
            userId = user.id;
          }
        } catch (error) {
          return APIRes.getErrorResult(error, res);
        }
        break;
      case 2:
        try {
          if (!userInput.phoneNumber) {
            return APIRes.getErrorResult("required phone number", res);
          }
          if (!userInput.password) {
            return APIRes.getErrorResult("required password", res);
          }
          const user = await AppUser.findOne({ phoneNumber: userInput.phoneNumber });
          if (!user) {
            return APIRes.getErrorResult("Invalid phone number", res);
          } else if (!(await verifyPassword(userInput.password, user.password))) {
            return APIRes.getErrorResult("Invalid password", res);
          } else if (user.mobile_verify === false) {
            return APIRes.getErrorResult("mobile not verified", res);
          } else {
            userId = user.id;
          }
        } catch (error) {
          return APIRes.getErrorResult(error, res);
        }
        break;
      default:
        return APIRes.getErrorResult("bad request", res);
        break;
    }
  
    if (userInput && userInput.push_token) {
      const alreadyDeviceSaved = await DeviceInfo.findOne({ user_id: userId });
      if (!alreadyDeviceSaved) {
        var deviceDetails = { 
          push_token: userInput.push_token,
          os_version: userInput.os_version,
          device_model: userInput.device_model,
          os_type: userInput.os_type,
          user_id: userId };
        const deviceInfo = new DeviceInfo(deviceDetails);
        const result = await deviceInfo.save();

      } else {
        const params = {
          $set: {
            push_token: userInput.push_token,
            os_version: userInput.os_version,
            device_model: userInput.device_model,
            os_type: userInput.os_type,
          },
        };
        const updateData = await DeviceInfo.findByIdAndUpdate(alreadyDeviceSaved._id, params, { new: true });
      }
    }
    const isAdrs = await AppUser.findById({ _id: userId });
    // if(!isAdrs.f2A_enable)
    const accessToken =  !isAdrs.f2A_enable?await signAccessToken(userId, "User"):"";
    const refreshToken = !isAdrs.f2A_enable?await signRefreshToken(userId, "User"):"";
    const deviceInfoData = await DeviceInfo.findOne({ user_id: userId });
    if(isAdrs.is_address===false){
      const ethAdrs = await generateUsersAddress(userId,"eth");
      const updateData = await AppUser.findByIdAndUpdate(userId,{is_address:true}, { new: true });
      }
    let result={};
    const resp= await AppUser.findById({ _id: userId }).select('email email_verify mobile mobile_verify f2A_enable twofa name').lean();
    result._id= await resp._id;
    result.email= await resp.email;
    result.name = await resp.name;
    result.twofa = await resp.twofa;
    result.email_verify = await resp.email_verify;
    result.mobile_verify= await resp.mobile_verify;
    result.f2A_enable = await resp.f2A_enable;
    result.phoneNumber= await resp.phoneNumber;
    result.accessToken =await  accessToken;
    result.refreshToken = await refreshToken;
    result.deviceInfoData = await deviceInfoData;

    return APIRes.getMessageResult(result,"login successfully!", res)
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}

//logout user
exports.logout = async (req, res, next) => {

  let errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw errors.array();
  }
  const { userId } = req.user;
  try {
    const userDevice = await DeviceInfo.findOne({ user_id: userId });
    if (userDevice) {
      userDevice.push_token = "";
      userDevice.os_version = "";
      userDevice.device_model = "";
      userDevice.os_type = "";
      console.log(userDevice);
      await userDevice.save();
      console.log(await userDevice.save())
      return APIRes.getSuccessResult("logout successfully", res)
    }
  
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};
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
    const user = await AppUser.findById({ _id: userInput.userid });
    if (!user) {
      return APIRes.getErrorResult("user not found", res);
    }
    //  else if (!user.active) {
    //   return next(new AppError("Account has been deactivated ", 401));
    // }
    let isValidToken = await verifyRefreshToken(userInput.token);
    if (isValidToken) {
      const accessToken = await signAccessToken(user.id, "User");
      const refreshToken = await signRefreshToken(user.id, "User");
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

//forgot password
exports.forgotPassword = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    var userId;
    if (!userInput.signin_type) {
      return APIRes.getErrorResult("required signin type", res);
    }
    const verify_id = generateUniqueId({ length: 5, useLetters: false });
    switch (parseInt(userInput.signin_type)) {
      case 1:
        try {
          if (!userInput.email) {
            return APIRes.getErrorResult("required email", res);
          }
          const user = await AppUser.findOne({ email: userInput.email });
          if (!user) {
            return APIRes.getErrorResult("Invalid email", res);
          } else if (user.email_verify === false) {
            return APIRes.getErrorResult("email not verified", res);
          } else {
            const body_html = await ejs.renderFile("./views/email/reset-otp.ejs", { name: userInput.email, siteurl: process.env.SITE_URL, token: verify_id });
            emailParam = { senderAddress: process.env.MAIL_FROM_NAME + "<" + process.env.MAIL_FROM_ADDRESS + ">", toAddress: userInput.email, subject: "Forgot Password Gaming",body_html: body_html }
            let response = await sendEmail(emailParam);
            if (response) {
              const findData = await AppUser.findOneAndUpdate(
                { email: userInput.email },
                { $set: { forgot_otp: verify_id, otpExpire: moment(new Date()).add(5, "minutes") } },
                { new: true }
              );
              return APIRes.getSuccessResult("mail send successfully!", res)
            }
          }
        } catch (error) {
          return APIRes.getErrorResult(error, res);
        }
        break;
      case 2:
        try {
          if (!userInput.phoneNumber) {
            return APIRes.getErrorResult("required phone number", res);
          }
          const user = await AppUser.findOne({ phoneNumber: userInput.phoneNumber });
          if (!user) {
            return APIRes.getErrorResult("Invalid phone number", res);
          } else if (user.mobile_verify === false) {
            return APIRes.getErrorResult("mobile not verified", res);
          } else {
            const userId = user.id;
            const message = await sendForgotSMS(verify_id, userInput.phoneNumber);
            if (message) {
              const findData = await AppUser.findOneAndUpdate(
                { phoneNumber: userInput.phoneNumber },
                { $set: { forgot_otp: verify_id, otpExpire: moment(new Date()).add(5, "minutes") } },
                { new: true });
              return APIRes.getSuccessResult("sms send successfully!", res)
            }
          }
        } catch (error) {
          return APIRes.getErrorResult(error, res);
        }
        break;
      default:
        return APIRes.getErrorResult("bad request", res);
        break;
    }

  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}

//forgot password verify
exports.forgotPasswordVerify = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    var user = {};
    if (!userInput.signin_type) {
      return APIRes.getErrorResult("required signin type", res);
    }
    switch (parseInt(userInput.signin_type)) {
      case 1:
        try {
          if (!userInput.email) {
            return APIRes.getErrorResult("required email", res);
          }
          if (!userInput.forgot_otp) {
            return APIRes.getErrorResult("required forgot otp", res);
          }
          if (!userInput.password) {
            return APIRes.getErrorResult("required password", res);
          }
          user = await AppUser.findOne({ email: userInput.email });
          if (!user) {
            return APIRes.getNotExistsResult("Email is invalid", res);
          }
        } catch (error) {
          return APIRes.getErrorResult(error, res);
        }
        break;
      case 2:
        try {
          if (!userInput.phoneNumber) {
            return APIRes.getErrorResult("required phone number", res);
          }
          if (!userInput.forgot_otp) {
            return APIRes.getErrorResult("required forgot otp", res);
          }
          if (!userInput.password) {
            return APIRes.getErrorResult("required password", res);
          }
          user = await AppUser.findOne({ phoneNumber: userInput.phoneNumber });
          if (!user) {
            return APIRes.getNotExistsResult("phone number is invalid", res);
          }
        } catch (error) {
          return APIRes.getErrorResult(error, res);
        }
        break;
      default:
        return APIRes.getErrorResult("bad request", res);
        break;
    }
    if (new Date() >= user.otpExpire) {
      return APIRes.getNotExistsResult("Code is expired", res);
    } else {
      if (user.forgot_otp === parseInt(userInput.forgot_otp)) {
        let passwordUpdate = await Utils.password(userInput.password, 12);
        const findData = await AppUser.findByIdAndUpdate(
          { _id: user._id },
          { $set: { password: passwordUpdate } },
          { new: true }
        );
        return APIRes.getSuccessResult("password update successfully", res)
      } else {
        return APIRes.getNotExistsResult("Invalid passcode", res);
      }
    }
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}

//get all users and particular user
module.exports.listUser = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    let whereCodn = {};

    if (userInput._id) {
      whereCodn._id = mongoose.Types.ObjectId(userInput._id);
    }
    const listedData = await AppUser.aggregate([
      {
        '$match': whereCodn
      }, {
        '$lookup': {
          'from': 'wallets', 
          'localField': '_id', 
          'foreignField': 'user_id', 
          'as': 'wallet_info'
        }
      }, {
        '$project': {
          'signup_type': 1, 
          'email': 1, 
          'email_verify': 1, 
          'mobile_verify': 1, 
          'phoneNumber': 1, 
          'coverPicture':1,
          'profilePicture':1,
          'name':1,
          'kyc_status': 1, 
          'status': 1, 
          'is_logged': 1, 
          'parent_id': 1, 
          'f2A_enable': 1, 
          'refered_by': 1, 
          'is_address': 1, 
          'twofa': 1, 
          'createdAt': 1, 
          'wallet_info._id':1,
          'wallet_info.user_id': 1, 
          'wallet_info.asset': 1, 
          'wallet_info.totalToken': 1, 
          'wallet_info.totalGain': 1, 
          'wallet_info.totalLoss': 1, 
          'wallet_info.escrow_balance': 1,
          'wallet_info.createdAt':1,
          'wallet_info.balance':1
        }}
    ])
    return APIRes.getMessageResult(listedData, "success", res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

//2fa create secret
exports.createSecret = async (req, res, next) => {
  try {
    const { userId } = req.user;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const findData = await AppUser.findById({ _id: userId });
    let whereCodn = {};
    if(findData.email){
      whereCodn.name = findData?.email
    } 
    if(findData.phoneNumber) {
      whereCodn.name= findData?.phoneNumber
    }
 
    if (!findData.f2A_enable) {
      const temp_secret = await speakeasy.generateSecret({
        name: "Gaming" +whereCodn.name
      });
      const updateData = await AppUser.findOneAndUpdate(
        { _id: userId },
        { "f2A_creds.state": false, "f2A_creds.temp_secret": temp_secret },
        { new: true }
      );
      if (updateData) {
        return APIRes.getMessageResult({ secret: updateData.f2A_creds.temp_secret.base32,name:whereCodn.name }, "successfully generating secret key", res);
      }
    } else if (findData.f2A_creds && findData.f2A_creds.state == false) {
      return APIRes.getMessageResult({ secret: findData.f2A_creds.temp_secret.base32,name: whereCodn.name }, "successfully generating secret key", res);
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
    const user = await AppUser.findOne({ _id: userId }).lean();
    if (!userInput.token) {
      return APIRes.getErrorResult("required token", res);
    }
    const { base32: secret } = user.f2A_creds.temp_secret;
    const verified = await speakeasy.totp.verify({ secret: secret, encoding: "base32", token: userInput.token });
    if(user.f2A_creds){
    if (verified) {
      if (user?.f2A_creds?.state === false) {
        const updateData = await AppUser.findOneAndUpdate({ _id: userId }, { "f2A_creds.state": true, f2A_enable: true,twofa:"google_otp",f2a_type: 0 ,}, { new: true });
        var respBody = { verified: true };
        return APIRes.getMessageResult(respBody, "success", res);
      } else if (userInput?.revoke) {
        const updateData = await AppUser.findOneAndUpdate({ _id: userId }, { f2A_enable: false ,twofa:""}, { new: true });
        const deleteData = await AppUser.findOneAndUpdate({ _id: userId }, { $unset: { f2A_creds: 1, f2a_type: 1 } }, { new: true });
        var respBody = { verified: false };
        return APIRes.getMessageResult(respBody, "success", res);
      } else {
        return APIRes.getNotExistsResult("Already enabled", res);
      }
    } else {
      return APIRes.getNotExistsResult("Invalid code", res);
    }
  }else{
    return APIRes.getNotExistsResult("not enabled", res);
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
    if (!userInput.userid) {
      return APIRes.getErrorResult("required userid", res);
    }
    const user = await AppUser.findById({ _id: userInput.userid });
    if (!userInput.token) {
      return APIRes.getErrorResult("required token", res);
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
      var respBody = { verified: true, accessToken : user.f2A_enable?await signAccessToken(user.id, "User"):"",refreshToken : user.f2A_enable?await signRefreshToken(user.id, "User"):"" };
      return APIRes.getMessageResult(respBody, "success", res);
    } else {
      return APIRes.getNotExistsResult("Invalid code", res);
    }
  } catch (error) {
    console.error(error);
    return APIRes.getErrorResult(error, res);
  }
};

exports.editUser = async(req,res,next)=>{
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
       throw errors.array();
     } 
     const {userId} = req.user;
     let userInput = Utils.getReqValues(req);
    const user = await AppUser.findById({_id:userId});
    if(!user){
        return APIRes.getErrorResult("user not found", res); 
    }else{
        const find = await AppUser.findById({_id:userId})
        if(find){
            delete userId;
            const update = await AppUser.findByIdAndUpdate({_id:find._id},{$set:userInput},{new:true});
            return APIRes.getSuccessResult("update successfully",res) 
        }else{
            return APIRes.getErrorResult("user data not found", res);   
        }
    }
} catch (error) {
    return APIRes.getErrorResult(error, res);
}
}

//2fa create using email const { userId } = req.user;
exports.create2faEmail = async (req, res, next) => {
  try {
    const { userId } = req.user;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const findData = await AppUser.findById({ _id: userId });
    if(!findData.f2A_enable){
    if(findData.email_verify ===true){
    if (!findData.email_otp || findData.email_otp===undefined) {
      const emailOtp = generateUniqueId({ length: 5, useLetters: false });
      const body_html = await ejs.renderFile("./views/email/email.ejs", { name: findData.email, siteurl: process.env.SITE_URL, token: emailOtp });
      emailParam = { senderAddress: process.env.MAIL_FROM_NAME + "<" + process.env.MAIL_FROM_ADDRESS + ">", toAddress: findData.email, subject: "2fa enable in gaming", body_html: body_html };
      let response = await sendEmail(emailParam);
      const updateData = await AppUser.findOneAndUpdate(
        { _id: userId },
        { "email_otp": emailOtp },
        { new: true }
      );
      if (updateData) {
        return APIRes.getSuccessResult( "successfully generating email secret key", res);
      }
    } else if (findData.email_otp) {
      return APIRes.getSuccessResult("already email secret key exist", res);
    }}else{
      return APIRes.getErrorResult("email not verified", res);
    }
  }else{
    return APIRes.getErrorResult("2fa already enabled", res);
  }
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
};

exports.verify2faEmail = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId } = req.user;
    let userInput = Utils.getReqValues(req);
    const user = await AppUser.findOne({ _id: userId });
    if (!userInput.token) {
      return APIRes.getErrorResult("required token", res);
    }
    if(user.email_otp){
    if (user.email_otp === parseInt(userInput.token) ){
      console.log(user.f2a_type);
      if (user.f2a_type !==1) {
        const updateData = await AppUser.findOneAndUpdate({ _id: userId }, { f2A_enable: true,twofa:"email_otp",f2a_type: 1 ,}, { new: true });
        var respBody = { verified: true };
        return APIRes.getMessageResult(respBody, "success", res);
      } else if (userInput?.revoke) {
        const updateData = await AppUser.findOneAndUpdate({ _id: userId }, { f2A_enable: false,twofa:"" }, { new: true });
        const deleteData = await AppUser.findOneAndUpdate({ _id: userId }, { $unset: {email_otp: 1, f2a_type: 1 } }, { new: true });
        var respBody = { verified: false };
        return APIRes.getMessageResult(respBody, "success", res);
      } else {
        return APIRes.getNotExistsResult("Already enabled", res);
      }
    } else {
      return APIRes.getNotExistsResult("Invalid code", res);
    }
  }else{
    return APIRes.getNotExistsResult("not enabled", res);
  }
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}
exports.after2faEmail = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    // const { userId } = req.user;
    let userInput = Utils.getReqValues(req);
    if (!userInput.userid) {
      return APIRes.getErrorResult("required userid", res);
    }
    const user = await AppUser.findById({ _id: userInput.userid});
    if (!userInput.token) {
      return APIRes.getErrorResult("required token", res);
    }
    if (!user.f2A_enable) {
      return APIRes.getNotExistsResult("2fa not enabled", res);
    }
    if (!user.email_otp) {
      return APIRes.getNotExistsResult("2fa not enabled nd generate secret key", res);
    }
    if (user.email_otp ===parseInt(userInput.token)) {
      var respBody = { verified: true  ,accessToken : user.f2A_enable?await signAccessToken(user.id, "User"):"",refreshToken : user.f2A_enable?await signRefreshToken(user.id, "User"):""};
      return APIRes.getMessageResult(respBody, "success", res);
    } else {
      return APIRes.getNotExistsResult("Invalid code", res);
    }
  } catch (error) {
    console.error(error);
    return APIRes.getErrorResult(error, res);
  }
};

//2fa create using sms
exports.create2faSms = async (req, res, next) => {
  try {
    const { userId } = req.user;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const findData = await AppUser.findById({ _id: userId });
    if(!findData.f2A_enable){
    if(findData.mobile_verify){
    if (!findData.mobile_otp || findData.mobile_otp===undefined) {
      const mobileOtp = generateUniqueId({ length: 5, useLetters: false });
      const message = await sendSMS(mobileOtp, findData.phoneNumber);
      const updateData = await AppUser.findOneAndUpdate(
        { _id: userId },
        { "mobile_otp": mobileOtp },
        { new: true }
      );
      if (updateData) {
        return APIRes.getSuccessResult( "successfully generating email secret key", res);
      }
    } else if (findData.mobile_otp) {
      return APIRes.getSuccessResult("already email secret key exist", res);
    }}else{
      return APIRes.getErrorResult("mobile not verified", res);
    }}else{
      return APIRes.getErrorResult("2fa already enabled", res);
    }
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
};

exports.verify2faSms = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId } = req.user;
    let userInput = Utils.getReqValues(req);
    const user = await AppUser.findOne({ _id: userId }).lean();
    if (!userInput.token) {
      return APIRes.getErrorResult("required token", res);
    }
    if (user.mobile_otp === parseInt(userInput.token) ){
      if (user.f2a_type !==2) {
        const updateData = await AppUser.findOneAndUpdate({ _id: userId }, { f2A_enable: true,twofa:"mobile_otp",f2a_type: 2 }, { new: true });
        var respBody = { verified: true };
        return APIRes.getMessageResult(respBody, "success", res);
      } else if (userInput?.revoke) {
        const updateData = await AppUser.findOneAndUpdate({ _id: userId }, { f2A_enable: false ,twofa:""}, { new: true });
        const deleteData = await AppUser.findOneAndUpdate({ _id: userId }, { $unset: {mobile_otp: 1, f2a_type: 1 } }, { new: true });
        var respBody = { verified: false , accessToken : user.f2A_enable?await signAccessToken(userId, "User"):"",refreshToken : user.f2A_enable?await signRefreshToken(userId, "User"):""};
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

exports.after2faSms = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    //const { userId } = req.user;

    let userInput = Utils.getReqValues(req);
    if (!userInput.userid) {
      return APIRes.getErrorResult("required userid", res);
    }
    const user = await AppUser.findById({ _id: userInput.userid });
    if (!userInput.token) {
      return APIRes.getErrorResult("required token", res);
    }
    if (!user.f2A_enable) {
      return APIRes.getNotExistsResult("2fa not enabled", res);
    }
    if (!user.mobile_otp) {
      return APIRes.getNotExistsResult("2fa not enabled nd generate secret key", res);
    }
    if (user.mobile_otp ===parseInt(userInput.token)) {
      var respBody = { verified: true, accessToken : user.f2A_enable?await signAccessToken(userId, "User"):"",refreshToken : user.f2A_enable?await signRefreshToken(userId, "User"):""};
      return APIRes.getMessageResult(respBody, "success", res);
    } else {
      return APIRes.getNotExistsResult("Invalid code", res);
    }
  } catch (error) {
    console.error(error);
    return APIRes.getErrorResult(error, res);
  }
};

exports.socialLink = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
       throw errors.array();
     } 
    const { userId } = req.user;
    let userInput = Utils.getReqValues(req);
    const findData = await AppUser.findById({ _id: userId });
    let result={}
    result.link = process.env.SITE_URL+findData.referral_id;
    result.msg ="success!";
    return APIRes.getSuccessResult(listedData, "success",res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};




exports.getDocument = async(req,res)=>{
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    
    let userInput = Utils.getReqValues(req);

// const descriptionData = userInput.description.replace(/<!--[\s\S]*?-->/gm,"")
// .replace(/^(\s+)?|(\s+)?$/gm,"")
// .replace(/\r|\n/g,"");

const whereCodn = {}



if(userInput.key){
  whereCodn.key = userInput.key
}

 const getData = await siteModel.findOne(whereCodn).lean()


// getData.msg =  "fetch data successfully"
    return APIRes.getSuccessResult(getData, res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
}