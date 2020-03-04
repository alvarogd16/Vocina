const widthD = window.innerWidth;
const heightD = window.innerHeight;

const config = {
    type: Phaser.AUTO,  //Automatically select between Canvas and Webgl
    width: widthD,
    height: heightD,
    parent: 'gameContainer',
    scene: [MainScene, SceneUp, SceneDown],
    //Set the physics of the game to 'arcade'
    physics: {
        default: 'arcade',
        arcade: {
            debug: true
        }
    }
    
}

//Create a new game with the config 
var game = new Phaser.Game(config);

function create(){
     game.physics.startSystem(Phaser.Physics.ARCADE);
}