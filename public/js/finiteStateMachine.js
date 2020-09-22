//********************************//
//***** Finite State Machine *****//
//********************************//

// Configuration object to the FSM 
let stateConfig = {
	states: {
		// Load some important info like the sublevel type or the id
		boot: {
			next: 'explanation',
			enter: function () {
				console.log("boot start");

				this.sublevelType = this.sceneDown.getSublevelType(this.sublevelId);
				this.sublevelObjetive = this.sceneDown.getSublevelObjetive(this.sublevelId);

				this.next();
			}  
		},
		// Load and write all the sentences of the sublevel
		explanation: {
			next: function () {
				// When there arent objetives in th sublevel 
				if(this.sublevelObjetive.length === 0) {
					this.sublevelComplete = true;
					return 'action';
				} else
					return 'programming';
			},
			enter: function () {
				console.log("explanation start");

				this.sceneUp.loadSentences(this.sublevelId);
				this.sceneUp.startWrite();
			},
			exit: function () {
				// Activate and load the item
				switch(this.sublevelType){
					case "item":
						this.sceneDown.prepareItem(this.sublevelObjetive[1]);
						break;
				}
			}
		},
		// Allows user to program in editor
		programming: {
			next: 'checkCode',
			enter: function () {
				console.log("programming start");

				//activate write and run button
				this.sceneDown.runButtonAndWriteAllowed(true);
			},
			exit: function () {
				this.sceneDown.runButtonAndWriteAllowed(false);
			}
		},
		// Check the syntactic errors of the code
		// (implements with try catch in sceneDown)
		checkCode: {
			next: function () {
				if (this.codeErrors) {
					// Error message
					this.sceneUp.write("Oh no, hay un error en el codigo, comprueba que este bien escrito")
					return 'programming';
				} else {
					return 'action';
				}
			},
			enter: function () {
				console.log("check start");
			}
		},
		// Some sublevels need specific actions
		// (move and item wait for the player to finish the move)
		action: {
			next: "checkSublevel",
			enter: function () {
				console.log("action start");

				// Do the action depends of sublevel
				switch(this.sublevelType) {
					case "lightOff":
						this.sceneDown.setLight(false);

						this.next();
						break;
					case "lightOn":
						console.log("Luces encendidass");

						// TEMPORAL
						this.sceneDown.lantern.encender(this.sceneDown.inventory);
						this.next();

						// WHEN YOU TRY THE RASPI
						// // Wait to raspi button signal
						// raspiRead("BUT").then(value => {
						//     if(value) {
						//         this.sceneDown.lantern.encender();
						//         this.next();
						//     }
						// });
						break;
					case "put":
					case "temp":
						this.next();
				}
			}
		},
		// Check each sublevel depending of the objetives
		checkSublevel: {
			next: function () { 
				if(this.sublevelComplete){
					if(this.sublevelId === this.sceneDown.getSublevelsNum()){
						return 'end';
					}

					// Update the last player state
					this.lastPlayerState = this.sceneDown.updatePlayerState();

					// Next sublevel
					this.sublevelId++;
					this.sublevelComplete = false;

					return 'boot';
				} else {
					// Fail message depends of tipe of sublevel
					// TODO

					//Change to the last player state
					this.sceneDown.setPlayerState(this.lastPlayerState);

					return 'programming';
				}
			},
			enter: function () {
				console.log("-- Check " + this.sublevelType + " sublevel");

				switch(this.sublevelType){
					case "move":
						// Check the actual position with the objetive position
						if(this.sceneDown.andy.posMatrix[0] === this.sublevelObjetive[0][0] &&
							this.sceneDown.andy.posMatrix[1] === this.sublevelObjetive[0][1]){

							console.log("Sublevel complete");
							this.sublevelComplete = true;
						} else 
							this.sceneUp.write("PErro te moviste maaaall"); // TO CHANGE
					break;

					case "item":
						// Like the last one but now check the item in the inventory too
						if(this.sceneDown.andy.posMatrix[0] === this.sublevelObjetive[0][0] &&
							this.sceneDown.andy.posMatrix[1] === this.sublevelObjetive[0][1] &&
							this.sceneDown.inventory.searchItem(this.sublevelObjetive[1])){

							console.log("Sublevel complete");
							this.sublevelComplete = true;
						} else 
							this.sceneUp.write("PErro te moviste maaaall"); // TO CHANGE
					break;

					case "put":
						// Check if the item has been installed correctly
						let itemObjectPut = this.sceneDown.itemsObject[this.sublevelObjetive[0]];
						if(itemObjectPut.comprobarItem(this.sublevelObjetive[1])){
							console.log("Sublevel complete");
							this.sublevelComplete = true;
						} else 
							this.sceneUp.write("PErro te instalaste maaaall"); // TO CHANGE
					break;

					case "temp":
						// Check if the temp is correct depend if encoder has been installed or not
						let itemObjectTemp = this.sceneDown.itemsObject[this.sublevelObjetive[0]];

						// When the encoder is not installed
						this.sublevelComplete = true;

						// After encoder instalation
						if(this.sublevelObjetive[1]){
							if(itemObjectTemp.checkTemp()){
								console.log("Sublevel complete");
							} else {
								this.sublevelComplete = false;
								this.sceneUp.write("PErro la temperatura esta maaall"); // TO CHANGE
							}
									
						}
					break;
				}

				this.next();
			}
		},
		// Go to the next level
		end: {
			enter: function () {
				console.log("End of level");

				this.sublevelId = 0;
				this.mainScene.nextLevel();
			}
		}
	},
	extend: {
		sublevelId: 0,
		sublevelComplete: false,
		sublevelType: undefined,
		sublevelObjetive: undefined,
		lastPlayerState: {},
		codeErrors: false,
		mainScene: undefined,
		sceneUp: undefined,
		sceneDown: undefined
	}
}