/*
    Klasa Sprite odpowiedzialna za zarządzanie animacjami

    * get frame()
        Getter otrzymujący aktualną klatke animacji

    * setAnimation()
        Funckja ustawiająca aktywną animacje

    * setTurnAnimation()
        Funckja ustawiająca aktywną animacje poczas tury postaci

    * updateAnimationProgress()
        Funkcja aktualizujaca postęp animacji

    * draw()
        Funkcja rysująca obiekt
*/
class Sprite {
    constructor(config) {
        //Załadowanie obrazków
        this.image = new Image();
        this.image.src = config.src;
        this.image.onload = () => {
            this.isLoaded = true;
        }

        //Ustawienie rozmiaru cięcia
        this.sizeX = config.sizeX || 0;
        this.sizeY = config.sizeY || 0;

        //Referencja do obiektu
        this.gameObject = config.gameObject;

        //Animacja podczas tury, nie powtarza się
        this.turnAnimation = false;

        //Ustawienie animacji
        this.animations = null;
        //Obiekt jest instancją klasy Person
        if (config.gameObject instanceof Person) {
            this.animations = config.animations || {
                "idle-NoFight-right": [[0, 0], [1, 0], [2, 0], [3, 0]],
                "idle-NoFight-left": [[13, 0], [12, 0], [11, 0], [10, 0]],
                "idle-Fight": [[3, 5], [4, 5], [5, 5], [6, 5]],

                "walk-right": [[1, 1], [2, 1], [3, 1], [4, 1], [5, 1], [6, 1]],
                "walk-left": [[12, 1], [11, 1], [10, 1], [9, 1], [8, 1], [7, 1]],

                "fastAttack": [[0, 7], [1, 7], [2, 7], [3, 7]],

                "hurt": [[4, 8], [5, 8], [6, 8]],

                "death": [[0, 9], [1, 9], [2, 9], [3, 9], [4, 9], [5, 9]],
                "stay-dead": [[5, 9]]
            }
        }
        //Obiekt jest instancją klasy EnemySlime
        if (config.gameObject instanceof EnemySlime) {
            this.animations = config.animations || {
                "idle-NoFight": [[0, 0], [1, 0], [2, 0], [3, 0]],
                "idle-Fight": [[0, 0], [1, 0], [2, 0], [3, 0]],

                "walk-left": [[4, 0], [5, 0], [6, 0], [7, 0]],

                "fastAttack": [[0, 1], [1, 1], [2, 1], [3, 1], [4, 1]],

                "hurt": [[4, 1], [5, 1], [6, 1], [7, 1], [0, 2]],

                "death": [[0, 2], [1, 2], [2, 2], [3, 2], [4, 2]],
                "stay-dead": [[4, 2]]
            }
        }

        this.currentAnimation = config.currentAnimation;
        this.currentAnimationFrame = 0;

        this.animationFrameLimit = config.animationFrameLimit || 10;
        this.attackFrameLimit = config.attackFrameLimit || 5;
        this.animationFrameProgress = this.animationFrameLimit;
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

    setTurnAnimation(key) {
        this.setAnimation(key);
        this.turnAnimation = true;
    }

    updateAnimationProgress() {
        if (this.animationFrameProgress > 0) {
            this.animationFrameProgress -= 1;
            return;
        }

        if (!this.turnAnimation) {
            this.animationFrameProgress = this.animationFrameLimit;
        } else {
            this.animationFrameProgress = this.attackFrameLimit;
        }

        this.currentAnimationFrame += 1;

        if (this.frame === undefined) {
            if (this.turnAnimation) {
                utils.emitEvent("AnimationComplete", {
                    who: this.who
                })
                this.turnAnimation = false;
            }

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