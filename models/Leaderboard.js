const mongoose = require('mongoose');

const LeaderboardSchema = new mongoose.Schema({

    week: Number,
    sent: Boolean

});

module.exports = mongoose.model('Leaderboard', LeaderboardSchema);