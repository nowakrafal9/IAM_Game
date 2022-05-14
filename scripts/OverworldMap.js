class OverworldMap {
    constructor(config) {
        this.gameObjects = config.gameObjects;

        this.image = new Image();
        this.image.src = config.src;
    }

    drawImage(ctx) {
        ctx.drawImage(this.image, 0, 0)
    }
}

window.OverworldMap = {
    TestRoom: {
        src: "./assets/maps/test.png",
        gameObjects: {
            hero: new Person({
                src: "./assets/characters/adventurer.png",
                isPlayer: true,
                x: 0, y: 110
            }),
            enemy1: new EnemySlime({
                src: "./assets/enemies/slime.png",
                isEnemy: true,
                x: 300, y: 123
            }),
        }
    }
}