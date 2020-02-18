const widthD = window.innerWidth;
const heightD = window.innerHeight;

const config = {
    type: Phaser.AUTO,  //Automatically select between Canvas and Webgl
    width: widthD,
    height: heightD,
    parent: 'gameContainer',
    scene: [MainScene, SceneUp, SceneDown]
    
}

//Create a new game with the config 
const game = new Phaser.Game(config);
