var c = new Common();
var Action = -1;
var Select2IsClicked = false;

//-------------------------------------------------------
var tblHealtCheckDashboardList;
var tblHealtCheckDashboardId = '#gridHealthCheckUpDashBoard'
var tblHealtCheckDashboardDataRow;

//-------------------------------------------------------
var tblInvestigationList;
var tblInvestigationId = '#gridInvestigation'
var tblInvestigationDataRow;

var tblSelectedInvestigationList;
var tblSelectedInvestigationId = '#gridSelectedTest'
var tblSelectedInvestigationDataRow;

//-------------------------------------------------------
var tblConsulDeprtList;
var tblConsulDeprtListId = '#gridConsultationDept'
var tblConsulDeprtDataRow;

var tblSelectedConsulDeprtList;
var tblSelectedConsulDeprtListId = '#gridSelectedConsulDeprt'
var tblSelectedConsulDeprtDataRow;
//-------------------------------------------------------
var tblProcedureList;
var tblProcedureListId = '#gridOtherProcedure'
var tblProcedureDataRow;

var tblSelectedProcedureList;
var tblSelectedProcedureListId = '#gridSelectedOtherProcedure'
var tblSelectedProcedureDataRow;
//-------------------------------------------------------

var OrderId;
var ProcedureId;
var RequestedId;
var HealthCheckId;

$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // For future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();
    //if (tabNameSelected == $('.nav-tabs .active').text());
    //{
    //       RedrawGrid();
    //}

    RedrawGrid();

})

$(document).on("click", tblHealtCheckDashboardId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblHealtCheckDashboardDataRow = tblHealtCheckDashboardList.row($(this).parents('tr')).data();
    }


    HealthCheckId = tblHealtCheckDashboardDataRow.HealthCheckId;
    
    //var Amount = 1;
    View(HealthCheckId);
    //InvestigationListWithPriceConnection(HealthCheckId);
    //ConsulDeptListWithConnection(HealthCheckId);
    //OtherProcedurewithPriceConnection(HealthCheckId);
    //$('#modalEntry').modal('show');
    RedrawGrid();

});

$(document).on("dblclick", tblInvestigationId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblInvestigationDataRow = tblInvestigationList.row($(this).parents('tr')).data();
    }

    add_InvestigationItem(this);
    remove_SelectedInvetigationItem(this);

    //var HealthCheckId = tblHealtCheckDashboardDataRow.HealthCheckId;
    //InvestigationListWithPriceConnection(HealthCheckId);
    //ConsulDeptListWithConnection(HealthCheckId);
    //OtherProcedurewithPriceConnection(HealthCheckId);
    //$('#modalEntry').modal('show');
    //RedrawGrid();

});

$(document).on("dblclick", tblSelectedInvestigationId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblSelectedInvestigationDataRow = tblSelectedInvestigationList.row($(this).parents('tr')).data();
    }

    //add_InvestigationItem(this);
    remove_SelectedInvetigationItem(this);

    //var HealthCheckId = tblHealtCheckDashboardDataRow.HealthCheckId;
    //InvestigationListWithPriceConnection(HealthCheckId);
    //ConsulDeptListWithConnection(HealthCheckId);
    //OtherProcedurewithPriceConnection(HealthCheckId);
    //$('#modalEntry').modal('show');
    //RedrawGrid();

});

$(document).on("dblclick", tblConsulDeprtListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblConsulDeprtDataRow = tblConsulDeprtList.row($(this).parents('tr')).data();
    }

    add_ConsulDepartItem(this);
    remove_ConsulDepartItem(this);

    //var HealthCheckId = tblHealtCheckDashboardDataRow.HealthCheckId;
    //InvestigationListWithPriceConnection(HealthCheckId);
    //ConsulDeptListWithConnection(HealthCheckId);
    //OtherProcedurewithPriceConnection(HealthCheckId);
    //$('#modalEntry').modal('show');
    //RedrawGrid();

});

$(document).on("dblclick", tblSelectedConsulDeprtListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblSelectedConsulDeprtDataRow = tblSelectedConsulDeprtList.row($(this).parents('tr')).data();
    }

    //add_InvestigationItem(this);
    remove_ConsulDepartItem(this);

    //var HealthCheckId = tblHealtCheckDashboardDataRow.HealthCheckId;
    //InvestigationListWithPriceConnection(HealthCheckId);
    //ConsulDeptListWithConnection(HealthCheckId);
    //OtherProcedurewithPriceConnection(HealthCheckId);
    //$('#modalEntry').modal('show');
    //RedrawGrid();

});

$(document).on("dblclick", tblProcedureListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblProcedureDataRow = tblProcedureList.row($(this).parents('tr')).data();
    }

    add_HealthProcedure(this);
    remove_HealthProcedure(this);

    //var HealthCheckId = tblHealtCheckDashboardDataRow.HealthCheckId;
    //InvestigationListWithPriceConnection(HealthCheckId);
    //ConsulDeptListWithConnection(HealthCheckId);
    //OtherProcedurewithPriceConnection(HealthCheckId);
    //$('#modalEntry').modal('show');
    //RedrawGrid();

});

$(document).on("dblclick", tblSelectedProcedureListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblSelectedProcedureDataRow = tblSelectedProcedureList.row($(this).parents('tr')).data();
    }

    //add_InvestigationItem(this);
    remove_HealthProcedure(this);

    //var HealthCheckId = tblHealtCheckDashboardDataRow.HealthCheckId;
    //InvestigationListWithPriceConnection(HealthCheckId);
    //ConsulDeptListWithConnection(HealthCheckId);
    //OtherProcedurewithPriceConnection(HealthCheckId);
    //$('#modalEntry').modal('show');
    //RedrawGrid();

});

$(document).ready(function () {
    //BindInvestigationWithPriceList([]);
    //BindConsulDeptWithPriceList([]);
    //BindOtherProcedureWithPriceList([]);
    HealtCheckUpConnection();
    InitSelect2();
    InitDateTimePicker();
    SetupSelec2Sample();


    ConsulDeptListpConnection();
    InvestigationListpConnection();
    OtherProcedureConnection();



    InitButton();
    InitDataTables();
    //SetupSelec2Sample();

    RedrawGrid();
    DefaultDisable();
});

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
    else {
        c.Show('#ButtonsOnBoard', true);
        c.Show('#ButtonsOnEntry', false);
    }

    HandleButtonNotUse();
}

