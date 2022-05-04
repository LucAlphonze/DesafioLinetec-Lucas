import React, { useEffect } from 'react';
import axios from 'axios';
import { Chart } from "react-google-charts";
import './App.css';

export const options = {
  title: "Voltajes",
  is3D: true,
  slices: [{color: 'black'}, {}, {}, {color: 'red'}]
};

function App() {
  const [corrienteData, setCorrienteData] = React.useState([
    [
      "Corrientes",
      "voltaje",
      { role: "style" },
    ]
  ]);
  const [dataTensiones, setDataTensiones] = React.useState([
    ["Tensiones", "valores"],
  ]);
  const [dataEnergias, setDataEnergias] = React.useState([
    ["Resto del promedio de energias", "Energia_Activa", "Energia_Aparente", "Energia_Reactiva"],
  ]);
  const [dataPotencias, setDataPotencias] = React.useState([
    ["Potencias", "Activa", "Aparente", "Reactiva"],
  ]);
  const [dataPotenciaTotal, setDataPotenciaTotal] = React.useState([
    ["Valor", "Factor de potencia total"],
  ]);

  useEffect(() => {
    axios.get('http://localhost:5000/data/all')
    .then(res => {

      // Variables
      let Corriente_L1 = 0
      let Corriente_L2 = 0
      let Corriente_L3 = 0
      let Tension_L1_N = 0
      let Tension_L2_N = 0
      let Tension_L3_N = 0
      let Energia_Activa = 0
      let Energia_Aparente = 0
      let Energia_Reactiva = 0
      let potencias = []
      let potenciaTotal = []

      // Ciclo For
      for (let i = 0; i < res.data.length; i++) {
        Corriente_L1 += res.data[i].Corriente_L1
        Corriente_L2 += res.data[i].Corriente_L2
        Corriente_L3 += res.data[i].Corriente_L3
        Tension_L1_N += res.data[i].Tension_L1_N
        Tension_L2_N += res.data[i].Tension_L2_N
        Tension_L3_N += res.data[i].Tension_L3_N
        Energia_Activa += res.data[i].Energia_Activa
        Energia_Aparente += res.data[i].Energia_Aparente
        Energia_Reactiva += res.data[i].Energia_Reactiva
        if(i < 50) {
          potencias.push([i, res.data[i].Potencia_Activa_Total_P, res.data[i].Potencia_Aparente_Total_S, res.data[i].Potencia_Reactiva_Total_Q])
          potenciaTotal.push([i, res.data[i].Factor_de_Potencia_Total])
        }
      }

      // Corrientes
      Corriente_L1 = Corriente_L1 / res.data.length
      Corriente_L2 = Corriente_L2 / res.data.length
      Corriente_L3 = Corriente_L3 / res.data.length
      setCorrienteData([...corrienteData, ["Corriente_L1", Corriente_L1, 'red'], ["Corriente_L2", Corriente_L2, 'black'], ["Corriente_L3", Corriente_L3, 'blue']])

      // Tensiones
      Tension_L1_N = Tension_L1_N / res.data.length
      Tension_L2_N = Tension_L2_N / res.data.length
      Tension_L3_N = Tension_L3_N / res.data.length
      setDataTensiones([...dataTensiones, ['Tension_L1_N', Tension_L1_N], ['Tension_L2_N', Tension_L2_N], ['Tension_L3_N', Tension_L3_N]])

      // Energias
      Energia_Activa = Energia_Activa % res.data.length
      Energia_Aparente = Energia_Aparente % res.data.length
      Energia_Reactiva = Energia_Reactiva % res.data.length
      setDataEnergias([...dataEnergias, ["Energias", Energia_Activa, Energia_Aparente, Energia_Reactiva]])

      // Potencias
      setDataPotencias([...dataPotencias, ...potencias])
      setDataPotenciaTotal([...dataPotenciaTotal, ...potenciaTotal])
    })
  }, []);

  return (
    <div className="dashboards">
      <div className='dashBoard'>
        <Chart
          chartType="BarChart"
          data={corrienteData}
          options={{
            title: "Voltajes",
          }}
          width={"100%"}
          height={"250px"}
        />
      </div>
      <div className='dashBoard'>
        <Chart
          chartType="PieChart"
          data={dataTensiones}
          options={{
            title: "Tensiones",
            is3D: true,
            slices: [{color: 'black'}, {color: 'green'}, {color: 'violet'}]
          }}
          width={"100%"}
          height={"250px"}
          columns={[]}
        />
      </div>
      <div className='dashBoard'>
        <Chart
          chartType="Bar"
          data={dataEnergias}
          options={{
            title: "Energias",
            is3D: false,

          }}
          width={"100%"}
          height={"250px"}
          columns={[]}
        />
      </div>
      <div className='dashBoard'>
        <Chart
          chartType="LineChart"
          data={dataPotencias}
          options={{
            title: "Potencias",
            is3D: false,

          }}
          width={"100%"}
          height={"250px"}
          columns={[]}
        />
      </div>
      <div className='dashboardLarge'>
        <Chart
          chartType="AreaChart"
          width="100%"
          height="400px"
          data={dataPotenciaTotal}
          options={{
            title: "Factor de potencia total",
            hAxis: { title: "Evolución de la potencia", titleTextStyle: { color: "#333" } },
            vAxis: { minValue: 0 },
            chartArea: { height: "50%" },
          }}
        />
      </div>
    </div>
  );
}

export default App;
