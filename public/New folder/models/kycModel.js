const mongoose = require("mongoose");
const { Schema } = mongoose;
const kycSchema = new Schema(
  {
  firstName: {type: String},
  lastName: {type: String},
  phoneNumber :{type:Number,required: [true, 'Please Provide a valid phone number']},
  gender:{type:String,required: [true, 'Please Provide a gender']},
  dob:{type:String,required: [true, 'Please Provide a date of birth']},
  country:{type:String},
  state:{type:String},
  city:{type:String},
  postalCode:{type:Number,required: [true, 'Please Provide a postal code']},
  address:{type:String},
  documentType:{type:String,required: [true, 'Please Provide a document type']},
  documentIdNo:{type:String,required: [true, 'Please Provide a document id number']},
  documentFrontImg:{type:String,required: [true, 'Please Provide a document id front image']},
  documentBackImg:{type:String,required: [true, 'Please Provide a document id back image']},
  selfieImg:{type:String,required: [true, 'Please Provide a selfie image']},
  userId:{type:mongoose.Types.ObjectId,ref:  'AppUsers',required: [true, 'Please Provide a user id'],},
  remark:{type:String}
  },
  { timestamps: true }
);
const kycModel = mongoose.model("kyc",kycSchema );
module.exports = kycModel;