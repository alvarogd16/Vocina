const widthD = document.getElementById('principal').clientWidth
const heightD = document.getElementById('principal').clientHeight

class Menu extends Phaser.Scene {
    constructor() {
        super("Menu");

    }

    preload() {
        //Load audio files
        this.load.audio('menuTheme', [
            'assets/sounds/menuTheme.mp3'
        ])
        
        this.load.audio('fireCrackling', [
            'assets/sounds/fireCrackling.mp3'
        ])

        //Load images files
        this.load.image("maskImg", "assets/menu/mask.png");
        this.load.image("textImg", "assets/menu/text.png");

        // Fire sprite.
        this.load.spritesheet({
            key: 'fire',
            url: "assets/menu/fuegospritesheet.png",
            frameConfig: {
                frameWidth: 432,
                frameHeight: 432,
                startFrame: 0,
                endFrame: 3,
                margin: 0,
                spacing: 0
            }
        });

    }

    create() {
        console.log("Creating menu");
        
        //Set background color
        this.cameras.main.backgroundColor.setTo(0, 0, 0); //same that css

        //Add images to the screen
        this.fire = new Fire(this, widthD / 2, heightD / 2);
        
        this.fire.anims.play("fireBurning", true);
        //this.add.image(0, 0, "maskImg").setOrigin(0);
        this.add.image(0, 0, "textImg").setOrigin(0);
        
        //Play menu theme
        var loopMarkerMenu = {
            name: 'loopMenu',
            config: {
                loop: true
            }
        };
        
        //Play fire sound
        var loopMarkerFire = {
            name: 'loopFire',
            config: {
                loop: true,
                volume: 0.015
            }
        };

        this.menuTheme = this.sound.add('menuTheme');

        this.fireCrackling = this.sound.add('fireCrackling');

        this.menuTheme.addMarker(loopMarkerMenu);
        this.fireCrackling.addMarker(loopMarkerFire);

        // Delay option can only be passed in config
        this.menuTheme.play('loopMenu', {
            delay: 0
        });
        this.fireCrackling.play('loopFire', {
            delay: 0
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: widthD,
    height: heightD,
    parent: 'principal',
    scene: [Menu],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
}

//Create a new game with the config 
var game = new Phaser.Game(config);
