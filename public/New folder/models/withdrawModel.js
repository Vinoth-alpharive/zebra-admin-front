const mongoose = require("mongoose");

const { Schema } = mongoose;
const withdrawSchema = new Schema(
    {
      user_id:{type:mongoose.Types.ObjectId,ref:  'AppUsers',required: [true, 'Please Provide a user id']},
      time_created:{type:Number},
      status: {type:String,default:"0"},
      status_text: {type:String},
      tx_id:{type:String},
      transaction:{type:JSON},
      coin: {type:String,required: [true, 'Please Provide a valid currency']},
      transaction_type:{type:String,required: [true, 'Please Provide a transaction type']},
      no_of_token:{type:Number,required: [true, 'Please Provide a number of token']},
      live_price:{type:Number},
      totalPrice:{type:Number},
      amount: {type:Number},
      amountf: {type:String},
      send_address: {type:String,required: [true, 'Please Provide a send address']},
      send_txid: {type:String},
      withdraw_id:{type:String},
      remark:{type:String}
    },
  { timestamps: true }
);


const withdraws = mongoose.model("withdraw", withdrawSchema);
module.exports = withdraws;