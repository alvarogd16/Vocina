/** Main class
 * @extends Phaser.Scene
 */
class MainScene extends Phaser.Scene {
    /**
     * Create the scene
     */
    constructor() {
        super("MainScene");

        this.debugMode = false;             //Show information and alllow you to move the camera
        this.keysForDebugAreDown = false;
        this.level = 2;                     //Each level has a .json file
        this.maxLevels = 4;

        this.width = document.getElementById('gameContainer').clientWidth;

        //Variables to hide function
        this.cm = document.getElementById('codeArea');
    }

    preload() {
        //IMAGE LOAD

        // Player sprite.
        this.load.spritesheet({
            key: 'player',
            url: "assets/andy/andy.png",
            frameConfig: {
                frameWidth: 207, //The width of the frame in pixels.
                frameHeight: 207, //The height of the frame in pixels. Uses the frameWidth value if not provided.
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

        // hardware

        this.load.spritesheet({
            key: 'button',
            url: "assets/hardware/button.png",
            frameConfig: {
                frameWidth: 207,
                frameHeight: 207,
                startFrame: 0,
                endFrame: 0,
                margin: 0,
                spacing: 0
            }
        });

        this.load.spritesheet({
            key: 'led',
            url: "assets/hardware/led.png",
            frameConfig: {
                frameWidth: 207,
                frameHeight: 207,
                startFrame: 0,
                endFrame: 0,
                margin: 0,
                spacing: 0
            }
        });

        this.load.spritesheet({
            key: 'encoder',
            url: "assets/hardware/encoder.png",
            frameConfig: {
                frameWidth: 207,
                frameHeight: 207,
                startFrame: 0,
                endFrame: 0,
                margin: 0,
                spacing: 0
            }
        });

        this.load.spritesheet({
            key: 'soap',
            url: "assets/bathroom/soap.png",
            frameConfig: {
                frameWidth: 207,
                frameHeight: 207,
                startFrame: 0,
                endFrame: 0,
                margin: 0,
                spacing: 0
            }
        });

        this.load.spritesheet({
            key: 'sensor',
            url: "assets/hardware/sensor.png",
            frameConfig: {
                frameWidth: 207,
                frameHeight: 207,
                startFrame: 0,
                endFrame: 0,
                margin: 0,
                spacing: 0
            }
        });

        // AUDIO LOAD



        this.load.audio('pickUp', [
            'assets/sounds/pickUp.wav'
        ]);

        this.load.audio('walk', [
            'assets/sounds/walk.mp3'
        ]);

        this.load.audio('sublevelAchieved', [
            'assets/sounds/sublevelAchieved.wav'
        ]);

        this.load.audio('levelAchieved', [
            'assets/sounds/levelAchieved.wav'
        ]);

        this.load.audio('gameOver', [
            'assets/sounds/gameOver.wav'
        ]);

        this.load.audio('levelsAmbience', [
            'assets/sounds/levelsAmbience.mp3'
        ]);

        this.load.audio('lanternClick', [
            'assets/sounds/lanternClick.mp3'
        ]);

        this.load.audio('waterTap', [
            'assets/sounds/waterTap.mp3'
        ]);

        this.load.audio('lockedBox', [
            'assets/sounds/lockedBox.mp3'
        ]);

        this.load.audio('unlockedBox', [
            'assets/sounds/unlockedBox.mp3'
        ]);

        // PLUGIN LOAD

        let path = "../../lib/rexrotatetoplugin.min.js";
        this.load.plugin('rexrotatetoplugin', path, true);

        this.load.plugin('rexfsmplugin', '../../lib/rexfsmplugin.min.js', true);

        this.load.image("background", "assets/crisDialogs/BackgroundScreen.png");
    }

    /**
     * Make the scene
     */
    create() {
        console.log("Creating game");

        this.sceneUp   = this.scene.get('SceneUp');
        this.sceneDown = this.scene.get('SceneDown');

        //Background image
        this.zoomBackground = this.width / 1125; //1125 is the image's width
        this.add.image(0, 0, 'background').setOrigin(0).setScale(this.zoomBackground);


        //Create code editor
        this.editorElem = document.getElementById('code');
        this.flask = new CodeFlask(this.editorElem, {
            language: 'js',
            lineNumbers: true//,
            //defaultTheme: false
        });


        //Play levels ambience
        let loopMarker = {
            name: 'loop',
            config: {
                loop: true
            }
        };

        this.levelsAmbience = this.sound.add('levelsAmbience');
        //this.menuTheme.play();

        this.levelsAmbience.addMarker(loopMarker);

        // Delay option can only be passed in config
        this.levelsAmbience.play('loop', {
            delay: 0
        });


        this.stateMachine = this.plugins.get('rexfsmplugin').add(stateConfig);
        this.stateMachine.mainScene = this;
        this.stateMachine.sceneUp   = this.sceneUp;
        this.stateMachine.sceneDown = this.sceneDown;

        //Call the scenes
        this.scene.launch("SceneUp", this.level);
        this.scene.launch("SceneDown", this.level); //Start with Level1

        //Calculate editor's height
        this.cm.style.height = this.sceneUp.editorHeight + "px";

        //Keys        
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.key8 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT);

        this.time.delayedCall(500, function () {
            this.stateMachine.lastPlayerState = this.sceneDown.initializePlayerState();
            this.stateMachine.goto("boot");
        }, [], this);
    }

    /**
     * Change to the next level
     */
    nextLevel() {
        this.level++;
        if (this.level > this.maxLevels)
            this.endGame();
        else {
            this.closeScenes();
        }
    }

    /**
     * Change to specific level
     * @param {number} level - The level to change
     */
    /*nextLevel(level) {
        this.closeScenes();
        this.level = level;
        if (this.level > this.maxLevels)
            this.endGame();
        else {
            this.launchScenes();
        }
    }*/

    /**
     * When the game ends
     */
    endGame() {
        this.add.text(10, 10, 'GAME OVER');
    }

    /**
     * Stop all and adapt de screen for the transition of scenes
     */
    closeScenes() {
        this.scene.stop('SceneUp');
        this.scene.stop('SceneDown');
        //this.cm.style.display = 'none';
        this.launchScenes();
    }

    /**
     * Resume all and adapt de screen for the transition of scenes
     */
    launchScenes() {
        this.scene.launch("SceneUp");
        this.scene.launch("SceneDown", this.level);
        //this.cm.style.display = 'block';
    }

    /**
     * Resume all and adapt de screen for the transition of scenes
     */
    update() {
        //To enable or disable debugMode 
        if (this.keyShift.isDown && this.key8.isDown && !this.keysForDebugAreDown) {
            this.debugMode = !this.debugMode;
            this.keysForDebugAreDown = true; //This is just to avoid the keys enabling and disabling the debugMode a lot of times, so they'll do it just once
            if (this.debugMode) {
                console.log('Debug ACTIVATED');
            } else
                console.log('Debug DISABLED');
        } else if (!this.keyShift.isDown && !this.key8.isDown)
            this.keysForDebugAreDown = false;
    }
}