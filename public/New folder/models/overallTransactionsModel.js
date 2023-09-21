const mongoose = require("mongoose");


const { Schema } = mongoose;
const overallTransactionSchema = new Schema(
  {
      user_id:{type:mongoose.Types.ObjectId,ref:  'AppUsers'},
      coin :{type:String},
      type :{type:String,enum: { values: ['BUY','SELL','DEPOSIT','WITHDRAW',"CREDIT","DEBIT"] }},
      credit:{type:Number,default:0},
      debit:{type:Number,default:0},
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


const overallTransaction = mongoose.model("overallTransactions", overallTransactionSchema);
module.exports = overallTransaction;
