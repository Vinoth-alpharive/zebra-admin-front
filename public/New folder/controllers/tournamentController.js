const Utils = require("../helpers/utils");
const APIRes = require("../helpers/result");
const { validationResult } = require("express-validator");
const tournamentModel = require("../models/tournamentModel");
const matchModel = require("../models/matchModel");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("betting-rs-token");
const cricketAuthToken = require("../models/cricketAuthTokenModel");
const axios = require("axios");
const {
  ItemAssignmentInstance,
} = require("twilio/lib/rest/numbers/v2/regulatoryCompliance/bundle/itemAssignment");
const { array } = require("joi");

module.exports.createTournament = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    const { userId, userRole } = req.user;
    if (!(userRole == "ADMIN" || userRole == "SUPERADMIN")) {
      return APIRes.getErrorResult("Invalid role Type", res);
    }
    const { tournament_id } = userInput;
    const findData = await tournamentModel.findOne({
      tournament_id: tournament_id,
    });
    if (findData) {
      return APIRes.getErrorResult("tournament id Already exist", res);
    } else {
      const getToken = await cricketAuthToken.find();
      const decryptedData = cryptr.decrypt(getToken[0].cricket_auth_token);
      const createdData = await tournamentModel.create(userInput);
      if(userInput.game ==="Cricket"){
      var config = {
        method: "get",
        url: `https://api.sports.roanuz.com/v5/cricket/RS_P_1570725632827068418/tournament/${tournament_id}/featured-matches/`,
        headers: {
          "rs-token": decryptedData,
        },
      };
      const response = await axios(config);
      let updateQuery = {
        $set: { match_info: response.data.data },
      };
      const updateData = await tournamentModel.findOneAndUpdate(
        { tournament_id: tournament_id },
        updateQuery,
        { upsert: true,new:true }
      );
      if (updateData) {
        const listedData = await tournamentModel
          .findOne({ tournament_id: tournament_id })
          .lean();
        listedData.match_info.matches.forEach(async (element) => {
          var option = {
            method: "get",
            url: `https://api.sports.roanuz.com/v5/cricket/RS_P_1570725632827068418/match/${element.key}/`,
            headers: {
              "rs-token": decryptedData,
            },
          };
          try {
            const match_res = await axios(option);
            let insert = {
              teams: match_res.data.data.teams,
              name: match_res.data.data.name,
              venue: match_res.data.data.venue,
              sub_title: match_res.data.data.sub_title,
              format: match_res.data.data.format,
              title: match_res.data.data.title,
              winner: match_res.data.data.winner,
              squad_a_captain: match_res.data.data.squad.a.captain,
              squad_b_captain: match_res.data.data.squad.b.captain,
              squad_a_keeper: match_res.data.data.squad.a.keeper,
              squad_b_keeper: match_res.data.data.squad.a.keeper,
              players: match_res.data.data.players,
              match_key: element.key,
              status: match_res.data.data.status,
              start_at: match_res.data.data.start_at,
              tournament_id: tournament_id,
              squad: match_res.data.data.squad,
            };
            const insertData = await matchModel.create(insert);
             createdData.msg = "Tournament added successfully!";
                return APIRes.getSuccessResult(createdData, res);
          } catch (error) {
            console.log(error);
          }
        });
      }
    }
     
    }
  } catch (err) {
    console.log("Error in createTouranament:", err);
    return APIRes.getErrorResult(err, res);
  }
};

module.exports.edittournament = async (req, res) => {
  try {
    const { userId, userRole } = req.user;
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    let whereCodn = {};
    if (!(userRole == "ADMIN" || userRole == "SUPERADMIN")) {
      return APIRes.getErrorResult(
        "Invalid token provide a super admin or admin token",
        res
      );
    }
    if (!userInput._id) {
      return APIRes.getErrorResult("required tournament id", res);
    }
    if (userInput._id) {
      whereCodn._id = userInput._id;
    }
    delete userInput._id;
    let updateQuery = {
      $set: userInput,
    };
    const editedData = await tournamentModel.findOneAndUpdate(
      whereCodn,
      updateQuery,
      { new: true }
    );
    editedData.msg = "Tournament update successfully!";
    return APIRes.getSuccessResult(editedData, res);
  } catch (err) {
    return APIRes.getErrorResult(err, res);
  }
};

