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
            let editorContent = this.flask.getCode();
            this.readWritten(editorContent);
            this.stateMachine.next();
            /*if (!sceneThis.mainScene.debugMode) //Only if debugMode of the mainScene is not activated
                this.disabled = true;*/
        };


        /* KEYBOARD */

        // To debug camera
        // (Now NOT used)
        this.key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR);
        this.key6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX);
        this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE);
        this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE);
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE);


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

        this.itemsObject = [];

        this.itemObject.forEach(element => {
            switch (element.name) {
                case "lantern":
                    this.lantern = new Lantern(this);
                    this.itemsObject.push(this.lantern);
                    break;
                case "fridge":
                    this.fridge = new Fridge(this);
                    this.itemsObject.push(this.fridge);
                    break;
                case "sink":
                    this.sink = new Sink(this);
                    this.itemsObject.push(this.sink);

                    this.zombie = new Zombie(this, 0, 0, direction.RIGHT);
                    this.zombie.setZombiePosition(0, 2);
                    this.zombie.movingToPosition(3, 2);
                    //this.zombie.setVisible(true);

                    break;
                case "box":
                    this.box1 = new Box(this, true);
                    this.box2 = new Box(this, false);
                    this.box3 = new Box(this, false);
                    this.itemsObject.push(this.box1);
                    this.itemsObject.push(this.box2);
                    this.itemsObject.push(this.box3);
                    break;
            }
        });


        // At first disallowed the editor
        this.activateEditor(false);

        this.console = new ConsoleInfoScene(this);
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
     * Update the state object with the player
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
    setPlayerState(newState) {
        console.log("Seting state...")
        this.andy.setPlayerPosition(newState.position[0], newState.position[1]);
        this.andy.setPlayerRotation(newState.rotation);
        this.inventory.updateItems(newState.items);
    }

    drawMoveRect() {
        // TO DO
        this.tutorialSquare = this.add.rectangle(200, 200, this.tileSize * this.zoom, this.tileSize * this.zoom, 0x42ffff, 0.25);
        this.tutorialSquare.setStrokeStyle(5, 0x42ffff, 0.7);
        this.tutorialSquare.visible = true;
    }

    matrixToCoor(matrixCoor){
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
        let andy = this.andy;
        let linterna = this.lantern;
        let nevera = this.fridge;
        let grifo = this.sink;
        let caja1 = this.box1;
        let caja2 = this.box2;
        let caja3 = this.box3;
        let consola = this.console;

        let zombie = this.zombie;

        /* NUEVO PARSER */
        this.environment = {
            andy: this.andy.exposed,
            zombie: this.zombie.exposed,
            consola: this.console.exposed,
            ...this.itemsObject,
        };

        this.ast = lex(editorContent)

        // TEST
        let mainScene = this.mainScene;

        let args = 'andy, linterna, nevera, grifo, caja1, caja2, caja3, mainScene, zombie, consola';

        try {
            let executeMe = this.createFunction(args, editorContent);
            executeMe(andy, linterna, nevera, grifo, caja1, caja2, caja3, mainScene, zombie, consola);
            this.stateMachine.codeErrors = false;
        } catch (e) {
            console.error(e);
            this.stateMachine.codeErrors = true;
        }

        this.stateMachine.next();
    }


    /**
     * When the editor is activate you can write and push the RUN button
     * @param {boolean} allowed True activate the editor
     */
    activateEditor(allowed) { // TO CHANGE NAME activateEditor() ??
        document.getElementById("run").disabled = !allowed;
        //this.editor.readOnly = !allowed; // TO CHANGE
        // TO DO Remove or activate button animation
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
        // Camera debug
        // (Now NOT need)
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
