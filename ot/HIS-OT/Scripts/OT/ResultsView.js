var c = new Common();
var Action = 1;
var regno = "";


var TblResults;
var TblResultsID = "#gridResults";
var TblResultDataRow;

var TblResultsOldLab;
var TblResultsOldLabID = "#gridResultsOldLab";
var TblResultsOldLabDataRow;

var TblResultsOldRad;
var TblResultsOldRadID = "#gridResultsOldRadiology";
var TblResultsOldRadDataRow;

var TblEndoscopyNew;
var TblEndoscopyNewID = "#gridEndoscopyNew";
var TblEndoscopyNewDataRow;

var TblEndoscopyOld;
var TblEndoscopyOldID = "#gridEndoscopyOld";
var TblEndoscopyDataRow;

var TblCathLab;
var TblCathLabID = "#gridCathLab";
var TblCathLabDataRow;

var TblPanicValue;
var TblPanicValueID = "#gridPanicValue";
var TblPanicValueDataRow;


$(document).ready(function () {
    c.SetTitle("Results View");
    c.DefaultSettings();

    SetupDataTables();

    InitButton();
    InitICheck();
    InitSelect2();
    InitDateTimePicker();
    InitDataTables();

    DefaultDisable();
    DefaultReadOnly();
    DefaultValues();

    HandleEnableButtons();

    c.ResizeDiv('#reportBorder', reportHeight);

});
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // for future use... Get the active tab.
    //var tabNameSelected = $('#tabMain .nav-tabs .active').text();

    TblResults.columns.adjust().draw();
    TblResultsOldLab.columns.adjust().draw();
    TblResultsOldRad.columns.adjust().draw();
    TblEndoscopyNew.columns.adjust().draw();
    TblEndoscopyOld.columns.adjust().draw();
    TblCathLab.columns.adjust().draw();
})

$(document).on("click", TblResultsID + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected');

        TblResultsDataRow = TblResults.row($(this).parents('tr')).data();

    }
});
$(document).on("dblclick", TblResultsID + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        TblResultsDataRow = TblResults.row($(this).parents('tr')).data();
        if (TblResultsDataRow.StID == 36) { // Microbiology
            GenerateReportMicrobiology(TblResultsDataRow.ID, TblResultsDataRow.TestID);
        }
        else if (TblResultsDataRow.StID == 27) { // Chemistry
            GenerateReportChemistry(TblResultsDataRow.ID, TblResultsDataRow.TestID);
        }
        else if (TblResultsDataRow.StID == 99) { // Coagulation
            GenerateReportCoagulation(TblResultsDataRow.ID, TblResultsDataRow.TestID);
        }   
        else if (TblResultsDataRow.StID == 9) { // XRay
            if (TblResultsDataRow.verifiedby !== 0) {
                c.MessageBoxErr("Message...","Results not available");
                return;
            }
            GenerateReportXRay(TblResultsDataRow.ID, TblResultsDataRow.TestID);
        }
        else if (TblResultsDataRow.StID == 28) { // Hematology
            GenerateReportHematology(TblResultsDataRow.ID, TblResultsDataRow.TestID);
        }
        else if (TblResultsDataRow.StID == 34) { // Drug
            if (TblResultsDataRow.verifiedby !== 0) {
                c.MessageBoxErr("Message...", "Results not available");
                return;
            }
            GenerateReportDrug(TblResultsDataRow.ID, TblResultsDataRow.TestID);
        }

    }
});

$(document).on("click", TblResultsOldLabID + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected');

        TblResultsOldLabDataRow = TblResultsOldLab.row($(this).parents('tr')).data();

    }
});
$(document).on("click", TblEndoscopyNewID + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected');

        TblEndoscopyNewDataRow = TblEndoscopyNew.row($(this).parents('tr')).data();

    }
});
$(document).on("click", TblEndoscopyOldID + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected');

        TblEndoscopyOldDataRow = TblEndoscopyOld.row($(this).parents('tr')).data();

    }
});
$(document).on("click", TblCathLabID + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected');

        TblCathLabDataRow = TblCathLab.row($(this).parents('tr')).data();

    }
});

