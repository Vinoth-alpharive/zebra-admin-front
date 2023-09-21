const mongoose = require('mongoose');
const { Schema } = mongoose;

const deviceSchema = new Schema({
  push_token: {
    type: String,
  },
  os_version: {
    type: String,
  },
  device_model: {
    type: String,
  },
  os_type: { type: String },
  user_id: {
    type: Schema.Types.ObjectId,
    ref: 'AppUsers',
  },
  pushenabled: {
    type: Boolean,
    default: true,
  },
});

const DeviceInfo = mongoose.model('Device', deviceSchema);
module.exports = DeviceInfo;