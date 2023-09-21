const Utils = require("../helpers/utils");
const APIRes = require("../helpers/result");
const bettingModel = require("../models/bettingModel");
const betInfoModel = require("../models/betnfoModel");
const { validationResult } = require("express-validator");
const walletModel = require("../models/walletModel");
const touranamentModel = require("../models/tournamentModel");
const adminWallet = require('../models/adminWalletModel')
const mongoose = require("mongoose");
const moment = require('moment')
const matchTransactionModel = require('../models/matchTransactionHistory')
const footBallBetModel = require('../models/footballBettingModel')
const footBallBtAmtModel=require('../models/footballBettingAdmin')
const cricketLiveScore = require("../models/cricketLiveScoreModel");

exports.createBetInfo = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    const createGame = await betInfoModel.create(userInput);
    return APIRes.getSuccessResult(createGame, res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

exports.getBetInfo = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId ,userRole} = req.user;

    const getWalletBalance = await walletModel.findOne({user_id:userId})
    console.log(getWalletBalance.balance);

    const listBetInfo= await betInfoModel.find().lean();
   
    return APIRes.getMessageResult(listBetInfo,"success", res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};



exports.createBetting = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId ,userRole} = req.user;
    const userInput = Utils.getReqValues(req);
    let findQuery={};
    findQuery.user_id=userId;
    findQuery.match_id =userInput.match_id;
    if(userInput.no_of_run==="null"){
      userInput.no_of_run=null
    }
    const findData = await bettingModel.findOne(findQuery).lean();
    const tournament = await touranamentModel.findOne({match_id:userInput.match_id})
    const walletData = await walletModel.findOne({
      user_id: userId,
    });
    if (walletData) {
      if (walletData.balance >= userInput.bet_amount) {

        const getUserBetting = await bettingModel.find({
          user_id:userId,
          match_id: userInput?.match_id,
          no_of_ball: userInput.no_of_ball,
          no_of_over: userInput?.no_of_over,
          betting_team_key: userInput.betting_team_key,
        })
        if(getUserBetting?.length===0){
          if (findData && findData!==null) {
            // console.log(findData.betting_limit > findData.betting_count,findData.betting_limit , findData.betting_count);
            if (findData.betting_limit > findData.betting_count) {
              let whereCodn ={};
              whereCodn =userInput;
              whereCodn.user_id = userId;
              whereCodn.betting_count= findData.betting_count+1;
              whereCodn.betting_limit = tournament.bet_limit;
              const updateBalance = await walletModel.findOneAndUpdate({user_id:userId},  { $inc: { balance: - parseFloat(userInput.bet_amount) } },{new:true})
              const updateAdminBalance = await cricketLiveScore.findOneAndUpdate({match_id:userInput?.match_id},{$inc: { totalBetAmount:  parseFloat(userInput.bet_amount) } },{new:true})
 
              const createGame = await bettingModel.create(userInput);
              // console.log(updateBalance);
              const createTransactionObj = {
                user_id:userId,
                type:"DEBIT",
                match_id:userInput.match_id,
                match_name:"cricket",
                no_of_token:userInput.bet_amount,
              availablebalance:updateBalance.balance ,
                oldbalance:updateBalance.balance + userInput.bet_amount,
                no_of_ball:userInput.no_of_ball,
                no_of_over:userInput.no_of_over,
                betting_team:userInput.betting_team_key
              }
              const createMatchTransactionHistory = await matchTransactionModel.create(createTransactionObj)
              return APIRes.getMessageResult(createGame,"Bet created successfully " , res);
            } else {
              return APIRes.getErrorResult("Reached your betting limit", res);
            }
          } else {
            let whereCodn ={};
            whereCodn =userInput;
            whereCodn.user_id = userId;
            whereCodn.betting_count= 1;
            whereCodn.betting_limit = tournament.bet_limit;
            const updateBalance = await walletModel.findOneAndUpdate({user_id:userId},  { $inc: { balance: - parseFloat(userInput.bet_amount) } },{new:true})
             const updateAdminBalance = await cricketLiveScore.findOneAndUpdate({match_id:userInput?.match_id},{$inc: { totalBetAmount:  parseFloat(userInput.bet_amount) } },{new:true})

            const createGame = await bettingModel.create(userInput);
  
  
            const createTransactionObj = {
              user_id:userId,
              type:"DEBIT",
              match_id:userInput.match_id,
              match_name:"cricket",
              no_of_token:userInput.bet_amount,
              availablebalance:updateBalance.balance ,
                oldbalance:updateBalance.balance + userInput.bet_amount,
              no_of_ball:userInput.no_of_ball,
              no_of_over:userInput.no_of_over,
              betting_team:userInput.betting_team_key
            }
            const createMatchTransactionHistory = await matchTransactionModel.create(createTransactionObj)
            return APIRes.getMessageResult(createGame,"Bet created successfully " ,res);
          }
        }else{
          return APIRes.getErrorResult("This user already bet this ball", res);
        }
        
       
      } else {
        return APIRes.getErrorResult("balance not enough", res);
      }
    } else {
      return APIRes.getErrorResult("wallet not found", res);
    }
  
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
};




