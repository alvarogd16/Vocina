const isPi = require('detect-rpi');

let valLED = 0;     //LED
let valBUT = 0;     //Button
let valTEMPS = 0;   //Temperature sensor
let encCont = 0;    //Encoder
let encAux;

const pinLED = 4;
const pinBUT = 22;
const pinTEMPS = 27;  
const typeTEMPS = 11; //DHT11
const pinEncA = 5;
const pinEncB = 6;


const setupRaspi = (io) => {
    if(isPi()){ 
        const Gpio = require('onoff').Gpio;
    
        const LEDR = new Gpio(pinLED, 'out');
        const BUTR = new Gpio(pinBUT, 'in', 'rising');
        const ENC_A = new Gpio(pinEncA, 'in', 'both');
        const ENC_B = new Gpio(pinEncB, 'in', 'both');
    
        //TODO AND TO INSTALL
        const sensor = require('node-dht-sensor');
    
        sensor.read(typeTEMPS, pinTEMPS, (err, temperature, humidity) => {
            if(!err) 
                valTEMPS = temperature;
        });
    
        //END TODO
    
        //Button funcionality
        BUTR.watch(function (err, value){
            if(err){
                console.error(err);
                return;
            }
            io.emit('button');
            valBUT = !valBUT;   //When push the button change valBUT
        });
    
        //Encoder funcionality
        ENC_A.watch((err, valueA) => {
            if(err) throw err;
            encAux = valueA;
            
            ENC_B.read((err, valueB) => {
                if(valueB != encAux) 
                    encCont++;
                else
                    encCont--;
                    
                console.log("Value: " + encAux + valueB + "Cont: " + encCont);
            });
        });
    
        function unexportOnClose() {
            LEDR.writeSync(0);
            LEDR.unexport();
            BUTR.unexport();
            ENC_A.unexport();
            ENC_B.unexport();
            process.exit();
        }
    
        process.on('SIGINT', unexportOnClose);  //When press ctrl+c 
    }
}

/*
    If raspi is connect turn on LED 3 sec
*/
const raspiConnect = () => {
    if(isPi()) {
        //LEDR.writeSync(1);
        //setTimeout(() => LEDR.writeSync(0), 3000);
        console.log("Raspi connect");
    } else
        console.log("Raspi is NOT connect");
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
    else if (component === 'ENC')
        return encCont;
    else if(component === "CONNECTED")
        return isPi() ? true : false;
};

module.exports = {setupRaspi, raspiWrite, raspiRead, raspiConnect};
