const socket = io();
let incomingfaceurl = '';
let incomingFace = [];
let incomingEmotion = [];;


// When the webcam photo results are returned, store them
socket.on('incomingfaceresults', function (response) {
    if (response == '') {
        alert("Oops! I couldn't find your face. Try again?");
        videoinit();
    }
    else { incomingFace = response; }
});

// When all webcam photos are returned, get and display the score
socket.on('incomingallresults', function () {
    getResults();
});

// When gray square is clicked, initialize video
$('body').on('click', "#placeholder", videoinit);

// When retry button is clicked, reset video
$('body').on('click', '#retry', function(){
    $('.buttoncontainer').html('<button id="snap">Snap photo</button>');
    videoinit();
});

// When Snap photo button is clicked, draw video to canvas and send image to Cognitive Services
$('body').on('click', '#snap', function () {
    let video = document.getElementById('video');
    let videow = $('#video').width();
    let videoh = $('#video').height();
    document.getElementById('videocontainer').innerHTML = '<div class="flex-item" style="overflow:hidden; display:block; transform: scaleX(-1);"><canvas id="canvas" style="padding:0;"></canvas></div><div class="flex-caption"><div id="buttoncontainer"><button id="retry" disabled>Sending results</button></div><div id="results"></div></div>'
    var canvas = document.getElementById('canvas');
    var context = canvas.getContext('2d');
    canvas.height = $('.flex-item').height();
    canvas.width = $('.flex-item').width();
    context.translate(canvas.width, 0);
    context.scale(-1,1);
    context.drawImage(video, 0, 0, videow, videoh);
    incomingfaceurl = canvas.toDataURL("image/jpg", 0.8);
    context.translate(canvas.width, 0);
    context.scale(-1,1);
    context.drawImage(video, 0, 0, videow, videoh);
    socket.emit('incomingface', incomingfaceurl);
});

function videoinit () {
    document.getElementById('videocontainer').innerHTML = '<div class="flex-item" style="overflow:hidden;display:block;transform: scaleX(-1);"><video id="video" autoplay style="min-width:40vw; min-height:40vh;"></video><canvas id="canvas"></canvas></div><div class="flex-caption"><div class="buttoncontainer"><button id="snap">Snap photo</button></div><div id="results"></div></div>'
    let video = document.getElementById('video');
    let videoh = $('.flex-item').height();
    let videow = $('.flex-item').width();
    
    // Get access to the camera
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices.getUserMedia({ video: true, height: {min: videoh}}).then(function (stream) {
            video.src = window.URL.createObjectURL(stream);
            video.play();
            $('.buttoncontainer').css( "display", "block" );
        });
    }
    else { $('#videocontainer').html('<div class="flex-item" id="placeholder"><i class="fa fa-ban fa-3x" aria-hidden="true"></i><p>Sorry, this browser does not support the use of a webcam. :( Try Edge or Chrome.</p></div><div class="flex-caption"></div>'); }
}

function getResults() {
    document.getElementById("results").innerText = `
    
    Full JSON return:

    ${JSON.stringify(incomingFace[0], null, 2)}
    `
    document.getElementById("retry").innerHTML = "Try another?"
    document.getElementById("retry").removeAttribute("disabled");
}

function reloadPage() {
    //TODO
}
