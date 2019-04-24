var c = new Common();
var Action = -1;
var Select2IsClicked = false;

//-------------------------------------------------------
var tblCancelReceiptViewList;
var tblCancelReceiptViewId = '#gridReceiptMapping'
var tblCancelReceiptViewDataRow;

//-------------------------------------------------------
var tblSpecialisationList;
var tblSpecialisationId = '#gridSpecialisationList'
var tblSpecialisationDataRow;



$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // For future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();
    //if (tabNameSelected == $('.nav-tabs .active').text());
    //{
    //       RedrawGrid();
    //}

    RedrawGrid();

})

$(document).on("click", tblSpecialisationId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblSpecialisationDataRow = tblSpecialisationList.row($(this).parents('tr')).data();
        var FromDate = tblSpecialisationDataRow.billdatetime;
        var RegNo = tblSpecialisationDataRow.registrationno;
        var Service = tblSpecialisationDataRow.serviceid;
        var servicename = tblSpecialisationDataRow.ServiceName;
        var opbillId = tblSpecialisationDataRow.opbillid;
        var SNO = tblSpecialisationDataRow.SNO;


        Action = 2;
        ShowReceiptViewConnection(FromDate, RegNo, Service);
        c.SetValue('#txtPin', RegNo);
        c.SetValue('#opbillId', opbillId);
   ///    c.SetValue('#BillNo', BillNo);
        c.SetValue('#txtServiceType', servicename);
        c.SetValue('#txtBIllDateTime', FromDate);
        c.SetValue('#SNO', SNO);
        c.ModalShow('#modalEntry', true);
        //View(Id);

       // HandleEnableButtons();
    }
    RedrawGrid();

});

$(document).on("click", tblCancelReceiptViewId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblCancelReceiptViewDataRow = tblCancelReceiptViewList.row($(this).parents('tr')).data();
        var FromDate = c.GetDateTimePickerDateTimeSCS('#dtFromDate');
        var ToDate = c.GetDateTimePickerDateTimeSCS('#dtToDate');
        var RegNo = tblCancelReceiptViewDataRow.registrationno;
        var Service = tblCancelReceiptViewDataRow.serviceId;
        var BillNo = tblCancelReceiptViewDataRow.billno;
        var opbillid = c.GetValue('#opbillId');
        var SNO = c.GetValue('#SNO');
        BindSpecialisationList([]);
        CancelMapping(FromDate, ToDate, RegNo, Service, opbillid, SNO, BillNo);
        c.ModalShow('#modalEntry', false);

    }
    RedrawGrid();

});


    
$(document).ready(function () {
  //  HandleEnableButtons();
    //BindInvestigationWithPriceList([]);
    //BindConsulDeptWithPriceList([]);
    //BindOtherProcedureWithPriceList([]);
    //  ORSurgeryConnection();

    var FromDate = c.GetDateTimePickerDateTimeSCS('#dtFromDate');
    var ToDate = c.GetDateTimePickerDateTimeSCS('#dtToDate');


    CancelOpReceiptConnection(FromDate, ToDate);
    InitDateTimePicker();
    DefaultValues();
    //ConsulDeptListpConnection();
    //InvestigationListpConnection();
    //OtherProcedureConnection();
  
    

    InitButton();
    InitDataTables();
    //SetupSelec2Sample();

    RedrawGrid();
    DefaultDisable();
 
});


function InitDateTimePicker() {
    // Sample usage
    $('#dtFromDate').datetimepicker({
        picktime: false,
        //   format: 'mm-yyyy'
    }).on('dp.change', function (e) {
        //c.SetDateTimePicker('#dtMonth');
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        //c.SetDateTimePicker('#dtfrom', new Date(year, month, 1));
    });

    $('#dtToDate').datetimepicker({
        picktime: false,
        //   format: 'mm-yyyy'
    }).on('dp.change', function (e) {
        //c.SetDateTimePicker('#dtMonth');
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        //c.SetDateTimePicker('#dtfrom', new Date(year, month, 1));
    });


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
    //BindORSurgeryListDashboardList([]);
  
    BindSpecialisationList([]);
    //BindSpecialisationSelected([]);
    //BindOtherProcedureWithPriceList([]);
}

function HandleEnableEntries() {




}


