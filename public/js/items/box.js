/** Class representing the boxes on the fourth level
 */
class Box extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, correctBox) {
        super(scene);
        this.scene = scene;
        this.correctBox = correctBox;
    }
    
    probar(boxNumber) {
        if(this.correctBox && boxCode == 45) {
            //Playing sink sound
            this.unlockedBox = this.scene.sound.add('unlockedBox');
            this.unlockedBox.play();
            console.log("CAJA"+ this.correctBox+" - codigo correcto: "+boxCode);
        }
    }
}