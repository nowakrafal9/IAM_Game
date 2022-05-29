/*
    Klasa PauseMenu odpowiedzialna za menu pauzy.

    * getOptions()
        Funkcja zwracająca opcje do menu

    * createElement()
        Funcja przygotująca menu

    * close()
        Funkcja zamykająca menu pauzy

    * init()
        Funkcja inicjalizująca
*/
class PauseMenu {
    constructor({ map, saveManagement, onComplete }) {
        this.map = map;
        this.saveManagement = saveManagement;
        this.onComplete = onComplete;
    }

    getOptions() {
        return [
            {
                label: "Save",
                description: "Save your progress",
                handler: () => {
                    this.saveManagement.save(this.map);
                    this.close();
                }
            },
            {
                label: "Close game",
                description: "Return to title screen",
                handler: () => {
                    this.close();
                    window.location.reload();
                },
            }]
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("PauseMenu");
        this.element.innerHTML = (`
            <h2>Pause Menu</h2>
        `)
    }

    close() {
        this.esc?.unbind();
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
        this.keyboardMenu.setOptions(this.getOptions());

        container.appendChild(this.element);

        utils.wait(200);
        this.esc = new KeyPressListener("Escape", () => {
            this.close();
        })
    }
}