function InitSelect2() {
    // Sample usage
    Sel2Server($("#Select2Department"), $("#url").data("getdepartment"), function (d) {
        //alert(d.tariffid);
        //var DepartmentID = c.GetSelect2Id('#Select2Department');
        //var tarrifId = (d.tariffid);
        var Id = (d.id);
        //SpecialisationSelectedConnection(Id);
    });

    $("#Select2Type").select2({
        data: [{ id: 1, text: 'Major' },
               { id: 2, text: 'Moderate' },
               { id: 3, text: 'Minor' }],
        minimumResultsForSearch: -1
    }).change(function (e) {
        //var list = e.added.list;
        //var Service = c.GetSelect2Id('#select2PackageType');
        //ShowListPackage(Service);
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

        Action = 1;
        HandleEnableButtons();
        $('#modalEntry').modal('show');
        RedrawGrid();
        DefaultEmpty();
    });

    $('#btnSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
        //c.ModalShow('#modalEntry', true);
    });

    $('#btnModify').click(function () {
        var YesFunc = function () {
            Action = 2;
            Save();

        };
        c.MessageBoxConfirm("Modify Entry?", "Are you sure you want to Modify the Entry?", YesFunc, null);

    });

    $('#btnpreview').click(function () {
        var FromDate = c.GetDateTimePickerDateTimeSCS('#dtFromDate');
        var ToDate = c.GetDateTimePickerDateTimeSCS('#dtToDate');
        CancelOpReceiptConnection(FromDate, ToDate);
    });

    $('#btnAddAll').click(function () {
        $('#modalEntry').modal('show');
        SelectedConnection();
       
    });

    $('#btnRemoveAll').click(function () {
        SpecialisationConnection();
        BindSpecialisationSelected([]);
        $('#modalEntry').modal('show');
    });


    

    $('#btnDelete').click(function () {
        Action = 3;
        Save();
    });



}

function DefaultEmpty()
{
    c.SetValue('#txtSurgeryName', '');
    c.SetValue('#txtCostPrice', '');
    c.SetValue('#txtCode', '');
    c.SetValue('#txtInstruction', '');
    c.Select2Clear('#Select2Type');
    c.Select2Clear('#Select2Department');

    //c.SetDateTimePicker('#dtMonth', '');

    //BindORSurgeryListDashboardList([]);
    //BindSpecialisationList([]);
   // BindSpecialisationSelected([]);
}

function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    //if (tblORSurgeryDashboardList !== undefined) tblORSurgeryDashboardList.columns.adjust().draw();
    if (tblSpecialisationList !== undefined) tblSpecialisationList.columns.adjust().draw();
    if (tblCancelReceiptViewList !== undefined) tblCancelReceiptViewList.columns.adjust().draw();
    //if (tblProcedureList !== undefined) tblProcedureList.columns.adjust().draw();
    //if (tblSelectedInvestigationList !== undefined) tblSelectedInvestigationList.columns.adjust().draw();
    //if (tblSelectedConsulDeprtList !== undefined) tblSelectedConsulDeprtList.columns.adjust().draw();
    //if (tblSelectedProcedureList !== undefined) tblSelectedProcedureList.columns.adjust().draw();
    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}

function DefaultDisable() {
    // Sample usage
    c.Disable('#txtPin', true);
    c.Disable('#txtServiceType', true);
    c.Disable('#txtBIllDateTime', true);
    //c.DisableDateTimePicker('#dtMonth', true);
    //c.DisableSelect2('#Select2RefDoctor', true);
    //c.DisableSelect2('#Select2ProcedureDoneBy', true);




}

function DefaultValues() {
    // Sample usage
    // c.SetValue('#txtDays', '30');
    //    c.SetSelect2('#select2PackageType', '7', 'Procedure');
    // c.iCheckSet('#iChkLast3Mos', true);

    c.SetSelect2('#Select2Type', '1', 'Major');

}

//-------------------DashBoard List ------------------------------------------------------------------------------------------------------------
function BindSpecialisationList(data) {
    tblSpecialisationList = $(tblSpecialisationId).DataTable({
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
        fnRowCallback: ShowSpecialisationCallBack(),
        columns: ShowCancelDashboardList()
    });


}

function ShowSpecialisationCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['ReIssueBillNo'];
        var $nRow = $(nRow);

    //    //WardDemand
        if (value !== null) {
            $nRow.css({ "background-color": "#d7ffea" })
        }
        //    //ISSUED
        //else if (value == 1) {
        //    $nRow.css({ "background-color": "#d7ffea" })
        //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    };
    return rc;

}

