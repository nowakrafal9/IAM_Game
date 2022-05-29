/*
    Klasa Combatant odpowiedzialna za obsługę kombatantów walczących w bitwie

    * get hpPercent() 
        Getter zwracający procentową wartość punktów zdrowia
    
    * get xpPercent() 
        Getter zwracający procentową wartość punktów doświadczenia

    * get givesXp() 
        Getter zwracający ilość punktów doświadczenia uzyskaną za zabicie przeciwnika  

    * createElement()
        Funcja przygotująca pasek informacji o kombatancie

    * update()
        Funkcja aktualizująca pasek informacji o kombatancie

    * getStatusEevents()
        Funkcja zwracająca zdarzenia związane z aktywnymi statusami

    * statusTurnDecrement()
        Funkcja zmniejszająca ilość pozostałych tur działania statusu

    * init()
        Funckja inicjalizjąca kombatanta
*/
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

    get givesXp() {
        return this.killXp ? (this.killXp * this.level) : 0;
    }

    createElement() {
        this.hudElement = document.createElement("div");
        this.hudElement.classList.add("Combatant");
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

    getStatusEevents() {
        if (this.status?.type === "Regeneration") {
            return [
                { type: "textMessage", text: "I feel power!!!" },
                { type: "stateChange", recover: 5, onCaster: true }
            ]
        }

        if (this.status?.type === "Poison") {
            let damageDealt = (Math.floor(this.maxHp * 0.10));

            return [
                { type: "textMessage", text: "{CASTER} is poisoned!" },
                { type: "stateChange", statusDamage: damageDealt, onCaster: true },
                { type: "animation", animation: "death" }
            ];
        }

        if (this.status?.type === "Fire") {
            let damageDealt = 0.35;

            return [
                { type: "textMessage", text: "{CASTER} is on fire!" },
                { type: "stateChange", statusDamage: damageDealt, fireStatus: true, onCaster: true },
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