/** Class representing the player.
 * @extends Phaser.GameObjects.Sprite
 */
class Player extends Phaser.Physics.Arcade.Sprite {

    /**
     * Create the player.
     * @param {object} scene - scene creating the player.
     * @param {number} x - Start location x value.
     * @param {number} y - Start location y value.
     * @param {number} [frame] -
     */
    constructor(scene, x, y, frame) {
        super(scene, x, y, frame);

        this.scene = scene;
        this.tileSize = 80;
        this.canMove = true;
        scene.physics.world.enable(this);
        scene.add.existing(this);

        //Set the skins of the sprite
        this.setTexture('player');
        this.setPosition(x, y);

        //Set collisions activation of the sprite
        this.body.setCollideWorldBounds(true);

        //On world bounds 
        this.body.onWorldBounds = true;
        this.scene.physics.world.on('worldbounds', this.onWorldBounds, this);
        this.collidingWorldBounds = false;

        //the hitbox is (height=tileHeight, width=tileWidth, x=andyX, y=andyY) (andyX & andyY both calculated in SceneDown)
        this.body.setSize(512, 512, x, y);

        this.lastAnim = null;
        this.vel = 200;
        this.direction = null;
        this.target = new Phaser.Math.Vector2();

        // Boolean to control if the player cant move
        this.andyIsMoving = false;
        this.numberMov = 0;


        /*ANIMATIONS*/

        createAnimationsPlayer(scene);
        this.andyMovesQueue = new Queue();
    }


    /*FUNCTIONS TO USE BY USER*/

    /**Turn on game light and raspberry LED*/
    turnOnLED() {
        raspiWrite('LED', 1);
        this.scene.setLight(true);
    }

    /**Turn off game light and raspberry LED*/
    turnOffLED() {
        raspiWrite('LED', 0);
        this.scene.setLight(false);
    }

    // MOVE FROM CODEMIRROR

    /**
     * Console method to put the values of a new target (To the right) into the queue
     * @param {number} numberOfMovs - The number of right moves
     */
    moveRight(numberOfMovs) {
        this.targetAux = new Phaser.Math.Vector2();
        if (this.andyMovesQueue.isEmpty()) { //If it's empty it's target it's calculated as usually
            this.targetAux.x = this.x + this.tileSize * numberOfMovs;
            this.targetAux.y = this.y;
        } else { //If it's with movements inside already it has to take the last target and calculate the next one based on that one
            this.targetAux.x = this.andyMovesQueue.last().x + this.tileSize * numberOfMovs;
            this.targetAux.y = this.andyMovesQueue.last().y;
        }
        this.targetAux.dir = 'right';
        this.andyMovesQueue.enqueue(this.targetAux);
    }

    /**
     * Console method to put the values of a new target (To the left) into the queue
     * @param {number} numberOfMovs - The number of left moves
     */
    moveLeft(numberOfMovs) {
        this.targetAux = new Phaser.Math.Vector2();
        if (this.andyMovesQueue.isEmpty()) { //If it's empty it's target it's calculated as usually
            this.targetAux.x = this.x - this.tileSize * numberOfMovs;
            this.targetAux.y = this.y;
        } else { //If it's with movements inside already it has to take the last target and calculate the next one based on that one
            this.targetAux.x = this.andyMovesQueue.last().x - this.tileSize * numberOfMovs;
            this.targetAux.y = this.andyMovesQueue.last().y;
        }
        this.targetAux.dir = 'left';
        this.andyMovesQueue.enqueue(this.targetAux);
    }

    /**
     * Console method to put the values of a new target (To move it down) into the queue
     * @param {number} numberOfMovs - The number of down moves
     */
    moveDown(numberOfMovs) {
        this.targetAux = new Phaser.Math.Vector2();
        if (this.andyMovesQueue.isEmpty()) { //If it's empty it's target it's calculated as usually
            this.targetAux.x = this.x;
            this.targetAux.y = this.y + this.tileSize * numberOfMovs;
        } else { //If it's with movements inside already it has to take the last target and calculate the next one based on that one
            this.targetAux.x = this.andyMovesQueue.last().x;
            this.targetAux.y = this.andyMovesQueue.last().y + this.tileSize * numberOfMovs;
        }
        this.targetAux.dir = 'down';
        this.andyMovesQueue.enqueue(this.targetAux);
    }

