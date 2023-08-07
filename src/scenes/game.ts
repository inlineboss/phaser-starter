import { Scene } from "phaser";
import { MapBlock } from "./prefabs/map-block";

export class GameScene extends Scene {


    constructor() {
        super('GameScene');
    }

    click(_: unknown, object: unknown) {
        if (object instanceof MapBlock) {
            object.damaged();
        }

    }

    create() {
        
    }



}