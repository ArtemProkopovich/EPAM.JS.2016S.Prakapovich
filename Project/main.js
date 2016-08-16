//инициализируем начальное состояние
$(function() {
    $("#play-button").click(playButtonClick);
    $("#reset-button").click(resetButtonClick);
    $gamefield = $("#game-field");
    gameFieldWidth = $gamefield.width();
    gameFieldHeight = $gamefield.height();
    //список ресурсов, координаты используется для анимации "взрыва" бомбы
    resourceList = [
        { name: "cheese", coordinates: { top: 0, left: -40 } },
        { name: "cherry", coordinates: { top: 0, left: gameFieldWidth } },
        { name: "orange", coordinates: { top: gameFieldHeight - 25, left: -40 } },
        { name: "pumpkin", coordinates: { top: gameFieldHeight - 25, left: gameFieldWidth } }
    ];

    var gameFieldWidth;
    var gameFieldHeight;
    var resourceList;
    var resourceIntervalId;
    var bombIntervalId;
    var bombAppearInterval = 5000;
    var bombFadeTime = 2000;
    var resourceAppearInterval = 500;
    var resourceFadeTime = 700;

    function playButtonClick() {
        if ($("#play-button").hasClass("start-button")) {
            startPlay();
        } else {
            stopPlay();
        }
    }

    //обработка нажатия на кнопку Play
    function startPlay() {
        //для ресурусов, которые остались на поле после остановки игры возвращаем обработку нажатия
        $("#game-field .resource").click(resourceClick).css({ cursor: "pointer" });
        //устанавливаем интервалы для появления ресурсов и бомб
        resourceIntervalId = setInterval(generateResource, resourceAppearInterval);
        bombIntervalId = setInterval(generateBomb, bombAppearInterval);
        //изменяем состояние кнопки на Stop
        changeButton(true);
    }
    //обработка нажатия на кнопку Stop
    function stopPlay() {
        //сбрасываем таймеры появление ресурсов
        clearInterval(resourceIntervalId);
        clearInterval(bombIntervalId);
        //убираем обработку нажатия на ресурсы, оставшиеся на поле
        $("#game-field .resource").unbind("click", resourceClick).css({ cursor: "default" });
        //удаляем бомбы
        $("#game-field .bomb").fadeOut(500, function() {
            $(this).remove();
        });
        //изменяем состояние кнопки на Play
        changeButton(false);
    }
    //обработка нажатия на кнопку Reset
    function resetButtonClick() {
        //Останавливаем игру, удаляем все ресурсы, сбрасываем счетчики
        stopPlay();
        $("#game-field").children().remove();
        $(".resource-panel .score").text("-");
    }

    //генерация ресурса
    function generateResource() {
        var resourceClass = resourceList[random(0, resourceList.length)].name;
        //создаем случайный ресурс
        var block = $("<div/>").addClass("resource").addClass(resourceClass);
        block.css({ top: random(0, gameFieldHeight - 60) + "px", left: random(0, gameFieldWidth - 60) + "px" });
        block.click(resourceClick);
        //добаляем на игровое поле, запускаем отображение
        $("#game-field").append(block);
        block.fadeIn(resourceFadeTime);
    }

    //генерация бомбы
    function generateBomb() {
        var bomb = $("<div/>").addClass("bomb");
        bomb.css({ top: random(0, gameFieldHeight - 60) + "px", left: random(0, gameFieldWidth - 60) + "px" });
        $("#game-field").append(bomb);
        //устанавливаем callback на "взрыв" бомбы после полного отображения
        bomb.fadeIn(bombFadeTime, function() {
            explodeBomb(bomb);
        });
    }
    //обработка нажатия на ресурс
    function resourceClick() {
        $this = $(this);
        for (var i = 0; i < resourceList.length; i++) {
            //находим класс выбранного ресурса
            if ($this.hasClass(resourceList[i].name)) {
                var $textField = $(".resource-panel ." + resourceList[i].name).parent().find(".score");
                //изменяем текст
                if (isNaN($textField.text())) {
                    $textField.text(1);
                } else {
                    $textField.text(+$textField.text() + 1);
                }
                break;
            }
        }
        //удаляем ресурс
        $this.remove();
    }

    //функция взрыва бомбы
    function explodeBomb(bomb) {
        //выбираем ресурс, запускаем анимацию взрыва
        var resource = resourceList[random(0, resourceList.length)]
        bomb.animate({
                left: resource.coordinates.left + "px",
                top: resource.coordinates.top + "px",
                opacity: 0.5,
                width: "25px",
                height: "25px"
            }, 500, "swing",
            //после завершения анимации изменяем значение ресурса и удаляем бомбу
            function() {
                var $textField = $(".resource-panel ." + resource.name).parent().find(".score");
                if (isNaN($textField.text()) || $textField.text() <= 10) {
                    $textField.text("-");
                } else {
                    $textField.text(+$textField.text() - 10);
                }
                bomb.remove();
            });
    }

    //изменяет состояние кнопки Play/Stop 
    function changeButton(stopedState) {
        var $button = $("#play-button");
        if (stopedState) {
            $button.find("p").text("Stop");
            $button.removeClass("start-button");
            $button.addClass("stop-button");
        } else {
            $button.find("p").text("Start");
            $button.removeClass("stop-button");
            $button.addClass("start-button");
        }
    }


    function random(min, max) {
        return Math.floor((Math.random() * max) + min);
    }
});