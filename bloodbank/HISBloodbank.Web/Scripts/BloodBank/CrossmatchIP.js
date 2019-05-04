var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridCrossMatchType;
var TblGridCrossMatchTypeId = "#gridCrossMatchType";
var TblGridCrossMatchTypeDataRow;

var TblGridCompatability;
var TblGridCompatabilityId = "#gridCompatability";
var TblGridCompatabilityDataRow;

var TblGridWardsOrder;
var TblGridWardsOrderId = "#gridWardsOrder";
var TblGridWardsOrderDataRow;

var TblGridQuantityAvailable;
var TblGridQuantityAvailableId = "#gridQuantityAvailable";
var TblGridQuantityAvailableDataRow;



var TblGridIssueingQuantity;
var TblGridIssueingQuantityId = "#gridIssueingQuantity";
var TblGridIssueingQuantityDataRow;

var TblGridPrevResults;
var TblGridPrevResultsId = "#gridPrevResults";
var TblGridPrevResultsDataRow;

var TblGridReservedExtend;
var TblGridReservedExtendId = "#gridReservedExtend";
var TblGridReservedExtendDataRow;

var StatioId;
//var Status;
//var OrderNo;


$(document).ready(function () {

    c.SetTitle("Crossmatch - IP");
    c.DefaultSettings();

    SetupDataTables();
    SetupSelectedBGroup();
    InitButton();
    InitICheck();
    InitSelect2();
    InitDateTimePicker();
    InitDataTables();
   
    DefaultDisable();
    DefaultReadOnly();
    DefaultValues();

    HandleEnableButtons();
    HandleEnableEntries();

    BindList([]);
    BindCrossMatchType([]);
    BindCompatability([]);
    BindWardsOrder([]);
    BindIssueingQuantity([]);
    BindQuantityAvailable([]);
    
    ShowList();
 
    //ShowSearch();
    
    c.ResizeDiv('#reportBorder', reportHeight);
    GoOnTop();
    //c.makedate("#dtDateTime", "dd-M-yyyy mm:hh");
 
});

function GoOnTop() {
    // Hide the toTop button when the page loads.
    $("#GoOnTop").css("display", "none");

    // This function runs every time the user scrolls the page.
    $('#Entry').scroll(function () {

        // Check weather the user has scrolled down (if "scrollTop()"" is more than 0)
        if ($('#Entry').scrollTop() > 0) {
            $("#GoOnTop").fadeIn("slow");
        }
        else {
            // If it's less than 0 (at the top), hide the toTop button.
            $("#GoOnTop").fadeOut("slow");
        }
    });

    // When the user clicks the toTop button, we want the page to scroll to the top.
    $("#GoOnTop").click(function () {

        // Disable the default behaviour when a user clicks an empty anchor link.
        // (The page jumps to the top instead of // animating)
        event.preventDefault();

        // Animate the scrolling motion.
        $('#Entry').animate({
            scrollTop: 0
        }, "slow");

    });
}

$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // for future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();

    //    TblGridSearch.columns.adjust().draw();
    RedrawGrid();

})

$(document).on("click", TblGridListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        //tr.toggleClass('selected');

        // Single selection
        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected')

        TblGridListDataRow = TblGridList.row($(this).parents('tr')).data();


    }
});
$(document).on("click", TblGridCrossMatchTypeId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        tr.toggleClass('selected');

        // Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')

        TblGridCrossMatchTypeDataRow = TblGridCrossMatchType.row($(this).parents('tr')).data();

    }
});
$(document).on("click", TblGridCompatabilityId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        tr.toggleClass('selected');

        // Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')

        TblGridCompatabilityDataRow = TblGridCompatability.row($(this).parents('tr')).data();

    }
});
$(document).on("click", TblGridWardsOrderId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        //tr.toggleClass('selected');

        // Single selection
        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected')

        TblGridWardsOrderDataRow = TblGridWardsOrder.row($(this).parents('tr')).data();

    }
});
$(document).on("click", TblGridQuantityAvailableId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        tr.toggleClass('selected');

        // Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')

        TblGridQuantityAvailableDataRow = TblGridQuantityAvailable.row($(this).parents('tr')).data();

    }
});
$(document).on("click", TblGridIssueingQuantityId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        //tr.toggleClass('selected');

        // Single selection
        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected')

        TblGridIssueingQuantityDataRow = TblGridIssueingQuantity.row($(this).parents('tr')).data();
        if (TblGridListDataRow.status === 1) {
            c.MessageBoxErr("Done...", 'CrossMatched Reserved Already.');
        }
        else {
            add_IssueingQuantity(this);
            remove_SelectedissuengQuantity(this);   
        }

     
    }
});
$(document).on("click", TblGridPrevResultsId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        //tr.toggleClass('selected');

        // Single selection
        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected')

        TblGridPrevResultsDataRow = TblGridPrevResults.row($(this).parents('tr')).data();

    }
});

$(document).on("dblclick", TblGridListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        TblGridListDataRow = TblGridList.row($(this).parents('tr')).data();

        var Status = TblGridListDataRow.status;
        //$("btnSave").disabled = true;
        if  (Status === 0) {
            
            c.ModalShow('#modalBReceived', true);
            var PatientName = TblGridListDataRow.Patientname;
            c.SetValue('#txtPatientNameRecieved', PatientName);
        }
        else {
           
            c.DisableSelect2('#select2BGroup', false);
            $('#btnView').click();

            //Action === 1;
        }


       
    }
});


$(document).on("dblclick", TblGridWardsOrderId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        TblGridWardsOrderDataRow = TblGridWardsOrder.row($(this).parents('tr')).data();
       
        var OrderNo = TblGridWardsOrderDataRow.OrderNo;
        var ComponentId = TblGridWardsOrderDataRow.ComponentId;
        var BGroup = c.GetSelect2Id('#select2BGroup');
        
        var DemandQty = TblGridWardsOrderDataRow.demandqty;
        //var req = c.IsEmptySelect2('#select2BGroup');
        req = c.GetSelect2Text('#select2BGroup');
         if (req == '') {
            c.MessageBoxErr('Empty...', 'Please Select Blood Group');
            return;
         }
         req = c.GetSelect2Text('#select2AntiBodyScreening');
         if (req == '') {
             c.MessageBoxErr('Empty...', 'Please Select AntiBodyScreening');
             return;
         }

         //if (TblGridListDataRow.status !== 1) {
         //    c.MessageBoxErr("Empty...", "No Stocks Found.", null);
        //}
        //for testing
         if (TblGridListDataRow.status === 1) {
                 c.MessageBoxErr("Done...", 'Already CrossMatched.');       
         }

         else {
             c.DisableSelect2('#select2BGroup', true);
             ShowQuantityAvailable(OrderNo, ComponentId, BGroup);
           //  ShowQuantityRowCallBack();
             //$('#btnView').click();
             //if (TblGridWardsOrderDataRow.rows('.selected').data().length == 0) {
             //    c.MessageBoxErr("Empty...", "No Stocks Found.", null);
             //    return;
             //}
         }


    }

  
});


$(document).on("dblclick", TblGridQuantityAvailableId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        TblGridQuantityAvailableDataRow = TblGridQuantityAvailable.row($(this).parents('tr')).data();
        var TempId = TblGridQuantityAvailableDataRow.TempId;
        var BGId = TblGridQuantityAvailableDataRow.BGId;
        if (TempId !== BGId) {
            c.MessageBoxErr("Incorrect BloodType...", 'Select Correct BloodType.');
        }
        else {
            add_QuantityAvailable(this);
            remove_SelectedAvailQuantity(this);
        }
    }
});


