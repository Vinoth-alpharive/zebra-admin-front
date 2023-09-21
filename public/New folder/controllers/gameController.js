const Utils = require("../helpers/utils");
const APIRes = require("../helpers/result");
// var project_key = process.env.BETTING_APP_CRICKET_PROJECTID;
var project_key = "RS_P_1570725632827068418";
var api_key = "RS5:4ed8d02ec70b07cf2010d428f897b28a";
// var api_key = process.env.BETTING_APP_CRICKET_APIKEY;
var request = require("request");
const axios = require("axios");
const cricketAuthToken = require("../models/cricketAuthTokenModel");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("betting-rs-token");
const adminModel = require("../models/adminModel");
const gameModel = require("../models/gameModel");
var io = require('socket.io-client')
const cricketLiveScoreModel = require("../models/cricketLiveScoreModel");
const bettingDetails = require('../models/bettingModel')
const { validationResult } = require("express-validator");
const {emitMessage} =require("../helpers/emitMessage");
const cron = require('node-cron')
const matchDetails = require('../models/matchModel');
const walletModel= require("../models/walletModel");
const tournamentModel = require('../models/tournamentModel');
const matchModel = require('../models/matchModel')


exports.creategame = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const userInput = Utils.getReqValues(req);
    const find = await gameModel.find({name:userInput.name})
    if(find && find.length !==0){
        return APIRes.getErrorResult("name already exist", res);
    }else{
    const createGame = await gameModel.create(userInput);
    createGame.msg ="fetch data successfully"
    return APIRes.getSuccessResult(createGame, res);
    }
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

exports.getgame = async (req, res, next) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId ,userRole} = req.user;
    if(!(userRole =="ADMIN" || userRole =="SUPERADMIN")){
      return APIRes.getErrorResult("Invalid role Type", res);
    }
    const listgame = await gameModel.find().populate('createdBy');
    listgame.msg ="fetch data successfully"
    return APIRes.getSuccessResult(listgame,res);
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
};

