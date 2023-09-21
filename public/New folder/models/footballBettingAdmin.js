const mongoose = require('mongoose')

const { Schema } = mongoose
const footballBettingAdmin = new Schema(
  {
    game: { type: String, required: [true, 'Please Provide a game name'] },
    match_id: { type: String },
    home_team_name:{type:String},
    away_team_name:{type:String},
  home_team_logo:{type:String},
    away_team_logo:{type:String},
    match_time:{type:Number},
    match_name:{type:String},
    betting_price: { type: String },
    winning_amount: {
      type: String,
      required: [true, 'Please Provide a bet amount'],
    },
    bet_limit: {
      type: String,
      required: [true, 'Please Provide a minimum bet limit'],
    },
    withdraw_type: {
      type: String,
      enum: ['fixed', 'percentage'],
      default: 'percentage',
    },
    fee_percentage: { type: Number },
    status: { type: Number, default: 1 },
    total_bet_amount:{type:Number}
  },

  { timestamps: true },
)

const adminFootballBetting = mongoose.model(
  'footballBettingAdmin',
  footballBettingAdmin,
)
module.exports = adminFootballBetting
