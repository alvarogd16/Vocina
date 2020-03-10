/*SERVER PART*/

const express = require('express');
const app = express();
const port = 3000;

app.use(express.static('public'));
app.use(express.json());

//Start the server
app.listen(port, () => console.log(`Server listen on port ${port}`));

//app.get('/', (req, res) => res.sendFile('index.html'));


/*RASPI PART*/

const raspi = require('./raspi');

//Serve raspi data to the user
app.get('/raspi/:component', (req, res) => {
    let valor = raspi.raspiRead(req.params.component);
    res.json(valor);
});

//Receive data from the user
app.post('/raspi/:component', (req, res) => {
    raspi.raspiWrite(req.params.component, req.body.Value);
});