class MainScene extends Phaser.Scene {
    constructor() {
        super("MainScene");
    }

    create() {
        console.log("Creating game");

        //Call the scenes
        this.scene.launch("SceneUp");
        this.scene.launch("SceneDown");
    }
}