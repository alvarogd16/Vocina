class SceneUp extends Phaser.Scene {
    constructor() {
        super("SceneUp");
        this.debug = false;
    }
    
    preload(){
        //this.load.image("dialogs", "../public/assets/dialogs.jpg");
    }
    
    create(){
        //this.add.image(0, 0, "dialogs").setOrigin(0).setScale(0.625);
        if(this.debug){
            this.zoom = this.add.text(10, 10, 'Zoom: ');
            this.camX = this.add.text(10, 30, 'CamX: ');
            this.camY = this.add.text(10, 50, 'CamY: ');
            this.posM = this.add.text(10, 70, 'Position map: ');
            this.sizeX = this.add.text(10, 90, 'SizeX : ');
        }
    }

    showInformation(zoom, camX, camY, posM, sizeX){
        this.zoom.setText('Zoom: ' + zoom);
        this.camX.setText('CamX: ' + camX);
        this.camY.setText('CamY: ' + camY);
        this.posM.setText('Position map: ' + posM);
        this.sizeX.setText('SizeX:  ' + sizeX);
    }
}