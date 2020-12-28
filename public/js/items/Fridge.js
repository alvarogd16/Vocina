/** Class representing the fridge on the second level
 */
class Fridge extends ItemObject {

    constructor(scene) {
        super(scene);
        this.scene = scene;

        this.items = {
            "sensor": false,
            "encoder": false
        };
        this.read = true;

        this.actualTemp = 20;   // It modify with the encoder
        this.tempAfter = -20;   // Temp necessary to freeze zombies

        socket.on('encoder', () => {
		    console.log("signal")
            if(this.items["sensor"]){
            	this.actualTemp -= 1;
            }
        });
    }

    async leerSensor() {
        if (!this.comprobarItem("sensor")) {
            if(this.read){
                console.log("Reading...")
                this.actualTemp = await raspiRead("TEMPS");
            }

            this.scene.console.escribir(this.actualTemp);
            this.scene.stateMachine.next();
            
        } else
            console.log("ERROR NEVERA -- No se encuentran instalados todos los items necesarios");
    }

    // readTrueSensor() {
    //     raspiRead("TEMPS")
    //         .then(value => {
    //             return value;
    //         })
    //         .catch(() => {
    //             console.log("Lectura fallida");
    //             return 20;
    //         })
    // }

    checkTemp() {
        return this.actualTemp <= this.tempAfter;
    }
}