function HandleButtonNotUse() {
    $('.NotUse').hide();
}

function InitDataTables() {
    //BindSequence([]);
    BindHealtCheckDashboardList([]);
    //BindInvestigationList([]);
    BindInvestigationWithPriceList([]);
    BindConsulDeptWithPriceList([]);
    BindOtherProcedureWithPriceList([]);
}

function HandleEnableEntries() {




}
function InitDateTimePicker() {
    // Sample usage
    $('#dtMonth').datetimepicker({
        picktime: false
    }).on('dp.change', function (e) {
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        //c.SetDateTimePicker('#dtfrom', b);
    });



}

function InitSelect2() {
    // Sample usage
    Sel2Server($("#Select2Company"), $("#url").data("comp"), function (d) {
        //alert(d.tariffid);
        var CompanyID = (d.id);
        var tarrifId = (d.tariffid);

    });

    Sel2Server($("#Select2Department"), $("#url").data("dept"), function (d) {
        //alert(d.tariffid);
        //var DepartmentID = c.GetSelect2Id('#Select2Department');
        //var tarrifId = (d.tariffid);
    });
    //$('#Select2Company').select2({
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: $("#url").data("gettariff"),
    //        dataType: 'jsonp',
    //        cache: false,
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term,
    //                id: c.GetSelect2
    //            };
    //        },
    //        results: function (data, page) {
    //            var more = (page * pageSize) < data.Total;
    //            return { results: data.Results, more: more };
    //        }
    //    }
    //}).change(function (e) {
    //    var list = e.added;

    //});


    //$('#Select2Department').select2({
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: $("#url").data("getservices"),
    //        dataType: 'jsonp',
    //        cache: false,
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term,
    //                id: c.GetSelect2
    //            };
    //        },
    //        results: function (data, page) {
    //            var more = (page * pageSize) < data.Total;
    //            return { results: data.Results, more: more };
    //        }
    //    }
    //}).change(function (e) {
    //    var list = e.added;

    //});

    //$('#Select2Department').select2({
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: $("#url").data("getservicesdept"),
    //        dataType: 'jsonp',
    //        cache: false,
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term,
    //                ServiceID: c.GetSelect2Id('#Select2Service')

    //            };
    //        },

    //        results: function (data, page) {
    //            var more = (page * pageSize) < data.Total;
    //            return { results: data.Results, more: more };
    //        }

    //    }
    //}).change(function (e) {
    //    var list = e.added.list;
    //    var TableExists = 0;
    //    var TariffID =  c.GetSelect2Id('#select2Tariff');
    //    var ServiceID = c.GetSelect2Id('#Select2Service');
    //    var DepartmentID = c.GetSelect2Id('#Select2Department');
    //    ShowListofNoPriceFetch(TariffID, ServiceID, DepartmentID, TableExists);
    //    ShowListwithPriceFetch(TariffID, ServiceID, DepartmentID, TableExists);
    //    //c.SetDateTimePicker('#dtORderdate', list[0]);
    //    //c.SetSelect2('#select2TicketType', list[1], list[2]);
    //    //var ID = c.GetSelect2Id('#select2orderno');
    //    //TravelOrderList(ID);
    //    //c.SetValue('#txtOrderNumber', c.GetSelect2Text('#select2orderno'));
    //    //$("#btngetOrder").prop("disabled", true);
    //    //$("#btnAdd").prop("disabled", false);
    //    //$("#btnNewEntry").prop("disabled", true);
    //    //FetchAgencyName(list);

    //});



}

function InitButton() {
    var NoFunc = function () {
        //c.ModalShow('#modalEntry', true);
        //$('#modalEntry').modal('show');
    };
    // Sample usage
    //$('#btnProcess').click(function () {

    //    var RegNo = c.GetValue('#txtRegno');
    //    if (RegNo == '') {
    //       RegNo = -1
    //    } 
    //    var FromDate = c.GetDateTimePickerDate('#dtFrom');
    //    var ToDate = c.GetDateTimePickerDate('#dtTo');
    //    Requisitionlist(RegNo, FromDate, ToDate);
    //});

    $('#btnNew').click(function () {
        //if (tblHealtCheckDashboardId.rows('.selected').data().length == 0) {
        //    c.MessageBoxErr("Select...", "Please select a row to view.", null);
        //    return;
        //}


        $('#modalEntry').modal('show');
        RedrawGrid();
        HealthCheckId = 0;
        DefaultEmpty();
    });

    $('#btnSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
        c.ModalShow('#modalEntry', true);
    });

    $('#btnModify').click(function () {
        var YesFunc = function () {
            Action = 2;
            Save();

        };
        c.MessageBoxConfirm("Modify Entry?", "Are you sure you want to Modify the Entry?", YesFunc, null);

    });

    $('#btnReportGen').click(function () {

        //  print_preview();

        $('#myModal').modal('show');
        PrintPreview();

    });

    $('#btnCalculate').click(function () {

        ComputePrice();


    });



}

function DefaultEmpty() {
    c.SetValue('#txtName', '');
    c.SetValue('#txtCode', '');
    c.SetValue('#txtAmount', '');

    c.Select2Clear('#Select2Company');
    c.Select2Clear('#Select2Department');

    c.SetDateTimePicker('#dtMonth', '');

    BindInvestigationWithPriceList([]);
    BindConsulDeptWithPriceList([]);
    BindOtherProcedureWithPriceList([]);

}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}

function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblHealtCheckDashboardList !== undefined) tblHealtCheckDashboardList.columns.adjust().draw();
    if (tblInvestigationList !== undefined) tblInvestigationList.columns.adjust().draw();
    if (tblConsulDeprtList !== undefined) tblConsulDeprtList.columns.adjust().draw();
    if (tblProcedureList !== undefined) tblProcedureList.columns.adjust().draw();
    if (tblSelectedInvestigationList !== undefined) tblSelectedInvestigationList.columns.adjust().draw();
    if (tblSelectedConsulDeprtList !== undefined) tblSelectedConsulDeprtList.columns.adjust().draw();
    if (tblSelectedProcedureList !== undefined) tblSelectedProcedureList.columns.adjust().draw();
    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}

function DefaultDisable() {
    // Sample usage
    c.DisableDateTimePicker('#dtMonth', true);
    //c.DisableSelect2('#Select2RefDoctor', true);
    //c.DisableSelect2('#Select2ProcedureDoneBy', true);




}


