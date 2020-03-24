class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    create() {
        console.log("Creating game");

        //Call the scenes
        this.scene.launch("SceneUp");
        this.scene.launch("SceneDown", 1);  //With Level1

        //Variables to hide function
        let flag = true;
        this.cm = document.getElementById('codeArea');
        this.game = document.getElementById('gameContainer');

        document.getElementById('hide').onclick = () => {
            flag ? this.byeSD() : this.hiSD();
            flag = !flag;
        }
    }

    //Stop all and adapt de screen for the transition of scenes
    byeSD() {
        this.scene.stop('SceneUp');
        this.scene.stop('SceneDown');
        this.cm.style.display = 'none';
        this.game.style.height = "100vh";
        this.scale.resize(document.getElementById('gameContainer').clientWidth, document.getElementById('gameContainer').clientHeight);
    }

    //Resume all and adapt de screen for the transition of scenes
    hiSD() {
        this.scene.launch("SceneUp");
        this.scene.launch("SceneDown", 2);  //With Level2
        this.cm.style.display = 'block';
        this.game.style.height = "75vh";
        this.scale.resize(document.getElementById('gameContainer').clientWidth, document.getElementById('gameContainer').clientHeight);
    }
}