function Strong(position, line) {
    var self = this;
    Zombie.apply(this, arguments);
    this.$image = initDOMImage();
    this.maxHealth = 70;
    this.health = this.maxHealth;
    this.speed = 3;
    this.currentSpeed = this.speed;

    function initDOMImage() {
        var skin = $("<div/>").addClass("strong");
        self.$image.append(skin);
        return self.$image;
    }
};

Strong.prototype = Object.create(Zombie.prototype);
Strong.prototype.constructor = Strong;