$(function() {
    $generateButton = $("#btnGenerate");
    $generateButton.click(generateClick);
    var LINE_LENGTH = $("#field").width();
    var movementTimeoutId = setTimeout(moveZombies, movementInterval);
    var fieldLines = $(".field-line").toArray();
    var zombies = [];
    var LINE_COUNT = 5;
    var movementInterval = 100;
    var movementSpeed = 1;
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
            if (value.position >= LINE_LENGTH - movementSpeed) {
                value.die();
                array.splice(index, 1);
            }
        })
    }

    function generateClick() {
        var zombie;
        if (random(1, 2) == 1) {
            zombie = new Michael(0, 100);
        } else {
            zombie = new Strong(0, 100);
        }
        zombie.show(fieldLines[random(0, LINE_COUNT)]);
        zombies.push(zombie);
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