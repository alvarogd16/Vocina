//********************************//
//***** Finite state machine *****//
//********************************//

let stateConfig = {
	states: {
		boot: {
			next: 'explanation',
			enter: function () {
				console.log("boot start");

				this.sublevelType = this.sceneDown.getSublevelType(this.sublevelId);
				this.sublevelObjetive = this.sceneDown.getSublevelObjetive(this.sublevelId);

				this.next();
			}  
		},
		explanation: {
			next: function () {
				if(this.sublevelObjetive.length === 0) {
					// Its not necessary check the sublevel
					this.sublevelComplete = true;
					return 'action';
				} else {
					return 'programming';
				}
			},
			enter: function () {
				console.log("explanation start");

				this.sceneUp.loadSentences(this.sublevelId);
				this.sceneUp.startWrite();
			}
		},
		programming: {
			next: 'checkCode',
			enter: function () {
				console.log("programming start");

				//activate write and run button
				this.sceneDown.runButtonAndWriteAllowed(true);

				// Temporal here?
				switch(this.sublevelType){
					case "item":
						this.sceneDown.prepareItem(this.sublevelObjetive[1]);
						break;
				}
			},
			exit: function () {
				this.sceneDown.runButtonAndWriteAllowed(false);
			}
		},
		checkCode: {
			next: function () {
				if (this.codeErrors) {
					//error message
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
		action: {
			next: "checkSublevel",
			enter: function () {
				console.log("action start");
				//Do the action depends of sublevel

				switch(this.sublevelType) {
					case "lightOff":
						//turn off lights
						this.sceneDown.setLight(false);

						this.next();
						break;
					case "lightOn":
						console.log("Luces encendidass");

						// TEMPORAL
						this.sceneDown.lantern.encender(this.sceneDown.inventory);
						this.next();

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
		checkSublevel: {
			next: function () { 
				if(this.sublevelComplete){
					//console.log(this.sceneDown.getSublevelsNum())
					if(this.sublevelId === this.sceneDown.getSublevelsNum()){
						return 'end';
					}

					//Update the last player state
					this.lastPlayerState = this.sceneDown.initializePlayerState();

					//next sublevel
					this.sublevelId++;
					this.sublevelComplete = false;

					return 'boot';
				} else {
					//fail message depends of tipe of sublevel

					//Change to the last player state
					this.sceneDown.setPlayerState(this.lastPlayerState);

					return 'programming';
				}
			},
			enter: function () {
				//TODO
				console.log("-- Check " + this.sublevelType + " sublevel");

				switch(this.sublevelType){
					//Only have to go to one place
					case "move":
						if(this.sceneDown.andy.posMatrix[0] === this.sublevelObjetive[0][0] &&
							this.sceneDown.andy.posMatrix[1] === this.sublevelObjetive[0][1]){

							console.log("Sublevel complete");
							this.sublevelComplete = true;
						} else 
							this.sceneUp.write("PErro te moviste maaaall");
					break;

					case "item":
						if(this.sceneDown.andy.posMatrix[0] === this.sublevelObjetive[0][0] &&
							this.sceneDown.andy.posMatrix[1] === this.sublevelObjetive[0][1] &&
							this.sceneDown.inventory.searchItem(this.sublevelObjetive[1])){

							console.log("Sublevel complete");
							this.sublevelComplete = true;
						} else 
							this.sceneUp.write("PErro te moviste maaaall");
					break;

					case "put":
						let itemObjectPut = this.sceneDown.itemsObject[this.sublevelObjetive[0]];
						if(itemObjectPut.comprobarItem(this.sublevelObjetive[1])){
							console.log("Sublevel complete");
							this.sublevelComplete = true;
						} else 
							this.sceneUp.write("PErro te instalaste maaaall");
					break;

					case "temp":
						let itemObjectTemp = this.sceneDown.itemsObject[this.sublevelObjetive[0]];

						// When the encoder is not installed
						this.sublevelComplete = true;

						// After encoder instalation
						if(this.sublevelObjetive[1]){
							if(itemObjectTemp.checkTemp()){
								console.log("Sublevel complete");
							} else {
								this.sublevelComplete = false;
								this.sceneUp.write("PErro la temperatura esta maaall");
							}
									
						}
					break;
				}

				this.next();
			}
		},
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