'use strict';

const sqlite = require('sqlite3').verbose();

const DBSOURCE = `${__dirname}/database.db`;

const db = new sqlite.Database(DBSOURCE, (err) => {
    if (err) {
        // Cannot open database
        console.error(err.message);
        throw err;
    }
});

module.exports = db;
