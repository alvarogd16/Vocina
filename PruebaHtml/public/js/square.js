class Square{
    constructor(game){
        this.x = 50;
        this.y = 50;
        game.add.rectangle(0,0,100,100,0xffffff).setOrigin(0)
    }

    move(){
        this.x += 50;
    }
}