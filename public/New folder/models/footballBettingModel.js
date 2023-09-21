const mongoose = require("mongoose");
const { Schema } = mongoose;
const footBall = new Schema(
  {
    match_id:{type:String},
    user_id:{type:mongoose.Types.ObjectId,ref:  'AppUsers'},
 winning_team_name:{type:String,default:""},
winning_price:{type:Number,default:0},
    total_bet:{type:Boolean,default:false},
    first_half_bet:{type:Boolean,default:false},
    second_half_bet:{type:Boolean,default:false},
    winning_team:{type:Boolean,default:false},
    double_chance:{type:Boolean,default:false},
    double_chance_reason:{type:String,default:''},
    away_team_first_half_bet:{type:Boolean,default:false},
    away_team_second_half_bet:{type:Boolean,default:false},
    home_team_first_half_bet:{type:Boolean,default:false},
    home_team_second_half_bet:{type:Boolean,default:false},
    home_team_bet:{type:Boolean,default:false},
    away_team_bet:{type:Boolean,default:false},
    is_player_bet:{type:Boolean,default:false},
    player_id:{type:String,default:""},
 player_name:{type:String,default:""},
    no_of_goals:{type:Number,default:0},
    bet_amount:{type:Number,default:0},
    bet_count:{type:Number,default:0},
    status:{type:Number,default:0},
    time_bet:{type:Boolean,default:false},
    betting_team:{type:String,default:""},
    time:{type:String,default:""},
  },
  { timestamps: true }
);
const footBallBet = mongoose.model("footBallBets",footBall);
module.exports = footBallBet;