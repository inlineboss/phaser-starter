import { Scene, Tilemaps } from "phaser";
import { Player } from "./prefabs/player/player";

export class PreloadScene extends Scene {
    private map!: Tilemaps.Tilemap;
    private tileset!: Tilemaps.Tileset;
    private player!: Player;
    private keyboard!: Phaser.Types.Input.Keyboard.CursorKeys;
    private animp!: Phaser.GameObjects.Sprite;


    constructor() {
        super('PreloadScene');
    }
    preload() {
        this.initMap();
    }

    initMap() {
        this.load.image( 'tiles', 'assets/map/DarkCastle.png');
        this.load.tilemapTiledJSON('map', 'assets/map/map.json')
        this.load.spritesheet('player-idle', 'assets/players/PlayerSwordIdle/PlayerSwordIdle48x48.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('player-walk', 'assets/players/PlayerWalk/PlayerWalk48x48.png', { frameWidth: 48, frameHeight: 48 });
        this.load.spritesheet('player-walk', 'assets/players/PlayerWalk/PlayerWalk48x48.png', { frameWidth: 48, frameHeight: 48 });
        
        
    }

    create() {
        const map = this.make.tilemap({ key: 'map' })
        const tileset = map.addTilesetImage('tileset', 'tiles')!

        const background = map.createLayer('background', tileset, 0, 0)!;
        const border = map.createLayer('border', tileset, 0, 0)!;

        this.physics.world.setBounds(0, 0, border.width, border.height)
        this.player = new Player(this, 100, 300);
        // this.player.doIdle();
        
        this.physics.add.existing(this.player);
        this.physics.add.collider(this.player, border)
        border.setCollisionBetween(1,1)
        this.keyboard = this.input.keyboard?.createCursorKeys()!;
    }

    update() {


        this.player.update();
        // this.player.doIdle();

        // if (this.keyboard.left.isDown) {
        //     this.player.doLeft();
        // }

        // if (this.keyboard.right.isDown) {
        //     this.player.doRight(); 
        //     console.log('Right')
        // }

        // if (this.keyboard.up.isDown) {
        //     this.player.doUp();
        // }

        // if (this.keyboard.down.isDown) {
        //     this.player.doDown();
        // }
    }
}