$(window).on("resize", function () {
    c.ResizeDiv('#reportBorder', reportHeight);
});
$('#myReport').on('load', function () {
    $('#preloader').hide();
    c.ModalShow('#modalReport', true);
});
function GenerateReportMicrobiology(orderid, serviceid) {
    $('#preloader').show();

    var $report = $("#myReport");
    var UserId = "";

    var dlink = hissystem.appsserver() + hissystem.appsname() + "Areas/OT/Reports/ResultsView/ResultsViewLabMicrobiology.aspx";
    var repsrc = dlink + "?UserId=" + UserId + "&OrderId=" + orderid + "&ServiceId=" + serviceid;

    c.LoadInIframe("myReport", repsrc);
}
function GenerateReportChemistry(orderid, serviceid) {
    $('#preloader').show();

    var $report = $("#myReport");
    var UserId = "";

    var dlink = hissystem.appsserver() + hissystem.appsname() + "Areas/OT/Reports/ResultsView/ResultsViewLabChemistry.aspx";
    var repsrc = dlink + "?UserId=" + UserId + "&OrderId=" + orderid + "&ServiceId=" + serviceid;

    c.LoadInIframe("myReport", repsrc);
}
function GenerateReportCoagulation(orderid, serviceid) {
    $('#preloader').show();

    var $report = $("#myReport");
    var UserId = "";

    var dlink = hissystem.appsserver() + hissystem.appsname() + "Areas/OT/Reports/ResultsView/ResultsViewLabCoagulation.aspx";
    var repsrc = dlink + "?UserId=" + UserId + "&OrderId=" + orderid + "&ServiceId=" + serviceid;

    c.LoadInIframe("myReport", repsrc);
}
function GenerateReportXRay(orderid, serviceid) {
    $('#preloader').show();

    var $report = $("#myReport");
    var UserId = "";

    var dlink = hissystem.appsserver() + hissystem.appsname() + "Areas/OT/Reports/ResultsView/ResultsViewLabXRay.aspx";
    var repsrc = dlink + "?UserId=" + UserId + "&OrderId=" + orderid + "&ServiceId=" + serviceid;

    c.LoadInIframe("myReport", repsrc);
}
function GenerateReportHematology(orderid, serviceid) {
    $('#preloader').show();

    var $report = $("#myReport");
    var UserId = "";

    var dlink = hissystem.appsserver() + hissystem.appsname() + "Areas/OT/Reports/ResultsView/ResultsViewLabHematology.aspx";
    var repsrc = dlink + "?UserId=" + UserId + "&OrderId=" + orderid + "&ServiceId=" + serviceid;

    c.LoadInIframe("myReport", repsrc);
}
function GenerateReportDrug(orderid, serviceid) {
    $('#preloader').show();

    var $report = $("#myReport");
    var UserId = "";

    var dlink = hissystem.appsserver() + hissystem.appsname() + "Areas/OT/Reports/ResultsView/ResultsViewLabDrug.aspx";
    var repsrc = dlink + "?UserId=" + UserId + "&OrderId=" + orderid + "&ServiceId=" + serviceid;

    c.LoadInIframe("myReport", repsrc);
}

function InitButton() {
    $('#btnRefresh').click(function () {
        ShowAllContents();
    });
    //$('#btnReportView').click(function () {

    //    var row = TblResultsDataRow.StID;

    //    if (row == 36) { // Microbiology
    //        GenerateReportMicrobiology(TblResultsDataRow.ID, TblResultsDataRow.TestID);
    //    }
    //    else if (row == 27) { // Chemistry
    //        GenerateReportChemistry(TblResultsDataRow.ID, TblResultsDataRow.TestID);
    //    }
        

    //});
    $('#btnCloseReport').click(function () {
        c.ModalShow('#modalReport', false);
    });


}
function InitICheck() {
    $('#iChkPanicValue').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
    });
}
function InitSelect2() {
    $('#select2PIN').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetPIN',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    type: 0
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        c.SetSelect2('#select2Name', list[2], list[3]);
        FetchPatientDetails(list);
        regno = list[0];
        ShowAllContents();
    });
    $('#select2Name').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetName',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    type: 0
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        c.SetSelect2('#select2PIN', list[2], list[6]);
        FetchPatientDetails(list);
        regno = list[0];
        ShowAllContents();
    });

}
function InitDateTimePicker() {
    //    $('#dtOTStartDateTime').datetimepicker({
    //        pickTime: true
    //    }).on("dp.change", function (e) {

    //    });
}
function InitDataTables() {

    BindResults([]);
    BindResultsOldLab([]);
    BindResultsOldRad([]);
    BindEndoscopyNew([]);
    BindEndoscopyOld([]);
    BindCathLab([]);

}
function SetupDataTables() {
    //    SetupSelectedSurgery();
}

