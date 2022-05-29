/*
    Klasa Battle odpowiedzialna za system bitw.

    * addCombatant()
        Funkcja dodania kombatanta do bitwy. Wewnątrz funkcji następuje przypisanie
        obiektów reprezentujących kombatantów to tablicy combatants

    * createElement()
        Funcja przygotująca ekran bitwy

    * init()
        Funckja inicjalizjąca bitwe
*/
class Battle {
    constructor(config) {
        this.map = config.map;
        this.mapObjects = this.map.gameObjects;
        this.enemy = config.enemy;
        this.onComplete = config.onComplete;
        this.saveManagement = config.saveManagement;

        this.combatants = {};
        this.items = [];

        this.activeCombatants = {
            player: null,
            enemy: null,
        }

        this.playerInstance = window.player.playerInstance["hero"];
        this.enemyInstance = this.enemy.enemyInstance;

        this.enemyInstance = this.mapObjects["enemy"].scaleEnemy({
            enemyInstance: Object.assign({}, this.enemyInstance),
            heroLevel: this.playerInstance.level
        });

        this.addCombatant("hero", "player", this.playerInstance);
        this.addCombatant(this.enemy.name, "enemy", this.enemyInstance);

        //Dodanie do bitwy przedmiotów gracza
        window.player.items.forEach(item => {
            this.items.push({
                ...item,
                team: "player"
            })
        })

        //Tablica przedmiotów użytych podczas bitwy
        this.usedInstanceIds = {};

        //Ukrycie elementów interfejsu globalnego
        this.hudElement = document.getElementById("Hud");
        this.hudElement.classList.add("HideHud");
    }

    addCombatant(id, team, config) {
        if (team === "enemy") {
            this.combatants[id] = new Combatant({
                ...Enemies[config.id],
                ...config,
                team,
                objectRef: this.mapObjects["enemy"]
            }, this)
        } else {
            this.combatants[id] = new Combatant({
                ...Players[config.id],
                ...config,
                team,
                objectRef: this.mapObjects["hero"]
            }, this)
        }

        this.activeCombatants[team] = this.activeCombatants[team] || id;
    }

    createElement() {
        //Stworzenie elementu div oraz dodanie do niego klasy Battle
        this.element = document.createElement("div");
        this.element.classList.add("Battle");
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);

        //Inicjalizacja wszystkich kombatantów
        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element);
        })

        //Utworzenie nowego obiektu TurnCycle zarządzającego akcjami podczas tury
        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: event => {
                return new Promise(resolve => {
                    const battleEvent = new BattleEvent(event, this);
                    battleEvent.init(resolve);
                })
            },
            onWinner: winner => {
                //Akcje wykonane kiedy któraś ze stron jest zwycięzcą    

                //Zmiana flagi bohatera w celu uniknięcia ponowienia bitwy w pokoju
                player.flags["START_BATTLE"] = false;

                //Zmiana animacji postaci na te spoza walki
                Object.keys(this.combatants).forEach(key => {
                    let combatant = this.combatants[key];
                    combatant.objectRef.isInBattle = false;
                })

                const playerState = window.player;
                const combatant = this.combatants["hero"];

                //Zarządzenie zapisem po walce
                //w przypadku przegranej: zapis jest usuwany
                //w przypadku wygranej: nadpisanie go
                if (winner === "enemy") {
                    this.saveManagement.deleteSave();
                    this.map.startCutscene([
                        { type: "gameOver" }
                    ])
                } else {
                    this.saveManagement.save(this.map);
                }

                //Zapisanie statystyk bohatera po walce w globalnym stanie bohatera
                playerState.playerInstance.hero.hp = combatant.hp;
                playerState.playerInstance.hero.maxHp = combatant.maxHp;
                playerState.playerInstance.hero.xp = combatant.xp;
                playerState.playerInstance.hero.maxXp = combatant.maxXp;
                playerState.playerInstance.hero.level = combatant.level;

                //Usunięcie użytych przedmiotów z globalnego stanu bohatera
                playerState.items = playerState.items.filter(item => {
                    return !this.usedInstanceIds[item.instanceId]
                });

                //Ogłoszenie zdarzenia aktualizacji stanu gracza
                utils.emitEvent("PlayerStateUpdated");

                //Ponowne pojawienie się elementów interfejsu globalnego
                this.hudElement.classList.remove("HideHud");

                this.element.remove();
                this.onComplete();
            }
        })

        this.turnCycle.init();
    }
}