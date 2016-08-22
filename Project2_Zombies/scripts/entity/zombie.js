function Zombie(position) {
    this.position = position;
    this.$image = createDOMImage();
    Zombie.prototype.maxHealth = 50;
    Zombie.prototype.health = this.maxHealth;
    Zombie.prototype.minSpeed = 1;
    Zombie.prototype.currentSpeed = this.minSpeed;

    Zombie.prototype.show = function($field) {
        this.$image.css('right', this.position);
        $($field).append(this.$image);
    }
    Zombie.prototype.move = function(time) {
        this.position = parseInt(this.$image.css('right')) + this.$image.width();
        this.$image.animate({
                right: "+=" + this.currentSpeed,
            },
            time);
    }
    Zombie.prototype.die = function(time) {
        if (+time == undefined)
            time = 500;
        this.$image.fadeOut(time, bind(this.$image.remove, this.$image));
    }

    Zombie.prototype.damage = function(value) {
        this.health -= value;

        if (this.health <= 0) {
            this.$image.find(".progress").addClass("defeat");
            this.$image.find(".progress-bar").css("width", 0);
        } else {
            var percent = this.health / this.maxHealth * 100 + "%";
            this.$image.find(".progress-bar").css("width", percent);
        }
    }

    Zombie.prototype.slow = function() {
        this.currentSpeed = this.minSpeed;
    }

    Zombie.prototype.fast = function() {
        this.currentSpeed = this.speed;
    }

    function createDOMImage() {
        var $progress = $("<div/>").addClass("progress");
        var $progressBar = $("<div/>").addClass("progress-bar").css("width", "100%");
        $progress.append($progressBar);
        var $image = $("<div/>").addClass("zombie");
        $image.append($progress);
        return $image;
    }
}