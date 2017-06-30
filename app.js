const express = require('express');
const app = express();
const server = require('http').createServer(app);
const io = require('socket.io').listen(server);
const port = process.env.port || 3008;
const oxford = require('project-oxford');
const client = new oxford.Client(process.env.facekey);


server.listen(port);
app.use(express.static(__dirname + '/public'));
console.log(`For local testing, point your browser to http://localhost:3008`);


// Get data from Face API
io.on('connection', function (socket) {
    socket.on('incomingface', function (incomingfaceurl) {
        client.face.detect({
            data: oxford.makeBuffer(incomingfaceurl),
            analyzesHeadPose: true,
            analyzesAge: true,
            analyzesGender: true,
            analyzesAccessories: true,
            analyzesFacialHair: true,
            analyzesGlasses: true,
            analyzesHair: true,
            analyzesMakeup: true,
            analyzesExposure: true,
            analyzesBlur: true,
            analyzesEmotion: true,
            analyzesFaceLandmarks: true,
            analyzesNoise: true,
            analyzesOcclusion: true,
            analyzesSmile: true
        }).then(function (response) {
            socket.emit('incomingfaceresults', response);
            console.log(`Webcam image Face API results returned.`);
            socket.emit('incomingallresults'); 
        });
    });
});
