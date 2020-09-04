/** Class where the game action occurs
 *  @extends Phaser.Scene
 */
class SceneDown extends Phaser.Scene {
    /**
     * Create the scene
     */
    constructor() {
        super("SceneDown");
        console.log('Creating SceneDown...');

        this.mapSize = 1125; //Original map sizes
        this.tileSize = 103; //Measured with photoshop
        this.wallSize = 44; //Measured with photoshop

        this.arrivedGoal = false; //This is used for the player (update snippet in which it's checked whether the player reached a target or not) to know how to distinguish between reaching a target (means didn't reach the GOAL) and reaching the GOAL
        this.arrivedSublevel = false;
        this.lastSublevelMatrixPositionFirst = 0;
        this.lastSublevelMatrixPositionSecond = 0;
        this.lastLevelCompleted = 0;
        this.lightOn = false;
        this.widthD = document.getElementById('gameContainer').clientWidth
        this.heightD = document.getElementById('gameContainer').clientHeight

    }

    /**
     * Level data from MainScene
     * @param {number} numLevel - The level's number
     */
    init(numLevel) {
        this.numLevel = numLevel;
    }

    /**
     * Load all assets in cache
     */
    preload() {
        // JSON LOAD

        this.keyJson = "json" + this.numLevel;
        this.keyImgMap = "map" + this.numLevel;

        this.load.json(this.keyJson, "json/level" + this.numLevel + ".json");
        this.load.image(this.keyImgMap, "assets/maps/level" + this.numLevel + ".jpg", true);
    }

