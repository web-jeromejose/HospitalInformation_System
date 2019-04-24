var tblSelected;
var ipid;
$(function () {
    $('.dt').datepicker({
        format: 'M yyyy',
        toggleActive: true,
        autoclose: true,
        viewMode: "months",
        minViewMode: "months"
    });
});
$(document).ready(function () {

    $("#btn-aramco").click(function () {
        var dlink = $("#url").data("urllink");
        var dd = moment($(".dt").val(), 'MMM YYYY');
        var m = dd.get('month') + 1;
        var y = dd.get('year');
        var repsrc = dlink + "?YEAR=" + y + "&MONTH=" + m;
        openNewWindow(repsrc);
    });
});

function openNewWindow(link) {
    $("#rrpt").attr('src', link);
}