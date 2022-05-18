class EnemySlime extends GameObject {
    constructor(config) {
        super(config);

        this.movingProgressRemaining = 0;
        this.isStanding = false;
        this.isInBattle = false;
        this.isMakingTurnAction = false;
        this.isDead = false;

        this.directionUpdate = {
            "left": ["x", -2],
            "right": ["x", 2],
        }
    }

    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
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

    updateSprite(state) {
        if (!this.isDead) {
            if (this.movingProgressRemaining > 0) {
                this.sprite.setAnimation("walk-left");
                return;
            }

            if (!this.isMakingTurnAction) {
                if (!this.isInBattle) {
                    this.sprite.setAnimation("idle-NoFight");
                } else {
                    this.sprite.setAnimation("idle-Fight");
                }
            }
        } else {
            this.sprite.setAnimation("stay-dead");
        }
    }

    scaleEnemy(config) {
        // console.log(config);
        this.enemyInstance = config.enemyInstance;
        this.heroLevel = config.heroLevel;

        if (this.heroLevel === 1) {
            this.enemyInstance.level = Math.floor(Math.random() * 2) + this.heroLevel;
        } else {
            this.heroLevel -= 1;
            this.enemyInstance.level = Math.floor(Math.random() * 3) + this.heroLevel;
        }

        this.enemyInstance.maxHp += 5 * this.enemyInstance.level;

        // console.log(config);
        return this.enemyInstance;
    }
}