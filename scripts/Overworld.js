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
                object.update({ arrow: this.directionInput.direction });
                object.sprite.draw(this.ctx);
            })

            requestAnimationFrame(() => {
                step();
            })
        }
        step();
    }

    init() {
        this.map = new OverworldMap(window.OverworldMap.TestRoom);

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startGameLoop();
    }
}