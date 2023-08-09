import { GameObjects, Physics, RIGHT, Scene } from "phaser";

enum Direction {
    Right,
    Left,
    Up,
    UpRight,
    UpLeft,
    Down,
    DownRight,
    DownLeft,
}
export class Player extends Phaser.Physics.Arcade.Sprite {

    private look: Direction = Direction.Right;
    private useSkill: boolean = false;
    private placeOn: 'ground' | 'wall' = 'ground';

    inputMove: any
    inputSkill: any

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        this.scene.add.existing(this);
        this.setName('Player')

        this.inputMove = this.scene.input.keyboard?.addKeys('D,W,A,S,I,SPACE')!;
        this.inputSkill = this.scene.input.keyboard?.addKeys('J,K,L,N')!;
    }

    create() {
        this.createAnimation();
    }

    private setDefaultBox() {
        this.setSize(22, 30);
    }
    public static preload(scene: Scene) {
        scene.load.spritesheet('player-idle', 'assets/players/idle.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-walk', 'assets/players/walk.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-jump', 'assets/players/jump.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-land', 'assets/players/land.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-wall-land', 'assets/players/wall-land.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-climb-back', 'assets/players/climb-back.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-climb-side', 'assets/players/climb-side.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-shoot', 'assets/players/shoot.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-punch', 'assets/players/punch.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-sword-stab', 'assets/players/stab.png', { frameWidth: 96, frameHeight: 64 });
        scene.load.spritesheet('player-sword-attack', 'assets/players/attack.png', { frameWidth: 64, frameHeight: 64 });
        scene.load.spritesheet('player-sword-run', 'assets/players/run.png', { frameWidth: 64, frameHeight: 64 });
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
            key: 'wall-land',
            frames: this.anims.generateFrameNumbers('player-wall-land', { start: 0, end: 5 }),
            frameRate: 5,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'climb-back',
            frames: this.anims.generateFrameNumbers('player-climb-back', { start: 0, end: 3 }),
            frameRate: 5,
            repeat: -1
        });
        this.scene.anims.create({
            key: 'climb-side',
            frames: this.anims.generateFrameNumbers('player-climb-side', { start: 0, end: 3 }),
            frameRate: 5,
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
                const bodies = this.scene.physics.overlapRect(this.x - w, this.y - 10, distance, 15);
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
            frameRate: 10,
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
            if (ani.key === 'attack' && frame.index > 3) {
                const distance = 30
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
                const distance = 400;

                let x: number = this.x;
                let y: number = this.y;
                let w: number = 0;
                let h: number = 0;

                switch (this.look) {
                    case Direction.Right:
                        x = x; y = y;
                        w = distance;
                        h = 3
                        break;
                    case Direction.Left:
                        x -= distance; y = y;
                        w = distance;
                        h = 3
                        break;
                    case Direction.Up:
                        x = x; y -= distance;
                        w = 3;
                        h = distance
                        break;
                    case Direction.Down:
                        x = x; y = y;
                        w = 3;
                        h = distance
                        break;
                    default:
                        break;
                }

                console.log(x, y, w, h);

                const bodies = this.scene.physics.overlapRect(x, y, w, h);
                bodies.forEach(x => {
                    if (x.gameObject.name !== 'Player') {
                        x.gameObject.destroy();
                        this.scene.cameras.main.flash();
                    }
                });
            }
        })

    }

    updateDirection(): boolean {

        if (this.inputMove.W.isDown && this.inputMove.D.isDown) {
            this.look = Direction.UpRight;
            return true;
        } else if (this.inputMove.W.isDown && this.inputMove.A.isDown) {
            this.look = Direction.UpLeft;
            return true;
        } else if (this.inputMove.W.isDown) {
            this.look = Direction.Up;
            return true;
        }

        if (this.inputMove.S.isDown && this.inputMove.D.isDown) {
            this.look = Direction.DownRight;
            return true;
        } else if (this.inputMove.S.isDown && this.inputMove.A.isDown) {
            this.look = Direction.DownLeft;
            return true;
        } else if (this.inputMove.S.isDown) {
            this.look = Direction.Down;
            return true;
        }

        if (this.inputMove.D.isDown) {
            this.look = Direction.Right;
            return true;
        }
        if (this.inputMove.A.isDown) {
            this.look = Direction.Left;
            return true;
        }

        return false;
    }

    updateFlip(): boolean {
        if (this.inputMove.D.isDown) {
            this.setFlipX(false);
            return true;
        }

        if (this.inputMove.A.isDown) {
            this.setFlipX(true);
            return true;
        }

        return false
    }

    updateWalkAnimationOnGround(): boolean {
        this.placeOn = "ground";
        if (this.inputMove.D.isDown) {
            this.play('run', true);
            return true;
        }

        if (this.inputMove.A.isDown) {
            this.play('run', true);
            return true;
        }

        if (
            this.body!.deltaY() > 0 &&
            this.body!.deltaY() < 1
        ) {
            this.play('idle', true);
            return true;
        }

        if (
            this.body!.deltaY() < 0 ||
            this.body!.deltaY() > 1
        ) {
            this.play('jump');
            return true;
        }

        return false;
    }

    updateWalkAnimationOnWall(): boolean {
        this.placeOn = "wall";
        if (this.inputMove.W.isDown) {
            this.play('climb-back', true);
            return true;
        }

        if (this.inputMove.S.isDown) {
            this.play('climb-back', true);
            return true;
        }

        if (this.body?.touching.right || this.body?.touching.left) {
            this.play('climb-side', true);
            return true;
        }

        this.play('wall-land');
        return false;
    }

    updateSkillAnimation() {
        if (this.inputSkill.J.isDown) {
            this.play('punch', true);
            this.useSkill = true
            return;
        }

        if (this.inputSkill.K.isDown) {
            this.play('attack', true);
            this.useSkill = true
            return;
        }

        if (this.inputSkill.N.isDown) {
            this.play('shoot', true);
            this.useSkill = true
            return;
        }

        this.useSkill = false
    }

    updateAnimation() {

        this.updateSkillAnimation();

        if (!this.useSkill) {
            if (this.inputMove.I.isDown) {
                this.updateWalkAnimationOnWall();
            } else {
                this.updateWalkAnimationOnGround();
            }
        }
    }

    updateVelocityOnGround() {
        console.log('velocity');

        if (this.inputMove.D.isDown) {
            this.setVelocityX(this.useSkill ? 50 : 200);
        }

        if (this.inputMove.A.isDown) {
            this.setVelocityX(this.useSkill ? -50 : -200);
        }

        if (
            this.inputMove.SPACE.isDown &&
            this.body!.deltaY() > 0 &&
            this.body!.deltaY() < 1
        ) {
            this.setVelocityY(this.useSkill ? -50 : -170);
        }
    }

    updateVelocityOnWall() {
        let nothing = true;
        if (this.inputMove.D.isDown) {
            this.setVelocityX(50);
            nothing = false;
        } else if (this.inputMove.A.isDown) {
            this.setVelocityX(-50);
            nothing = false;
        }

        if (this.inputMove.W.isDown) {
            this.setVelocityY(-50);
            nothing = false;
        } else if (this.inputMove.S.isDown) {
            this.setVelocityY(50);
            nothing = false;
        }
        if (nothing) {
            this.setVelocityY(3);
        }
    }

    updateVelocity() {
        if (this.inputMove.I.isDown) {
            this.updateVelocityOnWall()
        } else {
            this.updateVelocityOnGround()
        }
    }

    public update() {
        this.setDefaultBox();
        this.setVelocityX(0);
        this.updateDirection();
        this.updateAnimation();
        this.updateFlip();
        this.updateVelocity();
    }
}
