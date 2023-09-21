const mongoose = require("mongoose");
const { Schema } = mongoose;
const appUserSchema = new Schema(
  {
    signup_type: {type: String,required: [true, 'Please Provide a signup type'],enum: { values: [1, 2] }},
    emailVerificationCode: {type: Number},
    mobileVerificationCode: {type: Number},
    email_otp: {type: Number},
    mobile_otp: {type: Number},
    forgot_otp:{type:Number},
    email: {type: String,default:""},
    emailVerifiedAt: {type: Date},
    mobileVerifiedAt: {type: Date},
    password: {type: String,trim: true,minlength: 8,required: [true, 'Please Provide a Password - Min. 8 Chars']},
    phoneNumber: {type: Number,maxlength: 12,default:0},
    email_verify: {type: Boolean,default: false},
    mobile_verify: {type: Boolean,default: false},
    kyc_status: {type: Number,enum: { values: [0, 1, 2, 3] },default: 0},
    status: {type:Number,default:0},
    reason: {type: String},
    is_logged: {type: Boolean,default: false},
    is_address:{type: Boolean,default: false},
    ipAddress: {type: String},
    device_info: {type: String},
    location: {type: String},
    referral_id: {type: String},
    parent_id:{type:String},
    refered_by: {type: String,default: null,},
    f2A_creds: {required: false,type: {state: {type: Boolean,default: false},temp_secret: {required: true,type: Object}} },
    f2A_enable: {type: Boolean,default: false},
    f2a_type: {type: Number,enum: { values: [0, 1, 2] }},
    otpExpire: {type: Date,default: Date.now},
    coverPicture:{type:String},
    profilePicture:{type:String},
    name:{type:String,default:""},
    twofa:{type:String,enum: { values: ["email_otp", "google_otp","mobile_otp"] }},
  },
  { timestamps: true }
);
const AppUser = mongoose.model("AppUsers", appUserSchema);
module.exports = AppUser;
