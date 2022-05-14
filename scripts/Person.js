class Person extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;

        this.isPlayer = config.isPlayer || false;

        this.directionUpdate = {
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    update(state) {
        this.updatePosition();
        this.updateSprite(state);

        if (this.movingProgressRemaining === 0 && state.arrow && this.isPlayer) {
            this.direction = state.arrow;
            this.movingProgressRemaining = 5;
        }
    }

    updatePosition() {
        if (this.movingProgressRemaining > 0) {
            const [property, change] = this.directionUpdate[this.direction];
            this[property] += change;
            this.movingProgressRemaining -= 1;
        }
    }

    updateSprite(state) {
        if (this.movingProgressRemaining === 0 && !state.arrow && this.isPlayer) {
            this.sprite.setAnimation("hero_idle-NoFight");
            return;
        }

        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("hero_walk-right");
        }
    }
}