const mongoose = require("mongoose");
const { Schema } = mongoose;
const assetSchema = new Schema(
  {
      symbol:{ type:String,default: null},
      price:{type:Number,default:0},
      coinname:{type:String,default: null},
      image:{type:String,default: null},
      status:{type:Number,default: null},
      shown:{type:Number,default: 1},
  },
  { timestamps: true }
);

const asset = mongoose.model("assets", assetSchema);
module.exports = asset;