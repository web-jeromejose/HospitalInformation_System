var tristate = {
    click: function (e) {
        var cs = $(e).data('tristate');
        if (cs < 2) {
            tristate.change(e, (cs + 1));
            return (cs + 1);
        } else {
            tristate.change(e, 0);
            return 0;
        }
    },
    change: function (e, s) {
        if (s == 0) {
            $(e).removeClass('sgh-tristate-2');
            $(e).removeClass('sgh-tristate-3');
            $(e).addClass('sgh-tristate-1');
            $(e).data('tristate', 0);
            $(e).html('A');
        } else if (s == 1) {
            $(e).removeClass('sgh-tristate-1');
            $(e).removeClass('sgh-tristate-3');
            $(e).addClass('sgh-tristate-2');
            $(e).data('tristate', 1);
            $(e).html('B');
        } else if (s == 2) {
            $(e).removeClass('sgh-tristate-1');
            $(e).removeClass('sgh-tristate-2');
            $(e).addClass('sgh-tristate-3');
            $(e).data('tristate', 2);
            $(e).html('D');
        }
    }
}
var duostate = {
    click: function (e) {
        var cs = $(e).data('duostate');
        if (cs == 0) {
            duostate.change(e, (cs + 1));
            return (cs + 1);
        } else {
            duostate.change(e, 0);
            return 0;
        }
    },
    change: function (e, s) {
        if (s == 0) {
            $(e).removeClass('sgh-tristate-3');
            $(e).addClass('sgh-tristate-1');
            $(e).data('duostate', 0);
            $(e).html('iN');
        } else if (s == 1) {
            $(e).removeClass('sgh-tristate-1');
            $(e).addClass('sgh-tristate-3');
            $(e).data('duostate', 1);
            $(e).html('EX');
        }
    }
}

var dstate = {
    click: function (e) {
        var cs = $(e).data('duostate');
        if (cs == 0) {
            dstate.change(e, (cs + 1));
            return (cs + 1);
        } else {
            dstate.change(e, 0);
            return 0;
        }
    },
    change: function (e, s) {
        if (s == 0) {
            $(e).removeClass('sgh-tristate-3');
            $(e).addClass('sgh-tristate-1');
            $(e).data('duostate', 0);
            $(e).html('<span class="glyphicon glyphicon-ok"></span>');
        } else if (s == 1) {
            $(e).removeClass('sgh-tristate-1');
            $(e).addClass('sgh-tristate-3');
            $(e).data('duostate', 1);
            $(e).html('<span class="glyphicon glyphicon-remove"></span>');
        }
    }
}

var distate = {
    click: function (e) {
        var cs = $(e).data('distate');
        if (cs == 0) {
            distate.change(e, (cs + 1));
            return (cs + 1);
        } else {
            distate.change(e, 0);
            return 0;
        }
    },
    change: function (e, s) {
        if (s == 0) {
            $(e).removeClass('sgh-tristate-ds');
            $(e).addClass('sgh-tristate-en');
            $(e).data('distate', 0);
        } else if (s == 1) {
            $(e).removeClass('sgh-tristate-en');
            $(e).addClass('sgh-tristate-ds');
            $(e).data('distate', 1);
        }
    }
}