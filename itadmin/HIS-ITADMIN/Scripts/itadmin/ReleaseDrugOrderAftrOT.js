var c = new Common();
var Action = -1;

var Select2IsClicked = false;
var AccessId;

$(document).ready(function () {

    InitButton();
    InitSelect2();
    DefaultValues();

});


function DefaultEmpty() {
    c.SetValue('#txtName', ' ');
    c.SetValue('#txtCode', ' ');
    //c.SetValue('#txtCostPrice', ' ');
    //c.SetSelect2('#select2PackageType', '7', 'Procedure');
    // c.iCheckSet('#iChkLast3Mos', true);

    c.SetSelect2('#select2Reissues', 0, ' ');

}

function DefaultValues() {


}

function InitSelect2() {
    // Sample usage


    Sel2Server($("#Select2Employee"), $("#url").data("getempaccess"), function (d) {
     //    alert(d.Id);
         AccessId = (d.id);
        //var tarrifId = (d.tariffid);

    });

    $('#Select2PIN').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getpindrugorder"),
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
        //c.DisableSelect2('#select2DoctorCode', false);
        c.DisableSelect2('#Select2Stations', false);
        c.DisableSelect2('#Select2BillType', false);

        c.Disable('#txtPrefix', false);
        Action = 1;
        c.ModalShow('#modalEntry', true);


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

function DefaultDisable() {
    // Sample usage
    //c.SetValue('#', '30');
    //c.DisableDateTimePicker('#dtMonth', true);
    c.DisableSelect2('#Select2Stations', true);
    c.DisableSelect2('#Select2BillType', true);

    c.Disable('#txtPrefix', true);


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

function DefaultEmpty() {
    // Sample usage
    c.SetValue('#txtReason', ' ');
    // c.SetValue('#txtNoOfdDays', ' ');
    c.SetSelect2('#select2Reissues', '0', ' ');
    // c.iCheckSet('#iChkLast3Mos', true);
    //c.SetSelect2('#Select2Stations', ' ', ' ');
    //c.SetSelect2('#Select2BillType', ' ', ' ');

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Validated() {

    var ret = false;

    ret = c.IsEmptyById('#Select2PIN');

    if (ret) {
        c.MessageBoxErr('Empty!', 'Please select a Pin');
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
    //entry.AccessId;
    entry.OrderId = c.GetSelect2Id('#Select2PIN');
    //entry.BillTypeId = c.GetSelect2Text('#Select2BillType');

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
            //c.ButtonDisable('#btnModify', false);
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
                //HandleEnableButtons();
                //HandleEnableEntries();
                //CancelBillprefixDashBoardConnection();
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