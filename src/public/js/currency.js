
$(document).ready(function () {
    $(".custom-file-input").on("change", function () {
        var fileName = $(this).val().split("\\").pop();
        $(this).siblings(".custom-file-label").addClass("selected").html(fileName);
    });

})

$(document).ready(function () {
    var elem = document.getElementById("inputPrice");
    elem.addEventListener("keydown", function (event) {
        var key = event.which;
        if ((key < 48 || key > 57) && key != 8) event.preventDefault();
    });

    elem.addEventListener("keyup", function (event) {
        var value = this.value.replace(/,/g, "");
        this.dataset.currentValue = parseInt(value);
        var caret = value.length - 1;
        while ((caret - 3) > -1) {
            caret -= 3;
            value = value.split('');
            value.splice(caret + 1, 0, ",");
            value = value.join('');
        }
        this.value = value;
    });
});