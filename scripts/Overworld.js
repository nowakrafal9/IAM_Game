class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
    }

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

    bindActionInput() {
        new KeyPressListener("Escape", () => {
            if (!this.map.isCutscenePlaying) {
                this.map.startCutscene([
                    { type: "pause" }
                ])
            }
        })
    }

    bindHeroPositionCheck() {
        document.addEventListener("WalkingComplete", e => {
            if (e.detail.whoId === "hero") {
                this.map.checkForFootstepCutscene();
            }
        })
    }

    startMap(mapConfig, initalState = null) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;

        this.map.gameObjects = {
            hero: generateCharacters.generateHero(),
        }
        this.map.gameObjects = Object.assign(this.map.gameObjects, generateCharacters.generateEnemy(initalState?.enemyInfo[1]))
        this.map.cutsceneSpaces["120, 111"][0].events = generateEvents.generateBattle(this.map.gameObjects["enemy"]);

        if (initalState) {
            this.map.gameObjects["hero"].x = initalState.heroPos[0];
            this.map.gameObjects["hero"].y = initalState.heroPos[1];

            this.map.gameObjects["enemy"].x = initalState.enemyPos[0];
            this.map.gameObjects["enemy"].y = initalState.enemyPos[1];
            this.map.gameObjects["enemy"].isDead = initalState.enemyIsDead;
        }

        this.map.mountObjects();
    }

    async init() {
        const container = document.querySelector(".game-container");

        this.progress = new Progress();

        this.titleScreen = new TitleScreen({
            progress: this.progress
        });
        const useSaveFile = await this.titleScreen.init(container);

        let initalState = null;
        // const saveFile = this.progress.getSaveFile();
        if (useSaveFile) {
            this.progress.load();
            initalState = {
                cutsceneSpaces: this.progress.cutsceneSpaces,
                enemyInfo: this.progress.enemyInfo,
                enemyPos: this.progress.enemyPos,
                enemyIsDead: this.progress.enemyIsDead,
                heroPos: this.progress.heroPos,
            }
        }

        this.hud = new Hud();
        this.hud.init(document.querySelector(".game-container"));

        this.startMap(window.OverworldMap.TestRoom, initalState);

        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startGameLoop();
    }
}