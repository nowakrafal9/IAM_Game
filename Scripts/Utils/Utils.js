/*
    Funkcje narzędzi

    * emitEvent()
        Funkcja używana do stworzenia nowego zdarzenia do nasłuchiwania

    * wait()
        Funkcja opóźniająca
*/
const utils = {
    emitEvent(name, detail) {
        const event = new CustomEvent(name, { detail });
        document.dispatchEvent(event);
    },

    wait(ms) {
        return new Promise(resolve => {
            setTimeout(() => {
                resolve();
            }, ms)
        })
    },
}