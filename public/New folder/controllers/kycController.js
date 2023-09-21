const Utils = require("../helpers/utils");
const APIRes = require("../helpers/result");
const { signAccessToken,signToken,signRefreshToken,verifyRefreshToken,verifyPassword,authenticateToken,} = require("../middleware/auth");
const { validationResult } = require("express-validator");
const kycModel =require('../models/kycModel')
const userModel = require('../models/appuserModel')

exports.createKyc = async (req,res,next)=>{
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw errors.array();
        } 
        var userInput = Utils.getReqValues(req); 
        const {userId} =req.user; 
        const findData = await kycModel.findOne({userId:userId})
        if(findData){
            return APIRes.getErrorResult("already created kyc", res);
        }else{
        userInput.userId = userId;
        let updateData = await userModel.findByIdAndUpdate({_id:userId},{$set:{kyc_status:1}},{new:true})
        let result = await kycModel.create(userInput);
        result.msg ="kyc added successfully!"
        return APIRes.getSuccessResult(result,res) 
        }
    } catch (error) {
        return APIRes.getErrorResult(error, res);   
    }
}
exports.listKyc = async (req, res) => {
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
      const listedData = await kycModel.find(whereCodn).populate('userId','email phoneNumber f2A_enable kyc_status email_verify mobile_verify createdAt').sort({ created: "DESC" }).lean();
      return APIRes.getMessageResult(listedData, "success", res);
    } catch (error) {
      return APIRes.getErrorResult(error, res);
    }
  };
  
  exports.updateKyc = async (req, res) => {
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
           throw errors.array();
         } 
         const {userId} = req.user;
         let userInput = Utils.getReqValues(req);
         if(!userInput.kycId){
            return APIRes.getErrorResult("required kyc id", res);
        }
        const user = await userModel.findById({_id:userId});
        if(!user){
            return APIRes.getErrorResult("user not found", res); 
        }else{
            const find = await kycModel.findById({_id:userInput.kycId})
            if(find){
                delete userId;
                const update = await kycModel.findByIdAndUpdate({_id:find._id},{$set:userInput},{new:true});
                return APIRes.getSuccessResult("update successfully",res) 
            }else{
                return APIRes.getErrorResult("kyc data not found", res);   
            }
        }
    } catch (error) {
        return APIRes.getErrorResult(error, res);
    }
  }