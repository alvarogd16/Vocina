const isPi = require('detect-rpi');

let valLED = 0;     //LED
let valBUT = 0;     //Button
let encCont = 0;    //Encoder
let encAux;

const pinLED = 20;
const pinBUT = 6;
const pinTEMPS = 9;
const typeTEMPS = 11; //DHT11
const pinEncA = 3;
const pinEncB = 27;

let LEDR = undefined;
let SENSOR = undefined;

const setupRaspi = (io) => {
    if(isPi()){
	console.log("Config raspi")

        const Gpio = require('onoff').Gpio;

        LEDR = new Gpio(pinLED, 'out');
        const BUTR = new Gpio(pinBUT, 'in', 'falling');
        const ENC_A = new Gpio(pinEncA, 'in', 'both');
        const ENC_B = new Gpio(pinEncB, 'in', 'both');

        SENSOR = require('node-dht-sensor');


        //Button funcionality
        BUTR.watch(function (err, value){
            if(err){
                console.error(err);
                return;
            }
            io.emit('button');
	        console.log("boton");
            valBUT = !valBUT;   // When push the button, change valBUT
        });

        //Encoder funcionality
        ENC_A.watch((err, valueA) => {
            if(err) throw err;
            encAux = valueA;

            ENC_B.read((err, valueB) => {
                let direction = "DOWN"
                if(valueB != encAux){
                    encCont++;
                    direction = "UP";
                }
                else
                    encCont--;
                console.log(direction)
                io.emit('encoder');
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

        process.on('SIGINT', unexportOnClose);  // When press ctrl+c
    }
}

/*
    If raspi is connect turn on LED 3 sec
*/
const raspiConnect = () => {
    if(isPi())
        console.log("Raspi connect");
    else
        console.log("Raspi is NOT connect");
}

const raspiWrite = (component, value) => {
    console.log(value);
    if(component === 'LED')
        isPi() ? LEDR.writeSync(value) : valLED = value;
};

const raspiRead = (component, res) => {
	let data;

    if(component === 'LED')
        data = isPi() ? LEDR.readSync() : valLED;
    else if (component === 'BUT')
        data = valBUT;
    else if (component === 'TEMPS'){
        if(isPi()){
            SENSOR.read(typeTEMPS, pinTEMPS, (err, temp, hum) => {
                if(!err){
                    console.log(temp);
                    res.json(temp);
                } else {
                    console.log(err);
                    res.json(20);
                }
            })
            return;

        } else
                data = -30;
    }
    else if (component === 'ENC')
        data = encCont;
    else if(component === "CONNECTED")
        data = isPi() ? true : false;


	res.json(data);
};

module.exports = {setupRaspi, raspiWrite, raspiRead, raspiConnect};
