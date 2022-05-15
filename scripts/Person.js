class Person extends GameObject {
    constructor(config) {
        super(config);
        this.movingProgressRemaining = 0;

        this.directionUpdate = {
            "left": ["x", -1],
            "right": ["x", 1],
        }
    }

    update(state) {
        if (this.movingProgressRemaining > 0) {
            this.updatePosition();
        } else {
            // Move if key pressed
            if (state.arrow) {
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
        }
    }

    updatePosition() {

        const [property, change] = this.directionUpdate[this.direction];
        this[property] += change;
        this.movingProgressRemaining -= 1;

    }

    updateSprite(state) {
        if (this.movingProgressRemaining > 0) {
            this.sprite.setAnimation("hero_walk-right");
            return;
        }
        this.sprite.setAnimation("hero_idle-NoFight");
    }
}