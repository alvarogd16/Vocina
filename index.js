/*SERVER PART*/

const express = require('express');
const app = express();
const port = 3000;

const raspi = require('./raspi');

app.use(express.static(__dirname + '/public'));
app.use(express.json());

//Start the server
app.listen(port, () => {
    console.log(`Server listen on port ${port}`);
    raspi.raspiConnect();
});

//app.get('/game', (req, res) => res.sendFile(__dirname + '/public/game.html'));


/*RASPI PART*/

//Serve raspi data to the user
app.get('/raspi/:component', (req, res) => {
    let valor = raspi.raspiRead(req.params.component);
    res.json(valor);
});

//Receive data from the user
app.post('/raspi/:component', (req, res) => {
    raspi.raspiWrite(req.params.component, req.body.Value);
});
