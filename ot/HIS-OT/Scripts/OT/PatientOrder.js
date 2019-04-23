var c = new Common();
var Action = 1;

var TblGridPatientOrder;
var TblGridPatientOrderId = "#gridList";
var TblGridPatientOrderDataRow;

$(document).ready(function () {
    InitButton();
    BindPatientOrderList([]);

    c.ResizeDiv('#reportBorder', reportHeight);
});
$(document).on("click", TblGridPatientOrderId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected');

        //TblGridPatientOrderDataRow = TblGridPatientOrder.row($(this).parents('tr')).data();

    }
});

$(window).on("resize", function () {
    c.ResizeDiv('#reportBorder', reportHeight);
});
$('#myReport').on('load', function () {
    $('#preloader').hide();
    c.ModalShow('#modalReport', true);
});
function GenerateReport(PIN) {
    $('#preloader').show();

    var $report = $("#myReport");
    var UserId = "";

    var dlink = hissystem.appsserver() + hissystem.appsname() + "Areas/OT/Reports/PatientOrder/PatientOrder.aspx";
    var repsrc = dlink + "?Id=" + PIN;
    console.log("myReport");
    console.log(repsrc);
    c.LoadInIframe("myReport", repsrc);
}


function InitButton() {
    $('#btnRefresh').click(function () {
        
    });
    $('#btnView').click(function () {
        var Id = c.GetValue('#txtSearch');
        ShowPatientOrderList(Id);
    });

    $('#btnPreview').click(function () {
        var PIN = c.GetValue('#txtSearch');
        GenerateReport(PIN);
    });
    $('#btnCloseReport').click(function () {
        c.ModalShow('#modalReport', false);
    });
}

function ShowPatientOrderColumns() {
    var cols = [
    { targets: [0], data: "Type", className: '', visible: false, searchable: false, width: "3%" },
    { targets: [1], data: "DepartmentName", className: '', visible: true, searchable: false, width: "10%" },
    { targets: [2], data: "OrderID", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [3], data: "datetimeD", className: '', visible: true, searchable: false, width: "7%" },
    { targets: [4], data: "name", className: '', visible: true, searchable: false, width: "9%" },
    { targets: [5], data: "StationName", className: '', visible: true, searchable: false, width: "10%" },
    { targets: [6], data: "DispatchQuantity", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [7], data: "Unit", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [8], data: "status", className: '', visible: true, searchable: true, width: "8%" },
    { targets: [9], data: "operatorName", className: '', visible: true, searchable: false, width: "0%" }
    ];
    return cols;
}
function ShowPatientOrderRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowPatientOrderList(Id) {
    var Url = baseURL + "PatientOrderList";
    var param = { Id: Id };

    $('#preloader').show();
//    $(TblGridPatientOrderId).css("visibility", "hidden");

    $.ajax({
        url: Url,
        data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {
        },
        success: function (data) {
            $('#preloader').hide();
            BindPatientOrderList(data.list);
//            $(TblGridPatientOrderId).css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });
}
function BindPatientOrderList(data) {
    var cols = 10;
    //TblGridPatientOrder = $(TblGridPatientOrderId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: false,
    //    ordering: false,
    //    info: true,
    //    columns: ShowPatientOrderColumns(),
    //    bAutoWidth: false,
    //    scrollY: 500,
    //    scrollX: true,
    //    "bLengthChange": false,
    //    drawCallback: function (settings) {
    //        var api = this.api();
    //        var rows = api.rows({ page: 'current' }).nodes();
    //        var last = null;

    //        api.column(0, { page: 'current' }).data().each(function (group, i) {
    //            if (last !== group) {
    //                $(rows).eq(i).before(
    //                            '<tr class="group"><td style="text-align:center; vertical-align:middle;" colspan="' + cols + '">' + group + '</td></tr>'
    //                        );

    //                last = group;
    //            }
    //        });
    //    }
    //});
    TblGridPatientOrder = $(TblGridPatientOrderId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 442,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        //fnRowCallback: ShowListRowCallBack(),
        columns: ShowPatientOrderColumns(),
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(0, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                                '<tr class="group"><td style="text-align:center; vertical-align:middle;" colspan="' + cols + '">' + group + '</td></tr>'
                            );

                    last = group;
                }
            });
        }
    });


}

function Refresh() {
    
}

function txtSearch_keypress(e) {
    var key = e.keyCode || e.which;
    if (key == 13) {
        $('#btnView').click();
    }
}