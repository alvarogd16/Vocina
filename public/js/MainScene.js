class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    create() {
        console.log("Creating game");

        // Load a map from a 2D array of tile indices
        this.level = [
            [1, 2, 2, 2, 2, 2],
            [1, 2, 2, 2, 2, 2],
            [1, 2, 1, 1, 2, 2],
            [1, 2, 2, 2, 2, 2],
            [1, 2, 2, 2, 2, 2],
            [1, 0, 2, 1, 1, 1],
        ];
        //Another map
        this.level2 = [
            [2, 2, 2, 2, 2, 2],
            [1, 2, 2, 2, 2, 2],
            [1, 2, 1, 1, 2, 2],
            [1, 2, 2, 2, 2, 2],
            [1, 2, 2, 2, 2, 2],
            [1, 0, 2, 1, 1, 1],
        ];

        //Call the scenes
        this.scene.launch("SceneUp");
        this.scene.launch("SceneDown", this.level);

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
        this.scene.launch("SceneDown", this.level2);
        this.cm.style.display = 'block';
        this.game.style.height = "75vh";
        this.scale.resize(document.getElementById('gameContainer').clientWidth, document.getElementById('gameContainer').clientHeight);
    }
}