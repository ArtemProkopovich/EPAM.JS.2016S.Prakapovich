function Zombie(position, health) {
    this.$image = createDOMImage();
    this.health = health;
    this.position = position;

    Zombie.prototype.show = function($field) {
        this.$image.css('right', this.position);
        $($field).append(this.$image);
    }
    Zombie.prototype.move = function(length, time) {
        this.position = parseInt(this.$image.css('right')) + this.$image.width();
        this.$image.animate({
                right: "+=" + length,
            },
            time);
    }
    Zombie.prototype.die = function(time) {
        if (+time == undefined)
            time = 500;
        this.$image.fadeOut(time, bind(this.$image.remove, this.$image));
    }

    function createDOMImage() {
        var $image = $("<div/>").addClass("zombie");
        return $image;
    }
}