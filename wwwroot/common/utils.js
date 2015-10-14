var u_timeToString = function (dateTime) {
    var d = new Date(dateTime);
    var minutes = d.getMinutes();
    if (minutes < 10)
        minutes = "0" + minutes;

    return d.getHours() + ":" + minutes;

};

var u_reverse = function (itemA, itemB) {
    if (itemA.time > itemB.time)
        return -1;
    else if (itemA.time < itemB.time)
        return 1;
    else
        return 0;

};