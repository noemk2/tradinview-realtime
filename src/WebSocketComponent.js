import React, { useEffect, useState } from 'react';
import { ChartComponent } from './ChartComponent';
// import dayjs from "dayjs";
// import { ComposedChart, LineChart, Line, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ReferenceLine } from 'recharts';
const WebSocket = require('websocket').w3cwebsocket;

function WebSocketComponent(props) {
  const [messages, setMessages] = useState([]);
  const [ohlcData, setOhlcData] = useState([]);

  useEffect(() => {

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
