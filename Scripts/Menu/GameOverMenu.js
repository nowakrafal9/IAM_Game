/*
    Klasa GameOverMenu odpowiedzialna za ekran śmierci.

    * getOptions()
        Funkcja zwracająca opcje do menu

    * createElement()
        Funcja przygotująca menu

    * close()
        Funkcja zamykająca ekran śmierci

    * init()
        Funkcja inicjalizująca
*/
class GameOverMenu {
    constructor({ map, onComplete }) {
        this.map = map;
        this.onComplete = onComplete;
    }

    getOptions() {
        return [
            {
                label: "Return to menu",
                description: "Return to menu to start a new adventure",
                handler: () => {
                    this.close();
                    window.location.reload();
                }
            }]
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("GameOverMenu");
        this.element.innerHTML = (`
            <h2>Game Over</h2>
        `)
    }

    close() {
        this.keyboardMenu.end();
        this.element.remove();
        this.onComplete();
    }

    async init(container) {
        this.createElement();
        this.keyboardMenu = new KeyboardMenu({
            descriptionContainer: container
        })
        this.keyboardMenu.init(this.element);
        this.keyboardMenu.setOptions(this.getOptions("root"));

        container.appendChild(this.element);

        utils.wait(200);
    }
}