const mongoose = require("mongoose");

const { Schema } = mongoose;
const betInfoSchema = new Schema(
    {
      status:{type:Number,default:0},
      ball_action:{type:Array},
      run:{type:Array},
      wicket:{type:Array},
      extra:{type:Array}
    },
  { timestamps: true }
);


const betInfoModel = mongoose.model("betInfo", betInfoSchema);
module.exports = betInfoModel;