let socket = io();
let video = document.querySelector("video");
let btn = document.getElementById("play-pause");

btn.onclick = function(){
  if(video.paused){
    video.play();
    socket.emit('play');
  }
  else{
    video.pause();
    socket.emit('pause');
  }
}

function seeked(){
    let currTime = video.currentTime;
    let seeking = true;
    socket.emit("timestamp", { currTime, seeking });
    console.log('seeked')
}

socket.on("pause", () => {
    video.pause()
    console.log("paused");
    let currTime = video.currentTime;
    socket.emit("timestamp", { currTime });
});

socket.on("play", () => {
    video.play()
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