function ShowCancelDashboardList() {
    var cols = [
                
                { targets: [0], data: "PIN", className: '', visible: true, searchable: true, width: "5%" },
                { targets: [1], data: "billno", className: '', visible: true, searchable: false, width: "10%" },
                { targets: [2], data: "ServiceName", className: '', visible: true, searchable: true, width: "10%" },
                { targets: [3], data: "billdatetime", className: '', visible: true, searchable: false, width: "10%" },
                { targets: [4], data: "BillAmount", className: '', visible: true, searchable: false, width: "5%" },
                { targets: [5], data: "Cancelreason", className: '', visible: true, searchable: false, width: "15%" },
                { targets: [6], data: "ReIssueBillNo", className: '', visible: true, searchable: false, width: "10%" },  
                { targets: [7], data: "canceldatetime", className: '', visible: false, searchable: false, width: "10%" },
                { targets: [8], data: "serviceid", className: '', visible: false, searchable: false, width: "10%" },
                { targets: [9], data: "opbillid", className: '', visible: false, searchable: false, width: "10%" },
                { targets: [10], data: "registrationno", className: '', visible: false, searchable: false, width: "10%" },
                { targets: [11], data: "SNO", className: '', visible: false, searchable: false, width: "10%" },
                { targets: [12], data: "tagId", className: '', visible: false, searchable: false, width: "10%" }
             
    
    ];
    return cols;
}

