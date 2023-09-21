const mongoose = require('mongoose')
const dotenv = require('dotenv')
// const express = require('express')
// const app = express()
dotenv.config({ path: './config.env' })
const http = require('http')
const app = require('./app')
const server = http.createServer(app)
const { Server } = require('socket.io')
const mqtt = require('mqtt')
const host = 'mq.thesports.com'
const portt = '443'
const clientId = `mqtt_${Math.random().toString(16).slice(3)}`
const footBallLiveScoreModel = require('./models/footballScoreModel')
const footBallBetModel =require('./models/footballBettingModel')
const footBallAdminBetModel = require('./models/footballBettingAdmin')
const footBallPlayerScoreModel = require('./models/footBallPlayerScoreModel')
const walletModel = require('./models/walletModel')
const matchTransactionModel=require('./models/matchTransactionHistory')


const wss = new Server(server, {
  cors: {
    origin: '*',
  },
})

const betChecking =async(e)=>{
  const findBetMatch =await footBallBetModel.find({match_id:e,status:{$eq:0},time_bet:true}).lean()
  const time_match = await footBallPlayerScoreModel.findOne({ match_id: e }).exec()
  if(time_match?.players !== undefined && findBetMatch !== undefined){
    let update ={}
    findBetMatch?.forEach(async(a)=>{
      let splitAns =a.time.split("-");
      const arr = time_match.players.filter(({ time }) => splitAns[0]<= time && splitAns[1]>=time)
      if(arr.length ===parseInt(a.no_of_goals)){
        update.status=2
      }else{
        update.status =1
      }
       const updateData = await footBallBetModel.findOneAndUpdate({_id:a._id},{$set:update},{new:true})
      })
  }

const findPlayerBetMatch =await footBallBetModel.find({match_id:e,status:{$eq:0},is_player_bet:true}).lean()
  const player_match = await footBallPlayerScoreModel.findOne({ match_id: e }).exec()

  if(player_match?.players !== undefined &&findPlayerBetMatch !== undefined){
    let update ={}
    findPlayerBetMatch?.forEach(async(a)=>{
      let player =a.player_id;
      const arr = player_match.players.filter(({ player_id }) => player ===player_id)
      if(arr.length ===parseInt(a.no_of_goals)){
        update.status=2
      }else{
        update.status =1
      }
       const updateData = await footBallBetModel.findOneAndUpdate({_id:a._id},{$set:update},{new:true})
      })
}

  const betMatch = await footBallBetModel.find({match_id:e,status:{$eq:0}})
  const socreData = await footBallLiveScoreModel.findOne({match_id:e})
  const betAdmin = await footBallAdminBetModel.findOne({match_id:e})
  if(betMatch !==undefined){
  betMatch.forEach(async(item)=>{
    let update ={}
    try {
      if(item.total_bet ===true){
        if(socreData.total_goal ===parseInt(item.no_of_goals)){
         update.status =2
        }else{
         update.status =1
        }
       }else if(item.first_half_bet ===true){
         if(socreData.first_half_goal ===parseInt(item.no_of_goals)){
           update.status =2
          }else{
           update.status =1
          }
       }else if(item.second_half_bet===true){
         if(socreData.second_half_goal ===parseInt(item.no_of_goals)){
           update.status =2
          }else{
           update.status =1
          }
       }else if(item.winning_team===true){
         if(socreData.winning_team ===item.winning_team_name){
           update.status =2
          }else{
           update.status =1
          }
       }else if(item.double_chance===true){
       let splitAns =item.double_chance_reason.split("_");
           if(socreData.double_chance ===true){
           update.status =2
          }else if(socreData.winning_team ===splitAns[0] && splitAns[2]==="win"){
           update.status =2
          }else if(socreData.winning_team !==splitAns[0] && splitAns[2]==="lose"){
           update.status =2
          }else{
           update.status =1
          }
       }else if(item.away_team_first_half_bet===true){
         if(socreData.away_team_first_half_goal ===parseInt(item.no_of_goals)){
           update.status =2
          }else{
           update.status =1
          }
       }else if(item.away_team_second_half_bet===true){
         if(socreData.away_team_second_half_goal ===parseInt(item.no_of_goals)){
           update.status =2
          }else{
           update.status =1
          }
       }else if(item.home_team_first_half_bet===true){
         if(socreData.home_team_first_half_goal ===parseInt(item.no_of_goals)){
           update.status =2
          }else{
           update.status =1
          }
       }else if(item.home_team_second_half_bet===true){
         if(socreData.home_team_second_half_goal ===parseInt(item.no_of_goals)){
           update.status =2
          }else{
           update.status =1
          }
       }else if(item.home_team_bet===true){
         if(socreData.home_team_goal===parseInt(item.no_of_goals)){
           update.status =2
          }else{
           update.status =1
          }
       }else if(item.away_team_bet===true){
         if(socreData.away_team_goal===parseInt(item.no_of_goals)){
           update.status =2
          }else{
           update.status =1
          }
       }
      const updateData = await footBallBetModel.findOneAndUpdate({_id:item._id},{$set:update},{new:true})
    } catch (error) {
      console.log(error);
    }
  })
  }
  const bet_user = await footBallBetModel.find({match_id:e})
  const win_users = await footBallBetModel.find({match_id:e,status:{$eq:2}})
  const total_amount = await parseInt(bet_user.length)* parseInt(betAdmin['betting_price'])
  const win_price = parseInt(total_amount)/(win_users.length===0?1:win_users.length)
  const updateData = await footBallBetModel.updateMany({match_id:e,status:{$eq:2}},{$set:{winning_price:win_price}},{new:true})
  const betWinners =await footBallBetModel.find({match_id:e,status:{$eq:2}}).lean();
  if(betWinners !==undefined){
    betWinners.forEach(async(item)=>{
      const walletData = await walletModel.findOne({user_id:item.user_id}).lean();
    const createTransactionObj = {
              user_id:item.user_id,
              type:"CREDIT",
              match_id:e,
              match_name:"football",
              no_of_token:item.bet_amount,
              availablebalance:parseInt(walletData.balance)+ parseInt(win_price)  ,
              oldbalance: parseInt(walletData.balance)
            }
           await matchTransactionModel.create(createTransactionObj)
           await walletModel.findOneAndUpdate({user_id:item.user_id},{$set:{balance:parseInt(walletData.balance)+ parseInt(win_price)}},{new:true})

    })
  } 
 return null

}
try {
  const connectUrl = `wss://${host}:${portt}/mqtt`
  const client = mqtt.connect(connectUrl, {
    clientId:clientId,
    clean: true,
    username: 'letswin',
    password: '16cc25272dc062bc8452b3d94a00bbb7',
    rejectUnauthorized: false,
    retain:false,
    protocol: "wss",
    connectTimeout: 4000,
    reconnectPeriod: 1000
  })
 
  let topic='thesports/football/match/v1'
  client.on("connect", () => {
    console.log("Connected");
    client.subscribe([topic], () => {
      console.log(`Subscribe to topic '${topic} '`);
    });
    // client.publish(
    //   topic,
    //   "nodejs mqtt test",
    //   { qos: 0, retain: false },
    //   (error) => {
    //     if (error) {
    //       console.error(error);
    //     }
    //   }
    // );
  });
  client.on("message", (topic, payload) => {
  try{
    JSON.parse(payload.toString()).forEach(async(e)=>{

  // try {
  //   if(e?.score !==undefined){
 
  //     if(e?.score[1]===2){
  //       const findData = await footBallScoreModel.findOne({match_id:e.id}).lean()
  //       if(!findData){
  //         const createData = await footBallScoreModel.create({match_id:e.id})
  //       }
  //     }
  
  //    }
  // } catch (error) {
  //   console.log(error);
  // }
  // const data =async()=>{
  // let a= await betChecking("y0or5jhz9gzdqwz")
  // }
  // data()
try {
  if(e?.score !==undefined){
console.log(e.id,"llll")
    if(e?.score[1]===8){
      const admin_match = await footBallAdminBetModel.findOne({ match_id: e?.score[0] }).exec()
      // console.log(admin_match,"admin_match");
      if(admin_match){
        const find_match = await footBallLiveScoreModel.findOne({ match_id: e?.score[0] }).exec()
        // console.log(find_match,"find_match");
        if(find_match ===null){
          var saveDetails = { 
            match_id:e?.id };
          const saveInfo = new footBallLiveScoreModel(saveDetails);
          const create_data = await saveInfo.save();

          // console.log(create_data,"create data");
        }
      }
      let sendData ={}
      if(e?.score[2][0] > e?.score[3][0]){
      sendData.winning_team="home"
     }else if(e?.score[2][0] === e?.score[3][0]){
      sendData.double_chance =true
      sendData.winning_team="tie"
     }else{
      sendData.winning_team="away"
     }
      sendData.match_id =e.id
      sendData.total_goal = parseInt(e?.score[2][0])+parseInt(e?.score[3][0])
      sendData.home_team_goal=parseInt(e?.score[2][0])
      sendData.away_team_goal=parseInt(e?.score[3][0])
      sendData.away_team_first_half_goal =parseInt(e?.score[3][1])
      sendData.away_team_second_half_goal =parseInt(e?.score[3][0])-parseInt(e?.score[3][1])
      sendData.home_team_first_half_goal =parseInt(e?.score[2][1])
      sendData.home_team_second_half_goal =parseInt(e?.score[2][0])-parseInt(e?.score[2][1])
      sendData.first_half_goal =parseInt(sendData.home_team_first_half_goal)+parseInt(sendData.away_team_first_half_goal)
      sendData.second_half_goal =parseInt(sendData.home_team_second_half_goal)+parseInt(sendData.away_team_second_half_goal)
      delete sendData.match_id;
      const update =await footBallLiveScoreModel.findOneAndUpdate({match_id:e.id},{$set:sendData},{new:true})
      if(update){
      const betRes =await betChecking(e.id)
      }
    }
  
  }
} catch (error) {
  console.log(error);
}
try {
  if(e?.incidents !==undefined){
    const admin_match = await footBallAdminBetModel.findOne({ match_id: e?.id }).exec();
    if(admin_match){
      var result = e?.incidents.filter(play =>{
        if(Object.keys(play).length>3 && play.player_id!==undefined && play.home_score!==undefined &&play.away_score!==undefined){
          return play;
        }
      })
      const player_match = await footBallPlayerScoreModel.findOne({ match_id: e?.id }).exec()
      if(player_match){
        const player_match = await footBallPlayerScoreModel.findOneAndUpdate({ match_id: e?.id },{$set:{players:result}})
      }else{
        let insertData ={}
        insertData.match_id= e?.id
        insertData.players=result
        const create_data = await footBallPlayerScoreModel.create(insertData)
      }
      const findBetMatch =await footBallBetModel.find({match_id:e?.id,status:{$eq:0},time_bet:true}).lean()
      const time_match = await footBallPlayerScoreModel.findOne({ match_id: e?.id }).exec()
      if(findBetMatch.players !== undefined){
      findBetMatch.players.forEach(async(a)=>{
        let update ={}
          time_match.forEach(async(b)=>{
          let splitAns =a.time.split("-")
          if(splitAns[0]<= b.time && splitAns[1]>=b.time){
            let score =parseInt(b.home_score)+parseInt(b.away_score)
            if(score ===a.no_of_goals){
             update.status =2
            }
          }
           const updateData = await footBallBetModel.findOneAndUpdate({_id:a._id},{$set:update},{new:true})
          })
          console.log(update,a.id)
      })
    }
    }
    }   
} catch (error) {
  console.log(error);
}
    })
  }catch(e){
console.log(e,"lp");
 } });
  
  
  client.on('error',(e)=>{
  console.log(e,"error");
  }) 
} catch (error) {
  console.log(error);
}



