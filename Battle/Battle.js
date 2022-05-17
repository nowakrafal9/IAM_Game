class Battle {
    constructor(config) {
        this.mapObjects = config.mapObjects;

        this.combatants = {
            "hero": new Combatant({
                ...Players.p001,
                objectRef: config.mapObjects["hero"],
                team: "player",
                hp: 50,
                maxHp: 50,
                xp: 10,
                maxXp: 100,
                level: 1,
                status: null,
            }, this),
            "npc1": new Combatant({
                ...Enemies.s001,
                objectRef: config.mapObjects["npc1"],
                team: "enemy",
                hp: 50,
                maxHp: 50,
                xp: 30,
                maxXp: 100,
                level: 1,
                status: null,
            }, this),
        }

        this.activeCombatants = {
            player: "hero",
            enemy: "npc1",
        }
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Battle");
        // this.element.innerHTML = (` 
        //     <div class = "Battle_hero">
        //         <img src = "${'/assets/characters/adventurer.png'}" alt = "Hero" />
        //     </div>

        //     <div class = "Battle_enemy">
        //         <img src = "${'/assets/characters/slime.png'}" alt = "Enemy" />
        //     </div>
        // `)
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
            }
        })

        this.turnCycle.init();
    }
}