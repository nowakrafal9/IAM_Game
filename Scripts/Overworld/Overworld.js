/*
    Klasa Overworld przyjmująca rolę kontrolera w którym zamieszczone są pozostałe komponenty

    * startGameLoop()
        Funkcja odpowiedzialna za game loop rysujący ekran gry
    
    * bindActionInput()
        Funkcja przypisująca akcje do przycisku

    * bindHeroPositionCheck()
        Funkcja nasłuchują czy jakieś zdarzenie znajduje się na pozycji gracza

    * startMap()
        Funkcja uruchamiająca pokój w którym znajdują się postacie 

    * init()
        Asynchroniczna funkcja inicjalizacji
*/
class Overworld {
    constructor(config) {
        this.element = config.element;
        this.canvas = this.element.querySelector(".game-canvas");
        this.ctx = this.canvas.getContext("2d");
        this.map = null;
        this.gameRunning = false;
    }

    startGameLoop() {
        if (!this.gameRunning) {
            this.gameRunning = true;
            const step = () => {
                //Czyszczenie canvas
                this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

                //Rysowanie tła
                this.map.drawImage(this.ctx);

                //Rysowanie obiektów
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
                this.map.checkForCutscene();
            }
        })
    }

    startMap(mapConfig, initalState = null) {
        this.map = new OverworldMap(mapConfig);
        this.map.overworld = this;

        //Wygenerowanie obiektu gracza
        this.map.gameObjects = {
            hero: generateCharacters.generateHero(),
        }
        //Wygenerowanie obiektu przeciwnika
        this.map.gameObjects = Object.assign(this.map.gameObjects, generateCharacters.generateEnemy(initalState?.enemyInfo[1]))

        //Wygenereowanie zdarzenia rozpoczęcia walki
        this.map.cutsceneSpaces["120, 111"][0].events = generateEvents.generateBattle(this.map.gameObjects["enemy"]);

        //Podmiana wartości jeżeli zapis istnieje
        if (initalState) {
            this.map.gameObjects["hero"].x = initalState.heroPos[0];
            this.map.gameObjects["hero"].y = initalState.heroPos[1];

            this.map.gameObjects["enemy"].x = initalState.enemyPos[0];
            this.map.gameObjects["enemy"].y = initalState.enemyPos[1];
            this.map.gameObjects["enemy"].isDead = initalState.enemyIsDead;
        }

        this.map.mountObjects();

        //Jeżeli nie wczytano gry to po przejściu do pokoju przejdź w prawo
        if (!initalState) {
            this.map.startCutscene([
                { who: "hero", type: "longWalk", direction: "right" },
                { who: "hero", type: "longWalk", direction: "right" },
            ])
        }
    }

    async init() {
        const container = document.querySelector(".game-container");

        this.progress = new Progress();

        this.titleScreen = new TitleScreen({
            progress: this.progress
        });
        const useSaveFile = await this.titleScreen.init(container);

        let initalState = null;
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

        this.startMap(window.OverworldMap.Room, initalState);

        this.bindActionInput();
        this.bindHeroPositionCheck();

        this.directionInput = new DirectionInput();
        this.directionInput.init();

        this.startGameLoop();
    }
}