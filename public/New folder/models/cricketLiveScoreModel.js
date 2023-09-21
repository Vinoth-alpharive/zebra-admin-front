const mongoose = require("mongoose");
const { Schema } = mongoose;
const matchLiveScore = new Schema(
  {
    match_id:{type:String},
    match_score_card:[{type:JSON}],
    match_info:{type:JSON},
  totalBetAmount:{type:Number}
  },
  { timestamps: true }
);
const cricketLiveScore = mongoose.model("cricketlivescore",matchLiveScore );
module.exports = cricketLiveScore;