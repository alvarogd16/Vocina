const widthD = document.getElementById('principal').clientWidth
const heightD = document.getElementById('principal').clientHeight

class phaserVideo extends Phaser.Scene {
    constructor() {
        super("phaserVideo");
    }

    preload() {
        this.load.video('initVideo', 'assets/initVideo/vocina.mp4', 'canplaythrough');
    }

    create() {
        console.log("Playing video");

        //Fade in menu
        this.cameras.main.fadeIn(3000);
        this.cameras.main.zoom = 0.8;
        let skipButton = document.getElementById('skip');
        skipButton.style.opacity = '1';

        this.vid = this.add.video(250, 430, 'initVideo');

        this.vid.play(false);

        let scene = this;
        this.vid.on('complete', function () {
            scene.cameras.main.fadeOut(3000);
            skipButton.style.opacity = '0';
            scene.time.delayedCall(3000, function () {
                window.location.href = "menu.html";
            }, [], this);
        });
    }
}

const config = {
    type: Phaser.AUTO,
    width: widthD,
    height: heightD,
    parent: 'principal',
    scene: [phaserVideo],
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
}

//Create a new game with the config 
var game = new Phaser.Game(config);