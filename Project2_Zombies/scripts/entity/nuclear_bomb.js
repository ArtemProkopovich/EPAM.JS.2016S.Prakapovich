function NuclearBomb() {
    this.$image = createDOMImage();
    this.explode = function($field) {
        $field.append(this.$image);
        this.$image.animate({ top: 150, left: 400 }, 1000, function() {
            $explode = $("<div/>").addClass("explode-field").appendTo($field);
            $explode.fadeOut(1000, function() {
                $explode.remove();
            });
            this.remove();
        });
    }

    function createDOMImage() {
        var $image = $("<div/>").addClass("nuclear-bomb");
        return $image;
    }
}