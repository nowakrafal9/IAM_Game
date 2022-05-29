/*
    Klasa PlayerState reprezentująca globalny stan gracza
*/
class PlayerState {
    constructor() {
        this.playerInstance = {
            "hero": {
                id: "adventurer",
                hp: 60,
                maxHp: 60,
                attack: 15,
                defense: 15,
                xp: 0,
                maxXp: 80,
                level: 1,
                status: null,
                isPlayerControlled: true
            }
        }
        this.items = [
            { actionId: "item_healthPotionSmall", instanceId: "item1" },
            { actionId: "item_healthPotionSmall", instanceId: "item2" },
            { actionId: "item_healthPotionMedium", instanceId: "item3" },
        ]
        this.flags = {
            START_BATTLE: true
        }
        this.currentRoom = 1;
    }
}

window.player = new PlayerState();