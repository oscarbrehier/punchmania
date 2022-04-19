const mongoose = require('mongoose');

const WeekSchema = new mongoose.Schema({

    week: Number,
    lastChanged: Number

});

module.exports = mongoose.model('Week', WeekSchema);