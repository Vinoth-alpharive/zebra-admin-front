const mongoose = require("mongoose");

const { Schema } = mongoose;
const bettingSchema = new Schema(
    {
      user_id:{type:mongoose.Types.ObjectId,ref:'AppUsers'},
      bet_amount:{type:Number,default:0,required: [true, 'Please Provide a bet amonut']},
      match_name:{type:String,required: [true, 'Please Provide a match name']},
      match_id:{type:String,required: [true, 'Please Provide a number of ball']},
      winning_percentage:{type:Number},
      winning_price:{type:Number,default:0},
      no_of_ball:{type:String,default:0,required: [true, 'Please Provide a number of ball']},
      no_of_run:{type:String,default:0},
      no_of_over:{type:String,default:0,required: [true, 'Please Provide a number of over']},
      wicket_type:{type:String},
      bet_type:{type:String,required:[true,"Please Provide a bet type"],enum:["run","wicket","extra"]},
      extra_description:{type:String},
      betting_count:{type:Number,default:0},
      betting_limit:{type:Number,default:0,required: [true, 'Please Provide a betting limit']},
      ball_action:{type:String,default:0},
      ball_action_text:{type:String},
      isWicket:{type:Boolean},
      betting_team_key:{type:String,enum:["1","2"]},
      betting_team:{type:String,enum:["home","away"]},
      status:{type:Number,enum:[0,1,2],default:0}, 
      status_text:{type:String},
      money_updated:{type:Boolean,default:false}
    },
  { timestamps: true }
);


const betting = mongoose.model("betting", bettingSchema);
module.exports = betting;