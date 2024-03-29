var c = new Common();
var Action = -1;
var Select2IsClicked = false;

//-------------------------------------------------------
var tblGeneralListDashboardList;
var tblGeneralListDashboardId = '#gridGeneralList'
var tblGeneralListDashboardDataRow;

//-------------------------------------------------------
var tblSelectedList;
var tblSelectedListId = '#gridSelectedlist'
var tblSelectedListDataRow;


$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // For future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();
    //if (tabNameSelected == $('.nav-tabs .active').text());
    //{
    //       RedrawGrid();
    //}

    RedrawGrid();

})

$(document).on("click", tblGeneralListDashboardId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblGeneralListDashboardDataRow = tblGeneralListDashboardList.row($(this).parents('tr')).data();
    }

    add_GeneralItem(this);
    remove_GeneralItem(this);
    RedrawGrid();

});

$(document).on("click", tblSelectedListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblSelectedListDataRow = tblSelectedList.row($(this).parents('tr')).data();
    }

    add_SelectedItem(this);
    remove_SelectedItem(this);
    RedrawGrid();

});



$(document).ready(function () {
    //BindInvestigationWithPriceList([]);
    //BindConsulDeptWithPriceList([]);
    //BindOtherProcedureWithPriceList([]);
    //HealtCheckUpConnection();
    GeneralListConnection();
    InitSelect2();
    DefaultValues(); 
    //InitDateTimePicker();
    //SetupSelec2Sample();
    
    
    //ConsulDeptListpConnection();
    //InvestigationListpConnection();
    //OtherProcedureConnection();
  
    
    
    InitButton();
    InitDataTables();
    //SetupSelec2Sample();

    RedrawGrid();
    //DefaultDisable();
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
    BindGeneralListDashboardList([]);
    BindSelectedListList([]);
    //BindInvestigationWithPriceList([]);
    //BindConsulDeptWithPriceList([]);

}

function HandleEnableEntries() {




}
function InitDateTimePicker() {
    // Sample usage
    //$('#dtMonth').datetimepicker({
    //    picktime: false
    //}).on('dp.change', function (e) {
    //    //var a = $('#dtfrom').data("DateTimePicker").getDate();
    //    //var b = moment(a).format(dateFormatOnDisplay);
    //    //c.SetDateTimePicker('#dtfrom', b);
    //});



}

function InitSelect2() {
    // Sample usage
    //Sel2Server($("#Select2Doctor"), $("#url").data("getdoctorlist"), function (d) {
    //    //alert(d.tariffid);
    //    var Id = (d.id);
    //    SelectedListConnection(Id);
    //});

    $('#Select2Doctor').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getdoctorlist"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: c.GetSelect2
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added;
        var Id = c.GetSelect2Id('#Select2Doctor');
        SelectedListConnection(Id);
    });


    $("#Select2Confine").select2({
        data: [{ id: 1, text: 'Yes' },
               { id: 0, text: 'No' }],
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
        //c.ModalShow('#modalEntry', true);
    });

    $('#btnCancel').click(function () {
     
        DefaultEmpty();
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

function DefaultEmpty()
{

    c.Select2Clear('#Select2Doctor');
    GeneralListConnection();
    BindSelectedListList([]);


}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}

function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblGeneralListDashboardList !== undefined) tblGeneralListDashboardList.columns.adjust().draw();
   if (tblSelectedList !== undefined) tblSelectedList.columns.adjust().draw();
    //if (tblConsulDeprtList !== undefined) tblConsulDeprtList.columns.adjust().draw();
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
    c.DisableDateTimePicker('#dtMonth', true);
    //c.DisableSelect2('#Select2RefDoctor', true);
    //c.DisableSelect2('#Select2ProcedureDoneBy', true);




}

function DefaultValues() {
    // Sample usage
    // c.SetValue('#txtDays', '30');
    c.SetSelect2('#Select2Confine', '0', 'No');
    // c.iCheckSet('#iChkLast3Mos', true);

    //c.SetSelect2('#select2PatientTypeId', '1', 'In-patient');

}
//-------------------Dashboard------------------------------------------------------------------------------------------------------------
// Sample usage
// BindDashboard([]);
/*[RenderTable]*/
function BindGeneralListDashboardList(data) {
    tblGeneralListDashboardList = $(tblGeneralListDashboardId).DataTable({
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
        columns: ShowGeneralListDashboard()
        //fnRowCallback: ShowHealtCheckDashboardCallBack(),
        
    });


}

