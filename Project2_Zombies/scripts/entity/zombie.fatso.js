function Fatso(position, health) {
    var self = this;
    Zombie.apply(this, arguments);
    this.$image = initDOMImage();
    this.maxHealth = 100;
    this.health = this.maxHealth;
    this.speed = 4;
    this.currentSpeed = this.speed;


    function initDOMImage() {
        var skin = $("<div/>").addClass("fatso");
        self.$image.append(skin);
        return self.$image;
    }
};

Fatso.prototype = Object.create(Zombie.prototype);
Fatso.prototype.constructor = Fatso;