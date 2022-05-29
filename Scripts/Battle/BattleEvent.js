/*
    Klasa BattleEvent odpowiedzialna za zdarzenia w trakcie bitwy.

    * textMessage()
        Funkcja odpowiedzialna za wyświetlenia wiadomości. 

    * stateChange()
        Asynchroniczna funkcja obsługująca wszelkie zmiany stanu kombatanta.

    * submissionMenu()
        Funckja odpowiedzalna za wybranie akcji z menu wyboru.

    * giveXp()
        Funkcja odpowiadająca za rozdanie punktów doświadczenia po ukończonej bitwie

    * animation()
        Funkcja wywołująca odpowiednią animacje

    * init()
        Funckja inicjalizjąca zdarzenie
*/
class BattleEvent {
    constructor(event, battle) {
        this.event = event;
        this.battle = battle;
    }

    textMessage(resolve) {
        //Podmiana tekstu jeżeli zamiennik istnieje
        const text = this.event.text
            .replace("{CASTER}", this.event.caster?.name)
            .replace("{TARGET}", this.event.target?.name)
            .replace("{ACTION}", this.event.action?.name)

        //Utworzenie nowego obiektu TextMessage zarządzającego wyświetleniem wiadomości
        const message = new TextMessage({
            text,
            onComplete: () => {
                resolve();
            }
        })
        message.init(this.battle.element);
    }

    async stateChange(resolve) {
        //Wyodrębnienie parametrów przesyłanych w zmiennej event
        const { caster, target, damage, statusDamage, recover, status, fireStatus } = this.event;
        //Ustawienie postaci wobec której nastąpią zmiany. Jeżeli przesłano zmienną onCaster o wartości true to
        //zmienna who = caster, w przeciwnym razie who = target
        let who = this.event.onCaster ? caster : target;

        //Zadanie obrażeń bezpośrednich
        if (damage) {
            let damageDealt = 0;
            if (caster === who) {
                damageDealt = Math.ceil(
                    (((2 * caster.level) / 5 + 2) * damage * caster.attack) /
                    caster.defense / 5)
            } else {
                damageDealt = Math.ceil(
                    (((2 * caster.level) / 5 + 2) * damage * caster.attack) /
                    target.defense / 5);
            }

            who.update({
                hp: who.hp - damageDealt
            })
        }

        //Zadanie obrażeń ze statusu
        if (statusDamage) {
            let sDamage = statusDamage;
            if (fireStatus) {
                sDamage *= target.attack
            }

            who.update({
                hp: who.hp - sDamage
            })
        }

        //Leczenie postaci
        if (recover) {
            let newHp = who.hp + recover;

            if (newHp > who.maxHp) {
                newHp = who.maxHp;
            }

            who.update({
                hp: newHp
            })
        }

        //Nałożenie/usunięcie statusu
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
        //Utworzenie nowego obiektu SubmissionMenu zarządzającego menu wyboru akcji
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

        //Animacja rośnięcia paska doświadczenia
        const step = () => {
            if (amount > 0) {
                if (amount > 1000) {
                    amount -= 100;
                    combatant.xp += 100;
                } else if (amount > 500) {
                    amount -= 50;
                    combatant.xp += 50;
                } else if (amount > 250) {
                    amount -= 10;
                    combatant.xp += 10;
                } else {
                    amount -= 5;
                    combatant.xp += 5;
                }

                //Zwiększenia poziomu po osiągniąciu odpowiedniej ilości punktów doświadczenia
                if (combatant.xp >= combatant.maxXp) {
                    combatant.xp = combatant.maxXp - combatant.xp;
                    combatant.level += 1;
                    combatant.maxXp = Math.floor(combatant.maxXp * 1.25);

                    combatant.defense += 5;
                    combatant.attack += 5;
                    combatant.hp += 10;
                    combatant.maxHp += 10;
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
        const animation = BattleAnimations[this.event.animation];
        animation(this.event, resolve);
    }

    init(resolve) {
        this[this.event.type](resolve);
    }
}