//-------------------Dashboard------------------------------------------------------------------------------------------------------------
// Sample usage
// BindDashboard([]);
/*[RenderTable]*/
function BindHealtCheckDashboardList(data) {
    tblHealtCheckDashboardList = $(tblHealtCheckDashboardId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        bAutoWidth: false,
        dom: 'Rlfrtip',
        scrollY: 400,
        scrollX: true,
        fixedHeader: true,
        fnRowCallback: ShowHealtCheckDashboardCallBack(),
        columns: ShowHealthCheckDashboard()
    });


}

function ShowHealtCheckDashboardCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowHealthCheckDashboard() {
    var cols = [
    { targets: [0], data: "SNo", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [1], data: "HealthCheckup", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [2], data: "CompanyName", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [3], data: "StartDateTime", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [4], data: "HealthCheckId", className: '', visible: false, searchable: false, width: "10%" },
    { targets: [5], data: "Code", className: '', visible: false, searchable: false, width: "10%" },
    { targets: [6], data: "DepartmentId", className: '', visible: false, searchable: false, width: "10%" },
    { targets: [7], data: "instructions", className: '', visible: false, searchable: false, width: "10%" },
    { targets: [8], data: "companyid", className: '', visible: false, searchable: false, width: "10%" },
    { targets: [9], data: "EndDateTime", className: '', visible: false, searchable: false, width: "5%" },
    { targets: [10], data: "Deleted", className: '', visible: false, searchable: false, width: "5%" },
    { targets: [11], data: "Blocked", className: '', visible: false, searchable: false, width: "5%" },
    { targets: [12], data: "OperatorID", className: '', visible: false, searchable: false, width: "5%" },
    { targets: [13], data: "UPLOADED", className: '', visible: false, searchable: false, width: "5%" },
    { targets: [14], data: "CompanyCode", className: '', visible: false, searchable: false, width: "5%" }
    ];
    return cols;
}

function HealtCheckUpConnection() {

    var Url = $('#url').data("gethealthdashboard");

    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {

            BindHealtCheckDashboardList(data.list);
            $('#preloader').hide();
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}

//-------------------Investigation Temp ------------------------------------------------------------------------------------------------------------
function BindInvestigationTempList(data) {
    tblSelectedInvestigationList = $(tblSelectedInvestigationId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        bAutoWidth: false,
        dom: 'Rlfrtip',
        scrollY: 400,
        scrollX: true,
        fixedHeader: true,
        fnRowCallback: ShowInvestigationTempCallBack(),
        columns: ShowInvestigationTemp()
    });


}

function ShowInvestigationTempCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowInvestigationTemp() {
    var cols = [
    { targets: [0], data: "SNo", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [1], data: "testid", className: '', visible: false, searchable: false },
    { targets: [2], data: "ItemPrice", className: '', visible: false, searchable: false },
    { targets: [3], data: "tid", className: '', visible: false, searchable: false },
    { targets: [4], data: "Code", className: '', visible: false, searchable: false },
    { targets: [5], data: "testname", className: '', visible: true, searchable: true, width: "20%" },
    { targets: [6], data: "CodeName", className: '', visible: false, searchable: false },
    { targets: [7], data: "stnid", className: '', visible: false, searchable: false },
    { targets: [8], data: "station", className: '', visible: false, searchable: false },
    { targets: [9], data: "sid", className: '', visible: false, searchable: false },
    { targets: [10], data: "sample", className: '', visible: true, searchable: true, width: "20%" },
    { targets: [11], data: "seq", className: '', visible: false, searchable: false },
    { targets: [12], data: "OriginalPrice", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [13], data: "Percentage", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [14], data: "Price", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [15], data: "HealthCheckUpId", className: '', visible: false, searchable: false }
    ];
    return cols;
}

function InvestigationTempConnection() {

    var Url = $('#url').data("investempdisplay");

    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {

            BindInvestigationTempList(data.list);
            $('#preloader').hide();
            RedrawGrid();

        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}

//-------------------Consult Dept Temp ------------------------------------------------------------------------------------------------------------
function BindConsulDeptTempList(data) {
    tblSelectedConsulDeprtList = $(tblSelectedConsulDeprtListId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        bAutoWidth: false,
        dom: 'Rlfrtip',
        scrollY: 400,
        scrollX: true,
        fixedHeader: true,
        fnRowCallback: ShowConsulDeptTempCallBack(),
        columns: ShowConsulDeptTemp()
    });


}

function ShowConsulDeptTempCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowConsulDeptTemp() {
    var cols = [
    { targets: [0], data: "SNo", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [1], data: "DepartmentId", className: '', visible: false, searchable: false },
    { targets: [2], data: "NameCode", className: '', visible: false, searchable: false },
    { targets: [3], data: "Deptname", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [4], data: "ItemPrice", className: '', visible: false, searchable: false },
    { targets: [5], data: "Sequence", className: '', visible: false, searchable: false },
    { targets: [6], data: "OriginalPrice", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [7], data: "Percentage", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [8], data: "Price", className: '', visible: true, searchable: true, width: "5%" }
    ];
    return cols;
}

function ConsulDeptTempConnection() {

    var Url = $('#url').data("deptconsultempdisplay");

    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {

            BindConsulDeptTempList(data.list);
            $('#preloader').hide();
            RedrawGrid();

        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}

//-------------------Health Procedure Temp ------------------------------------------------------------------------------------------------------------
function BindHealhtProcedTempList(data) {
    tblSelectedProcedureList = $(tblSelectedProcedureListId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        bAutoWidth: false,
        dom: 'Rlfrtip',
        scrollY: 400,
        scrollX: true,
        fixedHeader: true,
        fnRowCallback: ShowHealthProcedTempCallBack(),
        columns: ShowHealthProcedTemp()
    });


}

function ShowHealthProcedTempCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowHealthProcedTemp() {
    var cols = [

    { targets: [0], data: "SNo", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [1], data: "ProcedureId", className: '', visible: false, searchable: false },
    { targets: [2], data: "ItemPrice", className: '', visible: false, searchable: false },
    { targets: [3], data: "Code", className: '', visible: false, searchable: false },
    { targets: [4], data: "Name", className: '', visible: false, searchable: false },
    { targets: [5], data: "CodeName", className: '', visible: true, searchable: true, width: "20%" },
    { targets: [6], data: "Sequence", className: '', visible: false, searchable: false },
    { targets: [7], data: "OriginalPrice", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [8], data: "Percentage", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [9], data: "Price", className: '', visible: true, searchable: true, width: "5%" }
    ];
    return cols;
}

