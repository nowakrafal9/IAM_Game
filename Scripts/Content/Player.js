//Wszystkie rodzaje postaci jakimi można grać, ich ikony bitwy oraz akcje
window.PlayerTypes = {
    adventurer: "adventurer",
}

window.Players = {
    "adventurer": {
        name: "Adventurer",
        type: PlayerTypes.adventurer,
        icon: "./Assets/characters/icons/Adventurer_icon.png",
        actions: ["FastAttack", "HeavyAttack", "HiddenBlade"]
    }
}