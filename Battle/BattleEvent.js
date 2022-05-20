class BattleEvent {
    constructor(event, battle) {
        this.event = event;
        this.battle = battle;
    }

    textMessage(resolve) {
        const text = this.event.text
            .replace("{CASTER}", this.event.caster?.name)
            .replace("{TARGET}", this.event.target?.name)
            .replace("{ACTION}", this.event.action?.name)

        const message = new TextMessage({
            text,
            onComplete: () => {
                resolve();
            }
        })
        message.init(this.battle.element);
    }

    async stateChange(resolve) {
        const { caster, target, damage, recover, status, action } = this.event;
        let who = this.event.onCaster ? caster : target;

        //TODO: damage scaling from level
        if (damage) {
            who.update({
                hp: who.hp - damage
            })
        }

        if (recover) {
            let newHp = who.hp + recover;

            if (newHp > who.maxHp) {
                newHp = who.maxHp;
            }

            who.update({
                hp: newHp
            })
        }

        if (status) {
            who.update({
                status: { ...status }
            })
        }
        if (status === null) {
            who.update({
                status: null
            })
        }

        await utils.wait(100);

        resolve();
    }

    submissionMenu(resolve) {
        const menu = new SubmissionMenu({
            caster: this.event.caster,
            enemy: this.event.enemy,
            items: this.battle.items,
            onComplete: submission => {
                resolve(submission);
            }
        })
        menu.init(this.battle.element);
    }

    giveXp(resolve) {
        let amount = this.event.xp;
        const { combatant } = this.event;

        const step = () => {
            if (amount > 0) {
                amount -= 1;
                combatant.xp += 1;

                if (combatant.xp >= combatant.maxXp) {
                    combatant.xp = combatant.maxXp - combatant.xp;
                    combatant.level += 1;
                    combatant.maxXp = Math.floor(combatant.maxXp * 1.25);
                }

                combatant.update();
                requestAnimationFrame(step);
                return;
            }
            resolve();
        }
        requestAnimationFrame(step);
    }

    animation(resolve) {
        const fn = BattleAnimations[this.event.animation];
        fn(this.event, resolve);
    }

    init(resolve) {
        this[this.event.type](resolve);
    }
}