function HealthProcedTempConnection() {

    var Url = $('#url').data("depthealthprocedure");

    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {

            BindHealhtProcedTempList(data.list);
            $('#preloader').hide();
            RedrawGrid();

        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}

//-------------------Adding Investigation------------------------------------------------------------------------------------------------------------

function add_InvestigationItem(cell) {
    rowIndex = tblInvestigationList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
 
        $.each(tblSelectedInvestigationList.rows().data(), function (j, re) {
 

            if (tblInvestigationList.cell(rowIndex, 1).data() == tblSelectedInvestigationList.cell(j, 1).data()) {
                $ex = 1;
                console.log('tblInvestigationList.cell(i, 1).data() ' + tblInvestigationList.cell(rowIndex, 1).data());
                console.log('tblSelectedInvestigationList.cell(rowIndex, 1).data() ' + tblSelectedInvestigationList.cell(j, 1).data());
            }
        });

        console.log('tblInvestigationList.cell(rowIndex, 8).data()' + tblInvestigationList.cell(rowIndex, 8).data());
    console.log('tblInvestigationList.cell(rowIndex, 9).data()'+tblInvestigationList.cell(rowIndex, 9).data());
    if ($ex == 0) {
        tblSelectedInvestigationList.row.add({
            SNo: '',
            testid: tblInvestigationList.cell(rowIndex, 1).data(),
            ItemPrice: tblInvestigationList.cell(rowIndex, 2).data(),
            tid: tblInvestigationList.cell(rowIndex, 3).data(),
            Code: tblInvestigationList.cell(rowIndex, 4).data(),
            testname: tblInvestigationList.cell(rowIndex, 5).data(),
            CodeName: tblInvestigationList.cell(rowIndex, 6).data(),
            stnid: tblInvestigationList.cell(rowIndex, 7).data(),
            station: tblInvestigationList.cell(rowIndex, 8).data(),
            sid: tblInvestigationList.cell(rowIndex, 9).data(),
            sample: tblInvestigationList.cell(rowIndex, 10).data(),
            seq: tblInvestigationList.cell(rowIndex, 11).data(),
            OriginalPrice: tblInvestigationList.cell(rowIndex, 12).data(),
            Percentage: tblInvestigationList.cell(rowIndex, 13).data(),
            Price: tblInvestigationList.cell(rowIndex, 14).data(),
            HealthCheckUpId: tblInvestigationList.cell(rowIndex, 15).data(),
        }).draw();
        c.ReSequenceDataTable(tblSelectedInvestigationId, 0);
        InitSelec2Sample();
    }
}

function remove_SelectedInvetigationItem(cell) {
    rowV = $(cell).parents('tr');
    tblSelectedInvestigationList.row(rowV).remove().draw();
    c.ReSequenceDataTable(tblSelectedInvestigationId, 0);
}
//-------------------Investigation List------------------------------------------------------------------------------------------------------------
function BindInvestigationList(data) {
    console.log('BindInvestigationList');
    console.log(data);
    tblInvestigationList = $(tblInvestigationId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 250,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        fixedHeader: true,
        fnRowCallback: ShowInvestigationCallBack(),
        columns: ShowInvestigationList()
    });


}

function ShowInvestigationCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowInvestigationList() {
    var cols = [
    { targets: [0], data: "SNo", className: '', visible: false, searchable: false },
    { targets: [1], data: "testid", className: '', visible: false, searchable: false },
    { targets: [2], data: "ItemPrice", className: '', visible: false, searchable: false },
    { targets: [3], data: "tid", className: '', visible: false, searchable: false },
    { targets: [4], data: "Code", className: '', visible: false, searchable: false },
    { targets: [5], data: "testname", className: '', visible: false, searchable: false },
    { targets: [6], data: "CodeName", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [7], data: "stnid", className: '', visible: false, searchable: false },
    { targets: [8], data: "station", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [9], data: "sid", className: '', visible: false, searchable: false },
    { targets: [10], data: "sample", className: '', visible: false, searchable: false },
    { targets: [11], data: "seq", className: '', visible: false, searchable: false },
    { targets: [12], data: "OriginalPrice", className: '', visible: false, searchable: true },
    { targets: [13], data: "Percentage", className: '', visible: false, searchable: false },
    { targets: [14], data: "Price", className: '', visible: false, searchable: false },
    { targets: [15], data: "HealthCheckUpId", className: '', visible: false, searchable: false }

    ];
    return cols;
}

function InvestigationListpConnection() {

    var Url = $('#url').data("getinvestigationlist");

    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {

            BindInvestigationList(data.list);
            $('#preloader').hide();
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}
//-------------------Investigation With Price------------------------------------------------------------------------------------------------------------
function BindInvestigationWithPriceList(data) {
    tblSelectedInvestigationList = $(tblSelectedInvestigationId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 250,
        //scrollX: '100%',
        processing: false,
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        fixedHeader: true,
        fnRowCallback: ShowInvestigationWithPriceCallBack(),
        columns: ShowInvestigationWithPriceList()
    });

    InitSelec2Sample();
}

function ShowInvestigationWithPriceCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowInvestigationWithPriceList() {
    var cols = [
    { targets: [0], data: "SNo", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [1], data: "testid", className: '', visible: false, searchable: false },
    { targets: [2], data: "ItemPrice", className: '', visible: false, searchable: false },
    { targets: [3], data: "tid", className: '', visible: false, searchable: false },
    { targets: [4], data: "Code", className: '', visible: false, searchable: false },
    { targets: [5], data: "testname", className: '', visible: true, searchable: true, width: "20%" },
    { targets: [6], data: "CodeName", className: '', visible: false, searchable: false },
    { targets: [7], data: "stnid", className: '', visible: false, searchable: false },
    { targets: [8], data: "station", className: '', visible: false, searchable: false },
    { targets: [9], data: "sid", className: '', visible: false, searchable: false },
    { targets: [10], data: "sample", className: 'ClassSelect2Sample', visible: true, searchable: true, width: "20%" },
    { targets: [11], data: "seq", className: '', visible: false, searchable: false },
    { targets: [12], data: "OriginalPrice", className: '', visible: false, searchable: true, width: "10%" },
    { targets: [13], data: "Percentage", className: '', visible: false, searchable: true, width: "5%" },
    { targets: [14], data: "Price", className: '', visible: false, searchable: true, width: "5%" },
    { targets: [15], data: "HealthCheckUpId", className: '', visible: false, searchable: false }
    ];
    return cols;
}

