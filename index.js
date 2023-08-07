// Import express, expressWs, and http
const express = require('express')
const expressWs = require('express-ws')
const http = require('http')

// Our port
let port = process.env.PORT || 3000;

// App and server
let app = express();
let server = http.createServer(app).listen(port);

// Apply expressWs
expressWs(app, server);

// This lets the server pick up the '/ws' WebSocket route
app.ws('/ws', async function (ws, req) {
    console.log("Remote: " + req.socket.remoteAddress);

    // After which we wait for a message and respond to it
    ws.on('message', async function (msg) {
        // What was the message?
        console.log(msg);
        // Send back some data
        ws.send(JSON.stringify({
            "append": true,
            "returnText": "I am using WebSockets (ok)!"
        }));
    });
});