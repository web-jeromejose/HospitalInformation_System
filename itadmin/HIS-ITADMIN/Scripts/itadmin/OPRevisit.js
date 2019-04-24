var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridRevisitList'
var tblItemsListDataRow;

//var tblItemsWithPriceList;
//var tblItemsWithPriceListId = '#gridListWithPrice'
//var tblItemsWithPriceListDataRow;

$(document).ready(function () {
    // SetupDataTables();
    //SetupSelectedPrice();
    InitButton();
    //InitDateTimePicker();
    RevisitConnection();
    InitSelect2();
    InitDataTables();
    DefaultValues();
    HandleEnableEntries();
    RedrawGrid();

});

$(document).on("click", tblItemsListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');
        tblItemsListDataRow = tblItemsList.row($(this).parents('tr')).data();
        //var Service = c.GetSelect2Id('#select2PackageType');
        var Id = tblItemsListDataRow.Id;
        c.ButtonDisable('#btnDelete', false);
       c.ModalShow('#modalEntry', true);
       c.DisableSelect2('#Select2Company', true);
       c.DisableSelect2('#Select2Category', true);
        //View(Service, PackageId);

        Action = 2;
        View(Id);
    }



});

function InitDataTables() {
    //BindSequence([]);
    BindRevisit([]);
    //BindWithPriceListofItem([]);
}

function InitSelect2() {
    // Sample usage

    Sel2Server($("#Select2Company"), $("#url").data("getcompanylist"), function (d) {
        //alert(d.tariffid);
        var CompanyId = (d.id);
        //var tarrifId = (d.tariffid);

    });

    


    Sel2Server($("#Select2Category"), $("#url").data("getcategorylist"), function (d) {
        //alert(d.tariffid);
        var CategoryId = (d.id);
    

    });

    $("#Select2BillType").select2({
        data: [{ id: 1, text: 'Flat Amount' },
               { id: 2, text: 'Percentage' }],
        minimumResultsForSearch: -1
    }).change(function (e) {
        //var list = e.added.list;
        //var Service = c.GetSelect2Id('#select2PackageType');
        //ShowListPackage(Service);
    });


   

}

