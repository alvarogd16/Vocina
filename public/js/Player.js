/**
 * Class representing the player.
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
        this.currentRoom = 1; // Set start room so room change flag doens't fire.
        this.previousRoom = null;
        this.roomChange = false;
        this.canMove = true;
        scene.physics.world.enable(this);
        scene.add.existing(this);

        //Set the skins of the sprite
        this.setTexture('player');
        this.setPosition(x, y);

        //Set collisions activation of the sprite (Also the hitbox)
        this.body.setCollideWorldBounds(true);
        //this.body.setOffset(-7, -16);
        //this.body.setSquare(10);

        this.lastAnim = null;
        this.vel = 200;
        this.onStairs = false;
        this.direction = null;
        this.target = new Phaser.Math.Vector2();

        // Boolean to control if the player cant move
        this.movement = true;
        this.numberMov = 0;


        /*ANIMATIONS*/

       createAnimations(scene);
    }


    /*FUNCTIONS TO USE BY USER*/

    moveRight(numberOfMovs) {
        //16 is the distance between the center of two tiles, or the distance the sprite has to travel
        //to reach the next tile
        while(this.isMoving);
        this.isMoving = true;
        if (this.canMove) {
            this.target.x = this.x + 32 * numberOfMovs;
            this.target.y = this.y;

            this.direction = 'right';
            this.animationName = "walk-up";
            this.setFlipX(false);
            this.startAnimation();

            //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
            this.scene.physics.moveToObject(this, this.target, 30);
        } else if(!numberOfMovs) console.error("Funcion vacia");
    }

    moveLeft(numberOfMovs) {
        //16 is the distance between the center of two tiles, or the distance the sprite has to travel
        //to reach the next tile
        while(this.isMoving);
        this.isMoving = true;
        if (this.canMove) {
            while(this.isMoving){}
            this.target.x = this.x - 32 * numberOfMovs;
            this.target.y = this.y;

            this.direction = 'left';
            this.animationName = "walk-up";
            this.setFlipX(true);
            this.startAnimation();

            //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
            this.scene.physics.moveToObject(this, this.target, 30);
        }
    }

    moveUp(numberOfMovs) {
        //16 is the distance between the center of two tiles, or the distance the sprite has to travel
        //to reach the next tile
        while(this.isMoving);
        this.isMoving = true;
        if (this.canMove) {
            this.target.x = this.x;
            //y coordinate is "reversed", that is: positive y means DOWN and negative y means UP
            this.target.y = this.y - 32 * numberOfMovs;

            this.direction = 'up';
            this.animationName = 'walk-up';
            this.startAnimation();

            //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
            this.scene.physics.moveToObject(this, this.target, 30);
        }
    }

    moveDown(numberOfMovs) {
        //16 is the distance between the center of two tiles, or the distance the sprite has to travel
        //to reach the next tile
        while(this.isMoving);
        this.isMoving = true;
        if (this.canMove) {
            this.target.x = this.x;
            this.target.y = this.y + 32 * numberOfMovs;

            this.direction = 'down';
            this.animationName = 'walk-up';
            this.startAnimation();

            //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
            this.scene.physics.moveToObject(this, this.target, 30);
        }
    }

    moveCamera(){
        this.sceneB = this.scene.get('SceneDown');
        this.sceneB.moveCamera();
    }

    //An example of use raspiClient
    turnOnLED() {
        raspiRead('LED')
        .then(data => console.log("CLIENT: ", data));

        raspiWrite('LED', 1);

        raspiRead('LED')
        .then(data => console.log("CLIENT: ", data));        
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

    /**
     * Called before Update.
     * @param {object} time
     * @param {number} delta
     */
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        //If the sprite reaches it's destination, it's animation should stop
        if (this.x === this.target.x && this.y === this.target.y) {
            this.stopAnimation();
            this.isMoving = false;
        }

        if (this.canMove) {
            // standing
            let currentDirection = this.direction;
            if (this.direction === 'left') {
                currentDirection = 'right';
            } //account for flipped sprite
            this.animationName = 'stand-' + currentDirection;

            //Distance between andy and the point will reach
            let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

            if (this.body.speed > 0) {
                //console.log(this.body.speed)
                //  4 is our distance tolerance, i.e. how close the source can get to the target
                //  before it is considered as being there. The faster it moves, the more tolerance is required.
                if (distance < 0.5) {
                    this.body.reset(this.target.x, this.target.y);
                }
            }
        }
    }
}