exports.getBet = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    let whereCodn = {};

    if (userInput.user_id) {
      whereCodn.user_id = userInput.user_id;
    }
    const listBetInfo = await bettingModel.find(whereCodn).lean();
    return APIRes.getMessageResult(listBetInfo,"success", res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};


exports.getMatchBetResult = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    const { userId ,userRole} = req.user
    // const resultData = await bettingModel.find({user_id:userId,status:{"$ne":0}}).lean()
    const resultData = await bettingModel.aggregate(
      [
        [
          {
            '$match': {
              'user_id': require('mongoose').Types.ObjectId(userId)
             
            }
          }, {
            '$group': {
              '_id': '$match_id', 
              'match_name': {
                '$first': '$match_name'
              }
            }
          }, {
            '$lookup': {
              'from': 'matchdetails', 
              'localField': '_id', 
              'foreignField': 'match_key', 
              'as': 'result'
            }
          }, {
            '$unwind': {
              'path': '$result'
            }
          }, {
            '$project': {
              '_id': 1, 
              'match_name': 1, 
              'result.name': 1, 
              'result.start_at': 1, 
              'result.status': 1, 
              'result.title': 1, 
              'result.venue': 1, 
              'result.winner': 1, 
              'result.teams': 1
            }
          },
      { "$sort": { "result.start_at": -1 } }
        ]
      ]
    )
  // console.log(resultData);
    let whereCodn = {};
    whereCodn.result = resultData;
    if (userInput._id) {
      whereCodn._id = userInput._id;
    }
    const getUserWallet = await walletModel.findOne({user_id:userId})
    whereCodn.userBalance = getUserWallet.balance;
    whereCodn.msg="fetch data successfully!"
    return APIRes.getSuccessResult(whereCodn, res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};


exports.getUserBetResult = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    const { userId ,userRole} = req.user
    const resultData = await bettingModel.aggregate([
      {
        '$match': {
          '$and': [
            {
              'match_id': userInput.match_id
            }, {
              'user_id': mongoose.Types.ObjectId(userId)
            }
          ]
        }
      }, {
        '$lookup': {
          'from': 'matchdetails', 
          'localField': 'match_id', 
          'foreignField': 'match_key', 
          'as': 'match_info'
        }
      }, {
        '$unwind': {
          'path': '$match_info'
        }
      }, {
        '$project': {
          'user_id': 1, 
          'bet_amount': 1, 
          'match_name': 1, 
          'winning_price': 1, 
          'no_of_ball': 1, 
          'no_of_over': 1, 
          'createdAt':1,
          'match_info.name': 1, 
          'match_info.title': 1, 
          'match_info.start_at': 1, 
          'match_info.venue': 1, 
          'match_info.format': 1, 
          'match_info.teams': 1, 
          'betting_count': 1, 
          'betting_limit': 1, 
          'ball_action': 1, 
          'ball_action_text': 1,
 'status':1
        }
      }
    ])
    const result = resultData.map((item,i)=>{
      return{
        _id:item?._id,
        user_id:item?.user_id,
        bet_amount:item?.bet_amount,
        match_name:item?.match_name,
        winning_price:item?.winning_price,
        no_of_ball:item?.no_of_ball,
        no_of_over:item?.no_of_over,
        betting_count:item?.betting_count,
        betting_limit:item?.betting_limit,
        ball_action:item?.ball_action,
        ball_action_text:item?.ball_action_text,
        status:item?.status,
        createdAt:moment(item.createdAt).format('x'),
        match_info:item?.match_info,
        title:item?.title,
        venue:item?.venue
      }
    })



    result.msg="fetch data successfully!"
    return APIRes.getSuccessResult(result, res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};


