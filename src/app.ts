import { Express } from "express";
import express from "express"
import cors from 'cors';
import fs from 'fs'
import helmet from "helmet";
import compression from "compression";
import morgan from 'morgan';
import apiRouter from "./ws/index";
// import { rateLimiterUsingThirdParty } from './middleware/rateLimiting';
import { Server } from "socket.io";
import {WebSocket} from 'ws';

export default function (app: Express) {
    app.use(cors());
    app.use(express.json());
    app.use(compression());
    app.use(helmet());
    app.use(express.urlencoded({extended: true,limit: '1gb'}));
    app.set('view engine', 'hbs');
    app.use(morgan('dev'));
    app.use(morgan('common', {
        stream: fs.createWriteStream(__dirname+ '/access.log', {flags: 'a'})
    }));
//

    var ws = new WebSocket("wss://stream.binance.com:9443/ws/btcusdt@miniTicker");

    // ws.on('open', function open() {
    //     ws.send('something');
    //   });
      
     

      ws.onmessage = function (event:any) {	
        var message = JSON.parse(event.data);
        // console.log('received: %s', message);

      }
//
    app.use(express.static("./public"));
    app.use('/api/v1', apiRouter);
    app.use('*', (_req, res) => {
        res.status(404).json({
            message: 'Resource not available'
        });
    });
    app.use((err: any, _req: any, res: any, next: any) => {
        if(err) {
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                error : err
            });
        }
        if (res.headersSent) {
            return next(err);
        }
        res.status(500).json({
            status: false,
            message: "Unexpected Error Occurred. Please contact our support team."
        });
    });
}