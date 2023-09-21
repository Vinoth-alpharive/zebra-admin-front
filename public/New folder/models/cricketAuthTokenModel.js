const mongoose = require('mongoose');
const { Schema } = mongoose;

const cricketAuthToken = new Schema({
  cricket_auth_token: {
    type: String
  },
});

const CricketAuthSchema = mongoose.model('CricketAuthToken', cricketAuthToken);
module.exports = CricketAuthSchema;