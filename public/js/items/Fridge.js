/** Class representing the fridge on the second level
 */
class Fridge extends ItemObject {

    constructor(scene) {
        super(scene);
        this.items = {
            "sensor": false
        };
        this.temporary = false;
        //this.temperatureEncoder;
    }

    leerSensor() {
        if (this.comprobarItems()) {
            if (this.temporary == false) {
                this.temporary = true;
                console.log("22");
                return 22;
            } else {
                console.log("-20");
                return -20;
            }
        } else
            console.log("ERROR NEVERA -- No se encuentran instalados todos los items necesarios");
    }
}
