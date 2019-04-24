var tbl;
$(function () {
    bindPatientList(function () {
        ViewResult(0);
        ViewOldResult();
        ViewEndoscopy();
        ViewEndoscopyOld();
        ViewCath();
    });
});

$(document).ready(function () {
    $(document).on("dblclick", "#tbl-result-list td", function () {

            var tr = $(this).closest('tr');
            var d = tbl.row($(this).parents('tr')).data();
            generate_report($("#txtpatientID").val(), d["OrderNo"], d["TestID"])
            
        
    });

    $(document).on("click", "#btnview", function () {
        ViewResult(0);
        ViewOldResult();
        ViewEndoscopy();
        ViewEndoscopyOld();
        ViewCath();
    });
});

function ViewResult(panic) {
    ajaxWrapper.Get($("#url").data("result"), { "RegNo": $("#txtpatientID").val(), "Panic": panic }, function (xdata, e) {
        tbl = $("#tbl-result-list").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: false,
            info: false,
            data: xdata,
            columns: [
                { data: "sOrderNo" },
                { data: "Doctor" },
                { data: "Section" },
                { data: "Code" },
                { data: "TestName" },
                { data: "OrderDateTime" }
            ],
            fnRowCallback: function (nRow, aData) {
                var TestDoneBy = aData["TestDoneBy"];
                var VerifiyBy = aData["VerifiyBy"];
                var $nRow = $(nRow);

                if (VerifiyBy !== "0") {
                    $nRow.css({ "background-color": "#dff0d8" })
                }
                else if (TestDoneBy !== "0") {
                    $nRow.css({ "background-color": "#fcf8e3" })
                }
                else {
                    $nRow.addClass("danger");
                }

                return nRow
            }
        });
    });
}
function ViewOldResult() {
    ajaxWrapper.Get($("#url").data("oldresult"), { "RegNo": $("#txtpatientID").val() }, function (xdata, e) {        
        $("#tbl-oldresult-list").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: false,
            info: false,
            data: xdata,
            columns: [
                { data: "DateCompleted" },
                { data: "Doctor" },
                { data: "Code" },
                { data: "TestName" },
                { data: "PType" }
            ]
        });
    });
}

function ViewEndoscopy() {
    ajaxWrapper.Get($("#url").data("endoscopy"), { "RegNo": $("#txtpatientID").val() }, function (xdata, e) {
        $("#tbl-endosreport-list").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: false,
            info: false,
            data: xdata,
            columns: [
                { data: "BillNo" },
                { data: "OrderDateTime" },
                { data: "BillNo" },
                { data: "PType" },
                { data: "TestName" }
            ]
        });
    });
}

function ViewEndoscopyOld() {
    ajaxWrapper.Get($("#url").data("endoscopyold"), { "RegNo": $("#txtpatientID").val() }, function (xdata, e) {
        $("#tbl-oldendosreport-list").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: false,
            info: false,
            data: xdata,
            columns: [
                { data: "Row" },
                { data: "VisitDate" },
                { data: "Room" },
                { data: "TestName" }
            ]
        });
    });
}
function ViewCath() {
    ajaxWrapper.Get($("#url").data("cath"), { "RegNo": $("#txtpatientID").val() }, function (xdata, e) {
        $("#tbl-cathlabreps-list").DataTable({
            destroy: true,
            paging: false,
            searching: true,
            ordering: false,
            info: false,
            data: xdata,
            columns: [
                { data: "OrderDateTime" },
                { data: "TestName" }
            ]
        });
    });
}

function generate_report(Reg, Order, TID) {
    var dlink = $("#tbl-result-list").data("urllink");
    var repsrc = dlink + "?Reg=" + Reg + "&Order=" + Order + "&TID=" + TID;
    openNewWindow(repsrc);
}

function openNewWindow(link) {
    //popupWin = window.open(link, 'open_window', 'status, scrollbars, resizable,independent, width=640, height=480, left=0, top=0')
    $("._message-result").modal({ keyboard: true });
    $("#rrpt").attr('src', link);
}