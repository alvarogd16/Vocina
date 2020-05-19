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

        this.widthGame  = document.getElementById('gameContainer').clientWidth;
        this.heightGame = document.getElementById('gameContainer').clientHeight;

        //Image's size
        this.bubbleWidthOriginal  = 835;
        this.bubbleHeightOriginal = 503;
        this.talkSpriteWidthOriginal  = 400;
        this.talkSpriteHeightOriginal = 867;

        //These values ​​need to be adapted to the screen
        this.sceneWidthOriginal  = this.bubbleWidthOriginal + this.talkSpriteWidthOriginal;
        this.sceneHeightOriginal = this.bubbleHeightOriginal;

        this.zoomToAdapt = this.widthGame / this.sceneWidthOriginal;

        //The new values
        this.bubbleWidth  = this.bubbleWidthOriginal  * this.zoomToAdapt;
        this.bubbleHeight = this.bubbleHeidhtOriginal * this.zoomToAdapt;
        this.talkSpriteWidth  = this.talkSpriteWidthOriginal  * this.zoomToAdapt;
        this.talkSpriteHeight = this.talkSpriteHeightOriginal * this.zoomToAdapt;

        this.sceneWidth  = this.widthGame;
        this.sceneHeight = this.sceneHeightOriginal * this.zoomToAdapt;

        this.sceneYstart = this.heightGame-this.widthGame-this.sceneHeight; 

        this.editorHeight = this.sceneYstart;
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
                 frameWidth:  this.talkSpriteWidthOriginal,     //The width of the frame in pixels.
                 frameHeight: this.talkSpriteHeightOriginal,    //The height of the frame in pixels. Uses the frameWidth value if not provided.
                 startFrame: 0,      //The first frame to start parsing from.
                 endFrame: 2,       //The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
                 margin: 0,          //The margin in the image. This is the space around the edge of the frames.
                 spacing: 0          //The spacing between each frame in the image.
             }
         });
        
        
        this.load.image("bubble", "assets/dialogPlayer/Bocadillo.png"); 

    }
    /**
     * Make the scene
     */
    create() {
        this.dialogPlayer = new DialogPlayer(this, this.talkSpriteWidth/2, this.sceneYstart+this.sceneHeight/2, this.zoomToAdapt);
        
        this.add.image(this.talkSpriteWidth, this.sceneYstart, 'bubble').setOrigin(0).setScale(this.zoomToAdapt);
        
        let textGameObject = this.add.text(200, 330, '', {
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
    }

    /**
     * Write text in the scene like typing
     * @param {string} sentence 
     */
    write(sentence) {
        this.typing.start(sentence);
    }
}