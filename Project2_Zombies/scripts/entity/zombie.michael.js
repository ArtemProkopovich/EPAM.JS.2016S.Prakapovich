function Michael(position, line) {
    var self = this;
    Zombie.apply(this, arguments);
    this.$image = initDOMImage();
    this.speed = 5;
    this.currentSpeed = this.speed;


    function initDOMImage() {
        var skin = $("<div/>").addClass("michael");
        self.$image.append(skin);
        return self.$image;
    }
};

Michael.prototype = Object.create(Zombie.prototype);
Michael.prototype.constructor = Michael;