$(function() {
    $generateButton = $("#btnGenerate");
    $generateButton.click(generateClick);
    $("#btnSlowUp").click(slowUpClick);
    $("#btnGrowOld").click(growOldClick);
    $("#btnExplode").click(explodeClick);
    var LINE_LENGTH = $("#field").width();
    var movementTimeoutId = setTimeout(moveZombies, movementInterval);
    var fieldLines = $(".field-line").toArray();
    var zombies = [];
    var LINE_COUNT = 5;
    var movementInterval = 100;
    var movementSpeed = 10;
    var $generateButton;

    function moveZombies() {
        killZombies();
        zombies.forEach(function(value, index, array) {
            value.move(movementSpeed, movementInterval);
        })
        movementTimeoutId = setTimeout(moveZombies, movementInterval);
    }

    function killZombies() {
        zombies.forEach(function(value, index, array) {
            if (value.position >= LINE_LENGTH - movementSpeed || value.health <= 0.01) {
                value.die();
                array.splice(index, 1);
                if (value.position >= LINE_LENGTH - movementSpeed) {
                    gameOver();
                }
            }
        });
    }

    function gameOver() {
        zombies.forEach(function(value) {
            value.die();
        })
        zombies = [];
        $(".game-over").fadeIn();
    }

    function generateClick() {
        $(".game-over").fadeOut();
        var zombie;
        if (random(1, 2) == 1) {
            zombie = new Michael(0);
        } else {
            zombie = new Strong(0);
        }
        zombie.show(fieldLines[random(0, LINE_COUNT)]);
        zombies.push(zombie);
    }

    var slowUpTimeoutId
    var slowUpTimeout = 10000;

    function slowUpClick() {
        if (slowUpTimeoutId != null)
            clearTimeout(slowUpTimeoutId);
        slowZombies();
        slowUpTimeoutId = setTimeout(speedZombies, slowUpTimeout);
    }

    function slowZombies() {
        zombies.forEach(function(zombie) {
            zombie.slow();
        })
    }

    function speedZombies() {
        zombies.forEach(function(zombie) {
            zombie.fast();
        })
    }

    var growOldTimeoutId
    var growOldTimeout = 1000;
    var growOldDamage = 1;
    var explodeDamage = 15;

    function growOldClick() {
        if (growOldTimeoutId != null)
            clearTimeout(growOldTimeoutId);
        damageZombies(growOldDamage, 1)
    }

    function damageZombies(hit, iteration) {
        zombies.forEach(function(zombie) {
            zombie.damage(hit);
        });
        killZombies();
        iteration++;
        if (iteration < 10) {
            growOldTimeoutId = setTimeout(damageZombies, growOldTimeout, hit, iteration);
        }
    }

    function explodeClick() {
        zombies.forEach(function(zombie) {
            zombie.damage(explodeDamage);
        });
    }

    function random(min, max) {
        return Math.floor((Math.random() * max) + min);
    }
});

function bind(func, context) {
    return function() {
        return func.apply(context, arguments);
    };
}