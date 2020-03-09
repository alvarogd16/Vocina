const Gpio = require('onoff');
let LED = {
    value: 0
};//new Gpio();

const raspiWrite = (component, value) => {
    if(component === 'LED'){
        LED.value = value;
        console.log(LED.value);
    }
};

const raspiRead = (component) => {
    if(component === 'LED')
        return LED.value; 
};

module.exports = {raspiWrite, raspiRead};
