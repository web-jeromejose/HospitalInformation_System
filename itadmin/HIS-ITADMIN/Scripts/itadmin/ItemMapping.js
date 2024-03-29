var c = new Common();
var Action = -1;

var Select2IsClicked = false;


$(document).ready(function () {
    // SetupDataTables();
    //SetupSelectedPrice();
    InitButton();
    //InitDateTimePicker();
    InitSelect2();
    DefaultValues();
    HandleEnableEntries();
    c.DisableSelect2('#Select2Pharmacy', true);
    //c.ButtonDisable('#btnSave', true);
});

function InitSelect2() {
    // Sample usage

    Sel2Server($("#select2From"), $("#url").data("getstation"), function (d) {
        //alert(d.tariffid);
        var categoryid = (d.id);
        //View(WardStationId);
        //c.DisableSelect2('#Select2Pharmacy', false);
    });

    Sel2Server($("#Select2To"), $("#url").data("getstation"), function (d) {
        var stationid = (d.id)
        //alert(d.tariffid);
        //var WardStationId = (d.id);

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

        var ret = Validated();
        if (!ret) return ret;
        //var YesFunc = function () {
            Action = 2;
            c.ButtonDisable('#btnNew', true);
            c.DisableSelect2('#Select2Pharmacy', false);
            c.DisableSelect2('#select2WardStation', true);
        //Save();
            c.ButtonDisable('#btnSave', false);
            return ret;
        //};
        //c.MessageBoxConfirm("Modify Entry?", "Are you sure you want to Modify the Entry?", YesFunc, null);

    });

    $('#btnReportGen').click(function () {

        //  print_preview();

        $('#myModal').modal('show');
        PrintPreview();

    });

    $('#btnNew').click(function () {

        var ret = Validated();
        if (!ret) return ret;

        DefaultEmpty();
        //print_preview();
        Action = 1;
        c.ButtonDisable('#btnModify', true);
        c.DisableSelect2('#Select2Pharmacy', false);
        //c.DisableSelect2('#select2WardStation', false);

        c.SetSelect2('#Select2Pharmacy', '', '');
        //c.SetSelect2('#select2WardStation', '', '');
        //c.ModalShow('#modalEntry', true);
        c.ButtonDisable('#btnSave', false);
        return ret;
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
    // c.SetValue('#txtDays', '30');
//    c.SetSelect2('#select2PackageType', '7', 'Procedure');
    // c.iCheckSet('#iChkLast3Mos', true);

    //c.SetSelect2('#select2PatientTypeId', '1', 'In-patient');

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


function View(WardStationId) {

    var Url = $('#url').data("getview");
    //var Url = baseURL + "ShowSelected";
    var param = {
        WardStationId: WardStationId
      

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
            //var boperatorid = data[0].boperatorid == 0 ? 0 : data[0].boperatorid;
            //var Issuedby = data[0].Issuedby == null ? '' : data[0].Issuedby;
            var PharmacyStationID = data.PharmacyStationID == 0 ? '' : data.PharmacyStationID;
            var PharmacyStation = data.PharmacyStation == null ? '' : data.PharmacyStation;
            c.SetSelect2('#Select2Pharmacy', PharmacyStationID, PharmacyStation);
          
            HandleEnableButtons();
            //HandleEnableEntries();
            //c.ModalShow('#modalEntry', true);
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            $('#loadingpdf').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Validated() {

    var ret = false;

    ret = c.IsEmptySelect2('#select2WardStation');
    if (ret) {
        c.MessageBoxErr('Required...', 'Select Ward Station');
        return false;
    }



    ret = c.IsEmptySelect2('#Select2Pharmacy');
    if (ret) {
        c.MessageBoxErr('Required...', 'Select Pharmacy Station');
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
    entry.Action = 1;
    //entry.Deleted = 0;
    entry.fromstation = c.GetSelect2Id('#select2From');
    entry.tostation = c.GetSelect2Id('#Select2To');

    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $('#preloader').show();
            c.ButtonDisable('#btnSave', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            //c.ButtonDisable('#btnModify', false);
            $('#preloader').hide();
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


function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();
    
    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}