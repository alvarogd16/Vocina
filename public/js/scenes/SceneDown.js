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
        this.lightOn = true;
        this.widthD = document.getElementById('gameContainer').clientWidth
        this.heightD = document.getElementById('gameContainer').clientHeight
    }

    /**
     * Map data from MainScene
     * @param {number} numLevel - The level's number
     */
    init(numLevel) {
        this.numLevel = numLevel;
    }

    /**
     * Load all assets in cache
     */
    preload() {
        // Player sprite.
        this.load.spritesheet({
            key: 'player',
            url: "assets/andy/chico.png",
            frameConfig: {
                frameWidth: 207, //The width of the frame in pixels.
                frameHeight: 207, //The height of the frame in pixels. Uses the frameWidth value if not provided.
                startFrame: 0, //The first frame to start parsing from.
                endFrame: 12, //The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
                margin: 0, //The margin in the image. This is the space around the edge of the frames.
                spacing: 0 //The spacing between each frame in the image.
            }
        });

        // Zombie sprite.
        this.load.spritesheet({
            key: 'zombie',
            url: "assets/zombie.png",
            frameConfig: {
                frameWidth: 21,
                frameHeight: 26,
                startFrame: 0,
                endFrame: 0,
                margin: 0,
                spacing: 0
            }
        });

        this.keyJson = "json" + this.numLevel;
        this.keyImgMap  = "map" + this.numLevel;

        //Load json and image map
        this.load.json(this.keyJson, "json/level" + this.numLevel + ".json");
        this.load.image(this.keyImgMap, "assets/maps/level" + this.numLevel + ".jpg", true);

        /* ROTATE TO FOR THE PLAYER */
        var url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexrotatetoplugin.min.js';
        this.load.plugin('rexrotatetoplugin', url, true);

    }

    /**
     * Make the scene 
     */
    create() {
        this.mainScene = this.scene.get('MainScene');
        this.debugMode = this.mainScene.debugMode;

        /* MAP DATA */
        this.mapName = this.cache.json.get(this.keyJson).name;
        this.playerStartPosition = this.cache.json.get(this.keyJson).position; //[x, y]
        this.sublevels = this.cache.json.get(this.keyJson).sublevels; //[x, x1, ...]
        this.mapMatrix = this.cache.json.get(this.keyJson).map;
        //console.log(this.mapMatrix[2+9*10]);
        
        
        /* EDITOR */

        //Check that it is not already created
        //if (document.getElementsByClassName('CodeMirror').length === 0) {
            this.editor = this.mainScene.editor;

            //Create the button to run the code
            let sceneThis = this;
            document.getElementById("run").onclick = function () {
                let editorContent = sceneThis.editor.getValue();
                sceneThis.readWritten(editorContent);
                if (!sceneThis.mainScene.debugMode && !sceneThis.arrivedSublevel) //Only if debugMode of the mainScene is not activated
                    this.disabled = true;
            };
        //}

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

        this.cameras.main.setSize(this.mapNewSize, this.mapNewSize);
        this.cameras.main.setPosition(this.mapX, this.mapY);


        this.map = this.add.image(0, 0, this.keyImgMap).setOrigin(0);
        this.map.setTint(0x000033); //0xffffff
        this.map.setScale(this.zoom);

        /* PHYSICS AND PLAYER */

        // Set physics boundaries from map width and height and create the player
        this.physics.world.setBounds(0, 0,
            this.mapNewSize,
            this.mapNewSize);

        this.setPlayerStartLevelPosition();

        //this.zombie1 = new Zombie(this, andyX+128, andyY-128, this.andy).setScale(1.3);
        //this.zombie2 = new Zombie(this, andyX, andyY-128, this.andy).setScale(1.3);

        /* ILLUMINATION */
        this.light = this.add.circle(this.andyX, this.andyY, 50, 0xffffff, 0.10);
        this.light.visible = true;

        this.andy = new Player(this, this.andyX, this.andyY);


        /* DEBUG INFO */

        // if(this.debugMode){
        //     showInfoCameras(this.size, this.mapX, this.mapY, this.center, this.zoom, false);
        //     showInfoTile(this.tileSize,this.numOfTiles, this.sizeMapOriginal, this.numLevel, false);
        //     showInfoAndy(this.andyX, this.andyY, this.andyScale, false);
        //     showInfoRaspi(false);
        // }

        this.setLight(true);
    }

    setPlayerStartLevelPosition() {
        //Set player position
        this.andyX = (this.wallSize + this.tileSize / 2 + this.tileSize * this.playerStartPosition[0]) * this.zoom;
        this.andyY = (this.wallSize + this.tileSize / 2 + this.tileSize * this.playerStartPosition[1]) * this.zoom;
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
        let args = 'andy';
        let executeMe = this.createFunction(args, editorContent);
        executeMe(andy);
    }
    
    /**
     * Reset function for the SceneDown and SceneUp, and also some variables aside from the scenes
     */
    resetGame(delayTime){
    this.time.delayedCall(delayTime, function () { //Just to wait until the sceneUp showed the whole message
        this.arrivedGoal = false; //Reset the boolean to check if andy is in the GOAL tile for the player class

        this.editor.setValue(""); //Clear codemirror field
        this.editor.clearHistory();

        //this.andy.turnOffLED(); //Also LED (Lantern light in level 1) must be reset
        this.cache.json.remove(this.keyJson);
        this.mainScene.closeScenes();

        }, [], this);
    }

    /**
     * When andy has reached the goal
     */
    andyHaLLegadoAlObjetivo() {
        if (!this.mainScene.debugMode) { //Only if debugMode of the mainScene is not activated
            this.arrivedGoal = true;
            let sceneUp = this.scene.get('SceneUp');
            sceneUp.write('Llegaste andy, enhorabuena!');
            this.resetGame(5000);
        }
    }

    /**
     * When andy has not reached the goal
     */
    andyNoHallegadoAlObjetivo() {
        if (!this.mainScene.debugMode) { //Only if debugMode of the mainScene is not activated
            let sceneUp = this.scene.get('SceneUp');
            sceneUp.write('No has llegado andy :(, pero a la próxima podrás conseguirlo :)');
            this.resetGame(9000);
        }
    }

    /**
     * To the next level, calling the method in mainScene
     */
    pasarDeNivel(level) {
        let sceneUp = this.scene.get('SceneUp');
        if (this.todosSubnivelesCompletados(level)) {  
            sceneUp.write('Has encontrado la siguiente habitación!');
            this.time.delayedCall(5000, function () { //Just to wait until the sceneUp showed the whole message
                this.arrivedGoal = false; //Reset the boolean to check if andy is in the GOAL tile for the player class
                this.editor.setValue(""); //Clear codemirror field
                this.editor.clearHistory();

                //this.cache.json.remove('map');
                //this.cache.json.remove('json');//The next json should be loaded
                this.mainScene.nextLevel();
            }, [], this);
        }
        else{
            sceneUp.write('Primero has de completar los demás subniveles andy!');
            this.resetGame(9000);  
        }
    }

    /**
     * If any sublevel is not completed, then should return false, if all completed then true
     */
    todosSubnivelesCompletados(level) {
        let enc = true;
        for (let i = 0;
            (i < this.sublevels.length) && enc; i++) {
            if (this.sublevels[i] !== -1)
                enc = false;
        }
        return enc;
    }

    /**
     * This function is called when a sublevel is completed by andy
     */
    andyCompletaSubnivel(level, subnivelCompletado) {
        let sceneUp = this.scene.get('SceneUp');
        if (level === 1) {
            if (subnivelCompletado === 3 && this.buscarSubnivel(subnivelCompletado)) {
                sceneUp.write('Has cogido la linterna! para encenderla escribe: andy.turnOnLED();');
                //this.andy.matrix
            } else{
                sceneUp.write('Este subnivel ya está completado andy, deberías intentar llegar al final...');
                this.resetGame(5000);
            }
        } else if (level === 2) {

        }
    }

    /**
     * Checks if a sublevel was completed, and then returns true, otherwise returns false
     */
    buscarSubnivel(subnivel) {
        let enc = false;
        for (let i = 0;
            (i < this.sublevels.length) && !enc; i++) {
            if (this.sublevels[i] === subnivel) {
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
     * @param {boolean} value 
     */
    setLight(value) {
        this.lightOn = value;
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