class GameObject {
    constructor(config) {
        this.x = config.x || 0;
        this.y = config.y || 0;
        this.sizeX = config.sizeX;
        this.sizeY = config.sizeY;
        this.direction = config.direction || "right"
        this.objectType = config.objectType || null;

        this.sprite = new Sprite({
            gameObject: this,
            src: config.src,

            sizeX: this.sizeX,
            sizeY: this.sizeY,
        });
    }
    update() { }
}