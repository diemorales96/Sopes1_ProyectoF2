const mysql = require('mysql');

const mysqlConnection = mysql.createConnection({
  host: '34.122.236.108',
  user: 'root',
  port: 4000,
  password: '',
  database: 'Fase2Sopes1',
  multipleStatements: true
});

console.log("BASEEEEEE")
mysqlConnection.connect(function (err) {
  if (err) {
    console.error(err);
    return;
  } else {
    console.log('db is connected');
  }
});

module.exports = mysqlConnection;