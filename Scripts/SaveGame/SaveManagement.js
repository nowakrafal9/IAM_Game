/*
    Klasa SaveManagement odpowiedzialna za zarządzanie systemem zapisu postępu gry

    * save()
        Funkcja zapisu gry. Wykorzystuje localStorage przeglądarki do przechowania zapisu

    * deleteSave()
        Funkcja usunięcia zapisu

    * getSaveFile()
        Funkcja znajdująca zapis w localStorage

    * load()
        Funkcja wczytująca zapis
*/
class SaveManagement {
    constructor() {
        this.cutsceneSpaces = null;
        this.enemyInfo = null;
        this.enemyPos = null;
        this.enemyIsDead = null;
        this.heroPos = null;

        this.saveFileKey = "DungeonDweller_SaveFile1"
    }

    save(config) {
        window.localStorage.setItem(this.saveFileKey, JSON.stringify({
            cutsceneSpaces: config.cutsceneSpaces,

            enemyInfo: [config.gameObjects.enemy.id, config.gameObjects.enemy.objectType],
            enemyPos: [config.gameObjects.enemy.x, config.gameObjects.enemy.y],
            enemyIsDead: config.gameObjects.enemy.isDead,

            heroPos: [config.gameObjects.hero.x, config.gameObjects.hero.y],
            player: {
                playerInstance: player.playerInstance,
                items: player.items,
                flags: player.flags,
                currentRoom: player.currentRoom
            }
        }))
    }

    deleteSave() {
        window.localStorage.removeItem(this.saveFileKey);
    }

    getSaveFile() {
        const file = window.localStorage.getItem(this.saveFileKey);
        return file ? JSON.parse(file) : null;
    }

    load() {
        const file = this.getSaveFile();
        if (file) {
            this.cutsceneSpaces = file.cutsceneSpaces;
            this.enemyInfo = file.enemyInfo;
            this.enemyPos = file.enemyPos;
            this.enemyIsDead = file.enemyIsDead;
            this.heroPos = file.heroPos;

            Object.keys(file.player).forEach(key => {
                player[key] = file.player[key];
            })
        }
    }
}