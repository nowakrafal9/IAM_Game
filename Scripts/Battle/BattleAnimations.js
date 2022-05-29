//Wszystkie dostępne animacje
window.BattleAnimations = {
    // Animacja ataku
    async attack(event, onComplete) {
        event.caster.objectRef.isMakingTurnAction = true;
        event.caster.objectRef.sprite.setTurnAnimation("fastAttack");

        document.addEventListener("AnimationComplete", () => {
            event.caster.objectRef.isMakingTurnAction = false;
        })

        await utils.wait(500);

        onComplete();
    },

    // Animacja otrzymania obrażeń przez postać
    async hit(event, onComplete) {
        event.target.objectRef.isMakingTurnAction = true;
        event.target.objectRef.sprite.setTurnAnimation("hurt");

        document.addEventListener("AnimationComplete", () => {
            event.target.objectRef.isMakingTurnAction = false;
        })

        if (event.target.hp <= 0) {
            event.target.objectRef.sprite.setTurnAnimation("death");

            document.addEventListener("AnimationComplete", () => {
                event.target.objectRef.isDead = true;
            })
        }
        await utils.wait(500);

        onComplete();
    },

    // Animacja śmierci postaci
    async death(event, onComplete) {
        event.caster.objectRef.isMakingTurnAction = true;
        event.caster.objectRef.sprite.setTurnAnimation("hurt");

        document.addEventListener("AnimationComplete", () => {
            event.caster.objectRef.isMakingTurnAction = false;
        })

        if (event.caster.hp <= 0) {
            event.caster.objectRef.sprite.setTurnAnimation("death");

            document.addEventListener("AnimationComplete", () => {
                event.caster.objectRef.isDead = true;
            })
        }
        await utils.wait(500);

        onComplete();
    }
}