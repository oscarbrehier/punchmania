const mongoose = require('mongoose')
require('dotenv').config();

class Database {

    constructor() {

        this.connection = null;

    }

    connect() {

        mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        }).then(() => {

            console.log('[+] Database');
            this.connection = mongoose.connection;

        }).catch(err => { console.error(err); });

    }

}

module.exports = Database;