let socket = io();
let btn = document.getElementById("btn");
let video = document.querySelector("video");

video.addEventListener('play', () => {
    console.log('play');
    socket.emit('play');
})
video.addEventListener('pause', () => {
    console.log('pause')
    socket.emit('pause');
})

socket.on('pause', () => {
    console.log('paused')
    video.pause();
})

socket.on('play', () => {
    console.log('played')
    video.play();
})

document.getElementById("videoUpload").onchange = function (event) {
    let file = event.target.files[0];
    let blobURL = URL.createObjectURL(file);
    video.src = blobURL;
    console.log("done");
};
