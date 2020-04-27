const widthD = document.getElementById('gameContainer').clientWidth
const heightD = document.getElementById('gameContainer').clientHeight

const config = {
    type: Phaser.WEBGL,
    width: widthD,
    height: heightD,
    parent: 'gameContainer',
    scene: [MainScene, SceneUp, SceneDown],
    pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
}

//Create a new game with the config 
var game = new Phaser.Game(config);