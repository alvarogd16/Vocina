class SceneDown extends Phaser.Scene {
    constructor() {
        super("SceneDown");

        this.tileSize = 32;
        this.numOfTiles = 6;
        this.useOfTile = true;
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

        let editor = CodeMirror.fromTextArea(document.getElementById('code'), {
            lineNumbers: true,
            lineWrapping: true, //When finish one line jump to the next
            undoDepth: 20       //Max number of lines to write
        })
        editor.setValue("//¿Estás preparado?")  //Default value

        //Create the button to run the code
        let sceneThis = this;
        document.getElementById("run").onclick = function () {
            let editorContent = editor.getValue();
            sceneThis.readWritten(editorContent);
        };

        /*TODO*/
        /* MAP AND CAMERAS*/      
        
        if(this.useOfTile){     //Use of background tileImage

            //Some constants to the camera and map positions
            const sizeMapOriginal = this.tileSize * this.numOfTiles;    //Map size original
            this.positionStartMap = widthD - (widthD/2 + sizeMapOriginal/2);   //The position to center the map   
            const zoom = widthD / sizeMapOriginal;                      //Zoom level to adapt the map to the scene 

            // Load a map from a 2D array of tile indices
            const level = [
                [1, 1, 1, 1, 1, 1],
                [1, 2, 2, 2, 2, 1],
                [1, 2, 3, 3, 2, 1],
                [1, 2, 3, 3, 2, 1],
                [1, 2, 2, 2, 2, 1],
                [1, 1, 1, 1, 1, 1],
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
            this.cameras.main.setSize(widthD, widthD);
            this.cameras.main.setPosition(0, heightD-widthD);
            //this.cameras.main.setBounds(0, 0, 500, 500, true);
            this.cameras.main.setZoom(zoom);
        } 
        else{                 //Use of background image

            this.map2 = this.add.image(0, 0, "map").setOrigin(0);
            this.map2.setDisplaySize(heightD, widthD);
        }

        /* PHYSICS AND PLAYER */    
        
        // Set physics boundaries from map width and height and create the player
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        this.andy = new Player(this, this.positionStartMap+16, this.positionStartMap+16).setScale(1.2);

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
}