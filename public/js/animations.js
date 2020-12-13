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
        frames: scene.anims.generateFrameNumbers('talkSprite', {
            start: 0,
            end: 2
        }),
        frameRate: 10,
        repeat: -1
    };
    scene.anims.create(config);
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

function createAnimationsFire(scene) {
    let config = {
        key: 'fireBurning',
        frames: scene.anims.generateFrameNumbers('fire', {
            start: 0,
            end: 20
        }),
        frameRate: 10,
        repeat: -1
    };
    scene.anims.create(config);
    
}

function createAnimationsBathroom(scene) {
    let config = {
        key: 'espumaAnim',
        frames: scene.anims.generateFrameNumbers('espuma', {
            start: 0,
            end: 2
        }),
        frameRate: 7,
        repeat: 0
    };
    scene.anims.create(config);
    
    config = {
        key: 'waterAnim',
        frames: scene.anims.generateFrameNumbers('water', {
            start: 0,
            end: 2
        }),
        frameRate: 4,
        repeat: -1
    };
    scene.anims.create(config);
    
}

function createAnimationsFireEnding(scene) {
    let config = {
        key: 'garageEnding',
        frames: scene.anims.generateFrameNumbers('endingSpriteSheet', {
            start: 0,
            end: 2
        }),
        frameRate: 1.5,
        repeat: 0
    };
    scene.anims.create(config);
    
}