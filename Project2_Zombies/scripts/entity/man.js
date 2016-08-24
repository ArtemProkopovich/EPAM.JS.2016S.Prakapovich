function Man() {
    this.$image = createDOMImage();
    Man.prototype.rate = 100;
    Man.prototype.damage = 10;
    Man.prototype.lifeTime = 10000;
    this.leftTime = this.lifeTime;

    Man.prototype.show = function($position, line) {
        $($position).append(this.$image);
        this.line = line;
    };

    Man.prototype.decreaseLifetime = function(time) {
        this.leftTime -= this.rate;
        var percent = this.leftTime / this.lifeTime * 100 + "%";
        this.$image.find(".progress-bar").css("width", percent);
    }

    Man.prototype.fire = function(zombies) {
        var line = this.line;
        var zombie = zombies.reduce(function(needZombie, zombie) {
            if ((needZombie == null && zombie.line == line) 
                || (zombie.line == line && zombie.position > needZombie.position)) {
                return zombie;
            }
            return needZombie;
        }, null);
        if (zombie != undefined)
            zombie.damage(this.damage);
        this.decreaseLifetime(this.rate);
        return zombie;
    };

    Man.prototype.die = function() {
        this.$image.fadeOut(150, function() {
            this.remove();
        })
    };

    function createDOMImage() {
        var $progress = $("<div/>").addClass("progress");
        var $progressBar = $("<div/>").addClass("progress-bar").css("width", "100%");
        $progress.append($progressBar);
        var $image = $("<div/>").addClass("man");
        $image.append($progress);
        return $image;
    };

}