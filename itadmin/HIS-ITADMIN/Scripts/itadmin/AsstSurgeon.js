var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridItemList'
var tblItemsListDataRow;

$(document).ready(function () {
    // SetupDataTables();
    //SetupSelectedPrice();
    InitButton();
    //InitDateTimePicker();
    //var Service = 7;
    AsstSurgeryDashBoardConnection();
    InitSelect2();
    //InitDataTables();
    DefaultValues();
  
});

function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();
    

}

$(document).on("click", tblItemsListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');
        tblItemsListDataRow  = tblItemsList.row($(this).parents('tr')).data();
        //var Service = c.GetSelect2Id('#select2PackageType');
        CategoryId = tblItemsListDataRow.categoryId;
        ORNoId = tblItemsListDataRow.OtId;
        SlNo = tblItemsListDataRow.SlNo;
        View(CategoryId, ORNoId, SlNo);
       //  OREmployeeDashBoardConnection();
        //c.DisableSelect2('#select2DoctorCode', true);
         Action = 2;
         HandleEnableButtons();
     
    }



});

function InitDataTables() {
    //BindSequence([]);
    BindListofItem([]);
    //BindWithPriceListofItem([]);
}

function InitSelect2() {
    // Sample usage

    Sel2Server($("#Select2tariff"), $("#url").data("selecttariff"), function (d) {
        //alert(d.tariffid);
        //var DepartmentID = c.GetSelect2Id('#Select2Department');
        //var tarrifId = (d.tariffid);
        var Id = (d.id);
        //SpecialisationSelectedConnection(Id);
    });


    Sel2Server($("#select2OrNo"), $("#url").data("selectorno"), function (d) {
        //alert(d.tariffid);
        //var DepartmentID = c.GetSelect2Id('#Select2Department');
        //var tarrifId = (d.tariffid);
        var Id = (d.id);
        //SpecialisationSelectedConnection(Id);
    });
    $("#select2Type").select2({
        data: [{ id: 1, text: 'Primary' },
               { id: 0, text: 'Secondary' }],
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
        Action = 1;
        HandleEnableButtons();
        DefaultEmpty();
        //  print_preview();
        //c.DisableSelect2('#select2DoctorCode', false);
       
      
        c.ModalShow('#modalEntry', true);

    });

    $('#btnCancel').click(function () {
        Action = -1;
        HandleEnableButtons();
        //DefaultEmpty();
        ////  print_preview();
        ////c.DisableSelect2('#select2DoctorCode', false);


        //c.ModalShow('#modalEntry', true);

    });

    $('#btnDelete').click(function () {
        var YesFunc = function () {
            Action = 3;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
    });


    $('#btnRefresh').click(function () {
            AsstSurgeryDashBoardConnection();
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
    // c.SetValue('#txtDays', '30');
    //c.SetSelect2('#select2PackageType', '7', 'Procedure');
    // c.iCheckSet('#iChkLast3Mos', true);

    //c.SetSelect2('#select2PatientTypeId', '1', 'In-patient');

}


function DefaultEmpty() {


    c.SetValue('#txtPercentage', '');
    c.Select2Clear('#Select2tariff');
    c.Select2Clear('#select2OrNo');
    c.Select2Clear('#select2Type');
    c.Select2Clear('#txtPercentage');
}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}


function View(CategoryId,ORNoId,SlNo) {

    var Url = $('#url').data("viewasstsurgeon");
    var param = {
        CategoryId: CategoryId,
        ORNoId: ORNoId,
        SlNo: SlNo
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
            //$('.Show').show();

            //if (FetchFindingsResults.length == 0) {
            //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
            //    tblRequisitionList.row('tr.selected').remove().draw(false);
            //    return;
            //}

            var data = result.list[0];
            c.SetSelect2('#Select2tariff', data.categoryId, data.category);
            c.SetSelect2('#select2OrNo', data.OtId, data.OtNo);
            c.SetSelect2('#select2Type', data.SlNo, data.SLNoValue);
            c.SetValue('#txtPercentage', data.Percentage); 
            HandleEnableEntries();
           // AsstSurgeryDashBoardConnection();
            c.ModalShow('#modalEntry', true);
    
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
         
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

//-------------------List-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindListofItem(data) {

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
        columns: ShowListColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowListColumns() {
    var cols = [
      { targets: [0], data: "category", className: '', visible: true, searchable: true, width: "10%" },
      { targets: [1], data: "OtNo", className: '', visible: true, searchable: true, width: "20%" },
      { targets: [2], data: "Percentage", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [3], data: "SLNoValue", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [4], data: "categoryId", className: '', visible: false, searchable: false, },
      { targets: [5], data: "OtId", className: '', visible: false, searchable: false, },
      { targets: [6], data: "SlNo", className: '', visible: false, searchable: false, }

    ];
    return cols;
}

function AsstSurgeryDashBoardConnection() {

    var Url = $('#url').data("getsurdashboard");
    $('#preloader').show();
    //$('#loadingpdf').show();
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

            BindListofItem(data.list);
            $('#preloader').hide();
            //RedrawGrid();
        },
        error: function (xhr, desc, err) {
            //$('#loadingpdf').hide();
            $('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Validated() {

    var ret = false;

    ret = c.IsEmptyById('#Select2tariff');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Tariff');
        return false;
    }
    ret = c.IsEmptyById('#select2OrNo');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select an ORNo');
        return false;
    }

    ret = c.IsEmptyById('#select2Type');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select an Typr');
        return false;
    }


    ret = c.IsEmptyById('#select2Type');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select an Typr');
        return false;
    }


    ret = c.IsEmpty('#txtPercentage');

    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Percentage');
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
    //entry.Deleted = 0;
    entry.CategoryId = c.GetSelect2Id('#Select2tariff');
    entry.Percentage = c.GetValue('#txtPercentage');
    entry.OTIDNo = c.GetSelect2Id('#select2OrNo');
    entry.SlnoId = c.GetSelect2Id('#select2Type');
   

    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
  
            c.ButtonDisable('#btnSave', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            c.ButtonDisable('#btnSave', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {
                Action = 0;
                AsstSurgeryDashBoardConnection();
                HandleEnableButtons();
 
                //HandleEnableEntries();
              //  AsstSurgeryDashBoardConnection();
              
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