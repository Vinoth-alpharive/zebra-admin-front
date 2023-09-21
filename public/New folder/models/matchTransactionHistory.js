const mongoose = require("mongoose");


const { Schema } = mongoose;
const matchTransactionSchema = new Schema(
  {
      user_id:{type:mongoose.Types.ObjectId,ref:  'AppUsers'},
      coin :{type:String},
      type :{type:String,enum: { values: ["CREDIT","DEBIT"] }},
      match_name:{type:String},
      match_id:{type:String},
      no_of_over:{type:String},
      no_of_ball:{type:String},
      betting_team:{type:String},
      totalPrice:{type:Number,default:0},
      no_of_token:{type:Number,default:0},
      price:{type:Number,default:0},
      oldbalance:{type:Number,default:0},
      availablebalance:{type:Number,default:0},
      remark :{ type:String},
      updatefrom:{type:String,enum :{ values:['user','admin']}},
      actionfrom:{type:String},
      actionid:{type:mongoose.Types.ObjectId,ref:'AdminUser'}
  },
  { timestamps: true }
);


const  matchTransaction = mongoose.model("matchTransactions", matchTransactionSchema);
module.exports = matchTransaction;