function DefaultReadOnly() {
    c.ReadOnly('#txtAge', true);
    c.ReadOnly('#txtGender', true);
}
function DefaultValues() {
    //    c.SetSelect2('#select2VacationType', '0', 'Normal');
    //    c.SetSelect2('#select2Category', '1', 'Local');
    //    c.iCheckSet('#iChkLast3Mos', true);
    //    c.SetRequired();
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
}
function DefaultEmpty() {
    c.Select2Clear('#select2PIN');
    c.Select2Clear('#select2Name');

    c.SetValue('#txtAge', '');
    c.SetValue('#txtGender', '');

    InitDataTables();
}

function Validated() {
    return truefalse;
}
function HandleEnableButtons() {
    // VAED
    if (Action == 0) {
        $('.HideOnView').hide();
        $('.ShowOnView').show();
    }
    else if (Action == 1) {
        $('.HideOnAdd').hide();
        $('.ShowOnAdd').show();
    }
    else if (Action == 2) {
        $('.HideOnEdit').hide();
        $('.ShowOnEdit').show();
    }
    else if (Action == 3) {
        $('.HideOnDelete').hide();
        $('.ShowOnDelete').show();
    }

    HandleButtonNotUse();
}
function HandleEnableEntries() {
    // VAED
    if (Action == 0 || Action == 3) { // view or delete
    }
    else if (Action == 1 || Action == 2) { // add or edit

    }

}
function HandleButtonNotUse() {
    $('.NotUse').hide();
}

function ShowAllContents() {
    ShowResults(regno);
    ShowResultsOldLab(regno, 1);
    ShowResultsOldRad(regno, 2);
    ShowEndoscopyNew(regno);
    ShowEndoscopyOld(regno);
    ShowCathLab(regno);
}
function Refresh() {
    ShowAllContents();
}

function ShowResultsColumn() {
    var cols = [
    { targets: [0], data: "ReqNo", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [1], data: "Doctor", className: '', visible: true, searchable: true, width: "30%" },
    { targets: [2], data: "Station", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [3], data: "Code", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [4], data: "Test", className: '', visible: true, searchable: true, width: "25%" },
    { targets: [5], data: "OrderDateTime", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [6], data: "ID", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [7], data: "TestID", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [8], data: "StID", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [9], data: "TestDoneBY", className: '', visible: false, searchable: true, width: "15%" },
    { targets: [10], data: "verifiedby", className: '', visible: false, searchable: true, width: "15%" }
    ]
    return cols;
}
function ShowResultsRowCallBack() {
    var rc = function (nRow, aData) {
        var verifiedby = aData['verifiedby'];
        var TestDoneBY = aData['TestDoneBY'];
        var $nRow = $(nRow);
        if (verifiedby !== 0) {
            $nRow.css({ "background-color": "#ffe8e8" })
        }
        if (TestDoneBY !== 0) {
            $nRow.css({ "background-color": "#ffffd9" })
        }
       
    };
    return rc;
}
function ShowResults(id) {
    var Url = baseURL + "ShowResultsViewResults";
    var param = {
        registrationno: id
    }

    $('#preloader').show();
    $("#grid").css("visibility", "hidden");

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
            BindResults(data.list);
            $('#preloader').hide();
            $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindResults(data) {
    var cols = 6;
    //TblResults = $(TblResultsID).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowResultsColumn(),
    //    bAutoWidth: false,
    //    scrollY: 370,
    //    scrollX: true,
    //    fnRowCallback: ShowResultsRowCallBack()
    //});
    TblResults = $(TblResultsID).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 280,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        //iDisplayLength: 25,
        fnRowCallback: ShowResultsRowCallBack(),
        columns: ShowResultsColumn()

    });

    c.SetBadgeText('#badgeResults', $(TblResultsID).DataTable().rows().nodes().length);

}