function CancelOpReceiptConnection(FromDate,ToDate) {

    var Url = $('#url').data("canceloprecept");

    var param = {
        FromDate: FromDate,
        ToDate: ToDate
    };
    $('#preloader').show();
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
            $('#preloader').hide();
            BindSpecialisationList(data.list);
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

function CancelMapping(FromDate, ToDate, RegNo, Service, opbillid, SNO, BillNo) {

    var Url = $('#url').data("cancelmapping");

    var param = {
        FromDate: FromDate,
        ToDate: ToDate,
        RegNo: RegNo,
        Service: Service,
        opbillid: opbillid,
        SNO: SNO,
        BillNo: BillNo
    };
    $('#preloader').show();
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
            $('#preloader').hide();
            BindSpecialisationList(data.list);
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
//----------------------------------------------------------------------------------------------------------------

function BindCancelReceiptView(data) {
    tblCancelReceiptViewList = $(tblCancelReceiptViewId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        bAutoWidth: true,
        dom: 'Rlfrtip',
        scrollY: 400,
        scrollX: true,
        fixedHeader: true,
        //fnRowCallback: ShowSpecialisationSelectedCallBack(),
        columns: ShowReceiptView()
    });


}

function ShowReceiptViewCallBack() {
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

function ShowReceiptView() {
    var cols = [
     { targets: [0], data: "billno", className: '', visible: true, searchable: true, width: "5%" },
     { targets: [1], data: "Servicename", className: '', visible: true, searchable: true, width: "15%" },
     { targets: [2], data: "DocCode", className: '', visible: true, searchable: true, width: "15%" },
     { targets: [3], data: "category", className: '', visible: true, searchable: true, width: "10%" },
     { targets: [4], data: "billdatetime", className: '', visible: true, searchable: true, width: "10%" },
     { targets: [5], data: "Amount", className: '', visible: true, searchable: true, width: "10%" },
     { targets: [6], data: "registrationno", className: '', visible: false, searchable: true, width: "10%" },
     { targets: [7], data: "serviceId", className: '', visible: false, searchable: true, width: "10%" },
     { targets: [8], data: "Id", className: '', visible: false, searchable: true, width: "10%" }
    ];
    return cols;
}

function ShowReceiptViewConnection(FromDate, RegNo, Service) {

    var Url = $('#url').data("cancelreceiptview");

    var param = {
        FromDate: FromDate,
        RegNo: RegNo,
        Service: Service
    };
   $('#preloader').show();
  //  $('#loadingpdf').show();
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
            $('#preloader').hide();
            BindCancelReceiptView(data.list);
        //    $('#loadingpdf').hide();
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
           /// $('#loadingpdf').hide();
  
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}

//-------------------------------------------------------------------------------------------------------------------------------
//-------------------Adding Specialisation List------------------------------------------------------------------------------------------------------------

function add_SpecialisationItem(cell) {
    rowIndex = tblSpecialisationList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    $.each(tblSpecialisationList.rows().data(), function (i, re) {
        if (tblSpecialisationList.cell(i, 0).data() == tblSelectedSpecilisationList.cell(rowIndex, 0).data()) {
            $ex = 1;
        }
    });
    if ($ex == 0) {
        tblSelectedSpecilisationList.row.add({
            Id: tblSpecialisationList.cell(rowIndex, 0).data(),
            Name: tblSpecialisationList.cell(rowIndex, 1).data(),
          
        }).draw();
        //c.ReSequenceDataTable(tblSelectedSpecilisationList, 0);
        //InitSelectedPrice();
    }
}

function remove_SpecialisationItem(cell) {
    rowV = $(cell).parents('tr');
    tblSpecialisationList.row(rowV).remove().draw();
    // c.ReSequenceDataTable(tblSelectedInvestigationId, 0);
}

//-------------------Adding Health Procedure------------------------------------------------------------------------------------------------------------
function add_SelectedSpecialisationItem(cell) {
    rowIndex = tblSelectedSpecilisationList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    $.each(tblSelectedSpecilisationList.rows().data(), function (i, re) {
        if (tblSelectedSpecilisationList.cell(i, 0).data() == tblSpecialisationList.cell(rowIndex, 0).data()) {
            $ex = 1;
        }
    });
    if ($ex == 0) {
        tblSpecialisationList.row.add({
            Id: tblSelectedSpecilisationList.cell(rowIndex, 0).data(),
            Name: tblSelectedSpecilisationList.cell(rowIndex, 1).data(),

        }).draw();
        //c.ReSequenceDataTable(tblSelectedSpecilisationList, 0);
        //InitSelectedPrice();
    }
}

function remove_SelectedSpecialisationItem(cell) {
    rowV = $(cell).parents('tr');
    tblSelectedSpecilisationList.row(rowV).remove().draw();
    // c.ReSequenceDataTable(tblSelectedInvestigationId, 0);
}

//-------------------------------------------------------------------------------------------------------------------------------

function Validated() {

   var ret = false;

    //ret = c.IsEmpty('#txtSurgeryName');

    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please input a Surgery Name');
    //    return false;
    //}
    
    //ret = c.IsEmpty('#txtCostPrice');

    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a Cost Price');
    //    return false;
    //}

    //ret = c.IsEmpty('#txtCode');

    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a Code');
    //    return false;
    //}

    //ret = c.IsEmptyById('#Select2Type');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a Surgery Type');
    //    return false;
    //}

    //ret = c.IsEmptyById('#Select2Department');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a Department');
    //    return false;
    //}


  return true;

}
//-------------------------------------------------------------------------------------------------------------------------------
function Save() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    //Id-MaxIdSql
    entry.Action = Action;
  
    
    entry.CancelOpReceiptMappingDetailsSave = [];
    $.each(tblSpecialisationList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.CancelOpReceiptMappingDetailsSave.push({
            OPBillId: row.opbillid,
            ReIssueBillNo: row.ReIssueBillNo,
            tagId: row.tagId

        });
    });

    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            //c.ButtonDisable('#btnCalculate', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            //c.ButtonDisable('#btnCalculate', false);
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

                Action = -1;
                HandleEnableButtons();
                HandleEnableEntries();
                BindSpecialisationList([]);
                ///ORSurgeryConnection();
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

function View(Id) {

    var Url = $('#url').data("fetchsurgerydetails");
    //var Url = baseURL + "ShowSelected";
    var param = {
        Id: Id

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
            c.SetValue('#Id', data.Id);
            c.SetValue('#txtSurgeryName', data.Name);
            c.SetValue('#txtCostPrice', data.CostPrice);
            c.SetValue('#txtCode', data.Code);
            c.SetValue('#txtInstruction', data.Instructions);
            c.SetSelect2('#Select2Type', data.SurgeryTypeId, data.SurgeryName);
            c.SetSelect2('#Select2Department', data.DepartmentID, data.DepartmentName);
            //c.SetDateTimePicker('#dtMonth', data.Date);
            //c.SetDateTimePicker('#dtProceduredoneon', moment(data.TestDoneDttm));


            ///*Table Show*/
            
            BindSpecialisationSelected(data.SurgeyDetailsView);
  
           // InitSelec2Sample();
            //BindFindingsTbl(data.FindingsResult);
            //BindTrainingDetails(data.TrainingDetailsTable);
            //BindFamilyDetails(data.FamilyDetailsTable);
            //BindRelationShipDetails(data.RelationShipDetailsTable);
            //BindPreviousExpDetails(data.PreviousExperienceDetailsTable);
            //BindQualificationDetails(data.QualificationDetailsTable);


           HandleEnableButtons();
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
