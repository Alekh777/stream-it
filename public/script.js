let socket = io();
let btn = document.getElementById("btn");
let video = document.querySelector("video");

btn.onclick = function () {
    console.log("clicked");
    socket.emit("clicked");
};

socket.on('pause', () => {
    video.pause();
})

document.getElementById("videoUpload").onchange = function (event) {
    let file = event.target.files[0];
    let blobURL = URL.createObjectURL(file);
    video.src = blobURL;
    console.log("done");
};
