import React from 'react'
import { Line,Bar, defaults, Pie } from "react-chartjs-2";

const Grafica=(props)=> {
    const axis=props.axis
    const dataa= props.data
    console.log("data enviada en props")
    console.log(dataa)
    console.log(axis)
  return (
    <div>        <Pie
    data={{
      labels: axis,
      datasets: [
        {
          label: "HOLA MUNDO",
          data: dataa,
              backgroundColor: [
      'rgb(255, 99, 132)',
      'rgb(54, 162, 235)',
      'rgb(255, 205, 86)'
    ],
    hoverOffset: 4,

          borderColor: "orange",
          borderWidth: 1,
        }
      ],
    }}
    height={400}
    width={400}
    options={{
      maintainAspectRatio: false,
      scales: {
        yAxes: [
          {
            ticks: {
              beginAtZero: true,
            },
          },
        ],
      },
      legend: {
        labels: {
          fontSize: 25,
        },
      },
    }}
  /></div>
  )
}

export default Grafica