const widthD = document.getElementById('gameContainer').clientWidth
const heightD = document.getElementById('gameContainer').clientHeight

const config = {
    type: Phaser.AUTO,
    width: widthD,
    height: heightD,
    parent: 'gameContainer',
    scene: [MainScene, SceneUp, SceneDown, EndScene],
    //pixelArt: true,
    physics: {
        default: 'arcade',
        arcade: {
            debug: false
        }
    }
}

//Create a new game with the config 
var game = new Phaser.Game(config);