class Combatant {
    constructor(config, battle) {
        Object.keys(config).forEach(key => {
            this[key] = config[key];
        })
        this.hp = typeof (this.hp) === "undefined" ? this.maxHp : this.hp;
        this.battle = battle;
    }

    get hpPercent() {
        const percent = this.hp / this.maxHp * 100;
        return percent > 0 ? percent : 0
    }

    get xpPercent() {
        return this.xp / this.maxXp * 100;
    }

    get isActive() {
        return this.battle?.activeCombatants[this.team] === this.id;
    }

    get givesXp() {
        return this.killXp ? (this.killXp * this.level * 10) : 0;
    }

    createElement() {
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("Combatant");
        this.hudElement.setAttribute("data-combatant", this.id);
        this.hudElement.setAttribute("data-team", this.team);

        this.hudElement.innerHTML = (`
            <p class="Combatant_name">${this.name}</p>
            <p class="Combatant_level"></p>
            <img class="Combatant_type" src="${this.icon}" alt="${this.type}" />
            <svg viewBox="0 0 26 3" class="Combatant_life-container">
                <rect x=0 y=0 width="0%" height=1 fill="#82ff71" />
                <rect x=0 y=1 width="0%" height=2 fill="#3ef126" />
            </svg>
            <svg viewBox="0 0 26 2" class="Combatant_xp-container">
                <rect x=0 y=0 width="0%" height=1 fill="#ffd76a" />
                <rect x=0 y=1 width="0%" height=1 fill="#ffc934" />
            </svg>
            <p class="Combatant_status"></p>
        `);

        this.hpFills = this.hudElement.querySelectorAll(".Combatant_life-container > rect");
        this.xpFills = this.hudElement.querySelectorAll(".Combatant_xp-container > rect");
    }

    update(changes = {}) {
        Object.keys(changes).forEach(key => {
            this[key] = changes[key]
        });

        this.hpFills.forEach(rect => rect.style.width = `${this.hpPercent}%`);
        this.xpFills.forEach(rect => rect.style.width = `${this.xpPercent}%`);

        this.hudElement.querySelector(".Combatant_level").innerText = this.level;

        const statusElement = this.hudElement.querySelector(".Combatant_status");
        if (this.status) {
            statusElement.innerText = this.status.type;
            statusElement.style.display = "block";
        } else {
            statusElement.innerText = "";
            statusElement.style.display = "none";
        }
    }

    // getReplacedEvents(originalEvents) {
    //     if (this.status?.type === "stun" && utils.randomFromArray([true, false, false])) {
    //         return [
    //             { type: "textMessage", text: `${this.name} missess!` }
    //         ]
    //     }

    //     return originalEvents;
    // }

    getPostEevents() {
        if (this.status?.type === "regeneration") {
            return [
                { type: "textMessage", text: "I feel power!!!" },
                { type: "stateChange", recover: 5, onCaster: true }
            ]
        }

        if (this.status?.type === "poison") {
            let damageDealt = (Math.floor(this.maxHp * 0.16));

            return [
                { type: "textMessage", text: "{CASTER} is poisoned!" },
                { type: "stateChange", statusDamage: damageDealt, onCaster: true },
                { type: "animation", animation: "death" }
            ];
        }
        return [];
    }

    statusTurnDecrement() {
        if (this.status?.expiresIn > 0) {
            this.status.expiresIn -= 1;
            if (this.status.expiresIn === 0) {
                let statusName = this.status.type;

                this.update({
                    status: null
                })
                return {
                    type: "textMessage",
                    text: statusName + " expired!"
                }
            }
        }

        return null;
    }

    init(container) {
        this.createElement();
        container.appendChild(this.hudElement);
        this.update();
    }
}