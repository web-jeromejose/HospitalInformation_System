/*
    WinContainer v1.0
    By: FHD
    Date: January 25, 2015
    Changelogs:
    -
*/

var wincon = {
    show: function (unique, target, title, area, controller, action) {
        if (area.length > 0) {
            ar = area + '/';
        } else {
            ar = area;
        }
        if (controller.length > 0) {
            c = controller + '/';
        } else {
            c = controller;
        }

        link = ar + c + action;
        menu = '';
        $.ajax({
            url: hissystem.appsserver() + hissystem.appsname() + link,
            type: "POST",
            cache: false,
            success: function (data) {
                if ($('#' + controller).length) {
                } else {
                    cont = '<div class="his-wincon" id=' + unique + '>' +
                                '<div class="his-wincon-headings">' +
                                    '<div class="his-wincon-title">' + title +
                                        '<div class="his-wincon-menu">' + menu + '</div>' +
                                    '</div>' +
                                '</div>' +
                                '<div class="his-wincon-content">' + '</div>' +
                            '</div>';
                }
                $(target).append(cont);

                $('#' + unique).draggable();
            }
        });
    }
}
 