import { GameObjects, Physics, Scene } from "phaser";

export type PlayerDirection = 'undefined' | 'idle' | 'left' | 'right' | 'up' | 'down';

export class Player extends Phaser.Physics.Arcade.Sprite {
    private keyW: Phaser.Input.Keyboard.Key;
    private keyA: Phaser.Input.Keyboard.Key;
    private keyS: Phaser.Input.Keyboard.Key;
    private keyD: Phaser.Input.Keyboard.Key;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'player');
        this.scene.add.existing(this);
        this.create();
        this.state = 'undefined';

        // KEYS
        this.keyD = this.scene.input.keyboard?.addKey('D')!;
        this.keyW = this.scene.input.keyboard?.addKey('W')!;
        this.keyA = this.scene.input.keyboard?.addKey('A')!;
        this.keyS = this.scene.input.keyboard?.addKey('S')!;
    }


    public state: PlayerDirection;

    protected getBody(): Physics.Arcade.Body {
        return this.body as Physics.Arcade.Body;
    }

    create() {
        this.createAnimation();
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
    }

    public update() {

        if(this.body!.deltaY() > 0 ){ 

        }

        this.setVelocityX(0);

        let isIdle = true;

        if (this.keyD?.isDown) {
            this.doRight();
            isIdle = false
        }

        if (this.keyW?.isDown) {
            this.doUp();
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

        console.log(isIdle)
        if (isIdle== true) {
           this.doIdle(); 
        }

    }

    private flip() {
        if (this.body!.velocity.x < 0) {
            this.scaleX = -1;
        } else {
            this.scaleX = 1;
        }
    }

    private idleTimer?: NodeJS.Timeout
    public doIdle() {
        this.play('idle', true);
        this.state = 'idle';
    }

    public doLeft() {
        console.log('Left')
        this.setVelocityX(-400);
        this.body!.setOffset(35, 15);
        this.flip();
        this.play('walk', true);

    }

    public doRight() {
        this.setVelocityX(400);
        console.log('Right')
        this.flip();
        this.play('walk', true);
        this.body!.setOffset(5, 15);
    }

    public doUp() {
        console.log('Up')
        this.play('walk');
        this.setVelocityY(-100);
    }

    public doDown() {
        console.log('Down')
        this.setVelocityY(100);
        this.play('idle');
    }
}
