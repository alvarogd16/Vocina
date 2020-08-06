const widthD = document.getElementById('principal').clientWidth
const heightD = document.getElementById('principal').clientHeight

class Menu extends Phaser.Scene {
	constructor(){
		super("Menu");
	}

	preload(){
		//Load images files
        this.load.audio('menuTheme', [
            'assets/sounds/menuTheme.mp3'
        ])

		this.load.image("maskImg", "assets/menu/mask.png");
		this.load.image("textImg", "assets/menu/text.png");
	}

	create(){
		//Set background color
		this.cameras.main.backgroundColor.setTo(10, 33, 53); //same that css

		//Add images to the screen
		this.add.image(0, 0, "maskImg").setOrigin(0);
		this.add.image(0, 0, "textImg").setOrigin(0);
        
        //Play menu theme
        var loopMarker = {
            name: 'loop',
            config: {
                loop: true
            }
        };
        
        this.menuTheme = this.sound.add('menuTheme');
        //this.menuTheme.play();
        
        this.menuTheme.addMarker(loopMarker);

        // Delay option can only be passed in config
        this.menuTheme.play('loop', {
            delay: 0
        });
	}
}

const config = {
    type: Phaser.AUTO, 
    width: widthD,
    height: heightD,
    parent: 'principal',
    scene: [Menu]
}

//Create a new game with the config 
var game = new Phaser.Game(config);