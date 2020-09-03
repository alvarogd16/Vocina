/** Class representing the boxes on the fourth level
 */
class Box extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, correctBox) {
        super(scene);
        this.scene = scene;
        this.correctBox = correctBox;
    }
    
    probar(boxCode) {
        if(this.correctBox && boxCode == 45) {
            //Playing unlocked box sound
            this.unlockedBox = this.scene.sound.add('unlockedBox');
            this.unlockedBox.play();
            console.log(" - codigo correcto: "+boxCode);
        }
        else if(!this.correctBox && boxCode == 999){
            //Playing locked box sound
            this.lockedBox = this.scene.sound.add('lockedBox');
            this.lockedBox.play();
            console.log(" - ningún código resultó útil");        
            }
    }
}