function ShowResultsOldLabColumn() {
    var cols = [
    { targets: [0], data: "DATETIME_COMPLETED", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [1], data: "DOC_NAME", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [2], data: "SERVICE_CODE", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [3], data: "SERVICE_DESC", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [4], data: "ROOMNO", className: '', visible: true, searchable: true, width: "5%" }
    ];
    return cols;
}
function ShowResultsOldLabRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowResultsOldLab(id, type) {
    var Url = baseURL + "ShowResultsViewOldResults";
    var param = {
        registrationno: id,
        type: type
    }

    //    $('#preloader').show();
    //    $("#grid").css("visibility", "hidden");

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

            BindResultsOldLab(data.list);
            //            $('#preloader').hide();
            //            $("#grid").css("visibility", "visible");

        },
        error: function (xhr, desc, err) {

            //            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindResultsOldLab(data) {
    //TblResultsOldLab = $(TblResultsOldLabID).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowResultsOldLabColumn(),
    //    bAutoWidth: false,
    //    scrollY: 370,
    //    scrollX: true,
    //    fnRowCallback: ShowResultsOldLabRowCallBack()
    //});
    TblResultsOldLab = $(TblResultsOldLabID).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 280,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        //iDisplayLength: 25,
        fnRowCallback: ShowResultsOldLabRowCallBack(),
        columns: ShowResultsOldLabColumn()
    });

    c.SetBadgeText('#badgeLaboratory', $(TblResultsOldLabID).DataTable().rows().nodes().length);
}

function ShowResultsOldRadColumn() {
    var cols = [
    { targets: [0], data: "DATETIME_COMPLETED", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [1], data: "DOC_NAME", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [2], data: "SERVICE_CODE", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [3], data: "SERVICE_DESC", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [4], data: "ROOMNO", className: '', visible: true, searchable: true, width: "5%" }
    ];
    return cols;
}
function ShowResultsOldRadRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowResultsOldRad(id, type) {
    var Url = baseURL + "ShowResultsViewOldResults";
    var param = {
        registrationno: id,
        type: type
    }

    //    $('#preloader').show();
    //    $("#grid").css("visibility", "hidden");

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

            BindResultsOldRad(data.list);
            //            $('#preloader').hide();
            //            $("#grid").css("visibility", "visible");

        },
        error: function (xhr, desc, err) {

            //            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindResultsOldRad(data) {
    //TblResultsOldRad = $(TblResultsOldRadID).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowResultsOldRadColumn(),
    //    bAutoWidth: false,
    //    scrollY: 370,
    //    scrollX: true,
    //    fnRowCallback: ShowResultsOldRadRowCallBack()
    //});
    TblResultsOldRad = $(TblResultsOldRadID).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 280,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        //iDisplayLength: 25,
        fnRowCallback: ShowResultsOldRadRowCallBack(),
        columns: ShowResultsOldRadColumn()
    });
    c.SetBadgeText('#badgeRadiology', $(TblResultsOldRadID).DataTable().rows().nodes().length);
}

function ShowEndoscopyNewColumn() {
    var cols = [
    { targets: [0], data: "SlNo", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [1], data: "PIN", className: '', visible: true, searchable: false, width: "10%" },
    { targets: [2], data: "PATIENTNAME", className: '', visible: true, searchable: false, width: "25%" },
    { targets: [3], data: "AGE", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [4], data: "SEX", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [5], data: "BILLDATETIME", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [6], data: "BILLNO", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [7], data: "PATIENTTYPE", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [8], data: "PROCEDURENAME", className: '', visible: true, searchable: true, width: "20%" }
    ]
    return cols;
}
function ShowEndoscopyNewRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['TESTDONEBYID'];
        var $nRow = $(nRow);
        if (value == '-1') {
            $nRow.css({ "background-color": "#d9ffec" })
        }
    };
    return rc;
}
function ShowEndoscopyNew(id) {
    var Url = baseURL + "ShowResultsViewEndoscopyNew";
    var param = {
        registrationno: id
    }

    //    $('#preloader').show();
    //    $("#grid").css("visibility", "hidden");

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

            BindEndoscopyNew(data.list);
            //            $('#preloader').hide();
            //            $("#grid").css("visibility", "visible");

        },
        error: function (xhr, desc, err) {
            //            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindEndoscopyNew(data) {
    //TblEndoscopyNew = $(TblEndoscopyNewID).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowEndoscopyNewColumn(),
    //    bAutoWidth: false,
    //    scrollY: 380,
    //    scrollX: true,
    //    fnRowCallback: ShowEndoscopyNewRowCallBack()
    //});
    TblEndoscopyNew = $(TblEndoscopyNewID).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 280,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        //iDisplayLength: 25,
        fnRowCallback: ShowEndoscopyNewRowCallBack(),
        columns: ShowEndoscopyNewColumn()
    });
    c.SetBadgeText('#badgeNewResults', $(TblEndoscopyNewID).DataTable().rows().nodes().length);
}

