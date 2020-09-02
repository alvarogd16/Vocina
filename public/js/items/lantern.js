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
        this.scene.setLight(true);
        
        //Turning on lantern sound
        this.lanternClick = this.scene.sound.add('lanternClick');
        this.lanternClick.play();
    }
    
}