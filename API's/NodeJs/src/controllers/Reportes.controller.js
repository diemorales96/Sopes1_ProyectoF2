const Cpu = require("../models/Reportes.cpu");
const Ram = require("../models/Reportes.ram");
const Log = require("../models/Reportes.log");
const express = require('express');
const mysqlConnection = require('../database');
const router = express.Router();
const mysqlconnection = require('../database');


async function getData(req, res, next) {
  //console.log("Alooo")
  try {

    const tasks = await Cpu.find()
    .sort({$natural: -1})
    .limit(1)
    .then(
      function(doc) {
        return doc
      },
      function(err) {
        console.log('Error:', err);
      })
     return tasks;
    
  } catch (error) {
    console.log("ERROR: ", error)
    return {"Message":"Error"}
  }
}

async function getRam() {
    
    try {
  
      const tasks = await Ram.find();
      //console.log(tasks); 
      return tasks;
      
    } catch (error) {
      return {"Message":"Error"}
    }
  }




  async function getLog() {
    
    try {
  
      const tasks = await Log.find()
       return tasks;
      
    } catch (error) {
      console.log("ERROR: ", error)
      return {"Message":"Error"}
    }
  }


  async function getResult(req,res) {
    
    try {

  
      mysqlConnection.query("SELECT * FROM Resultado", (error, results, fields) => {
        if (error) {
          return console.error(error.message);
        }
         const hola=JSON.stringify(results)
        const jeje=JSON.parse(hola)
        console.log(jeje)
        return jeje;
    
      });
        
    
       
      
    } catch (error) {
      console.log("ERROR: ", error)
      return {"Message":"Error"}
    }
  }





module.exports = {
  getData,
  getRam,
  getLog,
  getResult,
};