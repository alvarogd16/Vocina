var lightOn = false;
class SceneDown extends Phaser.Scene {
    constructor() {
        super("SceneDown");

        this.tileSize = 32;
        this.numOfTiles = 6;
        this.useOfTile = true;
        this.arrivedGoal = false; //This is used for the player (update snippet in which it's checked whether the player reached a target or not) to know how to distinguish between reaching a target (means didn't reach the GOAL) and reaching the GOAL
    }

    //Map data
    init(numLevel) {
        this.numLevel = numLevel;
    }

    preload() {
        this.mainScene = this.scene.get('MainScene');

        // Player sprite.
        this.load.spritesheet({
            key: 'player',
            url: "assets/player.png",
            frameConfig: {
                frameWidth: 21, //The width of the frame in pixels.
                frameHeight: 26, //The height of the frame in pixels. Uses the frameWidth value if not provided.
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

        this.load.image("vocina-tiles", "assets/newMapExtruder.png"); //Test tile
        this.load.image("map", "assets/map.jpg"); //Artist design 

        this.nomLevel = "Level" + this.numLevel.toString(); //The name of the level is Level follow by the number ej. Level1
        this.load.tilemapTiledJSON(this.nomLevel, "assets/" + this.nomLevel + ".json");
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
        this.key7 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SEVEN);
        this.key9 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_NINE);
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.key5 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FIVE);

        /* MAP AND CAMERAS*/

        if (this.useOfTile) { //Use of background tileImage

            //Some constants to the camera and map positions
            this.sizeMapOriginal = this.tileSize * this.numOfTiles; //Map size original
            this.positionStartMap = widthD - (widthD / 2 + this.sizeMapOriginal / 2); //The position to center the map   
            this.zoom = widthD / this.sizeMapOriginal; //Zoom level to adapt the map to the scene 


            // Define tiles used in map.
            this.Level = this.add.tilemap(this.nomLevel);
            let colors = this.Level.addTilesetImage("colors", "vocina-tiles", 32, 32, 1, 2);

            this.layer = this.Level.createStaticLayer("layer", [colors], this.positionStartMap, this.positionStartMap);


            // Set camera position and size.
            this.sizeX = widthD;
            this.mapX = 0;
            this.mapY = heightD - widthD;
            this.cameras.main.setSize(widthD, widthD);
            this.cameras.main.setPosition(this.mapX, this.mapY);
            this.cameras.main.setZoom(this.zoom);
        } else { //Use of background image /* TODO OR DELETE */

            this.map2 = this.add.image(0, 0, "map").setOrigin(0);
            this.map2.setDisplaySize(heightD, widthD);
        }

        /* PHYSICS AND PLAYER */
        //Set position [1, 5]
        const andyX = this.positionStartMap + this.tileSize / 2 + this.tileSize;
        const andyY = this.positionStartMap + this.tileSize / 2 + this.tileSize * 5;

        // Set physics boundaries from map width and height and create the player
        this.physics.world.setBounds(this.positionStartMap, this.positionStartMap,
            this.sizeMapOriginal,
            this.sizeMapOriginal);

        /* ILLUMINATION */
        this.layer.setPipeline('Light2D');
        var light = this.lights.addLight(0, 0, 200).setScrollFactor(0.0);
        this.lights.enable().setAmbientColor(0x555555);

        this.andy = new Player(this, andyX, andyY);
        //this.zombie1 = new Zombie(this, andyX+128, andyY-128, this.andy).setScale(1.3);
        //this.zombie2 = new Zombie(this, andyX, andyY-128, this.andy).setScale(1.3);

        this.physics.add.collider(this.andy, this.layer);
        this.layer.setCollisionByProperty({
            collision: true
        });

        //If touches the GOAL tile then stop
        this.layer.setTileIndexCallback([4], () => {
            this.andyHaLLegadoAlObjetivo();
            this.layer.setTileIndexCallback([4], () => {
                return undefined
            });

        });
        

        //If touches a wall then stop as well, but checked here instead
        //of in the player because here are collider events, better to use than other thing
        this.layer.setTileIndexCallback([2], () => {
            //This has to be done here because in the player class can't be considered, because of there isn't any wall detection and can't reset those variable there, directly when andy reaches a wall comes here
            this.andy.stopAnimation();
            this.andy.andyIsMoving = false;
            
            this.andyNoHallegadoAlObjetivo();
            this.layer.setTileIndexCallback([2], () => {
                return undefined
            })
        });

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
        this.time.delayedCall(7000, function () { //Just to wait until the sceneUp showed the whole message
            this.editor.setValue(""); //Clear codemirror field
            this.editor.clearHistory();

            this.andy.OffLED(); //Also LED (Lantern light in level 1) must be reset

            mainScene.closeScenes();
        }, [], this);
    }

    zombiesReachedAndy() {
        this.cameras.main.shake(500);

        this.time.delayedCall(500, function () {
            this.scene.restart();
        }, [], this);
    }


    update() {
        //Camera debug
        if (this.keyShift.isDown) {
            if (this.key4.isDown) this.mapX--;
            if (this.key6.isDown) this.mapX++;
            if (this.key1.isDown) this.zoom -= 0.05;
            if (this.key3.isDown) this.zoom += 0.05;
            if (this.key7.isDown) this.sizeX--;
            if (this.key9.isDown) this.sizeX++;
            if (this.key5.isDown) this.mainScene.nextLevel();
        }

        this.cameras.main.setSize(this.sizeX, widthD);
        this.cameras.main.setPosition(this.mapX, this.mapY);
        this.cameras.main.setZoom(this.zoom);
        //this.scene.get('SceneUp').showInformation(this.zoom, this.mapX, this.mapY, this.positionStartMap, this.sizeX);

        if (lightOn) {
            this.lights.disable();
            this.layer.resetPipeline();
        }
    }
}