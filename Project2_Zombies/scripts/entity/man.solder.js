function Solder() {
    var self = this;
    Man.apply(this, arguments);
    Solder.prototype.rate = 100;
    Solder.prototype.damage = 10;
    this.$image = initDOMImage();

    function initDOMImage() {
        var skin = $("<div/>").addClass("solder");
        self.$image.append(skin);
        return self.$image;
    };
}

Solder.prototype = Object.create(Man.prototype);
Solder.prototype.constructor = Solder;