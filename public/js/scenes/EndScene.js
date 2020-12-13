/** Class for the info game
 * @extends Phaser.Scene
 */
class EndScene extends Phaser.Scene {
    /**
     * Create the scene
     */
    constructor() {
        super("EndScene");
        console.log('Creating SceneUp...');

        this.widthGame = document.getElementById('principal').clientWidth;
        this.heightGame = document.getElementById('principal').clientHeight;

        this.textWidth = 1458; // In pixels

    }

    /**
     * Make the scene
     */
    create() {
        this.scene.get('MainScene').backgroundImage.destroy();

        this.cameras.main.setSize(this.widthGame, this.heightGame);
        this.cameras.main.setPosition(0, 0);

        this.cameras.main.fadeIn(4000);

        let textZoom = this.widthGame / this.textWidth;
        this.textImage = this.add.image(0, 0, "textImg").setOrigin(0);
        this.textImage.setScale(textZoom);

        this.endText = this.add.image(0, 450, "endText").setOrigin(0);
        this.endText.setScale(textZoom);

        this.time.delayedCall(4000, function () {
            this.recursiveCall(0.2); //Credits scrollin main camera
        }, [], this);

    }

    recursiveCall(i) {
        this.cameras.main.setScroll(0, i);
        if (i < 400) {
            this.time.delayedCall(20, function () {
                this.recursiveCall(i + 4);
            }, [], this);
        }
    }
}