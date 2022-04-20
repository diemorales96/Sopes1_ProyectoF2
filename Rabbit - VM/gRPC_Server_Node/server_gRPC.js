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

function addLog(call, callback) {
  console.log("Request: ", call.request);
  let data_game;
  switch (call.request.game_id) {
    case 1:
      data_game = gameNumberOne(call.request.players);
      break;
    case 2:
      data_game = gameNumberTwo(call.request.players);

      break;
    case 3:
      data_game = gameNumberThree(call.request.players);

      break;
    case 4:
      data_game = gameNumberFour(call.request.players);

      break;
    case 5:
      data_game = gameNumberFive(call.request.players);
      break;
  }
  console.log("data_game: " + data_game);
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
          Buffer.from(JSON.stringify(data_game))
        );
        callback(null, { message: "Log enviado a rabbit" });
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

function gameNumberOne(players_quantity) {
  return {
    game_id: 1,
    players: players_quantity,
    game_name: "Random",
    winner_number: Math.round(players_quantity),
    queue: "RabbitMQ"
  };
}
function gameNumberTwo(players_quantity) {
  return {
    game_id: 2,
    players: players_quantity,
    game_name: "Half Game",
    winner_number: players_quantity / 2,
    queue: "RabbitMQ"

  };
}
function gameNumberThree(players_quantity) {
  return {
    game_id: 3,
    players: players_quantity,
    game_name: "Thes Last One",
    winner_number: players_quantity,
    queue: "RabbitMQ"
  };
}
function gameNumberFour(players_quantity) {
  var ganador;
  while (true) {
    ganador = Math.round(players_quantity);
    if(ganador % 2 == 0){
      break;
    }
  }
  return {
    
    game_id: 4,
    players: players_quantity,
    game_name: "Even Game",
    winner_number: ganador,
    queue: "RabbitMQ"
  };
}
function gameNumberFive(players_quantity) {
  var ganador;
  while (true) {
    ganador = Math.round(players_quantity);
    if(ganador % 2 != 0){
      break;
    }
  }
  return {
    game_id: 5,
    players: players_quantity,
    game_name: "Odd Game",
    winner_number: ganador,
    queue: "RabbitMQ"

  };
}









function main() {
  var server = new grpc.Server();
  server.addService(juego_proto.Juegos.service, {
    addLog: addLog,
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
