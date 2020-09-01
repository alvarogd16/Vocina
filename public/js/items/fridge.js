/** Class representing the fridge on the second level
 */
class Fridge extends ItemObject{

    constructor() {
        super();
        this.items = {
            "sensor": false,
            "enconder": false
        };
    }
    
    leerSensor() {
        console.log("LEERSENSOR");
    }
}