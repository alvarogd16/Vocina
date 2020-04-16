class SceneDown extends Phaser.Scene {
    constructor() {
        super("SceneDown");

        this.mapSize = 1125;
        this.arrivedGoal = false; //This is used for the player (update snippet in which it's checked whether the player reached a target or not) to know how to distinguish between reaching a target (means didn't reach the GOAL) and reaching the GOAL
        this.lightOn = true;
        this.widthD = document.getElementById('gameContainer').clientWidth
        this.heightD = document.getElementById('gameContainer').clientHeight
    }

    //Map data
    init(numLevel) {
        this.numLevel = numLevel;
    }

    preload() {
        this.mainScene = this.scene.get('MainScene');
        this.debugMode = this.mainScene.debugMode;

        // Player sprite.
        this.load.spritesheet({
            key: 'player',
            url: "assets/LateralDerecho.png",
            frameConfig: {
                frameWidth: 225, //The width of the frame in pixels.
                frameHeight: 225, //The height of the frame in pixels. Uses the frameWidth value if not provided.
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

        //this.load.image("vocina-tiles", "assets/newMapExtruder.png"); //Test tile
        this.load.image("map", "assets/PruebasArtista/Salon.png"); //Artist design 
    }

    create() {
        /* EDITOR */
        //Check that it is not already created
        if (document.getElementsByClassName('CodeMirror').length === 0) {
            this.editor = CodeMirror.fromTextArea(document.getElementById('code'), {
                lineNumbers: true,
                lineWrapping: true, //When finish one line jump to the next
                undoDepth: 20, //Max number of lines to write
                theme: "blackboard",
            })
            this.editor.setValue("//¿Estás preparado?") //Default value

            //Create the button to run the code
            let sceneThis = this;
            document.getElementById("run").onclick = function () {
                let editorContent = sceneThis.editor.getValue();
                sceneThis.readWritten(editorContent);
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
        // this.size = this.widthD;
        this.mapX = 0;
        this.mapY = this.heightD - this.widthD;
        //this.center = this.mapSize/2;
        this.cameras.main.setSize(this.mapSize, this.mapSize);
        this.cameras.main.setPosition(this.mapX, this.mapY);
        // this.cameras.main.centerOn(this.center, this.center);
        // this.cameras.main.setZoom(this.zoom);
        
        this.sprite = this.add.image(0, 0, 'map').setOrigin(0);
        this.sprite.setScale(this.zoom);

        this.mapNewSize = this.mapSize * this.zoom;
        /* ILLUMINATION */
        // this.layer.setPipeline('Light2D');
        // let light = this.lights.addLight(0, 0, 200).setScrollFactor(0.0);
        // this.lights.enable().setAmbientColor(0x555555);


        /* PHYSICS AND PLAYER */
        //Set position [1, 5]
        this.andyX = this.mapNewSize / 3;
        this.andyY = this.mapNewSize / 3;
        this.andyScale = 0.5;

        // Set physics boundaries from map width and height and create the player
        this.physics.world.setBounds(0, 0,
            this.mapNewSize,
            this.mapNewSize);

        this.andy = new Player(this, this.andyX, this.andyY).setScale(this.andyScale);
        //this.zombie1 = new Zombie(this, andyX+128, andyY-128, this.andy).setScale(1.3);
        //this.zombie2 = new Zombie(this, andyX, andyY-128, this.andy).setScale(1.3);

        
        /* DEBUG INFO */
        // if(this.debugMode){
        //     showInfoCameras(this.size, this.mapX, this.mapY, this.center, this.zoom, false);
        //     showInfoTile(this.tileSize,this.numOfTiles, this.sizeMapOriginal, this.numLevel, false);
        //     showInfoAndy(this.andyX, this.andyY, this.andyScale, false);
        //     showInfoRaspi(false);
        // }
    }

    /*EJECUTE CODE*/

    //Create a new function with the code passed by parameter
    createFunction(args, code) {
        return new Function(args, code);
    }

    //Process the text in the texteditor
    readWritten(editorContent) {
        let andy = this.andy;
        let args = 'andy';
        let executeMe = this.createFunction(args, editorContent);
        executeMe(andy);
    }

    andyHaLLegadoAlObjetivo() {
        this.arrivedGoal = true;
        let sceneUp = this.scene.get('SceneUp');
        let mainScene = this.scene.get('MainScene');
        sceneUp.write('Llegaste andy, enhorabuena!');
        this.time.delayedCall(5000, function () { //Just to wait until the sceneUp showed the whole message
            this.arrivedGoal = false; //Reset the boolean to check if andy is in the GOAL tile for the player class

            this.editor.setValue(""); //Clear codemirror field
            this.editor.clearHistory();

            this.andy.OffLED(); //Also LED (Lantern light in level 1) must be reset

            mainScene.closeScenes();

        }, [], this);
    }

    andyNoHallegadoAlObjetivo() {
        let sceneUp = this.scene.get('SceneUp');
        let mainScene = this.scene.get('MainScene');
        sceneUp.write('No has llegado andy :(, pero a la próxima podrás conseguirlo :)');
        this.time.delayedCall(14000, function () { //Just to wait until the sceneUp showed the whole message
            this.editor.setValue(""); //Clear codemirror field
            this.editor.clearHistory();

            this.andy.turnOffLED(); //Also LED (Lantern light in level 1) must be reset

            mainScene.closeScenes();
        }, [], this);
    }

    zombiesReachedAndy() {
        this.cameras.main.shake(500);

        this.time.delayedCall(500, function () {
            this.scene.restart();
        }, [], this);
    }

    setLight(value){
        this.lightOn = value;
    }

    update() {
        //Camera debug
        if(this.debugMode){
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

        // if (this.lightOn) {
        //     this.lights.disable();
        //     this.layer.resetPipeline();
        // }
    }
}