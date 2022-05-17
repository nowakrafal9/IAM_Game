class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

    moveLeft = false;

    startGameLoop() {
        const step = () => {
            //Clear canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

            //Draw background
            this.map.drawImage(this.ctx);

            //Draw objects
            Object.values(this.map.gameObjects).forEach(object => {
                object.update({
                    arrow: this.directionInput.direction,
                    map: this.map
                });
                object.sprite.draw(this.ctx);
            })

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    bindHeroPositionCheck() {
        document.addEventListener("WalkingComplete", e => {
            if (e.detail.whoId === "hero") {
                this.map.checkForFootstepCutscene();
            }
        })
    }

    startMap(mapConfig) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;
        this.map.mountObjects();
    }

    init() {
        this.startMap(window.OverworldMap.TestRoom);

        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startGameLoop();

        // this.map.startCutscene([
        //     { type: "battle" }
        //     //     // { type: "changeMap", map: "Room2" }
        //     //     // { type: "textMessage", text: "Łot heppend" }
        // ])
    }
}