function InitButton() {
    var NoFunc = function () {
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

    $('#btnProcess').click(function () {
        Process();
    });

    $('#btnSave').click(function () {
        var YesFunc = function () {
            //Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);

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

    $('#btnNew').click(function () {
        DefaultEmpty();
        //  print_preview();
       
        c.ButtonDisable('#btnDelete', true);
        c.DisableSelect2('#Select2Company', false);
        c.DisableSelect2('#Select2Category', false);
        DefaultValues();
        Action = 1;
        c.ModalShow('#modalEntry', true);
        

    });

    $('#btnDelete').click(function () {

        //  print_preview();
        Action = 3;
        Save();


    });




    //$('#btnAddScientificAchievement').click(function () {
    //    var ctr = $(tblScientificAchievementListId).DataTable().rows().nodes().length + 1;
    //    tblScientificAchievement.row.add({
    //        "SNo": ctr,
    //        "ScientificAchievement": "",
    //        "TransAchievementYear": "",
    //        "Awards": "",
    //        "Remarks": "",
    //        "EmpId": Action == 1 ? "" : GetID,
    //        "AchievementYear": ""
    //    }).draw();
    //    InitSelectedScientificAchievement();
    //});
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

function HandleButtonNotUse() {
    $('.NotUse').hide();
}

function HandleEnableEntries() {
    // VAED
    if (Action == 0 || Action == 3) { // view or delete
        //c.Disable('#txtProfileName', true);

    }
    else if (Action == 1) { // add
        //c.Disable('#txtProfileName', false);

    }
    else if (Action == 2) { // edit    
        //c.Disable('#txtProfileName', true);

    }
    else {
        c.Show('#Entry', false);
        c.Show('#DashBoard', true);
    }

}


function InitDateTimePicker() {
    // Sample usage
    $('#dtMonth').datetimepicker({
        picktime: false,
        format: 'mm-yyyy'
    }).on('dp.change', function (e) {
        //c.SetDateTimePicker('#dtMonth');
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        c.SetDateTimePicker('#dtfrom', new Date(year, month, 1));
    });
    //$('#dtTo').datetimepicker({
    //    picktime: false
    //}).on('dp.change', function (e) {

    //});

    //$('#dtProceduredoneon').datetimepicker({
    //    picktime: true
    //}).on('dp.change', function (e) {
    //    //var a = $('#dtfrom').data("DateTimePicker").getDate();
    //    //var b = moment(a).format(dateFormatOnDisplay);
    //    //c.SetDateTimePicker('#dtfrom', b);
    //});
}

function DefaultValues() {
    // Sample usage
    c.SetValue('#txtNoDays', '');
    c.SetSelect2('#Select2Company', '', '');
    c.SetSelect2('#Select2Category', '', '');
    // c.iCheckSet('#iChkLast3Mos', true);

    //c.SetSelect2('#select2PatientTypeId', '1', 'In-patient');

}



function DefaultDisable() {
    //c.Disable('#txtOutsideBagNo', true);
    //c.DisableDateTimePicker('#dtFromDate', true);
    //c.DisableSelect2('#select2TypeOfBlood', true);
    //c.iCheckDisable('#iChkCompleted', true);
    c.DisableSelect2('#Select2Company', true);

}

function DefaultEmpty() {

    c.SetValue('#Id', '');
    c.SetValue('#txtCode', '');
    c.SetValue('#txtName');
    c.SetValue('#txtCostPrice');
    c.Select2Clear('#Select2BillType');

}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}


function View(Id) {

    var Url = $('#url').data("getviewrevisit");
    //var Url = baseURL + "ShowSelected";
    var param = {
       Id: Id
      

    };
    $('#loadingpdf').show();
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
            c.SetValue('#txtNoDays', data.NoOfDays);
            c.SetSelect2('#Select2Company', data.CompanyId, data.CompanyName);
            c.SetSelect2('#Select2Category', data.CategoryId, data.CategoryName);

            HandleEnableButtons();
            //HandleEnableEntries();
            c.ModalShow('#modalEntry', true);
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            $('#loadingpdf').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

//-------------------List-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();
   
    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}

function BindRevisit(data) {

    tblItemsList = $(tblItemsListId).DataTable({
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
        columns: ShowRevisitColumns(),
        fnRowCallback: ShowRevisitCallBack()
    });

    //InitSelectedPharmacyMarkUp();
}

function ShowRevisitCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['selected'];
        //var $nRow = $(nRow);

        //if (aData.selected.length != 1) {
        //    $('#chkselected', nRow).prop('checked', aData.selected === 1);
        //}
        //var value = aData['Price'];
        //var $nRow = $(nRow);

        ////WardDemand
        //if (value == '') {
        //    $nRow.css({ "background-color": "#d7ffea" })
        //}
        //ISSUED
        //else if (value == 1) {
        //    $nRow.css({ "background-color": "#d7ffea" })
        //}
        //    //Partial Issues
        //else if (value == 3) {
        //    $nRow.css({ "background-color": "#f5b044" })
        //}

    };
    return rc;

}

function ShowRevisitColumns() {
    var cols = [

      { targets: [0], data: "SNo", className: '', visible: true, searchable: true, width: "1%" },
      { targets: [1], data: "CompanyName", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [2], data: "CategoryName", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [3], data: "NoOfDays", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [4], data: "Id", className: '', visible: false, searchable: false }
    ];
    return cols;
}

function RevisitConnection() {

    var Url = $('#url').data("getrevisit");

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

            BindRevisit(data.list);
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

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Validated() {

    var ret = false;

    ret = c.IsEmpty('#txtNoDays');

    if (ret) {
        c.MessageBoxErr('Required...', 'Please input NO of Days');
        return false;
    }

    ret = c.IsEmptySelect2('#Select2Company');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Company');
        return false;
    }

    ret = c.IsEmptySelect2('#Select2Category');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a From Category');
        return false;
    }






    return true;

}


function Save() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = Action;
    entry.CategoryId = c.GetSelect2Id('#Select2Category');
    entry.CompanyId = c.GetSelect2Id('#Select2Company');
    entry.NoOfDays = $('#txtNoDays').val();
    entry.Id = $('#Id').val();

    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            c.ButtonDisable('#btnSave', true);
            c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            c.ButtonDisable('#btnModify', false);
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
                HandleEnableEntries();
                RevisitConnection();
                RedrawGrid();
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


function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();
    
    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}