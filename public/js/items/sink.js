/** Class representing the sink on the third level
 */
class Sink {

    constructor() {
        this.items = {
            "jabon": false
        };
    }

    //Put a new item into the dictionary
    poner(key) {
        this.items[key] = 1;
    }

    encender() {
        console.log("GRIFO ENCENDIDO");
    }

    //Through an AND operation to all the items in the dictionary, checks if all the items are installed
    comprobarItems() {
        var auxBool = true && this.items[key];
        console.log(auxBool);
        return auxBool;
    }
}
