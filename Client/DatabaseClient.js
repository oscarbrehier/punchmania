const mongoose = require('mongoose');
require('dotenv').config();

class DatabaseClient {

    constructor() { this.connection = null; }

    connect() {

        mongoose.connect(process.env.DATABASE_URI, {

            useNewUrlParser: true,
            useUnifiedTopology: true

        }).then(() => {

            console.log('[+] Database');
            this.connection = mongoose.connection;

        }).catch(err => { console.error(err); });

    }

}

module.exports = DatabaseClient;