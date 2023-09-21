const mongoose = require("mongoose");

const { Schema } = mongoose;
const tokenSchema = new Schema(
    {
        token_address:{type:String,required: [true, 'Please Provide a token address']},
        token_symbol:{type:String,required: [true, 'Please Provide a token symbol']}, 
        contract_abi:{type:JSON,required: [true, 'Please Provide a contract abi code']}, 
        decimal:{type:Number,required: [true, 'Please Provide a decimal number']}, 
        supply :{type:Number,required: [true, 'Please Provide a supply']},
        total_purchse:{type:Number,default:0}, 
        total_sell:{type:Number,default:0}, 
        min_buy:{type:Number,default:0},
        max_sell:{type:Number,default:0},
        comission:{type:Number,default:0},
        status:{type:Number,default:0}
    },
  { timestamps: true }
);


const tokens = mongoose.model("tokens", tokenSchema);
module.exports = tokens;