/** Class representing the zombie.
  * @extends Phaser.GameObjects.Sprite
  */
class Zombie extends Phaser.Physics.Arcade.Sprite {

	/**
	 * Create the zombie.
	 * @param {object} scene - scene creating the zombie.
	 * @param {number} x - Start location x value.
	 * @param {number} y - Start location y value.
	 * @param {number} [frame] -
	 */
	constructor(scene, x, y, rotation) {
		super(scene, x, y);

		this.scene = scene;
		this.playerToFollow = undefined;
		this.canMove = true;
		//scene.physics.world.enable(this);
		scene.add.existing(this);

		this.setTexture('zombie');
		this.setPosition(x, y);
		this.setScale(scene.zoom);
		this.setAngle(rotation);

		//Set collisions activation of the sprite
		//this.body.setCollideWorldBounds(true);
		//the hitbox is (height=tileHeight, width=tileWidth, x=andyX, y=andyY) (andyX & andyY both calculated in SceneDown)
		//this.body.setSize(scene.tileSize, scene.tileSize, x, y);
		//this.body.setSquare(10);

		//this.direction = "down";
		//this.target = new Phaser.Math.Vector2();

	}

	/*OTHER FUNCTIONS*/
	movingToAndy() {
		this.target.x = this.playerToFollow.x;	//andy's x coordinate
		this.target.y = this.playerToFollow.y;	//andy's y coordinate
		
		//5 pixels per second (Is the value of this.body.speed)
		this.scene.physics.moveToObject(this, this.target, 5);
	}

	/**
     * Set player position in the map with a x and y
     * @param {number} x X position in the matrix
     * @param {number} y Y position in the matrix
     */
    setZombiePosition(xPos, yPos) {
        let tileSize = this.scene.tileSize;
        this.x = (this.scene.wallSize + tileSize / 2 + tileSize * xPos) * this.scene.zoom;
        this.y = (this.scene.wallSize + tileSize / 2 + tileSize * yPos) * this.scene.zoom;
    }

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

		if (this.canMove) {
			//this.movingToAndy();

			//Distance between andy and this zombie will reach
			// let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

			// if (this.body.speed > 0 && distance < 15) {
			// 	this.scene.zombiesReachedAndy();
			// }
		}
	}
    
    cerca() {
		// TO DO
        return true;
	}
	
	killAndy() {
		// TO DO
		return true;
	}
}