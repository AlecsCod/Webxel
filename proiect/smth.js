function isNumber(event) {
    var keycode = event.keycode;
    if (keycode > 48 && keycode < 57) {
        return true;
    }
    return false;
}