function InvestigationListWithPriceConnection(HealthCheckId) {

    var Url = $('#url').data("getinvestigationlistwithprice");
    var param = {
        HealthCheckId: HealthCheckId
    };

    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

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

            BindInvestigationWithPriceList(data.list);
            $('#preloader').hide();
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}

function SetupSelec2Sample() {

    $.editable.addInputType('select2Sample', {
        element: function (settings, original) {
            var input = $('<input id="txtSample" style="width:100%; height:30px;" type="text" class="sel">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#txtSample').select2({
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    cache: false,
                    quietMillis: 150,
                    url: $('#url').data("getsampleselected"),
                    //url: baseURL + 'Select2EmployeeRelationShip',
                    dataType: 'jsonp',
                    data: function (term, page) {
                        return {
                            pageSize: pageSize,
                            pageNum: page,
                            searchTerm: term
                        };
                    },
                    results: function (data, page) {
                        var more = (page * pageSize) < data.Total;
                        return { results: data.Results, more: more };
                    }
                }
            }).on("select2-blur", function () {
                $("#txtSample").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#txtSample").closest('form').submit(); }
                else { $("#txtSample").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#txtSample').val();
                $("#txtSample").select2("data", { id: a, text: a });
            }).data('select2');

            select2.onSelect = (function (fn) {
                return function (data, options) {
                    var target;
                    if (options != null) {
                        target = $(options.target);
                    }
                    Select2IsClicked = true;
                    return fn.apply(this, arguments);
                }
            })(select2.onSelect);


        },
        submit: function (settings, original) {
            if ($("#txtSample", this).select2('val') != null && $("#txtSample", this).select2('val') != '') {
                $("input", this).val($("#txtSample", this).select2("data").text);

                var rowIndex = tblSelectedInvestigationList.row($(this).closest('tr')).index();
                var id = $("#txtSample", this).select2('data').id;
                tblSelectedInvestigationList.cell(rowIndex, 9).data(id);

            }
        }
    });

}

function InitSelec2Sample() {
    $('.ClassSelect2Sample', tblSelectedInvestigationList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblSelectedInvestigationList.cell($(this).closest('td')).index();
        /*to Get ID*/
        //   var id = c.GetSelect2Id('#select2Relationship');
        //   tblFamilyDetails.cell(cell.row, 0).data(id);
        tblSelectedInvestigationList.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
  {
      "type": 'select2Sample', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
      "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
  });

    // Resize all rows.
    //$(tblSelectedInvestigationList + 'tr').addClass('trclass');
}

//function SetupSelectedPrice() {

//    $.editable.addInputType('txtPrice', {
//        element: function (settings, original) {

//            var input = $('<input id="txtPrice" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control ">');
//            $(this).append(input);

//            return (input);

//        },

//        plugin: function (settings, original) {
//            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
//        }
//    });

//}

function InitSelectedInvestigation() {


    $.editable.addInputType('Select2Sample', {
        element: function (settings, original) {
            var input = $('<input id="txtSample" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            //var a = c.GetSelect2Id('#Select2Qualification');
            var select2 = $(this).find('#txtSample').select2({
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    cache: false,
                    quietMillis: 150,
                    url: $('#url').data("getselec2sample"),
                    //url: baseURL + 'txtSample',
                    dataType: 'jsonp',
                    data: function (term, page) {
                        return {
                            pageSize: pageSize,
                            pageNum: page,
                            searchTerm: term
                            //   Id: a

                        };
                    },
                    results: function (data, page) {
                        var more = (page * pageSize) < data.Total;
                        return { results: data.Results, more: more };
                    }
                }
            }).on("select2-blur", function () {
                $("#txtSample").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#txtSample").closest('form').submit(); }
                else { $("#txtSample").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#txtSample').val();
                $("#txtSample").select2("data", { id: a, text: a });
            }).data('select2');

            select2.onSelect = (function (fn) {
                return function (data, options) {
                    var target;
                    if (options != null) {
                        target = $(options.target);
                    }
                    Select2IsClicked = true;
                    return fn.apply(this, arguments);
                }
            })(select2.onSelect);


        },
        submit: function (settings, original) {
            if ($("#txtSample", this).select2('val') != null && $("#txtQualification", this).select2('val') != '') {
                $("input", this).val($("#txtSample", this).select2("data").text);

                var rowIndex = tblSelectedInvestigationList.row($(this).closest('tr')).index();
                var id = $("#txtSample", this).select2('data').id;
                tblSelectedInvestigationList.cell(rowIndex, 9).data(id);
            }
        }
    });

    //$.editable.addInputType('numberinput', {
    //    element: function (settings, original) {
    //        var input = $('<input value="111" type="text" class="form-control" style="height: 22px;padding-top:0px;padding-bottom:0px;"/>');
    //        $(this).append(input);



    //        return (input);
    //    },
    //    plugin: function (settings, original) {
    //        $(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSeparator: ",", groupSize: 3, digits: 2 });
    //    }
    //});


}


function InitAllocatePrice() {

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassPrice', tblSelectedInvestigationList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblSelectedInvestigationList.cell($(this).closest('td')).index();
        tblSelectedInvestigationList.cell(cell.row, 14).data(sVal);


        var amount = c.GetValue('#txtAmount');


        return sVal;
    },
    {
        "type": 'numbereditor', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // Resize all rows.
    //$(tblSelectedInvestigationList + ' tr').addClass('trclass');

}


//-------------------------------------------------------------------------------------------------------------------------------
//-------------------Adding Consul Department------------------------------------------------------------------------------------------------------------

function add_ConsulDepartItem(cell) {
    rowIndex = tblConsulDeprtList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
  
    console.log(' tblConsulDeprtList.cell(rowIndex, 1).data()' + tblConsulDeprtList.cell(rowIndex, 1).data());
    //$.each(tblConsulDeprtList.rows().data(), function (i, re) {
    //    if (tblConsulDeprtList.cell(i, 0).data() == tblSelectedConsulDeprtList.cell(rowIndex, 0).data()) {
    //        $ex = 1;
    //    }
    //});

    $.each(tblSelectedConsulDeprtList.rows().data(), function (i, re) {
        console.log('tblSelectedConsulDeprtList.cell(i, 1).data()' + tblSelectedConsulDeprtList.cell(i, 1).data());
        if (tblSelectedConsulDeprtList.cell(i, 1).data() == tblConsulDeprtList.cell(rowIndex, 1).data()) {
            $ex = 1;
        }
    });

    if ($ex == 0) {
        tblSelectedConsulDeprtList.row.add({
            SNo: '',
            DepartmentId: tblConsulDeprtList.cell(rowIndex, 1).data(),
            NameCode: tblConsulDeprtList.cell(rowIndex, 2).data(),
            Deptname: tblConsulDeprtList.cell(rowIndex, 3).data(),
            ItemPrice: tblConsulDeprtList.cell(rowIndex, 4).data(),
            Sequence: tblConsulDeprtList.cell(rowIndex, 5).data(),
            OriginalPrice: tblConsulDeprtList.cell(rowIndex, 6).data(),
            Percentage: tblConsulDeprtList.cell(rowIndex, 7).data(),
            Price: tblConsulDeprtList.cell(rowIndex, 8).data(),
        }).draw();
        c.ReSequenceDataTable(tblSelectedConsulDeprtListId, 0);
        //InitSelectedPrice();
    }
}

function remove_ConsulDepartItem(cell) {
    rowV = $(cell).parents('tr');
    tblSelectedConsulDeprtList.row(rowV).remove().draw();
    // c.ReSequenceDataTable(tblSelectedInvestigationId, 0);
}

//-------------------ConsulatationDept List------------------------------------------------------------------------------------------------------------
function BindConsulDeptList(data) {
    tblConsulDeprtList = $(tblConsulDeprtListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 250,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        fixedHeader: true,
        fnRowCallback: ShowConsulDeptCallBack(),
        columns: ShowConsulDeptnList()
    });


}

function ShowConsulDeptCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowConsulDeptnList() {
    var cols = [
    { targets: [0], data: "SNo", className: '', visible: false, searchable: false },
    { targets: [1], data: "DepartmentId", className: '', visible: false, searchable: false },
    { targets: [2], data: "NameCode", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [3], data: "Deptname", className: '', visible: false, searchable: false },
    { targets: [4], data: "ItemPrice", className: '', visible: false, searchable: false },
    { targets: [5], data: "Sequence", className: '', visible: false, searchable: false },
    { targets: [6], data: "OriginalPrice", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [7], data: "Percentage", className: '', visible: false, searchable: false },
    { targets: [8], data: "Price", className: '', visible: false, searchable: false }

    ];
    return cols;
}

function ConsulDeptListpConnection() {

    var Url = $('#url').data("getconsuldeptlist");



    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {

            BindConsulDeptList(data.list);
            $('#preloader').hide();
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}
//-------------------ConsulatationDept List with Price------------------------------------------------------------------------------------------------------------
function BindConsulDeptWithPriceList(data) {
    tblSelectedConsulDeprtList = $(tblSelectedConsulDeprtListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 250,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        fixedHeader: true,
        fnRowCallback: ShowConsulDeptWithPriceCallBack(),
        columns: ShowConsulDeptnWithPriceList()
    });


}

function ShowConsulDeptWithPriceCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowConsulDeptnWithPriceList() {
    var cols = [
    { targets: [0], data: "SNo", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [1], data: "DepartmentId", className: '', visible: false, searchable: false },
    { targets: [2], data: "NameCode", className: '', visible: false, searchable: false },
    { targets: [3], data: "Deptname", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [4], data: "ItemPrice", className: '', visible: false, searchable: false },
    { targets: [5], data: "Sequence", className: '', visible: false, searchable: false },
    { targets: [6], data: "OriginalPrice", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [7], data: "Percentage", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [8], data: "Price", className: '', visible: true, searchable: true, width: "5%" }


    ];
    return cols;
}

function ConsulDeptListWithConnection(HealthCheckId) {

    var Url = $('#url').data("getconsuldeptlistwithprice");

    var param = {
        HealthCheckId: HealthCheckId
    };

    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");
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

            BindConsulDeptWithPriceList(data.list);
            $('#preloader').hide();
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}

//-------------------Adding Health Procedure------------------------------------------------------------------------------------------------------------

function add_HealthProcedure(cell) {
    rowIndex = tblProcedureList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    console.log('tblSelectedProcedureList.cell(rowIndex, 1).data()' + tblSelectedProcedureList.cell(rowIndex, 1).data());
    console.log('tblProcedureList.cell(rowIndex, 1).data()' + tblProcedureList.cell(rowIndex, 1).data());
    //$.each(tblProcedureList.rows().data(), function (i, re) {
    //    if (tblProcedureList.cell(i, 1).data() == tblSelectedProcedureList.cell(rowIndex, 1).data()) {
    //        $ex = 1;
    //    }
    //});

    $.each(tblSelectedProcedureList.rows().data(), function (i, re) {
        if (tblSelectedProcedureList.cell(i, 1).data() == tblProcedureList.cell(rowIndex, 1).data()) {
            $ex = 1;
        }
    });

    if ($ex == 0) {
        tblSelectedProcedureList.row.add({
            SNo: '',
            ProcedureId: tblProcedureList.cell(rowIndex, 1).data(),
            ItemPrice: tblProcedureList.cell(rowIndex, 2).data(),
            Code: tblProcedureList.cell(rowIndex, 3).data(),
            Name: tblProcedureList.cell(rowIndex, 4).data(),
            CodeName: tblProcedureList.cell(rowIndex, 5).data(),
            Sequence: tblProcedureList.cell(rowIndex, 6).data(),
            OriginalPrice: tblProcedureList.cell(rowIndex, 7).data(),
            Percentage: tblProcedureList.cell(rowIndex, 8).data(),
            Price: tblProcedureList.cell(rowIndex, 9).data(),
        }).draw();
        c.ReSequenceDataTable(tblSelectedProcedureListId, 0);
        //InitSelectedPrice();
    }
}

