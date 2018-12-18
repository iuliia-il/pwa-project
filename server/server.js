"use strict";
const express = require('express');
const app = express();
const path = require('path');
const server = require('http').Server(app);
const io = require('socket.io')(server, {serveClient: true});
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');

const passport = require('passport');
const { Strategy } = require('passport-jwt');

const nunjucks = require('nunjucks');

const { jwt } = require('./config');

const PORT = process.env.PORT || 5000;

passport.use(new Strategy(jwt, function (jwt_payload, done) {
    if(jwt_payload != void(0)) return done(false, jwt_payload);
    done();
}));

//let mongoDBUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/pwa';
let mongoDBUri = process.env.MONGODB_URI || 'mongodb://admin:123456z@ds143734.mlab.com:43734/pwa';
mongoose.connect(mongoDBUri);
//mongoose.Promise = require('bluebird');
mongoose.Promise = global.Promise;
mongoose.set('debug', true);

nunjucks.configure('./client/views', {
    autoescape: true,
    express: app
});

app.use(bodyParser.urlencoded({ extended: false }));

app.use(bodyParser.json());

app.use(cookieParser());

require('./router')(app);

require('./sockets')(io);

//server.listen(7777, () => {
//    console.log('Server started on port 7777');
//});

server.listen(PORT, () => {
    console.log('Listening on ${ PORT }');
});


