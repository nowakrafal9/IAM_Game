/*
    Klasa OverworldMap odpowiedzialna za mapę gry

    * drawImage()
        Funkcja odpowiedzialna za rysowanie tła

    * mountObjects()
        Funkcja odpowiedzialna przypisanie id do obiektów znajdujących się na mapie

    * startCutscene()
        Asynchroniczna funkcja odpowiedzialna za uruchomienie przerywnika filmowego

    * checkForCutscene()
        Funkcja sprawdzająca czy w danym miejscu ma zostać wywołane zdarzenie
*/
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

    checkForCutscene() {
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

//Wygląd pokoju wraz z ustawionymi początkowymi zdarzeniami 
window.OverworldMap = {
    Room: {
        src: "./Assets/maps/Room.png",
        gameObjects: {},
        cutsceneSpaces: {
            "-10, 111": [
                {
                    events: [
                        { type: "textMessage", text: "There's no point in turning back" },
                        { who: "hero", type: "longWalk", direction: "right" },
                    ]
                }
            ],
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
                        { type: "changeRoom", map: "Room" },
                    ]
                }
            ]
        }
    },
}