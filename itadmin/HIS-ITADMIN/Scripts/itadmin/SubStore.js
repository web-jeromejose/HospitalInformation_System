var c = new Common();
var Action = -1;

var Select2IsClicked = false;


var tblItemsList;
var tblItemsListId = '#gridHoldingList'
var tblItemsListDataRow;


var OrderId;
var ProcedureId;
var RequestedId;


$(document).ready(function () {

    // SetupDataTables();
    //InitICheck();
    //SetupSelectedPrice();
    InitButton();
    //HoldingDashBoardConnection();
    //InitDateTimePicker();
    //ShowListPackage(Service);
    InitSelect2();
    InitDataTables();
    DefaultValues();
    DefaultDisable();
  
});


//});
function InitDataTables() {
    BindListofHolding([]);
    //BindWithPriceListofItem([]);
}

function InitSelect2() {
    // Sample usage

    Sel2Server($("#Select2HoldingStore"), $("#url").data("gethalodinglist"), function (d) {
        //alert(d.tariffid);
        var Id = (d.id);
        //var tarrifId = (d.tariffid);
        HoldingDashBoardConnection(Id);
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
            Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);

    });

    $('#btnPreview').click(function () {
        var Pin = $('#txtPin').val();
        ShowListTest(Pin);
        ShowListProcedure(Pin);
    });

    $('#btnReportGen').click(function () {

        //  print_preview();

        $('#myModal').modal('show');
        PrintPreview();

    });

    $('#btnNew').click(function () {
        DefaultEmpty();
        //  print_preview();
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
    c.SetSelect2('#select2PackageType', '7', 'Procedure');
    // c.iCheckSet('#iChkLast3Mos', true);

    //c.SetSelect2('#select2PatientTypeId', '1', 'In-patient');

}


function DefaultDisable() {
    // Sample usage
    // c.DisableDateTimePicker('#dtFromDate', true);
    //c.DisableSelect2('#Select2RefDoctor', true);
    //c.DisableSelect2('#Select2ProcedureDoneBy', true);
    c.Disable('#txtName', true);




}

function DefaultEmpty() {

    c.SetValue('#txtNoofDays', '');
    c.SetValue('#txtNoofVisit', '');
    c.Select2Clear('#select2Service');
   

}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}





//function InitICheck()
// {
//    $('#iChkAllProced').iCheck({
//        checkboxClass: 'icheckbox_square-red',
//        radioClass: 'iradio_square-red'
//    }).on("ifChecked ifUnchecked", function (e) {
//        var checked = e.type == "ifChecked" ? 1 : 0;

//    });
    
// }
//-------------------List of Test-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindListofHolding(data) {

    tblItemsList = $(tblItemsListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowListHoldingColumns(),
        fnRowCallback: ShowListItemRowCallBack()
    });
}

function ShowListItemRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['selected'];
        var $nRow = $(nRow);
       
    //    if ($.trim(value).length > 0) {
    //        $nRow.css({ "background-color": "#b7d7ff" })
    //    }
    //};
        if (aData.selected.length != 0) {
            $('#chkselected', nRow).prop('checked', aData.selected === 1);
        }

        //bindCheckBox();
    };
    return rc;

}

$(document).on("click", "#iChkAllTest", function () {
    if ($('#iChkAllTest').is(':checked')) {
        $.each(tblItemsList.rows().data(), function (i, row) {
            tblItemsList.cell(i, 0).data('<input id="chkselected" type="checkbox" checked="checked" >');
        });
    }
    else {
        $.each(tblItemsList.rows().data(), function (i, row) {
            tblItemsList.cell(i, 0).data('<input id="chkselected" type="checkbox">');
        });
    }
});

function ShowListHoldingColumns() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected"/>' },
      { targets: [1], data: "Name", className: '', visible: true, searchable: true, width: "10%" },
      { targets: [2], data: "Id", className: '', visible: false, searchable: false }

    ];
    return cols;
}

function HoldingDashBoardConnection(Id) {

    var Url = $('#url').data("getfetchsubstore");

    var param = {
            Id: Id
    };
    $('#preloader').show();
    //$('#loadingpdf').show();
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

            BindListofHolding(data.list);
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
function Validated() {

    var ret = false;

    //ret = c.IsEmpty('#txtHomeAdress');

    //if (ret) {
    //    c.MessageBoxErr('Y/N...', 'Please input Y for YES and N for NO');
    //    return false;
    //}







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
    //entry.TestId = c.GetSelect2Id('#select2Service');
    //entry.NoOfDays = $('#txtNoofDays').val();
    //entry.NoOfVisits = $('#txtNoofVisit').val();
    //entry.ServiceId = c.GetSelect2Id('#select2PackageType');

    entry.HoldingStoreDetailsModel = [];
    var rowcollection = tblItemsList.$("#chkselected:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsList.row(tr);
        var rowdata = row.data();

        entry.HoldingStoreDetailsModel.push({
            //stores: rowdata.selected,
            Id: rowdata.ID
          
        });
    });


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
                    HandleEnableButtons();
                    HandleEnableEntries();
                    //HoldingDashBoardConnection();
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