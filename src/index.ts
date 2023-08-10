import { Game, Types } from "phaser";
import { PreloadScene } from "./scenes/preload";
import { GameScene } from "./scenes/game";




const config : Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1280,
    height: 720,
    backgroundColor: '#6e6666',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            // debug: true
        }
    },
    scene: [
        PreloadScene
    ]
}

let game = new Game(config);






