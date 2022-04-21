const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const config = require("./config");
const http = require("http");
const socketIo = require("socket.io");
const { json } = require('body-parser');
const mysqlConnection = require('./database');
const router = express.Router();



const controlador = require("./controllers/Reportes.controller");

require("./database");
const Route = require("./routes/Reportes.routes");

const app = express();
const puerto = config.PORT;

const corsOptions = { origin: true, optionsSuccessStatus: 200 };
app.use(cors(corsOptions));
app.use(express.json({ extended: true }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.get("/", (req, res) => res.send("Welcome to my API!"));
app.use("/api", Route.routes);


var server = http.createServer(app);
const io = socketIo(
  server,
  {
    cors: {
      origin: "*",
      methods: ["GET", "POST"],
      transports: ["websocket", "polling"],
    },
  },
  (cors_allowed_origins = "*")
);

let interval;

io.on("connection", function (socket) {
  console.log("Made socket connection");
  if (interval) {
    clearInterval(interval);
  }
  if (socket.connected) {
    socket.on("redis", function (data) {
      interval = setInterval(() => {
        if (socket.connected) {
          getRedis();
        } else {
          clearInterval(interval);
        }
      }, 5000);
    });
    socket.on("tidb", function (data) {
      interval = setInterval(() => {
        if (socket.connected) {
          getTidb();
        } else {
          clearInterval(interval);
        }
      }, 5000);
    });

    socket.on("top10", function (data) {
      interval = setInterval(() => {
        if (socket.connected) {
          getTop10();
        } else {
          clearInterval(interval);
        }
      }, 5000);
    });

    socket.on("tidstats", function (data) {
      interval = setInterval(() => {
        if (socket.connected) {
          getStats();
        } else {
          clearInterval(interval);
        }
      }, 5000);
    });
    socket.on("disconnect", function (data) {
      console.log("Socket Disconnected");
      socket.disconnect();
      socket.connected = false;
    });
  }
});

async function getRedis() {
  console.log("RAM Emit")
  const messageData = await controlador.getRam();
  io.emit("ram", messageData);
}

async function getTidb() {

  console.log("TIDB Emit")
  let respuesta;
  mysqlConnection.query("SELECT * FROM Resultado", (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
     const hola=JSON.stringify(results)
    const jeje=JSON.parse(hola)
    console.log(jeje)
    io.emit("tidb", jeje);
  });  
}


async function getTop10() {

  console.log("TIDB Emit")
  let respuesta;
  mysqlConnection.query("SELECT winner, count(*) as victorias FROM Resultado GROUP BY winner ORDER BY count(*) DESC LIMIT 10;", (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
     const hola=JSON.stringify(results)
    const jeje=JSON.parse(hola)
    console.log(jeje)
    io.emit("top10", jeje);
  });  
}


async function getStats() {

  console.log("TIDB Emit")
  let respuesta;
  mysqlConnection.query("SELECT winner, count(*) as victorias FROM Resultado GROUP BY winner ORDER BY count(*) DESC", (error, results, fields) => {
    if (error) {
      return console.error(error.message);
    }
     const hola=JSON.stringify(results)
    const jeje=JSON.parse(hola)
    console.log(jeje)
    io.emit("tidstats", jeje);
  });  
}



async function getLOG() {
  console.log("LOG EMIT");
  const messageData = await controlador.getLog();
  io.emit("log", messageData);
}

server.listen(puerto, () => console.log(`listening on port ${puerto}!`));
