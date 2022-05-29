/*
    Klasa OverworldEvent odpowiedzialna za zdarzenia w świecie poza bitwą

    * stand()
        Funkcja wywołująca zachowanie postaci - stania w miejscy
    
    * walk()
        Funkcja wywołująca zachowanie postaci - poruszania się

    * longWalk()
        Funkcja wywołująca zachowanie postaci - poruszania się

    * textMessage()
        Funkcja wywołująca wyświetlenie wiadomości

    * changeRoom()
        Funkcja wywołująca zmianę pomieszczenie

    * battle()
        Funkcja wywołująca rozpoczęcie walki

    * modifyPlayerFlag()
        Funkcja zmianiająca flage bohatera

    * pause()
        Funkcja wyświetlacją menu pauzy

    * gameOver()
        Funkcja wyświetlająca ekran śmierci

    * init()
        Funkcja inicjalizująca
*/
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

    longWalk(resolve) {
        const who = this.map.gameObjects[this.event.who];
        who.startBehavior({
            map: this.map
        }, {
            type: "longWalk",
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

    changeRoom(resolve) {
        const sceneTransition = new SceneTransition();
        sceneTransition.init(document.querySelector(".game-container"), () => {
            this.map.overworld.startMap(window.OverworldMap[this.event.map]);
            resolve();

            sceneTransition.fadeOut();
        });
        player.currentRoom += 1;
    }

    battle(resolve) {
        //Ustawienie wszystkich animacji na bitewne
        Object.keys(this.map.gameObjects).forEach(key => {
            this.map.gameObjects[key].isInBattle = true;
        });
        let EnemyInstance = Object.assign({}, EnemiesStats);

        const battle = new Battle({
            saveManagement: this.map.overworld.saveManagement,
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
            saveManagement: this.map.overworld.saveManagement,
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