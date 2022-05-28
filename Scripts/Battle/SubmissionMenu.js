/*
    Klasa SubmissionMenu odpowiedzialna za obsługę menu wyboru akcji

    * getPages() 
        Funkcja zwracająca zawartość strony menu
    
    * menuSubmit()
        Funkcja odpowiedziala za wybór akcji

    * decide()
        Funkcja losująca akcje przeciwnika

    * showMenu()
        Funkcja wyświetlająca menu wyboru akcji

    * init()
        Funckja inicjalizjąca menu
*/
class SubmissionMenu {
    constructor({ caster, enemy, onComplete, items }) {
        this.caster = caster;
        this.enemy = enemy;
        this.onComplete = onComplete;

        let quantityMap = {};
        items.forEach(item => {
            if (item.team === caster.team) {
                let existing = quantityMap[item.actionId];
                if (existing) {
                    existing.quantity += 1;
                } else {
                    quantityMap[item.actionId] = {
                        actionId: item.actionId,
                        quantity: 1,
                        instanceId: item.instanceId,
                    }
                }
            }
        });
        this.items = Object.values(quantityMap);
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
                    label: "Items",
                    description: "Items in inventory",
                    handler: () => {
                        this.keyboardMenu.setOptions(this.getPages().items)
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
            ],
            items: [
                ...this.items.map(item => {
                    const action = Actions[item.actionId];
                    return {
                        label: action.name,
                        description: action.description,
                        right: () => {
                            return "x" + item.quantity;
                        },
                        handler: () => {
                            this.menuSubmit(action, item.instanceId);
                        }
                    }
                }),
                backOption
            ]
        }
    }

    menuSubmit(action, instanceId = null) {
        this.keyboardMenu?.end();

        this.onComplete({
            action,
            target: action.targetType === "friendly" ? this.caster : this.enemy,
            instanceId
        })
    }

    decide() {
        let decision = Math.floor(Math.random() * this.caster.actions.length)
        this.menuSubmit(Actions[this.caster.actions[decision]]);
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
    }
}