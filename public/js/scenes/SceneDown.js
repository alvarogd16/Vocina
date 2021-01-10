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

        this.lightOn = false;
        this.trapActive = false;
        this.checkCode = true;
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
        this.cameras.main.fadeIn(3000);
        
        this.mainScene = this.scene.get('MainScene');
        this.sceneUp = this.scene.get('SceneUp');
        this.debugMode = this.mainScene.debugMode;


        /* MAP DATA */

        // In case it was necessary
        // this.cache.json.remove();

        this.mapName = this.cache.json.get(this.keyJson).name; // Its not usefull
        this.playerStartPosition = this.cache.json.get(this.keyJson).position; // [x, y]
        this.playerStartRotation = this.cache.json.get(this.keyJson).rotation; // Right, up...
        this.sublevels = this.cache.json.get(this.keyJson).sublevels; // Array with sublevels objects
        this.mapMatrix = this.cache.json.get(this.keyJson).map; // Matrix with map info collisions
        this.jsonItems = this.cache.json.get(this.keyJson).items; // [{name, position}]
        this.itemObject = this.cache.json.get(this.keyJson).itemObject; // Some special objects (lantern, fridge...)

        // Control the sublevels flow
        this.stateMachine = this.mainScene.stateMachine;

        /* EDITOR */

        this.flask = this.mainScene.flask;

        //Create the button to run the code
        document.getElementById("run").onclick = () => {

            this.editorContent = this.flask.getCode();
            this.readWritten(this.editorContent);

            console.log("Sublevel type: ", this.getSublevelType(this.stateMachine.sublevelId));


            if (this.getSublevelType(this.stateMachine.sublevelId) == "trap" && !this.stateMachine.codeErrors) {
                this.trapActive = true;
                this.checkCode = false;

                console.log("Zombie action...")
                this.zombie.setVisible(true);
                this.zombie.movingToPosition(4, 2, "right");
            }

            this.stateMachine.next();
        };


        /* MAP AND CAMERAS*/

        // Some constants to the camera and map positions
        this.zoom = this.widthD / this.mapSize; // Zoom level to adapt the map to the scene
        this.mapNewSize = this.widthD;
        this.mapX = 0;
        this.mapY = this.heightD - this.widthD;

        this.map = this.add.image(0, 0, this.keyImgMap).setOrigin(0);
        this.map.setScale(this.zoom);

        this.cameras.main.setSize(this.mapNewSize, this.mapNewSize);
        this.cameras.main.setPosition(this.mapX, this.mapY);

        /* PHYSICS, PLAYER AND ILLUMINATION */

        // Set physics boundaries from map width and height and create the player
        this.physics.world.setBounds(0, 0,
            this.mapNewSize,
            this.mapNewSize);


        this.andy = new Player(this, 0, 0);
        this.andy.setPlayerPosition(this.playerStartPosition[0], this.playerStartPosition[1]);
        this.andy.setPlayerRotation(this.playerStartRotation);

        // To the lantern sublevel
        this.light = this.add.circle(this.andy.x, this.andy.y, 50, 0xffffff, 0.10);
        this.light.visible = false;


        /* INVENTORY */

        this.inventory = new Inventory();


        /* LOAD ITEMS */

        // Store all level items object
        this.mapItems = [];

        this.jsonItems.forEach(jsonItem => {
            let mapItem = new Item(this, 0, 0, jsonItem.name);
            mapItem.setItemPosition(jsonItem.position[0], jsonItem.position[1]);
            mapItem.disableBody(true, true); // Hide the item

            this.mapItems.push(mapItem);
        });


        /* LOAD ITEMOBJECTS */
        // (Change the name, it's confuse with items)

        this.entitiesObject = [];

        this.itemObject.forEach(element => {
            switch (element.name) {
                case "lantern":
                    this.lantern = new Lantern(this);
                    this.entitiesObject.push(this.lantern);
                    break;
                case "fridge":
                    this.fridge = new Fridge(this);
                    this.entitiesObject.push(this.fridge);
                    break;
                case "sink":
                    this.sink = new Sink(this);
                    this.entitiesObject.push(this.sink);

                    this.zombie = new Zombie(this, 0, 0, direction.RIGHT);
                    this.zombie.setZombiePosition(0, 2);
                    this.zombie.setVisible(false);
                    this.entitiesObject.push(this.zombie);

                    break;
                case "box":
                    this.box = new Box(this);
                    this.entitiesObject.push(this.box);
                    break;
            }
        });


        // At first disallowed the editor
        this.activateEditor(false);

        // To comunicate with the user. For example temperature in the bathroom
        this.console = new ConsoleInfoScene(this);

        createAnimationsBathroom(this);
    }


    /**
     * Get sublevel type with the ID
     * @param {Number} sublevelId 
     */
    getSublevelType(sublevelId) {
        return this.sublevels[sublevelId].type;
    }


    /**
     * Get sublevel objetive with the ID
     * @param {Number} sublevelId 
     */
    getSublevelObjetive(sublevelId) {
        return this.sublevels[sublevelId].objetives;
    }


    deleteSublevelMove(sublevelId, index) {
        this.sublevels[sublevelId].objetives.splice(index, 1);
    }


    /**
     * Get the total number of sublevels minus one in the level
     */
    getSublevelsNum() {
        return this.sublevels.length - 1;
    }


    /**
     * Update the state object with the player new info
     */
    updatePlayerState() {
        console.log("Updating state...")
        let playerState = {
            position: this.andy.getPlayerPosition(),
            rotation: this.andy.getPlayerRotation(),
            items: this.inventory.getItems()
        };
        return playerState;
    }


    /**
     * Update the player with the state object
     * @param {Object} newState The new state of the player
     */
    setPlayerState(newState, itemName) {
        console.log("Seting state...")
        this.andy.setPlayerPosition(newState.position[0], newState.position[1]);
        this.andy.setPlayerRotation(newState.rotation);
        this.inventory.updateItems(newState.items);
        //If it's an item sublevel and, there's an error or didn't reach the item properly
        if (this.stateMachine.sublevelType == 'item' && (this.stateMachine.codeErrors || this.stateMachine.itemSublevelNotCompleted))
            this.prepareItem(itemName);
    }

    // Not implemented
    drawMoveRect() {
        // TO DO
        this.tutorialSquare = this.add.rectangle(200, 200, this.tileSize * this.zoom, this.tileSize * this.zoom, 0x42ffff, 0.25);
        this.tutorialSquare.setStrokeStyle(5, 0x42ffff, 0.7);
        this.tutorialSquare.visible = true;
    }

    /**
     * Translate matrix coordinates to map's pixels coordinates
     * @param {Object} matrixCoor Matrix x and y position
     */
    matrixToCoor(matrixCoor) {
        let xyCoor = [];
        xyCoor[0] = (this.wallSize + this.tileSize / 2 + this.tileSize * matrixCoor.x) * this.zoom;
        xyCoor[1] = (this.wallSize + this.tileSize / 2 + this.tileSize * matrixCoor.y) * this.zoom;

        return xyCoor;
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
        // Arguments to the user
        let andy        = this.andy;
        let linterna    = this.lantern;
        let nevera      = this.fridge;
        let grifo       = this.sink;
        let caja        = this.box;
        let consola     = this.console;
        let zombie      = this.zombie;
        let mainScene   = this.mainScene;

        let args = 'andy, linterna, nevera, grifo, caja, mainScene, zombie, consola';

        try {
            let executeMe = this.createFunction(args, editorContent);
            executeMe(andy, linterna, nevera, grifo, caja, mainScene, zombie, consola);

        } catch (e) {
            console.error(e);
            this.stateMachine.codeErrors = true;
        }

        let sublevelType = this.getSublevelType(this.stateMachine.sublevelId);
        let noMoveInMoveSublevel = (editorContent.search("mover") < 0) && (sublevelType == "move" || sublevelType == "item");


        if (this.checkCode) {
            this.stateMachine.next();
        }

        if (noMoveInMoveSublevel && !this.stateMachine.codeErrors) {
            this.stateMachine.next();
        }

    }


    /**
     * When the editor is activate you can write and push the RUN button
     * @param {boolean} allowed True activate the editor
     */
    activateEditor(allowed) {
        document.getElementById("run").disabled = !allowed;
    }


    /**
     * Set visible the item and activate the collision
     * @param {String} itemName 
     */
    prepareItem(itemName) {
        let mapItem;
        this.mapItems.forEach(element => {
            if (itemName === element.name) mapItem = element;
        })

        mapItem.enableBody(false, 0, 0, true, true); //Activate and show the item
        this.physics.add.overlap(this.andy, mapItem, function () {
            mapItem.disableBody(true, true);
            this.inventory.addItem(mapItem.name);

            this.pickUp = this.sound.add('pickUp');
            this.pickUp.play();
        }, null, this);
    }


    /**
     * If any sublevel is not completed, then should return false, if all completed then true
     */
    allSublevelsCompleted(level) {
        let enc = true;
        for (let i = 0;
            (i < this.sublevels.length) && enc; i++) {
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
    /*searchSublevel(sublevel) {
        let enc = false;
        for (let i = 0;
            (i < this.sublevels.length) && !enc; i++) {
            if (this.sublevels[i] === sublevel) {
                this.sublevels[i] = -1; //This sublevel is visited, so can't complete it two times in a level iteration
                enc = true;
            }
        }
        return enc;
    }*/


    /**
     * Set light on or off
     * @param {boolean} value on is true and off false
     */
    setLight(value) {
        this.lightOn = !value;
        this.light.visible = !value;
        if (value)
            this.map.setTint(0xffffff);
        else
            this.map.setTint(0x000033);
    }


    /**
     * Update the scene
     */
    update() {
        if (this.trapActive) {
            if (this.zombie.arrive || this.zombie.dead) {
                console.log("Stop ejecution");

                this.trapActive = false;
                this.checkCode = true;

                // when the zombie dies you have to wait for the animation
                if (this.zombie.arrive) {
                    console.log("Arrived");
                    this.stateMachine.next();
                }
            } else {
                console.log("Ejecutando...");
                this.readWritten(this.editorContent);
            }

        }
    }
}