const mysql = require("mysql2");

const db = mysql.createConnection({
    host:"localhost",
    user:"root",
    password:"Amruth@1950",
    database:"zeerostock"
});

db.connect((err) => {
    if(err){
        console.log("Database connection failed", err.message)
    }
    else{
        console.log("Connected to MySQL");
    }
});

module.exports = db;