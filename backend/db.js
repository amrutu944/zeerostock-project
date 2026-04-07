const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "maglev.proxy.rlwy.net",
  user: "root",
  password: "Amruth@1950",   // replace ********
  database: "railway",
  port: 58940
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed ❌", err);
  } else {
    console.log("Connected to Railway MySQL ✅");
  }
});

module.exports = db;