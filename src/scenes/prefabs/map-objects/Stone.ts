import { GameObjects, Scene } from "phaser";

export class Stone extends GameObjects.Sprite {
    constructor(scene: Scene, x: number, y: number) {
        super(scene, x, y, 'map-block'),
        this.scene.add.existing(this);
        this.setInteractive();
        this.scale = 5
    }

    damaged() { 
        this.setTexture('map-block-damaged');
    }
}