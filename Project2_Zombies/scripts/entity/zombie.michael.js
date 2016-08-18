function Michael(position, health) {
    var self = this;
    Zombie.apply(this, arguments);
    this.$image = initDOMImage();


    function initDOMImage() {
        self.$image.addClass("michael");
        return self.$image;
    }
};

Michael.prototype = Object.create(Zombie.prototype);
Michael.prototype.constructor = Michael;