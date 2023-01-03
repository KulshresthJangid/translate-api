const db = require('mysql');
const connection = db.createConnection({
    host: "localhost",
    user: "kuldev",
    password: "kuldev",
    database: "translation_cache"
});

module.exports = connection;