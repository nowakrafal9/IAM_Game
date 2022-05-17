window.BattleAnimations = {
    async attack(event, onComplete) {
        event.caster.objectRef.isMakingTurnAction = true;
        event.caster.objectRef.sprite.setTurnAnimation("fastAttack");

        document.addEventListener("AnimationComplete", () => {
            event.caster.objectRef.isMakingTurnAction = false;
        })

        await utils.wait(500);

        onComplete();
    },

    async hit(event, onComplete) {
        event.target.objectRef.isMakingTurnAction = true;
        event.target.objectRef.sprite.setTurnAnimation("hurt");

        document.addEventListener("AnimationComplete", () => {
            event.target.objectRef.isMakingTurnAction = false;
        })

        await utils.wait(500);

        onComplete();
    }
}