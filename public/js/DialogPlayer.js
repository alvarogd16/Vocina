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
	constructor(scene, x, y, zoom) {
		super(scene, x, y);

		this.scene = scene;
		scene.add.existing(this);

		//this.setOrigin(0);

		//Set the skins of the sprite
		this.setTexture('talkSprite');
		this.setPosition(x, y);
     
        this.setScale(zoom);

        createAnimationsSceneUp(scene);
	}

}