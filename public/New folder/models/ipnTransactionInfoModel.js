const mongoose = require("mongoose");
const { Schema } = mongoose;
const  ipnTransactionInfoSchema = new Schema(
  {
    time_created:{type:Number},
    time_expires:{type:Number},
    status: {type:Number},
    status_text: {type:String},
    type: {type:String},
    coin: {type:String},
    amount: {type:Number},
    amountf: {type:String},
    received: {type:Number},
    receivedf: {type:String},
    recv_confirms: {type:Number},
    payment_address: {type:String},
    time_completed:{type:Number},
    send_tx: {type:String},
    buyTransactionId:{type:String},
    sender_ip: {type:String},
    txn_id:{type:String},
    userId:{type:mongoose.Types.ObjectId,ref:  'AppUsers',required: [true, 'Please Provide a user id'],},
  },
 
);
const ipnTransactionInfoModel = mongoose.model("ipntransactionInfo",ipnTransactionInfoSchema );
module.exports = ipnTransactionInfoModel;