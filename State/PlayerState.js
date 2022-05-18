class PlayerState {
    constructor() {
        this.playerInstance = {
            "hero": {
                id: "p001",
                hp: 50,
                maxHp: 50,
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
    }
}

window.player = new PlayerState();