function ShowGeneralListDashboardCallBack() {
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

function ShowGeneralListDashboard() {
    var cols = [
    { targets: [0], data: "Id", className: '', visible: false, searchable: false},
    { targets: [1], data: "Name", className: '', visible: true, searchable: true, width: "10%" }
   
    ];
    return cols;
}

function GeneralListConnection() {

    var Url = $('#url').data("getgenerallist");

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

            BindGeneralListDashboardList(data.list);
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


//-------------------Selected Item  ------------------------------------------------------------------------------------------------------------
function BindSelectedListList(data) {
    tblSelectedList = $(tblSelectedListId).DataTable({
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
        columns: ShowSelectedlist()
        //fnRowCallback: ShowHealtCheckDashboardCallBack(),

    });


}

function ShowSelectedlistCallBack() {
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

function ShowSelectedlist() {
    var cols = [
    { targets: [0], data: "Id", className: '', visible: false, searchable: false },
    { targets: [1], data: "Name", className: '', visible: true, searchable: true, width: "10%" }

    ];
    return cols;
}

function SelectedListConnection(Id) {

    var Url = $('#url').data("getselectedlist");

    var param = {
        Id: Id
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

            BindSelectedListList(data.list);
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

function add_GeneralItem(cell) {
    rowIndex = tblGeneralListDashboardList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    $.each(tblGeneralListDashboardList.rows().data(), function (i, re) {
        if (tblGeneralListDashboardList.cell(i, 0).data() == tblSelectedList.cell(rowIndex, 0).data()) {
            $ex = 1;
        }
    });
    if ($ex == 0) {
        tblSelectedList.row.add({
            Id: tblGeneralListDashboardList.cell(rowIndex, 0).data(),
            Name: tblGeneralListDashboardList.cell(rowIndex, 1).data(),
        }).draw();
        //c.ReSequenceDataTable(tblSelectedList, 0);
        //InitSelectedPrice();
    }
}

function remove_GeneralItem(cell) {
    rowV = $(cell).parents('tr');
    tblGeneralListDashboardList.row(rowV).remove().draw();
    //c.ReSequenceDataTable(tblGeneralListDashboardList, 0);
}

function add_SelectedItem(cell) {
    rowIndex = tblSelectedList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    $.each(tblSelectedList.rows().data(), function (i, re) {
        if (tblSelectedList.cell(i, 0).data() == tblGeneralListDashboardList.cell(rowIndex, 0).data()) {
            $ex = 1;
        }
    });
    if ($ex == 0) {
        tblGeneralListDashboardList.row.add({
            Id: tblSelectedList.cell(rowIndex, 0).data(),
            Name: tblSelectedList.cell(rowIndex, 1).data(),
        }).draw();
        //c.ReSequenceDataTable(tblSelectedList, 0);
        //InitSelectedPrice();
    }
}

function remove_SelectedItem(cell) {
    rowV = $(cell).parents('tr');
    tblSelectedList.row(rowV).remove().draw();
    //c.ReSequenceDataTable(tblGeneralListDashboardList, 0);
}



//-------------------------------------------------------------------------------------------------------------------------------

function Validated() {

    var ret = false;

   

    ret = c.IsEmptyById('#Select2Doctor');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Doctor');
        return false;
    }



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
    entry.DoctorId = c.GetSelect2Id('#Select2Doctor');
    entry.DoctorName = c.GetSelect2Text('#Select2Doctor');
    entry.Confine = c.GetSelect2Id('#Select2Confine');


    entry.DoctorRecepDetailsSave = [];
    $.each(tblSelectedList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.DoctorRecepDetailsSave.push({
            ReceptionistId: row.Id,
            ReceptionistName: row.Name

          
            //ParameterId: row.PenaltyName.split(" ")[0],
            ////type: c.MomentYYYYMMDD(row.PenaltyDate),
            //Refund: row.Refund === 'Yes' ? 1 :     0,
            //testAppId: false,
            //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
        });
    });



    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $('#loadingpdf').show();
            $('#preloader').show();
            c.ButtonDisable('#btnCalculate', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            $('#loadingpdf').hide();
            $('#preloader').hide();
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

