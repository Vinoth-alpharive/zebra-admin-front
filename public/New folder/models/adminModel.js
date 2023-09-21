const mongoose = require("mongoose");
const { Schema } = mongoose;
const adminUserSchema = new Schema({
    email: {
      type: String,
      required: [true, 'Please provide a valid email'],
    },
    password: {
      type: String,
      required: [true, 'Please Provide a Password - Min. 8 Chars'],
      select: false,
    },
    name: {
      type: String,
      required: [true, 'Please Provide a valid Name'],
    },
    routes:{
     type:Object
    },
    active: {
      type: Boolean,
      default: true,
    },
    roleType: {
      type: String,
      enum: ['SUPERADMIN', 'ADMIN'],
      default: 'ADMIN',
    },
    is_first_log: {
      type: String,
      default:true,
    },
    createdBy: {
      type: Schema.Types.ObjectId,
      ref: 'AdminUser',
    },
    f2A_creds: {required: false,type: {state: {type: Boolean,default: false},temp_secret: {required: true,type: Object}} },
    f2A_enable: {type: Boolean,default: false},
    f2a_type: {type: Number,enum: { values: [0, 1, 2] }},
  },{ timestamps: true });
  const AdminUser = mongoose.model("AdminUser", adminUserSchema);
module.exports = AdminUser;