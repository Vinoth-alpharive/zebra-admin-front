const Utils = require("../helpers/utils");
const APIRes = require("../helpers/result");
const walletModel = require('../models/walletModel');
const { validationResult } = require("express-validator");
exports.listWallets = async (req, res) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
         throw errors.array();
       } 
      let userInput = Utils.getReqValues(req);
      const { userId } = req.user;
      let whereCodn = {};
      if (userInput._id) {
        whereCodn._id = userInput._id;
      }
      if (userId) {
        whereCodn.user_id = userId;
      }
      console.log(whereCodn);
      const listedData = await walletModel.find(whereCodn).populate({
        path: 'user_id',
        model: 'AppUsers',
        select: { 'f2A_creds': 0,'password':0,'emailVerificationCode':0,'mobileVerificationCode':0},
      }).sort({ created: "DESC" }).lean();
    //   listedData.msg ="fetch data successfully!";
      return APIRes.getMessageResult(listedData,"fetch data successfully", res);
    } catch (error) {
      return APIRes.getErrorResult(error, res);
    }
  };