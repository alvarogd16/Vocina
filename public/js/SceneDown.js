class SceneDown extends Phaser.Scene {
    constructor() {
        super("SceneDown");

        this.tileSize = 32;
        this.numOfTiles = 6;
        this.useOfTile = true;
        this.index = 0;
    }

    preload() {
        // Player sprite.
        this.load.spritesheet({
            key: 'player',
            url: "assets/player.png",
            frameConfig: {
                frameWidth: 21,     //The width of the frame in pixels.
                frameHeight: 26,    //The height of the frame in pixels. Uses the frameWidth value if not provided.
                startFrame: 0,      //The first frame to start parsing from.
                endFrame: 12,       //The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
                margin: 0,          //The margin in the image. This is the space around the edge of the frames.
                spacing: 0          //The spacing between each frame in the image.
            } 
        });

        this.load.image("vocina-tiles", "assets/newMap.png");   //Test tile
        //this.load.image("andy", "assets/andy.png");           //Test Andy
        this.load.image("map", "assets/map.jpg");   //Artist design 
    }

    create() {
        /* EDITOR */
        
        this.editor = CodeMirror.fromTextArea(document.getElementById('code'), {
            lineNumbers: true,
            lineWrapping: true, //When finish one line jump to the next
            undoDepth: 20       //Max number of lines to write
        })

        this.editor.setValue("//¿Estás preparado?")  //Default value

        //Create the button to run the code
        let sceneThis = this;
        document.getElementById("run").onclick = function () {
            let editorContent = sceneThis.editor.getValue();
            sceneThis.readWritten(editorContent);
        };

        /*KEYBOARD*/

        this.key4 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_FOUR);
        this.key6 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SIX);
        this.key1 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_ONE);
        this.key3 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_THREE);
        this.key7 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_SEVEN);
        this.key9 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_NINE);
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);

        /* MAP AND CAMERAS*/ 

        if(this.useOfTile){     //Use of background tileImage

            //Some constants to the camera and map positions
            this.sizeMapOriginal = this.tileSize * this.numOfTiles;    //Map size original
            this.positionStartMap = widthD - (widthD/2 + this.sizeMapOriginal/2);   //The position to center the map   
            //this.zoom = widthD / this.sizeMapOriginal;                      //Zoom level to adapt the map to the scene 
            this.zoom = 1;

            // Load a map from a 2D array of tile indices
            const level = [
                [1, 2, 2, 2, 2, 2, 3, 2, 3, 2, 3, 2],
                [1, 2, 2, 2, 2, 2],
                [1, 2, 1, 1, 2, 2],
                [1, 2, 2, 2, 2, 2],
                [1, 2, 2, 2, 2, 2],
                [1, 0, 2, 1, 1, 1],
            ];
            
            // Make map of level 1.
            this.map = this.make.tilemap({
                data: level,
                tileWidth: this.tileSize,
                tileHeight: this.tileSize
            });

            // Define tiles used in map.
            this.tileset = this.map.addTilesetImage("vocina-tiles");
            this.layer = this.map.createDynamicLayer(0, this.tileset, this.positionStartMap, this.positionStartMap);

            // Set camera position and size.
            this.sizeX = widthD;
            this.mapX = 0;
            this.mapY = heightD-widthD;
            this.cameras.main.setSize(widthD, widthD);
            this.cameras.main.setPosition(this.mapX, this.mapY);
            //this.cameras.main.setBounds(0, 0, 500, 500, true);
            //this.cameras.main.setZoom(this.zoom);
        } 
        else{                 //Use of background image

            this.map2 = this.add.image(0, 0, "map").setOrigin(0);
            this.map2.setDisplaySize(heightD, widthD);
        }

        /* PHYSICS AND PLAYER */    
        const andyX = this.positionStartMap+16+32;
        const andyY = this.positionStartMap+16+32*5;
        
        // Set physics boundaries from map width and height and create the player
        this.physics.world.setBounds(this.positionStartMap, this.positionStartMap, this.positionStartMap+this.sizeMapOriginal, this.positionStartMap+this.sizeMapOriginal);
        this.andy = new Player(this, andyX, andyY).setScale(1.3);

        //this.physics.add.collider(this.andy, this.layer);
    }


    /*EJECUTE CODE*/

    //Create a new function with the code passed by parameter
    createFunction(args, code) {
        return new Function(args, code);
    }

    //Process the text in the texteditor
    readWritten(editorContent) {
        //Call other scene
        //this.sceneB = this.scene.get('SceneDown');
        let andy = this.andy;
        let args = 'andy';
        let executeMe = this.createFunction(args, editorContent);
        executeMe(andy);
    }

    moverDerecha() {
        if(this.index < this.tileSize) {
            this.andy.x++;
            this.index++;
        };
    }

    update(){
        //console.log('updateando...')
        if(this.keyShift.isDown){
            if(this.key4.isDown) this.mapX--;
            if(this.key6.isDown) this.mapX++;
            if(this.key1.isDown) this.zoom -= 0.05;
            if(this.key3.isDown) this.zoom += 0.05;
            if(this.key7.isDown) this.sizeX -= 0.05;
            if(this.key9.isDown) this.sizeX += 0.05;
        }

        this.cameras.main.setSize(this.sizeX, widthD);
        this.cameras.main.setPosition(this.mapX, this.mapY);
        this.cameras.main.setZoom(this.zoom);
        this.scene.get('SceneUp').showInformation(this.zoom, this.mapX, this.mapY, this.positionStartMap, this.sizeX);

        //this.moverDerecha();
    }
}