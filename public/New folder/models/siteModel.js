const mongoose = require("mongoose");

const { Schema } = mongoose;
const siteSchema = new Schema(
    {
      name:{type:String},
      key:{type:String},
      description:{type:String},
    },
  { timestamps: true }
);



const siteModel= mongoose.model("siteDetails",siteSchema);
module.exports = siteModel;