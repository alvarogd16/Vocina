/** Main class
 * @extends Phaser.Scene
 */
class MainScene extends Phaser.Scene {
    /**
     * Create the scene
     */
    constructor() {
        super("MainScene");

        this.debugMode = false;  //Show information and alllow you to move the camera
        this.keysForDebugAreDown = false;
        this.level = 1;         //Each level has a .json file
        this.maxLevels = 2;
    }

    /**
     * Make the scene
     */
    create() {
        console.log("Creating game");

        //Call the scenes
        this.scene.launch("SceneUp");
        this.scene.launch("SceneDown", this.level); //With Level1

        //Variables to hide function
        this.cm = document.getElementById('codeArea');
        this.game = document.getElementById('gameContainer');

        //Keyboards        
        this.keyShift = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SHIFT);
        this.key8 = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.NUMPAD_EIGHT);
    }

    /**
     * Change to the next level
     */
    nextLevel() {
        this.closeScenes();
        this.level++;
        if (this.level > this.maxLevels)
            this.endGame();
        else {
            this.launchScenes();
            /*TODO TIME INTERVAL*/
            //console.log(this.time.now)
            //this.time.delayedCall(this.time.now+2000, this.launchScenes(), [], this);
        }
    }

    /**
     * Change to specific level
     * @param {number} level - The level to change
     */
    nextLevel(level) {
        this.closeScenes();
        this.level = level;
        if (this.level > this.maxLevels)
            this.endGame();
        else {
            this.launchScenes();
            /*TODO TIME INTERVAL*/
            //console.log(this.time.now)
            //this.time.delayedCall(this.time.now+2000, this.launchScenes(), [], this);
        }
    }

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
        this.cm.style.display = 'none';
        this.game.style.height = "100vh";
        this.scale.resize(document.getElementById('gameContainer').clientWidth, document.getElementById('gameContainer').clientHeight);
        document.getElementById("run").disabled  = false;//Also reset the button to click again
        this.launchScenes();
    }

    /**
     * Resume all and adapt de screen for the transition of scenes
     */
    launchScenes() {
        this.scene.launch("SceneUp");
        this.scene.launch("SceneDown", this.level);
        this.cm.style.display = 'block';
        this.game.style.height = "75vh";
        this.scale.resize(document.getElementById('gameContainer').clientWidth, document.getElementById('gameContainer').clientHeight);
    }

    /**
     * Resume all and adapt de screen for the transition of scenes
     */
    update(){
        //To enable or disable debugMode 
        if(this.keyShift.isDown && this.key8.isDown && !this.keysForDebugAreDown){
            this.debugMode = !this.debugMode;
            this.keysForDebugAreDown = true;//This is just to avoid the keys enabling and disabling the debugMode a lot of times, so they'll do it just once
            if(this.debugMode){
                console.log('Debug ACTIVATED')
                showInfoCameras();
                showInfoTile();
                showInfoAndy();
                //showInfoRaspi();  //for the moment let it like this, because it seems that is causing problems when the raspi isn't connected
            }
            else
                console.log('Debug DISABLED')
        }
        else if(!this.keyShift.isDown && !this.key8.isDown)
            this.keysForDebugAreDown = false;
    }
}