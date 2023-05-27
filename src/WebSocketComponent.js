import React, { useEffect, useState } from 'react';
import { ChartComponent } from './ChartComponent';
// import dayjs from "dayjs";
// import { ComposedChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
const WebSocket = require('websocket').w3cwebsocket;

function WebSocketComponent(props) {
  const [messages, setMessages] = useState([]);
  const [ohlcData, setOhlcData] = useState([]);

  useEffect(() => {

    function convertUnixTimestamp(timestamp) {
      // Multiplica por 1000 para convertir el timestamp en milisegundos
      var date = new Date(timestamp * 1000);
      
      // Obtén los componentes de la fecha
      var year = date.getFullYear();
      var month = ('0' + (date.getMonth() + 1)).slice(-2); // Agrega un cero inicial si es necesario
      var day = ('0' + date.getDate()).slice(-2); // Agrega un cero inicial si es necesario
    
      // Forma la cadena de fecha en el formato deseado (yyyy-mm-dd)
      var formattedDate = year + '-' + month + '-' + day;
      
      return formattedDate;
    }

    const connection = new WebSocket('wss://deriv-stream.crypto.com/v1/market');

    connection.onopen = () => {
      const subscribeRequest = {
        id: 1,
        method: 'subscribe',
        params: {
          channels: ['candlestick.1m.BTCUSD-PERP']
        },
        nonce: Date.now()
      };
      connection.send(JSON.stringify(subscribeRequest));
    };

    connection.onmessage = event => {
      const message = event.data;
      // const ohlc = event.data
      const data = JSON.parse(message);
      // const ohlc = data 

      if (data.method === 'public/heartbeat') {
        const heartbeatResponse = {
          id: data.id,
          method: 'public/respond-heartbeat',
          code: 0
        };
        connection.send(JSON.stringify(heartbeatResponse));
      } else {
        // Actualizar el estado con el nuevo mensaje recibido
        setMessages(prevMessages => [...prevMessages, message]);
        // console.log(ohlc)
        if (data.result && data.result.data) {
          const newOhlcData = data.result.data.map(item => ({
            time: item.t,
            open: parseFloat(item.o),
            high: parseFloat(item.h),
            low: parseFloat(item.l),
            close: parseFloat(item.c),
          }));
          setOhlcData(newOhlcData);
        }
      }
    };

    connection.onerror = error => {
      console.log(`Error: ${error}`);
    };

    return () => {
      // Cerrar la conexión cuando el componente se desmonte
      connection.close();
    };
  }, []);

  return (
    <div>
      <h1>WebSocket Messages:</h1>
      {/* {messages.map((message, index) => (
        <>
          <p key={index}>{message}</p>
        </>
      ))} */}
      <h2>OHLC Chart:</h2>
      {/* aqui va el grafico */}
      <ChartComponent {...props} data={ohlcData}></ChartComponent>
    </div>
  );
}

export default WebSocketComponent;



{/* <LineChart
width={800}
height={400}
data={ohlcData}
margin={{
  top: 20,
  right: 20,
  bottom: 20,
  left: 20,
}}
>
<CartesianGrid stroke="#f5f5f5" />
<XAxis dataKey="timestamp" />
<YAxis />
<Tooltip />
<Legend />
{/* <Line type="monotone" dataKey="open" stroke="#8884d8" /> */}
{/* <Line type="monotone" dataKey="high" stroke="#82ca9d" /> */ }
{/* <Line type="monotone" dataKey="low" stroke="#ffc658" /> */ }
{/* <Line type="monotone" dataKey="close" stroke="#d84a4a" /> */ }
// </LineChart> */}
