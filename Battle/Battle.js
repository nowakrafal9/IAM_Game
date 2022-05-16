class Battle {
    constructor() {
        this.combatants = {
            "player1": new Combatant({
                ...Players.p001,
                team: "player",
                hp: 50,
                maxHp: 50,
                xp: 10,
                maxXp: 100,
                level: 1,
                status: null,
            }, this),
            "enemy1": new Combatant({
                ...Enemies.s001,
                team: "enemy",
                hp: 50,
                maxHp: 50,
                xp: 30,
                maxXp: 100,
                level: 1,
                status: null,
            }, this),
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
    }
}