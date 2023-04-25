import express from 'express';
import initRoutes from './app';
import {WebSocket} from 'ws';

const port= process.env.PORT || 3000;
const app = express();
app.use(express.urlencoded({ extended: false, limit: '1gb' }));
initRoutes(app);

// ====================================================================================================
// ========================================Sockets=====================================================

import http from 'http';
const server = http.createServer(app);
const io = require('socket.io')(server);
// import pool from "./db";

io.on('connection', async(socket:any) => {
  console.log("Socket Connected");
  console.log("socket",socket);
  var binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@miniTicker");
  
  binanceSocket.onmessage = function (event:any) {	
	var message = JSON.parse(event.data);

  binanceSocket.emit('binanceSocket', message);
  // console.log(message);
  socket.emit('bskts', message)
  // binanceSocket.send(message)
	// console.log(message)
}

  socket.on('message', async(data:any) => {
    console.log("getChat", data);
    
  })


// console.log(rows);

//new group chat added
  socket.on('groupChat', async (data:any) => {
    socket.broadcast.emit('loadNewGroupChat', data)
  })

  // new group chat added  
//   socket.on('getChat', async(data:any) => {
//     console.log("getChat", data);
    
//     const sql = `SELECT * FROM messages WHERE room_id = ${socket.handshake.headers.roomid}`;
//     const [rows]:any = await pool.query(sql);
// // console.log(rows);

//     socket.broadcast.emit('newChats', rows);
//   })

  socket.on('disconnect', () => {
    console.log("Socket Disconnected");
    
  })
})

// ====================================================================================================
// ====================================================================================================


// app.listen(port, () => {
  console.log(`Express server listening on ${port} `);
  var binanceSocket = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@miniTicker");
  
  binanceSocket.onmessage = function (event:any) {	
	var message = JSON.parse(event.data);

  binanceSocket.emit(message);
  // console.log(message);
  
  // binanceSocket.send(message)
	// console.log(message)
}

// });     
  
server.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
