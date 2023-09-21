const express = require("express");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

const APIRes = require('./helpers/result')
const helmet = require("helmet");
const mongoSanitize = require("express-mongo-sanitize");
const xss = require("xss-clean");
const compression = require("compression");
const cors = require("cors");
const unless = require("express-unless");
const path = require("path");
const { upload, s3 } = require("./helpers/AWSFileUpload");
const { v4: uuidv4 } = require("uuid");
const userRoutes = require("./routes/usersRoutes");
const adminRoutes = require("./routes/adminRouters");
const userRoutesUpdated = require('./routes/userRoutesUpdated')
const adminRoutesUpdated = require('./routes/adminRoutesUpdated')
const assetRoutes = require("./routes/assetRouters");
const paymentRoutes = require("./routes/paymentRoutes");
const gameRoutes = require("./routes/betInfoRouters");
const globalErrorHandler = require("./controllers/errorController");
const authMiddleware = require("./middleware/auth");
const cron = require("node-cron");
const matchTransactionModel = require('./models/matchTransactionHistory')
const moment = require('moment-timezone')
const {sendNotification}=require('./helpers/pushNotification')
const {emitMessage} = require('./helpers/emitMessage');
const {
  updateMatch,
  updateTournament,
  createCricketAuth,
  updateScore,
 updateFinishTournament,
unsubscribeMatch,
  subscribeMatch
} = require("./controllers/autoUpdateController");
var zlib = require("zlib");
const cricketLiveScoreModel = require("./models/cricketLiveScoreModel");
const bodyParser = require("body-parser");
const bettingDetails = require("./models/bettingModel");
const matchDetails = require("./models/matchModel");
const walletModel = require("./models/walletModel");
const tournamentModel = require("./models/tournamentModel");
const matchModel = require("./models/matchModel");
const cricketAuthToken = require("./models/cricketAuthTokenModel");
const Cryptr = require("cryptr");
const cryptr = new Cryptr("betting-rs-token");
var project_key = "RS_P_1570725632827068418";
var api_key = "RS5:4ed8d02ec70b07cf2010d428f897b28a";
const deviceModel = require("./models/deviceModel");
const axios = require("axios");
var events = require("events");
const Utils = require("./helpers/utils");
// var api_key = process.env.BETTING_APP_CRICKET_APIKEY;
var request = require("request");
// Start express app
const app = express();

cron.schedule("0 */3 * * *", () => {
   createCricketAuth(),
   updateMatch(),
   updateTournament(),
    updateScore(),
    subscribeMatch(),
     unsubscribeMatch(),
 updateFinishTournament()
});
// const fun =async()=>{
//   const walletUser = await walletModel.findOne({user_id:'630705ca8fdaa7d35d00bfe4'}).populate('user_id').lean()
//   console.log(walletUser.user_id);
// }
// fun()
app.enable("trust proxy");

// GLOBAL MIDDLEWARES
app.use(cors());
// Serving static files
app.use("/img", express.static(path.join(__dirname, "public")));
// Middleware for authenticating token submitted with requests
authMiddleware.authenticateToken.unless = unless;
app.use(
  authMiddleware.authenticateToken.unless({
    path: [
      { url: "/api/v1/users/createuser", methods: ["POST"] },
      { url: "/api/v1/users/signup", methods: ["POST"] },
      { url: "/api/v1/users/signin", methods: ["POST"] },
      { url: "/api/v1/users/accesstoken", methods: ["POST"] },
      { url: "/api/v1/users/forgot", methods: ["POST"] },
      { url: "/api/v1/users/forgot-verify", methods: ["POST"] },
      { url: "/api/v1/admin/login", methods: ["POST"] },
      { url: "/api/v1/admin/getaccesstoken", methods: ["POST"] },
      { url: "/api/v1/payment/ipn/response", methods: ["POST"] },
      { url: "/api/v1/payment/ipn/success", methods: ["GET"] },
      { url: "/api/v1/payment/ipn/failure", methods: ["GET"] },
      { url: "/api/v1/users/2fa-enable", methods: ["POST"] },
      { url: "/api/v1/users/2faEmail-enable", methods: ["POST"] },
      { url: "/api/v1/users/2faSms-enable", methods: ["POST"] },
      { url: "/api/v1/admin/live-score", methods: ["POST"] },
{url:'/api/v1/users/get_document',method:["POST"]},
     {url:'/api/v1/users/football-widget',method:["GET"]},
{url:'/api/v1/users/cricket-widget',method:["GET"]}
    ],
  })
);



