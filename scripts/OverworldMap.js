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
            const relevantEvent = match[0];

            let startEvent = (relevantEvent.required || []).every(flag => {
                return player.flags[flag] || false;
            })

            startEvent && this.startCutscene(relevantEvent.events);
        }
    }
}

window.OverworldMap = {
    TestRoom: {
        src: "./assets/maps/test.png",
        gameObjects: {},
        cutsceneSpaces: {
            "120, 111": [
                {
                    required: ["START_BATTLE"],
                    events: []
                }
            ],
            "340, 111": [
                {
                    events: [
                        { type: "modifyPlayerFlag", flag: "START_BATTLE", flagValue: true },
                        { type: "changeMap", map: "Room2" },
                    ]
                }
            ]
        }
    },
    Room2: {
        src: "./assets/maps/test.png",
        gameObjects: {},
        cutsceneSpaces: {
            "120, 111": [
                {
                    required: ["START_BATTLE"],
                    events: []
                }
            ],
            "340, 111": [
                {
                    events: [
                        { type: "modifyPlayerFlag", flag: "START_BATTLE", flagValue: true },
                        { type: "changeMap", map: "TestRoom" },
                    ]
                }
            ]
        }
    },
}