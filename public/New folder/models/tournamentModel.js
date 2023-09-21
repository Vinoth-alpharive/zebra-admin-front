const mongoose = require("mongoose");

const { Schema } = mongoose;
const tournamentSchema = new Schema(
    {
        game:{type:String,required: [true, 'Please Provide a game name']},
        status:{type:Number,default:1},
        winning_amount:{type:Number},
        tournament_info:{type:JSON,required: [true, 'Please Provide a tournament info']},
        tournament_id:{type:String,required: [true, 'Please Provide a tournament id']},
        tournament_image:{type:String,required: [true, 'Please Provide a tournament image']},
        cup_image:{type:String},
        summary:{type:String},
        match_info:{type:JSON},
        match_details:{type:JSON},
        bet_amount:{type:Number,required: [true, 'Please Provide a bet amount']},
        bet_limit:{type:Number,required: [true, 'Please Provide a minimum bet amount']},
        withdraw_type: {type: String,enum: ['fixed', 'percentage'],default: 'percentage'},
        fee_percentage:{type:Number}
    },
  { timestamps: true }
);


const tournaments = mongoose.model("tournament", tournamentSchema);
module.exports = tournaments;