class SubmissionMenu {
    constructor({ caster, enemy, onComplete }) {
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;
    }

    getPages() {
        const backOption = {
            label: "&laquo; Go Back",
            description: "Return to previous page",
            handler: () => {
                this.keyboardMenu.setOptions(this.getPages().root)
            }
        };

        return {
            root: [
                {
                    label: "Attack",
                    description: "Choose an attack",
                    handler: () => {
                        this.keyboardMenu.setOptions(this.getPages().attacks)
                    }
                },
                {
                    label: "Suicide",
                    description: "Kill me pls",
                    handler: () => {
                        console.log("Kill me pls");
                    }
                }
            ],
            attacks: [
                ...this.caster.actions.map(key => {
                    const action = Actions[key];
                    return {
                        label: action.name,
                        description: action.description,
                        handler: () => {
                            this.menuSubmit(action);
                        }
                    }
                }),
                backOption
            ]
        }
    }

    menuSubmit(action) {
        this.keyboardMenu?.end();

        this.onComplete({
            action,
            target: action.targetType === "friendly" ? this.caster : this.enemy
        })
    }

    decide() {
        // TODO: Enemies randomly decides what to do...
        this.menuSubmit(Actions[this.caster.actions[0]]);
    }

    showMenu(container) {
        this.keyboardMenu = new KeyboardMenu();
        this.keyboardMenu.init(container);
        this.keyboardMenu.setOptions(this.getPages().root);
    }

    init(container) {
        if (this.caster.isPlayerControlled) {
            //Show UI if player turn
            this.showMenu(container);
        } else {
            this.decide();
        }

        // this.decide();
    }
}