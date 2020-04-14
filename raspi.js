const isPi = require('detect-rpi');

let valLED = 0;     //LED
let valBUT = 0;     //Button
let valTEMPS = 0;   //Temperature sensor

const pinLED = 4;
const pinBUT = 22;
const pinTEMPS = 27;  
const typeTEMPS = 11; //DHT11
const pinEncA = 5;
const pinEncB = 6;

if(isPi()){ 
    const Gpio = require('onoff').Gpio;
    const LEDR = new Gpio(pinLED, 'out');
    const BUTR = new Gpio(pinBUT, 'out', 'rising');

    //TODO AND TO INSTALL
    const sensor = require('node-dht-sensor');

    sensor.read(typeTEMPS, pinTEMPS, (err, temperature, humidity) => {
        if(!err) 
            valTEMPS = temperature;
    });

    //END TODO

    BUTR.watch(function (err, value){
        if(err){
            console.error(err);
            return;
        }
        valBUT = !valBUT;   //When push the button change valBUT
    });

    function unexportOnClose() {
        LEDR.writeSync(0);
        LEDR.unexport();
        BUTR.unexport();
        process.exit();
    }

    process.on('SIGINT', unexportOnClose);  //When press ctrl+c 
}

const raspiWrite = (component, value) => {
    console.log(value);
    if(component === 'LED')
        isPi() ? LEDR.writeSync(value) : valLED = value;
};

const raspiRead = (component) => {
    if(component === 'LED')
        return isPi() ? LEDR.readSync() : valLED;
    else if (component === 'BUT')
        return valBUT;
    else if (component === 'TEMPS')
        return valTEMPS;
    else if(component === "CONNECTED")
        return isPi() ? true : false;
};

module.exports = {raspiWrite, raspiRead};