//Remake without animations

class Player extends Phaser.GameObjects.Sprite {
    constructor(scene) {
        super(scene);
        this.scene = scene;
    }
    
    printG(){
        console.log('G');
    }
    
    printF(){
        console.log('F');
    }
}