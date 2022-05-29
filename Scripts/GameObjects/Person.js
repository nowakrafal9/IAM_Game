/*
    Klasa Person dziedzicząca po GameObject odpowiedzialna za zarządzanie rysowanymi postaciami

    * update()
        Funkcja odpowiedzialna za wprowadzenie zmian w obiekcie

    * startBehavior()
        Funkcja obsługująca wywołane zachowania obiektu

    * updatePosition()
        Funkcja obsługująca zmiane koordynatów obiektu

    * updateSprite()
        Funkcja obsługująca zmiane animacji obiektu
*/
class Person extends GameObject {
    constructor(config) {
        super(config);

        this.objectType = config.objectType;

        this.movingProgressRemaining = 0;
        this.directionUpdate = {
            "left": ["x", -2],
            "right": ["x", 2],
        }
    }

    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            //Porusz postać jeżeli:
            //- nie ma aktywnego przerywnika filmowego
            //- wciśnięto przycisk
            //- obiekt jest sterowany przez gracza
            //- obiekt żyje
            if (!state.map.isCutscenePlaying && state.arrow && this.objectType == "Player" && !this.isDead) {
                this.startBehavior(state, {
                    type: "walk",
                    direction: state.arrow
                });
            }
            this.updateSprite(state);
        }
    }

    startBehavior(state, behavior) {
        this.direction = behavior.direction;

        if (behavior.type === "walk") {
            this.movingProgressRemaining = 5;
            this.updateSprite(state);
        }

        if (behavior.type === "long_walk") {
            this.movingProgressRemaining = 30;
            this.updateSprite(state);
        }

        if (behavior.type === "stand") {
            this.isStanding = true;
            setTimeout(() => {
                utils.emitEvent("StandComplete", {
                    whoId: this.id
                })
                this.isStanding = false;
            }, behavior.time)
        }
    }

    updatePosition() {
        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining -= 1;

        if (this.movingProgressRemaining === 0) {
            utils.emitEvent("WalkingComplete", {
                whoId: this.id
            })
        }
    }

    updateSprite() {
        if (!this.isDead) {
            if (this.movingProgressRemaining > 0) {
                this.sprite.setAnimation("walk-" + this.direction);
                return;
            }

            if (!this.isMakingTurnAction) {
                if (!this.isInBattle) {
                    this.sprite.setAnimation("idle-NoFight-" + this.direction);
                } else {
                    this.sprite.setAnimation("idle-Fight");
                }
            }
        } else {
            this.sprite.setAnimation("stay-dead");
        }
    }
}