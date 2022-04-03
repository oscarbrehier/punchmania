const { VoiceClient } = require('djs-voice');
const client = require('../index');

const voiceClient = new VoiceClient({
    allowBots: false,
    client: client,
    debug: true,
    mongooseConnectionString: process.env.MONGO_URI
});

module.exports = voiceClient;