var PROTO_PATH = "./proto/juego.proto";

var grpc = require("@grpc/grpc-js");
var protoLoader = require("@grpc/proto-loader");

var amqp = require("amqplib/callback_api");

var packageDefinition = protoLoader.loadSync(PROTO_PATH, {
  keepCase: true,
  longs: String,
  enums: String,
  defaults: true,
  oneofs: true,
});
var juego_proto = grpc.loadPackageDefinition(packageDefinition).juego;

/* Conexion a la base de datos */
const mysqlConnection = require("./conn");

function addLog(call, callback) {
  console.log("Request: ", call.request);

  amqp.connect(
    "amqp://guest:guest@35.184.181.185",
    function (error0, connection) {
      if (error0) {
        throw error0;
      }
      connection.createChannel(function (error1, channel) {
        if (error1) {
          throw error1;
        }
        var exchange = "logs";

        channel.assertExchange(exchange, 'fanout', {
          durable: true
        });
        channel.publish(
          exchange,
          '',
          Buffer.from(JSON.stringify(call.request))
        );
        callback(null, { message: "Log enviado a rabbit sexual" });
      });
    }
  );
  /*
  const query = `INSERT INTO Game_Logs(game_id, players, game_name, winner_number, queue)
  VALUES(${call.request.game_id}, ${call.request.players}, 
    '${call.request.game_name}', ${call.request.winner_number}, 'sexo_queue');`; //'${call.request.queue}');`;
  mysqlConnection.query(query, function (err, rows, fields) {
    if (err) throw err;
    callback(null, { message: "Caso insertado en la base de datos" });
  });
  */
}

function getLogs(call) {
  const query =
    "SELECT game_id, players, game_name, winner_number, queue FROM Game_Logs;";

  mysqlConnection.query(query, function (err, rows, fields) {
    if (err) throw err;
    //console.log(rows.length)
    for (const data of rows) {
      //console.log(data);
      call.write(data);
    }
    call.end();
  });
}

function main() {
  var server = new grpc.Server();
  server.addService(juego_proto.Juegos.service, {
    addLog: addLog,
    getLogs: getLogs,
  });
  server.bindAsync(
    "0.0.0.0:50051",
    grpc.ServerCredentials.createInsecure(),
    () => {
      server.start();
      console.log("gRPC server on port 50051");
    }
  );
}

main();
