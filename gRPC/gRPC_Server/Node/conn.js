var mysql      = require('mysql');
var mysqlConnection = mysql.createConnection({
  host     : 'localhost',
  user     : 'root',
  password : 'admin',
  database : 'so1_prueba'
});

mysqlConnection.connect(function (err){
    if(err){
        console.log(' Error al conectarse a la base de datos ',err);
    } else {
        console.log(' Conexión a la base de datos exitosa ');
    }
});

module.exports = mysqlConnection;