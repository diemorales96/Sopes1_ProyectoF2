import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";


import React from 'react'
import {Button} from 'reactstrap'
import { Link } from 'react-router-dom';
import { Contenedor, ContenedorA,Nav2 } from "./NavBarElements";


function GraficaTop() {
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
        socket.current.emit("top10", "asd-prueba");
        socket.current.on("top10", async (mensaje) => {
          console.log("TidbTOP10");
            console.log(mensaje)
            llenar2(mensaje)
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
    


      async function llenar2(data) {
        console.log("Wenassssss");
        console.log(data);
        //console.log(data[0].vm)
        setPlayers((tot) => data);
        // setLista(oldArray => [...oldArray, data[data.length-1].process_list[data[data.length-1].process_list.length-1]])
      }
    
    

  return (
    <div>
        <ContenedorA>
    
                  <Nav2><h1 >TOP 10 JUGADORES</h1></Nav2>
    <table className="table" border="3">
      <thead>
        <tr>
          <th>No</th>
          <th>Jugador</th>
          <th>Victorias</th>        
        </tr>
      </thead>
      <tbody>
        {players.map(({ winner, victorias}, index) => {
          return (
            <tr>
              <td>
                <b>{index+1}</b>
              </td>
              <td>{winner}</td>
              <td>{victorias}</td>
              
            </tr>
          );
        })}
      </tbody>
    </table>
    </ContenedorA>

    <Button variant="success"><Link to="/Redis" className="btn btn-primary"><h1>LAST 10 GAMES</h1></Link></Button>{' '}
    <Button variant="success"><Link to="/TidbStats" className="btn btn-primary"><h1>VER STATS DE PLAYERS</h1></Link></Button>{' '}



    </div>
  )
}

export default GraficaTop