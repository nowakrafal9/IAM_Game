class Sprite {
    constructor(config) {
        //Loading the image
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        this.sizeX = config.sizeX || 0;
        this.sizeY = config.sizeY || 0;

        //Animation and inital state
        this.animations = config.animations || {
            "hero_idle-NoFight": [[0, 0], [1, 0], [2, 0], [3, 0]],
            "hero_idle-Fight": [[3, 5], [4, 5], [5, 5], [6, 5]],
            "hero_walk-right": [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],

            "slime_idle": [[0, 0], [1, 0], [2, 0], [3, 0]],
            "slime_death": [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]]
        }

        this.currentAnimation = config.currentAnimation || "hero_idle-NoFight";
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 10;
        this.animationFrameProgress = this.animationFrameLimit;

        //Reference the game object
        this.gameObject = config.gameObject;
    }

    get frame() {
        return this.animations[this.currentAnimation][this.currentAnimationFrame];
    }

    setAnimation(key) {
        if (this.currentAnimation !== key) {
            this.currentAnimation = key;
            this.currentAnimationFrame = 0;
            this.animationFrameProgress = this.animationFrameLimit;
        }
    }

    updateAnimationProgress() {
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        this.animationFrameProgress = this.animationFrameLimit;
        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            this.currentAnimationFrame = 0;
        }
    }

    draw(ctx) {
        const x = this.gameObject.x;
        const y = this.gameObject.y;

        const [frameX, frameY] = this.frame;

        this.isLoaded && ctx.drawImage(
            this.image,
            frameX * this.sizeX, frameY * this.sizeY,
            this.sizeX, this.sizeY,
            x, y,
            this.sizeX, this.sizeY
        )

        this.updateAnimationProgress();
    }
}