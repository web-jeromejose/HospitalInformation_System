var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridCancelOPtbl'
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
    //TransacListDashBoardConnection();
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
        //var ret = false;
        //ret = c.IsEmptySelect2('#Select2DeptStation');

        //if (ret) {
        //    c.MessageBoxErr('Empty...', 'Please select a Department Name');
        //    return false;
        //} else {

        //    View(Id);
        //}
        //c.SetSelect2('#Select2DeptStation', '0', 'Search');
        //$("#chkselected").removeProp("disabled");
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

    $(document).keypress(function (e) {
        if (e.which == 13) {
            var RegNo = c.GetValue('#txtPin');
            TransacListDashBoardConnection(RegNo);

        }
    });
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
        searching: false,
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
      { targets: [1], data: "id", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [2], data: "visitdate", className: '', visible: true, searchable: true, width: "30%" },
      { targets: [3], data: "reason", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [4], data: "status", className: '', visible: true, searchable: true, width: "5%" }
    ];
    return cols;
}

function TransacListDashBoardConnection(RegNo) {

    var Url = $('#url').data("getfetvcnlopdiscount");
    $('#preloader').show();
    //$('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");
    var param = {
        RegNo: RegNo
    };
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

function Save() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = 1;
    //entry.StationId = c.GetSelect2Id('#Select2DeptStation');


    entry.ReleaseEmpVacationDetails = [];
    var rowcollection = tblItemsList.$("#chkselected:checked", { "page": "all" });
 
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsList.row(tr);
        var rowdata = row.data();
      //  console.log(rowdata);

        entry.ReleaseEmpVacationDetails.push({
            LeaveID: rowdata.id
        });
    });

    console.log(entry);
    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            c.ButtonDisable('#btnSave', true);
          },
        success: function (data) {

            console.log(data);
             c.ButtonDisable('#btnSave', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                if (Action == 3) {
                }

                Action = 0;
              
              //  TransacListDashBoardConnection();

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