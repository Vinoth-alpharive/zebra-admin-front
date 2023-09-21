const twilio = require('twilio');

 async function sendSMS(message, to) {

    var twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
    var promise = new Promise(function (resolve, reject) {
      twilioClient.messages
        .create({
          body: `Gaming Verification Code: ${message}.\nDo not share this verification code to anyone. If this was not you, please inform support.`,
          from: process.env.SMS_NUMBER,
          to: to
        })
        .then(message => {  resolve(message); }).catch(err => { reject(err); });
    });
    var result = await promise;
    return result
}

async function sendForgotSMS(token, to) {

  var twilioClient = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);
  var promise = new Promise(function (resolve, reject) {
    twilioClient.messages
      .create({
         body: `Gaming reset pass code: ${token}.\nDo not share this verification code to anyone. If this was not you, please inform support.`,
        from: process.env.SMS_NUMBER,
        to: to
      })
      .then(message => { console.log(message,"msg"); resolve(message); }).catch(err => { console.log(err,"err");reject(err); });
  });
  var result = await promise;
  return result
}
module.exports = { sendSMS,sendForgotSMS };