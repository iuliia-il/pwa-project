"use strict";

const MessageModel = require('./models/messages.model');

module.exports = io => {
    io.on('connection', function (socket) {
        socket.emit('connected', "You're connected");

        socket.join('room1');

        socket.on('msg', content => {
            const obj = {
                date: new Date(),
                content: content,
                username: socket.id
                //username: {}
            };

            MessageModel.create(obj, err => {
                if(err) return console.error("MessageModel", err);
                socket.emit("message", obj);
                socket.to('all').emit("message", obj);
            });
        });

        socket.on('receiveHistory', () => {
            MessageModel
                .find({})
                .sort({date: -1})
                .limit(10)
                .sort({date: 1})
                .lean()
                .exec( (err, messages) => {
                    if(!err) {
                        socket.emit("history", messages);
                        //socket.to('all').emit("history", messages);
                    }
                })
        })
    });
};



