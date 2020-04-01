function createAnimationsSceneUp(scene) {
	let config = {
		key: 'talk',
		frames: scene.anims.generateFrameNumbers('player', {
			start: 0,
			end: 2
		}),
		frameRate: 15,
		repeat: -1
	};
	scene.anims.create(config);

}