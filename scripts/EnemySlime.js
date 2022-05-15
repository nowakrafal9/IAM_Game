class EnemySlime extends GameObject {
    constructor(config) {
        super(config);

        this.movingProgressRemaining = 0;
        this.isInFight = false;
        this.battleStarted = false;

        this.directionUpdate = {
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    update(state) {
        this.updatePosition();
        this.updateSprite();
    }

    updatePosition() {
        if (this.movingProgressRemaining > 0) {
            const [property, change] = this.directionUpdate["left"];
            this[property] += change;
            this.movingProgressRemaining -= 1;
        }
    }

    updateSprite() {
        if (this.movingProgressRemaining === 0) {
            this.sprite.setAnimation("slime_idle");
            return;
        }

        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("slime_idle");
        }
    }

    startFight() {
        this.isInFight = true;

        if (!this.battleStarted) {
            this.moveToFight();
        }
    }

    moveToFight() {
        this.movingProgressRemaining = 100;

        if (this.movingProgressRemaining > 0) {
            this.movingProgressRemaining -= 1;
            this.sprite.setAnimation("slime_idle");
        } else {
            this.sprite.setAnimation("slime_idle");
        }

        this.battleStarted = true;
    }
}