function remove_HealthProcedure(cell) {
    rowV = $(cell).parents('tr');
    tblSelectedProcedureList.row(rowV).remove().draw();
    // c.ReSequenceDataTable(tblSelectedInvestigationId, 0);
}
//-------------------Other Procedures------------------------------------------------------------------------------------------------------------
function BindOtherProcedureList(data) {
    tblProcedureList = $(tblProcedureListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 250,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        fixedHeader: true,
        fnRowCallback: ShowOtherProcedureCallBack(),
        columns: ShowOtherProcedureDeptnList()
    });


}

function ShowOtherProcedureCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowOtherProcedureDeptnList() {
    var cols = [
    { targets: [0], data: "SNo", className: '', visible: false, searchable: false },
    { targets: [1], data: "ProcedureId", className: '', visible: false, searchable: false },
    { targets: [2], data: "ItemPrice", className: '', visible: false, searchable: false },
    { targets: [3], data: "Code", className: '', visible: false, searchable: false },
    { targets: [4], data: "Name", className: '', visible: false, searchable: false },
    { targets: [5], data: "CodeName", className: '', visible: true, searchable: true, width: "20%" },
    { targets: [6], data: "Sequence", className: '', visible: false, searchable: false },
    { targets: [7], data: "OriginalPrice", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [8], data: "Percentage", className: '', visible: false, searchable: false },
    { targets: [9], data: "Price", className: '', visible: false, searchable: false }




    ];
    return cols;
}

function OtherProcedureConnection() {

    var Url = $('#url').data("getotherprocedure");

    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {

            BindOtherProcedureList(data.list);
            $('#preloader').hide();
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}
//---------------------Other Procedures with Price----------------------------------------------------------------------------------------------------------
function BindOtherProcedureWithPriceList(data) {
    tblSelectedProcedureList = $(tblSelectedProcedureListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 250,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        fixedHeader: true,
        fnRowCallback: ShowOtherProcedureWithPriceCallBack(),
        columns: ShowOtherProcedureWithPriceDeptnList()
    });


}

function ShowOtherProcedureWithPriceCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowOtherProcedureWithPriceDeptnList() {
    var cols = [

    { targets: [0], data: "SNo", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [1], data: "ProcedureId", className: '', visible: false, searchable: false },
    { targets: [2], data: "ItemPrice", className: '', visible: false, searchable: false },
    { targets: [3], data: "Code", className: '', visible: false, searchable: false },
    { targets: [4], data: "Name", className: '', visible: false, searchable: false },
    { targets: [5], data: "CodeName", className: '', visible: true, searchable: true, width: "20%" },
    { targets: [6], data: "Sequence", className: '', visible: false, searchable: false },
    { targets: [7], data: "OriginalPrice", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [8], data: "Percentage", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [9], data: "Price", className: '', visible: true, searchable: true, width: "5%" }

    ];
    return cols;
}

function OtherProcedurewithPriceConnection(HealthCheckId) {

    var Url = $('#url').data("getotherprocedurewithprice");

    var param = {
        HealthCheckId: HealthCheckId
    };
    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

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

            BindOtherProcedureWithPriceList(data.list);
            $('#preloader').hide();
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}
//-------------------------------------------------------------------------------------------------------------------------------