app.get('/api/v1/users/football-widget',(req,res)=>{
  try {
    let userInput = Utils.getReqValues(req);

  if(!userInput.match_key){
    return APIRes.getErrorResult("Match Key Required", res)
  }

    res.send(`

    
<iframe  allowtransparency="true" src='https://widgets.thesports01.com/en/3d/football?profile=4zh4nnunhdoejg77&uuid=${userInput.match_key}'  frameBorder="0" style="overflow:hidden;"  width="100%" height="100%"  ></iframe>


`)
  
  } catch (error) {
    return APIRes.getErrorResult(error, res)
    
  }
  
})


app.get('/api/v1/users/cricket-widget',(req,res)=>{
  try {
    let userInput = Utils.getReqValues(req);

  if(!userInput.match_key){
    return APIRes.getErrorResult("Match Key Required", res)
  }

    res.send(`

    
<iframe  allowtransparency="true" src='https://widgets.thesports01.com/en/cricket?profile=47q33c4ggu1u8qx&uuid=${userInput.match_key}'  frameBorder="0" style="overflow:hidden;"  width="100%" height="100%"  ></iframe>


`)
  
  } catch (error) {
    return APIRes.getErrorResult(error, res)
    
  }
  
})


// Set security HTTP headers
app.use(helmet());

// Development logging
if (process.env.NODE_ENV === "development") {
  app.use(morgan("dev"));
}

// Limit requests from same API
const limiter = rateLimit({
  max: 1000,
  windowMs: 60 * 60 * 1000,
  message: "Too many requests from this IP, please try again in an hour!",
});
//app.use("/api", limiter);

app.use("/api", express.static(path.join(__dirname, "color")));

app.use(bodyParser.json());
app.use(express.json({ type: "application/json", limit: "20mb" }));
app.use(
  express.urlencoded({ extended: true, limit: "20mb", parameterLimit: "5000" })
);

// Data sanitization against NoSQL query injection
app.use(mongoSanitize());

// Data sanitization against XSS
app.use(xss());

// use compresssion
app.use(compression());

// set the view engine to ejs
app.set("view engine", "ejs");
app.use(express.static("views"));

// Test middleware
app.use((req, res, next) => {
  req.requestTime = new Date().toISOString();
  // console.log(req);
  next();
});

// ROUTES
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/admin", adminRoutes);
app.use("/api/v1/asset", assetRoutes);
app.use("/api/v1/payment", paymentRoutes);
app.use("/api/v1/game", gameRoutes);
app.use("/api/v1/test", (req, res, next) => {
  res.status(200).json({ status: "Success" });
});

//version 2 API for cricket 
app.use('/api/v2/users',userRoutesUpdated)
app.use('/api/v2/admin', adminRoutesUpdated)


app.post("/api/v1/upload", upload, (req, res) => {
  let myFile = req.file.originalname.split(".");

  const fileType = myFile[myFile.length - 1];

  const { type } = req.body;
  const folderName = type || "profile";
  // console.log(fileType);

  const params = {
    Bucket: process.env.AWS_BUCKETNAME + `/${folderName}`,
    Key: `${uuidv4()}.${fileType}`,
    Body: req.file.buffer,
    ContentType: fileType,
  };

  // console.log(params);

  s3.upload(params, (error, data) => {
    if (error) {
      res.status(500).send(error);
    }

    res.status(200).send({ data: data, status: true, msg: "success" });
  });
});

