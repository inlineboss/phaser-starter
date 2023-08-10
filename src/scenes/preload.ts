import { Scene, Tilemaps } from "phaser";
import { Player } from "./prefabs/player/player";

export class PreloadScene extends Scene {
    private player!: Player;
    private map!: Tilemaps.Tilemap
    private balls!: Phaser.GameObjects.Sprite[];
    private background!: Tilemaps.TilemapLayer;
    private border!: Tilemaps.TilemapLayer;
    private light!: Phaser.GameObjects.Light;
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.initMap();
        Player.preload(this);
    }

    initMap() {
        this.load.image('background', 'assets/map/DarkMetal.png');
        this.load.image('border', 'assets/map/Stone.png');
        this.load.image('terra', 'assets/map/Stone.png');
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');
    }

    create() {
        this.createMap();
        this.createPlayer();

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setZoom(2);
    }

    createMap() {
        this.map = this.make.tilemap({ key: 'map' })
        this.background =
            this.map.createLayer('background',
                this.map.addTilesetImage('background', 'background')!
            )!;

        this.border =
            this.map.createLayer('border',
                this.map.addTilesetImage('stone', 'border')!
            )!;

        this.physics.world.setBounds(0, 0, this.map.width, this.map.height)
        this.border.setCollisionBetween(1, 1);
    }

    createPlayer() {
        this.player = new Player(this, 43, 2513);
        this.physics.add.existing(this.player);
        this.physics.add.collider(this.player, this.border)
        this.player.create();

        console.log(this.lights.getMaxVisibleLights());
        this.light = this.lights.addLight(this.player.x, this.player.y, 43, 0xffffff);
    }

    createStone() {

        let stones: Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
        for (let x = 0; x < this.map.width * 32; x += 32) {
            for (let y = 0; y < this.map.height * 32; y += 32) {

                let sprite = this.physics.add.sprite(
                    x, y,
                    'terra'
                );
                sprite.body.setAllowGravity(false)
                sprite.setOrigin(0,0)
                sprite.setImmovable(true);

                stones.push(sprite);
            }
        }

        this.physics.add.collider(this.player, stones);
    }

    private postLoad = false;
    update() {
        if (!this.postLoad) {
            this.createStone()
            this.postLoad = true
        }

        this.player.update();
        this.light.setPosition(this.player.x, this.player.y)
    }
}