function Validated() {

    var ret = false;

    ret = c.IsEmpty('#txtCode');

    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Code');
        return false;
    }

    ret = c.IsEmpty('#txtName');

    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a HealthCheckup Name');
        return false;
    }

    ret = c.IsEmptyById('#Select2Department');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Department');
        return false;
    }

    ret = c.IsEmptyById('#Select2Company');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Company');
        return false;
    }


    return true;

}
//-------------------------------------------------------------------------------------------------------------------------------
function ComputePrice() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = 1;
    entry.Amount = c.GetValue('#txtAmount');
    //entry.Deleted = 0;
    //entry.TariffID  = c.GetSelect2Id('#select2Tariff');
    //entry.ServiceID = c.GetSelect2Id('#Select2Service');
    entry.ComputeItemDetailsPrice = [];

    $.each(tblSelectedInvestigationList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.ComputeItemDetailsPrice.push({
            Id: row.SNo,
            TestName: row.testname,
            Sample: row.sample,
            OriginalPrice: row.OriginalPrice,
            Percentage: row.Percentage,
            Price: row.Price,
            HealthCheckUpId: HealthCheckId === '' ? 0 : HealthCheckId,
            testid: row.testid,
            tid: row.tid,
            stnid: row.stnid,
            station: row.station,
            sid: row.sid
            //ParameterId: row.PenaltyName.split(" ")[0],
            ////type: c.MomentYYYYMMDD(row.PenaltyDate),
            //Refund: row.Refund === 'Yes' ? 1 : 0,
            //testAppId: false,
            //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
        });
    });

    entry.ComputeItemDepartConsult = [];
    $.each(tblSelectedConsulDeprtList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.ComputeItemDepartConsult.push({
            SNo: row.SNo,
            DepartmentId: row.DepartmentId,
            OriginalPrice: row.OriginalPrice,
            Percentage: row.Percentage,
            Price: row.Price,
            HCUId: HealthCheckId === '' ? 0 : HealthCheckId
            //ParameterId: row.PenaltyName.split(" ")[0],
            ////type: c.MomentYYYYMMDD(row.PenaltyDate),
            //Refund: row.Refund === 'Yes' ? 1 : 0,
            //testAppId: false,
            //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
        });
    });


    entry.ComputeHealthProcedure = [];
    $.each(tblSelectedProcedureList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.ComputeHealthProcedure.push({
            SNo: row.SNo,
            ProcedureId: row.ProcedureId,
            OriginalPrice: row.OriginalPrice,
            Percentage: row.Percentage,
            Price: row.Price,
            HCUId: HealthCheckId === '' ? 0 : HealthCheckId
            //ParameterId: row.PenaltyName.split(" ")[0],
            ////type: c.MomentYYYYMMDD(row.PenaltyDate),
            //Refund: row.Refund === 'Yes' ? 1 : 0,
            //testAppId: false,
            //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
        });
    });



    $.ajax({
        url: $('#url').data("computeitemprice"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            c.ButtonDisable('#btnCalculate', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            RedrawGrid();
            c.ButtonDisable('#btnCalculate', false);
            //c.ButtonDisable('#btnSave', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                if (Action == 3) {
                    //                    tblScientificAchievement.row('tr.selected').remove().draw(false);
                    //                    tblTrainingDetails.row('tr.selected').remove().draw(false);
                    //tblFamilyDetails.row('tr.selected').remove().draw(false);
                    //                    tblRelationShipDetails.row('tr.selected').remove().draw(false);
                    //                    tblPreviousExpDetails.row('tr.selected').remove().draw(false);
                    //                    tblQualificationDetails.row('tr.selected').remove().draw(false);
                }

                Action = 0;
                HandleEnableButtons();
                //HandleEnableEntries();
                InvestigationTempConnection();
                ConsulDeptTempConnection();
                HealthProcedTempConnection();
                RedrawGrid();
                //c.ModalShow('#modalEntry', false);

            };

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#btnSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

    return ret;
}
//-------------------------------------------------------------------------------------------------------------------------------

function Save() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    //Id-MaxIdSql
    entry.Action = 1;
    entry.CompanyId = c.GetSelect2Id('#Select2Company');
    entry.Code = c.GetValue('#txtCode');
    entry.DepartmentId = c.GetSelect2Id('#Select2Department');
    entry.Amount = c.GetValue('#txtAmount');
    //StartDateSql
    entry.Deleted = 0;
    entry.Blocked = 0;
    //OperatorId basecontroler
    entry.Name = c.GetValue('#txtName');
    //for deleted /////
    entry.HealthCheckId = HealthCheckId;
    //entry.Sample;

    entry.HealthInvestigationDetailsSave = [];
    $.each(tblSelectedInvestigationList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.HealthInvestigationDetailsSave.push({
            Id: row.SNo,
            TestName: row.testname,
            OriginalPrice: row.OriginalPrice,
            Percentage: row.Percentage,
            Price: row.Price,
            HealthCheckUpId: HealthCheckId === '' ? 0 : HealthCheckId,
            ServiceId: row.testid,
            stationid: row.stnid,
            SampleId: row.sid,
            Sample: row.Sample
            //ParameterId: row.PenaltyName.split(" ")[0],
            ////type: c.MomentYYYYMMDD(row.PenaltyDate),
            //Refund: row.Refund === 'Yes' ? 1 :     0,
            //testAppId: false,
            //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
        });
    });


    entry.ComputeConsultationDepartmentSave = [];
    $.each(tblSelectedConsulDeprtList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.ComputeConsultationDepartmentSave.push({
            SNo: row.SNo,
            DepartmentId: row.DepartmentId,
            OriginalPrice: row.OriginalPrice,
            Percentage: row.Percentage,
            Price: row.Price,
            HCUId: HealthCheckId === '' ? 0 : HealthCheckId
            //ParameterId: row.PenaltyName.split(" ")[0],
            ////type: c.MomentYYYYMMDD(row.PenaltyDate),
            //Refund: row.Refund === 'Yes' ? 1 : 0,
            //testAppId: false,
            //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
        });
    });


    entry.ComputeHealthProcedureSave = [];
    $.each(tblSelectedProcedureList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.ComputeHealthProcedureSave.push({
            SNo: row.SNo,
            ProcedureId: row.ProcedureId,
            OriginalPrice: row.OriginalPrice,
            Percentage: row.Percentage,
            Price: row.Price,
            HCUId: HealthCheckId === '' ? 0 : HealthCheckId
            //ParameterId: row.PenaltyName.split(" ")[0],
            ////type: c.MomentYYYYMMDD(row.PenaltyDate),
            //Refund: row.Refund === 'Yes' ? 1 : 0,
            //testAppId: false,
            //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
        });
    });

    console.log('HealthCheckId -> ' + HealthCheckId);
    console.log(entry);

     $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            c.ButtonDisable('#btnCalculate', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            c.ButtonDisable('#btnCalculate', false);
            c.ButtonDisable('#btnSave', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                if (Action == 3) {
                    //                    tblScientificAchievement.row('tr.selected').remove().draw(false);
                    //                    tblTrainingDetails.row('tr.selected').remove().draw(false);
                    //tblFamilyDetails.row('tr.selected').remove().draw(false);
                    //                    tblRelationShipDetails.row('tr.selected').remove().draw(false);
                    //                    tblPreviousExpDetails.row('tr.selected').remove().draw(false);
                    //                    tblQualificationDetails.row('tr.selected').remove().draw(false);
                }

                Action = 0;
                HandleEnableButtons();
                //HandleEnableEntries();

            };

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#btnSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });
    
    return ret;
}
//-------------------------------------------------------------------------------------------------------------------------------

function View(HealthCheckId) {

    var Url = $('#url').data("view");
    //var Url = baseURL + "ShowSelected";
    var param = {
        HealthCheckId: HealthCheckId

    };

    $('#preloader').show();
    //$('.Hide').hide();

    $.ajax({
        url: Url,
        data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (result) {
            $('#preloader').hide();
            $('.Show').show();

            //if (FetchFindingsResults.length == 0) {
            //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
            //    tblRequisitionList.row('tr.selected').remove().draw(false);
            //    return;
            //}

            var data = result.list[0];
            c.SetValue('#txtCode', data.Code);
            c.SetValue('#txtName', data.HealthCheckUpName);
            c.SetValue('#txtAmount', data.Amount);
            /*Select2*/
            c.SetSelect2('#Select2Company', data.companyid, data.CompanyName);
            c.SetSelect2('#Select2Department', data.DepartmentId, data.DepartmentName);

            c.SetDateTimePicker('#dtMonth', data.Date);
            //c.SetDateTimePicker('#dtProceduredoneon', moment(data.TestDoneDttm));


            ///*Table Show*/

            BindInvestigationWithPriceList(data.InvestigationList);
            BindConsulDeptWithPriceList(data.ConsultationDept);
            BindOtherProcedureWithPriceList(data.OtherProceduresList);
            // InitSelec2Sample();
            //BindFindingsTbl(data.FindingsResult);
            //BindTrainingDetails(data.TrainingDetailsTable);
            //BindFamilyDetails(data.FamilyDetailsTable);
            //BindRelationShipDetails(data.RelationShipDetailsTable);
            //BindPreviousExpDetails(data.PreviousExperienceDetailsTable);
            //BindQualificationDetails(data.QualificationDetailsTable);


            // /HandleEnableButtons();
            HandleEnableEntries();
            c.ModalShow('#modalEntry', true);
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
