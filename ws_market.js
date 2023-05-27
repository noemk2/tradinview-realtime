const WebSocket = require('websocket').w3cwebsocket;
const json = require('json');

function onMessage(message) {
  const data = JSON.parse(message);
  if (data.method === 'public/heartbeat') {
    const heartbeatResponse = {
      id: data.id,
      method: 'public/respond-heartbeat',
      code: 0
    };
    connection.send(JSON.stringify(heartbeatResponse));
  } else {
    console.log(`Received message: ${message}`);
  }
}

function onError(error) {
  console.log(`Error: ${error}`);
}

function onClose() {
  console.log("### closed ###");
}

function onOpen() {
  const subscribeRequest = {
    id: 1,
    method: 'subscribe',
    params: {
      channels: ['candlestick.15m.BTCUSD-PERP']
    },
    // nonce: Date.now()
  };
  connection.send(JSON.stringify(subscribeRequest));
}

const connection = new WebSocket('wss://deriv-stream.crypto.com/v1/market');
connection.onopen = onOpen;
connection.onmessage = event => onMessage(event.data);
connection.onerror = event => onError(event.error);
connection.onclose = onClose;
