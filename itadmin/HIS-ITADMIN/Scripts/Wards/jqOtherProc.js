    var tbl;
var tblSelected;
var CanProc = [];
var DeptID="0";
var ajaxWrapper = $.ajaxWrapper();
$(document).ready(function () {
    InitSelect();
    ViewMain();
    addEditors();
    InitOtherProcList();
    $(document).on("click", "#tbl-other-proc td", function () {
        CanProc = [];
        DeptID = "0";
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var tr = $(this).closest('tr');
            if (tr.hasClass('selected')) {
                tr.removeClass('selected');
            }
            else {
                $('tr.selected').removeClass('selected');
                tr.addClass('selected');
            }
            var d = tbl.row($(this).parents('tr')).data();
            ViewDetail(d);
        }
    });
    $(document).on("click", "#tbl-proc-list td", function (e) {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var d = TableOtherProc.row($(this).parents('tr')).data();
            var ID = d["ID"];
            var Code = d["Code"];
            var Name = d["Description"];

            if (DeptID === "0") {
                DeptID = d["GenericID"];
            }

            if (DeptID == d["GenericID"]) {
                tblSelected.row.add({
                    "ID": ID,
                    "Code": Code,
                    "Description": Name,
                    "Quantity": ""
                }).draw();

                initEditable();
                $(tblSelected.cell(tblSelected.rows().data().length - 1, 3).node()).click();
                $("#tbl-proc-list_filter input[aria-controls='tbl-proc-list']").val("");
                TableOtherProc
                .row($(this).parents('tr'))
                .remove()
                .draw();
            }
            else {
                alert('Please generate charge slip for the Selected Procedures');
            }

        }
    });
    $(document).on("dblclick", "#tbl-otherproc-selected td", function () {
        var d = tblSelected.row($(this).parents('tr')).data();
        var ID = d["ID"];
        var Quantity = d["Quantity"];
        var Name = d["Description"];
        var Code = d["Code"];
        if ($("#ordernoid").val() !== "0") {
            CanProc.push({
                ID: parseInt(ID),
                Quantity: parseInt(Quantity)
            });
        }
        else {
            TableOtherProc.row.add({
                "ID": ID,
                "Code": Code,
                "Description": Name
            }).draw();
        }
        if (tblSelected.rows().data().length == 1) {
            DeptID = "0";
        }
        TableOtherProc
            .order([1, 'asc'])
            .draw();

        tblSelected
        .row($(this).parents('tr'))
        .remove()
        .draw();
    });
    $(document).on("keydown", "#tbl-proc-list_filter", function (e) {
        if (event.which == 13) {
            var d = $("#tbl-proc-list").dataTable().fnGetData($('#tbl-proc-list tbody tr:eq(0)')[0]);
            if (d["id"] != 'null') {
                var ID = d["ID"];
                var Name = d["Description"];
                var Code = d["Code"];
                if (DeptID === "0") {
                    DeptID = d["GenericID"];
                }
                if (DeptID == d["GenericID"]) {
                    tblSelected.row.add({
                        "ID": ID,
                        "Code": Code,
                        "Description": Name,
                        "Quantity": ""
                    }).draw();

                    initEditable();
                    $(tblSelected.cell(tblSelected.rows().data().length - 1, 3).node()).click();
                    TableOtherProc
                    .row($('#tbl-proc-list tbody tr:eq(0)')[0])
                    .remove()
                    .draw();

                }
                else {
                    alert('Please generate charge slip for the Selected Procedures');
                }
            }

        }
    });

    $(document).on("click", "#btnsave", function () {
        Save();
    });
    $(document).on("click", "#btncancel", function () {
        AjaxWrapperPost($("#url").data("cancelorder"), JSON.stringify({ "OrderID": $("#ordernoid").val() }), function () {
            ViewMain();
        }, "Other Procedure");
    });
    $(document).on("click", "#btnnew", function () {

        $("._message-box").modal({ keyboard: true });
        $("#detail").html('');
        $.ajax({
            cache: false,
            type: 'GET',
            url: $("#url").data("detail"),
            contentType: 'application/json',
            data: { "IPID": "0" },
            success: function (data) {
                $("#detail").html(data);
                $("#btncancel").css("display", "none");
                $("#stat").val('0');
                $("#ordernoid").val("0");
                $("#ipid").val("0");
                bindPatient(function () {
                    BindOtherProc();
                    //InitProcedureSelect();
                    InitSelectedTable();
                    initEditable();
                    DeptID = "0"
                    $("#tbl-proc-list_filter input[aria-controls='tbl-proc-list']").focus();
                });
                $('#txtpatientID').select2('open');
            }
        });
    });
});
function ViewMain() {
    $("._message-box").modal('hide');
    ajaxWrapper.Get($("#url").data("view"), null, function (dd, e) {
        tbl = $("#tbl-other-proc").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: true,
            info: false,
            data: dd.xdata,
            columns: [
                { data: "sOrderNo" },
                { data: "PIN" },
                { data: "PatientName" },
                { data: "BedName" },
                { data: "DoctorName" },
                { data: "OperatorName" },
                { data: "DateTime" }
            ],
            order: [[ 0, "desc" ]]
        });
    });
}
function ViewDetail(d) {
    ajaxWrapper.Get($("#url").data("detail"), { "IPID": d["IPID"] }, function (xdata, e) {
        $("._message-box").modal({ keyboard: true });
        $("#detail").html(xdata);
        bindPatient(null);
        $("#txtpatientID").select2('val', d["IPID"]);
        $("#txtpatientID").select2('enable', false);
        bindDocSelect();
        $("#txtdoctor").select2("val", d["DoctorID"]);
        $("#operator").val(d["OperatorName"]);
        $("#prefixorderno").val(d["sOrderNo"]);
        $("#ipid").val(d["IPID"]);
        $("#ordernoid").val(d["OrderNo"]);
        $("#stat").val(d["DrugDispatch"]);
        $("#date").val(d["DateTime"]);
        BindOtherProc();
        $(".proc-list").css("display", "none");
        $(".proc-list").removeClass("col-xs-6");
        $(".proc-select").removeClass("col-xs-4");
        $(".proc-select").addClass("col-xs-8");
        ajaxWrapper.Get($("#url").data("selected"), { "OrderID": d["OrderNo"] }, function (xx, e) {
            InitSelectedTable(xx);
        });

    });
}
function InitSelectedTable(xx) {
    tblSelected = $("#tbl-otherproc-selected").DataTable({
        destroy: true,
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        data: xx,
        columns: [
            { data: "ID", visible: false },
            { data: "Code" },
            { data: "Description" },
            { data: "Quantity", className: "priceeditor" }
        ]
    });
}
function Save() {
    var OtherProc = [];
    if (tblSelected.rows().data().length != 0) {
        tblSelected.rows().indexes().each(function (idx) {
            var d = tblSelected.row(idx).data();
            d.counter++;
            OtherProc.push({
                ID: parseInt(d["ID"]),
                Quantity: parseInt(d["Quantity"])
            });
        });
        var aData = {
            "model": OtherProc, "can": CanProc, "OrderID": $("#ordernoid").val(), "IPID": $("#ipid").val(), "DoctorID": $("#txtdoctor").val()
        }
        AjaxWrapperPost($("#url").data("saveorder"), JSON.stringify(aData),function() { ViewMain(); }, "Other Procedure");        
    }
    else {
        alert('Please choose item');
    }
}
function addEditors() {
    $.editable.addInputType('integerinput', {
        element: function (settings, original) {
            var input = $('<input type="text" class="form-control" style="width:100%;height: 100%;padding-top:0px;padding-bottom:0px;"/>');
            $(this).append(input);
            return (input);
        },
        plugin: function (settings, original) {
            $(this).find('input').inputmask("integer");
            $(this).find('input').keydown(function (e) {
                var cellIndex = tblSelected.cell(original).index();
                if (e.keyCode == 40) { //down                    
                    if (cellIndex.row < tblSelected.rows().data().length - 1) {
                        setTimeout(function () { $(tblSelected.cell(cellIndex.row + 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
                else if (e.keyCode == 38) { //up                                        
                    if (cellIndex.row > 0) {
                        setTimeout(function () { $(tblSelected.cell(cellIndex.row - 1, cellIndex.column).node()).click(); }, 0)
                    }
                }
            });
        }
    });
}
function initEditable() {
    $('.priceeditor', tblSelected.rows().nodes()).editable(function (sVal, settings) {
        var rowIndex = tblSelected.row($(this).closest('tr')).index();
//        if (sVal == "0") {
//            initEditable();
//            $(tblSelected.cell(rowIndex, 2).node()).click();
//        }
//        else {
//            tblSelected.cell(rowIndex, 2).data(sVal);
//            $("#tbl-proc-list_filter input[aria-controls='tbl-proc-list']").val("");
//            $("#tbl-proc-list_filter input[aria-controls='tbl-proc-list']").focus();
//        }

        tblSelected.cell(rowIndex, 3).data(sVal);
        $("#tbl-proc-list_filter input[aria-controls='tbl-proc-list']").val("");
        $("#tbl-proc-list_filter input[aria-controls='tbl-proc-list']").focus();
        return sVal;
    },
    {
        "type": 'integerinput', "style": 'display: inline;', "onblur": 'submit',
        "event": 'click', "submit": '', "cancel": '', "placeholder": ''
    });
}
