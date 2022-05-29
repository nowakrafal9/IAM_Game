/*
    Klasa TextMessage odpowiedzialna za system wyświetlania wiadomości.

    * createElement()
        Funcja przygotująca wiadomość

    * done()
        Funkcja odpowiedzialna za przyśpieszenie wyświetlania tekstu oraz zamknięcie go

    * init()
        Funckja inicjalizjąca wiadomość
*/
class TextMessage {
    constructor({ text, onComplete }) {
        this.text = text;
        this.onComplete = onComplete;
        this.element = null;
    }

    createElement() {
        this.element = document.createElement("div");
        this.element.classList.add("TextMessage");

        this.element.innerHTML = (`
            <p class = "TextMessage_p"></p>
            <button class = "TextMessage_button">Next</button>
        `)

        this.revealingText = new RevealingText({
            element: this.element.querySelector(".TextMessage_p"),
            text: this.text
        })

        this.element.querySelector("button").addEventListener("click", () => {
            this.done();
        });

        this.actionListener = new KeyPressListener("Enter", () => {
            this.done();
        })
    }

    done() {
        if (this.revealingText.isDone) {
            this.element.remove();
            this.actionListener.unbind();
            this.onComplete();
        } else {
            this.revealingText.warpToDone();
        }

    }

    init(container) {
        this.createElement();
        container.appendChild(this.element);
        this.revealingText.init();
    }
}