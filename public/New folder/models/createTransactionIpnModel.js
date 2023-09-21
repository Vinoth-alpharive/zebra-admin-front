const mongoose = require("mongoose");
const { Schema } = mongoose;
const createIpnTransactionSchema = new Schema(
  {
    amount:{type:Number,default:0},
    live_price:{type:Number,default:0},
    txn_id: {type:String},
    address: {type:String},
    no_of_token:{type:Number},
    confirms_needed:{type:Number},
    timeout: {type:Number},
    checkout_url: {type:String},
    status_url: {type:String},
    qrcode_url: {type:String},
    coin_symbol:{type:String},
    userId:{type:mongoose.Types.ObjectId,ref:  'AppUsers',required: [true, 'Please Provide a user id'],},
    remark:{type:String},
  },
  { timestamps: true }
);
const createIpnTransactionModel = mongoose.model("deposit",createIpnTransactionSchema );
module.exports = createIpnTransactionModel;