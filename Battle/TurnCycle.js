class TurnCycle {
    constructor({ battle, onNewEvent, onWinner }) {
        this.battle = battle;
        this.onNewEvent = onNewEvent;
        this.onWinner = onWinner;

        this.currentTeam = "enemy"; // "enemy"
    }

    async turn() {
        //Get the caster
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

        // const resultingEvents = caster.getReplacedEvents(submission.action.success);
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

        // const targetDead = submission.target.hp <= 0;
        // if (targetDead) {
        //     await this.onNewEvent({
        //         type: "textMessage", text: `${submission.target.name} meets its end!`
        //     })

        //     if (submission.target.team === "enemy") {
        //         const playerActiveId = this.battle.activeCombatants.player;
        //         const xp = submission.target.givesXp;

        //         await this.onNewEvent({
        //             type: "textMessage",
        //             text: `Gained ${xp} XP!`
        //         })

        //         await this.onNewEvent({
        //             type: "giveXp",
        //             xp,
        //             combatant: this.battle.combatants[playerActiveId]
        //         })
        //     }
        // }

        //Status effects after turn
        const postEvents = caster.getPostEevents();
        for (let i = 0; i < postEvents.length; i++) {
            const event = {
                ...postEvents[i],
                submission,
                action: submission.action,
                caster,
                target: submission.target,
            }
            await this.onNewEvent(event);
        }

        //Check for status expire
        const expiredEvent = caster.statusTurnDecrement();
        if (expiredEvent) {
            await this.onNewEvent(expiredEvent);
        }

        // const targetDead = submission.target.hp <= 0;
        // if (targetDead) {
        //     await this.getXpFromEnemy(submission);
        // }

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
        } else {
            await this.onNewEvent({
                type: "textMessage", text: `${caster.name} meets its end!`
            })

            const playerActiveId = this.battle.activeCombatants.player;
            const xp = caster.givesXp;

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
        // await this.onNewEvent({
        //     type: "textMessage",
        //     text: "The battle has started"
        // })

        this.turn();
    }
}