function ShowEndoscopyOldColumn() {
    var cols = [
    { targets: [0], data: "PIN", className: '', visible: true, searchable: false, width: "10%" },
    { targets: [1], data: "PatientName", className: '', visible: true, searchable: false, width: "25%" },
    { targets: [2], data: "Age", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [3], data: "Sex", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [4], data: "VisitDate", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [5], data: "Room", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [6], data: "TXT_ITEM", className: '', visible: true, searchable: true, width: "35%" }
    ]
    return cols;
}
function ShowEndoscopyOldRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowEndoscopyOld(id) {
    var Url = baseURL + "ShowResultsViewEndoscopyOld";
    var param = {
        registrationno: id
    }

    //    $('#preloader').show();
    //    $("#grid").css("visibility", "hidden");

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

            BindEndoscopyOld(data.list);
            //            $('#preloader').hide();
            //            $("#grid").css("visibility", "visible");

        },
        error: function (xhr, desc, err) {
            //            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindEndoscopyOld(data) {
    //TblEndoscopyOld = $(TblEndoscopyOldID).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowEndoscopyOldColumn(),
    //    bAutoWidth: false,
    //    scrollY: 380,
    //    scrollX: true,
    //    fnRowCallback: ShowEndoscopyOldRowCallBack()
    //});
    TblEndoscopyOld = $(TblEndoscopyOldID).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 280,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        //iDisplayLength: 25,
        fnRowCallback: ShowEndoscopyOldRowCallBack(),
        columns: ShowEndoscopyOldColumn()
    });
    c.SetBadgeText('#badgeOldResults', $(TblEndoscopyOldID).DataTable().rows().nodes().length);
}

function ShowCathLabColumn() {
    var cols = [
    { targets: [0], data: "ID", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "ORDERDATETIME", className: '', visible: true, searchable: false, width: "0%" },
    { targets: [2], data: "ProcedureID", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [3], data: "ProcedureName", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [4], data: "PatientType", className: '', visible: false, searchable: true, width: "0%" }
    ]
    return cols;
}
function ShowCathLabRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowCathLab(id) {
    var Url = baseURL + "ShowResultsViewCathLab";
    var param = {
        registrationno: id
    }

    //    $('#preloader').show();
    //    $("#grid").css("visibility", "hidden");

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

            BindCathLab(data.list);
            //            $('#preloader').hide();
            //            $("#grid").css("visibility", "visible");

        },
        error: function (xhr, desc, err) {
            //            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindCathLab(data) {
    //TblCathLab = $(TblCathLabID).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowCathLabColumn(),
    //    bAutoWidth: false,
    //    scrollY: 400,
    //    scrollX: true,
    //    fnRowCallback: ShowCathLabRowCallBack()
    //});
    TblCathLab = $(TblCathLabID).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 280,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        //iDisplayLength: 25,
        fnRowCallback: ShowCathLabRowCallBack(),
        columns: ShowCathLabColumn()
    });
    c.SetBadgeText('#badgeCathLab', $(TblCathLabID).DataTable().rows().nodes().length);
}



function FetchPatientDetails(list) {
    c.SetValue('#ID', list[0]);
    c.SetValue('#txtAge', list[8]);
    c.SetValue('#txtGender', list[9]);
}