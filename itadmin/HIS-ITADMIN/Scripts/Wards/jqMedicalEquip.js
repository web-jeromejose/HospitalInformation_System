var tbl;
var tblSelected;
var CanProc = [];

var ajaxWrapper = $.ajaxWrapper();
$(document).ready(function () {
    InitSelect();
    ViewMain();
    InitMedicalEquipment(0);   
    $(document).on("click", "#tbl-medical-equip td", function () {
        CanProc = [];
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
            var Name = d["Code"] + " - " + d["Description"];
            tblSelected.row.add({
                "ID": ID,
                "Description": Name,
                "Quantity": 0
            }).draw();

            initEditable();

            TableOtherProc
                .row($(this).parents('tr'))
                .remove()
                .draw();
        }
    });
    $(document).on("dblclick", "#tbl-otherproc-selected td", function () {
        var d = tblSelected.row($(this).parents('tr')).data();
        var ID = d["ID"];
        var Quantity = d["Quantity"];

        if ($("#ordernoid").val() !== "0") {
            CanProc.push({
                ID: parseInt(ID),
                Quantity: parseInt(Quantity),
            });
        }

        tblSelected
        .row($(this).parents('tr'))
        .remove()
        .draw();
    });
    $(document).on("click", "#btnsave", function () {
        var aData = {
            "IPID": $("#ipid").val(), "OrderID": $("#ordernoid").val(), "DoctorID": $("#txtdoctor").val(), "startdate": $("#startdate").val()
                       , "enddate": $("#enddate").val(), "medid": $("#txtMedical").val()
        }
        AjaxWrapperPost($("#url").data("saveorder"), JSON.stringify(aData),function() {
            ViewMain();
        },"Medical Equipment");
    });
    $(document).on("click", "#btncancel", function () {
        AjaxWrapperPost($("#url").data("cancelorder"), JSON.stringify({ "OrderID": $("#ordernoid").val() }),function () {
            ViewMain();
        },"Medical Equipment");       
    });
    $(document).on("click", "#btnnew", function () {
        $("._message-box").modal({ keyboard: true });
        $("#detail").html('');
        InitMedicalEquipment(0);        
        bindDocSelect();
        $.ajax({
            cache: false,
            type: 'GET',
            url: $("#url").data("detail"),
            contentType: 'application/json',
            data: { "IPID": "0" },
            success: function (data) {
                $("#detail").html(data);
                                            $(".datepicker").datetimepicker({
					    format: 'DD MMM YYYY HH:mm',
                        autoclose: true,
                        pick12HourFormat: false
					});

                $("#btncancel").css("display", "none");
                $("#stat").val('0');
                $("#ordernoid").val("0");
                $("#ipid").val("0");
                bindPatient(function () {
                    bindDocSelect();
                });               
            }
        });
    });
});
function ViewMain() {
    $("._message-box").modal('hide');
    ajaxWrapper.Get($("#url").data("view"), null, function (xdata, e) {
        tbl = $("#tbl-medical-equip").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: false,
            info: false,
            data: xdata,
            columns: [
                { data: "sOrderNo" },
                { data: "PIN" },
                { data: "PatientName" },
                { data: "BedName" },
                { data: "MedEquID" },
                { data: "OperatorName" },
                { data: "DateTime" },
                { data: "MedStart" },
                { data: "MedEnd" }
            ],
            fnRowCallback: function (nRow, aData) {
                var id = aData["MedEnd"];
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                if (id == "") {
                    $nRow.css({ "background-color": "#f2dede" })
                }
                else {
                    $nRow.css({ "background-color": "#dff0d8" })
                }
                return nRow
            }
        });
    });
}
function ViewDetail(d) {
    ajaxWrapper.Get($("#url").data("detail"), { "IPID": d["IPID"] }, function (xdata, e) {
        $("._message-box").modal({ keyboard: true });
        $("#detail").html(xdata);
                            $(".datepicker").datetimepicker({
					    format: 'DD MMM YYYY HH:mm',
                        autoclose: true,
                        pick12HourFormat: false
					});

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
        InitMedicalEquipment(d["MedEquID"]);
        $("#txtMedical").attr("readonly", "readonly");
        $("#startdate").val(d["MedStart"]);
        $("#startdate").attr("readonly", "readonly");
        $("#enddate").val(d["MedEnd"]);
        if (d["MedEnd"] != "") {
            $("#btnsave").css("display", "none");
            $("#enddate").attr("readonly", "readonly");
        }
    });
}

function Save() {
    var ExtraFood = [];
    if (tblSelected.rows().data().length != 0) {
        tblSelected.rows().indexes().each(function (idx) {
            var d = tblSelected.row(idx).data();
            d.counter++;
            ExtraFood.push({
                ID: parseInt(d["ID"]),
                Quantity: parseInt(d["Quantity"])
            });
        });
        var aData = {
            "food": ExtraFood, "canfood": CancelFood, "OrderID": $("#ordernoid").val(), "IPID": $("#ipid").val()
        }
        AjaxWrapperPost($("#url").data("saveorder"), JSON.stringify(aData),function () {
            ViewMain();
        },"Extra Food Order");
        
    }
    else {
        alert('Please choose item');
    }
}