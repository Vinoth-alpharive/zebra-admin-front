const mongoose = require("mongoose");
const { Schema } = mongoose;
const footBallLiveScore = new Schema(
  {
    match_id:{type:String},
    total_goal:{type:Number,default:0},
    first_half_goal:{type:Number,default:0},
    second_half_goal:{type:Number,default:0},
    winning_team:{type:String,default:""},
    double_chance:{type:Boolean,default:false},
    away_team_first_half_goal:{type:Number,default:0},
    away_team_second_half_goal:{type:Number,default:0},
    home_team_first_half_goal:{type:Number,default:0},
    home_team_second_half_goal:{type:Number,default:0},
    home_team_goal:{type:Number,default:0},
    away_team_goal:{type:Number,default:0},
    players:{type:Array}


  },
  { timestamps: true }
);
const footBallliveScore = mongoose.model("footBallLivescore",footBallLiveScore );
module.exports = footBallliveScore;