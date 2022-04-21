import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import { Link } from 'react-router-dom';

import React from 'react'
import {Button} from 'reactstrap'
import { Contenedor, ContenedorA,Nav2 } from "./NavBarElements";
import GraficaTop from "./GraficaTop";
//import Button from 'react-bulma-components/lib/components/button';


function Redis() {
   const [games, setGames] = useState([]);
   const [players, setPlayers] = useState([]);

    const socket = useRef();
    const baseUrl = "https://sopes1-341605.uc.r.appspot.com";
    let aux;



    useEffect(() => {
        socket.current = io.connect("https://sopes1-341605.uc.r.appspot.com");
        console.log("Socket proc connected")
        const interval = setInterval(() => {
          //getInfo();
        }, 5000);

        socket.current.emit("tidb", "asd-prueba");
        socket.current.on("tidb", async (mensaje) => {
          console.log("Tidb");
            console.log(mensaje)
            llenar(mensaje)
        });

        console.log("sss")
    
        return () => {
          clearInterval(interval);
          console.log("Socket proc disconnected")
          socket.current.disconnect();
        };
      }, []);


      const getInfo = async () => {
        await fetch(`${baseUrl}`, {
          method: "GET",
        });
      };
    
      async function llenar(data) {
        console.log("Wenassssss");
        console.log(data);
        //console.log(data[0].vm)
        setGames((tot) => data.slice(-10));
        // setLista(oldArray => [...oldArray, data[data.length-1].process_list[data[data.length-1].process_list.length-1]])
      }



    

  return (
    <div>
              <ContenedorA >
                  <Nav2><h1 >ULTIMOS 10 JUEGOS</h1></Nav2>
    <table className="table" border="3">
      <thead>
        <tr>
          <th>No</th>
          <th>game ID</th>
          <th>game name</th>
          <th>winner</th>         
        </tr>
      </thead>
      <tbody>
        {games.map(({ game_id, game_name, winner }, index) => {
          return (
            <tr>
              <td>
                <b>{index+1}</b>
              </td>
              <td>{game_id}</td>
              <td>
                  {game_name}
              </td>
              <td>{winner}</td>
              
            </tr>
          );
        })}
      </tbody>
    </table>
    </ContenedorA>


    <Button variant="success"><Link to="/top10" className="btn btn-primary"><h1>VER TOP10 Players</h1></Link></Button>{' '}
    <Button variant="success"><Link to="/TidbStats" className="btn btn-primary"><h1>VER STATS DE PLAYERS</h1></Link></Button>{' '}

    </div>
  )
}

export default Redis