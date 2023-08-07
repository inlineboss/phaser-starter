import { GameObjects, Physics, RIGHT, Scene } from "phaser";

enum XDirection {
    Right,
    Left
}
enum YDirection {
    Up,
    Down
}

export class Player extends Phaser.Physics.Arcade.Sprite {

    private xdir: XDirection = XDirection.Right;
    private ydir: YDirection = YDirection.Down;

    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;
    private keySpace: Phaser.Input.Keyboard.Key;

    private keyJ: Phaser.Input.Keyboard.Key;
    private keyK: Phaser.Input.Keyboard.Key;
    private keyL: Phaser.Input.Keyboard.Key;
    private keyN: Phaser.Input.Keyboard.Key;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        this.scene.add.existing(this);
        this.setName('Player')

        // KEYS
        this.keyD = this.scene.input.keyboard?.addKey('D')!;
        this.keyW = this.scene.input.keyboard?.addKey('W')!;
        this.keyA = this.scene.input.keyboard?.addKey('A')!;
        this.keyS = this.scene.input.keyboard?.addKey('S')!;
        this.keySpace = this.scene.input.keyboard?.addKey('SPACE')!;

        this.keyJ = this.scene.input.keyboard?.addKey('j')!;
        this.keyK = this.scene.input.keyboard?.addKey('k')!;
        this.keyL = this.scene.input.keyboard?.addKey('l')!;
        this.keyN = this.scene.input.keyboard?.addKey('n')!;
    }

    create() {
        this.createAnimation();
        // this.createCamera();
    }

    private setDefaultBox() {
        this.setSize(22, 30);
    }
    public static preload(scene: Scene) {
        scene.load.spritesheet('player-idle', 'assets/players/idle.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-walk', 'assets/players/walk.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-jump', 'assets/players/jump.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-land', 'assets/players/land.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-shoot', 'assets/players/shoot.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-punch', 'assets/players/punch.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-sword-stab', 'assets/players/stab.png', { frameWidth: 96, frameHeight: 64 });
        scene.load.spritesheet('player-sword-attack', 'assets/players/attack.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-sword-run', 'assets/players/run.png', { frameWidth: 64, frameHeight: 64 });
    }

    createCamera() {
        this.scene.cameras.main.startFollow(this, true);
        this.scene.cameras.main.setZoom(2);
    }

    createAnimation() {
        this.scene.anims.create({
            key: 'idle',
            frames: this.anims.generateFrameNumbers('player-idle', { start: 0, end: 7 }),
            frameRate: 9,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'walk',
            frames: this.anims.generateFrameNumbers('player-walk', { start: 0, end: 7 }),
            frameRate: 8,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'jump',
            frames: this.anims.generateFrameNumbers('player-jump', { start: 0, end: 2 }),
            frameRate: 2,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'land',
            frames: this.anims.generateFrameNumbers('player-land', { start: 0, end: 8 }),
            frameRate: 16,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'run',
            frames: this.anims.generateFrameNumbers('player-sword-run', { start: 0, end: 7 }),
            frameRate: 14,
            repeat: -1
        });

        this.scene.anims.create({
            key: 'punch',
            frames: this.anims.generateFrameNumbers('player-punch', { start: 0, end: 7 }),
            frameRate: 16,
            repeat: 0
        });
        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, (ani: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            if (ani.key === 'punch' && frame.index == 5) {
                const distance = 37
                const w = this.flipX ? distance : 0;
                const bodies = this.scene.physics.overlapRect(this.x - w, this.y, distance, 3);
                bodies.forEach(x => {
                    if (x.gameObject.name !== 'Player') {
                        x.gameObject.destroy();
                        // this.scene.cameras.main.flash();
                    }
                });
            }
        })

        this.scene.anims.create({
            key: 'stab',
            frames: this.anims.generateFrameNumbers('player-sword-stab', { start: 0, end: 6 }),
            frameRate: 16,
            repeat: 0
        });
        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, (ani: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            if (ani.key === 'stab' && frame.index == 5) {
                const distance = 41 
                const w = this.flipX ? distance : 0;
                const bodies = this.scene.physics.overlapRect(this.x - w, this.y, distance, 3);
                bodies.forEach(x => {
                    if (x.gameObject.name !== 'Player') {
                        x.gameObject.destroy();
                        // this.scene.cameras.main.flash();
                    }
                });
            }
        })

        this.scene.anims.create({
            key: 'attack',
            frames: this.anims.generateFrameNumbers('player-sword-attack', { start: 0, end: 5 }),
            frameRate: 16,
            repeat: 0
        });
        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, (ani: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            if (ani.key === 'attack' && frame.index > 2 ) {
                const distance = 41 
                const bodies = this.scene.physics.overlapCirc(this.x, this.y, distance);
                bodies.forEach(x => {
                    if (x.gameObject.name !== 'Player') {
                        x.gameObject.destroy();
                        // this.scene.cameras.main.flash();
                    }
                });
            }
        })

        this.scene.anims.create({
            key: 'shoot',
            frames: this.anims.generateFrameNumbers('player-shoot', { start: 0, end: 9 }),
            frameRate: 16,
            repeat: 0
        });
        this.on(Phaser.Animations.Events.ANIMATION_UPDATE, (ani: Phaser.Animations.Animation, frame: Phaser.Animations.AnimationFrame) => {
            if (ani.key === 'shoot' && frame.index == 4) {
                const distance =  400;
                const w = this.flipX ? distance : 0;
                const bodies = this.scene.physics.overlapRect(this.x - w, this.y, distance, 3);
                bodies.forEach(x => {
                    if (x.gameObject.name !== 'Player') {
                        x.gameObject.destroy();
                        this.scene.cameras.main.flash();
                    }
                });
            }
        })
        
    }

    public update() {
        this.setVelocityX(0);
        this.onGround()

        let useSkill = false;

        let isIdle = true;

        if (this.keyD?.isDown) {
            this.doRight();
            isIdle = false
        }

        if (this.keyW?.isDown) {
            this.doUp();
            isIdle = false
        }

        if (this.keySpace?.isDown) {
            this.doJump();
            isIdle = false
        }

        if (this.keyA?.isDown) {
            this.doLeft();
            isIdle = false;
        }

        if (this.keyS?.isDown) {
            this.doDown();
            isIdle = false;
        }

        if (this.keyJ?.isDown && useSkill == false) {
            this.doPunch();
            isIdle = false;
            useSkill = true;
        }

        if (this.keyK?.isDown && useSkill == false) {
            this.doStab();
            isIdle = false;
            useSkill = true;
        }

        if (this.keyL?.isDown && useSkill == false) {
            this.doAttack();
            isIdle = false;
            useSkill = true;
        }

        if (this.keyN?.isDown && useSkill == false) {
            this.doShoot();
            isIdle = false;
            useSkill = true;
        }

        if (isIdle == true) {
            this.doIdle();
        }
    }

    iAmPlayer() { return true; }

    onGround(): boolean {
        return this.body!.deltaY() > 0 && this.body!.deltaY() < 1
    }

    public doIdle() {
        this.play('idle', true);
        this.setDefaultBox();
    }

    public doLeft() {
        this.setVelocityX(-200);
        this.setFlipX(true);
        this.play('run', true);
        this.setDefaultBox();
        this.xdir = XDirection.Left
    }

    public doRight() {
        this.setVelocityX(200);
        this.setFlipX(false);
        this.play('run', true);
        this.setDefaultBox();
        this.xdir = XDirection.Right
    }

    public doUp() {
        this.play('walk');
        this.setVelocityY(-100);
        this.setDefaultBox();
        this.ydir = YDirection.Up
    }

    public doJump() {
        this.play('jump');
        this.setVelocityY(-150);
        this.setDefaultBox();
        this.ydir = YDirection.Up
    }

    public doDown() {
        this.play('idle');
        this.setDefaultBox();
        this.ydir = YDirection.Down
    }

    public doPunch() {
        this.play('punch', true);
        this.setDefaultBox();
    }

    public doShoot() {
        this.play('shoot', true);
        this.setDefaultBox();
    }

    public doStab() {
        this.play('stab', true);
        this.setDefaultBox();
    }

    public doAttack() {
        this.setDefaultBox();
        this.play('attack', true);
    }
}
