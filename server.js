const express = require('express')
const path = require('path')
const socket = require('socket.io')
const http = require('http')

const mongo = require('mongodb').MongoClient;
//const client = require('socket.io').listen(5000).sockets;
const app = express()
const server = http.createServer(app)
const io = socket(server)
//const mongo = require('mongodb').MongoClient;

mongo.connect('mongodb://localhost:27017', (err, client) => {
    if (err) {
        throw err;
    }
    let db = client.db('mongochat')

    console.log('MongoDB connected...');

    app.use('/', express.static(path.join(__dirname + '/frontend')))

    io.on('connection', (socket) => {
        //console.log('Socket Id ' + socket.id)

        let chat = db.collection('chats')

        socket.emit('connect')

        chat.find().limit(100).sort({
            _id: 1
        }).toArray(function (err, res) {
            if (err) {
                throw err;
            }

            // Emit the messages
            socket.emit('recv_msg', res);
        });


        socket.on('send_msg', (data) => {
            if (data.name == '' || data.message == '') {
                socket.emit('recv_msg', 'NO')
            }
            //console.log('received mssge = ' + data.message + ' from the socket ' + socket.id)
            else {
                chat.insert({
                    name: data.name,
                    message: data.message
                }, function () {
                    io.emit('recv_msg', [data])
                })
            }
        })

        socket.on('clear', (data) => {
            chat.remove({}, function () {
                //  console.log('oo')
                socket.emit('cleared')
            })
        })

    })

    server.listen(5000, () => {
        console.log('Listening to 5000')
    })
})