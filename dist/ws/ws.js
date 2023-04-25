"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const ws_1 = require("ws");
const port = 5001;
var binanceSocket = new ws_1.WebSocket("wss://stream.binance.com:9443/ws/btcusdt@miniTicker");
binanceSocket.onmessage = function (event) {
    var message = JSON.parse(event.data);
    binanceSocket.emit(message);
    console.log(message);
};
/*
const server = createServer();
const wss1 = new WebSocketServer({ noServer: true });
const wss2 = new WebSocketServer({ noServer: true });

wss1.on('connection', function connection(ws) {
  // ...
});

wss2.on('connection', function connection(ws) {
  // ...
});

server.on('upgrade', function upgrade(request:any, socket, head) {
  const { pathname } = parse(request);

  if (pathname === '/foo') {
    wss1.handleUpgrade(request, socket, head, function done(ws) {
      wss1.emit('connection', ws, request);
    });
  } else if (pathname === '/bar') {
    wss2.handleUpgrade(request, socket, head, function done(ws) {
      wss2.emit('connection', ws, request);
    });
  } else {
    socket.destroy();
  }
});

server.listen(8080);

/*
const coin = 'btcusdt';


export const ws =async (req:Request, res:Response) => {
    try {
        // const ws = new WebSocket(`wss://fstream.binance.com/ws/${coin}@trade`);
        const ws = new WebSocket(`wss://stream.binance.com:9443/${coin}@miniTicker`);
        ws.on('message', (data?: string) => {
            if (data) {
                const trade = JSON.parse(data); // parsing a single-trade record
                console.log(trade);
            }
            return res.status(200).json({
                status: false,
                data: data,
                message: "success"
            })
        });

        
    } catch (error) {
        console.log(error);
        return res.status(400).json({
            status: false,
            data: null,
            message: "Something went wrong"
        })
    }


}*/ 
