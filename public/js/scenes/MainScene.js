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

        this.width = document.getElementById('gameContainer').clientWidth;

        //Variables to hide function
        this.cm = document.getElementById('codeArea');
    }

    preload(){
        this.load.image("background", "assets/dialogPlayer/PantallaBackground.png");
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


        //Call the scenes
        this.scene.launch("SceneUp");
        this.scene.launch("SceneDown", this.level); //With Level1


        //Calculate editor's height
        this.sceneUp = this.scene.get('SceneUp');
        this.cm.style.height = this.sceneUp.editorHeight + "px";

        //Keys        
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
        //document.getElementById("run").disabled  = false;//Also reset the button to click again
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
    update(){
        //To enable or disable debugMode 
        if(this.keyShift.isDown && this.key8.isDown && !this.keysForDebugAreDown){
            this.debugMode = !this.debugMode;
            this.keysForDebugAreDown = true;//This is just to avoid the keys enabling and disabling the debugMode a lot of times, so they'll do it just once
            if(this.debugMode){
                console.log('Debug ACTIVATED');
            }
            else
                console.log('Debug DISABLED');
        }
        else if(!this.keyShift.isDown && !this.key8.isDown)
            this.keysForDebugAreDown = false;
    }
}