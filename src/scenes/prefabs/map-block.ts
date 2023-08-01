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