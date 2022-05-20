const generateCharacters = {
    generateHero() {
        return new Person({
            src: "./Assets/characters/Adventurer.png",
            objectType: "Player",
            x: -60, y: 111,
            sizeX: 50, sizeY: 37,
        })
    },

    generateEnemy(enemyType = null) {
        let randomEnemy = null;
        if (enemyType === null) {
            randomEnemy = Math.floor(Math.random() * 2);
        }

        if (randomEnemy == 0 || enemyType === "Slime") {
            return {
                enemy: new EnemySlime({
                    src: "./Assets/characters/Slime.png",
                    objectType: "Slime",
                    x: 360, y: 123,
                    sizeX: 32, sizeY: 25,
                })
            }
        }
        if (randomEnemy == 1 || enemyType === "SlimeBoss") {
            return {
                enemy: new EnemySlime({
                    src: "./Assets/characters/SlimeBoss.png",
                    objectType: "SlimeBoss",
                    x: 360, y: 123,
                    sizeX: 32, sizeY: 25,
                })
            }
        }
    }
}

const generateEvents = {
    generateBattle(who) {
        let events = [
            { who: "enemy", type: "long_walk", direction: "left" },
            { type: "textMessage", text: "A wild enemy appears!!!" },
            { who: "enemy", type: "long_walk", direction: "left" },
            { who: "enemy", type: "long_walk", direction: "left" },
            { type: "battle", enemyId: who.objectType },
        ];

        return events;
    }
}