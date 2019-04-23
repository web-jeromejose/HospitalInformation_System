/*
    January 13, 2015
    Global settings for 
    - Application Name [FHD]
    - Server name      [FHD]
    - Other Settings please include in the comment
*/
var appsname = ''; /* change with application folder (empty for local testing) */
var baseURL;
var hissystem = {
    appsserver: function () {
        sname = location.protocol + '//' + location.hostname + (location.port ? ':' + location.port : '') + '/';
        return (sname);
    },
    appsname: function () {
        if (appsname.length == 0) {
            return (appsname);
        } else {
            return (appsname + '/');
        }
    },
    baseurl: function (c) {
        return ($(c).data("baseurl") + "/");
    }
}

function FixUrl(ControlerAction) {
    var elements = ControlerAction.split("/");
    var url = ControlerAction;
    if (elements.length == 0) return url;
    return (elements[0] == baseURL) ? baseURL + elements[1] : hissystem.appsserver() + hissystem.appsname() + ControlerAction;
}

$(document).ready(function () {
    baseURL = hissystem.baseurl(".his-base-url");
    //console.log(baseURL);
    //console.log(hissystem.appsserver(".his-base-url"));
    //console.log(hissystem.appsname(".his-base-url"));
});
