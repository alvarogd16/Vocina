/** Class representing the fridge on the second level
 */
class Fridge extends ItemObject{

    constructor(scene) {
        super(scene);
        this.items = {
            "sensor": false,
            "enconder": false
        };
    }
    
    leerSensor() {
        console.log("LEERSENSOR");
    }
}