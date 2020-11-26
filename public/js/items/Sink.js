/** Class representing the sink on the third level
 */
class Sink extends ItemObject {

    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.items = {
            "soap": false
        };
    }

    // //Put a new item into the dictionary
    // poner(key) {
    //     //if (this.isItemInInventory(key)) {
    //     var keyIsInItems = false;
    //     for (var keyAux in this.items) {
    //         if (key === keyAux)
    //             keyIsInItems = true;
    //     }

    //     //To check if the item exists for the corresponding ItemObject
    //     if (keyIsInItems) {
    //         this.items[key] = 1;
    //         console.log("Installed " + key);
    //     } else
    //         console.log("Error installing a nonexistent item")
    //     //} else console.log("Error installing an item that was not collected yet")
    // }

    encender() {
        console.log("Grifo encendido");
        //if (this.comprobarItems()) {
        //Playing sink sound
        this.scene.espuma = new AnimatedEntity(this.scene, this.scene.wallSize + (this.scene.tileSize * 1), this.scene.wallSize, 1, 'espuma');

        this.scene.water = new AnimatedEntity(this.scene, this.scene.wallSize + 6 + (this.scene.tileSize * 1), (this.scene.wallSize / 2) - 2, 0.5, 'water');

        this.scene.water.anims.play('waterAnim', true);

        this.waterTap = this.scene.sound.add('waterTap');
        this.waterTap.play();

        this.scene.espuma.anims.play('espumaAnim', true);

        /*} else
            console.log("ERROR GRIFO -- No se encuentran instalados todos los items necesarios");*/
    }

    //Through an AND operation to all the items in the dictionary, checks if all the items are installed
    comprobarItems() {
        var auxBool = true && this.items['soap'];
        console.log(auxBool);
        return auxBool;
    }
}