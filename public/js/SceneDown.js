class SceneDown extends Phaser.Scene {
    constructor() {
        super("SceneDown");
        var map;
        var layer;
    }

    preload() {

        // Player sprite.
        this.load.spritesheet({
            key: 'player',
            url: "tiled/player.png",
            frameConfig: {
                frameWidth: 21, //The width of the frame in pixels.
                frameHeight: 26, //The height of the frame in pixels. Uses the frameWidth value if not provided.
                startFrame: 0, //The first frame to start parsing from.
                endFrame: 12, //The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
                margin: 0, //The margin in the image. This is the space around the edge of the frames.
                spacing: 0
            } //The spacing between each frame in the image.
        });

        this.load.image("vocina-tiles", "assets/newMap.png");
        this.load.image("andy", "assets/andy.png");
        //this.load.image("map", "../public/assets/map.jpg");
    }

    create() {
        console.log('Creating scene up...');

        //Editor elements
        let editor = CodeMirror.fromTextArea(document.getElementById('code'), {
            lineNumbers: true,
            lineWrapping: true, //When finish one line jump to the next
            undoDepth: 20 //Max number of lines to write
        })
        editor.setValue("//¿Estás preparado?") //Default value

        //Create the button to run the code
        let sceneThis = this;
        document.getElementById("run").onclick = function () {
            let editorContent = editor.getValue();
            sceneThis.readWritten(editorContent);
            //console.log(a);
        };

        
        /* CAMERAS */
        

        // start camera
        this.cameras.main.setZoom(3);

        // Set camera position and size.
        this.cameras.main.setViewport(0, 200, 2000, 2000);
        this.cameras.main.setBounds(0,
            0,
            500,
            500,
            true);
        // Load a map from a 2D array of tile indices
        
        
        /* MAP */
        
        
        const level = [
            [7, 7, 4, 4, 4, 4],
            [7, 2, 0, 0, 4, 4],
            [2, 2, 0, 0, 0, 4],
            [2, 0, 0, 0, 0, 4],
            [2, 0, 7, 7, 7, 7],
            [2, 0, 7, 7, 7, 7],
        ];

        // When loading from an array, make sure to specify the tileWidth and tileHeight
        const map = this.make.tilemap({
             data: level,
             tileWidth: 16,
             tileHeight: 16
         });
         
         const mapTiles = map.addTilesetImage("vocina-tiles");
         const layer = map.createStaticLayer(0, mapTiles, 0, 0);
         
        // Make map of level 1.
        this.map = this.make.tilemap({
            data: level,
            tileWidth: 16,
            tileHeight: 16
        });

        // Define tiles used in map.
        const tileset = this.map.addTilesetImage("tiles_1", "vocina-tiles", 16, 16);

        this.layer = this.map.createStaticLayer(0, tileset); 

        
        /* PHYSICS AND PLAYER */    
        
        
        // Set physics boundaries from map width and height.
        this.physics.world.setBounds(0, 0, this.map.widthInPixels, this.map.heightInPixels);
        
        
       /* this.add.image(0, 0, "map").setOrigin(0).setScale(0.3);*/

        this.andy = new Player(this, 8, 8).setScale(0.8);

        this.physics.add.collider(this.andy, this.layer);

    }

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

    //Stile of the button 
    enterButtonHoverState() {
        this.clickButton.setStyle({
            fill: '#ff0'
        });
    }

    enterButtonRestState() {
        this.clickButton.setStyle({
            fill: '#0f0'
        });
    }

    enterButtonActiveState() {
        this.clickButton.setStyle({
            fill: '#0ff'
        });
    }

}