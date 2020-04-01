const isPi = require('detect-rpi');

let valLED = 0;
let valBUT = 0;

if(isPi()){ 
    const Gpio = require('onoff').Gpio;
    const LEDR = new Gpio(4, 'out');
    const BUTR = new Gpio(22, 'out', 'rising');

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
};

module.exports = {raspiWrite, raspiRead};
