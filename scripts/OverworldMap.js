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
                objectType: "Player",
                x: 0, y: 110,
                sizeX: 50, sizeY: 37
            }),
        },
    }
}