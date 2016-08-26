$(function() {
    //initialize base state;
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
    //turn off skills buttons
    toggleButtons();

    var $field = $("#field")
    var $document = $(document);
    var $fieldLines = $(".field-line").toArray();
    var LINE_LENGTH = $("#field").width();
    var movementTimeoutId = setTimeout(moveZombies, movementInterval);

    var mans = [];
    var zombies = [];
    var LINE_COUNT = 5;
    var movementInterval = 100;
    var killedZombies = 0;
    var currentLevel = 0;

    var playTimeoutId = 0;
    var startPlatIntervalTimeout = 2000;
    var currentPlayIntervalTimeout = startPlatIntervalTimeout;

    //process Play button click
    function playClick() {
        toggleButtons();
        //create callback function for creating zombies
        var callback = function playTimeoutCallback() {
            for (var i = 0; i < 5; i++) {
                generateClick();
            }
            playTimeoutId = setTimeout(playTimeoutCallback, currentPlayIntervalTimeout);
        };
        for (var i = 0; i < 5; i++) {
            generateClick();
        }
        //start game
        if (playTimeoutId == 0)
            playTimeoutId = setTimeout(callback, currentPlayIntervalTimeout);

        //change button to Stop state
        $field.animate({ opacity: 1 }, 200);
        $btnPlay.unbind("click", playClick);
        $btnPlay.click(stopClick);
        $btnPlay.removeClass("adding").addClass("stop");
        $btnPlay.find("p").text("Stop");
    }

    //process Stop button click
    function stopClick() {
        //clear creating and movement timeouts
        clearTimeout(playTimeoutId);
        clearTimeout(movementTimeoutId);
        movementTimeoutId = 0;
        playTimeoutId = 0;

        //change button to Play state
        $field.animate({ opacity: 0.5 }, 200);
        $btnPlay.unbind("click", stopClick);
        $btnPlay.click(playClick);
        $btnPlay.removeClass("stop").addClass("adding");
        $btnPlay.find("p").text("Play");
    }

    //Reset states of game to initial values
    function resetClick() {
        stopClick();
        toggleButtons();
        zombies.forEach(function(value) {
            value.die();
        });
        mans.forEach(function(value) {
            value.die();
        });
        mans = [];
        zombies = [];
        clearScore();
    }

    //generate new zombie
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

    //process click on zombie(make damage)
    function zombieClick() {
        $this = $(this);
        var zombie = zombies.filter(function(zombie) {
            return $this.is(zombie.$image);
        })[0];
        zombie.damage(clickDamage);
    }

    //process zombie movement
    function moveZombies() {
        killZombies();
        zombies.forEach(function(value, index, array) {
            value.move(movementInterval);
        })
        movementTimeoutId = setTimeout(moveZombies, movementInterval);
    }
    //kill zombies that lost all hp
    function killZombies() {
        zombies.forEach(function(zombie, index, array) {
            if (zombie.position >= LINE_LENGTH || zombie.health <= 0.01) {
                zombie.die();
                array.splice(index, 1);
                if (zombie.position >= LINE_LENGTH) {
                    gameOver();
                } else {
                    increaseScore(zombie);
                }
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
    //update score text
    function updateScore() {
        $("#score").text(score);
        $("#kills").text(killedZombies);
        $("#level").text(currentLevel + 1);
        updateLevel();
        toggleButtons();
    }

    //update current level and zombie generation rate
    function updateLevel() {
        currentLevel = Math.min(Math.floor(killedZombies / 10), 35);
        currentPlayIntervalTimeout = Math.max(startPlatIntervalTimeout - currentLevel * 50, 250);
    }

    //turn on/off skills buttons
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

    //proccess game over state
    function gameOver() {
        $over = $(".game-over");
        $over.fadeIn();
        $over.find(".score").text(score);
        resetClick();
    }

    var slowUpTimeoutId
    var slowUpTimeout = 10000;
    var goSlowly = false;

    //process SlowUp button click
    function slowUpClick() {
        if (slowUpTimeoutId != null)
            clearTimeout(slowUpTimeoutId);
        slowZombies();
        slowUpTimeoutId = setTimeout(speedZombies, slowUpTimeout);
    }

    //slow all zombies
    function slowZombies() {
        goSlowly = true;
        zombies.forEach(function(zombie) {
            zombie.slow();
        })
    }

    //speed up all zombies
    function speedZombies() {
        goSlowly = false;
        zombies.forEach(function(zombie) {
            zombie.fast();
        })
    }

    var growOldTimeoutId
    var growOldTimeout = 1000;
    var growOldDamage = 5;
    var explodeDamage = 15;

    //process GrowOld button click
    function growOldClick() {
        if (growOldTimeoutId != null)
            clearTimeout(growOldTimeoutId);
        damageZombies(growOldDamage, 0);
    }
    //damage zombies
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

    //process Explode button click
    function explodeClick() {
        zombies.forEach(function(zombie) {
            zombie.damage(explodeDamage);
        });
    }

    //process Nuclear bomb button click
    function nuclearBombClick() {
        score -= 5000;
        updateScore();
        //create new bomb, start exploding animation, 
        //pass callback function that damage zombies
        var bomb = new NuclearBomb();
        bomb.explode($field, function() {
            zombies.forEach(function(zombie) {
                zombie.damage(zombie.maxHealth);
            });
        });
    }

    //process Set bomb button click
    function setBombClick() {
        score -= 1000;
        updateScore();
        //create new bomb
        var bomb = new Bomb(0, 0)
        bomb.makeMoveable();
        //create drag-drop effect
        var $bomb = $('#moveable_bomb');
        $(document).on('mousemove', function(e) {
            $('#moveable_bomb').css({
                left: e.pageX - 10,
                top: e.pageY - 35,
            });
        });

        //function for setting bomb on field
        var lineClick = function() {
            $(".field-line").unbind('click', lineClick);
            bomb.setBomb(this, 0, getLeftOffset(this, $('#moveable_bomb').css("left")));
            startExplode(bomb);
        };
        $(".field-line").click(lineClick);
    }

    //start bomb exploding
    function startExplode(bomb) {
        setTimeout(function() {
            bomb.explode(explodeCallback);
        }, 1000);
    }
    //callback for bomb explode that damage zombies
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
    //proccess CallSolder button click
    function callSolderClick() {
        score -= 1000;
        man = new Solder();
        callMan();
    }

    //proccess CallKnight button click
    function callKnightClick() {
        score -= 2000;
        man = new Knight();
        callMan();
    }
    //init fireplace to "can set man" state 
    function callMan() {
        $(".field-line-warrior-position").addClass("coverable").click(warriorPositionClick);
    }

    //set man on fireplace
    function warriorPositionClick() {
        //get position
        $positions = $(".field-line-warrior-position");
        $positions.removeClass("coverable").unbind("click", warriorPositionClick);
        line = $positions.index(this);
        $position = this;
        if (man != null) {
            mans.push(man);
            var newMan = man;
            //show new man
            newMan.show($position, line);
            //start man fire
            var intervalId = setInterval(function() {
                newMan.fire(zombies);
                if (newMan.leftTime <= 0) {
                    clearInterval(intervalId);
                    newMan.die();
                    var index = mans.indexOf(newMan);
                    mans.splice(index, 1);
                }
            }, newMan.rate);
            man == null;
        }
    }

});

//return absolute length between to juery objects
function getLength(obj1, obj2) {
    var offset1 = obj1.$image.offset();
    var offset2 = obj2.$image.offset();
    return Math.sqrt(Math.pow(offset1.left - offset2.left, 2) + Math.pow(offset1.top - offset2.top, 2));
}

//return random number
function random(min, max) {
    return Math.floor((Math.random() * max) + min);
}

//binding context to the function
function bind(func, context) {
    return function() {
        return func.apply(context, arguments);
    };
}