//инициализируем начальное состояние кнопок: 
//generate-разблокирована, остальные - заблокированы
window.onload = function() {
    unblockButton("#generate", generateClick);
    blockButton("#reset", resetClick);
    blockButton("#set-color", setColorClick);
}

var minBlockCount = 50;
var maxBlockCount = 100;

//обработчик нажатия на кнопку generate
function generateClick() {
    resetClick();
    var blockCount = random(minBlockCount, maxBlockCount);
    var field = $("#field");
    //создаем блоки, добавляем в них числа и добавляем все в основной контейнер
    for (var i = 0; i < blockCount; i++) {
        var number = random(0, 100)
        var block = $("<div/>").addClass("block");
        var text = $("<p/>").text(number);
        block.append(text);
        field.append(block);
    }
    //изменяем состояние кнопок, теперь generate заблокирована.
    blockButton("#generate", generateClick);
    unblockButton("#reset", resetClick);
    unblockButton("#set-color", setColorClick);
}

//обработчик нажатия на кнопку Set Color
function setColorClick() {
    //находим все блоки
    var blocks = $("#field .block").each(function(index, element) {
        var $this = $(this);
        //находим текст в блоке
        var number = $this.find("p").text();
        var color = "#ffffff";
        if (number > 75) {
            color = "#f44336";
        } else if (number > 50) {
            color = "#ff9800";
        } else if (number > 25) {
            color = "#4caf50";
        }
        //добавляем background в соответсвии с числом
        $this.css({
            backgroundColor: color
        });
    });
    //блокируем кнопку
    blockButton("#set-color", setColorClick);
}

//обработчик нажатия на кнпоку reset
function resetClick() {
    //удаляем все блоки из поля
    $("#field .block").remove();
    //меняем состояние кнопок
    blockButton("#reset", resetClick);
    blockButton("#set-color", setColorClick);
    unblockButton("#generate", generateClick);
}
//блокирует нажатие на кнопку
function blockButton(id, func) {
    var button = $(".button" + id);
    button.unbind("click", func);
    changeButtonStyle(button, true);
}

//разблокирует нажатие на кнопку
function unblockButton(id, func) {
    var button = $(".button" + id);
    button.click(func);
    changeButtonStyle(button, false);
}

//изменяет стиь кнопки
function changeButtonStyle(button, blocked) {
    if (blocked) {
        button.addClass("blocked");
    } else {
        button.removeClass("blocked");
    }
}

function random(min, max) {
    return Math.floor((Math.random() * max) + min);
}