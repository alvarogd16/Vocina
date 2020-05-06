function createAnimations(scene) {
    let config = {
        key: 'stand-down',
        frames: scene.anims.generateFrameNumbers('player', {
            start: 0,
            end: 0
        }),
        frameRate: 15,
        repeat: -1
    };
    scene.anims.create(config);

    config = {
        key: 'stand-right',
        frames: scene.anims.generateFrameNumbers('player', {
            start: 4,
            end: 4
        }),
        frameRate: 15,
        repeat: -1
    };
    scene.anims.create(config);

    config = {
        key: 'stand-up',
        frames: scene.anims.generateFrameNumbers('player', {
            start: 8,
            end: 8
        }),
        frameRate: 15,
        repeat: -1
    };
    scene.anims.create(config);


    config = {
        key: 'walk-down',
        frames: scene.anims.generateFrameNumbers('player', {
            start: 0,
            end: 3
        }),
        frameRate: 15,
        repeat: -1
    };
    scene.anims.create(config);

    config = {
        key: 'walk-right',
        frames: scene.anims.generateFrameNumbers('player', {
            start: 4,
            end: 7
        }),
        frameRate: 15,
        repeat: -1
    };
    scene.anims.create(config);

    config = {
        key: 'walk-up',
        frames: scene.anims.generateFrameNumbers('player', {
            start: 8,
            end: 11
        }),
        frameRate: 15,
        repeat: -1
    };
    scene.anims.create(config);
}

function createAnimationsSceneUp(scene) {
    let config = {
        key: 'talk',
        frames: scene.anims.generateFrameNumbers('talk', {
            start: 5,
            end: 6
        }),
        frameRate: 10,
        repeat: -1
    };
}


function createAnimationsPlayer(scene) {
    let config = {
        key: 'chicoCamina',
        frames: scene.anims.generateFrameNumbers('player', {
            start: 0,
            end: 5
        }),
        frameRate: 10,
        repeat: -1
    };
    scene.anims.create(config);
    
}