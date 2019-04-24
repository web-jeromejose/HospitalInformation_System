var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListforvacant;
var tblItemsListIdforvacant = '#gridBEdReleaseforvacant'
var tblItemsListId = '#gridBEdRelease'
var tblItemsListDataRow;

var Id;
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // For future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();
    //if (tabNameSelected == $('.nav-tabs .active').text());
    //{
    //       RedrawGrid();
    //}

    RedrawGrid();

})

$(document).ready(function () {

    InitButton();
    //InitDateTimePicker();
    InitSelect2();
    TransacListDashBoardConnection();
    TransacListDashBoardConnectionForVacant();
    InitDataTables();
    RedrawGrid();

});



function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();
    //if (tblOPItemsList !== undefined) tblOPItemsList.columns.adjust().draw();

    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}


function InitDataTables() {
    //BindSequence([]);
    BindTransacInListofItem([]);
}

function InitSelect2() {
    // Sample usage

    Sel2Server($("#Select2DeptStation"), $("#url").data("getstation"), function (d) {
        //alert(d.tariffid);
        Id = (d.id);
        View(Id);

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
    $('#btnSaveforvacant').click(function () {
        var YesFunc = function () {
            Action = 1;
            Saveforvacant();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to VACANT STATUS the Entry?", YesFunc, null);

    });

    $('#btnOPSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            SaveOP();
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

    $('#btnClear').click(function () {

        //TransacListDashBoardConnection();
        //c.SetSelect2('#Select2DeptStation', '0', 'Search');
        ///$("#chkselected").removeProp("disabled");

    });


    $('#btnRefesh').click(function () {
        TransacListDashBoardConnectionForVacant();
        TransacListDashBoardConnection();
    });
    $('#btnRefeshforvacant').click(function () {
        TransacListDashBoardConnectionForVacant();
        TransacListDashBoardConnection();
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

//-----------------OP Services--List-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
$(document).on("click", "#iChkAllTestOP", function () {
    if ($('#iChkAllTestOP').is(':checked')) {
        $.each(tblOPItemsList.rows().data(), function (i, row) {
            tblOPItemsList.cell(i, 0).data('<input id="chkselectedOP" type="checkbox" checked="checked" >');
        });
    }
    else {
        $.each(tblOPItemsList.rows().data(), function (i, row) {
            tblOPItemsList.cell(i, 0).data('<input id="chkselectedOP" type="checkbox">');
        });
    }
});


function BindTransacInListofItem(data) {

    tblItemsList = $(tblItemsListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowTransaListListColumns(),
        fnRowCallback: ShowTransInviCallBack()
    });

    //InitSelected();
}

function BindTransacInListofItemforvacant(data) {

    tblItemsListforvacant = $(tblItemsListIdforvacant).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowTransaListListColumnsforvacant(),
        fnRowCallback: ShowTransInviCallBack()
    });

    //InitSelected();
}


function ShowTransInviCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['selected'];
        var $nRow = $(nRow);

        if (value == 0) {
            $('#chkselected', nRow).prop('checked', aData.selected === 1);
            if (aData.selected == 1) {
                $nRow.css({ "background-color": "#f5b044" })
            }
        }
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


function ShowTransaListListColumns() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected" checked = "checked"/>' },
      { targets: [1], data: "Room", className: '', visible: true, searchable: true, width: "3%" },
      { targets: [2], data: "IntimationDate", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [3], data: "DischargeDateTime", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [4], data: "HouseKeepingDateTime", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [5], data: "FinalApproval", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [6], data: "ID", className: '', visible: false, searchable: false },
      { targets: [7], data: "FinalDateTime", className: '', visible: false, searchable: false }

    ];
    return cols;
}

function ShowTransaListListColumnsforvacant() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected" checked = "checked"/>' },
      { targets: [1], data: "Room", className: '', visible: true, searchable: true, width: "3%" },
      //{ targets: [2], data: "IntimationDate", className: '', visible: true, searchable: true, width: "5%" },
      //{ targets: [3], data: "DischargeDateTime", className: '', visible: true, searchable: true, width: "5%" },
      //{ targets: [4], data: "HouseKeepingDateTime", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [5], data: "FinalApproval", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [6], data: "ID", className: '', visible: false, searchable: false },
      { targets: [7], data: "FinalDateTime", className: '', visible: false, searchable: false }

    ];
    return cols;
}
function TransacListDashBoardConnection() {

    var Url = $('#url').data("getransacdash");
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

            BindTransacInListofItem(data.list);

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

function TransacListDashBoardConnectionForVacant() {

    var Url = $('#url').data("getransacdashforvacant");
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

            BindTransacInListofItemforvacant(data.list);

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


    ret = c.IsEmptySelect2('#Select2DeptStation');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a From Department Name');
        return false;
    }



    return true;

}

function Saveforvacant() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = 1;
    //entry.StationId = c.GetSelect2Id('#Select2DeptStation');


    entry.ReleaseBedDetaisSave = [];
    var rowcollection = tblItemsListforvacant.$("#chkselected:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsListforvacant.row(tr);
        var rowdata = row.data();

        entry.ReleaseBedDetaisSave.push({
            BedId: rowdata.ID

        });
    });
    $.ajax({
        url: $('#url').data("saveforvacant"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            c.ButtonDisable('#btnSaveforvacant', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            //c.ButtonDisable('#btnModify', false);
            c.ButtonDisable('#btnSaveforvacant', false);

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
                TransacListDashBoardConnection();
                TransacListDashBoardConnectionForVacant();

            };

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#btnSaveforvacant', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

    return ret;
}


function Save() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = 1;
    //entry.StationId = c.GetSelect2Id('#Select2DeptStation');


    entry.ReleaseBedDetaisSave = [];
    var rowcollection = tblItemsList.$("#chkselected:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsList.row(tr);
        var rowdata = row.data();

        entry.ReleaseBedDetaisSave.push({
            BedId: rowdata.ID
         
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
                //HandleEnableButtons();
                //HandleEnableEntries();
                TransacListDashBoardConnection();
                TransacListDashBoardConnectionForVacant();
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


function View(Id) {

    var Url = $('#url').data("getview");
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
        success: function (data) {

            BindTransacInListofItem(data.list);
            $('#preloader').hide();
            //$("#chkselected").removeProp("disabled");
            //$("#chkselected").prop("disabled", false);
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