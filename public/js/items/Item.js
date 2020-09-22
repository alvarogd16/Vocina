class Item extends Phaser.Physics.Arcade.Sprite {
    
    constructor(scene, x, y, name) {
        super(scene, x, y);

        this.name = name;

        this.scene = scene;
        //this.matrix = this.scene.mapMatrix;
        //this.posMatrix = this.scene.itemPos; SPECIFIC
        
        //The scale is relative to the map, and an extra substraction to make it a little bit smaller
        this.itemScale = this.scene.zoom;
        
        this.setScale(this.itemScale * 0.6);
        
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);
        
        //Set the skins of the sprite
        this.setTexture(this.name);
        this.setPosition(x, y);
        
        this.body.setSize(this.scene.tileSize, this.scene.tileSize);
        
        //With this offset calculation the hitbox is situtated right on the center of the sprite
        let bodyOffset = Math.trunc(this.scene.tileSize / 2);
        this.body.setOffset(bodyOffset, bodyOffset);
    }

    setItemPosition(xPos, yPos) {
        let tileSize = this.scene.tileSize;
        this.x = (this.scene.wallSize + tileSize / 2 + tileSize * xPos) * this.scene.zoom;
        this.y = (this.scene.wallSize + tileSize / 2 + tileSize * yPos) * this.scene.zoom;
    }
}