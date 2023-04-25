"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app_1 = __importDefault(require("./app"));
const ws_1 = require("ws");
const port = process.env.PORT || 3000;
const app = (0, express_1.default)();
app.use(express_1.default.urlencoded({ extended: false, limit: '1gb' }));
(0, app_1.default)(app);
// ====================================================================================================
// ========================================Sockets=====================================================
const http_1 = __importDefault(require("http"));
const server = http_1.default.createServer(app);
const io = require('socket.io')(server);
// import pool from "./db";
io.on('connection', (socket) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("Socket Connected");
    console.log("socket", socket);
    var binanceSocket = new ws_1.WebSocket("wss://stream.binance.com:9443/ws/btcusdt@miniTicker");
    binanceSocket.onmessage = function (event) {
        var message = JSON.parse(event.data);
        binanceSocket.emit('binanceSocket', message);
        // console.log(message);
        socket.emit('bskts', message);
        // binanceSocket.send(message)
        // console.log(message)
    };
    socket.on('message', (data) => __awaiter(void 0, void 0, void 0, function* () {
        console.log("getChat", data);
    }));
    // console.log(rows);
    //new group chat added
    socket.on('groupChat', (data) => __awaiter(void 0, void 0, void 0, function* () {
        socket.broadcast.emit('loadNewGroupChat', data);
    }));
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
    });
}));
// ====================================================================================================
// ====================================================================================================
// app.listen(port, () => {
console.log(`Express server listening on ${port} `);
var binanceSocket = new ws_1.WebSocket("wss://stream.binance.com:9443/ws/btcusdt@miniTicker");
binanceSocket.onmessage = function (event) {
    var message = JSON.parse(event.data);
    binanceSocket.emit(message);
    // console.log(message);
    // binanceSocket.send(message)
    // console.log(message)
};
// });     
server.listen(port, () => {
    console.log(`Server listening on port ${port}`);
});
