'use strict';

var app = require('express')();
var http = require('http').Server(app);
var io = require('socket.io')(http);
var path = require('path');
var bodyParser = require('body-parser');
var port = process.env.PORT || 8080;
require('dotenv').config({ path: '../../.env' });

app.use(bodyParser.json());

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

var Twitter = require('twitter');

var twitter = new Twitter({
    consumer_key: process.env.TWITTER_CONSUMER_KEY,
    consumer_secret: process.env.TWITTER_CONSUMER_SECRET,
    access_token_key: process.env.TWITTER_ACCESS_TOKEN_KEY,
    access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});

var socketConnection = void 0;
var twitterStream = void 0;

app.locals.searchTerm = '#JavaScript'; //Default search
app.locals.showRetweets = false; //Default

var stream = function stream() {
    console.log('Resuming for ' + app.locals.searchTerm);
    twitter.stream('statuses/filter', { track: app.locals.searchTerm }, function (stream) {
        stream.on('data', function (tweet) {
            sendMessage(tweet);
        });

        stream.on('error', function (error) {
            console.log(error);
        });

        twitterStream = stream;
    });
};

app.post('/setSearchTerm', function (req, res) {
    var term = req.body.term;
    app.locals.searchTerm = term;
    twitterStream.destroy();
    stream();
});

/**
 * Pauses the twitter stream.
 */
app.post('/pause', function (req, res) {
    console.log('Pause');
    twitterStream.destroy();
});

/**
 * Resumes the twitter stream.
 */
app.post('/resume', function (req, res) {
    console.log('Resume');
    stream();
});

io.on("connection", function (socket) {
    socketConnection = socket;
    stream();
    socket.on("connection", function () {
        return console.log("Client connected");
    });
    socket.on("disconnect", function () {
        return console.log("Client disconnected");
    });
});

/**
 * Emits data from stream.
 */
var sendMessage = function sendMessage(msg) {
    if (msg.text.includes('RT')) {
        return;
    }
    socketConnection.emit("tweets", msg);
};

http.listen(port, function () {
    console.log('server is up');
});