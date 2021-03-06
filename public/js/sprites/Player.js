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
        this.matrix = this.scene.mapMatrix;
        this.posMatrix = this.scene.playerStartPosition; //Andy's position in the map

        //The scale of the player is relative to the map, and an extra substraction to make it a little bit smaller
        this.andyScale = this.scene.zoom;

        //The scale of the pixels the player has to go trhough have to be calculated based on the tileSize and on the andyScale, it has to be relative to the map.
        //Also, a one has to be added up to the result, just to ensure more exact positioning when moving the player
        this.tileSizeOfTheMovement = Math.trunc(this.scene.tileSize * this.andyScale) + 1;

        this.setScale(this.andyScale);

        this.collision = false;
        this.scene.physics.world.enable(this);
        this.scene.add.existing(this);

        //Set the skins of the sprite
        this.setTexture('player');
        //this.setPosition(x, y);

        //Set collisions activation of the sprite
        this.body.setCollideWorldBounds(true);

        //the hitbox is (height=tileHeight, width=tileWidth, x=andyX, y=andyY) (andyX & andyY both calculated in SceneDown)
        this.body.setSize(this.scene.tileSize, this.scene.tileSize);

        //With this offset calculation the hitbox is situtated right on the center of the sprite
        let bodyOffset = Math.trunc(this.scene.tileSize / 2);
        this.body.setOffset(bodyOffset, bodyOffset);

        this.direction = null;
        this.target = new Phaser.Math.Vector2();

        // Boolean to control if the player cant move
        this.codeError = false;
        this.andyIsMoving = false;
        this.numberMov = 0;


        /* Load rotateTo plugin from SceneDown */
        this.rotateTo = this.scene.plugins.get('rexrotatetoplugin').add(this, {
            speed: 360
        });

        /* Load moveTo plugin from SceneDown */
        this.moveTo = this.scene.plugins.get('rexmovetoplugin').add(this, {
            speed: 60 //speed : Moving speed, pixels in second.
        })


        this.moveTo.on('complete', (thisSprite) => {
            this.body.reset(this.target.x, this.target.y);
            this.stopAnimation();

            //Restart the movement control
            this.andyIsMoving = false;

            // When the move stop
            if (this.andyMovesQueue.length == 0) {
                if(!this.codeError){
                    console.log('next player')
                    this.scene.stateMachine.next();
                } else {
                    let lastState = this.scene.stateMachine.lastPlayerState;
                    //console.log(lastState);
				    this.scene.setPlayerState(lastState, this.scene.stateMachine.sublevelObjetive[1]);
                    this.codeError = false;
                }
            }
        });

        /*ANIMATIONS*/

        createAnimationsPlayer(scene);

        //Queue to stock moves
        this.andyMovesQueue = new Queue();

    }

    /*FUNCTIONS TO USE BY USER*/

    /**
     * Console method to put the values of a new target (To the right) into the queue
     * @param {number} numberOfMovs - The number of right moves
     */
    moverDerecha(numberOfMovs) {
        this.move(numberOfMovs, 'right');
    }

    /**
     * Console method to put the values of a new target (To the left) into the queue
     * @param {number} numberOfMovs - The number of left moves
     */
    moverIzquierda(numberOfMovs) {
        this.move(numberOfMovs, 'left');
    }

    /**
     * Console method to put the values of a new target (To move it down) into the queue
     * @param {number} numberOfMovs - The number of down moves
     */
    moverAbajo(numberOfMovs) {
        this.move(numberOfMovs, 'down');
    }

    /**
     * Console method to put the values of a new target (To move it up) into the queue
     * @param {number} numberOfMovs - The number of up moves
     */
    moverArriba(numberOfMovs) {
        this.move(numberOfMovs, 'up');
    }

    move(numberOfMovs, direction) {
        numberOfMovs = this.matrixMovement(numberOfMovs, direction);

        let OFFSETS = {
            'up': [0, -1],
            'down': [0, 1],
            'left': [-1, 0],
            'right': [1, 0],
        };

        let [xOff, yOff] = OFFSETS[direction];

        this.targetAux = new Phaser.Math.Vector2();
        this.targetAux.dir = direction;

        if(numberOfMovs == 0){
            this.targetAux.x = this.x;
            this.targetAux.y = this.y;
            this.targetAux.dir = this.direction;

            this.andyMovesQueue.enqueue(this.targetAux);
        }

        for (let i = 0; i < numberOfMovs; i++) {
            if (this.andyMovesQueue.length == 0) { //If it's empty it's target it's calculated as usually
                this.targetAux.x = this.x + xOff * this.tileSizeOfTheMovement;
                this.targetAux.y = this.y + yOff * this.tileSizeOfTheMovement;
            } else { //If it's with movements inside already it has to take the last target and calculate the next one based on that one
                this.targetAux.x = this.andyMovesQueue.last().x + xOff * this.tileSizeOfTheMovement;
                this.targetAux.y = this.andyMovesQueue.last().y + yOff * this.tileSizeOfTheMovement;
            }
            this.andyMovesQueue.enqueue(this.targetAux);
        }
    }

    // MATRIX MOVE

    matrixMovement(numberOfMovs, direction) {

        if (numberOfMovs > 0) {
            // Map bounds collision
            let boundCollision = false;

            for (let i = 0; i < numberOfMovs; i++) {
                switch (direction) {
                    case 'up':
                        if (this.posMatrix[1] == 0)
                            boundCollision = true;
                        else
                            this.posMatrix[1]--;
                        break;

                    case 'down':
                        if (this.posMatrix[1] == 9)
                            boundCollision = true;
                        else
                            this.posMatrix[1]++;
                        break;

                    case 'right':
                        if (this.posMatrix[0] == 9)
                            boundCollision = true;
                        else
                            this.posMatrix[0]++;
                        break;

                    case 'left':
                        if (this.posMatrix[0] == 0)
                            boundCollision = true;
                        else
                            this.posMatrix[0]--;
                        break;
                }
                this.actualPos = this.matrix[this.posMatrix[1]][this.posMatrix[0]];

                // Collision with obstacle or map bounds
                if (this.actualPos === '#' || boundCollision) {
                    numberOfMovs = i;
                    this.collision = true;
                    console.log('Player')
                    break;
                }
            }

        } else {
            console.log("Valor incorrecto");
            numberOfMovs = 0;
        }

        return numberOfMovs;
    }

    // MOVING

    /**
     * Method to finally move the player
     * @param {string} dir - The move's direction
     */
    moving(dir) {
        //Take the first target in the queue
        this.targetAux = this.andyMovesQueue.dequeue();

        this.target.x = this.targetAux.x;
        this.target.y = this.targetAux.y;

        this.direction = dir;
        this.playerRotation = dir;
        this.animationName = "chicoCamina";
        this.startAnimation();

        //Rotate the player before moving
        let angle;
        switch (this.direction) {
            case 'right':
                angle = 90;
                break;
            case 'left':
                angle = 270;
                break;
            case 'down':
                angle = 180;
                break;
            case 'up':
                angle = 360;
                break;
        }
        this.rotateTo.rotateTo(angle);

        this.moveTo.moveTo(this.targetAux.x, this.targetAux.y);
    }

    /*OTHER FUNCTIONS*/

    /**
     * Set player position in the map with a x and y
     * @param {number} x X position in the matrix
     * @param {number} y Y position in the matrix
     */
    setPlayerPosition(xPos, yPos) {
        this.posMatrix[0] = xPos;
        this.posMatrix[1] = yPos;

        let tileSize = this.scene.tileSize;
        this.x = (this.scene.wallSize + tileSize / 2 + tileSize * xPos) * this.scene.zoom;
        this.y = (this.scene.wallSize + tileSize / 2 + tileSize * yPos) * this.scene.zoom;
    }

    getPlayerPosition() {
        return [...this.posMatrix];
    }

    /**
     * Set player rotation to a specifies direction
     * @param {string} direction Represent the player direction
     */
    setPlayerRotation(direction) {
        this.playerRotation = direction;

        switch (direction) {
            case 'right':
                this.setAngle(90);
                break;
            case 'left':
                this.setAngle(270);
                break;
            case 'down':
                this.setAngle(180);
                break;
            case 'up':
                this.setAngle(360);
                break;
        }
    }

    getPlayerRotation() {
        return this.playerRotation;
    }

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

        //Play walk sound
        this.walk = this.scene.sound.add('walk');
        this.walk.play();
    }

    /**
     * Stop the animation from running, freezing it at its current frame
     */
    stopAnimation() {
        this.anims.stop();

        //Stop walk sound
        this.walk.stop();
    }


    /**
     * Before scene update. All player logic
     * @param {number} time 
     * @param {number} delta 
     */
    preUpdate(time, delta) {
        super.preUpdate(time, delta);

        //Light follow the player. Light configuration ONLY in level one to activate the lantern
        if (this.scene.lightOn)
            this.scene.light.setPosition(this.x, this.y);

        // Player movement control, when condition it's true, player is moving and condition can't be trespassed
        if (!this.andyMovesQueue.length == 0 && !this.andyIsMoving) {
            this.andyIsMoving = true;
            //Check the direction variable in the last queue element
            let dir = this.andyMovesQueue.peek().dir;
            this.moving(dir);
        }

        // standing
        let currentDirection = this.direction;
        if (this.direction === 'left')
            currentDirection = 'right';
        //account for flipped sprite
        this.animationName = 'stand-' + currentDirection;
    }
}