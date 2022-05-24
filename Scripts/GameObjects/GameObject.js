class GameObject {
    constructor(config) {
        this.id = null;
        this.x = config.x || 0;
        this.y = config.y || 0;

        this.direction = config.direction || "right";
        this.objectType = config.objectType || null;

        this.sprite = new Sprite({
            gameObject: this,
            src: config.src,

            sizeX: config.sizeX,
            sizeY: config.sizeY,
        });

        this.behaviorLoop = config.behaviorLoop || [];
        this.behaviorLoopIndex = 0;
    }

    mount(map) {
        this.isMounted = true;

        setTimeout(() => {
            this.doBehaviorEvent(map);
        }, 10)
    }

    update() { }

    async doBehaviorEvent(map) {
        if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
            return;
        }

        //Setting up our event with relevant info
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        //Create an event instance out of next event config
        const eventHandler = new OverworldEvent({ map, event: eventConfig });
        await eventHandler.init();

        //Setting the next event to fire
        this.behaviorLoopIndex += 1;
        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        this.doBehaviorEvent(map);
    }
}