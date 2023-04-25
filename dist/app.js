"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const fs_1 = __importDefault(require("fs"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const morgan_1 = __importDefault(require("morgan"));
const index_1 = __importDefault(require("./ws/index"));
const ws_1 = require("ws");
function default_1(app) {
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    app.use((0, compression_1.default)());
    app.use((0, helmet_1.default)());
    app.use(express_1.default.urlencoded({ extended: true, limit: '1gb' }));
    app.set('view engine', 'hbs');
    app.use((0, morgan_1.default)('dev'));
    app.use((0, morgan_1.default)('common', {
        stream: fs_1.default.createWriteStream(__dirname + '/access.log', { flags: 'a' })
    }));
    //
    var ws = new ws_1.WebSocket("wss://stream.binance.com:9443/ws/btcusdt@miniTicker");
    // ws.on('open', function open() {
    //     ws.send('something');
    //   });
    ws.onmessage = function (event) {
        var message = JSON.parse(event.data);
        // console.log('received: %s', message);
    };
    //
    app.use(express_1.default.static("./public"));
    app.use('/api/v1', index_1.default);
    app.use('*', (_req, res) => {
        res.status(404).json({
            message: 'Resource not available'
        });
    });
    app.use((err, _req, res, next) => {
        if (err) {
            res.status(500).json({
                status: false,
                message: "Something went wrong",
                error: err
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
exports.default = default_1;