function add_QuantityAvailable(cell) {
    rowIndex = TblGridQuantityAvailable.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    $.each(TblGridQuantityAvailable.rows().data(), function (i, re) {
        if (TblGridQuantityAvailable.cell(i, 0).data() == TblGridIssueingQuantity.cell(rowIndex, 0).data()) {
            $ex = 1;
        }
    }); 
    if ($ex == 0) {

        TblGridIssueingQuantity.row.add({
            ctr: TblGridQuantityAvailable.cell(rowIndex, 0).data(),
            bagid: TblGridQuantityAvailable.cell(rowIndex, 1).data(),
            UnitNo: TblGridQuantityAvailable.cell(rowIndex, 2).data(),
            ddate: TblGridQuantityAvailable.cell(rowIndex, 3).data(),
            ExpiryDate: TblGridQuantityAvailable.cell(rowIndex, 4).data(),
            bloodname: TblGridQuantityAvailable.cell(rowIndex, 5).data(),
            BGroup: TblGridQuantityAvailable.cell(rowIndex, 5).data(),
            bloodid: TblGridQuantityAvailable.cell(rowIndex, 6).data(),
            crossstate: TblGridQuantityAvailable.cell(rowIndex, 7).data(),
            Cvolume: TblGridQuantityAvailable.cell(rowIndex, 8).data(),
            //BCode: TblGridQuantityAvailable.cell(rowIndex, 10).data(),
            IssueCode: TblGridQuantityAvailable.cell(rowIndex, 10).data(),
            IsExpired: TblGridQuantityAvailable.cell(rowIndex, 11).data(),
            TempId: TblGridQuantityAvailable.cell(rowIndex, 12).data(),
            BGId: TblGridQuantityAvailable.cell(rowIndex, 13).data(),
            Status: TblGridQuantityAvailable.cell(rowIndex, 14).data(),
            patbloodgroup: TblGridQuantityAvailable.cell(rowIndex, 15).data(),
            UnitGroup: TblGridQuantityAvailable.cell(rowIndex, 16).data(),
            ComponentId: TblGridQuantityAvailable.cell(rowIndex, 17).data(),

   
        }).draw();
    }
}
function add_IssueingQuantity(cell) {
    rowIndex = TblGridIssueingQuantity.cell(cell).index().row;
    //rowIndex = TblGridIssueingQuantity.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    $.each(TblGridIssueingQuantity.rows().data(), function (i, re) {
        if (TblGridIssueingQuantity.cell(i, 0).data() == TblGridQuantityAvailable.cell(rowIndex, 0).data()) {
            $ex = 1;
        }
    });
    if ($ex == 0) {
        TblGridQuantityAvailable.row.add({
            ctr: TblGridIssueingQuantity.cell(rowIndex, 0).data(),
            UnitNo: TblGridIssueingQuantity.cell(rowIndex, 1).data(),
            BGroup: TblGridIssueingQuantity.cell(rowIndex, 2).data(),
            BCode: TblGridIssueingQuantity.cell(rowIndex, 3).data(),
            bagid: TblGridIssueingQuantity.cell(rowIndex, 4).data(),
            ddate: TblGridIssueingQuantity.cell(rowIndex, 5).data(),
            ExpiryDate: TblGridIssueingQuantity.cell(rowIndex, 6).data(),
            bloodname: TblGridIssueingQuantity.cell(rowIndex, 7).data(),
            bloodid: TblGridIssueingQuantity.cell(rowIndex, 8).data(),
            crossstate: TblGridIssueingQuantity.cell(rowIndex, 9).data(),
            Cvolume: TblGridIssueingQuantity.cell(rowIndex, 10).data(),
            IsExpired: TblGridIssueingQuantity.cell(rowIndex, 11).data(),
            TempId: TblGridIssueingQuantity.cell(rowIndex, 12).data(),
            BGId: TblGridIssueingQuantity.cell(rowIndex, 13).data(),
            Status: TblGridIssueingQuantity.cell(rowIndex, 14).data(),
            patbloodgroup: TblGridIssueingQuantity.cell(rowIndex, 15).data(),
            UnitGroup: TblGridIssueingQuantity.cell(rowIndex, 16).data(),
            ComponentId: TblGridIssueingQuantity.cell(rowIndex, 17).data(),
        }).draw();
    }
}

function remove_SelectedissuengQuantity(cell) {
    rowV = $(cell).parents('tr');
    if (TblGridListDataRow.status !== 1) {
        TblGridIssueingQuantity.row(rowV).remove().draw();
    }

}
function remove_SelectedAvailQuantity(cell) {
    rowV = $(cell).parents('tr');
        TblGridQuantityAvailable.row(rowV).remove().draw();
 
}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}
$(window).on("resize", function () {
    c.ResizeDiv('#reportBorder', reportHeight);
});
$('#myReport').on('load', function () {
    $('#preloader').hide();
    c.ModalShow('#modalReport', true);
});
function GenerateReport(Id) {
    $('#preloader').show();

    var $report = $("#myReport");
    var UserId = "";

    var dlink = hissystem.appsserver() + hissystem.appsname() + "/Areas/BloodBank/Reports/CrossmatchIP/CrossmatchIP.aspx";
    var repsrc = dlink + "?Id=" + Id;

    c.LoadInIframe("myReport", repsrc);
}

