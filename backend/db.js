const mysql = require("mysql2");

const db = mysql.createConnection({
  host: "shortline.proxy.rlwy.net",
  user: "root",
  password: "IsaqqJtYDePDbeNvZcvJCURjLJiqGxNx",   // replace stars
  database: "railway",
  port: 16798,
//   connectTimeout: 10000
});

db.connect((err) => {
  if (err) {
    console.error("DB connection failed ❌", err);
  } else {
    console.log("Connected to Railway MySQL ✅");
  }
});

module.exports = db;