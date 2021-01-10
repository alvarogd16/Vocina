/** Class representing the boxes on the fourth level
 */
class Box extends Phaser.Physics.Arcade.Sprite {

    constructor(scene) {
        super(scene);
        this.scene = scene;

        // A number between 0 and 999
        this.correctCode = parseInt(Math.random()*1000)-1;

        this.open = false;
        this.activated = false;
    }

    probar(boxCode) {
        let correct = false;
        if(this.activated){
            if(boxCode == this.correctCode){
                this.open = correct = true;
            }
        } else {
            console.log("Sorry but your not in the correct box");
        }

        return correct;
    }

    openSound() {
        this.unlockedBox = this.scene.sound.add('unlockedBox');
        this.unlockedBox.play();
        console.log(" - codigo correcto: " + this.correctCode);
    }

    closeSound() {
        this.lockedBox = this.scene.sound.add('lockedBox');
        this.lockedBox.play();
        console.log(" - ningún código resultó útil");
    }

    activate() {
        this.activated = true;
    }

    deactivate() {
        this.activated = false;
    }
}