function Refresh() {
    ShowList();
    StatioId = $('#ListOfStation').val();
}
function InitButton() {
    $('#btnRefresh').click(function () {
        location.reload();
    });

    $('#btnRcvExtnd').click(function () {
        //ShowList();
        if (TblGridList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }

        c.ModalShow('#ModalUnReserved', true);
        ShowReserevedExtend(TblGridListDataRow.OrderNo);
        ViewExtendReserved(TblGridListDataRow.OrderNo);
    });

    $('#btnFilter').click(function () {
        c.ModalShow('#modalFilter', true);
    });
    $('#btnView').click(function () {

        if (TblGridList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }
        var Status = TblGridListDataRow.status;
        if (Status === 1) {
            Action = 2
            View(TblGridListDataRow.OrderNo);
        }
        else {
            Action = 1;
            View(TblGridListDataRow.OrderNo);
        }
        //$("btnSave").hide();
    });
    $('#btnNewEntry').click(function () {

        Action = 1;
        DefaultDisable();
        DefaultReadOnly();
        DefaultEmpty();
        DefaultValues();
        InitDataTables();
        HandleEnableButtons();
        HandleEnableEntries();
        RedrawGrid();

        c.SetValue('#PositionId', c.GetSelect2Id('#select2Position'));
        c.SetValue('#txtPosition', c.GetSelect2Text('#select2Position'));

    });

    $('#btnCloseFilter').click(function () {
        c.ModalShow('#modalFilter', false);
    });
    $('#btnViewFilter').click(function () {
        var ID = c.GetSelect2Id('#select2EmployeeIDFilter');

        //if (!isChecked && ID.length == 0) {
        //    c.MessageBoxErr("Required...", "Please select an employee.");
        //    return;
        //}

        ShowList();
        c.ModalShow('#modalFilter', false);

    });

    $('#btnClose').click(function () {

        Action = -1;
        HandleEnableButtons();
        HandleEnableEntries();
        RedrawGrid();

        return;

        var msg = "";
        if (Action == 0) {
            msg = "Are you sure you want to cancel the update?";
        }
        else if (Action == 1) {
            msg = "Are you sure you want to cancel the creation of new entry?";
        }
        else if (Action == 2) {
            msg = "Are you sure you want to cancel updating this entry?";
        }

        var YesFunc = function () {
            Action = -1;
            HandleEnableButtons();
            HandleEnableEntries();
            c.ModalShow('#modalEntry', false);
        };

        var NoFunc = function () {
        };

        c.MessageBoxConfirm("Cancel...", msg, YesFunc, NoFunc);

    });
    $('#btnClear').click(function () {

        var YesFunc = function () {
            Action = 1;
            DefaultEmpty();
            DefaultValues();
            HandleEnableButtons();
            HandleEnableEntries();
        };

        c.MessageBoxConfirm("Clear...", "Are you sure you want to clear the entry?", YesFunc, null);


    });
    $('#btnDelete').click(function () {

        var YesFunc = function () {
            Action = 3;
            Save();
        };

        var NoFunc = function () {
        };

        c.MessageBoxConfirm("Delete?", "Are you sure you want to delete this entry?", YesFunc, NoFunc);

    });
    $('#btnEdit').click(function () {

        Action = 2;
        HandleEnableButtons();
        HandleEnableEntries();
    });
    $('#btnSave').click(function () {
       
        Save();
    });
    $('#btnNew').click(function () {

        var YesFunc = function () {
            Action = 1;
            DefaultDisable();
            DefaultReadOnly();
            DefaultEmpty();
            DefaultValues();
            InitDataTables();
            HandleEnableButtons();
            HandleEnableEntries();
            c.SetActiveTab('sectionA');
        };

        c.MessageBoxConfirm("Create a new one?", "Are you sure you want to clear the current entry and create a new one?", YesFunc, null);

    });

    $('#btnFindClose').click(function () {
        c.ModalShow('#FrmFindSurgery', false);
    });
    $('#btnFindRefresh').click(function () {
        ShowSearch();
    });
    $('#btnFindOK').click(function () {

        var rowcollection = TblGridSearch.$(".selected", { "page": "all" });
        var ctr;
        rowcollection.each(function (index, elem) {
            var tr = $(elem).closest('tr');
            var row = TblGridSearch.row(tr);
            var rowdata = row.data();

            //rowdata["StatusId"],
            ctr = $(TblGridSelectedId).DataTable().rows().nodes().length + 1;
            TblGridSelected.row.add({
                "id": rowdata["id"],
                "ctr": ctr,
                "name": rowdata["name"]
            }).draw();

            //InitSelected();

        });
        RecountList();

        $('#btnFindClose').click();

    });

    $('#btnPreviousTest').click(function () {
        c.ModalShow('#modalPrevResult', true);
        RedrawGrid();
    });
    $('#btnClosePrev').click(function () {
        c.ModalShow('#modalPrevResult', false);
        RedrawGrid();
    });


    $('#btnPreview').click(function () {
        //var Id = c.GetValue('#Id');
        //GenerateReport(Id);
        $('#myModal').modal('show');
        var Status = TblGridListDataRow.status;
        if (Status === 1) {
            PrintPreview();
        }
        else {
            PrintPreview1();
        }
       
       
    });
    $('#btnCloseReport').click(function () {
        c.ModalShow('#modalReport', false);
    });

    $('#btnRecieved').click(function () {
        SaveMaxLabNo();
    });

    $('#btnCancelReceived').click(function () {
        c.ModalShow('#modalBReceived', false);
    });
    
    $('#btnCancelRC').click(function () {
        c.ModalShow('#ModalUnReserved', false);
    });
 

    $('#btnExtend').click(function () {

        var YesFunc = function () {
            Action = 1;
            SaveExtendUnReserve();
            c.ModalShow('#modalEntry', false);
        };

        var NoFunc = function () {
            c.ModalShow('#ModalUnReserved', false);

        };

        c.MessageBoxConfirm("Extend?", "Are you sure you want to Extend?", YesFunc, NoFunc);

    });
    $('#btnUnReserved').click(function () {

        var YesFunc = function () {
            Action = 2;
            SaveExtendUnReserve();
            c.ModalShow('#ModalUnReserved', false);

        };

        var NoFunc = function () {
            c.ModalShow('#ModalUnReserved', false);

        };

        c.MessageBoxConfirm("UnReserve?", "Are you sure you want to UnReserve?", YesFunc, NoFunc);
      


    });
}
function InitICheck() {

    $('#iChkTransfusion').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
    });
    $('#iChkMiscarriage').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
    });
    $('#iChkStillBirth').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
    });
    $('#iChkReaction').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
    });
    $('#iChkPregnancies').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
    });
    $('#iChkErythroblastosis').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
    });
    $('#iChkChangeBloodIssue').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
    });


    // $('#iChkPending, #iChkOnHold').iCheck('check');
}
function InitSelect2() {
    $('#select2BGroup').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2CrossmatchIPBloodGroup',
            dataType: 'jsonp',
            cache: false,
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
    }).change(function (e) {
        //var list = e.added.list;
       
    });
    $('#select2FAllergy').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetAppraiser',
            dataType: 'jsonp',
            cache: false,
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
    }).change(function (e) {
        var list = e.added.list;

    });
    $('#select2DAllergy').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetAppraiser',
            dataType: 'jsonp',
            cache: false,
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
    }).change(function (e) {
        var list = e.added.list;

    });

    $("#select2AntiBodyScreening").select2({
        data: [{ id: 0, text: 'POSITIVE' }, { id: 1, text: 'NEGATIVE' }, { id: 100, text: '' }],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added.list;

        $('#AntiBodyScreeningCode').show();

        if (e.val == 0) {
            $('#AntiBodyScreeningCode').removeClass('ColorCodeWhite');
            $('#AntiBodyScreeningCode').addClass('ColorCodeRed');
        }
        else {
            $('#AntiBodyScreeningCode').removeClass('ColorCodeRed');
            $('#AntiBodyScreeningCode').addClass('ColorCodeWhite');
        }

    });

    $('#select2CrossmatchedBy').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2CrossmatchBy',
            dataType: 'jsonp',
            cache: false,
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
    }).change(function (e) {
        var list = e.added.list;

    });


    $('#select2CrossmatchedType').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2CrossMatchType',
            dataType: 'jsonp',
            cache: false,
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
    }).change(function (e) {
        var list = e.added.list;

    });


    $('#select2CompatabilityDetails').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Compatablitiy',
            dataType: 'jsonp',
            cache: false,
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
    }).change(function (e) {
        var list = e.added.list;

    });


}
function InitDateTimePicker() {
    $('#dtDateTime').datetimepicker({
        pickTime: true
    }).on("dp.change", function (e) {

    });
   
}
function InitDataTables() {
    //BindSequence([]);
    BindCrossMatchType([]);
    BindCompatability([]);
    BindWardsOrder([]);
    BindQuantityAvailable([]);
}
function SetupDataTables() {
    // SetupSequence();
    // SetupCompatability();
}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (TblGridList !== undefined) TblGridList.columns.adjust().draw();
    if (TblGridCrossMatchType !== undefined) TblGridCrossMatchType.columns.adjust().draw();
    if (TblGridCompatability !== undefined) TblGridCompatability.columns.adjust().draw();
    if (TblGridWardsOrder !== undefined) TblGridWardsOrder.columns.adjust().draw();
    if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();

}

    function DefaultReadOnly() {
    c.ReadOnly('#txtPIN', true);
    c.ReadOnly('#txtName', true);
    c.ReadOnly('#txtSlNo', true);
    c.ReadOnly('#txtBedNo', true);
    c.ReadOnly('#txtAge', true);
    c.ReadOnly('#txtSex', true);
    c.ReadOnly('#txtOperator', true);
    c.ReadOnly('#txtDoctor', true);

    c.ReadOnly('#txtWBC', true);
    c.ReadOnly('#txtHCT', true);
    c.ReadOnly('#txtRBC', true);
    c.ReadOnly('#txtPlatelets', true);
    c.ReadOnly('#txtHb', true);
    c.ReadOnly('#txtOthers', true);
    c.ReadOnly('#txtPT', true);
    c.ReadOnly('#txtPTTK', true);
    c.ReadOnly('#txtClinicalDiagnosis', true);
    c.ReadOnly('#txtRequestType', true);
    c.ReadOnly('#txtTransfusionType', true);
    c.ReadOnly('#txtReplacement', true);
    c.ReadOnly('#txtWard', true);


}
    function DefaultValues() {
    //    c.SetDateTimePicker('#dtSurgeryDate', moment());
}
    function DefaultDisable() {
    c.DisableDateTimePicker('#dtDateTime', true);
    //c.DisableSelect2('#select2BGroup', true);
    c.DisableSelect2('#select2FAllergy', true);
    c.DisableSelect2('#select2DAllergy', true);
    
    c.iCheckDisable('#iChkTransfusion', true);
    c.iCheckDisable('#iChkMiscarriage', true);
    c.iCheckDisable('#iChkStillBirth', true);
    c.iCheckDisable('#iChkReaction', true);
    c.iCheckDisable('#iChkPregnancies', true);
    c.iCheckDisable('#iChkErythroblastosis', true);
    c.Disable('#txtPatientNameRecieved', true);
    c.Disable('#txtUnRsvexPatienName', true);
}
    function DefaultEmpty() {
    c.SetValue('#Id', '');
    c.ClearAllText();

    //c.Select2Clear('#select2Appraiser');

    BindCrossMatchType([]);
    BindCompatability([]);
    BindWardsOrder([]);
    BindQuantityAvailable([]);
    //BindIssueingQuantity([]);
    BindPrevResults([]);
}

    function ValidatedNewEntry() {

        //var ret = '';

        //ret = c.GetSelect2Text('#select2CrossmatchedBy');
        //if (ret) {
        //    c.MessageBoxErr('Empty...', 'Please select a CrossMatchBy');
        //    return false;
        //}



            
        return true;

    }
    
    function Validated() {
        var req = false;
        var required = '';
        var ctr = 0;

        //req = c.IsEmptyById('#txtPIN');
        //if (req) {
        //    c.MessageBoxErr('Required...', 'PIN is required.');
        //    return false;
        //}
        //req = c.IsEmptySelect2('#select2BloodGroup');
        //if (req) {
        //    c.MessageBoxErr('Required...', 'Blood Group I is required.');
        //    return false;
        //}  
        //req = c.IsDateEmpty('#dtCollectionDate');
        //if (req) {
        //    c.MessageBoxErr('Required...', 'Collection Date is required.');
        //    return false;
        //}
        if (c.GetSelect2Text('#select2CrossmatchedBy')) {
            ctr++;
            required = required + '<br> ' + ctr + '. Select a Title.';
        }
        //if (c.IsEmptyById('#txtDonorName')) {
        //    ctr++;
        //    required = required + '<br> ' + ctr + '. Enter the Donor Name.';
        //}
        //if (c.IsEmptyById('#txtID')) {
        //    ctr++;
        //    required = required + '<br> ' + ctr + '. Enter the Donor Iqama / Saudi ID.';
        //}
        //if (c.IsEmptySelect2('#select2Nationality')) {
        //    ctr++;
        //    required = required + '<br> ' + ctr + '. Select the Nationality.';
        //}
        //if (c.IsEmptySelect2('#select2Gender')) {
        //    ctr++;
        //    required = required + '<br> ' + ctr + '. Select the gender.';
        //}
        //if (c.IsEmptySelect2('#select2TypeOfDonor')) {
        //    ctr++;
        //    required = required + '<br> ' + ctr + '. Select the type of donor.';
        //}
        //if (c.IsEmptySelect2('#select2DonorStatus')) {
        //    ctr++;
        //    required = required + '<br> ' + ctr + '. Select the donor status.';
        //}
        //if (isDonatingFor && c.IsEmptySelect2('#select2DonatingFor')) {
        //    ctr++;
        //    required = required + '<br> ' + ctr + '. Details for donating for.';
        //}
        //if (isDonatingFor && c.IsEmptySelect2('#select2IssueBags')) {
        //    ctr++;
        //    required = required + '<br> ' + ctr + '. Details for donating for (Issue Bags).';
        //}

        if (required.length > 0) {
            //c.MessageBoxErr('Enter the following details...', required);

            //if (ctr == 1 && isDonatingFor && c.IsEmptySelect2('#select2DonatingFor')) {
            //    c.SetActiveTab('sectionB');
            //}
            //else if (ctr == 1 && c.IsEmptySelect2('#select2DonorStatus')) {
            //    c.SetActiveTab('sectionE');
            //}
            //else {
            //    c.SetActiveTab('sectionA');
            //}

            return false;
        }

        return true;

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
    function HandleButtonNotUse() {
    $('.NotUse').hide();
}

    function SaveMaxLabNo() {



    //var ret = true;

    ////if (Action !== 3) {
    ////    ret = Validated(); // Don't validate if wants to  delete.
    ////}

    //if (!ret) return ret;
    var entry;
    entry = [];
    entry = {};

    entry.Action = 1;
    entry.StationID = $('#ListOfStation').val();
    //var status = TblGridListDataRow.status;
    entry.StatusID = 7;
    entry.OrderNo = TblGridListDataRow.OrderNo;
    $.ajax({
        url: baseURL + 'SaveMaxLab',
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            c.ButtonDisable('#btnRecieved', true);
        },
        success: function (data) {
            c.ButtonDisable('#btnRecieved', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                //if (Action == 3) {
                //    c.Show('#ButtonsOnBoard', true);
                //    c.Show('#ButtonsOnEntry', false);
                //    c.Show('#DashBoard', true);
                //    c.Show('#Entry', false);
                //    TblGridList.row('tr.selected').remove().draw(false);
                //    return;
                //}

                Action = 1;
                HandleEnableButtons();
                HandleEnableEntries();
                c.ModalShow('#modalBReceived', false);

                
            };

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#btnSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

    //return ret;
    }

    function View(Id) {

        Url = baseURL + "ShowSelected";
        param = {
            Id: Id
        };

        $('#preloader').show();
        $('.Hide').hide();

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

                //if (data.list.length == 0) {
                //    Action = 1;
                //    HandleEnableButtons();
                //    HandleEnableEntries();
                //    RedrawGrid();
                //    return;
                //}

                //Action = 0;

                var data = result.list;

                DefaultEmpty();

                //c.SetValue('#txtUnRsvexPatienName', data[0].Patientname);

                c.SetValue('#Id', Id);
                c.SetValue('#Ipid', data[0].Ipid);
                c.SetValue('#bedid', data[0].BedId);
                c.SetValue('#reqtype', data[0].reqtype);
                c.SetValue('#txtPIN', data[0].PIN);
                c.SetValue('#txtName', data[0].Patientname);
                c.SetValue('#txtSlNo', data[0].OrderNo);
                c.SetValue('#txtBedNo', data[0].Bed);
                c.SetValue('#txtAge', data[0].Age);
                c.SetValue('#txtSex', data[0].Gender);
                c.SetValue('#txtDoctor', data[0].Doctor);
                c.SetValue('#DoctorId', data[0].DoctorId);
                c.SetValue('#txtWard', data[0].Ward);
                c.SetValue('#txtWBC', data[0].BloodOrder[0].wbc);
                c.SetValue('#txtHCT', data[0].BloodOrder[0].pcv);
                c.SetValue('#txtRBC', data[0].BloodOrder[0].rbc);
                c.SetValue('#txtPlatelets', data[0].BloodOrder[0].platelet);
                c.SetValue('#txtHb', data[0].BloodOrder[0].hb);
                c.SetValue('#txtOthers', data[0].BloodOrder[0].others);
                c.SetValue('#txtPT', data[0].BloodOrder[0].pt);
                c.SetValue('#txtPTTK', data[0].BloodOrder[0].pttk);
                c.SetValue('#txtClinicalDiagnosis', data[0].BloodOrder[0].clinicaldetails);
                c.SetValue('#txtTransfusionType', data[0].TransfussionType);
                c.SetValue('#txtRequestType', data[0].RequestType);
                c.SetValue('#txtReplacement', data[0].Replacement);
                c.SetValue('#txtRemarks', data[0].Remarks);
                c.SetValue('#txtOperator', data[0].CrossMatchedByName)
                c.SetDateTimePicker('#dtDateTime', data[0].sDateTime);

                var AntiBodyId = data[0].AntiBody == null ? 0 : data[0].AntiBodyId;
                var AntiBody = data[0].AntiBody == null ? '' : data[0].AntiBody;
                c.SetSelect2('#select2AntiBodyScreening', AntiBodyId, AntiBody);

                var BloodGroupId = data[0].BloodGroupName == null ? 0 : data[0].BloodGroupId;
                var BloodGroupName = data[0].BloodGroupName == null ? '' : data[0].BloodGroupName;
                c.SetSelect2('#select2BGroup', BloodGroupId, BloodGroupName);
                c.DisableSelect2('#select2BGroup', true);
                var CrossMatchedById = data[0].CrossMatchedById == null ? 0 : data[0].CrossMatchedById;
                var CrossMatchedByName = data[0].CrossMatchedByName == null ? '' : data[0].CrossMatchedByName;
                c.SetSelect2('#select2CrossmatchedBy', CrossMatchedById, CrossMatchedByName);
                var CrossMatchId = data[0].CrossMatchId == null ? 0 : data[0].CrossMatchId;
                var CrossMatchName = data[0].CrossMatchName == null ? '' : data[0].CrossMatchName;
                c.SetSelect2('#select2CrossmatchedType', CrossMatchId, CrossMatchName);


                var CompatablityId = data[0].CompatablityId == null ? 0 : data[0].CompatablityId;
                var CompatablityName = data[0].CompatablityName == null ? '' : data[0].CompatablityName;
                c.SetSelect2('#select2CompatabilityDetails', CompatablityId, CompatablityName);

                $('#AntiBodyScreeningCode').removeClass('ColorCodeWhite');
                $('#AntiBodyScreeningCode').removeClass('ColorCodeRed');
                $('#AntiBodyScreeningCode').removeClass('ColorCodeYellow');
                $('#RequestType').removeClass('ColorCodeWhite');
                $('#RequestType').removeClass('ColorCodeRed');
                $('#RequestType').removeClass('ColorCodeYellow');

                $('#AntiBodyScreeningCode').hide();
                $('#RequestType').hide();

                if (data[0].AntiBodyId == 0 && data[0].BloodGroupName != null) {
                    $('#AntiBodyScreeningCode').addClass('ColorCodeRed');
                    $('#AntiBodyScreeningCode').show();
                } else if (data[0].BloodGroupName != null) {
                    $('#AntiBodyScreeningCode').addClass('ColorCodeWhite');
                    $('#AntiBodyScreeningCode').show();
                }

                if (data[0].reqtype == 0) { //Routine
                    $('#RequestType').addClass('ColorCodeYellow');
                    $('#RequestType').show();
                }
                else if (data[0].reqtype == 1) { //Stat
                    $('#RequestType').addClass('ColorCodeRed');
                    $('#RequestType').show();
                }

                //BindCrossMatchType(data[0].CrossmatchValue);
                BindCompatability(data[0].CrossmatchCompatibiliy);

                BindWardsOrder(data[0].WardsOrder);
                BindIssueingQuantity(data[0].AvailQuantity);

                BindPrevResults(data[0].PreviousResult);
                //var value = c.SetValue('#status', status);
                if (TblGridListDataRow.status === 1) {
                    $('.griddisable *').prop('disabled', true);
                    //alert('test');
                }
                //var OrderNo = 0;
                //var ComponentId = 0;
                //ShowQuantityAvailable(OrderNo, ComponentId);
                HandleEnableButtons();
                HandleEnableEntries();
                RedrawGrid();

            },
            error: function (xhr, desc, err) {
                $('#preloader').hide();
                var errMsg = err + "<br>" + desc;
                c.MessageBoxErr(errMsg);
            }
        });

    }

    function ViewExtendReserved(Id) {

        Url = baseURL + "ShowSelected";
        param = {
            Id: Id
        };

        $('#preloader').show();
        $('.Hide').hide();

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

                //if (data.list.length == 0) {
                //    Action = 1;
                //    HandleEnableButtons();
                //    HandleEnableEntries();
                //    RedrawGrid();
                //    return;
                //}

                //Action = 0;

                var data = result.list;

                DefaultEmpty();

                c.SetValue('#txtUnRsvexPatienName', data[0].Patientname);

 
                ////BindCrossMatchType(data[0].CrossmatchValue);
                //BindCompatability(data[0].CrossmatchCompatibiliy);

                //BindWardsOrder(data[0].WardsOrder);
                //BindIssueingQuantity(data[0].AvailQuantity);

                //BindPrevResults(data[0].PreviousResult);
                //var value = c.SetValue('#status', status);
                if (TblGridListDataRow.status === 1) {
                    $('.griddisable *').prop('disabled', true);
                    //alert('test');
                }
                //var OrderNo = 0;
                //var ComponentId = 0;
                //ShowQuantityAvailable(OrderNo, ComponentId);
                HandleEnableButtons();
                HandleEnableEntries();
                RedrawGrid();

            },
            error: function (xhr, desc, err) {
                $('#preloader').hide();
                var errMsg = err + "<br>" + desc;
                c.MessageBoxErr(errMsg);
            }
        });

    }

    function Save() {

        var ret = ValidatedNewEntry();
        if (!ret) return ret;

        req = c.GetSelect2Text('#select2CrossmatchedBy');
        if (req == '') {
            c.MessageBoxErr('Empty...', 'Please Select CrossMatchedBy');
            return;
        }

            //if (TblGridWardsOrderDataRow.rows.data().length == 0) {
            //    c.MessageBoxErr("Empty...", "No Stocks Found.", null);
            //    return;
            //}

        else {



            c.ButtonDisable('#btnSave', true);


            var entry;
            entry = []
            entry = {}
            entry.Action = 1;

            entry.Ipid = $('#Ipid').val();
            entry.BedId = $('#bedid').val();
            entry.Doctorid = $('#DoctorId').val();
            entry.CompatablityId = $('#select2CompatabilityDetails').select2('data').id;
            entry.reqtype = $('#reqtype').val();
            entry.CrossMatchedById = c.GetSelect2Id('#select2CrossmatchedBy')
            entry.CrossMatchtypeId = c.GetSelect2Id('#select2CrossmatchedType')
            entry.StationId = $('#ListOfStation').val();
            entry.transtype = $('#transtype').val();
            entry.RequestedDateTime = moment();//c.GetDateTimePicker('#dtDateTime');
            entry.antibody = $('#select2AntiBodyScreening').select2('data').id;
            entry.OrderNo = $('#txtSlNo').val();
            entry.BGroup = c.GetSelect2Id('#select2BGroup');
            entry.Remarks = $('#txtRemarks').val();

            entry.CrossMatchSaveDetails = []
            $.each(TblGridIssueingQuantity.rows().data(), function (i, row) {
                //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
                debugger;
                entry.CrossMatchSaveDetails.push({
                    ctr: row.ctr,
                    bagid: 0,
                    ExpiryDate: row.ExpiryDate,
                    compatabulity: $('#select2CompatabilityDetails').select2('data').id,
                    //Issued: c.GetDateTimePicker('#dtDateTime'),
                    Issued: 0,
                    Reserved: 1,
                    ExtenReserved: 0,
                    patbloodgroup: row.patbloodgroup,   // Patient blood group
                    UnitGroup: row.bloodid,     // Donor blood group
                    BagNumber: row.UnitNo,
                    ComponentId: row.ComponentId
                    //Issued: row.type === 'false' ? 0 : 1

                    //ParameterId: row.PenaltyName.split(" ")[0],
                    ////type: c.MomentYYYYMMDD(row.PenaltyDate),
                    //Refund: row.Refund === 'Yes' ? 1 : 0,
                    //testAppId: false,
                    //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
                });
            });
            
            $.ajax({
                url: baseURL + 'Save',
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

                        if (Action == 3) {
                            //c.Show('#ButtonsOnBoard', true);
                            //c.Show('#ButtonsOnEntry', false);
                            c.Show('#DashBoard', true);
                            c.Show('#Entry', false);
                            TblGridList.row('tr.selected').remove().draw(false);
                            return;
                        }

                        Action = 0;
                        HandleEnableButtons();
                        HandleEnableEntries();
                    };

                    c.MessageBox(data.Title, data.Message, OkFunc);
                    c.ModalShow('#modalEntry', false);
                },
                error: function (xhr, desc, err) {
                    c.ButtonDisable('#btnSave', false);
                    var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                    c.MessageBox("Error...", errMsg, null);
                }
            }); 
            return ret;
        }
    }


    function SaveExtendUnReserve() {
        var OrderNo = TblGridListDataRow.OrderNo;
        var ret = ValidatedNewEntry();
        if (!ret) return ret;
      
        //req = c.GetSelect2Text('#select2CrossmatchedBy');
        //if (req == '') {
        //    c.MessageBoxErr('Empty...', 'Please Select CrossMatchedBy');
        //    return;
        //}

        //    //if (TblGridWardsOrderDataRow.rows.data().length == 0) {
        //    //    c.MessageBoxErr("Empty...", "No Stocks Found.", null);
        //    //    return;
        //    //}

        //else {
    
            //c.ButtonDisable('#btnSave', true);

            var entry;
            entry = []
            entry = {}
            entry.Action = Action;
            entry.OrderNo = OrderNo;

            entry.ReservedExtendSaveDetails = []
            $.each(TblGridReservedExtend.rows().data(), function (i, row) {
                //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
                entry.ReservedExtendSaveDetails.push({
                    ctr: row.ctr,
                    BagNumber: row.UnitNo
                    //Issued: row.type === 'false' ? 0 : 1

                    //ParameterId: row.PenaltyName.split(" ")[0],
                    ////type: c.MomentYYYYMMDD(row.PenaltyDate),
                    //Refund: row.Refund === 'Yes' ? 1 : 0,
                    //testAppId: false,
                    //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
                });
            });

            $.ajax({
                url: baseURL + 'SaveExtendUnReserve',
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

                        if (Action == 3) {
                            //c.Show('#ButtonsOnBoard', true);
                            //c.Show('#ButtonsOnEntry', false);
                            c.Show('#DashBoard', true);
                            c.Show('#Entry', false);
                            TblGridList.row('tr.selected').remove().draw(false);
                            return;
                        }

                        Action = 0;
                        HandleEnableButtons();
                        HandleEnableEntries();
                    };

                    c.MessageBox(data.Title, data.Message, OkFunc);
                    Action = -1;
                    c.ModalShow('#modalEntry', false);
                    c.ModalShow('#ModalUnReserved', false);
                   
       
                },
                error: function (xhr, desc, err) {
                    c.ButtonDisable('#btnSave', false);
                    var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                    c.MessageBox("Error...", errMsg, null);
                }
            });

            return ret;

    }

    function ShowListColumns() {
    var cols = [
    { targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "0%" },
    { targets: [1], data: "OrderNo", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [2], data: "RequestedDateTime", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [3], data: "Ipid", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [4], data: "PIN", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [5], data: "Bed", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [6], data: "Patientname", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [7], data: "OperatorName", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [8], data: "reqtype", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [9], data: "status", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [10], data: "Acknowledge", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [11], data: "AcknowledgeDateTime", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [12], data: "SlNo", className: '', visible: true, searchable: true, width: "0%" }
    ];
    return cols;
}
    function ShowListRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['status'];
        var $nRow = $(nRow);
        if (value == 0) { // new order
            $nRow.css({ "background-color": "#fcc9c9" })
        }
        else if (value == 7) { // Sample Acknowledge
            $nRow.css({ "background-color": "#ffffd9" })
        }
        else if (value == 1) { // Crossmatched/Reserved
            $nRow.css({ "background-color": "#b7f5ff" })
            //$('# *').prop('disabled', true);
        }
        else if (value == 3) { // Incompatible unit(s) order
            $nRow.css({ "background-color": "#d3d3d2" })
        }
        else if (value == 10) { // Unreserved Units
            $nRow.css({ "background-color": "#ffffff" })
        }

        if (aData['reqtype'] == 1) { // Stat Request Type
            //$('td:eq(0)', nRow).addClass("btn-data-priority");
            $('td:eq(0)', nRow).css({ "background-color": "#02b230" })
        }


    };
    return rc;
}
    function SetupList() {
    $.editable.addInputType('select2Status', {
        element: function (settings, original) {
            var input = $('<input id="select2Status" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#select2Status').select2({
                minimumResultsForSearch: -1,
                minimumInputLength: 0,
                allowClear: true,
                data: [
                    { id: 0, text: '' },
                    { id: 1, text: 'Approved' },
                    { id: 2, text: 'Rejected' },
                    { id: 3, text: 'OnHold' }
                ]
            }).on("select2-blur", function () {
                $("#select2Status").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#select2Status").closest('form').submit(); }
                else { $("#select2Status").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#select2Status').val();
                $("#select2Status").select2("data", { id: a, text: a });
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
            if ($("#select2Status", this).select2('val') != null && $("#select2Status", this).select2('val') != '') {
                $("input", this).val($("#select2Status", this).select2("data").text);

            }
        }
    });
}
    function InitList() {
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassSelect2Status', TblGridList.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridList.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#select2Status');
        TblGridList.cell(cell.row, 1).data(id);
        TblGridList.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'select2Status', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    // Resize all rows.
    $(TblGridListId + ' tr').addClass('trclass');
}
    function ShowList() {
    var Url = baseURL + "ShowList";
    //    var param = {
    //        Id: Id
    //    };

    $('#preloader').show();
    $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        //data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {
        },
        success: function (data) {
            $('#preloader').hide();
            BindList(data.list);
            $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
    function BindList(data) {
    //TblGridList = $(TblGridListId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowListColumns(),
    //    bAutoWidth: false,
    //    scrollY: 450,
    //    scrollX: true,
    //    fnRowCallback: ShowListRowCallBack(),
    //    iDisplayLength: 25
    //});

    TblGridList = $(TblGridListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 450,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowListColumns(),
        fnRowCallback: ShowListRowCallBack()
    });

    //InitList();
}
//----CrossMatch Type------------------------------------------------------------------------------------------------------------------------
    function ShowCrossMatchTypeRowCallBack() {
    //ctr = 1;
    var rc = function (nRow, aData) {
        //var value = aData['sampleid'];
        var $nRow = $(nRow);
        if (aData.isChk.length != 0) {
            $('#chkCrossMatchtype', nRow).prop('checked', aData.isChk == 1);
            //$('td:eq(0)', nRow).html(ctr.toString());
            //ctr++;
        }
    };
    return rc;
}
    function ShowCrossMatchTypeColumns() {
    var cols = [
    { targets: [0], data: "", className: '', visible: true, searchable: false, width: "10%", defaultContent: '<input type="checkbox" id="chkCrossMatchtype" />' },
    { targets: [1], data: "isChk", className: 'cAR-align-center', visible: false, searchable: false, width: "0%" },
    { targets: [2], data: "CrossMatchtype", className: '', visible: true, searchable: true, width: "90%" }
    ];
    return cols;
}
    function ShowCrossMatchType() {
    var Url = baseURL + "ShowList";
    //    var param = {
    //        Id: Id
    //    };

    $('#preloader').show();
    $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        //data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {
        },
        success: function (data) {
            $('#preloader').hide();
            BindSelected(data.list);
            $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
    function BindCrossMatchType(data) {
    //TblGridCrossMatchType = $(TblGridCrossMatchTypeId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: false,
    //    ordering: false,
    //    info: false,
    //    columns: ShowCrossMatchTypeColumns(),
    //    bAutoWidth: false,
    //    scrollY: 280,
    //    scrollX: true,
    //    fnRowCallback: ShowCrossMatchTypeRowCallBack(),
    //    iDisplayLength: 25
    //});
    TblGridCrossMatchType = $(TblGridCrossMatchTypeId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 280,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowCrossMatchTypeColumns(),
        fnRowCallback: ShowCrossMatchTypeRowCallBack()
    });

    //InitSelected();
}
//----Compatibility------------------------------------------------------------------------------------------------------------------------------------------------------------
    function ShowCompatabilityRowCallBack() {
    //ctr = 1;
    var rc = function (nRow, aData) {
        //var value = aData['sampleid'];
        var $nRow = $(nRow);
        if (aData.isChk.length != 0) {
            $('#chkCompatibility', nRow).prop('checked', aData.isChk == 1);
            //$('td:eq(0)', nRow).html(ctr.toString());
            //ctr++;
        }
    };
    return rc;
    }

//cAR-align-center for ClassName  --{ targets: [0], data: "", className: '', visible: true, searchable: false, width: "10%", defaultContent: '<input type="checkbox" id="chkCompatibility" DISABLED />' },
    function ShowCompatabilityColumns() {
    var cols = [
    { targets: [0], data: "", className: '', visible: true, searchable: false, width: "10%", defaultContent: '<input type="checkbox" id="chkCompatibility"/>' },
    { targets: [1], data: "isChk", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [2], data: "Compatibility", className: '', visible: true, searchable: true, width: "90%" }
    ];
    return cols;
}
    function ShowCompatability() {
    var Url = baseURL + "ShowList";
    //    var param = {
    //        Id: Id
    //    };

    $('#preloader').show();
    $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        //data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {
        },
        success: function (data) {
            $('#preloader').hide();
            BindCompatability(data.list);
            $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
    function BindCompatability(data) {
    //TblGridCompatability = $(TblGridCompatabilityId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: false,
    //    ordering: false,
    //    info: false,
    //    columns: ShowCompatabilityColumns(),
    //    bAutoWidth: false,
    //    scrollY: 280,
    //    scrollX: true,
    //    fnRowCallback: ShowCompatabilityRowCallBack(),
    //    iDisplayLength: 25
    //});
    TblGridCompatability = $(TblGridCompatabilityId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 280,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowCompatabilityColumns(),
        fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitCompatability();
}
//----Wards Order
    function ShowWardsOrderWardsOrderColumns() {
    var cols = [
    { targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "0%" },
    { targets: [1], data: "code", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [2], data: "quantity", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [3], data: "rdatetime", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [4], data: "tempname", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [5], data: "ComponentId", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [6], data: "type", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [7], data: "OrderNo", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [8], data: "demandqty", className: '', visible: false, searchable: true, width: "0%" }
    ];
    return cols;
}
    function ShowWardsOrder() {
    var Url = baseURL + "ShowList";
    //    var param = {
    //        Id: Id
    //    };

    $('#preloader').show();
    $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        //data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {
        },
        success: function (data) {
            $('#preloader').hide();
            BindSelected(data.list);
            $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
    function BindWardsOrder(data) {
    TblGridWardsOrder = $(TblGridWardsOrderId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 280,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowWardsOrderWardsOrderColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}
//----Quantity Available------------------------------------------------------------------------------------------------------------------------
    function ShowQuantityAvailableColumns() {
    var cols = [
    { targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "0%" },
    { targets: [1], data: "bagid", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [2], data: "UnitNo", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [3], data: "ddate", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [4], data: "ExpiryDate", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [5], data: "bloodname", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [6], data: "bloodid", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [7], data: "crossstate", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [8], data: "Cvolume", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [9], data: "BGroup", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [10], data: "BCode", className: 'ClassSelect2BGroup', visible: true, searchable: true, width: "0%" },
    { targets: [11], data: "IsExpired", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [12], data: "TempId", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [13], data: "BGId", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [14], data: "Status", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [15], data: "patbloodgroup", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [16], data: "UnitGroup", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [17], data: "ComponentId", className: '', visible: false, searchable: true, width: "0%" }
    ];
    return cols;
}
    function ShowQuantAvailRowCallBack() {
        var rc = function (nRow, aData) {
            var value = aData['crossstate'];
            var status = aData['Status'];
            //var bloodname = aData['bloodname'];
            //var BGroup = c.GetSelect2Text('#select2BGroup');
            var $nRow = $(nRow);
            if (value == 'True') { // CrossMatched
                //$nRow.css({ "background-color": "#e5b4fc" })
                $('td:eq(1)', nRow).css({ "background-color": "#e5b4fc" })
            }

            if (aData['IsExpired'] == 1) { // Near To Expired
                //$('td:eq(0)', nRow).addClass("btn-data-priority");
                $('td:eq(0)', nRow).css({ "background-color": "#02b230" })
            }
            if (status == 3) { // IncompatibleUnit
                $nRow.css({ "background-color": "#c9c9c9" })
            }


            //if (bloodname !== BGroup) { // Incompatible Unit
            //    $nRow.css({ "background-color": "#c9c9c9" })
            //    //$('# *').prop('disabled', true);
            //}

            //if (aData['bloodid'] == 1) { // Incompatible Unit
            //    //$('td:eq(0)', nRow).addClass("btn-data-priority");
            //    $('td:eq(0)', nRow).css({ "background-color": "#02b230" })
            //}
            //else if (value == 7) { // Sample Acknowledge
            //    $nRow.css({ "background-color": "#ffffd9" })
            //}
            //else if (value == 1) { // Crossmatched/Reserved
            //    $nRow.css({ "background-color": "#b7f5ff" })
            //    //$('# *').prop('disabled', true);
            //}
            //else if (value == 3) { // Incompatible unit(s) order
            //    $nRow.css({ "background-color": "#d3d3d2" })
            //}
            //else if (value == 10) { // Unreserved Units
            //    $nRow.css({ "background-color": "#ffffff" })
            //}

            //if (aData['reqtype'] == 1) { // Stat Request Type
            //    //$('td:eq(0)', nRow).addClass("btn-data-priority");
            //    $('td:eq(0)', nRow).css({ "background-color": "#02b230" })
            //}


        };
        return rc;
    }
    function ShowQuantityAvailable(OrderNo, ComponentId, BGroup) {
        var Url = baseURL + "ShowIssueQuantity";
        var param = {
            OrderNo: OrderNo,
            ComponentId: ComponentId,
            BGroup: BGroup,
        };

        $('#preloader').show();
        $("#grid").css("visibility", "hidden");

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
                //if (TblGridCrossMatchType.rows('.selected').data().length == 0) {
                //    c.MessageBoxErr("Empty...", "No Bags Reserved.", null);
                //    return;
                //}


                BindQuantityAvailable(data.list);
                $("#grid").css("visibility", "visible");
            },
            error: function (xhr, desc, err) {
                $('#preloader').hide();
                var errMsg = err + "<br>" + desc;
                c.MessageBoxErr(errMsg);
            }
        });

    }
    function BindQuantityAvailable(data) {
        TblGridQuantityAvailable = $(TblGridQuantityAvailableId).DataTable({
            cache: false,
            destroy: true,
            data: data,
            paging: false,
            ordering: false,
            searching: false,
            info: false,
            scrollY: 280,
            //scrollX: true,
            processing: false,
            autoWidth: false,
            dom: 'Rlfrtip',
            scrollCollapse: false,
            pageLength: 150,
            lengthChange: false,
            columns: ShowQuantityAvailableColumns(),
            fnRowCallback: ShowQuantAvailRowCallBack()
        });

        InitSelectedBGroup();
    }
    function SetupSelectedBGroup() {

        $.editable.addInputType('select2BGroup', {
            element: function (settings, original) {
                var input = $('<input id="txt2BGroup" style="width:100%; height:30px;" type="text" class="form-control">');
                $(this).append(input);

                return (input);
            },
            plugin: function (settings, original) {
                var select2 = $(this).find('#txt2BGroup').select2({
                    minimumInputLength: 0,
                    allowClear: true,
                    ajax: {
                        cache: false,
                        quietMillis: 150,
                        url: baseURL + 'Select2BGroup',
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
                    $("#txt2BGroup").closest('td').get(0).reset();
                }).on('select2-close', function () {
                    if (Select2IsClicked) { $("#txt2BGroup").closest('form').submit(); }
                    else { $("#txt2BGroup").closest('td').get(0).reset(); }
                    Select2IsClicked = false;
                }).on("select2-focus", function (e) {
                    var a = $(this).closest('tr').find('#txt2BGroup').val();
                    $("#txt2BGroup").select2("data", { id: a, text: a });
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
                if ($("#txt2BGroup", this).select2('val') != null && $("#txt2BGroup", this).select2('val') != '') {
                    $("input", this).val($("#txt2BGroup", this).select2("data").text);

                    var rowIndex = TblGridQuantityAvailable.row($(this).closest('tr')).index();
                    var id = $("#txt2BGroup", this).select2('data').id;
                    TblGridQuantityAvailable.cell(rowIndex, 13).data(id);
                   
                }
            }
        });

    }
    function InitSelectedBGroup() {
        $('.ClassSelect2BGroup', TblGridQuantityAvailable.rows().nodes()).editable(function (sVal, settings) {
            var cell = TblGridQuantityAvailable.cell($(this).closest('td')).index();
            /*to Get ID*/
            //   var id = c.GetSelect2Id('#select2Relationship');
            //   tblFamilyDetails.cell(cell.row, 0).data(id);
            TblGridQuantityAvailable.cell(cell.row, cell.column).data(sVal);
            return sVal;
        },
        {
            "type": 'select2BGroup', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
            "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
        });



    }

    ///----------IssueingQuantity--------------------------------------------------------------------------------------------------------------------------
    function ShowIssueingQuantityColumns() {
        var cols = [
        { targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "0%" },
        { targets: [1], data: "UnitNo", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [2], data: "BGroup", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [3], data: "IssueCode", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [4], data: "bagid", className: '', visible: false, searchable: true, width: "0%" },
        { targets: [5], data: "ddate", className: '', visible: false, searchable: true, width: "0%" },
        { targets: [6], data: "ExpiryDate", className: '', visible: false, searchable: true, width: "0%" },
        { targets: [7], data: "bloodname", className: '', visible: false, searchable: true, width: "0%" },
        { targets: [8], data: "bloodid", className: '', visible: false, searchable: true, width: "0%" },
        { targets: [9], data: "crossstate", className: '', visible: false, searchable: true, width: "0%" },
        { targets: [10], data: "Cvolume", className: '', visible: false, searchable: true, width: "0%" },
        //{ targets: [11], data: "BCode", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [11], data: "IsExpired", className: '', visible: false, searchable: true, width: "0%" },
        { targets: [12], data: "TempId", className: '', visible: false, searchable: true, width: "0%" },
        { targets: [13], data: "BGId", className: '', visible: false, searchable: true, width: "0%" },
        { targets: [14], data: "Status", className: '', visible: false, searchable: true, width: "0%" },
        { targets: [15], data: "patbloodgroup", className: '', visible: false, searchable: true, width: "0%" },
        { targets: [16], data: "UnitGroup", className: '', visible: false, searchable: true, width: "0%" },
        { targets: [17], data: "ComponentId", className: '', visible: false, searchable: true, width: "0%" }

        ];
        return cols;
    }
    function ShowIssueingQuantity() {
        var Url = baseURL + "ShowList";
        //    var param = {
        //        Id: Id
        //    };

        $('#preloader').show();
        $("#grid").css("visibility", "hidden");

        $.ajax({
            url: Url,
            //data: param,
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            beforeSend: function () {
            },
            success: function (data) {
                $('#preloader').hide();
                BindSelected(data.list);
                $("#grid").css("visibility", "visible");
            },
            error: function (xhr, desc, err) {
                $('#preloader').hide();
                var errMsg = err + "<br>" + desc;
                c.MessageBoxErr(errMsg);
            }
        });

    }
    function BindIssueingQuantity(data) {
        //TblGridIssueingQuantity = $(TblGridIssueingQuantityId).DataTable({
        //    data: data,
        //    cache: false,
        //    destroy: true,
        //    paging: false,
        //    searching: false,
        //    ordering: false,
        //    info: false,
        //    columns: ShowIssueingQuantityColumns(),
        //    bAutoWidth: false,
        //    scrollY: 280,
        //    scrollX: true,
        //    //fnRowCallback: ShowListRowCallBack(),
        //    iDisplayLength: 25
        //});
        TblGridIssueingQuantity = $(TblGridIssueingQuantityId).DataTable({
            cache: false,
            destroy: true,
            data: data,
            paging: false,
            ordering: false,
            searching: false,
            info: false,
            scrollY: 280,
            //scrollX: true,
            processing: false,
            autoWidth: false,
            dom: 'Rlfrtip',
            scrollCollapse: false,
            pageLength: 150,
            lengthChange: false,
            columns: ShowIssueingQuantityColumns()
            //fnRowCallback: ShowListRowCallBack()
        });

        //InitSelected();
    }
    function ShowPrevResultsColumns() {
        var cols = [
        { targets: [0], data: "result", className: '', visible: true, searchable: false, width: "4%" },
        { targets: [1], data: "Name", className: '', visible: true, searchable: true, width: "43%" },
        { targets: [2], data: "result", className: '', visible: true, searchable: true, width: "43%" }
        ];
        return cols;
    }
    function ShowPrevResults() {
        var Url = baseURL + "ShowList";
        //    var param = {
        //        Id: Id
        //    };

        $('#preloader').show();
        $("#grid").css("visibility", "hidden");

        $.ajax({
            url: Url,
            //data: param,
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            beforeSend: function () {
            },
            success: function (data) {
                $('#preloader').hide();
                BindSelected(data.list);
                $("#grid").css("visibility", "visible");
            },
            error: function (xhr, desc, err) {
                $('#preloader').hide();
                var errMsg = err + "<br>" + desc;
                c.MessageBoxErr(errMsg);
            }
        });

    }
    function BindPrevResults(data) {
        //TblGridPrevResults = $(TblGridPrevResultsId).DataTable({
        //    data: data,
        //    cache: false,
        //    destroy: true,
        //    paging: false,
        //    searching: false,
        //    ordering: false,
        //    info: false,
        //    columns: ShowPrevResultsColumns(),
        //    bAutoWidth: false,
        //    scrollY: 280,
        //    scrollX: true,
        //    //fnRowCallback: ShowListRowCallBack(),
        //    iDisplayLength: 25
        //});
        TblGridPrevResults = $(TblGridPrevResultsId).DataTable({
            cache: false,
            destroy: true,
            data: data,
            paging: false,
            ordering: false,
            searching: false,
            info: false,
            scrollY: 280,
            //scrollX: true,
            processing: false,
            autoWidth: false,
            dom: 'Rlfrtip',
            scrollCollapse: false,
            pageLength: 150,
            lengthChange: false,
            columns: ShowPrevResultsColumns()
            //fnRowCallback: ShowListRowCallBack()
        });

        //InitSelected();
        c.ReSequenceDataTable(TblGridPrevResultsId, 0);
    }

    function RecountList() {
        // c.SetBadgeText('#badgeDrug', $(TblGridDrugListId).DataTable().rows().nodes().length);
    }
///----------Reports--------------------------------------------

    function setCookie(name, value, days) {
        var expires;

        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            expires = "; expires=" + date.toGMTString();
        } else {
            expires = "";
        }
        //document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
        document.cookie = name + "=" + value + expires + "; path=/";
    }

    function PrintPreview() {
        $('#loadingpdf').show();

        var filter = [{

            OrderNo: $('#txtSlNo').val(),
            IPID: $('#Ipid').val()
            //RequestedId: c.GetValue('#RequestedId'),
            //FromDate: c.GetDateTimePickerDate('#dtFrom'),
            //ToDate: c.GetDateTimePickerDate('#dtTo')
        }];
        var filterfy = JSON.stringify(filter);
        setCookie('Filterfy', filterfy, 365);

        var url = $("#url").data("printpreview");
        var content = '<iframe id="MyIFRAME" src="' + url + '" width="100%"  height="100%" frameborder="0" style="overflow-x:"></iframe>';
        //var content = '<object id="MyIFRAME" data="' + url + '" type="application/pdf" width="100%" height="100%" ></object>';

        $('#PreviewInPDF').empty();
        $('#PreviewInPDF').append(content);

        $('#MyIFRAME').unbind('load');
        $('#MyIFRAME').load(function () {
            $('#loadingpdf').hide();
        });

    }

    function PrintPreview1() {
        $('#loadingpdf').show();

        var filter = [{

            OrderNo: $('#txtSlNo').val(),
            IPID: $('#Ipid').val()
            //RequestedId: c.GetValue('#RequestedId'),
            //FromDate: c.GetDateTimePickerDate('#dtFrom'),
            //ToDate: c.GetDateTimePickerDate('#dtTo')
        }];
        var filterfy = JSON.stringify(filter);
        setCookie('Filterfy', filterfy, 365);

        var url = $("#url").data("printpreviews");
        var content = '<iframe id="MyIFRAME" src="' + url + '" width="100%"  height="100%" frameborder="0" style="overflow-x:"></iframe>';
        //var content = '<object id="MyIFRAME" data="' + url + '" type="application/pdf" width="100%" height="100%" ></object>';

        $('#PreviewInPDF').empty();
        $('#PreviewInPDF').append(content);

        $('#MyIFRAME').unbind('load');
        $('#MyIFRAME').load(function () {
            $('#loadingpdf').hide();
        });

    }

///--------------------------------------------------------------------

    function ShowReservedExtendColumns() {
        var cols = [
        { targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "0%" },
        { targets: [2], data: "UnitNo", className: '', visible: true, searchable: true, width: "0%"},
        { targets: [3], data: "BGroup", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [4], data: "IssueCode", className: '', visible: true, searchable: true, width: "0%" }
      
        ];
        return cols;
    }
    function ShowReserevedExtendRowCallBack() {
        var rc = function (nRow, aData) {
            //var value = aData['crossstate'];
            //var status = aData['Status'];
            //var bloodname = aData['bloodname'];
            //var BGroup = c.GetSelect2Text('#select2BGroup');
            //var $nRow = $(nRow);
            //if (value == 'True') { // CrossMatched
            //    //$nRow.css({ "background-color": "#e5b4fc" })
            //    $('td:eq(1)', nRow).css({ "background-color": "#e5b4fc" })
            //}

            //if (aData['IsExpired'] == 1) { // Near To Expired
            //    //$('td:eq(0)', nRow).addClass("btn-data-priority");
            //    $('td:eq(0)', nRow).css({ "background-color": "#02b230" })
            //}
            //if (status == 3) { // IncompatibleUnit
            //    $nRow.css({ "background-color": "#c9c9c9" })
            //}


            //if (bloodname !== BGroup) { // Incompatible Unit
            //    $nRow.css({ "background-color": "#c9c9c9" })
            //    //$('# *').prop('disabled', true);
            //}

            //if (aData['bloodid'] == 1) { // Incompatible Unit
            //    //$('td:eq(0)', nRow).addClass("btn-data-priority");
            //    $('td:eq(0)', nRow).css({ "background-color": "#02b230" })
            //}
            //else if (value == 7) { // Sample Acknowledge
            //    $nRow.css({ "background-color": "#ffffd9" })
            //}
            //else if (value == 1) { // Crossmatched/Reserved
            //    $nRow.css({ "background-color": "#b7f5ff" })
            //    //$('# *').prop('disabled', true);
            //}
            //else if (value == 3) { // Incompatible unit(s) order
            //    $nRow.css({ "background-color": "#d3d3d2" })
            //}
            //else if (value == 10) { // Unreserved Units
            //    $nRow.css({ "background-color": "#ffffff" })
            //}

            //if (aData['reqtype'] == 1) { // Stat Request Type
            //    //$('td:eq(0)', nRow).addClass("btn-data-priority");
            //    $('td:eq(0)', nRow).css({ "background-color": "#02b230" })
            //}


        };
        return rc;
    }
    function ShowReserevedExtend(Id) {
        var Url = baseURL + "ShowCrossReservedExtend";
        var param = {
            Id: Id,
        };

        $('#preloader').show();
        $("#grid").css("visibility", "hidden");

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
                //if (TblGridCrossMatchType.rows('.selected').data().length == 0) {
                //    c.MessageBoxErr("Empty...", "No Bags Reserved.", null);
                //    return;
                //}


                BindReserevedExten(data.list);
                $("#grid").css("visibility", "visible");
            },
            error: function (xhr, desc, err) {
                $('#preloader').hide();
                var errMsg = err + "<br>" + desc;
                c.MessageBoxErr(errMsg);
            }
        });

    }
    function BindReserevedExten(data) {
        TblGridReservedExtend = $(TblGridReservedExtendId).DataTable({
            cache: false,
            destroy: true,
            data: data,
            paging: false,
            ordering: false,
            searching: false,
            info: false,
            scrollY: 280,
            //scrollX: true,
            processing: false,
            autoWidth: false,
            dom: 'Rlfrtip',
            scrollCollapse: false,
            pageLength: 150,
            lengthChange: false,
            columns: ShowReservedExtendColumns(),
            fnRowCallback: ShowReserevedExtendRowCallBack()
        });

        //InitSelectedBGroup();
    }