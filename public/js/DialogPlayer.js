/** Class representing the zombie.
  * @extends Phaser.GameObjects.Sprite
  */
 class DialogPlayer extends Phaser.Physics.Arcade.Sprite {

	/**
	 * Create the zombie.
	 * @param {object} scene - scene creating the zombie.
	 * @param {number} x - Start location x value.
	 * @param {number} y - Start location y value.
	 * @param {number} [frame] -
	 */
	constructor(scene, x, y, frame) {
		super(scene, x, y, frame);

		this.scene = scene;
		scene.physics.world.enable(this);
		scene.add.existing(this);

		//Set the skins of the sprite
		this.setTexture('player2');
		this.setPosition(x, y);

		//Set collisions activation of the sprite
		this.body.setCollideWorldBounds(true);

		//the hitbox is (height=tileHeight, width=tileWidth, x=andyX, y=andyY) (andyX & andyY both calculated in SceneDown)
		this.body.setSize(scene.tileSize, scene.tileSize, x, y);        
        this.setScale(3);

        createAnimationsSceneUp(scene);
        this.anims.play('talk', true);
	}

}