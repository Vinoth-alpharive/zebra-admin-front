const mongoose = require("mongoose");

const { Schema } = mongoose;
const paymentTransactionSchema = new Schema(
    {
      user_id:{type:mongoose.Types.ObjectId,ref:  'AppUsers'},
      withdraw_model:{type:mongoose.Types.ObjectId,ref:'wallets'},
      payment_type:{type:Number,default:0},//coin payment -1
      transaction_type:{type:String,required: [true, 'Please Provide a transaction type']},// buy sell
      txId:{type:String,required: [true, 'Please Provide a transaction id']},
      asset:{type:String,required: [true, 'Please Provide a asset symbol']},
      transaction:{type:JSON,required: [true, 'Please Provide a transaction receipt']},
      no_of_token:{type:Number,default:0,required: [true, 'Please Provide a no of token']},
      price:{type:Number,default:0},
      totalPrice:{type:Number,default:0},
      status:{type:Number,default:0},
      status_text: {type:String}
    },
  { timestamps: true }
);


const paymentTransaction= mongoose.model("transactionpayments",paymentTransactionSchema);
module.exports = paymentTransaction;