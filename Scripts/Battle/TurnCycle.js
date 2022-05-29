/*
    Klasa TurnCycle odpowiedzialna za obsługę cyklu tur walki

    * turn() 
        Asynchroniczna funkcja tury

    * getXpFromEnemy()
        Asynchroniczna funckja pobrania punktów doświadczenia po wygranej bitwie

    * getWinningSide()
        Funckja sprawdzająca czy któraś z postaci ilość puktów życia
        mniejszą lub równą 0

    * init()
        Funckja inicjalizjąca ture
*/
class TurnCycle {
    constructor({ battle, onNewEvent, onWinner }) {
        this.battle = battle;
        this.onNewEvent = onNewEvent;
        this.onWinner = onWinner;

        this.currentTeam = "player";
    }

    async turn() {
        //Pobranie czyja jest tura
        const casterId = this.battle.activeCombatants[this.currentTeam];
        const caster = this.battle.combatants[casterId];

        const enemyId = this.battle.activeCombatants[caster.team === "player" ? "enemy" : "player"];
        const enemy = this.battle.combatants[enemyId];

        const submission = await this.onNewEvent({
            type: "submissionMenu",
            caster,
            enemy
        })

        if (submission.instanceId) {
            this.battle.usedInstanceIds[submission.instanceId] = true;

            this.battle.items = this.battle.items.filter(i => i.instanceId !== submission.instanceId)
        }


        //Powodzenie lub niepowodzenie akcji, obecnie akcja zawsze się powodzi
        const resultingEvents = submission.action.success;
        // const resultingEvents = submission.action.failure;

        for (let i = 0; i < resultingEvents.length; i++) {
            const event = {
                ...resultingEvents[i],
                submission,
                action: submission.action,
                caster,
                target: submission.target,
            }
            await this.onNewEvent(event);
        }

        //Działanie statusów aktywnych na postaci
        const statusEvents = caster.getStatusEevents();
        for (let i = 0; i < statusEvents.length; i++) {
            const event = {
                ...statusEvents[i],
                submission,
                action: submission.action,
                caster,
                target: submission.target,
            }
            await this.onNewEvent(event);
        }

        //Zmiana czasu pozostałego na działanie statusu i usunięcie statusu jeżeli minął
        const expiredEvent = caster.statusTurnDecrement();
        if (expiredEvent) {
            await this.onNewEvent(expiredEvent);
        }

        //Sprawdzenie czy ktoś wygrał walke
        const winner = this.getWinningSide();
        if (winner) {
            if (winner === "player") {
                await this.getXpFromEnemy(submission, caster);
                await this.onNewEvent({
                    type: "textMessage",
                    text: `You won the battle!`
                })
            } else {
                await this.onNewEvent({
                    type: "textMessage",
                    text: `You lost the battle...`
                })
            }
            this.onWinner(winner);
            return;
        }

        this.currentTeam = this.currentTeam === "player" ? "enemy" : "player";
        this.turn();
    }

    async getXpFromEnemy(submission, caster) {
        if (submission.target.team === "enemy") {
            await this.onNewEvent({
                type: "textMessage", text: `${submission.target.name} meets its end!`
            })

            const playerActiveId = this.battle.activeCombatants.player;
            const xp = submission.target.givesXp;

            await this.onNewEvent({
                type: "textMessage",
                text: `Gained ${xp} XP!`
            })

            await this.onNewEvent({
                type: "giveXp",
                xp,
                combatant: this.battle.combatants[playerActiveId]
            })
        }
    }

    getWinningSide() {
        let aliveTeam = {};
        Object.values(this.battle.combatants).forEach(c => {
            if (c.hp > 0) {
                aliveTeam[c.team] = true;
            }
        })
        if (!aliveTeam["player"]) { return "enemy" }
        if (!aliveTeam["enemy"]) { return "player" }

        return null;
    }

    async init() {
        this.turn();
    }
}