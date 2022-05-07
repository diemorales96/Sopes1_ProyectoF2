import React, { useEffect, useRef, useState } from "react";
import { Contenedor } from "./NavBarElements";
import { Line,Bar, defaults } from "react-chartjs-2";
import Grafica from "./Grafica";
import GraficaBar from "./GraficaBarra";

class Pair {
  constructor(first, second){
      this.first = first;
      this.second = second;
  }
}

const baseUrl = "https://apirust9-4fgwmqspza-uc.a.run.app/get-all";

function Logs() {
  const [logs, setLogs] = useState([]);


  //-------REPORTE CANT DE INGRESOS POR COLA
  const rabitcount = useRef(0);
  const kafkacount = useRef(0);
  


  useEffect(() => {
    getOperations();
    rabitcount.current=0;
    kafkacount.current=0;

  }, [])

const contadorRabit=logs.map(({ game_id, players, game_name, winner_number,queue }, index) => {
      
  if(queue=="RabbitMQ"){
  rabitcount.current=rabitcount.current+1
  }else if (queue=="Kafka"){
    kafkacount.current=kafkacount.current+1
  }
  return (
    rabitcount.current
  );
})

function top3Repeated(arr, n)
    {
        // There should be atleast two elements
        if (n < 3) {
            //document.write("Invalid Input");
            return;
        }
 
        // Count Frequency of each element
        arr.sort((a, b) => a - b)
        let freq = new Map();
        for (let i = 0; i < n; i++)
            if (freq.has(arr[i].game_id))
                freq.set(arr[i].game_id, 1 + freq.get(arr[i].game_id));
            else
                freq.set(arr[i].game_id, 1);

        let x = new Pair();
        let y = new Pair();
        let z = new Pair();
        x.first = y.first = z.first = Number.MIN_SAFE_INTEGER;
 
        for (let curr of freq) {

            if (parseInt(curr[1]) > x.first) {
 
                // Update second and third largest
                z.first = y.first;
                z.second = y.second;
                y.first = x.first;
                y.second = x.second;
 
                // Modify values of x Number
                x.first = parseInt((curr[1]));
                x.second = parseInt((curr[0]));
            }

            else if (parseInt((curr[1])) > y.first) {
                // Modify values of third largest
                z.first = y.first;
                z.second = y.second;
 
                // Modify values of second largest
                y.first = parseInt((curr[1]));
                y.second = parseInt((curr[0]));
            }

            else if (parseInt((curr[1])) > z.first) {
 
                z.first = parseInt((curr[1]));
                z.second = parseInt((curr[0]));
            }
        }
        return [x.second, y.second, z.second]
    }



  const getOperations = async() => {
    await fetch(`${baseUrl}`, {
        method: 'GET',
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(resp => resp.json())
    .then(data => {
      console.log("Holaaaaaaa")
      console.log(data)
      setLogs(data)
    }).catch(console.error)
  }

  console.log(logs)
  console.log("Cantidad de logs de RabbitMq",rabitcount.current)
  console.log("Cantidad de logs de Kafka",kafkacount.current)
  console.log(top3Repeated(logs,logs.length))
  const games=top3Repeated(logs,logs.length)
  let flag=false
  let flag2=false
  let flag3=false
  let gamex="";
  let gamey="";
  let gamez="";
  const game1=logs.map(({ game_id, players, game_name, winner,queue }, index) => {
      if(flag==false){
    if(game_id==games[0]){
      flag=true
      gamex=game_name
      return game_name
    }
  }
    ;
  })

  const game2=logs.map(({ game_id, players, game_name, winner,queue }, index) => {
    if(flag2==false){
  if(game_id==games[1]){
    flag2=true
    gamey=game_name
    return game_name
  }
}
  ;
})

const game3=logs.map(({ game_id, players, game_name, winner,queue }, index) => {
  if(flag3==false){
if(game_id==games[2]){
  flag3=true
  gamez=game_name
  return game_name
}
}
;
})


  console.log("JUEGO MAS JUGADO ES:", gamex)
  

  return (
    <div>
      <Contenedor >
        <h1>{}</h1>
    <table className="table" border="2">
      <thead>
        <tr>
          <th>No</th>
          <th>game ID</th>
          <th>players</th>
          <th>game name</th>
          <th>winner</th>
          <th>queue</th>
        </tr>
      </thead>
      <tbody>
        {logs.map(({ game_id, players, game_name, winner_number,queue }, index) => {
          return (
            <tr>
              <td>
                <b>{index}</b>
              </td>
              <td>{game_id}</td>
              <td>{players}</td>
              <td>
                  {game_name}
              </td>
              <td>{winner_number}</td>
              <td>{queue}</td>
            </tr>
          );
        })}
      </tbody>
    </table>
    </Contenedor>

    <Contenedor>

      
      <GraficaBar axis={[gamex,gamey,gamez]} data={[3,2,1]} />
      <Grafica axis={["RabbitMq","Kafka"]} data={[rabitcount.current,kafkacount.current]} />


      </Contenedor>
    </div>
  );
}

export default Logs;