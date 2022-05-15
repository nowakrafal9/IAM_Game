class OverworldMap {
    constructor(config) {
        this.overworld = null;
        this.gameObjects = config.gameObjects;
        this.cutsceneSpaces = config.cutsceneSpaces || {};

        this.image = new Image();
        this.image.src = config.src;

        this.isCutscenePlaying = false;
    }

    drawImage(ctx) {
        ctx.drawImage(this.image, 0, 0)
    }

    mountObjects() {
        Object.keys(this.gameObjects).forEach(key => {
            let object = this.gameObjects[key];
            object.id = key;

            object.mount(this);
        })
    }

    async startCutscene(events) {
        this.isCutscenePlaying = true;

        for (let i = 0; i < events.length; i++) {
            const eventHandler = new OverworldEvent({
                event: events[i],
                map: this,
            })
            await eventHandler.init();
        }

        this.isCutscenePlaying = false;
    }

    checkForFootstepCutscene() {
        const hero = this.gameObjects["hero"];
        const match = this.cutsceneSpaces[`${hero.x}, ${hero.y}`];

        if (!this.isCutscenePlaying && match) {
            this.startCutscene(match[0].events);
        }
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
                sizeX: 50, sizeY: 37,
            }),
            npc1: new Person({
                src: "./assets/characters/adventurer.png",
                objectType: "HumanNPC",
                x: 70, y: 110,
                sizeX: 50, sizeY: 37,
            }),
        },
        cutsceneSpaces: {
            "150, 110": [
                {
                    events: [
                        { type: "textMessage", text: "Event started" }
                    ]
                }
            ],
            "340, 110": [
                {
                    events: [
                        { type: "changeMap", map: "Room2" }
                    ]
                }
            ]
        }
    },
    Room2: {
        src: "./assets/maps/test.png",
        gameObjects: {
            hero: new Person({
                src: "./assets/characters/adventurer.png",
                objectType: "Player",
                x: -40, y: 110,
                sizeX: 50, sizeY: 37,
            }),
            npc1: new Person({
                src: "./assets/characters/adventurer.png",
                objectType: "HumanNPC",
                x: 220, y: 110,
                sizeX: 50, sizeY: 37,
            }),
        },
    }
}