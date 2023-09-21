const server = require('../server');

console.log(server)

async function emitMessage(conversation, data) {
  try {
    server.socketIO.emit(conversation, data);
    return true;
  } catch (error) {
    console.error('send-email-error', error);
  }
}
module.exports = { emitMessage };
