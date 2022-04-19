const mongoose = require('mongoose');

const TrackSchema = new mongoose.Schema({

    trackType: String,
    trackInfo: String,
    trackId: Number,
    trackIcon: String,
    timesVoted: Number,
    week: Number

});

module.exports = mongoose.model('Track', TrackSchema);