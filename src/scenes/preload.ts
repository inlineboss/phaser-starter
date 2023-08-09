import { Scene, Tilemaps } from "phaser";
import { Player } from "./prefabs/player/player";

export class PreloadScene extends Scene {
    private player!: Player;
    private map!: Tilemaps.Tilemap
    private balls!: Phaser.GameObjects.Sprite[];
    private background!: Tilemaps.TilemapLayer;
    private border!: Tilemaps.TilemapLayer;
    constructor() {
        super('PreloadScene');
    }

    preload() {
        this.initMap();
        Player.preload(this);

    }

    initMap() {
        this.load.image('tiles', 'assets/map/DarkCastle.png');
        this.load.tilemapTiledJSON('map', 'assets/map/map.json');
        this.load.spritesheet('tiles-object', 'assets/map/DarkCastle.png', {
            frameWidth: 16,
            frameHeight: 16
        });

    }

    create() {
        this.createMap();
        this.createPlayer();
        this.createBalls();
        this.createStone();

        this.cameras.main.startFollow(this.player, true);
        this.cameras.main.setZoom(2);
    }

    createMap() {
        this.map = this.make.tilemap({ key: 'map' })
        const tileset = this.map.addTilesetImage('tileset', 'tiles')!
        this.background = this.map.createLayer('background', tileset, 0, 0)!;
        this.border = this.map.createLayer('border', tileset, 0, 0)!;
        this.physics.world.setBounds(0, 0, this.border.width, this.border.height)
        this.border.setCollisionBetween(1, 1);
    }

    createPlayer() {
        this.player = new Player(this, 100, 600);
        this.physics.add.existing(this.player);
        this.physics.add.collider(this.player, this.border)
        this.player.create();
    }

    createBalls() {
        const balls = this.map.filterObjects('Balls', obj => obj.name === 'ball');

        this.balls = balls!.map(ball => {
            let sprite = this.physics.add.sprite(
                ball.x as number,
                ball.y as number,
                'tiles-object', 9
            );
            sprite.setScale(1.5).setVisible(true).body.setAllowGravity(false);

            return sprite;
        })

        this.balls.forEach(ball => {
            this.physics.add.overlap(this.player, ball, (obj1, obj2) => {
                obj2.destroy();
            });
        });
    }

    createStone() {

        let stones:Phaser.Types.Physics.Arcade.SpriteWithDynamicBody[] = [];
        for (let x = 0; x < this.border.width; x+=48) {
            for (let y = 0; y < this.border.height; y+=48) {

                let sprite = this.physics.add.sprite(
                    x,
                    y,
                    'tiles-object', 9
                );
                sprite.body.setAllowGravity(false)
                sprite.setScale(3)
                // sprite.setMaxVelocity(0)
                sprite.setImmovable(true);

                // sprite.body.setAcceleration(10, 20)

                stones.push(sprite);
            }
        }

        this.physics.add.collider(this.player, stones);


        // this.background.filterTiles((obj:any) => {

        //     // console.log(obj, obj.x as number, obj.y as number)
        //     let sprite = this.physics.add.sprite(
        //         obj.x as number,
        //         obj.y as number,
        //         'tiles-object', 9
        //     );
        //     sprite.setVisible(true).body.setAllowGravity(false);
            // this.physics.add.overlap(this.player, stones, (obj1, obj2) => {
            //     obj2.destroy();
            //   });
        // })

    }

    update() {
        this.player.update();
    }
}