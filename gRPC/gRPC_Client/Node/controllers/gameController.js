const client = require("../client_gRPC");

exports.getLogs = async (req, res) => {
  const rows = [];

  const call = client.getLogs();
  call.on("data", function (data) {
    rows.push(data);
  });
  call.on("end", function () {
    console.log("Data obtenida con exito");
    res.status(200).json({ data: rows });
  });
  call.on("error", function (e) {
    console.log("Error al obtener la data", e);
  });
};

exports.execGame = async (req, res) => {
  let data_game;
  switch (req.body.game_id) {
    case 1:
      data_game = gameNumberOne(req.body.players);
      break;
    case 2:
      data_game = gameNumberTwo(req.body.players);

      break;
    case 3:
      data_game = gameNumberThree(req.body.players);

      break;
    case 4:
      data_game = gameNumberFour(req.body.players);

      break;
    case 5:
      data_game = gameNumberFive(req.body.players);
      break;
  }
  console.log("data_game: " + data_game);
  client.addLog(data_game, function (err, response) {
    res.status(200).json({ mensaje: response.message });
  });
};

function gameNumberOne(players_quantity) {
  return {
    game_id: 1,
    players: players_quantity,
    game_name: "Uno",
    winner_number: 3,
  };
}
function gameNumberTwo(players_quantity) {
  return {
    game_id: 2,
    players: players_quantity,
    game_name: "Dos",
    winner_number: 4,
  };
}
function gameNumberThree(players_quantity) {
  return {
    game_id: 3,
    players: players_quantity,
    game_name: "Tres",
    winner_number: 1,
  };
}
function gameNumberFour(players_quantity) {
  return {
    game_id: 4,
    players: players_quantity,
    game_name: "Cuatro",
    winner_number: 2,
  };
}
function gameNumberFive(players_quantity) {
  return {
    game_id: 5,
    players: players_quantity,
    game_name: "Cinco",
    winner_number: 13,
  };
}
