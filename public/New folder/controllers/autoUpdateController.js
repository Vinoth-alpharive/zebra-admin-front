const Cryptr = require("cryptr");
const cricketAuthModel = require("../models/cricketAuthTokenModel");
const cryptr = new Cryptr("betting-rs-token");
const tournamentModel = require("../models/tournamentModel");
const matchModel = require("../models/matchModel");
var project_key = "RS_P_1570725632827068418";
var api_key = "RS5:4ed8d02ec70b07cf2010d428f897b28a";
const axios = require("axios");
const request = require("request");
const moment = require("moment");
const cricketLiveScoreModel = require('../models/cricketLiveScoreModel')
module.exports.createCricketAuth = async (req, res) => {
  try {
    var options = {
      method: "POST",
      url: `https://api.sports.roanuz.com/v5/core/${project_key}/auth/`,
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        api_key: `${api_key}`,
      }),
    };
    request(options, async function (error, response) {
      if (error) throw new Error(error);
      const encryptedData = cryptr.encrypt(
        JSON.parse(response.body).data.token
      );
      const getToken = await cricketAuthModel.find();
      if (getToken[0] && getToken[0]?.cricket_auth_token) {
        const setCricketAuth = await cricketAuthModel.findByIdAndUpdate(
          { _id: getToken[0]._id },
          { cricket_auth_token: encryptedData },
          { upsert: true }
        );
      }
    });
  } catch (error) {
    console.log(error?.message);
  }
};

module.exports.updateMatch = async () => {
  try {
    const getToken = await cricketAuthModel.find();
    const decryptedData = cryptr.decrypt(getToken[0].cricket_auth_token);
    console.log(decryptedData);
    const listedData = await tournamentModel.find({'game':"cricket"}).lean();
    listedData.forEach(async (element) => {
      element.match_info.matches.forEach(async (item) => {
        console.log(item.key)
        var option = {
          method: "get",
          url: `https://api.sports.roanuz.com/v5/cricket/RS_P_1570725632827068418/match/${item.key}/`,
          headers: {
            "rs-token": decryptedData,
          },
        };
        try {
          const match_res = await axios(option);
          let insert = {
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
            status: match_res.data.data.status,
            start_at: match_res.data.data.start_at,
            squad: match_res.data.data.squad,
            teams: match_res.data.data.teams,
            tournament_id: element.tournament_id,
          };
          let updateQuery = {
            $set: insert,
          };
          const insertData = await matchModel.findOneAndUpdate(
            { match_key: item.key },
            updateQuery,
            { new: true, upsert: true }
          );
          console.log(insertData);
        } catch (error) {
          console.log(error.message);
        }
      });
    });
  } catch (error) {
    console.log(error?.message);
  }
};
module.exports.updateTournament = async () => {
  try {
    const getToken = await cricketAuthModel.find();
    const decryptedData = cryptr.decrypt(getToken[0].cricket_auth_token);
    const listedData = await tournamentModel.find({'game':"cricket"}).lean();
    listedData.forEach(async (element) => {
      var config = {
        method: "get",
        url: `https://api.sports.roanuz.com/v5/cricket/RS_P_1570725632827068418/tournament/${element.tournament_id}/featured-matches/`,
        headers: {
          "rs-token": decryptedData,
        },
      };
      const response = await axios(config);

      // element.match_info.matches.forEach(async (item) => {
      //   response.data.data.matches.forEach(async (ke) => {
      //     if (item.key !== ke.key) {
            // console.log( item.key !== ke.key)
            let updateQuery = {
               $set: { match_info: response.data.data },
            };
            console.log(updateQuery);
            const updateData = await tournamentModel.findOneAndUpdate(
              { tournament_id: element.tournament_id },
              updateQuery,
              { upsert: true ,new:true}
            );
            console.log(updateData ,"lll");
    //       } else {
    //         return null;
    //       }
    //     });
    //   });
     });
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateScore = async () => {
  try {
    const getToken = await cricketAuthModel.find();
    const decryptedData = cryptr.decrypt(getToken[0].cricket_auth_token);
    const listedData = await matchModel.find({ status: "completed" }).lean();
    listedData.forEach(async (element) => {
      var config = {
        method: "get",
        url: `https://api.sports.roanuz.com/v5/cricket/RS_P_1570725632827068418/match/${element.match_key}/`,
        headers: {
          "rs-token": decryptedData,
        },
      };
      const response = await axios(config);
      let insert = {
        winner: response.data.data.winner,
        toss: response.data.data.toss,
        players: response.data.data.players,
        play: response.data.data.play,
        squad: response.data.data.squad,
      };
      const insertData = await matchModel
        .findOneAndUpdate(
          { match_key: element.match_key },
          { $set: insert },
          { new: true, upsert: true }
        )
        .lean();
      console.log(insertData);
    });
  } catch (error) {
    console.log(error?.message);
  }
};

module.exports.subscribeMatch = async () => {
  try {
    const getToken = await cricketAuthModel.find();
    const decryptedData = cryptr.decrypt(getToken[0].cricket_auth_token);
    const listedData = await matchModel
      .find({
        status: {$ne:"completed"},
        start_at: {
          $gte: moment().startOf("day").format("X"),
          $lt: moment(moment().startOf("day").toDate())
            .endOf("day")
            .format("X"),
        },
      })
      .select("-players -play -squad")
      .lean();
    listedData.forEach(async (element) => {
      console.log(element.match_key);
      var data = JSON.stringify({
        method: "web_hook",
      });

      var config = {
        method: "post",
        url: `https://api.sports.roanuz.com/v5/cricket/RS_P_1570725632827068418/match/${element?.match_key}/subscribe/`,
        headers: {
          "rs-token": decryptedData,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error.message);
        });

      // const response = await axios(config);
      // console.log(response);
    });
  } catch (error) {
    console.log(error);
  }
};
module.exports.unsubscribeMatch = async () => {
  try {
    const getToken = await cricketAuthModel.find();
    const decryptedData = cryptr.decrypt(getToken[0].cricket_auth_token);
    const listedData = await cricketLiveScoreModel.find({"match_info.status": "completed"}).lean();
    listedData.forEach(async (element) => {
      var data = JSON.stringify({
        method: "web_hook",
      });

      var config = {
        method: "post",
        url: `https://api.sports.roanuz.com/v5/cricket/RS_P_1570725632827068418/match/${element?.match_key}/unsubscribe/`,
        headers: {
          "rs-token": decryptedData,
          "Content-Type": "application/json",
        },
        data: data,
      };

      axios(config)
        .then(function (response) {
          console.log(JSON.stringify(response.data));
        })
        .catch(function (error) {
          console.log(error.message);
        });

      // const response = await axios(config);
      // console.log(response);
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports.updateFinishTournament= async () => {
  try {
    const listedData = await tournamentModel.find({status:1,game:"cricket"}).lean();
    listedData.forEach(async (element,i) => {
    let date = moment(element.tournament_info.last_scheduled_match_date * 1000).local().toDate()
    console.log(date,i,date < new Date());
    if(date < new Date()){
    const update = await tournamentModel.findOneAndUpdate({_id:element._id},{$set:{status:'0'}},{new:true})
    }
    });
  } catch (error) {
    console.log(error);
  }
};