exports.getgameUser= async (req, res, next) => {
    try {
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw errors.array();
      }
      const listgame = await gameModel.find().select('name gameImage backgroundImage').lean()
      return APIRes.getMessageResult(listgame,"success",res);
    } catch (error) {
      console.log(error);
      return APIRes.getErrorResult(error, res);
    }
  };

  module.exports.editgame = async (req, res) => {
    try {
      let userInput = Utils.getReqValues(req);
      let whereCodn = {};
      const { userId ,userRole} = req.user;
      let errors = validationResult(req);
      if (!errors.isEmpty()) {
        throw errors.array();
      }
      if(!(userRole =="ADMIN" || userRole =="SUPERADMIN")){
        return APIRes.getErrorResult("Invalid role Type", res);
      }
      if (!userInput._id) {
        return APIRes.getErrorResult("required game id", res);
        }
       if (userInput._id) {
        whereCodn._id = userInput._id;
      }
      delete userInput._id;
      let updateQuery = {
        $set: userInput,
      };
      const editedData = await gameModel.findByIdAndUpdate( whereCodn,updateQuery,{ new: true });
      // editedData.msg = "asset update successfully!"
      return APIRes.getMessageResult(editedData," update successfully!", res)
    } catch (err) {
      return APIRes.getErrorResult(err, res);
    }
  };
  const getBettingResult = async(matchId)=>{
    const resultData = await bettingDetails.find({match_id:matchId,status:{"$ne":0}}).lean()
    
    return resultData;
  }
 
  module.exports.getLiveGame = async (req, res) => {
    try {
      let userInput = Utils.getReqValues(req);
      let whereCodn = {};
      const { userId ,userRole} = req.user;
      
      const createDa = await cricketLiveScoreModel.findOne({match_id:userInput.match_id})
      if(createDa){
        const sendDatas = {}
        sendDatas.toss= createDa?.match_info?.toss && createDa?.match_info?.toss;
        sendDatas.title= createDa?.match_info?.title && createDa?.match_info?.title;
        sendDatas.teams= createDa?.match_info?.teams && createDa?.match_info?.teams;
        sendDatas.venue= createDa?.match_info?.venue && createDa?.match_info?.venue;
    sendDatas.winner = createDa?.match_info?.winner && createDa?.match_info?.winner;
  sendDatas.format = createDa?.match_info?.play?.overs_per_innings,
          sendDatas.status=createDa?.match_info?.status && createDa?.match_info?.status;
          sendDatas.match_key=createDa?.match_id;
          if(createDa?.match_info?.play){
          sendDatas.innings=
            createDa?.match_info?.play?.innings &&
            createDa?.match_info?.play?.innings,
          sendDatas.target=
            createDa?.match_info?.play?.target &&
            createDa?.match_info?.play?.target,
            sendDatas.firstBatting=
            createDa?.match_info?.play?.first_batting &&
            createDa?.match_info?.play?.first_batting;
          sendDatas.a=
            createDa?.match_info?.play?.innings?.a_1?.score &&
            createDa?.match_info?.play?.innings?.a_1?.score,
          sendDatas.b=
            createDa?.match_info?.play?.innings?.b_1?.score &&
            createDa?.match_info?.play?.innings?.b_1?.score,
          sendDatas.requiredScore=
            createDa?.match_info?.play?.live?.required_score &&
            createDa?.match_info?.play?.live?.required_score,
          sendDatas.liveScore=
            createDa?.match_info?.play?.live?.score &&
            createDa?.match_info?.play?.live?.score,
          sendDatas.battingTeam=
            createDa?.match_info?.play?.live?.batting_team &&
            createDa?.match_info?.play?.live?.batting_team,
            sendDatas.bowlingTeam=
            createDa?.match_info?.play?.live?.bowling_team &&
            createDa?.match_info?.play?.live?.bowling_team
          sendDatas.strikerName=
            createDa?.match_info?.players &&
            createDa?.match_info?.players[
              `${createDa?.match_info?.play?.live?.striker_key}`
            ],
          nonStrikerName=
            createDa?.match_info?.players &&
            createDa?.match_info?.players[
              `${createDa?.match_info?.play.live?.non_striker_key}`
            ],
          sendDatas.bowlerDetails=
            createDa?.match_info.players &&
            createDa?.match_info?.players[
              `${createDa?.match_info?.play?.live?.bowler_key}`
            ]
 sendDatas.result =createDa?.match_info?.play?.result && createDa?.match_info?.play?.result
          }
          sendDatas.players= createDa?.match_info?.players && createDa?.match_info?.players


            const getToken = await cricketAuthToken.find();
            const decryptedData = cryptr.decrypt(getToken[0].cricket_auth_token);



           
               
  // console.log(data?.data?.data,"balls")
 

    var options = {
      method: 'GET',
      url: `https://api.sports.roanuz.com/v5/cricket/${project_key}/match/${userInput.match_id}/over-summary/`,
      headers: {
        'rs-token': decryptedData
      }
    }

    axios(options).then(async(dataset)=>{

      
let arr=[]

 const result =  dataset?.data?.data?.summaries?.map(async(item,i)=>{


        var options = {
          method: "GET",
          url: `https://api.sports.roanuz.com/v5/cricket/${project_key}/match/${userInput.match_id}/ball-by-ball/${item.index.innings}_${item.index.over_number}/`,
          headers: {
            "rs-token": decryptedData 
          },
        };
  
     return   axios(options).then(async function(data){

      
      return (data?.data?.data)
      

          
        })
      })
      // console.log(result,'asfasf');
// console.log(await Promise.all(result));
sendDatas.liveFeed = await Promise.all(result)

      return APIRes.getMessageResult(sendDatas,"update successfully!", res)
      


    })


    // return APIRes.getMessageResult(data?.data?.data,"update successfully!", res)
    
  }
  
//               sendDatas.liveFeed= data?.data?.data?.over?.balls && data?.data?.data?.over?.balls
// return APIRes.getMessageResult(sendDatas,"update successfully!", res)


        
    
    } catch (err) {
      return APIRes.getErrorResult(err, res);
    }
  };



 module.exports.getLiveGameForAdmin = async (req, res) => {
    try {
      let userInput = Utils.getReqValues(req);
      let whereCodn = {};
      const { userId ,userRole} = req.user;
      
      const createDa = await cricketLiveScoreModel.findOne({match_id:userInput.match_id})
      if(createDa){
        const sendDatas = {}
        sendDatas.toss= createDa?.match_info?.toss && createDa?.match_info?.toss;
        sendDatas.title= createDa?.match_info?.title && createDa?.match_info?.title;
        sendDatas.teams= createDa?.match_info?.teams && createDa?.match_info?.teams;
        sendDatas.venue= createDa?.match_info?.venue && createDa?.match_info?.venue;
    sendDatas.winner = createDa?.match_info?.winner && createDa?.match_info?.winner;
  sendDatas.format = createDa?.match_info?.play?.overs_per_innings,
          sendDatas.status=createDa?.match_info?.status && createDa?.match_info?.status;
          sendDatas.match_key=createDa?.match_id;
          if(createDa?.match_info?.play){
          sendDatas.innings=
            createDa?.match_info?.play?.innings &&
            createDa?.match_info?.play?.innings,
          sendDatas.target=
            createDa?.match_info?.play?.target &&
            createDa?.match_info?.play?.target,
            sendDatas.firstBatting=
            createDa?.match_info?.play?.first_batting &&
            createDa?.match_info?.play?.first_batting;
          sendDatas.a=
            createDa?.match_info?.play?.innings?.a_1?.score &&
            createDa?.match_info?.play?.innings?.a_1?.score,
          sendDatas.b=
            createDa?.match_info?.play?.innings?.b_1?.score &&
            createDa?.match_info?.play?.innings?.b_1?.score,
          sendDatas.requiredScore=
            createDa?.match_info?.play?.live?.required_score &&
            createDa?.match_info?.play?.live?.required_score,
          sendDatas.liveScore=
            createDa?.match_info?.play?.live?.score &&
            createDa?.match_info?.play?.live?.score,
          sendDatas.battingTeam=
            createDa?.match_info?.play?.live?.batting_team &&
            createDa?.match_info?.play?.live?.batting_team,
            sendDatas.bowlingTeam=
            createDa?.match_info?.play?.live?.bowling_team &&
            createDa?.match_info?.play?.live?.bowling_team
          sendDatas.strikerName=
            createDa?.match_info?.players &&
            createDa?.match_info?.players[
              `${createDa?.match_info?.play?.live?.striker_key}`
            ],
          nonStrikerName=
            createDa?.match_info?.players &&
            createDa?.match_info?.players[
              `${createDa?.match_info?.play.live?.non_striker_key}`
            ],
          sendDatas.bowlerDetails=
            createDa?.match_info.players &&
            createDa?.match_info?.players[
              `${createDa?.match_info?.play?.live?.bowler_key}`
            ]
 sendDatas.result =createDa?.match_info?.play?.result && createDa?.match_info?.play?.result
          }
          sendDatas.players= createDa?.match_info?.players && createDa?.match_info?.players


            const getToken = await cricketAuthToken.find();
            const decryptedData = cryptr.decrypt(getToken[0].cricket_auth_token);


return APIRes.getMessageResult(sendDatas,"update successfully!", res)
        
      }else{
        return APIRes.getMessageResult(createDa," No Data Found!", res)
      }
     
    } catch (err) {
      return APIRes.getErrorResult(err, res);
    }
  };










  const checkingResult = async (matchId, liveOver, liveBall, liveTeam,tournament_id) => {
    try {
      console.log(matchId,liveOver,liveTeam, liveBall);

      if(liveBall===0){
       liveOver= liveOver-1
       liveBall = 6
      }
      // console.log(liveOver,liveBall,'last');

      const getUserBetting = await bettingDetails.find({
        match_id: matchId,
        status: 0,
        no_of_ball: liveBall,
        no_of_over: liveOver,
        betting_team_key: liveTeam,
      });
      console.log(getUserBetting,'asd');
   const getToken = await cricketAuthToken.find();
   const decryptedData = cryptr.decrypt(getToken[0].cricket_auth_token);
  //  console.log(decryptedData);
      getUserBetting.forEach((item, i) => {
     
        var fees;
        if (liveTeam === item?.betting_team_key) {
          if (item?.no_of_over === liveOver && item?.no_of_ball === liveBall) {
            var options = {
              method: "GET",
              url: `https://api.sports.roanuz.com/v5/cricket/${project_key}/match/${matchId}/ball-by-ball/`,
              headers: {
                "rs-token": decryptedData,
              }
            };
          
            axios(options)
              .then(async (data) => {
              
                // if (  
                //   data?.data?.data?.over?.index?.over_number === item?.no_of_over
                // ) {
                  // if (
                  //   data?.data?.data?.over?.balls[item?.no_of_ball - 1]?.overs[1] === item?.no_of_ball
                  // ) {
                  //  console.log(data?.data?.data?.over?.balls[item?.no_of_ball - 1]?.overs[1] , item?.no_of_ball,"2");
                    if (
                      data?.data?.data?.over?.balls[item?.no_of_ball - 1]?.ball_type === "normal"
                    ) {
                      // console.log(  data?.data?.data?.over?.balls[item?.no_of_ball - 1]
                      //   ?.ball_type ,"normal");

                     
                      if (
                        data?.data?.data?.over?.balls[item?.no_of_ball - 1]
                    ?.team_score?.is_wicket ===true && item.isWicket===true
                      ) {
                        console.log("A", data?.data?.data?.over?.balls[item?.no_of_ball - 1]
                        ?.wicket?.wicket_type , item?.wicket_type);
                        if (
                          data?.data?.data?.over?.balls[item?.no_of_ball - 1]
                            ?.wicket?.wicket_type === item?.wicket_type
                        ) {
                        
                          const match = await matchModel.findOne({match_key:matchId})
                          const tournament = await tournamentModel.findOne({tournament_id:match.tournament_id})
                          if (tournament.withdraw_type === "percentage") {
                             fees=parseFloat(tournament.fee_percentage/ 100) *item.bet_amount;
                            await walletModel.findOneAndUpdate({ user_id: item?.user_id},
                              {$inc: { balance: parseFloat(fees+item.bet_amount) }},{new:true})
                          } else if (tournament.withdraw_type === "fixed") {
                            fees=parseFloat(item.bet_amount)
                            await walletModel.findOneAndUpdate({ user_id: item?.user_id},
                              {$inc: { balance: parseFloat(fees+item.bet_amount) }},{new:true})
                          }
                    
                          return await bettingDetails.findOneAndUpdate(
                            {
                              user_id: item?.user_id,
                              status: 0,
                              match_id:matchId,
                              no_of_ball: liveBall,
                              no_of_over: liveOver,
                              betting_team_key: liveTeam,
                            },
                            { $set: { status: 2 ,winning_price:fees} },
                            { new: true }
                          );

                        } else {
                          console.log("B");
                          return await bettingDetails.findOneAndUpdate(
                            {
                              user_id: item?.user_id,
                              status: 0,
                              no_of_ball: liveBall,
                              no_of_over: liveOver,
                              betting_team_key: liveTeam,
                            },
                            { $set: { status: 1 } },
                            { new: true }
                          );
                        }
                      }
                    
                      if (
                        data?.data?.data?.over?.balls[item?.no_of_ball - 1]?.team_score?.runs === item?.no_of_run
                      ) {
                        const match = await matchModel.findOne({match_key:matchId})
                        const tournament = await tournamentModel.findOne({tournament_id:match.tournament_id})
                        if (tournament.withdraw_type === "percentage") {
                           fees=parseFloat(tournament.fee_percentage/ 100) *item.bet_amount;
                          await walletModel.findOneAndUpdate({ user_id: item?.user_id},
                            {$inc: { balance: parseFloat(fees+item.bet_amount) }},{new:true})
                        } else if (tournament.withdraw_type === "fixed") {
                          fees=parseFloat(item.bet_amount)
                          await walletModel.findOneAndUpdate({ user_id: item?.user_id},
                            {$inc: { balance: parseFloat(fees+item.bet_amount) }},{new:true})
                        }



                        return await bettingDetails.findOneAndUpdate(
                          {
                            user_id: item?.user_id,
                            status: 0,
                            no_of_ball: liveBall,
                            no_of_over: liveOver,
                            betting_team_key: liveTeam,
                          },
                          { $set: { status: 2 } },
                          { new: true }
                        );
                      } else {
                        
                        return await bettingDetails.findOneAndUpdate(
                          {
                            user_id: item?.user_id,
                            status: 0,
                            no_of_ball: liveBall,
                            no_of_over: liveOver,
                            betting_team_key: liveTeam,
                          },
                          { $set: { status: 1 } },
                          { new: true }
                        );
                      }
                    } else {
                      
                      if (
                        data?.data?.data?.over?.balls[item?.no_of_ball - 1]
                          ?.ball_type === item?.extra_type
                      ) {


                        const match = await matchModel.findOne({match_key:matchId})
                        const tournament = await tournamentModel.findOne({tournament_id:match.tournament_id})
                        if (tournament.withdraw_type === "percentage") {
                           fees=parseFloat(tournament.fee_percentage/ 100) *item.bet_amount;
                          await walletModel.findOneAndUpdate({ user_id: item?.user_id},
                            {$inc: { balance: parseFloat(fees+item.bet_amount) }},{new:true})
                        } else if (tournament.withdraw_type === "fixed") {
                          fees=parseFloat(item.bet_amount)
                          await walletModel.findOneAndUpdate({ user_id: item?.user_id},
                            {$inc: { balance: parseFloat(fees+item.bet_amount) }},{new:true})
                        }
                       
                        return await bettingDetails.findOneAndUpdate(
                          {
                            user_id: item?.user_id,
                            status: 0,
                            no_of_ball: liveBall,
                            no_of_over: liveOver,
                            betting_team_key: liveTeam,
                          },
                          { $set: { status: 2 } },
                          { new: true }
                        );
                      } else {
                        console.log("Bd",);
                        return await bettingDetails.findOneAndUpdate(
                          {
                            user_id: item?.user_id,
                            status: 0,
                            no_of_ball: liveBall,
                            no_of_over: liveOver,
                            betting_team_key: liveTeam,
                          },
                          { $set: { status: 1 } },
                          { new: true }
                        );
                      }
                    }
                  // }
                // }
              })
              .catch((err) => {
                console.log(err);
              });
          }
        }
      });
    } catch (error) {
      console.log(error.message);
    }
  };
  
