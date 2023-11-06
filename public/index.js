// const webSocketServer = require('websocket').server;
// const http = require('http');
import { WebSocketServer } from 'ws';
import http from 'http'
const webSocketServerPort = 7200;

// Start the http server and the websocket server
const server = http.createServer();
server.listen(webSocketServerPort, () => console.log(`Listening on ${webSocketServerPort}`));

const wsServer = new WebSocketServer.server({
    httpServer: server
});

// I'm maintaining all active connections in this object
const clients = {};

// Generates unique userId for every user.
const generateUniqueID = () => {

    const s4 = () => Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);

    return s4() + '-' + s4() + '-' + s4();
};

wsServer.on('request', function (request) {
    var userID = generateUniqueID();
    console.log((new Date()) + ' Received a new connection from origin ' + request.origin + '.');

    // You can rewrite this part of the code to accept only the requests from allowed origin
    const connection = request.accept(null, request.origin);
    clients[userID] = connection;
    console.log('connected: ' + userID + 'in' + Object.getOwnPropertyNames(clients));

    connection.on('message', function (message) {
        if (message.type === 'utf8') {
            console.log('Received message: ', message.utf8Data);
            let key = ''
            for (key in clients) {
                clients[key].sendUTF(message.utf8Data)
                console.log('clients[key]: ', clients[key]);
            }

        }
    })
    connection.on('close', function () {
        console.log('Connection closed: ' + userID);
        delete clients[userID]; // Remove the closed connection from the clients object
    });

    // Handle errors
    connection.on('error', function (error) {
        console.error('Connection error:', error);
    });

});