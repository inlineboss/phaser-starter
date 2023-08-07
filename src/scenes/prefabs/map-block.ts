import { GameObjects, Scene } from "phaser";

type MapBlockStatus =  'idle' | 'damaged';

export class MapBlock extends GameObjects.Sprite {
    private status_: MapBlockStatus;

    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'map-block'),
        this.status_ = 'idle';
        this.scene.add.existing(this);
        this.setInteractive();
        this.scale = 5
    }

    get isStatus() {
        return this.status_;
    }

    damaged() { 
        this.status_ = 'damaged';
        this.setTexture('map-block-damaged');

    }
}

// const bals = this.objects.search({ minX: this.x, minY: this.y, maxX: this.x + 41, maxY: this.y })
// if (bals.length) {
//     bals.forEach((ball: any) => {
//         ball.sprite.destroy();
//         this.objects.impl().remove(ball)
//     })
// }


// this.once(Phaser.Animations.Events.ANIMATION_COMPLETE, ()=> {
//     console.log(Phaser.Animations.Events.ANIMATION_COMPLETE)
//     this.doIdle();
// })