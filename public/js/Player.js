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

        this.setTexture('player');
        this.setPosition(x, y);

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

    //LEFT
    /*moveLeft(numOfMovs, assign = true) {
        if (assign) {
            this.numberMov = numOfMovs;
        }
        if (this.canMove && this.numberMov > 0) {
            this.direction = 'left';
            this.body.setVelocityX(-this.vel);
            this.animationName = "walk-right";
            this.setFlipX(true);
            //this.lastAnimation();
            //this.vel = 100;
            //this.body.velocity.normalize().scale(this.vel);
        } else {
            //this.canMove = false;
            //this.direction = null;
            //this.numberMov = 0;
        }
    }*/

    moveRight(numberOfMovs) {
        //16 is the distance between the center of two tiles, or the distance the sprite has to travel
        //to reach the next tile
        if (this.canMove) {
            this.target.x = this.x + 16 * numberOfMovs;
            this.target.y = this.y;

            //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
            this.scene.physics.moveToObject(this, this.target, 30);
        }
    }

    moveLeft(numberOfMovs) {
        //16 is the distance between the center of two tiles, or the distance the sprite has to travel
        //to reach the next tile
        if (this.canMove) {
            this.target.x = this.x - 16 * numberOfMovs;
            this.target.y = this.y;

            //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
            this.scene.physics.moveToObject(this, this.target, 30);
        }
    }

    moveUp(numberOfMovs) {
        //16 is the distance between the center of two tiles, or the distance the sprite has to travel
        //to reach the next tile
        if (this.canMove) {
            this.target.x = this.x;
            //y coordinate is "reversed", that is: positive y means DOWN and negative y means UP
            this.target.y = this.y - 16 * numberOfMovs;

            //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
            this.scene.physics.moveToObject(this, this.target, 30);
        }
    }

    moveDown(numberOfMovs) {
        //16 is the distance between the center of two tiles, or the distance the sprite has to travel
        //to reach the next tile
        if (this.canMove) {
            this.target.x = this.x;
            this.target.y = this.y + 16 * numberOfMovs;

            //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
            this.scene.physics.moveToObject(this, this.target, 30);
        }
    }

    //RIGHT
    /*moveRight(numOfMovs, assign = true) {
        if (assign) {
            this.numberMov = numOfMovs;
        }

        if (this.canMove && this.numberMov > 0) {
            this.direction = 'right';
            this.body.setVelocityX(this.vel);
            this.animationName = "walk-right";
            this.setFlipX(false);
            // this.lastAnimation();
        } else {
            //this.canMove = false;
            //this.direction = null;
            //this.numberMov = 0;
        }
    }*/

    /*lastAnimation() {
        if (this.lastAnim !== this.animationName) {
            this.lastAnim = this.animationName;
            this.anims.play(this.animationName, true);
        }
    }*/

    /**
     * Called before Update.
     * @param {object} time
     * @param {number} delta
     */
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        this.animationName = null;

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
                console.log(this.body.speed)
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