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
        this.canMove = true;
        scene.physics.world.enable(this);
        scene.add.existing(this);

        //Set the skins of the sprite
        this.setTexture('player');
        this.setPosition(x, y);

        //Set collisions activation of the sprite
        this.body.setCollideWorldBounds(true);
        //the hitbox is (height=tileHeight, width=tileWidth, x=andyX, y=andyY) (andyX & andyY both calculated in SceneDown)
        this.body.setSize(scene.tileSize, scene.tileSize, x, y);

        this.lastAnim = null;
        this.vel = 200;
        this.onStairs = false;
        this.direction = null;
        this.target = new Phaser.Math.Vector2();

        // Boolean to control if the player cant move
        this.andyIsMoving = false;
        this.numberMov = 0;


        /*ANIMATIONS*/

        createAnimations(scene);
        this.andyMovesQueue = new Queue();
    }


    /*FUNCTIONS TO USE BY USER*/

    //An example of use raspiClient
    turnOnLED() {
        raspiRead('LED')
            .then(data => console.log("CLIENT: ", data));

        raspiWrite('LED', 1);

        raspiRead('LED')
            .then(data => console.log("CLIENT: ", data));
    }

    //Console method to put the values of a new target (To the right) into the queue
    moveRight(numberOfMovs) {
        this.targetAux = new Phaser.Math.Vector2();
        if (this.andyMovesQueue.isEmpty()) { //If it's empty it's target it's calculated as usually
            this.targetAux.x = this.x + 32 * numberOfMovs;
            this.targetAux.y = this.y;
        } else { //If it's with movements inside already it has to take the last target and calculate the next one based on that one
            this.targetAux.x = this.andyMovesQueue.last().x + 32 * numberOfMovs;
            this.targetAux.y = this.andyMovesQueue.last().y;
        }
        this.targetAux.dir = 'right';
        this.andyMovesQueue.enqueue(this.targetAux);
    }

    //Method to finally move the player to the right
    movingRight(numberOfMovs) {
        //Take the first target in the queue
        this.targetAux = this.andyMovesQueue.first();
        this.target.x = this.targetAux.x;
        this.target.y = this.targetAux.y;

        this.direction = 'right';
        this.animationName = "walk-up";
        this.setFlipX(true);
        this.startAnimation();

        //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
        this.scene.physics.moveToObject(this, this.andyMovesQueue.dequeue(), 30);
    }

    //Console method to put the values of a new target (To the left) into the queue
    moveLeft(numberOfMovs) {
        this.targetAux = new Phaser.Math.Vector2();
        if (this.andyMovesQueue.isEmpty()) { //If it's empty it's target it's calculated as usually
            this.targetAux.x = this.x - 32 * numberOfMovs;
            this.targetAux.y = this.y;
        } else { //If it's with movements inside already it has to take the last target and calculate the next one based on that one
            this.targetAux.x = this.andyMovesQueue.last().x - 32 * numberOfMovs;
            this.targetAux.y = this.andyMovesQueue.last().y;
        }
        this.targetAux.dir = 'left';
        this.andyMovesQueue.enqueue(this.targetAux);
    }

    //Method to finally move the player to the left
    movingLeft(numberOfMovs) {
        //Take the first target in the queue
        this.targetAux = this.andyMovesQueue.first();
        this.target.x = this.targetAux.x;
        this.target.y = this.targetAux.y;

        this.direction = 'left';
        this.animationName = "walk-up";
        this.setFlipX(true);
        this.startAnimation();

        //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
        this.scene.physics.moveToObject(this, this.andyMovesQueue.dequeue(), 30);
    }

    //Console method to put the values of a new target (To move it up) into the queue
    moveUp(numberOfMovs) {
        this.targetAux = new Phaser.Math.Vector2();
        if (this.andyMovesQueue.isEmpty()) { //If it's empty it's target it's calculated as usually
            this.targetAux.x = this.x;
            this.targetAux.y = this.y - 32 * numberOfMovs;
        } else { //If it's with movements inside already it has to take the last target and calculate the next one based on that one
            this.targetAux.x = this.andyMovesQueue.last().x;
            this.targetAux.y = this.andyMovesQueue.last().y - 32 * numberOfMovs;
        }
        this.targetAux.dir = 'up';
        this.andyMovesQueue.enqueue(this.targetAux);
    }

    //Method to finally move the player up
    movingUp(numberOfMovs) {
        //Take the first target in the queue
        this.targetAux = this.andyMovesQueue.first();
        this.target.x = this.targetAux.x;
        this.target.y = this.targetAux.y;

        this.direction = 'up';
        this.animationName = "walk-up";
        this.setFlipX(false);
        this.startAnimation();

        //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
        this.scene.physics.moveToObject(this, this.andyMovesQueue.dequeue(), 30);
    }

    //Console method to put the values of a new target (To move it down) into the queue
    moveDown(numberOfMovs) {
        this.targetAux = new Phaser.Math.Vector2();
        if (this.andyMovesQueue.isEmpty()) { //If it's empty it's target it's calculated as usually
            this.targetAux.x = this.x;
            this.targetAux.y = this.y + 32 * numberOfMovs;
        } else { //If it's with movements inside already it has to take the last target and calculate the next one based on that one
            this.targetAux.x = this.andyMovesQueue.last().x;
            this.targetAux.y = this.andyMovesQueue.last().y + 32 * numberOfMovs;
        }
        this.targetAux.dir = 'down';
        this.andyMovesQueue.enqueue(this.targetAux);
    }

    //Method to finally move the player down
    movingDown(numberOfMovs) {
        //Take the first target in the queue
        this.targetAux = this.andyMovesQueue.first();
        this.target.x = this.targetAux.x;
        this.target.y = this.targetAux.y;

        this.direction = 'down';
        this.animationName = "walk-up";
        this.setFlipX(false);
        this.startAnimation();

        //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
        this.scene.physics.moveToObject(this, this.andyMovesQueue.dequeue(), 30);
    }

    /*OTHER FUNCTIONS*/

    //turn the animation in 'this.animationName' on
    startAnimation() {
        this.anims.play(this.animationName, true);
    }

    stopAnimation() {
        //  This will just top the animation from running, freezing it at its current frame
        this.anims.stop();
    }

    //Before scene update
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        if (this.canMove) {

            // Player movement control, when condition it's true, player is moving and condition can't be trespassed
            if (!this.andyMovesQueue.isEmpty() && !this.andyIsMoving) {
                this.andyIsMoving = true;
                //Check the direction variable in the last queue element
                if (this.andyMovesQueue.first().dir == 'right')
                    this.movingRight();
                else if (this.andyMovesQueue.first().dir == 'left')
                    this.movingLeft();
                else if (this.andyMovesQueue.first().dir == 'up')
                    this.movingUp();
                else if (this.andyMovesQueue.first().dir == 'down')
                    this.movingDown();
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
                //If the sprite reaches it's destination or it touches one of the walls stabilished in the map, it's animation should stop
                if (distance < 0.3) {
                    this.body.reset(this.target.x, this.target.y);
                    this.stopAnimation();

                    //Restart the movement control
                    this.andyIsMoving = false;
                }
            }
        }
    }
}