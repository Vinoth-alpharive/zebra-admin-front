const mongoose = require("mongoose");

const { Schema } = mongoose;
const WalletSchema = new Schema(
    {
      user_id:{type:mongoose.Types.ObjectId,ref:  'AppUsers'},
      balance:{type: Number,default:0},
      withdraw_limit:{type:Number,default:0},
      maximum_withdraw:{type:Number,default:0},
      minimum_withdraw:{type:Number,default:0},
      escrow_balance:{type:Number,default:0},
      totalBalance:{type:Number,default:0},
      totalGain:{type:Number,default:0},
      totalLoss :{type:Number,default:0},
      status: {type: Number,default:0}
    },
  { timestamps: true }
);


const wallets = mongoose.model("adminwallets", WalletSchema);
module.exports = wallets;