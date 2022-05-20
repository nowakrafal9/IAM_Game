window.Actions = {
    // Attack types
    damage1: {
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
    damage2: {
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
    damage3: {
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
                    type: "poison",
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

    // Statuses
    regenerationStatus: {
        name: "Regeneration",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            {
                type: "stateChange",
                status: {
                    type: "regeneration",
                    expiresIn: 3
                }
            },
        ]
    },
    stunStatus: {
        name: "Stun",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}" },
            {
                type: "stateChange",
                status: {
                    type: "stun",
                    expiresIn: 2
                }
            },
            { type: "textMessage", text: "{TARGET} can't see too well" },
        ]
    },

    // Items
    item_healthPotionSmall: {
        name: "Recovery potion(S)",
        description: "Small potion giving 10 hp",
        targetType: "friendly",
        success: [
            { type: "textMessage", text: "{CASTER} uses {ACTION}!" },
            { type: "stateChange", recover: 10 },
            { type: "textMessage", text: "{CASTER} recovers 10 hp!" },
        ],
    }
}