/*
    Klasa SceneTransition odpowiedzialna za efekt wygaszenia podczas przechodzenia między poziomami

    * createElement()
        Funcja przygotująca efekt przejścia

    *fadeOut()
        Funkcja odpowiedzialna za wywołanie animacji wygaśnięcia

    * init()
        Funkcja inicjalizująca efekt przejścia
*/
class SceneTransition {
    constructor() {
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("SceneTransition");
    }

    fadeOut() {
        this.element.classList.add("fade-out");

        this.element.addEventListener("animationend", () => {
            this.element.remove();
        }, { once: true })
    }

    init(container, callback) {
        this.createElement();
        container.appendChild(this.element);

        this.element.addEventListener("animationend", () => {
            callback();
        }, { once: true })
    }
}