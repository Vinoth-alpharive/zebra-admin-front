const mongoose = require("mongoose");

const { Schema } = mongoose;
const WalletSchema = new Schema(
    {
      user_id:{type:mongoose.Types.ObjectId,ref:  'AppUsers'},
      // asset:{type:String},
      // totalToken:{type:Number,default:0},
      // address:{type:String},
      // pubping:{type:String},
      // pubpong:{type:String},
      // priping:{type:String},
      // pripong:{type:String},
      balance:{type: Number,default:0},
      escrow_balance:{type:Number,default:0},
      totalBalance:{type:Number,default:0},
      totalGain:{type:Number,default:0},
      totalLoss :{type:Number,default:0},
      status: {type: Number,default:0}
    },
  { timestamps: true }
);


const wallets = mongoose.model("wallets", WalletSchema);
module.exports = wallets;