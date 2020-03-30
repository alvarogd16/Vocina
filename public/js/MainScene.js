class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    create() {
        console.log("Creating game");

        this.level = 1;
        this.maxLevels = 2;

        //Call the scenes
        this.scene.launch("SceneUp");
        this.scene.launch("SceneDown", this.level);  //With Level1

        //Variables to hide function
        this.cm = document.getElementById('codeArea');
        this.game = document.getElementById('gameContainer');
    }

    //Chenge to the next level
    nextLevel() {
        this.closeScenes();
        this.level++;
        if(this.level > this.maxLevels)
            this.endGame();
        else{
            this.launchScenes();
            /*TODO TIME INTERVAL*/
            //console.log(this.time.now)
            //this.time.delayedCall(this.time.now+2000, this.launchScenes(), [], this);
        }
    }

    //Change to specific level
    nextLevel(level) {
        this.closeScenes();
        this.level = level;
        if(this.level > this.maxLevels)
            this.endGame();
        else{
            this.launchScenes();
            /*TODO TIME INTERVAL*/
            //console.log(this.time.now)
            //this.time.delayedCall(this.time.now+2000, this.launchScenes(), [], this);
        }
    }

    endGame(){
        this.add.text(10, 10, 'GAME OVER');
    }

    //Stop all and adapt de screen for the transition of scenes
    closeScenes() {
        this.scene.stop('SceneUp');
        this.scene.stop('SceneDown');
        this.cm.style.display = 'none';
        this.game.style.height = "100vh";
        this.scale.resize(document.getElementById('gameContainer').clientWidth, document.getElementById('gameContainer').clientHeight);
    }

    //Resume all and adapt de screen for the transition of scenes
    launchScenes() {
        this.scene.launch("SceneUp");
        this.scene.launch("SceneDown", this.level);
        this.cm.style.display = 'block';
        this.game.style.height = "75vh";
        this.scale.resize(document.getElementById('gameContainer').clientWidth, document.getElementById('gameContainer').clientHeight);
    }
}