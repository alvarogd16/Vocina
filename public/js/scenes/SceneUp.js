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

        //These values need to be adapted to the screen
        this.sceneWidthOriginal  = this.bubbleWidthOriginal + this.talkSpriteWidthOriginal;
        this.sceneHeightOriginal = this.bubbleHeightOriginal;

        this.zoomToAdapt = this.widthGame / this.sceneWidthOriginal;

        //The new values
        this.bubbleWidth  = this.bubbleWidthOriginal  * this.zoomToAdapt;
        this.bubbleHeight = this.bubbleHeightOriginal * this.zoomToAdapt;
        this.talkSpriteWidth  = this.talkSpriteWidthOriginal  * this.zoomToAdapt;
        this.talkSpriteHeight = this.talkSpriteHeightOriginal * this.zoomToAdapt;

        this.sceneWidth  = this.widthGame;
        this.sceneHeight = this.sceneHeightOriginal * this.zoomToAdapt;

        this.sceneYstart = this.heightGame-this.widthGame-this.sceneHeight; 

        this.editorHeight = this.sceneYstart;

        this.writeAvailable = true;
    }

    /**
     * Level data from MainScene
     * @param {number} numLevel - The level's number
     */
    init(numLevel) {
        this.numLevel = numLevel;
    }

    /**
     * Load all assets in cache
     */
    preload() {
        this.mainScene = this.scene.get('MainScene');
        this.debugMode = this.mainScene.debugMode;

        //this.load.image("dialogs", "../public/assets/dialogs.jpg");

        //Load the dialog plugin in the scene
        let path = "../../lib/rextexttypingplugin.min.js";
        this.load.plugin('rextexttypingplugin', path, true);

        // let path2 = "../../lib/rexbbcodetextplugin.min.js";
        // this.load.plugin('rexbbcodetextplugin', path2, true);

        // Player sprite.
        this.load.spritesheet({
             key: 'talkSprite',
             url: "assets/crisDialogs/NarratorSpriteSheet.png",
             frameConfig: {
                 frameWidth:  this.talkSpriteWidthOriginal,     //The width of the frame in pixels.
                 frameHeight: this.talkSpriteHeightOriginal,    //The height of the frame in pixels. Uses the frameWidth value if not provided.
                 startFrame: 0,      //The first frame to start parsing from.
                 endFrame: 2,       //The frame to stop parsing at. If not provided it will calculate the value based on the image and frame dimensions.
                 margin: 0,          //The margin in the image. This is the space around the edge of the frames.
                 spacing: 0          //The spacing between each frame in the image.
             }
         });
        
        
        this.load.image("bubble", "assets/crisDialogs/Bubble.png"); 

        this.keyJson = "json" + this.numLevel;
        
        // AUDIO LOAD
        
        this.load.audio('rand', [
            'assets/sounds/rand.mp3'
        ]);
    }
    /**
     * Make the scene
     */
    create() {
        this.cameras.main.fadeIn(3000);
        
        this.dialogPlayer = new AnimatedEntity(this, this.talkSpriteWidth/2, this.sceneYstart+this.sceneHeight/2, this.zoomToAdapt, 'talkSprite');
        
        createAnimationsSceneUp(this);


        // there is to wait to preload in sceeneDown finished
        //this.time.delayedCall(100, function() {
            this.sublevelsData = this.cache.json.get(this.keyJson).sublevels;
        //}, [], this)
        
        this.sentencesQueue = [];
        
        let bubble = this.add.sprite(this.talkSpriteWidth, this.sceneYstart, 'bubble')
            .setOrigin(0).setScale(this.zoomToAdapt).setInteractive();

        bubble.on('pointerdown', (pointer) => {
            if(this.writeAvailable)
                this.nextSentence();
        });

        
        let textGameObject = this.add.text(this.talkSpriteWidth+this.bubbleWidth/10, this.sceneYstart+this.bubbleHeight/4, '', {
            wordWrap: {
                width: this.talkSpriteWidth+this.bubbleWidth/10
            }
        });

        this.typing = this.plugins.get('rextexttypingplugin').add(textGameObject, {
            speed: 10, // typing speed in ms
            typeMode: 0, //0|'left-to-right'|1|'right-to-left'|2|'middle-to-sides'|3|'sides-to-middle'
            setTextCallback: function (text, isLastChar, insertIdx) {
                return text;
            }, // callback before set-text
            setTextCallbackScope: null,
        });
        //console.log(' -- Loaded typing plugin');
        
        //Initialize crisAlexVoice
        this.crisAlexVoice = this.sound.add('rand');

        
        //Stop talk voice
        this.typing.on('complete', (typing, txt) => {
            this.crisAlexVoice.stop();
            this.dialogPlayer.anims.stop();
            //We dont want the last one to be activated 
            if(!this.sentencesQueue.length == 0)
                this.writeAvailable = true;
        }); 
    }

    /**
     * Enqueu all the explanations sentences of the current sublevel
     * @param {int} sublevelId 
     */
    loadSentences(sublevelId) {
        this.sublevelsData[sublevelId].sentences.forEach(element => this.sentencesQueue.push(element))
    }

    /**
     * Start the explanation writing queue's sentences
     */
    startWrite() {
        this.writeAvailable = true;
        this.nextSentence();
    }

    /**
     * Write the next sentence in the queue
     */
    nextSentence() {
        this.write(this.sentencesQueue.shift());
        this.dialogPlayer.anims.play('talk', true);
        if(this.sentencesQueue.length == 0){
            this.mainScene.stateMachine.next();
            this.writeAvailable = false;
        }
    }

    /**
     * Write text in the scene like typing
     * @param {string} sentence 
     */
    write(sentence) {
        if(sentence) {
            this.writeAvailable = false;
            this.crisAlexVoice.play();
            this.typing.start(sentence);
        }
    }
}