async function rawBody(req, res, next) {
  try {
    req.rawBody = "";
    req.chunks = [];
    req.on("data", function (chunk) {
      req.chunks.push(Buffer.from(chunk));
    });
    req.on("end", function () {
      next();
    });
  } catch (error) {
    console.log(error.message, "first error");
  }
}

app.use(bodyParser.json());
app.use(rawBody);












const checkingResult = async (
  matchId,
  liveOver,
  liveBall,
  liveTeam,
  tournament_id
) => {
  try {
    console.log(matchId, liveOver, liveTeam, liveBall);

    if (liveBall === 0) {
      liveOver = liveOver - 1;
      liveBall = 6;
    }
    // console.log(liveOver,liveBall,'last');

    const getUserBetting = await bettingDetails.find({
      match_id: matchId,
      status: 0,
      no_of_ball: liveBall,
      no_of_over: liveOver,
      betting_team_key: liveTeam,
    });
    const getToken = await cricketAuthToken.find();
    const decryptedData = cryptr.decrypt(getToken[0].cricket_auth_token);
     //console.log(decryptedData);
      getUserBetting.forEach((item, i) => {
      var fees;
      if (liveTeam === item?.betting_team_key) {
         if (parseInt(item?.no_of_over) === liveOver && parseInt(item?.no_of_ball) === liveBall) {
          var options = {
            method: "GET",
            url: `https://api.sports.roanuz.com/v5/cricket/${project_key}/match/${matchId}/ball-by-ball/`,
            headers: {
              "rs-token": decryptedData 
            },
          };

          axios(options)
            .then(async (data) => {

console.log("ballcount",parseInt(data?.data?.data?.over?.balls[
          data?.data?.data?.over?.balls?.length - 1
        ]?.overs[1]) );

            
              if(data?.data?.data?.over?.balls[data?.data?.data?.over?.balls?.length-1]?.overs[1]===parseInt(item?.no_of_ball)){
                // console.log(data?.data?.data?.over?.balls[data?.data?.data?.over?.balls?.length-1]
                //    ?.ball_type === "normal",'normal ball');
                if (
                  data?.data?.data?.over?.balls[data?.data?.data?.over?.balls?.length-1]
                    ?.ball_type === "normal"
                ) {
              


              
 // console.log(data?.data?.data?.over?.balls[data?.data?.data?.over?.balls?.length-1]
//     ?.team_score?.is_wicket === true &&
//   item.isWicket === true,
//   data?.data?.data?.over?.balls[data?.data?.data?.over?.balls?.length-1]
//     ?.team_score?.is_wicket === true ,
//   item.isWicket === true,
//   data?.data?.data?.over?.balls[data?.data?.data?.over?.balls?.length-1]
//   ?.team_score?.is_wicket  ,
// item.isWicket 
//   );


  
                  if (
                    data?.data?.data?.over?.balls[data?.data?.data?.over?.balls?.length-1]
                      ?.team_score?.is_wicket === true &&
                    item.isWicket === true
                  ) {
                    // console.log(
                    //   "A",
                    //   data?.data?.data?.over?.balls[item?.no_of_ball]?.wicket
                    //     ?.wicket_type,
                    //   item?.wicket_type
                    // );
                    if (
                      data?.data?.data?.over?.balls[item?.no_of_ball]?.wicket
                        ?.wicket_type === item?.wicket_type
                    ) {
                      const match = await matchModel.findOne({
                        match_key: matchId,
                      });
                      const tournament = await tournamentModel.findOne({
                        tournament_id: match.tournament_id,
                      });
                      // if (tournament.withdraw_type === "percentage") {
                      //   fees =
                      //     parseFloat(tournament.fee_percentage / 100) *
                      //     item.bet_amount;
                      //   await walletModel.findOneAndUpdate(
                      //     { user_id: item?.user_id },
                      //     {
                      //       $inc: { balance: parseFloat(fees + item.bet_amount) },
                      //     },
                      //     { new: true }
                      //   );
                      // } else if (tournament.withdraw_type === "fixed") {
                      //   fees = parseFloat(item.bet_amount);
                      //   await walletModel.findOneAndUpdate(
                      //     { user_id: item?.user_id },
                      //     {
                      //       $inc: { balance: parseFloat(fees + item.bet_amount) },
                      //     },
                      //     { new: true }
                      //   );
                      // }
                      const findMatch =await matchModel.findOne({ match_key: matchId})
                      let deviceIds = [];
                      let alreadyDeviceSaved = await deviceModel.findOne({
                      user_id: item.user_id 
                      });
                      message = `you won the ${findMatch.title} match on ${moment(findMatch.start_at * 1000).tz('Asia/Kolkata').format('llll')}. The winning price is ${fees}`;
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
                   
                      var winningPrice;

                      if (tournament.withdraw_type === "percentage") {
                        winningPrice =
                          parseFloat(tournament.fee_percentage / 100) *
                          item.bet_amount;
                        await walletModel.findOneAndUpdate(
                          { user_id: item?.user_id },
                          { $inc: { balance: parseFloat(winningPrice + item.bet_amount) } },
                          { new: true }
                        );


                        const getWallet = await walletModel.findOne({user_id:item?.user_id})

                    //    console.log(
                        //   parseFloat(getWallet.balance) ,
                        //   getWallet.balance , winningPrice,
                        // );
  
                        const createTransactionObj = {
                          user_id:item?.user_id,
                          type:"CREDIT",
                          match_id:matchId,
                          match_name:"cricket",
                          no_of_token:parseFloat(winningPrice + item.bet_amount),
                          availablebalance:parseFloat(getWallet.balance + parseFloat(winningPrice + item.bet_amount)) ,
                          oldbalance:parseFloat(getWallet.balance ),
                          no_of_ball:liveBall,
                          no_of_over:liveOver,
                          betting_team:liveTeam
                        }
                        const createMatchTransactionHistory = await matchTransactionModel.create(createTransactionObj)



                      } else if (tournament.withdraw_type === "fixed") {
                        winningPrice = parseFloat(item.bet_amount);
                        await walletModel.findOneAndUpdate(
                          { user_id: item?.user_id },
                          { $inc: { balance: parseFloat(winningPrice + item.bet_amount) } },
                          { new: true }
                        );

                        const getWallet = await walletModel.findOne({user_id:item?.user_id})

                    //    console.log(
                        //   parseFloat(getWallet.balance) ,
                        //   getWallet.balance , winningPrice,
                        // );
  
                        const createTransactionObj = {
                          user_id:item?.user_id,
                          type:"CREDIT",
                          match_id:matchId,
                          match_name:"cricket",
                          no_of_token:parseFloat(winningPrice + item.bet_amount),
                          availablebalance:parseFloat(getWallet.balance + parseFloat(winningPrice + item.bet_amount)) ,
                          oldbalance:parseFloat(getWallet.balance ),
                          no_of_ball:liveBall,
                          no_of_over:liveOver,
                          betting_team:liveTeam
                        }
                        const createMatchTransactionHistory = await matchTransactionModel.create(createTransactionObj)




                      }
                     

                      return await bettingDetails.findOneAndUpdate(
                        {
                          user_id: item?.user_id,
                          status: 0,
                          match_id: matchId,
                          no_of_ball: liveBall,
                          no_of_over: liveOver,
                          betting_team_key: liveTeam,
                        },
                        { $set: { status: 2, winning_price: winningPrice } },
                        { new: true }
                      );

                    } else {
                      const findMatch =await matchModel.findOne({ match_key: matchId})
                      let deviceIds = [];
                      let alreadyDeviceSaved = await deviceModel.findOne({
                      user_id: item.user_id 
                      });
                      message = `you lose the ${findMatch.title} match on ${moment(findMatch .start_at * 1000).tz('Asia/Kolkata').format('llll')}.`;
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
  
                 // console.log(data?.data?.data?.over?.balls[data?.data?.data?.over?.balls?.length-1]?.team_score?.runs === parseInt(item?.no_of_run),
                  // data?.data?.data?.over?.balls[data?.data?.data?.over?.balls?.length-1]?.team_score?.runs, parseInt(item?.no_of_run)," 0 run"
                  // );
                  if (data?.data?.data?.over?.balls[data?.data?.data?.over?.balls?.length-1]?.team_score?.runs === parseInt(item?.no_of_run)) {
                    const match = await matchModel.findOne({
                      match_key: matchId,
                    });
                    const tournament = await tournamentModel.findOne({
                      tournament_id: match.tournament_id,
                    });
                  
                    const findMatch =await matchModel.findOne({ match_key: matchId})
                    let deviceIds = [];
                    let alreadyDeviceSaved = await deviceModel.findOne({
                    user_id: item.user_id 
                    });
                    message = `you won the ${findMatch.title} match on ${moment(findMatch .start_at * 1000).tz('Asia/Kolkata').format('llll')}. The winning price is ${fees}`;
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
                    var winningPrice
                    if (tournament.withdraw_type === "percentage") {
                      winningPrice =
                        parseFloat(tournament.fee_percentage / 100) *
                        item.bet_amount;
                      await walletModel.findOneAndUpdate(
                        { user_id: item?.user_id },
                        { $inc: { balance: parseFloat(winningPrice + item.bet_amount) } },
                        { new: true }
                      );



                      const getWallet = await walletModel.findOne({user_id:item?.user_id})

                   //   console.log(
                      //   parseFloat(getWallet.balance) ,
                      //   getWallet.balance , winningPrice,
                      // );
  
                        const createTransactionObj = {
                          user_id:item?.user_id,
                          type:"CREDIT",
                          match_name:"cricket",
                          match_id:matchId,
                          no_of_token:parseFloat(winningPrice + item.bet_amount),
                          availablebalance:parseFloat(getWallet.balance + parseFloat(winningPrice + item.bet_amount)) ,
                          oldbalance:parseFloat(getWallet.balance ),
                          no_of_ball:liveBall,
                          no_of_over:liveOver,
                          betting_team:liveTeam
                        }
                        const createMatchTransactionHistory = await matchTransactionModel.create(createTransactionObj)






                    } else if (tournament.withdraw_type === "fixed") {
                      winningPrice = parseFloat(item.bet_amount);
                      await walletModel.findOneAndUpdate(
                        { user_id: item?.user_id },
                        { $inc: { balance: parseFloat(winningPrice + item.bet_amount) } },
                        { new: true }
                      );

                      const getWallet = await walletModel.findOne({user_id:item?.user_id})

                    //  console.log(
                      //   parseFloat(getWallet.balance) ,
                      //   getWallet.balance , winningPrice,
                      // );
  
                        const createTransactionObj = {
                          user_id:item?.user_id,
                          type:"CREDIT",
                          match_name:"cricket",
                          match_id:matchId,
                          no_of_token:parseFloat(winningPrice + item.bet_amount),
                          availablebalance:parseFloat(getWallet.balance + parseFloat(winningPrice + item.bet_amount)) ,
                          oldbalance:parseFloat(getWallet.balance ),
                          no_of_ball:liveBall,
                          no_of_over:liveOver,
                          betting_team:liveTeam
                        }
                        const createMatchTransactionHistory = await matchTransactionModel.create(createTransactionObj)


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
                    const findMatch =await matchModel.findOne({ match_key: matchId})
                    let deviceIds = [];
                    let alreadyDeviceSaved = await deviceModel.findOne({
                    user_id: item.user_id 
                    });
                    message = `you lose the ${findMatch.title}match on${moment(findMatch .start_at * 1000).tz('Asia/Kolkata').format('LT')}`;
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
                  console.log('extra ball');
                  if (
                    data?.data?.data?.over?.balls[data?.data?.data?.over?.balls?.length-1]
                      ?.ball_type === item?.extra_type
                  ) {
                    const match = await matchModel.findOne({
                      match_key: matchId,
                    });
                    const tournament = await tournamentModel.findOne({
                      tournament_id: match.tournament_id,
                    });
                    if (tournament.withdraw_type === "percentage") {
                      fees =
                        parseFloat(tournament.fee_percentage / 100) *
                        item.bet_amount;
                      await walletModel.findOneAndUpdate(
                        { user_id: item?.user_id },
                        { $inc: { balance: parseFloat(fees + item.bet_amount) } },
                        { new: true }
                      );
                    } else if (tournament.withdraw_type === "fixed") {
                      fees = parseFloat(item.bet_amount);
                      await walletModel.findOneAndUpdate(
                        { user_id: item?.user_id },
                        { $inc: { balance: parseFloat(fees + item.bet_amount) } },
                        { new: true }
                      );
                    }
                    const findMatch =await matchModel.findOne({ match_key: matchId})
                    let deviceIds = [];
                    let alreadyDeviceSaved = await deviceModel.findOne({
                    user_id: item.user_id 
                    });
                    message = `you won the ${findMatch.title} match on ${moment(findMatch .start_at * 1000).tz('Asia/Kolkata').format('llll')} .The winning price is ${fees}`;
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

var winningPrice;
                    if (tournament.withdraw_type === "percentage") {
                      winningPrice =
                        parseFloat(tournament.fee_percentage / 100) *
                        item.bet_amount;
                      await walletModel.findOneAndUpdate(
                        { user_id: item?.user_id },
                        { $inc: { balance: parseFloat(winningPrice + item.bet_amount) } },
                        { new: true }
                      );


                      const getWallet = await walletModel.findOne({user_id:item?.user_id})

                     // console.log(
                      //   parseFloat(getWallet.balance) ,
                      //   getWallet.balance , winningPrice,
                      // );
  
                        const createTransactionObj = {
                          user_id:item?.user_id,
                          type:"CREDIT",
                          match_id:matchId,
                          match_name:"cricket",
                          no_of_token:parseFloat(winningPrice + item.bet_amount),
                          availablebalance:parseFloat(getWallet.balance + parseFloat(winningPrice + item.bet_amount)) ,
                          oldbalance:parseFloat(getWallet.balance ),
                          no_of_ball:liveBall,
                          no_of_over:liveOver,
                          betting_team:liveTeam
                        }
                        const createMatchTransactionHistory = await matchTransactionModel.create(createTransactionObj)





                    } else if (tournament.withdraw_type === "fixed") {
                      winningPrice = parseFloat(item.bet_amount);
                      await walletModel.findOneAndUpdate(
                        { user_id: item?.user_id },
                        { $inc: { balance: parseFloat(winningPrice + item.bet_amount) } },
                        { new: true }
                      );


                      const getWallet = await walletModel.findOne({user_id:item?.user_id})

                     // console.log(
                      //   parseFloat(getWallet.balance) ,
                      //   getWallet.balance , winningPrice,
                      // );
  
                        const createTransactionObj = {
                          user_id:item?.user_id,
                          type:"CREDIT",
                          match_id:matchId,
                          match_name:"cricket",
                          no_of_token:winningPrice,
                          no_of_token:parseFloat(winningPrice + item.bet_amount),
                          availablebalance:parseFloat(getWallet.balance + parseFloat(winningPrice + item.bet_amount)) ,
                          oldbalance:parseFloat(getWallet.balance ),
                          no_of_ball:liveBall,
                          no_of_over:liveOver,
                          betting_team:liveTeam
                        }
                        const createMatchTransactionHistory = await matchTransactionModel.create(createTransactionObj)

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
                    const findMatch =await matchModel.findOne({ match_key: matchId})
                    let deviceIds = [];
                    let alreadyDeviceSaved = await deviceModel.findOne({
                    user_id: item.user_id 
                    });
                    message = `you lose the ${findMatch.title} match on ${moment(findMatch .start_at * 1000).tz('Asia/Kolkata').format('llll')}`;
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
              }
            
              // }
              // }
            })
            .catch((err) => {
              console.log(err.message, "errormessage");
            });
        }
      }
    });
  } catch (error) {
    console.log(error.message, "errormeassadsadasdasd");
  }
};










// app.all('*', (req, res, next) => {
//   next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
// });
app.use(globalErrorHandler);

module.exports = app;