const socketIO = wss.on('connection', function (socket) {
  console.log(socket.id,"connected");
return socket
});
const DB = process.env.DATABASE.replace(
  '<password>',
  process.env.DATABASE_PASSWORD,
)

// const DB = process.env.DATABASE;
// const dta=async()=>{
//   const betMatchh = await footBallBetModel.find({status:{$eq:0}})
//   console.log(betMatchh.length,"ll");

// }
// dta()
mongoose
  .connect(DB, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
  })
  .then(() => console.log('DB connection successful!'))
  .catch((err) => console.log(err))

const port = process.env.PORT || 5000
server.listen(port, () => {
  console.log(`App running on port ${port}...`)
})

// getDepositHistory()
process.on('uncaughtException', (err) => {
  // console.log('UNCAUGHT EXCEPTION! 💥 Shutting down...');
  //console.log(err.name, err.message);
  process.exit(1)
})

process.on('unhandledRejection', (err) => {
  // console.log(err);
  // console.log('UNHANDLED REJECTION! 💥 Shutting down...');
  //console.log(err.name, err.message);
  server.close(() => {
    process.exit(1)
  })
})

process.on('SIGTERM', () => {
  //console.log('👋 SIGTERM RECEIVED. Shutting down gracefully');
  server.close(() => {
    // console.log('💥 Process terminated!');
  })
})

module.exports.socketIO = socketIO
