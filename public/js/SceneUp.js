class SceneUp extends Phaser.Scene {
    constructor() {
        super("SceneUp");
        this.debug = false;
    }
    
    preload(){
        //this.load.image("dialogs", "../public/assets/dialogs.jpg");

        //Load the dialog plugin in the scene
        //this.load.plugin('DialogModalPlugin', 'js/dialog_plugin.js');
        const url = 'https://raw.githubusercontent.com/rexrainbow/phaser3-rex-notes/master/dist/rextexttypingplugin.min.js';
        this.load.plugin('rextexttypingplugin', url, true);
    }
    
    create(){
        //this.add.image(0, 0, "dialogs").setOrigin(0).setScale(0.625);

        let textGameObject = this.add.text(20, 20, '', {wordWrap: {width: 370}});
        let typing = this.plugins.get('rextexttypingplugin').add(textGameObject, {
            speed: 100,       // typing speed in ms
            typeMode: 0,      //0|'left-to-right'|1|'right-to-left'|2|'middle-to-sides'|3|'sides-to-middle'
            setTextCallback: function(text, isLastChar, insertIdx){ return text; },  // callback before set-text
            setTextCallbackScope: null
        });
        
        typing.start('Venga andy amigo, estamos esperando a que te muevas anda');

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