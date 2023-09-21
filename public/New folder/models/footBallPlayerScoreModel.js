const mongoose = require("mongoose");
const { Schema } = mongoose;
const footBallPlayerScores = new Schema(
  {
    match_id:{type:String},
    players:{type:Array},
    time_goal:{type:Array}

  },
  { timestamps: true }
);
const footBallPlayerScore = mongoose.model("footBallPlayerScore",footBallPlayerScores );
module.exports = footBallPlayerScore;