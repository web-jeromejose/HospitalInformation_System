$(function () {
    bindPatientList(function () {
        View();
    });
});

$(document).ready(function () {
    $("#btnview").on("click", function () {
        View();
    });
    $(document).on("click", ".history", function (e) {
        alert('j');
    });
});
function View() {
    ajaxWrapper.Get($("#url").data("folder"), { "Regno": $("#txtpatientID").val() }, function (xdata, e) {        
        $("#detail").html(xdata);
        $("#browser").treeview();
    });
}

   