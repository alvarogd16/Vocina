class Item extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, frame) {
        super(scene, x, y, frame);

        this.scene = scene;
        this.matrix = this.scene.mapMatrix;
        //this.posMatrix = this.scene.itemPos; SPECIFIC
        
        //this.setScale(); DONT KNOW
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        
        //Set the skins of the sprite
        //this.setTexture('');
        this.setPosition(x, y);
        
        //Set collisions activation of the sprite
        this.body.setCollideWorldBounds(true);

        //On world bounds 
        this.body.onWorldBounds = true;
        this.scene.physics.world.on('worldbounds', this.onWorldBounds, this);
        
        //the hitbox is (height=tileHeight, width=tileWidth)
        this.body.setSize(this.scene.tileSize, this.scene.tileSize);
        
        //With this offset calculation the hitbox is situtated right on the center of the sprite
        let bodyOffset = Math.trunc(this.scene.tileSize / 2);
        this.body.setOffset(bodyOffset, bodyOffset);
    }
    
    onWorldBounds() {
        console.log('Item '+)
    }
}