function Strong(position, health) {
    var self = this;
    Zombie.apply(this, arguments);
    this.$image = initDOMImage();

    function initDOMImage() {
        self.$image.addClass("strong");
        return self.$image;
    }
};

Strong.prototype = Object.create(Zombie.prototype);
Strong.prototype.constructor = Strong;