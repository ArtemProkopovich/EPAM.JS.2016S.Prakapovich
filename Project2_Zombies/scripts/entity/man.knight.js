function Knight() {
    var self = this;
    Man.apply(this, arguments);
    Knight.prototype.lifeTime = 20000;
    this.leftTime = this.lifeTime;
    Knight.prototype.rate = 1500;
    Knight.prototype.damage = 40;
    this.radius = 90;
    this.$image = initDOMImage();

    //using base fire function for find nearest zombie, 
    //then start explode animation and damage zombies in explode area.
    Knight.prototype.fire = function(zombies) {
        var zombie = Man.prototype.fire.apply(this, arguments);
        if (zombie != undefined) {
            var bombOffset = zombie.$image.offset();
            $areal = $("<div/>").addClass("bomb-damage-area").css({
                width: 140,
                height: 140,
                top: bombOffset.top - 40,
                left: bombOffset.left - 50,
            });
            $areal.animate({
                opacity: 0
            }, 150, function() {
                $areal.remove();
            });
            var radius = this.radius;
            var damage = this.damage;
            $("body").append($areal);
            zombies.forEach(function(value) {
                if (zombie != value && getLength(zombie, value) < radius)
                    value.damage(damage);
            });
        }
    }

    function initDOMImage() {
        var skin = $("<div/>").addClass("knight");
        self.$image.append(skin);
        return self.$image;
    };
}

Knight.prototype = Object.create(Man.prototype);
Knight.prototype.constructor = Knight;