exports.getBetDetailsAfterBet = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    const { userId ,userRole} = req.user
    let whereCodn = {};

    if (userId) {
      whereCodn.user_id = userId;
    }
  if (userInput.match_id) {
      whereCodn.match_id = userInput.match_id;
    }
    if (userInput.no_of_over) {
      whereCodn.no_of_over = userInput.no_of_over;
    }
    if (userInput.no_of_ball) {
      whereCodn.no_of_ball = userInput.no_of_ball;
    }

    if (userInput.betting_team_key) {
      whereCodn.betting_team_key = userInput.betting_team_key;
    }
    const data= await bettingModel.find(whereCodn).lean()
      data.msg = "Fetch Data Successfully"
    return APIRes.getSuccessResult(data, res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

exports.getBetAdmin = async (req, res, next) => {
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
    if (userInput.user_id) {
      whereCodn.user_id =mongoose.Types.ObjectId(userInput.user_id);
    }
   
    const listBetInfo = await bettingModel.aggregate(
      [
        {
          '$match': whereCodn
        },
        {
          '$lookup': {
            'from': 'matchdetails', 
            'localField': 'match_id', 
            'foreignField': 'match_key', 
            'as': 'result'
          }
        }, {
          '$unwind': {
            'path': '$result'
          }
        }, {
          '$lookup': {
            'from': 'appusers', 
            'localField': 'user_id', 
            'foreignField': '_id', 
            'as': 'userInfo'
          }
        }, {
          '$unwind': {
            'path': '$userInfo'
          }
        }, {
          '$project': {
            'result.name': 1, 
            'userInfo.name': 1, 
            'userInfo.email': 1, 
            'userInfo.phoneNumber': 1, 
            'result.start_at': 1, 
            'result.status': 1, 
            'result.title': 1, 
            'result.venue': 1, 
            'result.winner': 1, 
            'result.teams': 1, 
            'bet_amount': 1, 
            'match_name': 1, 
            'match_id': 1, 
            'winning_price': 1, 
            'no_of_ball': 1, 
            'no_of_run': 1, 
            'no_of_over': 1, 
            'wicket_type': 1, 
            'extra_type': 1, 
            'betting_count': 1, 
            'betting_limit': 1, 
            'ball_action': 1, 
            'status':1,
            'ball_action_text': 1, 
            'isWicket': 1, 
            'betting_team_key': 1
          }
        }
      ]
    ).sort({createdAt:-1});
    return APIRes.getSuccessResult(listBetInfo, res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};




exports.createFootBallBetting = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId ,userRole} = req.user;
    const userInput = Utils.getReqValues(req);
    let findQuery={};
    findQuery.user_id=userId;
    findQuery.match_id =userInput.match_id;
    const tournament = await footBallBtAmtModel.findOne({match_id:userInput.match_id})                             
    if(tournament){
    const walletData = await walletModel.findOne({
      user_id: userId,
    });
    if (walletData) {
      userInput.bet_amount=tournament.betting_price;
      if (walletData.balance >= userInput.bet_amount) {
        userInput.user_id=userId;
        const getUserBetting = await footBallBetModel.findOne(userInput)
        if(!getUserBetting){
          
          const updateBalance = await walletModel.findOneAndUpdate({user_id:userId},  { $set: { balance: parseInt(walletData.balance)- parseInt(userInput.bet_amount) } },{new:true})
          console.log(parseInt(userInput.bet_amount));
          const updateBalanceAdmin = await adminWallet.findByIdAndUpdate({_id:"630af56f45a6780721b0dfc0"},  { "$inc": { "balance": parseInt(userInput.bet_amount) } },{new:true})

          const findData = await footBallBetModel.create(userInput);


          const createTransactionObj = {
            user_id:userId,
            type:"DEBIT",
            match_id:userInput.match_id,
            match_name:"football",
            no_of_token:userInput.bet_amount,
            availablebalance:parseInt(walletData.balance)- parseInt(userInput.bet_amount)  ,
            oldbalance: parseInt(walletData.balance)
          }
         await matchTransactionModel.create(createTransactionObj)




          findData.msg="bet created successfully";
          return APIRes.getSuccessResult(findData, res);
        }else{
          return APIRes.getErrorResult("This user already bet this match", res);
        }
        
       
      } else {
        return APIRes.getErrorResult("balance not enough", res);
      }
    } else {
      return APIRes.getErrorResult("wallet not found", res);
    }}else{
      return APIRes.getErrorResult("You can't bet this match Please contact Admin!", res);
    }
  
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
};







