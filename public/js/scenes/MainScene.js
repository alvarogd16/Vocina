/** Main class
 * @extends Phaser.Scene
 */
class MainScene extends Phaser.Scene {
    /**
     * Create the scene
     */
    constructor() {
        super("MainScene");

        this.debugMode = false; //Show information and alllow you to move the camera
        this.keysForDebugAreDown = false;
        this.level = 1; //Each level has a .json file
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
        //let url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rexrotatetoplugin.min.js';
        this.load.plugin('rexrotatetoplugin', path, true);

        this.load.plugin('rexfsmplugin', '../../lib/rexfsmplugin.min.js', true);

        this.load.image("background", "assets/crisDialogs/BackgroundScreen.png");
    }

    /**
     * Make the scene
     */
    create() {
        console.log("Creating game");

        //Background image
        this.zoomBackground = this.width / 1125; //1125 is the image's width
        this.add.image(0, 0, 'background').setOrigin(0).setScale(this.zoomBackground);


        //Create code editor
        this.editor = CodeMirror.fromTextArea(document.getElementById('code'), {
            lineNumbers: true,
            lineWrapping: true, //When finish one line jump to the next
            undoDepth: 20, //Max number of lines to write
            theme: "blackboard",
        })
        this.editor.setValue("//¿Estás preparado?") //Default value



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


        //Finite state machine

        let stateConfig = {
            states: {
                explanation: {
                    next: 'programming',
                    enter: function () {
                        console.log("explanation start");

                        this.sceneUp.loadSentences(this.sublevelId);
                        this.sceneUp.startWrite();
                    }
                },
                programming: {
                    next: 'checkCode',
                    enter: function () {
                        console.log("programming start");
                        //activate writte and run button

                        this.sceneDown.runButtonAndWriteAllowed(true);
                    },
                    exit: function () {
                        this.sceneDown.runButtonAndWriteAllowed(false);
                    }
                },
                checkCode: {
                    next: function () {
                        if (this.codeErrors) {
                            //error message
                            this.sceneUp.write("Oh no, hay un error en el codigo, comprueba que este bien escrito")
                            return 'programming';
                        } else {
                            return 'action';
                        }
                    },
                    enter: function () {
                        console.log("check start");
                    }
                },
                action: {
<<<<<<< HEAD
                    next: function () {
                        if (this.sublevelComplete) {
                            if (this.lastSublevel) {
=======
                    next: "checkSublevel",
                    enter: function () {
                        console.log("action start");
                        //Do the action depends of sublevel

                        //Cargar objetivo
                        this.sublevelType = "move";
                        this.sublevelObjetive = [2, 8]
                    }
                },
                checkSublevel: {
                    next: function () { 
                        if(this.sublevelComplete){
                            if(this.lastSublevel){
>>>>>>> bug
                                return 'end';
                            }

                            this.sublevelComplete = false;

                            //next sublevel
                            this.sublevelId++;
                            return 'explanation';
                        } else {
                            //fail message depends of tipe of sublevel
                            return 'programming';
                        }
                    },
                    enter: function () {
                        //TODO
                        switch(this.sublevelType){
                            case "move":
                                //TO DO
                                console.log(this.sceneDown.andy.posMatrix)
                                if(this.sceneDown.andy.posMatrix[0] === this.sublevelObjetive[0] &&
                                    this.sceneDown.andy.posMatrix[1] === this.sublevelObjetive[1]){

                                    console.log("sublevel complete");
                                    this.sublevelComplete = true;
                                } else {
                                    //Volver a la posicion anterior
                                    this.sceneUp.write("PErro te moviste maaaall");
                                }
                                this.next();
                            break;
                        }
                    }
                },
                end: {
                    enter: function () {
                        console.log("End of game");
                    }
                }
            },
            extend: {
                sublevelId: 0,
                codeErrors: false,
                sublevelComplete: false,
                sublevelType: undefined,
                sublevelObjetive: undefined,
                lastSublevel: false,
                mainScene: undefined,
                sceneUp: undefined,
                sceneDown: undefined
            }
        }

        this.stateMachine = this.plugins.get('rexfsmplugin').add(stateConfig);
        this.stateMachine.mainScene = this;
        this.stateMachine.sceneUp = this.scene.get("SceneUp");
        this.stateMachine.sceneDown = this.scene.get("SceneDown");


        //Call the scenes
        this.scene.launch("SceneUp", this.level);
        this.scene.launch("SceneDown", this.level); //Start with Level1

        //Calculate editor's height
        this.sceneUp = this.scene.get('SceneUp');
        this.cm.style.height = this.sceneUp.editorHeight + "px";

        //Keys        
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.key8 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT);

        this.time.delayedCall(500, function () {
            this.stateMachine.goto("explanation");
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
        document.getElementById("run").disabled = false; //Also reset the button to click again
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
