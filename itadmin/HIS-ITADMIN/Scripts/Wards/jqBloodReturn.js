var tbl;
var tblSelected;
var defaultStartDate;
var CancelFood = [];

var ajaxWrapper = $.ajaxWrapper();
$(document).ready(function () {
    ViewMain();
    InitSelect();

    $(document).on("click", "#tbl-blood-list td", function (e) {
        if (tblBloodReturn.rows().data().length > 0) {
            var d = tblBloodReturn.row($(this).parents('tr')).data();
            var Code = d["Code"];
            var Quantity = d["Quantity"];
            var RequiredDate = d["RequiredDate"];
            var Name = d["Name"];
            var ComponentID = d["ComponentID"];

            tblBloodReturnSelected.row.add({
                "Code": Code,
                "Quantity": Quantity,
                "RequiredDate": RequiredDate,
                "Name": Name,
                "ComponentID": ComponentID
            }).draw();

            tblBloodReturn
                .row($(this).parents('tr'))
                .remove()
                .draw();
        }
    });

    $(document).on("dblclick", "#tbl-blood-selected td", function () {
        if (tblBloodReturnSelected.rows().data().length > 0) {
            var d = tblBloodReturnSelected.row($(this).parents('tr')).data();
            var Code = d["Code"];
            var Quantity = d["Quantity"];
            var RequiredDate = d["RequiredDate"];
            var Name = d["Name"];
            var ComponentID = d["ComponentID"];

            tblBloodReturn.row.add({
                "Code": Code,
                "Quantity": Quantity,
                "RequiredDate": RequiredDate,
                "Name": Name,
                "ComponentID": ComponentID
            }).draw();

            tblBloodReturnSelected
                .row($(this).parents('tr'))
                .remove()
                .draw();
        }
    });

    $(document).on("click", "#btnsave", function () {
        Save();
    });
    $(document).on("click", "#btncancel", function () {
        if (tblSelected.rows().data().length != 0) {
            AjaxWrapperPost($("#url").data("cancel"), JSON.stringify({ "OrderID": $("#ordernoid").val() }), function () {
                ViewMain();
            }, "Extra Food Order");
        }
        else {
            alert('Please choose item');
        }
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
                bindPatient(function (d) {
                    BindBloodReturn(d.id);
                });
                $('#txtpatientID').select2('open');
                $("#stat").val('0');
                $("#ordernoid").val("0");
                $("#ipid").val("0");

            }
        });
    });
});
function ViewMain() {
    $("._message-box").modal('hide');
    ajaxWrapper.Get($("#url").data("view"), null, function (xdata, e) {
        tbl = $("#tbl-blood-return").DataTable({
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
                { data: "DateTime" },
                { data: "OperatorName" }
            ],
            fnRowCallback: function (nRow, aData) {
                var id = aData["Demand"];
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                if (id == "0") {
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

function Save() {
    var BloodDetail = [];
    if (tblBloodReturnSelected.rows().data().length > 0) {
        tblBloodReturnSelected.rows().indexes().each(function (idx) {
            var d = tblBloodReturnSelected.row(idx).data();
            d.counter++;
            BloodDetail.push({
                ComponentID: parseInt(d["ComponentID"])
            });
        });
        var aData = {
            "model": BloodDetail, "IPID": $("#ipid").val()
        }
        AjaxWrapperPost($("#url").data("saveorder"), JSON.stringify(aData), function () {
            ViewMain();
        }, "Blood Return");

    }
    else {
        alert('Please choose item');
    }
}
