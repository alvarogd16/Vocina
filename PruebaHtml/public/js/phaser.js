const widthD = $("#gameContainer").innerWidth()
const heightD = $("#gameContainer").innerHeight()

const config = {
    type: Phaser.AUTO,
    width: widthD,
    height: heightD,
    parent: 'gameContainer',
    scene: [scene1]
}

const game = new Phaser.Game(config)

/*
let s
let a = false
let square



function preload (){
    //this.load.svg('square', 'assets/sB.svg')
}

function create (){
    //this.add.image(0, 0, 'square').setOrigin(0)
   // this.cameras.main.setBackgroundColor(0xbababa)
   //s = this.add.rectangle(0,0,100,100,0xffffff).setOrigin(0)
   square = new Square(this)
}

function move () {
    //s.x += 100
    square.x += 50
}

function update (){
   
}*/