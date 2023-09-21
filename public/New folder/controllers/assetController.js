const Utils = require("../helpers/utils");
const APIRes = require("../helpers/result");
const { signAccessToken, signToken, signRefreshToken, verifyRefreshToken, verifyPassword, authenticateToken, } = require("../middleware/auth");
const { validationResult } = require("express-validator");
const assetModel = require('../models/assetModel');

module.exports.createAsset = async (req, res) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw errors.array();
      }
      let userInput = Utils.getReqValues(req);
      const {symbol} =userInput.symbol;
      const findData = await assetModel.findOne({symbol:symbol});
      if (findData) {
      return APIRes.getErrorResult("Coin Already exist", res);
      }else{
      const createdData = await assetModel.create(userInput);
      createdData.msg = "Asset added successfully!"
      return APIRes.getSuccessResult(createdData, res)
      }
    } catch (err) {
      console.log("Error in createWallet:", err);
      return APIRes.getErrorResult(err, res);
    }
  };

  module.exports.editAsset = async (req, res) => {
    try {
      let userInput = Utils.getReqValues(req);
      let whereCodn = {};
      const { userId ,userRole} = req.user;
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw errors.array();
      }
      if(userRole !=="SUPERADMIN"){
        return APIRes.getErrorResult("Invalid token provide a super admin token", res);
      }
      if (!userInput._id) {
        return APIRes.getErrorResult("required asset id", res);
        }
       if (userInput._id) {
        whereCodn._id = userInput._id;
      }
      delete userInput._id;
      let updateQuery = {
        $set: userInput,
      };
      const editedData = await assetModel.findByIdAndUpdate( whereCodn,updateQuery,{ new: true });
      // editedData.msg = "asset update successfully!"
      return APIRes.getMessageResult(editedData,"Asset update successfully!", res)
    } catch (err) {
      return APIRes.getErrorResult(err, res);
    }
  };

  exports.listAsset = async (req, res) => {
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
      const listedData = await assetModel.find(whereCodn).sort({ created: "DESC" }).lean();
      listedData.msg ="fetch data successfully!";
      return APIRes.getSuccessResult(listedData, res);
    } catch (error) {
      return APIRes.getErrorResult(error, res);
    }
  };