exports.listtournament = async (req, res) => {
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
    if (userInput.game) {
      whereCodn.game = userInput.game;
    }
    whereCodn["status"] = 1;
    const listedData = await tournamentModel
      .find(whereCodn)
      .select(
        "tournament_id summary tournament_image tournament_info cup_image bet_amount"
      )
      .sort({ createdAt: 1 })
      .lean();
    listedData.msg = "fetch data successfully!";
    return APIRes.getSuccessResult(listedData, res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

exports.listtournamentAdmin = async (req, res) => {
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
    if (userInput.game) {
      whereCodn.game = userInput.game;
    }
    whereCodn["status"] = 1;
    const listedData = await tournamentModel
      .find(whereCodn)
      .sort({ createdAt: 1 })
      .lean();
    listedData.msg = "add data successfully!";
    return APIRes.getSuccessResult(listedData, res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};
exports.listMatchs = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    let userInput = Utils.getReqValues(req);
    if (!userInput.tournament_id) {
      return APIRes.getErrorResult("required tournament_id", res);
    }
    let whereCodn = {};
    if (userInput.tournament_id) {
      whereCodn.tournament_id = userInput.tournament_id;
    }
    const listedData = await matchModel
      .find(whereCodn)
      .sort({ createdAt: 1 })
      .lean();
    return APIRes.getMessageResult(listedData, "fetch data successfully!", res);
  } catch (error) {
    return APIRes.getErrorResult(error, res);
  }
};

exports.listMatchFilter = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId, userRole } = req.user;
    let userInput = Utils.getReqValues(req);
    if (!userInput.tournament_id) {
      return APIRes.getErrorResult("required tournament_id", res);
    }
    let whereCodn = {};
    let checkCodn = {};
    if (userInput.tournament_id) {
      whereCodn.tournament_id = userInput.tournament_id;
      checkCodn.tournament_id = userInput.tournament_id;
    }
    var pushData = {};
    
    if (!(userRole == "ADMIN" || userRole == "SUPERADMIN")) {
      checkCodn.status = { $ne: "completed" };
    }
    const listedData = await tournamentModel.findOne(whereCodn).lean();
    const match_details = await matchModel
      .find(checkCodn)
      .select(
        "name format start_at squad_a_captain squad_a_keeper status squad_b_captain squad_b_keeper sub_title teams winner tournament_id title venue sub_title format match_key toss"
      )
      .lean();
     
    pushData.match_details = match_details;
    pushData.summary = listedData.summary;
    // console.log(pushData);
    return APIRes.getMessageResult(pushData, "fetch data successfully!", res);
 
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
};

exports.listPlayers = async (req, res) => {
  try {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      throw errors.array();
    }
    const { userId, userRole } = req.user;
    let userInput = Utils.getReqValues(req);
    if (!userInput.match_key) {
      return APIRes.getErrorResult("required match_id", res);
    }
    let whereCodn = {};
    if (userInput.match_key) {
      whereCodn.match_key = userInput.match_key;
    }
    //if (!(userRole == "ADMIN" || userRole == "SUPERADMIN")) {
     // whereCodn.status = { $ne: "completed" };
    //}
    const match_details = await matchModel.findOne(whereCodn).lean();
    const teamA = match_details?.squad?.a?.player_keys?.map((item, i) => {
      if (!(userRole == "ADMIN" || userRole == "SUPERADMIN")) {
        return match_details.players[item].player;
      } else {
        return match_details.players[item];
      }
    });
    const teamB = match_details?.squad?.b?.player_keys?.map((item, i) => {
      if (!(userRole == "ADMIN" || userRole == "SUPERADMIN")) {
        return match_details.players[item].player;
      } else {
        return match_details.players[item];
      }
    });
    delete match_details.players;
   delete match_details.play.innings;
    delete match_details.play.live;
    delete match_details.play.related_balls;
    match_details.teamA = teamA;
    match_details.teamB = teamB;
    return APIRes.getMessageResult(
      match_details,
      "fetch data successfully!",
      res
    );
  } catch (error) {
    console.log(error);
    return APIRes.getErrorResult(error, res);
  }
};
