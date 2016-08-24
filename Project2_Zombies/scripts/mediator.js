$(function() {
    $("#btnGenerate").click(generateClick);
    $("#btnReset").click(resetClick);
    $("#btnSlowUp").click(slowUpClick);
    $("#btnGrowOld").click(growOldClick);
    $("#btnExplode").click(explodeClick);

    var $btnPlay = $("#btnPlay");
    $btnPlay.click(playClick);

    var $btnSetBomb = $("#btnSetBomb");
    var $btnNuclearBomb = $("#btnNuclearBomb");
    var $btnCallSolder = $("#btnCallSolder");
    var $btnCallKnight = $("#btnCallKnight");
    var score = 0;
    toggleButtons();

    var $field = $("#field")
    var $document = $(document);
    var $fieldLines = $(".field-line").toArray();
    var LINE_LENGTH = $("#field").width();
    var movementTimeoutId = setTimeout(moveZombies, movementInterval);

    var zombies = [];
    var LINE_COUNT = 5;
    var movementInterval = 100;
    var killedZombies = 0;
    var currentLevel = 0;

    var playTimeoutId = 0;
    var startPlatIntervalTimeout = 2000;
    var currentPlayIntervalTimeout = startPlatIntervalTimeout;

    function playClick() {
        toggleButtons();
        var callback = function playTimeoutCallback() {
            generateClick();
            playTimeoutId = setTimeout(playTimeoutCallback, currentPlayIntervalTimeout);
        };
        generateClick();
        if (playTimeoutId == 0)
            playTimeoutId = setTimeout(callback, currentPlayIntervalTimeout);

        $field.animate({ opacity: 1 }, 200);
        $btnPlay.unbind("click", playClick);
        $btnPlay.click(stopClick);
        $btnPlay.removeClass("adding").addClass("stop");
        $btnPlay.find("p").text("Stop");
    }

    function stopClick() {
        clearTimeout(playTimeoutId);
        clearTimeout(movementTimeoutId);
        movementTimeoutId = 0;
        playTimeoutId = 0;

        $field.animate({ opacity: 0.5 }, 500);
        $btnPlay.unbind("click", stopClick);
        $btnPlay.click(playClick);
        $btnPlay.removeClass("stop").addClass("adding");
        $btnPlay.find("p").text("Play");
    }

    function resetClick() {
        stopClick();
        toggleButtons();
        zombies.forEach(function(value) {
            value.die();
        })
        zombies = [];
        clearScore();
    }

    function generateClick() {
        $(".game-over").fadeOut();
        var zombie;
        var line = random(0, LINE_COUNT);
        switch (random(1, 3)) {
            case 1:
                zombie = new Michael(0, line);
                break;
            case 2:
                zombie = new Strong(0, line);
                break;
            case 3:
                zombie = new Fatso(0, line);
                break;
        }

        if (goSlowly)
            zombie.slow();

        zombie.$image.click(zombieClick);
        zombie.show($fieldLines[line]);
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
            value.move(movementInterval);
        })
        movementTimeoutId = setTimeout(moveZombies, movementInterval);
    }

    function killZombies() {
        zombies.forEach(function(zombie, index, array) {
            if (zombie.position >= LINE_LENGTH || zombie.health <= 0.01) {
                zombie.die();
                array.splice(index, 1);
                if (zombie.position >= LINE_LENGTH) {
                    gameOver();
                }
                increaseScore(zombie);
            }
        });
    }

    function clearScore() {
        score = 0;
        killedZombies = 0;
        updateScore();
    }

    function increaseScore(zombie) {
        killedZombies++;
        score += zombie.maxHealth;
        updateScore();
    }

    function updateScore() {
        $("#score").text(score);
        $("#kills").text(killedZombies);
        updateLevel();
        toggleButtons();
    }

    function updateLevel() {
        if (killedZombies / 10 >= currentLevel) {
            currentLevel = Math.floor(killedZombies / 10);
            currentPlayIntervalTimeout = startPlatIntervalTimeout - currentLevel * 50;
        }
    }

    function toggleButtons() {
        $btnSetBomb.addClass("blocked");
        $btnSetBomb.unbind("click", setBombClick);
        $btnNuclearBomb.addClass("blocked");
        $btnNuclearBomb.unbind("click", nuclearBombClick);
        $btnCallSolder.addClass("blocked");
        $btnCallSolder.unbind("click", callSolderClick);
        $btnCallKnight.addClass("blocked");
        $btnCallKnight.unbind("click", callKnightClick);
        if (score > 1000) {
            $btnSetBomb.removeClass("blocked");
            $btnSetBomb.click(setBombClick);
            $btnCallSolder.removeClass("blocked");
            $btnCallSolder.click(callSolderClick);
        }
        if (score > 2000) {
            $btnCallKnight.removeClass("blocked");
            $btnCallKnight.click(callKnightClick);
        }
        if (score > 5000) {
            $btnNuclearBomb.removeClass("blocked");
            $btnNuclearBomb.click(nuclearBombClick);
        }
    }

    function gameOver() {
        $over = $(".game-over");
        $over.fadeIn();
        $over.find(".score").text(score);
        resetClick();
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
        score -= 5000;
        updateScore();
        var bomb = new NuclearBomb();
        bomb.explode($field, function() {
            zombies.forEach(function(zombie) {
                zombie.damage(zombie.maxHealth);
            });
        });
    }

    function setBombClick() {
        score -= 1000;
        updateScore();
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



    function getLeftOffset(object, posX) {
        var offset = $(object).offset();
        return parseInt(posX) - offset.left - 20;
    }


    var man = null;

    function callSolderClick() {
        score -= 1000;
        man = new Solder();
        callMan();
    }

    function callKnightClick() {
        score -= 2000;
        man = new Knight();
        callMan();
    }


    function callMan() {
        $(".field-line-warrior-position").addClass("coverable").click(warriorPositionClick);
    }

    function warriorPositionClick() {
        $positions = $(".field-line-warrior-position");
        $positions.removeClass("coverable").unbind("click", warriorPositionClick);
        line = $positions.index(this);
        $position = this;
        if (man != null) {
            man.show($position, line);
            var intervalId = setInterval(function() {
                man.fire(zombies);
                if (man.leftTime <= 0) {
                    clearInterval(intervalId);
                    man.die();
                }
            }, man.rate);
            man == null;
        }
    }

});

function getLength(obj1, obj2) {
    var offset1 = obj1.$image.offset();
    var offset2 = obj2.$image.offset();
    return Math.sqrt(Math.pow(offset1.left - offset2.left, 2) + Math.pow(offset1.top - offset2.top, 2));
}

function random(min, max) {
    return Math.floor((Math.random() * max) + min);
}

function bind(func, context) {
    return function() {
        return func.apply(context, arguments);
    };
}