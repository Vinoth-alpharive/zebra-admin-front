const mongoose = require("mongoose");

const { Schema } = mongoose;
const gameSchema = new Schema(
    {
      status:{type:Number,default:0},
      name:{type:String},
      gameImage:{type:String},
      backgroundImage:{type:String},
      createdBy: {
        type: Schema.Types.ObjectId,
        ref: 'AdminUser',
      }
    },
  { timestamps: true }
);


const gameModel = mongoose.model("game", gameSchema);
module.exports = gameModel;