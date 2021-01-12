/* SERVER PART */

const express = require('express');
const app  = express();
const http = require('http').createServer(app);
const io   = require('socket.io')(http);
const port = 3000;

const raspi = require('./raspi');

app.use(express.static(__dirname + '/public'));
app.use(express.json());

raspi.setupRaspi(io);

let users = []
io.on('connection', (socket) => {
    io.emit('hola', "HOLAAA");

    socket.on('disconnect', () => {
        console.log('user disconnected');
    })
})

/*RASPI PART*/

// Serve raspi data to the user
app.get('/raspi/:component', (req, res) => {
    let valor = raspi.raspiRead(req.params.component, res);
});

// Receive data from the user
app.post('/raspi/:component', (req, res) => {
    raspi.raspiWrite(req.params.component, req.body.Value);
});

// Start the server
http.listen(port, () => {
    console.log(`Server listen on port ${port}`);
    raspi.raspiConnect();
});