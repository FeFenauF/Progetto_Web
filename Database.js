const sql = require('sqlite3');
const db = new sql.Database('database.db', (err) => {
    if (err) throw err;
});

module.exports = db;