const express = require('express')
const http = require('http')
const socketio = require('socket.io')

const app = express()
const server = http.createServer(app);
const io = socketio(server)

const port = process.env.PORT || 7777;

app.use('/', express.static(__dirname + '/public'))

let timeMap = {};
let users = 0;
let pausedUsers = 0;

io.on('connection', (socket) => {
    console.log('connection ', socket.id)
    users++;
    console.log('users', users)

    function minTime(){
        if(pausedUsers === users){
            const values = Object.values(timeMap);
            let min = Math.min(...values);
            io.emit('sync-video', {min});
            pausedUsers = 0;
            timeMap = {};
        }
    }

    socket.on('disconnect', () => {
        console.log('disconnected', socket.id);
        delete timeMap[socket.id];
        users--;
    })

    socket.on('play', () => {
        console.log('played')
        io.emit('play')
    })

    socket.on('pause', () => {
        console.log('paused')
        io.emit('pause');
    })
    
    socket.on('timestamp', (data) => {
        pausedUsers++;
        console.log('timestamp')
        if(data.seeking){
            let min = data.currTime;
            io.emit('sync-video', {min});
            return;
        }
        let currTime = data.currTime;
        timeMap[socket.id] = currTime;
        minTime();
    })
})

server.listen(port, ()=>{
    console.log(`listening at http://localhost:${port}`);
})