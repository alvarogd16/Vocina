/** Class representing the fridge on the second level
 */
class Fridge extends ItemObject {

    constructor(scene) {
        super(scene);
        this.items = {
            "sensor": false
        };
        this.temporary = false;

        this.actualTemp = 20;   //It modify with the encoder
        this.tempAfter = -20;   //Temp necessary to freeze zombies
    }

    leerSensor() {
        if (this.comprobarItem("sensor")) {
            // if (this.temporary == false) {
            //     this.temporary = true;
            //     console.log(this._tempBefore);
            //     return this._tempBefore;
            // } else {
            //     console.log("-20");
            //     return -20;
            // }

            //this.actualTemp = 20;
            
            return this.actualTemp;
        } else
            console.log("ERROR NEVERA -- No se encuentran instalados todos los items necesarios");
    }

    checkTemp() {
        return this.actualTemp === this.tempAfter;
    }
}
