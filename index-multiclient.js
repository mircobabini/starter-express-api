var webSocketServer = new (require('ws')).Server({port: (process.env.PORT || 3000)}),
    webSockets = {} // userID: webSocket

var users = 0;

// CONNECT /:userID
// wscat -c ws://localhost:5000/1
webSocketServer.on('connection', function (webSocket) {
    var userID = ++users
    webSockets[userID] = webSocket
    console.log('connected: ' + userID + ' in ' + Object.getOwnPropertyNames(webSockets))

    // Forward Message
    //
    // Receive               Example
    // [toUserID, text]      [2, "Hello, World!"]
    //
    // Send                  Example
    // [fromUserID, text]    [1, "Hello, World!"]
    webSocket.on('message', function (message) {
        console.log('received from ' + userID + ': ' + message)
        var messageArray = JSON.parse(message)
        var toUserWebSocket = webSockets[messageArray[0]]
        if (toUserWebSocket) {
            console.log('sent to ' + messageArray[0] + ': ' + JSON.stringify(messageArray))
            messageArray[0] = userID
            toUserWebSocket.send(JSON.stringify(messageArray))
        }
    })

    webSocket.on('close', function () {
        delete webSockets[userID]
        console.log('deleted: ' + userID)
    })
})
