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
     * Load all map data in cache
     */
    preload() {
        /* JSON LOAD */

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

        // In case it was necessary
        // this.cache.json.remove();

        this.mapName = this.cache.json.get(this.keyJson).name; //I think that is not usefull
        this.playerStartPosition = this.cache.json.get(this.keyJson).position;  //[x, y]
        this.playerStartRotation = this.cache.json.get(this.keyJson).rotation;  //right, up...
        this.sublevels = this.cache.json.get(this.keyJson).sublevels;           //array with objects
        this.mapMatrix = this.cache.json.get(this.keyJson).map;
        this.jsonItems = this.cache.json.get(this.keyJson).items;               //[{name, position}]
        this.itemObject = this.cache.json.get(this.keyJson).itemObject;         //name

        //Control the sublevels flow
        this.stateMachine = this.mainScene.stateMachine;
               
        /* EDITOR */
        
        this.flask = this.mainScene.flask;

        //Create the button to run the code
        document.getElementById("run").onclick = () => {
            let editorContent = this.flask.getCode();
            this.readWritten(editorContent);
            this.stateMachine.next();
            /*if (!sceneThis.mainScene.debugMode) //Only if debugMode of the mainScene is not activated
                this.disabled = true;*/
        };

        /* KEYBOARD */

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


        this.andy = new Player(this, 0, 0);
        //Calculate the map position with the matrix position
        this.andy.setPlayerPosition(this.playerStartPosition[0], this.playerStartPosition[1]);
        this.andy.setPlayerRotation(this.playerStartRotation);

        this.light = this.add.circle(this.andy.x, this.andy.y, 50, 0xffffff, 0.10);
        this.light.visible = false;

        /* INVENTORY */

        this.inventory = new Inventory();

        /* LOAD ITEMS */

        //Store all level items object
        this.mapItems = [];

        this.jsonItems.forEach(jsonItem => {
            let mapItem = new Item(this, 0, 0, jsonItem.name);
            mapItem.setItemPosition(jsonItem.position[0], jsonItem.position[1]);
            mapItem.disableBody(true, true);    //Hide the item

            this.mapItems.push(mapItem);
        });

        /* LOAD ITEMOBJECTS */

        this.itemObject.forEach(element => {
            switch(element.name){
                case "lantern":
                    this.lantern = new Lantern(this);
                    break;
                case "fridge":
                    this.fridge = new Fridge(this);
                    break;
                case "sink":
                    this.sink = new Sink(this);
                    this.zombie = new Zombie(this);
                    break;
                case "box":
                    this.box1 = new Box(this, false);
                    this.box2 = new Box(this, true);
                    this.box3 = new Box(this, false);
                    break;
            }
        });

        //At first disallowed this opctions
        this.runButtonAndWriteAllowed(false);
    }

    getSublevelType(sublevelId) {
        return this.sublevels[sublevelId].type;
    }

    getSublevelObjetive(sublevelId) {
        return this.sublevels[sublevelId].objetives;
    }

    getSublevelsNum() {
        return this.sublevels.length - 1;
    }

    initializePlayerState() {
        let playerState = {
            position: this.andy.getPlayerPosition(),
            rotation: this.andy.getPlayerRotation(),
            items: this.inventory.getItems()
        };
        return playerState;
    }

    setPlayerState(newState) {
        this.andy.setPlayerPosition(newState.position[0], newState.position[1]);
        this.andy.setPlayerRotation(newState.rotation);
        this.inventory.updateItems(newState.items);
    }

    /* EJECUTE CODE */

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
            this.stateMachine.codeErrors = false;
        } catch (e) {
            console.error(e);
            this.stateMachine.codeErrors = true;
        }

        this.stateMachine.next();
    }

    runButtonAndWriteAllowed(allowed) {
        document.getElementById("run").disabled = !allowed;
        //this.editor.readOnly = !allowed; Not working
        //Remove or activate button animation
    }

    /**
     * Set visible the item and activate the collision
     * @param {String} itemName 
     */
    prepareItem(itemName) {
        let mapItem;
        this.mapItems.forEach(element => {
            if(itemName === element.name) mapItem = element;
        })

        mapItem.enableBody(false, 0, 0, true, true);  //Activate and show the item
        this.physics.add.overlap(this.andy, mapItem, function () {
            mapItem.disableBody(true, true);
            this.inventory.addItem(mapItem.name);
            //console.log(this.inventory);

            this.pickUp = this.sound.add('pickUp');
            this.pickUp.play();
        }, null, this);
    }


    /**
     * If any sublevel is not completed, then should return false, if all completed then true
     */
    allSublevelsCompleted(level) {
        let enc = true;
        for (let i = 0; (i < this.sublevels.length) && enc; i++) {
            if (!this.sublevels[i].complete)
                enc = false;
        }
        return enc;
    }

    /**
     * Checks if a sublevel was completed and then returns true, otherwise returns false
     * 
     * ¡¡¡ NO NEED NOW !!!
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
     * Set light on or off
     * @param {boolean} value on is true and off false
     */
    setLight(value) {
        this.lightOn = !value;
        this.light.visible = !value;
        if(value)
            this.map.setTint(0xffffff);
        else 
            this.map.setTint(0x000033);
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