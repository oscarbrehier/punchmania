const mongoose = require('mongoose');

const ChannelSchema = new mongoose.Schema({

    channelId: Number,
    channelOwner: Number,
    
});

module.exports = mongoose.model('Channel', ChannelSchema);