/** Class representing the lantern on the first level
 */
class Lantern extends ItemObject{
    
    constructor(scene) {
        super(scene);
        this.items = {
            "LED": false,
            "Button": false
        };
    }
    
    encender() {
        console.log("ENCENDER");
        this.scene.setLight(true);
    }
    
}