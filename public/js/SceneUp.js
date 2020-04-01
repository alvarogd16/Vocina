class SceneUp extends Phaser.Scene {
    constructor() {
        super("SceneUp");
        this.debug = false;
    }

    preload() {
        //this.load.image("dialogs", "../public/assets/dialogs.jpg");

        //Load the dialog plugin in the scene
        //this.load.plugin('DialogModalPlugin', 'js/dialog_plugin.js');
        var url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttypingplugin.min.js';
        this.load.plugin('rextexttypingplugin', url, true);

        // Player sprite.
        this.load.spritesheet({
            key: 'player',
            url: "assets/player.png",
            frameConfig: {
                frameWidth: 21,     //The width of the frame in pixels.
                frameHeight: 26,    //The height of the frame in pixels. Uses the frameWidth value if not provided.
                startFrame: 6,      //The first frame to start parsing from.
                endFrame: 8,       //The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
                margin: 0,          //The margin in the image. This is the space around the edge of the frames.
                spacing: 0          //The spacing between each frame in the image.
            } 
        });
        
    }

    create() {
        //this.add.image(0, 0, "dialogs").setOrigin(0).setScale(0.625);
        this.dialogPlayer = new DialogPlayer(this, 32, 32);

        var textGameObject = this.add.text(80, 20, '', {wordWrap: {width: 310}});
        this.typing = this.plugins.get('rextexttypingplugin').add(textGameObject, {
            speed: 100,       // typing speed in ms
            typeMode: 0,      //0|'left-to-right'|1|'right-to-left'|2|'middle-to-sides'|3|'sides-to-middle'
            setTextCallback: function(text, isLastChar, insertIdx){ return text; },  // callback before set-text
            setTextCallbackScope: null
        });
        
        this.typing.start('Venga andy amigo, estamos esperando a que te muevas anda');

        if (this.debug) {
            this.zoom = this.add.text(10, 10, 'Zoom: ');
            this.camX = this.add.text(10, 30, 'CamX: ');
            this.camY = this.add.text(10, 50, 'CamY: ');
            this.posM = this.add.text(10, 70, 'Position map: ');
            this.sizeX = this.add.text(10, 90, 'SizeX : ');
        }
    }
    
    write(sentence){
        this.typing.start(sentence);
    }

    showInformation(zoom, camX, camY, posM, sizeX) {
        this.zoom.setText('Zoom: ' + zoom);
        this.camX.setText('CamX: ' + camX);
        this.camY.setText('CamY: ' + camY);
        this.posM.setText('Position map: ' + posM);
        this.sizeX.setText('SizeX:  ' + sizeX);
    }
}