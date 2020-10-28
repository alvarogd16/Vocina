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
		scene.physics.world.enable(this);
		scene.add.existing(this);

		this.setTexture('zombie');
		this.setPosition(x, y);
		this.setScale(scene.zoom);
		this.setAngle(rotation);

		this.direction = "right";

		this.OFFSETS = {
            'up':    [ 0, -1],
            'down':  [ 0,  1],
            'left':  [-1,  0],
            'right': [ 1,  0],
		};

		this.exposed = {
			cerca: this.cerca,
		};

		//Set collisions activation of the sprite
		//this.body.setCollideWorldBounds(true);
		//the hitbox is (height=tileHeight, width=tileWidth, x=andyX, y=andyY) (andyX & andyY both calculated in SceneDown)
		//this.body.setSize(scene.tileSize, scene.tileSize, x, y);
		//this.body.setSquare(10);

		//this.target = new Phaser.Math.Vector2();

	}

	/*OTHER FUNCTIONS*/
	movingToPosition(xPos, yPos) {
		this.target = {};
		[this.target.x, this.target.y] = this.scene.matrixToCoor({x: xPos, y: yPos});
		this.canMove = true;
		
		//5 pixels per second (Is the value of this.body.speed)
		//this.scene.physics.moveToObject(this, this.target, 20);
	}

	/**
     * Set player position in the map with a x and y
     * @param {number} x X position in the matrix
     * @param {number} y Y position in the matrix
     */
    setZombiePosition(xPos, yPos) {
		[this.x, this.y] = this.scene.matrixToCoor({x: xPos, y: yPos});
    }

	preUpdate(time, delta) {
		super.preUpdate(time, delta);

		if (this.canMove) {
			if(this.x <= this.target.x && this.y <= this.target.y){
				let [xOff, yOff] = this.OFFSETS[this.direction];

				this.x += 0.5 * xOff;
				this.y += 0.5 * yOff;
			} else{
				// It has arrive
				console.log("Ha llegado");
				this.canMove = false;
			}
		}
	}
    
    cerca(distance) {
		let zPos = this.matrixPos;
		let aPos = this.scene.andy.matrixPos;

		let xDist = abs(zPos[0] - aPos[0]);
		let yDist = abs(zPos[1] - aPos[1]);

        return xDist + yDist <= distance;
	}
	
	killAndy() {
		// TO DO
		return true;
	}
}