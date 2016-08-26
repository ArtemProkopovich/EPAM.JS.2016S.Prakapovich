function Zombie(position, line) {
    this.$image = createDOMImage();
    this.position = position;
    this.line = line;
    Zombie.prototype.maxHealth = 50;
    Zombie.prototype.health = this.maxHealth;
    Zombie.prototype.minSpeed = 1;
    Zombie.prototype.currentSpeed = this.minSpeed;

    //Show zombie on field
    Zombie.prototype.show = function($field) {
        this.$image.css('right', this.position);
        $($field).append(this.$image);
    }

    //animate zombie movement
    Zombie.prototype.move = function(time) {
        this.position = parseInt(this.$image.css('right')) + this.$image.width();
        this.$image.animate({
                right: "+=" + this.currentSpeed,
            },
            time);
    }

    //remove zombie from screen
    Zombie.prototype.die = function(time) {
        if (+time == undefined)
            time = 500;
        this.$image.fadeOut(time, bind(this.$image.remove, this.$image));
    }

    //decrease zombie health and change progress-bar status
    Zombie.prototype.damage = function(value) {
        this.health -= value;

        if (this.health <= 0) {
            this.$image.find(".progress").addClass("defeat");
            this.$image.find(".progress-bar").css("width", 0);
        } else {
            var percent = this.health / this.maxHealth * 100 + "%";
            $pb = this.$image.find(".progress-bar");
            this.$image.find(".progress-bar").css("width", percent);
        }
    }

    //slow zombies to the base speed
    Zombie.prototype.slow = function() {
        this.currentSpeed = this.minSpeed;
    }

    //return speed to the normal value
    Zombie.prototype.fast = function() {
        this.currentSpeed = this.speed;
    }

    //create base image for zombie
    function createDOMImage() {
        var $progress = $("<div/>").addClass("progress");
        var $progressBar = $("<div/>").addClass("progress-bar").css("width", "100%");
        $progress.append($progressBar);
        var $image = $("<div/>").addClass("zombie");
        $image.append($progress);
        return $image;
    }
}