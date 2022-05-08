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
        console.log('called');
        console.log('paused users', pausedUsers);
        if(pausedUsers === users){
            console.log(timeMap);
            const values = Object.values(timeMap);
            console.log('values', values);
            let min = Math.min(...values);
            console.log('min', min)
            io.emit('sync-video', {min});
            pausedUsers = 0;
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
        pausedUsers++;
    })
    
    socket.on('timestamp', (data) => {
        if(data.seeking){
            let min = data.currTime;
            io.emit('sync-video', {min});
            return;
        }
        let currTime = data.currTime;
        console.log(currTime, socket.id);
        let id = socket.id
        console.log('users inside', users)
        timeMap[socket.id] = currTime;
        minTime();
        console.log('pausedUsers inside', pausedUsers);
    })
})

server.listen(port, ()=>{
    console.log(`listening at http://localhost:${port}`);
})