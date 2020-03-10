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
        this.isMoving = false;
        scene.physics.world.enable(this);
        scene.add.existing(this);

        //Set the skins of the sprite
        this.setTexture('player');
        this.setPosition(x, y);

        //Set collisions activation of the sprite (Also the hitbox)
        this.body.setCollideWorldBounds(true);
        this.body.setOffset(7, 16);
        this.body.setCircle(3);

        this.lastAnim = null;
        this.vel = 200;
        this.onStairs = false;
        this.direction = null;
        this.target = new Phaser.Math.Vector2();

        // Boolean to control if the player cant move
        this.movement = true;
        this.numberMov = 0;

        config = {
            key: 'stand-down',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 0,
                end: 0
            }),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

        config = {
            key: 'stand-right',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 4,
                end: 4
            }),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

        config = {
            key: 'stand-up',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 8,
                end: 8
            }),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);


        var config = {
            key: 'walk-down',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 0,
                end: 3
            }),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

        var config = {
            key: 'walk-right',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 4,
                end: 7
            }),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

        var config = {
            key: 'walk-up',
            frames: scene.anims.generateFrameNumbers('player', {
                start: 8,
                end: 11
            }),
            frameRate: 15,
            repeat: -1
        };
        scene.anims.create(config);

    }

    moveRight(numberOfMovs && numberOfMovs) {
        //16 is the distance between the center of two tiles, or the distance the sprite has to travel
        //to reach the next tile
        while(this.isMoving);
        this.isMoving = true;
        if (this.canMove) {
            this.target.x = this.x + 16 * numberOfMovs;
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
            this.target.x = this.x - 16 * numberOfMovs;
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
            this.target.y = this.y - 16 * numberOfMovs;

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
            this.target.y = this.y + 16 * numberOfMovs;

            this.direction = 'down';
            this.animationName = 'walk-up';
            this.startAnimation();

            //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
            this.scene.physics.moveToObject(this, this.target, 30);
        }
    }
    
    //An example of use raspiClient
    turnOnLED() {
        raspiRead('LED')
        .then(data => console.log("CLIENT: ", data));
                
        raspiWrite('LED', 1);

        raspiRead('LED')
        .then(data => console.log("CLIENT: ", data));        
    }

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
        if (this.x == this.target.x && this.y == this.target.y) {
            this.stopAnimation();
            this.isMoving = false;
        }

        //this comparasion is supossed to be done only when the sprite is going to pass from one room to another one
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
                //  4 is our distance tolerance, i.e. how close the source can get to the target
                //  before it is considered as being there. The faster it moves, the more tolerance is required.
                if (distance < 0.5) {
                    this.body.reset(this.target.x, this.target.y);
                }
            }

            // Check for room change.
            this.getRoom();
        }
    }


    /** Returns player's current and previous room, flags rooms player has entered. */
    getRoom() {

        // place holder for current room.
        let roomNumber;

        // loop through rooms in this level.
        for (let room in this.scene.rooms) {
            let roomLeft = this.scene.rooms[room].x;
            let roomRight = this.scene.rooms[room].x + this.scene.rooms[room].width;
            let roomTop = this.scene.rooms[room].y;
            let roomBottom = this.scene.rooms[room].y + this.scene.rooms[room].height;

            // Player is within the boundaries of this room.
            if (this.x > roomLeft && this.x < roomRight &&
                this.y > roomTop && this.y < roomBottom) {

                roomNumber = room;

                // Set this room as visited by player.
                let visited = this.scene.rooms[room].properties.find(function (property) {
                    return property.name === 'visited';
                });

                visited.value = true
            }
        }

        // Update player room variables.
        if (roomNumber != this.currentRoom) {
            this.previousRoom = this.currentRoom;
            this.currentRoom = roomNumber;
            this.roomChange = true;
        } else {
            this.roomChange = false;
        }
    }
}