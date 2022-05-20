class Battle {
    constructor(config) {
        this.map = config.map;
        this.mapObjects = this.map.gameObjects;
        this.enemy = config.enemy;
        this.onComplete = config.onComplete;
        this.progress = config.progress;

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

        //Add player items
        window.player.items.forEach(item => {
            this.items.push({
                ...item,
                team: "player"
            })
        })

        this.usedInstanceIds = {};

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
        this.element = document.createElement("div");
        this.element.classList.add("Battle");
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);

        Object.keys(this.combatants).forEach(key => {
            let combatant = this.combatants[key];
            combatant.id = key;
            combatant.init(this.element);
        })

        this.turnCycle = new TurnCycle({
            battle: this,
            onNewEvent: event => {
                return new Promise(resolve => {
                    const battleEvent = new BattleEvent(event, this);
                    battleEvent.init(resolve);
                })
            },
            onWinner: winner => {
                player.flags["START_BATTLE"] = false;

                Object.keys(this.combatants).forEach(key => {
                    let combatant = this.combatants[key];
                    combatant.objectRef.isInBattle = false;
                })

                const playerState = window.player;
                const combatant = this.combatants["hero"];

                //Manage save files after battle
                if (winner === "enemy") {
                    //Show title screen if dead
                    // this.map.overworld.init();
                    this.progress.deleteSave();
                    this.map.startCutscene([
                        { type: "gameOver" }
                    ])
                } else {
                    this.progress.save(this.map);
                }

                playerState.playerInstance.hero.hp = combatant.hp;
                playerState.playerInstance.hero.maxHp = combatant.maxHp;
                playerState.playerInstance.hero.xp = combatant.xp;
                playerState.playerInstance.hero.maxXp = combatant.maxXp;
                playerState.playerInstance.hero.level = combatant.level;

                //Remove used items from player state
                playerState.items = playerState.items.filter(item => {
                    return !this.usedInstanceIds[item.instanceId]
                });

                utils.emitEvent("PlayerStateUpdated");

                this.hudElement.classList.remove("HideHud");

                this.element.remove();
                this.onComplete();
            }
        })

        this.turnCycle.init();
    }
}