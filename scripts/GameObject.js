class GameObject {
    constructor(config) {
        this.id = config.id || null;
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
        //Don't do anything if there is a more important cutscene or I don't have config to do anything
        //anyway.
        if (map.isCutscenePlaying || this.behaviorLoop.length === 0 || this.isStanding) {
            return;
        }

        //Setting up our event with relevant info
        let eventConfig = this.behaviorLoop[this.behaviorLoopIndex];
        eventConfig.who = this.id;

        //Create an event instance out of our next event config
        const eventHandler = new OverworldEvent({ map, event: eventConfig });
        await eventHandler.init();

        //Setting the next event to fire
        this.behaviorLoopIndex += 1;
        if (this.behaviorLoopIndex === this.behaviorLoop.length) {
            this.behaviorLoopIndex = 0;
        }

        //Do it again!
        this.doBehaviorEvent(map);
    }
}