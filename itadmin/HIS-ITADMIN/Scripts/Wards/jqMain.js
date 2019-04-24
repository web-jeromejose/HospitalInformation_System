
var ajaxWrapper = $.ajaxWrapper();
$(function () {
    View();
    $('.sTip').powerTip({
        placement: 's',
        smartPlacement: true
    });
});

$(document).ready(function () {
    $(document).on("click", ".bed", function (e) {
        var IPID = $(this).data('ipid');
        ViewData(IPID)
        setCookie('RegNo', IPID, 1);
    });

    $(document).on("click", ".btnshortcut", function (e) {

        document.location = $(this).data("url");
    });

});

function View() {
    ajaxWrapper.Get($("#bedlist").data("result"), null, function (xdata, e) {
        $("#bedlist").html(xdata);
    });
}

function ViewData(IPID) {
    ajaxWrapper.Get($("#bedlist").data("patient"), { "ipid": IPID }, function (d, e) {
        $("#txtpin").text(d["PIN"]);
        $("#txtdate").text(d["AdmitDateTime"]);
        $("#txtbedno").text(d["BedNo"]);
        $("#txtward").text(d["StationName"]);
        $("#txtpatient").text(d["PatientName"]);
        $("#txtage").text(d["Age"]);
        $("#txtsex").text(d["Sex"]);
        $("#txtcompany").text(d["CompanyName"]);
        $("#txtdrug").text(d["Drug"]);
        $("#txtdoc").text(d["DoctorName"]);
        $("#txtadd").text("");
    });
}