    /**
     * Make the scene 
     */
    create() {
        this.mainScene = this.scene.get('MainScene');
        this.sceneUp = this.scene.get('SceneUp');
        this.debugMode = this.mainScene.debugMode;

        /* MAP DATA */

        this.mapName = this.cache.json.get(this.keyJson).name;
        this.playerStartPosition = this.cache.json.get(this.keyJson).position; //[x, y]
        this.sublevels = this.cache.json.get(this.keyJson).sublevels; //[x, x1, ...]
        this.mapMatrix = this.cache.json.get(this.keyJson).map;
        this.sentences = this.cache.json.get(this.keyJson).sentences; //text, time
        this.items = this.cache.json.get(this.keyJson).items; //name, position
        this.itemObject = this.cache.json.get(this.keyJson).itemObject; //name

        /* EDITOR */

        /*
        
        this.editor = this.mainScene.editor;
        
        */
        
        this.flask = this.mainScene.flask;

        //Create the button to run the code
        let sceneThis = this;
        document.getElementById("run").onclick = function () {
            /* let editorContent = sceneThis.editor.getValue(); */
            let editorContent = sceneThis.flask.getCode();
            console.log(editorContent);
            sceneThis.readWritten(editorContent);
            //if (!sceneThis.mainScene.debugMode) //Only if debugMode of the mainScene is not activated
            //    this.disabled = true;
        };

        /*KEYBOARD*/

        //To debug camera
        this.key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR);
        this.key6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX);
        this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE);
        this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE);
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE);


        /* MAP AND CAMERAS*/

        //Some constants to the camera and map positions
        this.zoom = this.widthD / this.mapSize; //Zoom level to adapt the map to the scene
        this.mapNewSize = this.widthD;
        this.mapX = 0;
        this.mapY = this.heightD - this.widthD;

        this.map = this.add.image(0, 0, this.keyImgMap).setOrigin(0);
        this.map.setScale(this.zoom);

        this.cameras.main.setSize(this.mapNewSize, this.mapNewSize);
        this.cameras.main.setPosition(this.mapX, this.mapY);

        /* MAP BOUNDS */

        //X axis
        this.leftBound = this.wallSize * this.zoom;
        this.rightBound = ((this.wallSize * this.zoom) + ((this.tileSize * this.zoom) * 10) - (this.wallSize * this.zoom));
        //Y axis. Towards upper bound, the position becomes smaller
        this.upperBound = this.wallSize * this.zoom;
        this.bottomBound = ((this.wallSize * this.zoom) + ((this.tileSize * this.zoom) * 10) - (this.wallSize * this.zoom));

        /* PHYSICS, PLAYER AND ILLUMINATION */

        // Set physics boundaries from map width and height and create the player
        this.physics.world.setBounds(0, 0,
            this.mapNewSize,
            this.mapNewSize);

        this.setPlayerStartLevelPosition();

        this.andy = new Player(this, this.andyX, this.andyY);

        //Light configuration ONLY in level one to activate the lantern
        if (this.numLevel == 1) {
            this.map.setTint(0x000033); //0xffffff
            this.light = this.add.circle(this.andyX, this.andyY, 50, 0xffffff, 0.10);
            this.light.visible = true;
        }

        /* INVENTORY */

        this.inventory = new Inventory();

        /* LOAD ITEMS */

        this.items.forEach(element => {
            this.setItemPosition(element.position);
            let object = new item(this, this.itemPositionX, this.itemPositionY, 0, element.name);
            this.physics.add.overlap(this.andy, object, function () {
                object.disableBody(true, true);
                this.inventory.addItem(element.name);
                console.log(this.inventory);

                this.pickUp = this.sound.add('pickUp');
                this.pickUp.play();
            }, null, this);
            //console.log(element.name, element.position);
        });

        /* LOAD ITEMOBJECTS */

        this.itemObject.forEach(element => {
            if (element.name == "lantern") {
                this.lantern = new Lantern(this);
            }
            if (element.name == "fridge") {
                this.fridge = new Fridge(this);
            }
            if (element.name == "sink") {
                this.sink = new Sink(this);
                this.zombie = new Zombie(this);
            }
            if (element.name == "box") {
                this.box1 = new Box(this, false);
                this.box2 = new Box(this, true);
                this.box3 = new Box(this, false);
            }
        });



    }

    setPlayerStartLevelPosition() {
        //Set player position
        this.andyX = (this.wallSize + this.tileSize / 2 + this.tileSize * this.playerStartPosition[0]) * this.zoom;
        this.andyY = (this.wallSize + this.tileSize / 2 + this.tileSize * this.playerStartPosition[1]) * this.zoom;
    }

    setItemPosition(position) {
        //Set an item position
        this.itemPositionX = (this.wallSize + this.tileSize / 2 + this.tileSize * position[0]) * this.zoom;
        this.itemPositionY = (this.wallSize + this.tileSize / 2 + this.tileSize * position[1]) * this.zoom;
    }

    /*EJECUTE CODE*/

    /**
     * Create a new function with the code passed by parameter
     * @param {string} args - Arguments for the now function
     * @param {string} code - Code for the new function
     */
    createFunction(args, code) {
        return new Function(args, code);
    }

    /**
     * Process the text in the texteditor
     * @param {string} editorContent 
     */
    readWritten(editorContent) {
        let andy = this.andy;
        let linterna = this.lantern;
        let nevera = this.fridge;
        let grifo = this.sink;
        let caja1 = this.box1;
        let caja2 = this.box2;
        let caja3 = this.box3;

        let zombie = this.zombie;

        //TEST
        let mainScene = this.mainScene;

        let args = 'andy, linterna, nevera, grifo, caja1, caja2, caja3, mainScene, zombie';

        try {
            let executeMe = this.createFunction(args, editorContent);
            executeMe(andy, linterna, nevera, grifo, caja1, caja2, caja3, mainScene, zombie);
        } catch (e) {
            console.error(e);
            this.sceneUp.write("Oh no, hay un error en el codigo, comprueba que este bien")
        }
    }

    /**
     * Reset function for the SceneDown and SceneUp, and also some variables aside from the scenes
     */
    resetGame(delayTime) {
        this.time.delayedCall(delayTime, function () { //Just to wait until the sceneUp showed the whole message
            this.arrivedGoal = false; //Reset the boolean to check if andy is in the GOAL tile for the player class
            this.lastLevelCompleted = 0;
            this.scene.lastSublevelMatrixPosition = 0;

            /*
            
            this.editor.setValue(""); //Clear codemirror field
            this.editor.clearHistory();
            
            */

            //this.andy.turnOffLED(); //Also LED (Lantern light in level 1) must be reset
            this.cache.json.remove(this.keyJson);
            this.mainScene.closeScenes();

        }, [], this);
    }

    resetToSublevel(delayTime) {
        this.time.delayedCall(delayTime, function () { //Just to wait until the sceneUp showed the whole message
            //Player last sublevel completed position set
            this.andyX = (this.wallSize + this.tileSize / 2 + this.tileSize * this.lastSublevelMatrixPositionFirst) * this.zoom;
            this.andyY = (this.wallSize + this.tileSize / 2 + this.tileSize * this.lastSublevelMatrixPositionSecond) * this.zoom;
            this.andy.posMatrix[0] = this.lastSublevelMatrixPositionFirst;
            this.andy.posMatrix[1] = this.lastSublevelMatrixPositionSecond;

            this.andy.setPosition(this.andyX, this.andyY);

            /* 
            
            this.editor.setValue(""); //Clear codemirror field
            this.editor.clearHistory();
            
            */

            this.sceneUp.write('');

            this.andy.collision = false;
            this.andy.collidingWorldBounds = false;
            this.andy.collisionWithoutMovement = false;

            document.getElementById("run").disabled = false; //Also reset the button to click again

            //this.arrivedSublevel = true;
        }, [], this);
    }

    /**
     * When andy has not reached the goal
     */
    andyDidntArriveTheGoal() {
        if (!this.debugMode) {
            this.sceneUp.write(this.sentences['fail']);
            if (this.lastLevelCompleted < 3) { //If non sublevel was completed
                this.resetGame(9000);
            } else { //If any sublevel was completed
                this.resetToSublevel(9000);
            }
        }
    }

    /**
     * To the next level, calling the method in mainScene
     */
    levelUp(level) {
        if (this.allSublevelsCompleted(level)) {
            this.sceneUp.write(this.sentences['goal']);

            this.time.delayedCall(5000, function () { //Just to wait until the sceneUp showed the whole message
                this.arrivedGoal = false; //Reset the boolean to check if andy is in the GOAL tile for the player class
                this.lastLevelCompleted = 0;

                /* 
                
                this.editor.setValue(""); //Clear codemirror field
                this.editor.clearHistory();
                
                */

                //this.cache.json.remove('map');
                //this.cache.json.remove('json');//The next json should be loaded
                this.mainScene.nextLevel();
            }, [], this);
        } else {
            this.sceneUp.write('Primero tienes que completar los demás subniveles Andy...');
            this.resetGame(9000);
        }
    }

    /**
     * If any sublevel is not completed, then should return false, if all completed then true
     */
    allSublevelsCompleted(level) {
        let enc = true;
        for (let i = 0;
            (i < this.sublevels.length) && enc; i++) {
            if (this.sublevels[i] !== -1)
                enc = false;
        }
        return enc;
    }

    /**
     * This function is called when a sublevel is completed by andy, just to show a message on SceneUp and to check the completed sublevels with a -1 in the sublevel vector
     */
    andyCompletesSublevel(completedSublevel) {
        document.getElementById("run").disabled = false; //Also reset the button to click again

        if (this.mainScene.level === 1) {
            switch (completedSublevel) {
                case 3:
                    if (this.searchSublevel(completedSublevel)) {
                        this.sceneUp.write(this.sentences['sublevel1goal']);
                        // message sublevel 2
                        this.time.delayedCall(4000, function () {
                            this.sceneUp.write(this.sentences['sublevel2']);
                        }, [], this);
                    } else {
                        this.sceneUp.write(this.sublevelcompleted);
                        this.resetGame(5000);
                    }
                    break;
                case 4:
                    if (this.searchSublevel(completedSublevel)) {
                        this.sceneUp.write(this.sentences['sublevel2goal']);
                        // message sublevel 2
                        this.time.delayedCall(5000, function () {
                            this.sceneUp.write(this.sentences['sublevel3']);
                        }, [], this);
                    } else {
                        this.sceneUp.write(this.sublevelcompleted);
                        this.resetGame(5000);
                    }
                    break;
                case 5:
                    if (this.searchSublevel(completedSublevel)) {
                        this.sceneUp.write(this.sublevel3goal);
                        // message sublevel 5
                        this.time.delayedCall(5000, function () {
                            this.sceneUp.write(this.sentences['sublevel3goal2']);
                        }, [], this);
                        this.time.delayedCall(5000, function () {
                            this.sceneUp.write(this.sentences['sublevel3goal3']);
                        }, [], this);
                        if (this.inventory.itemCounter == 0) {
                            this.sceneUp.write(this.sentences['sublevel4']);
                            if (this.lightOn == true) {
                                this.time.delayedCall(2000, function () {
                                    this.sceneUp.write(this.sentences['sublevel5g1']);
                                }, [], this);
                                this.time.delayedCall(2000, function () {
                                    this.sceneUp.write(this.sentences['sublevel5g2']);
                                }, [], this);
                            }
                        }
                    } else {
                        this.sceneUp.write(this.sublevelcompleted);
                        this.resetGame(5000);
                    }
                    break;
            }
        } else if (this.mainScene.level === 2) {
            if (completedSublevel === 3 && this.searchSublevel(completedSublevel)) {
                this.sceneUp.write('Has cogido la rueda!');
            } else {
                this.sceneUp.write(this.completedSublevel);
                this.resetGame(5000);
            }
        } else if (this.mainScene.level === 3) {

        } else if (this.mainScene.level === 4) {

        }
    }

    /**
     * Checks if a sublevel was completed (If it is completed, then a -1 is set in that position), and then returns true, otherwise returns false
     */
    searchSublevel(sublevel) {
        let enc = false;
        for (let i = 0;
            (i < this.sublevels.length) && !enc; i++) {
            if (this.sublevels[i] === sublevel) {
                this.sublevels[i] = -1; //This sublevel is visited, so can't complete it two times in a level iteration
                enc = true;
            }
        }
        return enc;
    }


    /**
     * When zombies reached andy
     */
    zombiesReachedAndy() {
        this.cameras.main.shake(500);

        this.time.delayedCall(500, function () {
            this.scene.restart();
        }, [], this);
    }

    /**
     * Set light on
     * @param {boolean} value 
     */
    setLight() {
        this.lightOn = true;
        this.map.setTint(0xffffff);
        this.light.visible = false;
    }

    /**
     * Update the scene
     */
    update() {
        //Camera debug
        if (this.debugMode) {
            if (this.keyShift.isDown) {
                if (this.key4.isDown) this.mapX--;
                if (this.key6.isDown) this.mapX++;
                if (this.key1.isDown) this.zoom -= 0.05;
                if (this.key3.isDown) this.zoom += 0.05;
                if (this.key5.isDown) this.mainScene.nextLevel();
            }

            this.cameras.main.setSize(this.size, this.widthD);
            this.cameras.main.setPosition(this.mapX, this.mapY);
        }
    }
}