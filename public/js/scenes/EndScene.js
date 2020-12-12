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
     * Load all assets in cache
     */
    preload() {
        //this.load.image("background", "assets/crisDialogs/BackgroundScreen.png");
    }
    /**
     * Make the scene
     */
    create() {
        //this.zoomBackground = this.width / 1125; //1125 is the image's width
        //this.add.image(0, 0, 'background').setOrigin(0).setScale(this.zoomBackground);

        this.cameras.main.setSize(this.widthGame, this.heightGame);
        this.cameras.main.setPosition(0, 0);
        
        this.cameras.main.fadeIn(5000);

        let textZoom = this.widthGame / this.textWidth;
        this.textImage = this.add.image(0, 0, "textImg").setOrigin(0);
        this.textImage.setScale(textZoom);

        this.endText = this.add.image(0, 400, "endText").setOrigin(0);
        this.endText.setScale(textZoom);
    }

}