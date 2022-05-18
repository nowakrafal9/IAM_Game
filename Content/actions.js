window.Actions = {
    damage1: {
        name: "Simple attack",
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
    }
}