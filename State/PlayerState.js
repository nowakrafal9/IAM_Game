class PlayerState {
    constructor() {
        this.playerInstance = {
            "hero": {
                id: "p001",
                hp: 10,
                maxHp: 100,
                xp: 0,
                maxXp: 100,
                level: 1,
                status: null,
                isPlayerControlled: true
            }
        }
        this.items = [
            { actionId: "item_healthPotionSmall", instanceId: "item1" },
            { actionId: "item_healthPotionSmall", instanceId: "item2" },
        ]
        this.flags = {
            START_BATTLE: true
        }
        this.currentRoom = 1;
    }
}

window.player = new PlayerState();