class Fire extends Phaser.Physics.Arcade.Sprite {

    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene.add.existing(this);
        
        this.scene.physics.world.enable(this);
        
        this.setTexture('fire');
        
        this.body.setSize(432, 432);
        
        this.x = x;
        this.y = y;
        
        /*ANIMATIONS*/

        createAnimationsFire(scene);
    }


}