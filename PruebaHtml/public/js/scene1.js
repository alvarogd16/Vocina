class scene1 extends Phaser.Scene {
    constructor() {
        super("gameScene");
    }

    preload() {

    }

    create() {
        //this.add.text(10, 10, "Loading game...")

        this.add.rectangle(100,100,10,10,0xffffff).setOrigin(0)
    }

    print(){
        this.add.text(10, 10, "Loading game...")
    }
}