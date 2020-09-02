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
        this.items[key] = 1;
    }
    
    //Through an AND operation to all the items in the dictionary, checks if all the items are installed
    comprobarItems() {
        var auxBool = true;
        for(var key in this.items) {
            var value = this.items[key];
            auxBool = auxBool && value;
        }
        console.log(auxBool);
        return auxBool;
    }
}