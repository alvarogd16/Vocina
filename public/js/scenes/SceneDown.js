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
        
        this.mapSize  = 1125;   //Original map sizes
        this.tileSize = 103;    //Measured with photoshop
        this.wallSize = 44;     //Measured with photoshop

        this.arrivedGoal = false; //This is used for the player (update snippet in which it's checked whether the player reached a target or not) to know how to distinguish between reaching a target (means didn't reach the GOAL) and reaching the GOAL
        this.lightOn = true;
        this.widthD  = document.getElementById('gameContainer').clientWidth
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
                frameWidth: 207,  //The width of the frame in pixels.
                frameHeight: 207, //The height of the frame in pixels. Uses the frameWidth value if not provided.
                startFrame: 0,    //The first frame to start parsing from.
                endFrame: 12,     //The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
                margin: 0,        //The margin in the image. This is the space around the edge of the frames.
                spacing: 0        //The spacing between each frame in the image.
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

        //Load json and image map
        this.load.json("json", "json/level" + this.numLevel + ".json");
        this.load.image("map", "assets/maps/level" + this.numLevel + ".jpg");
        
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
        this.mapName = this.cache.json.get("json").name;
        this.playerStartPosition = this.cache.json.get("json").position; //[x, y]
        this.mapMatrix = this.cache.json.get("json").map;
        //console.log(this.mapMatrix[2+9*10]);
        console.log(this.playerStartPosition);
        /* EDITOR */

        //Check that it is not already created
        if (document.getElementsByClassName('CodeMirror').length === 0) {
            this.editor = CodeMirror.fromTextArea(document.getElementById('code'), {
                lineNumbers: true,
                lineWrapping: true, //When finish one line jump to the next
                undoDepth: 20,      //Max number of lines to write
                theme: "blackboard",
            })
            this.editor.setValue("//¿Estás preparado?") //Default value

            //Create the button to run the code
            let sceneThis = this;
            document.getElementById("run").onclick = function () {
                let editorContent = sceneThis.editor.getValue();
                sceneThis.readWritten(editorContent);        
                if (!sceneThis.mainScene.debugMode) //Only if debugMode of the mainScene is not activated
                    this.disabled = true;
            };
        }

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

        
        this.map = this.add.image(0, 0, 'map').setOrigin(0);
        this.map.setTint(0x000033);
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
        this.light.visible = true

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
    
    setPlayerStartLevelPosition(){
        //Set player position
        this.andyX = (this.wallSize + this.tileSize/2 + this.tileSize * this.playerStartPosition[0]) * this.zoom;
        this.andyY = (this.wallSize + this.tileSize/2 + this.tileSize * this.playerStartPosition[1]) * this.zoom;
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
     * When andy has reached the goal
     */
    andyHaLLegadoAlObjetivo() {
        if (!this.mainScene.debugMode) { //Only if debugMode of the mainScene is not activated
            this.arrivedGoal = true;
            let sceneUp = this.scene.get('SceneUp');
            sceneUp.write('Llegaste andy, enhorabuena!');
            this.time.delayedCall(5000, function () { //Just to wait until the sceneUp showed the whole message
                this.arrivedGoal = false; //Reset the boolean to check if andy is in the GOAL tile for the player class
                
                this.editor.setValue(""); //Clear codemirror field
                this.editor.clearHistory();

                //this.andy.turnOffLED(); //Also LED (Lantern light in level 1) must be reset
                this.cache.json.remove('json');
                this.mainScene.closeScenes();

            }, [], this);
        }
    }

    /**
     * When andy has not reached the goal
     */
    andyNoHallegadoAlObjetivo() {
        if (!this.mainScene.debugMode) { //Only if debugMode of the mainScene is not activated
            let sceneUp = this.scene.get('SceneUp');
            sceneUp.write('No has llegado andy :(, pero a la próxima podrás conseguirlo :)');
            this.time.delayedCall(9000, function () { //Just to wait until the sceneUp showed the whole message
                this.editor.setValue(""); //Clear codemirror field
                this.editor.clearHistory();

                //this.andy.turnOffLED(); //Also LED (Lantern light in level 1) must be reset

                this.cache.json.remove('json');
                this.mainScene.closeScenes();

            }, [], this);
        }
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
        //this.light.setPosition(this.andyX, this.andyY);

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