let socket = io();
let video = document.querySelector("video");
let btnPlay = document.getElementById("btnPlay");
let btnPause = document.getElementById("btnPause");

function seeked(){
    let currTime = video.currentTime;
    let seeking = true;
    socket.emit("timestamp", { currTime, seeking });
    console.log('seeked')
}

video.addEventListener("play", () => {
    console.log("play");
    seeked();
    socket.emit("play");
});

video.addEventListener("pause", () => {
    console.log("pause")
    seeked();
    socket.emit("pause");
});

socket.on("pause", () => {
    video.pause()
    console.log("paused");
    let currTime = video.currentTime;
    socket.emit("timestamp", { currTime });
});

socket.on("play", () => {
    video.play()
    .then(() => {
        console.log('PLAYED');
    })
    console.log("played");
});

// sync video
socket.on('sync-video', (data) => {
    console.log('previous time', video.currentTime);
    video.currentTime = data.min;
    console.log('updated time', video.currentTime);
})

document.getElementById("videoUpload").onchange = function (event) {
    let file = event.target.files[0];
    let blobURL = URL.createObjectURL(file);
    video.src = blobURL;
    console.log("done");
};
