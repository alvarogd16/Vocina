/** Class representing the lantern on the first level
 */
class Lantern extends ItemObject {

    constructor(scene) {
        super(scene);
        // this.items = {
        //     "LED": false,
        //     "Button": false
        // };

        this.items = ["led", "button"]
    }

    encender(inventory) {
        // if (!this.comprobarItems()) {
        //     this.scene.setLight(true);

        //     //Playing lantern sound
        //     this.lanternClick = this.scene.sound.add('lanternClick');
        //     this.lanternClick.play();
        // } else
        //     console.log("ERROR LINTERNA -- No se encuentran instalados todos los items necesarios");

        //Check if the items arein the inventory
        let enc = true;
        this.items.forEach(item => {
            if(!inventory.searchItem(item))
                enc = false;
        });

        if(enc){
            this.scene.setLight(true);

            //Playing lantern sound
            this.lanternClick = this.scene.sound.add('lanternClick');
            this.lanternClick.play();
        }
    }

}
