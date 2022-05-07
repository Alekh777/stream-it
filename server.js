const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app);
const io = socketio(server)

const port = process.env.PORT || 8080;

app.use('/', express.static(__dirname + '/public'))

io.on('connection', (socket) => {
    console.log('connection ', socket.id)

    socket.on('clicked', () => {
        io.emit('pause')
    })
})

server.listen(port, ()=>{
    console.log(`listening at http://localhost:4444`);
})