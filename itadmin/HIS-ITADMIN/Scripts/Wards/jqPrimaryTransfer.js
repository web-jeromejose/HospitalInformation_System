var tbl;

var ajaxWrapper = $.ajaxWrapper();
$(document).ready(function () {
    ViewMain();
    InitSelect();
    $(document).on("click", "#tbl-patient-ref td", function () {
        CancelFood = [];
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var tr = $(this).closest('tr');

//            if (tr.hasClass('selected')) {
//                tr.removeClass('selected');
//            }
//            else {
//                $('tr.selected').removeClass('selected');
//                tr.addClass('selected');
//            }
            var d = tbl.row($(this).parents('tr')).data();
            ViewDetail(d);
        }
    });
    $(document).on("click", "#btnsave", function () {
        var aData = {
            "id": $("#ordernoid").val(),
            "ipid": $("#ipid").val(),
            "OldCOnsultantId": $("#txtdoctor").val(),
            "NewCOnsultantId": $("#refto").val(),
            "Reason": $("#txtremarks").val()
        }
        AjaxWrapperPost($("#url").data("saveorder"), JSON.stringify(aData), function () {
            ViewMain();
        }, "Primary Consultant Change");
    });
    $(document).on("click", "#btncancel", function () {
        AjaxWrapperPost($("#url").data("cancel"), JSON.stringify({ "ID": $("#ordernoid").val() }), function () {
            ViewMain();
        }, "Primary Consultant Change");
    });
    $(document).on("click", "#btnnew", function () {
        CancelFood = [];
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

                bindDocSelectReferBy();
                bindDocSelect();
                $("#txtdoctor").select2('enable', false);
                bindPatient(function () {
                    $("#stat").val('0');
                    $("#ordernoid").val("0");
                    $("#ipid").val("0");
                });

            }
        });
    });
});
function ViewMain() {
    $("._message-box").modal('hide');
    ajaxWrapper.Get($("#url").data("view"), null, function (xdata, e) {
        tbl = $("#tbl-patient-ref").DataTable({
            destroy: true,
            paging: true,
            searching: true,
            ordering: true,
            info: false,
            data: xdata,
            columns: [
                { data: "sOrderNo" },
                { data: "PIN" },
                { data: "PatientName" },
                { data: "RefDate" },
                { data: "RefDoctorName" },
                { data: "DoctorName" },
                { data: "Operator" }
            ],
            fnRowCallback: function (nRow, aData) {
                var id = aData["Prefix"];
                var $nRow = $(nRow); // cache the row wrapped up in jQuery

                if (id == "False") {
                    $nRow.css({ "background-color": "#FFB3B3" })
                }
                else {
                    $nRow.css({ "background-color": "#FFFFB3" })
                }
                return nRow
            },
            order: [[0, "desc"]]
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
        bindDocSelectReferBy();

        $("#txtname").val(d["PatientName"]);
        $("#txtbed").val(d["BedNo"]);
        $("#refto").select2("val", d["RefDoctor"]);

        $("#txtdoctor").select2("val", d["DoctorID"]);
        $("#txtdoctor").select2('enable', false);
        $("#refto").select2("val", d["RefDoctor"]);

        $("#txtremarks").val(d["RefReason"]);
        $("#date").val(d["RefDate"]);

        $("#ipid").val(d["IPID"]);
        $("#ordernoid").val(d["OrderNo"]);
        if (d["Prefix"] == "1") {
            $(".form-control, .chng").attr("readonly", "readonly");
            $(".dis").css("display", "none");
        }
    });
}
