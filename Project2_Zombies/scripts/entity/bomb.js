function Bomb() {
    this.$image = createDOMImage();
    this.damage = 50;
    this.left = 0;
    this.top = 0;
    this.makeMoveable = function() {
        this.$image.attr("id", "moveable_bomb");
    }

    //start explode animation, then callback function for damage zombies
    this.explode = function(callback) {
        this.$image.removeClass("safety").addClass("explosing");
        setTimeout(function(bomb) {
            var bombOffset = bomb.$image.offset();
            $areal = $("<div/>").addClass("bomb-damage-area").css({
                top: bombOffset.top - 100,
                left: bombOffset.left - 115,
            });
            $areal.animate({
                opacity: 0
            }, 300, function() {
                $areal.remove();
            });
            $("body").append($areal);
            callback(bomb);
            bomb.$image.remove();
        }, 500, this);
    }

    //set bomb on field
    this.setBomb = function(line, posTop, posLeft) {
        this.$image.removeAttr("id", "moveable_bomb");
        this.$image.addClass("safety");
        this.left = posLeft;
        this.top = posTop;
        this.$image.css({
            top: posTop,
            left: posLeft,
        })
        $(line).append(this.$image);
    }

    function createDOMImage() {
        var $image = $("<div/>").addClass("bomb");
        $("body").append($image);
        return $image;
    }
}