const Utils = require("../helpers/utils");
const APIRes = require("../helpers/result");
const { validationResult } = require("express-validator");
const tokenModel =require('../models/tokenModel')


exports.createToken = async (req,res,next)=>{
    try {
        let errors = validationResult(req);
        if (!errors.isEmpty()) {
          throw errors.array();
        } 
        var userInput = Utils.getReqValues(req); 
        const findData = await tokenModel.find()
        if(findData && findData.length <0){
            return APIRes.getErrorResult("already created token", res);
        }else{
        var result = await tokenModel.create(userInput);
        result.msg ="Token added successfully!"
        return APIRes.getSuccessResult(result,res) 
        }
    } catch (error) {
        return APIRes.getErrorResult(error, res);   
    }
}
exports.listToken = async (req, res) => {
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
      const listedData = await tokenModel.find(whereCodn);
      return APIRes.getMessageResult(listedData, "success", res);
    } catch (error) {
      return APIRes.getErrorResult(error, res);
    }
  };
