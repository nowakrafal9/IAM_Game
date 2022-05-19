class PlayerState {
    constructor() {
        this.playerInstance = {
            "hero": {
                id: "p001",
                hp: 999,
                maxHp: 999,
                xp: 90,
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
    }
}

window.player = new PlayerState();