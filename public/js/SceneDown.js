class SceneDown extends Phaser.Scene {
    constructor() {
        super("SceneDown");
    }
    
    preload(){
        
    }

    create() {
        console.log('Creating scene up...');

        //Editor elements
        let editor = CodeMirror.fromTextArea(document.getElementById('code'), {
            lineNumbers: true,
            lineWrapping: true, //When finish one line jump to the next
            undoDepth: 20 //Max number of lines to write
        })
        editor.setValue("//¿Estás preparado?") //Default value

        //Create the button to run the code
        let sceneThis = this;
        document.getElementById("run").onclick = function () {
            let editorContent = editor.getValue();
            sceneThis.readWritten(editorContent);
        };
    }

    //Create a new function with the code passed by parameter
    createFunction(args, code) {
        return new Function(args, code);
    }

    //Process the text in the texteditor
    readWritten(editorContent) {
        //Call other scene
        //this.sceneB = this.scene.get('SceneDown');
        if (this.andy === undefined)
            this.andy = new Player(this);
        let andy = this.andy;
        let args = 'andy';
        let executeMe = this.createFunction(args, editorContent);
        executeMe(andy);
    } 

    //Stile of the button 
    enterButtonHoverState() {
        this.clickButton.setStyle({
            fill: '#ff0'
        });
    }

    enterButtonRestState() {
        this.clickButton.setStyle({
            fill: '#0f0'
        });
    }

    enterButtonActiveState() {
        this.clickButton.setStyle({
            fill: '#0ff'
        });
    }

}