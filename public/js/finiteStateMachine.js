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
                
                document.getElementById("run").style.opacity = "0.2";

				this.sublevelType = this.sceneDown.getSublevelType(this.sublevelId);
				this.sublevelObjetive = this.sceneDown.getSublevelObjetive(this.sublevelId);

				//console.log(this.sublevelType, this.sublevelObjetive);

				switch (this.sublevelType) {
					case "box":
						// Activate the box you're in
						this.sceneDown.entitiesObject[this.moveOption].activate();
					break;

					case "temp":
						this.sceneDown.fridge.read = this.sublevelObjetive[1];
					break;
				}

				this.next();
			}  
		},
		// Load and write all the sentences of the sublevel
		explanation: {
			next: function () {
				// If it's a subvlevel without objetives
				if(this.sublevelObjetive.length === 0) {
					this.sublevelComplete = true;
					return 'action';
				} else
					return 'programming';
			},
			enter: function () {
				console.log("explanation start");

				switch(this.sublevelType){
					case "box":
						this.sceneDown.flask.updateCode("for(let i = ; i < ; i++) {\n//Aqui escribes lo que quieras que se repita\n}");
					break;
				}

				this.sceneUp.loadSentences(this.sublevelId);
				this.sceneUp.startWrite();
			},
			exit: function () {
				// Activate and load the item
				switch(this.sublevelType){
					case "item":
						this.sceneDown.prepareItem(this.sublevelObjetive[1]);
						break;
					case "temp":
						let fridge = this.sceneDown.entitiesObject[this.sublevelObjetive[0]];
						break;
				}
			}
		},
		// Allows user to program in editor
		programming: {
			next: 'checkCode',
			enter: function () {
				console.log("programming start");
                
                document.getElementById("run").style.opacity = "1";

				//activate write and run button
				this.sceneDown.activateEditor(true);

				// switch(this.sublevelType){
				// 	case "lightOff":
				// 		this.next();
				// }
			},
			exit: function () {
                document.getElementById("run").style.opacity = "0.2";
                
				this.sceneDown.activateEditor(false);
				this.mainScene.editorClean();

				switch(this.sublevelType){
					case "temp":
						let fridge = this.sceneDown.entitiesObject[this.sublevelObjetive[0]];
				}
			}
		},
		// Check the syntactic errors of the code
		// (implements with try catch in sceneDown)
		checkCode: {
			next: function () {
				if (this.codeErrors) {
                    console.log("CheckCode: con errores");

					// Error message
					this.sceneUp.write("Oh no, hay un error en el codigo, comprueba que este bien escrito")

					// this.sceneDown.time.delayedCall(3000, function () {
					// 	console.log(this.lastPlayerState)
					// 	this.sceneDown.setPlayerState(this.lastPlayerState);
					// }, [], this);

					this.codeErrors = false;

					return 'programming';
				} else {
                    console.log("CheckCode: sin errores");
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

						//Only need one time pulsed
						let buttonPulsed = false;

						socket.on('button', () => {
							console.log("Botoon");
							if(!buttonPulsed){
								raspiWrite("LED", 1);
								this.sceneDown.lantern.encender(this.sceneDown.inventory);
								this.next();
								buttonPulsed = true;
							}
						});
						break;
					case "put":
					case "box":
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
					//Change to the last player state
					//console.log(this.lastPlayerState);
					this.sceneDown.setPlayerState(this.lastPlayerState, this.sublevelObjetive[1]);

					return 'programming';
				}
			},
			enter: function () {
				console.log("-- Check " + this.sublevelType + " sublevel");

				this.sublevelComplete = false;

				switch(this.sublevelType){
					case "move":
						// Check if andy is in one of the posible objetive position
						// return the index in the objetive array
						// If not return -1
						let indexOfMov = this.sublevelObjetive.findIndex(x => 
							x[0] == this.sceneDown.andy.posMatrix[0] &&
							x[1] == this.sceneDown.andy.posMatrix[1]
						);

						// To more than one movement option
						this.moveOption = indexOfMov;

						if(indexOfMov != -1){
							console.log("Sublevel complete");
							this.sublevelComplete = true;

							// When there are many move option delete the 
							// current one so that you cannot return to one already visited
							this.sceneDown.deleteSublevelMove(this.sublevelId, this.moveOption);
						} else
							this.sceneUp.write("Comprueba si te has movido a la posición indicada");
					break;

					case "item":
						// Like the last one but now check the item in the inventory too
						if(this.sceneDown.andy.posMatrix[0] === this.sublevelObjetive[0][0] &&
							this.sceneDown.andy.posMatrix[1] === this.sublevelObjetive[0][1] &&
							this.sceneDown.inventory.searchItem(this.sublevelObjetive[1])){

							console.log("Sublevel complete");
							this.sublevelComplete = true;
                            
                            this.itemSublevelNotCompleted = false;
						} else {
							this.sceneUp.write("Seguro que está el item en esta posición??");
                            
                            this.itemSublevelNotCompleted = true;
                        }
					break;

					case "put":
						// Check if the item has been installed correctly
						let itemObjectPut = this.sceneDown.entitiesObject[this.sublevelObjetive[0]];
						if(itemObjectPut.comprobarItem(this.sublevelObjetive[1])){
							console.log("Sublevel complete");
							this.sublevelComplete = true;
						} else 
							this.sceneUp.write("Prueba a colocar de nuevo el item");
					break;

					case "temp":
						// Check if the temp is correct depend if encoder has been installed or not
						let itemObjectTemp = this.sceneDown.entitiesObject[this.sublevelObjetive[0]];

						// When the encoder is not installed
						this.sublevelComplete = true;

						// After encoder instalation
						if(!this.sublevelObjetive[1]){
							if(itemObjectTemp.checkTemp()){
								console.log("Sublevel complete");
							} else {
								this.sublevelComplete = false;
								this.sceneUp.write("La temperatura sigue siendo muy alta prueba a bajarla más");
							}

						}
					break;

					case "trap":
						if(this.sceneDown.zombie.dead && this.sceneDown.sink.checkSink())
							this.sublevelComplete = true;
						else {
							this.sceneUp.write("Ohh noo, el zombie te he comido, vuelve a intentarlo");
							this.sceneDown.zombie.resetZombie();
						}
					
					break;

					case "box":

						// Each position is asociated with a box
						// the index depends of the position in the map
						let box = this.sceneDown.entitiesObject[this.moveOption];

						if(box.open){
							this.sublevelComplete = true;
							this.sceneUp.write("Has abierto la cajaaa");
							this.sceneDown.console.escribir(box.correctCode);
							console.log("Todo ok");
							box.openSound();
						} else {
							this.sceneUp.write("Ohh noo, el código es incorrecto");
							box.closeSound();
						}
					break;

					case "lightOff":
					case "lightOn":
						this.sublevelComplete = true;
						break;
				}

				console.log("Saliendo check...");
				this.next();
			}
		},
		// Go to the next level
		end: {
			enter: function () {
				console.log("End of level");

				this.sublevelId = 0;
				this.mainScene.time.delayedCall(2000, function () {
					this.mainScene.nextLevel();
				}, [], this)
			}
		}
	},
	extend: {
		sublevelId: 0,
		sublevelComplete: false,
		sublevelType: undefined,
		sublevelObjetive: undefined,
		moveOption: 0,
		lastPlayerState: {},
		codeErrors: false,
		mainScene: undefined,
		sceneUp: undefined,
		sceneDown: undefined,
        itemSublevelNotCompleted: false
	}
}
