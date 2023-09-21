var https = require('https');

async function sendNotification(deviceIds = [], message,data=null) {
  if (!deviceIds.length) {
    return new Promise((resolve, reject) => {
      resolve({});
    });
  }
  let restKey = process.env.ONESIGNAL_SERVER_KEY;
  let oneSignalAppId = process.env.ONESIGNAL_APPID;

  var headers = {
    'Content-Type': 'application/json; charset=utf-8',
    Authorization: `Basic ${restKey}`,
  };

  var pushMessage = {
    app_id: oneSignalAppId,
    contents: { en: message },
    data:data,
    include_player_ids: deviceIds
  };
  console.log('pushMessage', pushMessage);

  var options = {
    host: 'onesignal.com',
    port: 443,
    path: '/api/v1/notifications',
    method: 'POST',
    headers: headers,
  };

  return new Promise((resolve, reject) => {
    var req = https.request(options, function (res) {
      res.on('data', function (data) {
        console.log('Response:');
        console.log(JSON.parse(data));
        resolve(JSON.parse(data));
      });
    });

    req.on('error', function (e) {
      console.log('ERROR:');
      console.log(e);
      reject(e);
    });

    req.write(JSON.stringify(pushMessage));
    req.end();
  });
}
module.exports = { sendNotification };