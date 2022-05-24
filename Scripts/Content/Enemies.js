window.EnemyTypes = {
    slime: "slime",
}

window.Enemies = {
    "slime_normal": {
        name: "Slime",
        type: EnemyTypes.slime,
        icon: "./Assets/characters/icons/Enemy_icon.png",
        actions: ["FastAttack"]
    },
    "slime_fire": {
        name: "Fire Slime",
        type: EnemyTypes.slime,
        icon: "./Assets/characters/icons/Enemy_icon.png",
        actions: ["FastAttack", "SlimeFireAttack"]
    },
    "slime_poison": {
        name: "Poison Slime",
        type: EnemyTypes.slime,
        icon: "./Assets/characters/icons/Enemy_icon.png",
        actions: ["FastAttack", "SlimePoisonAttack"]
    },
    "slime_ice": {
        name: "Ice Slime",
        type: EnemyTypes.slime,
        icon: "./Assets/characters/icons/Enemy_icon.png",
        actions: ["FastAttack"]
    },
    "slime_boss": {
        name: "Slime Boss",
        type: EnemyTypes.slime,
        icon: "./Assets/characters/icons/Enemy_icon.png",
        actions: ["FastAttack", "SlimePoisonAttack", "SlimeFireAttack"]
    }
}