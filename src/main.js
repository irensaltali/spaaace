const express = require('express');
const socketIO = require('socket.io');
const path = require('path');
const cors = require('cors');
import { Lib } from 'lance-gg';

const PORT = process.env.PORT || 3000;
const INDEX = path.join(__dirname, '../dist/index.html');

// define routes and socket
const server = express();

// CORS configuration
const allowedOrigins = [
    'http://localhost:3000',
    'http://localhost:8080',
    'https://spaaace.online',
    'https://staging.spaaace.online',
    'https://game.spaaace.online',
    'https://game.staging.spaaace.online'
];

const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (mobile apps, curl, etc.)
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.warn(`CORS blocked request from origin: ${origin}`);
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'OPTIONS'],
    credentials: true
};

server.use(cors(corsOptions));
server.get('/', function (req, res) { res.sendFile(INDEX); });
server.use('/', express.static(path.join(__dirname, '../dist/')));
let requestHandler = server.listen(PORT, () => console.log(`Listening on ${PORT}`));
const io = socketIO(requestHandler);

// Game Server
import SpaaaceServerEngine from './server/SpaaaceServerEngine.js';
import SpaaaceGameEngine from './common/SpaaaceGameEngine.js';

// Game Instances
const gameEngine = new SpaaaceGameEngine({ traceLevel: Lib.Trace.TRACE_NONE });
const serverEngine = new SpaaaceServerEngine(io, gameEngine, {
    debug: {},
    updateRate: 6,
    timeoutInterval: 0, // no timeout
    countConnections: false // disable lance.gg telemetry
});

// start the game
serverEngine.start();