    /**
     * Console method to put the values of a new target (To move it up) into the queue
     * @param {number} numberOfMovs - The number of up moves
     */
    moveUp(numberOfMovs) {
        this.targetAux = new Phaser.Math.Vector2();
        if (this.andyMovesQueue.isEmpty()) { //If it's empty it's target it's calculated as usually
            this.targetAux.x = this.x;
            this.targetAux.y = this.y - this.tileSize * numberOfMovs;
        } else { //If it's with movements inside already it has to take the last target and calculate the next one based on that one
            this.targetAux.x = this.andyMovesQueue.last().x;
            this.targetAux.y = this.andyMovesQueue.last().y - this.tileSize * numberOfMovs;
        }
        this.targetAux.dir = 'up';
        this.andyMovesQueue.enqueue(this.targetAux);
    }

    // MOVING

    /**
     * Method to finally move the player
     * @param {string} dir - The move's direction
     */
    moving(dir) {
        //Take the first target in the queue
        this.targetAux = this.andyMovesQueue.first();
        this.target.x = this.targetAux.x;
        this.target.y = this.targetAux.y;

        this.direction = dir;
        this.animationName = "chicoCamina";
        this.startAnimation();

        //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
        this.scene.physics.moveToObject(this, this.andyMovesQueue.dequeue(), 60);
    }

    /*OTHER FUNCTIONS*/

    /**
     * Change the level. Only use by teachers
     * @param {number} password - Password to go to the next level 
     * @param {number} level - What level are you going to change
     */
    level(password, level) {
        if (password == 1234)
            this.scene.scene.get('MainScene').nextLevel(level);
    }

    /**
     * Turn the animation in 'this.animationName' on
     */
    startAnimation() {
        this.anims.play(this.animationName, true);
    }

    /**
     * Stop the animation from running, freezing it at its current frame
     */
    stopAnimation() {
        this.anims.stop();
    }

    /**
     * TODO
     */
    onWorldBounds() {
        this.collidingWorldBounds = true;
    }

    /**
     * Before scene update. All player logic
     * @param {number} time 
     * @param {number} delta 
     */
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.canMove) {

            // Player movement control, when condition it's true, player is moving and condition can't be trespassed
            if (!this.andyMovesQueue.isEmpty() && !this.andyIsMoving) {
                this.andyIsMoving = true;
                //Check the direction variable in the last queue element
                let dir = this.andyMovesQueue.first().dir;
                this.moving(dir);
            }

            // standing
            let currentDirection = this.direction;
            if (this.direction === 'left') {
                currentDirection = 'right';
            } //account for flipped sprite
            this.animationName = 'stand-' + currentDirection;

            //Distance between andy and the point will reach
            let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

            if (this.body.speed > 0) {
                //If the sprite reaches one point stored in the queue means that didn't reach the goal tile (checked in a
                //event in the 'SceneDown' class)
                if (distance < 0.1) {
                    this.body.reset(this.target.x, this.target.y);
                    this.stopAnimation();

                    //Restart the movement control
                    this.andyIsMoving = false;

                    //If the sprite reaches the last point in the queue and that point isn't the GOAL then reset
                    if (this.andyMovesQueue.isEmpty() && !this.scene.arrivedGoal) {
                        this.scene.andyNoHallegadoAlObjetivo();
                    }
                } else if (this.collidingWorldBounds) { //If collides a bound then didn't reach the GOAL
                    this.stopAnimation();

                    //Restart the movement control
                    this.andyIsMoving = false;
                    this.scene.andyNoHallegadoAlObjetivo();
                }
            }
        }
    }
}