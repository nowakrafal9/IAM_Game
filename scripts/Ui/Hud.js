class Hud {
    constructor() {
        this.hudElement = null;
    }

    update() {
        this.hudElement.update(window.player.playerInstance["hero"])
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("Hud");
        this.element.setAttribute('id', 'Hud');

        const { player } = window;
        const playerInstance = player.playerInstance["hero"];

        const hudElement = new Combatant({
            id: "hero",
            ...Players[playerInstance.id],
            ...playerInstance
        }, null)
        hudElement.createElement();
        this.hudElement = hudElement;
        this.element.appendChild(hudElement.hudElement);

        this.update();
    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);

        document.addEventListener("PlayerStateUpdated", () => {
            this.update();
        });
    }
}