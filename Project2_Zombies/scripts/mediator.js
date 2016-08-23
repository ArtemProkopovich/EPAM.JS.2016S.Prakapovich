$(function() {
    $("#btnGenerate").click(generateClick);
    $("#btnReset").click(resetClick);
    $("#btnSlowUp").click(slowUpClick);
    $("#btnGrowOld").click(growOldClick);
    $("#btnExplode").click(explodeClick);
    $btnSetBomb = $("#btnSetBomb");
    $btnNuclearBomb = $("#btnNuclearBomb");
    var score = 0;
    toggleButtons();
    var $btnPlay = $("#btnPlay");
    $btnPlay.click(playClick);
    var $field = $("#field")
    var $document = $(document);
    var LINE_LENGTH = $("#field").width();
    var movementTimeoutId = setTimeout(moveZombies, movementInterval);
    var $fieldLines = $(".field-line").toArray();
    var zombies = [];
    var LINE_COUNT = 5;
    var movementInterval = 100;
    var movementSpeed = 10;
    var score = 0;

    var playIntervalId = 0;
    var playIntervalTimeout = 1500;

    function playClick() {
        generateClick();
        if (playIntervalId == 0)
            playIntervalId = setInterval(generateClick, playIntervalTimeout);

        $field.animate({ opacity: 1 }, 200);
        $btnPlay.unbind("click", playClick);
        $btnPlay.click(stopClick);
        $btnPlay.removeClass("adding").addClass("stop");
        $btnPlay.find("p").text("Stop");
    }

    function stopClick() {
        clearInterval(playIntervalId);
        clearTimeout(movementTimeoutId);
        movementTimeoutId = 0;
        playIntervalId = 0;

        $field.animate({ opacity: 0.5 }, 500);
        $btnPlay.unbind("click", stopClick);
        $btnPlay.click(playClick);
        $btnPlay.removeClass("stop").addClass("adding");
        $btnPlay.find("p").text("Play");
    }

    function resetClick() {
        stopClick();
        zombies.forEach(function(value) {
            value.die();
        })
        zombies = [];
        $(".score").text(0);
    }

    function generateClick() {
        $(".game-over").fadeOut();
        var zombie;

        switch (random(1, 3)) {
            case 1:
                zombie = new Michael(0);
                break;
            case 2:
                zombie = new Strong(0);
                break;
            case 3:
                zombie = new Fatso(0);
                break;
        }

        if (goSlowly)
            zombie.slow();

        zombie.$image.click(zombieClick);
        zombie.show($fieldLines[random(0, LINE_COUNT)]);
        zombies.push(zombie);

        $field.animate({ opacity: 1 }, 200);
        if (movementTimeoutId == 0) {
            moveZombies();
        }
    }

    var clickDamage = 10;

    function zombieClick() {
        $this = $(this);
        var zombie = zombies.filter(function(zombie) {
            return $this.is(zombie.$image);
        })[0];
        zombie.damage(clickDamage);
    }

    function moveZombies() {
        killZombies();
        zombies.forEach(function(value, index, array) {
            value.move(movementSpeed, movementInterval);
        })
        movementTimeoutId = setTimeout(moveZombies, movementInterval);
    }

    function killZombies() {
        zombies.forEach(function(zombie, index, array) {
            if (zombie.position >= LINE_LENGTH - movementSpeed || zombie.health <= 0.01) {
                zombie.die();
                array.splice(index, 1);
                increaseScore(zombie);
                if (zombie.position >= LINE_LENGTH - movementSpeed) {
                    gameOver();
                }
            }
        });
    }

    function increaseScore(zombie) {
        score += zombie.maxHealth;
        $(".score").text(score);
        toggleButtons();
    }

    function toggleButtons() {
        $btnSetBomb.addClass("blocked");
        $btnSetBomb.unbind("click", setBombClick);
        $btnNuclearBomb.addClass("blocked");
        $btnNuclearBomb.unbind("click", nuclearBombClick);
        if (score > 1000) {
            $btnSetBomb.removeClass("blocked");
            $btnSetBomb.click(setBombClick);
        }
        if (score > 2000) {
            $btnNuclearBomb.removeClass("blocked");
            $btnNuclearBomb.click(nuclearBombClick);
        }
    }

    function gameOver() {
        resetClick();
        $over = $(".game-over");
        $over.fadeIn();
        $over.find(".score").text(score);
    }

    var slowUpTimeoutId
    var slowUpTimeout = 10000;
    var goSlowly = false;

    function slowUpClick() {
        if (slowUpTimeoutId != null)
            clearTimeout(slowUpTimeoutId);
        slowZombies();
        slowUpTimeoutId = setTimeout(speedZombies, slowUpTimeout);
    }

    function slowZombies() {
        goSlowly = true;
        zombies.forEach(function(zombie) {
            zombie.slow();
        })
    }

    function speedZombies() {
        goSlowly = false;
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

    function nuclearBombClick() {
        score -= 10000;
        var bomb = new NuclearBomb();
        bomb.explode($field);
        zombies.forEach(function(zombie) {
            zombie.damage(zombie.maxHealth);
        });
    }

    function setBombClick() {
        score -= 1000;
        var bomb = new Bomb(0, 0)
        bomb.makeMoveable();
        var $bomb = $('#moveable_bomb');
        $(document).on('mousemove', function(e) {
            $('#moveable_bomb').css({
                left: e.pageX - 10,
                top: e.pageY - 35,
            });
        });

        var lineClick = function() {
            $(".field-line").unbind('click', lineClick);
            bomb.setBomb(this, 0, getLeftOffset(this, $('#moveable_bomb').css("left")));
            startExplode(bomb);
        };
        $(".field-line").click(lineClick);
    }

    function startExplode(bomb) {
        setTimeout(function() {
            bomb.explode(explodeCallback);
        }, 1000);
    }

    function explodeCallback(bomb) {
        zombies.forEach(function(zombie) {
            if (getLength(bomb, zombie) <= 145) {
                zombie.damage(bomb.damage);
            }
        })
    }

    function getLength(bomb, zombie) {
        var bombOffset = bomb.$image.offset();
        var zombieOffset = zombie.$image.offset();
        return Math.sqrt(Math.pow(bombOffset.left - zombieOffset.left, 2) + Math.pow(bombOffset.top - zombieOffset.top, 2));
    }

    function getLeftOffset(object, posX) {
        var offset = $(object).offset();
        return parseInt(posX) - offset.left - 20;
    }

});

function random(min, max) {
    return Math.floor((Math.random() * max) + min);
}

function bind(func, context) {
    return function() {
        return func.apply(context, arguments);
    };
}