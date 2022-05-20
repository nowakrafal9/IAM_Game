class OverworldEvent {
    constructor({ map, event }) {
        this.map = map;
        this.event = event;
    }

    stand(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: "stand",
            direction: this.event.direction,
            time: this.event.time
        })

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("StandComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("StandComplete", completeHandler)
    }

    walk(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: "walk",
            direction: this.event.direction,
        })

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("WalkingComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("WalkingComplete", completeHandler)
    }

    long_walk(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: "long_walk",
            direction: this.event.direction,
        })

        const completeHandler = e => {
            if (e.detail.whoId === this.event.who) {
                document.removeEventListener("WalkingComplete", completeHandler);
                resolve();
            }
        }
        document.addEventListener("WalkingComplete", completeHandler)
    }

    textMessage(resolve) {
        const message = new TextMessage({
            text: this.event.text,
            onComplete: () => resolve()
        })
        message.init(document.querySelector(".game-container"))
    }

    changeMap(resolve) {
        const sceneTransition = new SceneTransition();
        sceneTransition.init(document.querySelector(".game-container"), () => {
            this.map.overworld.startMap(window.OverworldMap[this.event.map]);
            resolve();

            sceneTransition.fadeOut();
        });
        player.currentRoom += 1;
    }

    battle(resolve) {
        //Setting animation type to battle one
        Object.keys(this.map.gameObjects).forEach(key => {
            this.map.gameObjects[key].isInBattle = true;
        });
        let EnemyInstance = Object.assign({}, EnemiesStats);

        const battle = new Battle({
            progress: this.map.overworld.progress,
            enemy: EnemyInstance[this.event.enemyId],
            map: this.map,
            onComplete: () => {
                resolve();
            }
        })

        battle.init(document.querySelector(".game-container"));
    }

    modifyPlayerFlag(resolve) {
        window.player.flags[this.event.flag] = this.event.flagValue;
        resolve();
    }

    pause(resolve) {
        const menu = new PauseMenu({
            map: this.map,
            progress: this.map.overworld.progress,
            onComplete: () => {
                resolve();
            }
        })
        menu.init(document.querySelector(".game-container"));
    }

    gameOver(resolve) {
        const gameOver = new GameOverMenu({
            map: this.map,
            onComplete: () => {
                resolve();
            }
        })
        gameOver.init(document.querySelector(".game-container"));
    }

    init() {
        return new Promise(resolve => {
            this[this.event.type](resolve)
        })
    }
}