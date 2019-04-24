//$(function () {
//    InitOtherProcList();
//    InitNurseProcList();
//    InitProfileList();
//    InitTestList();
//    InitDrugList();
//});

$(function () {
    StationList();
    InitTooltip();
});
var OtherProcList = [];
var NurseProcList = [];

function StationList() {
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#urllist").data("stationlist"),
        success: function (data) {
            for (var i = 0; i < data.length; i++) {
                $("#txtstation").append('<li><a href="#" class="listation" data-id=' + data[i].ID + ' >' + data[i].Name + '</a></li>');
            }
        }
    });
}


$(document).ready(function () {
    $(document).on("click", ".listation", function () { 
        var iid = $(this).data('id');
        $.ajax({
            cache: false,
            url: $("#urllist").data("setstation"),
            type: 'POST',
            data: {
                stationId: iid
            },
            success: function (data) {
                document.location = $("#urllist").data("reload");
            }
        });
    });
});


function InitOtherProcList() {
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#urllist").data("otherproclists"),
        success: function (data) {
            OtherProcList = data.xdata;
        }
    });
}

function InitNurseProcList() {
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#urllist").data("nurselists"),
        success: function (data) {
            NurseProcList = data.xdata;
        }
    });
}

var ProfileList;
function InitProfileList() {
    $.ajax({
        cache: false,
        type: 'GET',
        data: { "prof": "1" },
        url: $("#urllist").data("testlist"),
        success: function (data) {
            ProfileList = data.xdata;
        }
    });
}

var TestList;
function InitTestList() {
    $.ajax({
        cache: false,
        type: 'GET',
        data: { "prof": "0" },
        url: $("#urllist").data("testlist"),
        success: function (data) {
            TestList = data.xdata;
        }
    });
}


var DrugList = [];
function InitDrugList() {
    $.ajax({
        cache: false,
        type: 'GET',
        url: $("#urllist").data("druglist"),
        success: function (data) {
            DrugList = data.xdata;
        }
    });
}


function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
    var expires = "expires=" + d.toUTCString();
    document.cookie = cname + "=" + cvalue + "; " + expires + "; path=/";
}
function getCookie(cname) {
    var name = cname + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') c = c.substring(1);
        if (c.indexOf(name) != -1) return c.substring(name.length, c.length);
    }
    return "";
}

function InitTooltip() {    
    $('.sTip').powerTip({
        placement: 's',
        smartPlacement: true
    }); 
}