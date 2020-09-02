/* Father class of fridge and lantern classes. Also, physics phaser sprite that's not seen on the map
 */
class ItemObject extends Phaser.Physics.Arcade.Sprite {

    constructor(scene) {
        super(scene);
        this.scene = scene;
        this.items = {};
    }

    //Install a new item into the dictionary
    instalar(key) {
        //if (this.isItemInInventory(key)) {
            var keyIsInItems = false;
            for (var keyAux in this.items) {
                if (key === keyAux)
                    keyIsInItems = true;
            }

            //To check if the item exists for the corresponding ItemObject
            if (keyIsInItems) {
                this.items[key] = 1;
                console.log("Installed " + key);
            } else
                console.log("Error installing a nonexistent item")
        //} else console.log("Error installing an item that was not collected yet")
    }

    //Through an AND operation to all the items in the dictionary, checks if all the items are installed
    comprobarItems() {
        var auxBool = true;
        for (var key in this.items) {
            var value = this.items[key];
            auxBool = auxBool && value;
        }
        console.log(auxBool);
        return auxBool;
    }

    //Is item in inventory
    isItemInInventory(item) {
        this.scene.inventory.searchItem(item);
    }
}
