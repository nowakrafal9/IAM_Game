window.Actions = {
    damage1: {
        name: "Simple attack",
        success: [
            { type: "textMessage", text: "{CASTER} uses Simple Attack on {TARGET}!" },
            // { type: "animation", animation: "attack" },
            { type: "stateChange", damage: 10 },
        ]
    }
}