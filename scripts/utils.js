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

    randomFromArray(array) {
        return array[Math.floor(Math.random() * array.length)]
    }
}