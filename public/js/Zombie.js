 /** Class representing the zombie.
  * @extends Phaser.GameObjects.Sprite
  */
 class Zombie extends Phaser.Physics.Arcade.Sprite {

     /**
      * Create the zombie.
      * @param {object} scene - scene creating the zombie.
      * @param {number} x - Start location x value.
      * @param {number} y - Start location y value.
      * @param {number} [frame] -
      */
     constructor(scene, x, y, andy, frame) {
         super(scene, x, y, andy, frame);

         this.scene = scene;
         this.playerToFollow = andy;
         this.currentRoom = 1; // Set start room so room change flag doens't fire.
         this.previousRoom = null;
         this.roomChange = false;
         this.canMove = true;
         scene.physics.world.enable(this);
         scene.add.existing(this);

         //Set the skins of the sprite
         this.setTexture('zombie');
         this.setPosition(x, y);

         //Set collisions activation of the sprite
         this.body.setCollideWorldBounds(true);
         //the hitbox is (height=tileHeight, width=tileWidth, x=andyX, y=andyY) (andyX & andyY both calculated in SceneDown)
         this.body.setSize(scene.tileSize, scene.tileSize, x, y);
         //this.body.setSquare(10);

         this.onStairs = false;
         this.direction = "down";
         this.target = new Phaser.Math.Vector2();

     }


     /*FUNCTIONS TO USE BY USER*/

     //An example of use raspiClient
     turnOnLED() {
         raspiRead('LED')
             .then(data => console.log("CLIENT: ", data));

         raspiWrite('LED', 1);

         raspiRead('LED')
             .then(data => console.log("CLIENT: ", data));
     }

     /*OTHER FUNCTIONS*/
     movingToAndy() {
         this.target.x = this.playerToFollow.x;//andy's x coordinate
         this.target.y = this.playerToFollow.y;//andy's y coordinate
         
         //30 means that the sprite goes as fast as 30pixels per second (Is the value of this.body.speed)
         this.scene.physics.moveToObject(this, this.target, 5);
     }

     //Before scene update
     preUpdate(time, delta) {
         super.preUpdate(time, delta);

         if (this.canMove) {
             this.movingToAndy();

             //Distance between andy and this zombie will reach
             let distance = Phaser.Math.Distance.Between(this.x, this.y, this.target.x, this.target.y);

             if (this.body.speed > 0) {
                 //  4 is our distance tolerance, i.e. how close the source can get to the target
                 //  before it is considered as being there. The faster it moves, the more tolerance is required.
                 //If the sprite reaches it's destination or it touches one of the walls stabilished in the map, it's animation should stop
                 if (distance < 15 /*MAP // BOUNDS*/ ) {
                     //this.body.reset(32, 32);
                     this.scene.zombiesReachedAndy();
                 }
             }
         }
     }
 }