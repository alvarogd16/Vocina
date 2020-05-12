/** Class for the info game
 * @extends Phaser.Scene
 */
class SceneUp extends Phaser.Scene {
    /**
     * Create the scene
     */
    constructor() {
        super("SceneUp");
        console.log('Creating SceneUp...');

        this.dialogSize = 464;
        this.widthCodeArea = document.getElementById('codeArea').clientWidth
        this.heightCodeArea = document.getElementById('codeArea').clientHeight
    }

    /**
     * Load all assets in cache
     */
    preload() {
        this.mainScene = this.scene.get('MainScene');
        this.debugMode = this.mainScene.debugMode;

        //this.load.image("dialogs", "../public/assets/dialogs.jpg");

        //Load the dialog plugin in the scene
        //this.load.plugin('DialogModalPlugin', 'js/dialog_plugin.js');
        var url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttypingplugin.min.js';
        this.load.plugin('rextexttypingplugin', url, true);

        // Player sprite.
        this.load.spritesheet({
             key: 'talkSprite',
             url: "assets/dialogPlayer/NarradorSpriteSheet.png",
             frameConfig: {
                 frameWidth: 400,     //The width of the frame in pixels.
                 frameHeight: 867,    //The height of the frame in pixels. Uses the frameWidth value if not provided.
                 startFrame: 0,      //The first frame to start parsing from.
                 endFrame: 2,       //The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
                 margin: 0,          //The margin in the image. This is the space around the edge of the frames.
                 spacing: 0          //The spacing between each frame in the image.
             } 
         });
    
        this.load.image("mapUp", "assets/dialogPlayer/PantallaBackground.png");
        
        //this.load.image("talkPlayer", "assets/dialogPlayer/PantallaNarradorSized.png"); 
        this.load.image("bocadillo", "assets/dialogPlayer/Bocadillo.png"); 

    }
    /**
     * Make the scene
     */
    create() {
        this.zoom = this.widthCodeArea / this.dialogSize;

        this.sprite = this.add.image(0, 0, 'mapUp').setOrigin(0);
        this.sprite.setScale(this.zoom);

        this.dialogPlayer = new DialogPlayer(this, 100, 100);
        //this.add.image(100, 100, 'talkPlayer').setScale(0.35);
        this.add.image(320, 80, 'bocadillo').setScale(0.35);//
        
        let textGameObject = this.add.text(200, 30, '', {
            wordWrap: {
                width: 250
            }
        });
        this.typing = this.plugins.get('rextexttypingplugin').add(textGameObject, {
            speed: 50, // typing speed in ms
            typeMode: 0, //0|'left-to-right'|1|'right-to-left'|2|'middle-to-sides'|3|'sides-to-middle'
            setTextCallback: function (text, isLastChar, insertIdx) {
                return text;
            }, // callback before set-text
            setTextCallbackScope: null,
        });
        console.log(' -- Loaded typing plugin');

        this.typing.start('Andy por favor, tienes que venir a rescatarme!');
        this.time.delayedCall(4000, function () {
            this.typing.start('He descubierto que esta casa tiene demasiadas habitaciones');
            this.time.delayedCall(5000, function () {
                this.typing.start('Tendrás que ir pasando por ellas una a una hasta encontrar el garaje');
                this.time.delayedCall(5000, function () {
                    this.typing.start('Que es donde estoy yo');
                    this.time.delayedCall(3000, function () {
                        this.typing.start('Para ello primero necesitarás una linterna');
                        this.time.delayedCall(5000, function () {
                             this.typing.start('Ah, y cuidado con los zombies...');
                        }, [], this);
                    }, [], this);
                }, [], this);
            }, [], this);
        }, [], this);     
    }

    /**
     * Write text in the scene like typing
     * @param {string} sentence 
     */
    write(sentence) {
        this.typing.start(sentence);
    }
}