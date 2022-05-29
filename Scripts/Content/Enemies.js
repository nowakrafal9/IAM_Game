//Wszystkie rodzaje przeciwników, ich ikony bitwy, akcje oraz statystyki podstawowe
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

window.EnemiesStats = {
    "Slime": {
        name: "Slime",
        enemyInstance: {
            id: "slime_normal",
            maxHp: 5,
            attack: 2,
            defense: 3,
            level: 1,
            killXp: 20,
        }
    },
    "FireSlime": {
        name: "Fire Slime",
        enemyInstance: {
            id: "slime_fire",
            maxHp: 5,
            attack: 4,
            defense: 1,
            level: 1,
            killXp: 20,
        }
    },
    "PoisonSlime": {
        name: "Poison Slime",
        enemyInstance: {
            id: "slime_poison",
            maxHp: 10,
            attack: 1,
            defense: 3,
            level: 1,
            killXp: 20,
        }
    },
    "IceSlime": {
        name: "Ice Slime",
        enemyInstance: {
            id: "slime_ice",
            maxHp: 10,
            attack: 1,
            defense: 5,
            level: 1,
            killXp: 20,
        }
    },
    "SlimeBoss": {
        name: "Slime boss",
        enemyInstance: {
            id: "slime_boss",
            maxHp: 20,
            attack: 4,
            defense: 4,
            level: 1,
            killXp: 40,
        }
    }
}