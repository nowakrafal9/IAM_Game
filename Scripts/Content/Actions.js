//Wszystkie akcje oraz przedmioty dostępne podczas bitwy
window.Actions = {
    // Typy ataków
    FastAttack: {
        name: "Fast attack",
        description: "Attack as swift as a wind",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}!" },
            { type: "animation", animation: "attack" },
            { type: "stateChange", damage: 10 },
            { type: "animation", animation: "hit" },
        ],
        failure: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}!" },
            { type: "animation", animation: "attack" },
            { type: "textMessage", text: "{CASTER} misses!" },
        ]
    },
    HeavyAttack: {
        name: "Heavy attack",
        description: "Exceed your limits by using life force to obliterate enemy",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}!" },
            { type: "animation", animation: "attack" },
            { type: "stateChange", damage: 20 },
            { type: "animation", animation: "hit" },
            { type: "stateChange", damage: 3, onCaster: true },
            { type: "textMessage", text: "{CASTER} was hit with a recoil!" },
        ],
        failure: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}!" },
            { type: "animation", animation: "attack" },
            { type: "textMessage", text: "{CASTER} misses!" },
        ],
    },
    HiddenBlade: {
        name: "Hidden blade",
        description:
            "Fake mark your attack and hit enemy with poisonous hidden blade",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}!" },
            { type: "animation", animation: "attack" },
            { type: "stateChange", damage: 5 },
            {
                type: "stateChange",
                status: {
                    type: "Poison",
                    expiresIn: 2,
                },
            },
            { type: "animation", animation: "hit" },
        ],
        failure: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}!" },
            { type: "animation", animation: "attack" },
            { type: "textMessage", text: "{CASTER} misses!" },
        ],
    },
    SlimePoisonAttack: {
        name: "Poison Tackle",
        description: "",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}!" },
            { type: "animation", animation: "attack" },
            { type: "stateChange", damage: 4 },
            {
                type: "stateChange",
                status: {
                    type: "Poison",
                    expiresIn: 2,
                },
            },
            { type: "animation", animation: "hit" },
        ],
        failure: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}!" },
            { type: "animation", animation: "attack" },
            { type: "textMessage", text: "{CASTER} misses!" },
        ],
    },
    SlimeFireAttack: {
        name: "Lava Splash",
        description: "",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}!" },
            { type: "animation", animation: "attack" },
            { type: "stateChange", damage: 8 },
            {
                type: "stateChange",
                status: {
                    type: "Fire",
                    expiresIn: 2,
                },
            },
            { type: "animation", animation: "hit" },
        ],
        failure: [
            { type: "textMessage", text: "{CASTER} uses {ACTION} on {TARGET}!" },
            { type: "animation", animation: "attack" },
            { type: "textMessage", text: "{CASTER} misses!" },
        ],
    },

    // Przedmioty
    item_healthPotionSmall: {
        name: "Recovery potion(S)",
        description: "Small potion giving 20 hp",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
            { type: "stateChange", recover: 20 },
            { type: "textMessage", text: "{CASTER} recovers 20 hp!" },
        ],
    },
    item_healthPotionMedium: {
        name: "Recovery potion(M)",
        description: "Small potion giving 40 hp",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
            { type: "stateChange", recover: 40 },
            { type: "textMessage", text: "{CASTER} recovers 40 hp!" },
        ],
    }
}