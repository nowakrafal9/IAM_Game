/*
    Klasa GameObject odpowiedzialna za zarządzanie rysowanymi obiektami

    * update()
        Funkcja odpowiedzialna za wprowadzenie zmian w obiekcie
*/
class GameObject {
    constructor(config) {
        //Identyfikator obiektu, domyślnie null
        this.id = null;

        //Koordynaty obiektu, jeżeli nie przekazano ich to domyślnie przyjmują wartość 0
        this.x = config.x || 0;
        this.y = config.y || 0;

        //Kierunek i typ obiektu. Jeżeli nieprzekazane to przyjmują domyślne wartości 'right' i null
        this.direction = config.direction || "right";
        this.objectType = config.objectType || null;

        //Utworzenie nowego sprite'a
        this.sprite = new Sprite({
            gameObject: this,
            src: config.src,

            sizeX: config.sizeX,
            sizeY: config.sizeY,
        });

        this.isStanding = false;
        this.isInBattle = false;
        this.isMakingTurnAction = false;
        this.isDead = false;
    }
}