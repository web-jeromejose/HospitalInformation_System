var c = new Common();
var Action = -1;

var gridListIssuesIP;
var gridListIssuesIPId = "#gridListIssuesIP";
var gridListIssuesIPDataRow;

var TblGridQuantityAvailable;
var TblGridQuantityAvailableId = "#gridQuantityAvailable";
var TblGridQuantityAvailableDataRow;


var TblGridCrossMatchAvail;
var TblGridCrossMatchAvailId = "#gridAvailableCrossMatch";
var TblGridCrossMatchAvailDataRow;

var tblReplacementDonor;
var tblReplacementDonorId = "#gridReplacementDonor";
var tblReplacementDonorDataRow;

var TblGridWardsOrder;
var TblGridWardsOrderId = "#gridWardsOrder";
var TblGridWardsOrderDataRow;



var TblGridIssueingQuantity;
var TblGridIssueingQuantityId = "#gridIssueingQuantity";
var TblGridIssueingQuantityDataRow;

var TblGridPrevResults;
var TblGridPrevResultsId = "#gridPrevResults";
var TblGridPrevResultsDataRow;

//var OrderNo;
//var IPID;


$(document).ready(function () {

    c.SetTitle("Issue - IP");
    c.DefaultSettings();
   
    //SetupDataTables();
    //SetupDataTables
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

    var Option = c.GetSelect2Id('#Select2Option');
    IssueIPList(Option);
    //DefaultDisable();
    //DefaultReadOnly();
   

    //HandleEnableButtons();
    //HandleEnableEntries();

    BindIssueIPTbl([]);
    //BindCrossMatchType([]);
    BindReplacementDonor([]);
    BindWardsOrder([]);
    BindIssueingBag([]);
    BindAvailCrossMatchBag([]);
    

    //ShowList();
    ////ShowSearch();

    //c.ResizeDiv('#reportBorder', reportHeight);
    GoOnTop();
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


$(document).on("click", gridListIssuesIPId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        //tr.toggleClass('selected');

        // Single selection
        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected')

        gridListIssuesIPDataRow = gridListIssuesIP.row($(this).parents('tr')).data();

    }
});
$(document).on("click", TblGridCrossMatchAvailId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        //tr.toggleClass('selected');

        // Single selection
        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected')

        TblGridCrossMatchAvailDataRow = TblGridCrossMatchAvail.row($(this).parents('tr')).data();
        add_CrossMatchAvailable(this);
        remove_SelectedAvailQuantity(this);
    }
});
$(document).on("click", tblReplacementDonorId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        //tr.toggleClass('selected');

        // Single selection
        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected')

        tblReplacementDonorDataRow = tblReplacementDonor.row($(this).parents('tr')).data();

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
        //tr.toggleClass('selected');

        // Single selection
        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected')

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

        var Status = gridListIssuesIPDataRow.Status;
        if (Status == 1) {
            c.MessageBoxErr("Issued...", "Blood Already Issued.", null);
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
$(document).on("dblclick", gridListIssuesIPId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        gridListIssuesIPDataRow = gridListIssuesIP.row($(this).parents('tr')).data();
      
        var OrderNo = gridListIssuesIPDataRow.orderno;
        var IPID = gridListIssuesIPDataRow.IPID;
        var Status = gridListIssuesIPDataRow.Status;

        console.log('Status');
        console.log(Status);
        if (Status == 0 || Status == 3) { //0=white 1 - green 3 = partial
            Action = 1
        } else {
            Action = 2
        }
        console.log('Action');
        console.log(Action);
        View(OrderNo, IPID);
        c.DisableSelect2('#Select2Option', true);
        HandleEnableButtons();
       

        //$('#btnView').click();
    }
});
$(document).on("dblclick", TblGridWardsOrderId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        TblGridWardsOrderDataRow = TblGridWardsOrder.row($(this).parents('tr')).data();
        
        var OrderNo = gridListIssuesIPDataRow.orderno;
        var IPID = gridListIssuesIPDataRow.IPID;
        console.log(TblGridWardsOrderDataRow);
        console.log(gridListIssuesIPDataRow);
        //if (TblGridQuantityAvailable.rows('.selected').data().length == 0) {
        //             c.MessageBoxErr("Empty...", "No Bags Reserved.", null);
        //             return;
        //         }
        //else {  
            ShowAvaiCrossMatchFetch(OrderNo, IPID);
        //}
       //var Status = gridListIssuesIPDataRow.Status;
       // if (Status == 0) {
       //     Action = 1
       //     if (TblGridCrossMatchAvail.rows('.selected').data().length == 0) {
       //         c.MessageBoxErr("Empty...", "No Bags Reserved.", null);
       //         return;
       //     }
       // } else {
       //     Action = -1
       // }


 
     


        //$('#btnView').click();
    }
});

function add_CrossMatchAvailable(cell) {
    rowIndex = TblGridCrossMatchAvail.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    $.each(TblGridCrossMatchAvail.rows().data(), function (i, re) {
        if (TblGridCrossMatchAvail.cell(i, 0).data() == TblGridIssueingQuantity.cell(rowIndex, 0).data()) {
            $ex = 1;
        }
    });
    if ($ex == 0) {
        TblGridIssueingQuantity.row.add({
            UnitNo: TblGridCrossMatchAvail.cell(rowIndex, 0).data(),
            bloodgroup: TblGridCrossMatchAvail.cell(rowIndex, 1).data(),
            Expirydate: TblGridCrossMatchAvail.cell(rowIndex, 2).data(),
            ID: TblGridCrossMatchAvail.cell(rowIndex, 3).data(),
            componentid: TblGridCrossMatchAvail.cell(rowIndex, 4).data(),
            bagId: TblGridCrossMatchAvail.cell(rowIndex, 5).data(),
            replacementcount: TblGridCrossMatchAvail.cell(rowIndex, 6).data(),
            Qty: TblGridCrossMatchAvail.cell(rowIndex, 7).data(),
            IssueCode: TblGridCrossMatchAvail.cell(rowIndex, 8).data(),
            bloodgroupId: TblGridCrossMatchAvail.cell(rowIndex, 9).data(),
            ComponentTypeId: TblGridCrossMatchAvail.cell(rowIndex, 10).data(),
            transtype: TblGridCrossMatchAvail.cell(rowIndex, 11).data(),
            patbloodgroup: TblGridCrossMatchAvail.cell(rowIndex, 12).data(),
        }).draw();
    }
}
function remove_SelectedAvailQuantity(cell) {
    rowV = $(cell).parents('tr');
    TblGridCrossMatchAvail.row(rowV).remove().draw();

}

function add_IssueingQuantity(cell) {
    rowIndex = TblGridIssueingQuantity.cell(cell).index().row;
    //rowIndex = TblGridIssueingQuantity.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    $.each(TblGridIssueingQuantity.rows().data(), function (i, re) {
        if (TblGridIssueingQuantity.cell(i, 0).data() == TblGridCrossMatchAvail.cell(rowIndex, 0).data()) {
            $ex = 1;
        }
    });
    if ($ex == 0) {
        TblGridCrossMatchAvail.row.add({
            UnitNo: TblGridIssueingQuantity.cell(rowIndex, 0).data(),
            bloodgroup: TblGridIssueingQuantity.cell(rowIndex, 1).data(),
            Expirydate: TblGridIssueingQuantity.cell(rowIndex, 2).data(),
            ID: TblGridIssueingQuantity.cell(rowIndex, 3).data(),
            componentid: TblGridIssueingQuantity.cell(rowIndex, 4).data(),
            bagId: TblGridIssueingQuantity.cell(rowIndex, 5).data(),
            replacementcount: TblGridIssueingQuantity.cell(rowIndex, 6).data(),
            Qty: TblGridIssueingQuantity.cell(rowIndex, 7).data(),
            IssueCode: TblGridIssueingQuantity.cell(rowIndex, 8).data(),
            bloodgroupId: TblGridIssueingQuantity.cell(rowIndex, 9).data(),
            ComponentTypeId: TblGridIssueingQuantity.cell(rowIndex, 10).data(),
            transtype: TblGridIssueingQuantity.cell(rowIndex, 11).data(),
            patbloodgroup: TblGridIssueingQuantity.cell(rowIndex, 12).data(),
        }).draw();
    }
}
function remove_SelectedissuengQuantity(cell) {
    rowV = $(cell).parents('tr');
    //if (TblGridListDataRow.status !== 1) {
        TblGridIssueingQuantity.row(rowV).remove().draw();
    //}

}

function Refresh() {
    ShowList();
    c.DisableSelect2('#Select2Option', false);
}

function InitButton() {
    $('#btnRefresh').click(function () {
        location.reload();
        //$('#loadingpdf').show();
        //var Option = 1;
        //IssueIPList(Option);
        //c.DisableSelect2('#Select2Option', false);
    });
    $('#btnFilter').click(function () {
        c.ModalShow('#modalFilter', true);
    });
    $('#btnView').click(function () {

        if (gridListIssuesIP.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }
     
        Action = 2;
        //View(gridListIssuesIPDataRow.orderno);
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
        Action = -1;
        c.ModalShow('#modalFilter', false);
    });
    $('#btnViewFilter').click(function () {
        var ID = c.GetSelect2Id('#select2EmployeeIDFilter');
        
        if (!isChecked && ID.length == 0) {
            c.MessageBoxErr("Required...", "Please select an employee.");
            return;
        }

        ShowList();
        c.ModalShow('#modalFilter', false);

    });

    $('#btnClose').click(function () {

        Action = -1;
        HandleEnableButtons();
        HandleEnableEntries();
        RedrawGrid();
        c.DisableSelect2('#Select2Option', false);
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
        var Status = gridListIssuesIPDataRow.Status;

        if (Status == 1) {

            $('#myModal').modal('show');
            PrintPreview();
        
        } else {
            c.MessageBoxErr('Not Issued...', 'No Blood Issue');
            return;
        }

       
    });
    $('#btnCloseReport').click(function () {
        c.ModalShow('#modalReport', false);
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
   

    //$('#select2BGroup').select2({
    //    //containerCssClass: "RequiredField",
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2CrossmatchIPBloodGroup',
    //        dataType: 'jsonp',
    //        cache: false,
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term
    //            };
    //        },
    //        results: function (data, page) {
    //            var more = (page * pageSize) < data.Total;
    //            return { results: data.Results, more: more };
    //        }
    //    }
    //}).change(function (e) {
    //    var list = e.added.list;

    //});


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

    $("#Select2Option").select2({
        data: [{ id: 1, text: 'Ward' }, { id: 2, text: 'OP CrossMatch Issues' }],
        minimumResultsForSearch: -1
    }).change(function (e) {
        //var list = e.added.list;
        var Option = c.GetSelect2Id('#Select2Option');
        IssueIPList(Option);
        //$('#AntiBodyScreeningCode').show();

        //if (e.val == 0) {
        //    $('#AntiBodyScreeningCode').removeClass('ColorCodeWhite');
        //    $('#AntiBodyScreeningCode').addClass('ColorCodeRed');
        //}
        //else {
        //    $('#AntiBodyScreeningCode').removeClass('ColorCodeRed');
        //    $('#AntiBodyScreeningCode').addClass('ColorCodeWhite');
        //}

    });


    $("#select2TypeofTransfusion").select2({
        data: [{ id: 0, text: 'Surgery' }, { id: 1, text: 'Therapeutics' }],
        minimumResultsForSearch: -1
    }).change(function (e) {
   
        //var list = e.added.list;

        //$('#AntiBodyScreeningCode').show();

        //if (e.val == 0) {
        //    $('#AntiBodyScreeningCode').removeClass('ColorCodeWhite');
        //    $('#AntiBodyScreeningCode').addClass('ColorCodeRed');
        //}
        //else {
        //    $('#AntiBodyScreeningCode').removeClass('ColorCodeRed');
        //    $('#AntiBodyScreeningCode').addClass('ColorCodeWhite');
        //}

    });

    $('#select2Ward').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Station',
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
    
    $('#select2IssuedBy').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'SelectIssuedByRepository',
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
    //$('#dtDateTime').datetimepicker({
    //    pickTime: false
    //}).on("dp.change", function (e) {

    //});
}
function InitDataTables() {
    //BindSequence([]);
    BindIssueIPTbl([]);

}
function SetupDataTables() {
    // SetupSequence();
    // SetupCompatability();
}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (gridListIssuesIP !== undefined) gridListIssuesIP.columns.adjust().draw();
    if (TblGridCrossMatchAvail !== undefined) TblGridCrossMatchAvail.columns.adjust().draw();
    if (tblReplacementDonor !== undefined) tblReplacementDonor.columns.adjust().draw();
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
    c.ReadOnly('#dtDateTime', true);
    c.ReadOnly('#txtBGroup', true);
    c.ReadOnly('#txtOtherAllergies', true);
    
}
function DefaultValues() {
    c.SetSelect2('#Select2Option', '1', 'Ward');



    //    c.SetDateTimePicker('#dtSurgeryDate', moment());
    //    c.SetDateTimePicker('#dtSurgeryDate', moment());
    
}
function DefaultDisable() {

    //c.DisableDateTimePicker('#dtDateTime', true);
    //c.DisableSelect2('#select2BGroup', true);
    c.DisableSelect2('#select2FAllergy', true);
    c.DisableSelect2('#select2DAllergy', true);

    c.iCheckDisable('#iChkTransfusion', true);
    c.iCheckDisable('#iChkMiscarriage', true);
    c.iCheckDisable('#iChkStillBirth', true);
    c.iCheckDisable('#iChkReaction', true);
    c.iCheckDisable('#iChkPregnancies', true);
    c.iCheckDisable('#iChkErythroblastosis', true);

}
function DefaultEmpty() {
    c.SetValue('#Id', '');
    c.ClearAllText();

    //c.Select2Clear('#select2Appraiser');

    //BindCrossMatchType([]);
    //BindCompatability([]);
    BindWardsOrder([]);
    BindAvailCrossMatchBag([]);
    BindIssueingBag([]);
    BindReplacementDonor([]);
}

function Validated() {
    var req = false;

    //req = c.IsEmptyById('#txtPosition');
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Position is required');
    //    return false;
    //}
    //req = c.IsEmptySelect2('#select2Appraiser');
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Appraiser is required');
    //    return false;
    //}


    //var IsEmpty = $(TblGridSelectedId).DataTable().rows().nodes().length == 0;
    //if (IsEmpty) {
    //    c.MessageBoxErr('Empty...', 'The list should not be empty.');
    //    return false;
    //}

    //var ctr = 1;
    //var required = '';
    //$.each(TblGridSelected.rows().data(), function (i, row) {
    //    if (!$.isNumeric(row.Qty) || row.Qty < 1) {
    //        required = required + ctr + '.  Enter a valid quantity for row ' + row.ctr + '<br>';
    //        ctr++;
    //    }
    //});
    //if (required.length > 0) {
    //    c.MessageBoxErr('Required...', required);
    //    return false;
    //}


    return true;
}
function HandleEnableButtons() {
    // VAED //0=white 1 - green 3 = partial
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

//-------------------Dashboard------------------------------------------------------------------------------------------------------------
// Sample usage
// BindDashboard([]);
/*[RenderTable]*/
function BindIssueIPTbl(data) {
    gridListIssuesIP = $(gridListIssuesIPId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 350,
        scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        fnRowCallback: ShowIssueIPRowCallBack(),
        columns: ShowIssueIP()
    });


}

function ShowIssueIPRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['Status'];
        var $nRow = $(nRow);

        //WardDemand
        if (value == 0) {
            $nRow.css({ "background-color": "white" })
        }
        //ISSUED
       else if (value == 1) {
            $nRow.css({ "background-color": "#d7ffea" })
       }
       //Partial Issues
       else if (value == 3) {
           $nRow.css({ "background-color": "#f5b044" })
       }

    };
    return rc;

}

function ShowIssueIP() {
    var cols = [
    { targets: [0], data: "orderno", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [1], data: "odatetime", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [2], data: "PIN", className: '', visible: true, searchable: false, width: "10%" },
    { targets: [3], data: "Bed", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [4], data: "Patientname", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [5], data: "operatorname", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [6], data: "Status", className: '', visible: false, searchable: true, width: "10%" },
    { targets: [7], data: "RegNo", className: '', visible: false, searchable: true, width: "10%" },
    { targets: [8], data: "IPID", className: '', visible: false, searchable: true, width: "10%" },
    { targets: [9], data: "AuthorityCode", className: '', visible: false, searchable: true, width: "5%" },
    { targets: [10], data: "id", className: '', visible: false, searchable: true, width: "5%" },
    { targets: [11], data: "boperatorid", className: '', visible: false, searchable: true, width: "5%" }
    ];
    return cols;
}

function IssueIPList(Option) {
   
   var Url = $('#url').data("getissues");
    //var Url = baseURL + "IssueIPDashboard";
    var param = {
        Option: Option
        
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
            BindIssueIPTbl(data.list);
            //  $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = xhr.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}


//-------------------Replacement Donor------------------------------------------------------------------------------------------------------------
function BindReplacementDonor(data) {

    tblReplacementDonor = $(tblReplacementDonorId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 150,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowReplacementColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowReplacementColumns() {
    var cols = [
    { targets: [0], data: "Issued", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [1], data: "Donated", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [2], data: "DonorRegistrationNO", className: '', visible: false, searchable: true, width: "0%" }
    ];
    return cols;
}

//-------------------Ward Demand Orders------------------------------------------------------------------------------------------------------------
function BindWardsOrder(data) {

    TblGridWardsOrder = $(TblGridWardsOrderId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 200,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowWardsOrderColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowWardsOrderColumns() {
    var cols = [
    { targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "0%" },
    { targets: [1], data: "Name", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [2], data: "TempName", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [3], data: "BloodOrderID", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [4], data: "Quantity", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [5], data: "OQty", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [6], data: "ComponentID", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [7], data: "ID", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [8], data: "Type", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [9], data: "replacementcount", className: '', visible: false, searchable: true, width: "0%" }
    ];
    return cols;
}

//-------------------Issue Bag------------------------------------------------------------------------------------------------------------
function BindIssueingBag(data) {

    TblGridIssueingQuantity = $(TblGridIssueingQuantityId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 200,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowIssueBagColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowIssueBagColumns() {
    var cols = [
    //{ targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "0%" },
    { targets: [0], data: "UnitNo", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [1], data: "bloodgroup", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [2], data: "Expirydate", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [3], data: "ID", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [4], data: "componentid", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [5], data: "bagId", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [6], data: "replacementcount", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [7], data: "Qty", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [8], data: "IssueCode", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [9], data: "bloodgroupId", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [10], data: "ComponentTypeId", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [11], data: "transtype", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [12], data: "patbloodgroup", className: '', visible: false, searchable: true, width: "0%" }
    ];
    return cols;
}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-------------------Avail CrossMatch Bag------------------------------------------------------------------------------------------------------------

function BindAvailCrossMatchBag(data) {

    TblGridCrossMatchAvail = $(TblGridCrossMatchAvailId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 200,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowAvaiCrossMatchbagColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowAvaiCrossMatchbagColumns() {
    var cols = [
    //{ targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "0%" },
      { targets: [0], data: "UnitNo", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [1], data: "bloodgroup", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [2], data: "Expirydate", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [3], data: "ID", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [4], data: "componentid", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [5], data: "bagId", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [6], data: "replacementcount", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [7], data: "Qty", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [8], data: "IssueCode", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [9], data: "bloodgroupId", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [10], data: "ComponentTypeId", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [11], data: "transtype", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [12], data: "patbloodgroup", className: '', visible: false, searchable: true, width: "0%" }
    ];
    return cols;
}

function ShowAvaiCrossMatchFetch(OrderNo, IPID) {
    var Url = baseURL + "ShowIssueAvailCrossMatch";
    var param = {
        OrderNo: OrderNo,
        IPID: IPID,
       
    };

    $('#preloader').show();
    //$("#grid").css("visibility", "hidden");

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
            //if (TblGridCrossMatchAvail.rows('.selected').data().length == 0) {
            //    c.MessageBoxErr("Empty...", "No Bags Reserved.", null);
            //    return;
            //}
            BindAvailCrossMatchBag(data.list);
            //$("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function View(OrderNo, IPID) {
    Url = baseURL + "ShowSelected";
    param = {
        OrderNo: OrderNo,
        IPID: IPID
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

            if (result.list.length == 0) {
                Action = 1;
                HandleEnableButtons();
                HandleEnableEntries();
                RedrawGrid();
                return;
            }

            Action = 0;

            var data = result.list;

            DefaultEmpty();

            //c.SetValue('#Id', Id);
            c.SetValue('#OrderNo', data[0].orderno);
            c.SetValue('#IPID', data[0].IPID);
            c.SetValue('#dtDateTime', data[0].odatetime);
            c.SetValue('#txtPIN', data[0].PIN);
            c.SetValue('#txtName', data[0].Patientname);
            c.SetValue('#txtSlNo', data[0].orderno);
            c.SetValue('#txtBedNo', data[0].bedid);
            c.SetValue('#txtBGroup', data[0].BloodGroup);
            c.SetValue('#txtAge', data[0].Age);
            c.SetValue('#txtSex', data[0].SexName);
            c.SetValue('#txtDoctor', data[0].DoctorName);
            c.SetValue('#DoctorId', data[0].DoctorId);
            c.SetValue('#txtWard', data[0].Ward);
            c.SetValue('#txtCollectedBy', data[0].CollectedBy);
            c.SetValue('#txtOtherAllergies', data[0].OtherAllergies);
            c.SetValue('#bedid', data[0].bedid);
            var wbc = data[0].wbc == 0 ? '-' : data[0].wbc;
            c.SetValue('#txtWBC', wbc);
            var rbc = data[0].rbc == 0 ? '-' : data[0].rbc;
            c.SetValue('#txtHCT', rbc);
            var hb = data[0].hb == 0 ? '-' : data[0].hb;
            c.SetValue('#txtRBC', hb);
            var pcv = data[0].pcv == 0 ? '-' : data[0].pcv;
            c.SetValue('#txtPlatelets', pcv);
            var platelet = data[0].platelet == 0 ? '-' : data[0].platelet;
            c.SetValue('#txtHb', platelet);
            var others = data[0].others == 0 ? '-' : data[0].others;
            c.SetValue('#txtOthers', others);
            var PTTK = data[0].PTTK == 0 ? '-' : data[0].PTTK;
            c.SetValue('#txtPT', PTTK);
            c.SetValue('#txtPTTK', PTTK);

            c.SetValue('#txtClinicalDiagnosis', data[0].clinicaldetails);

            //Select2
            c.SetSelect2('#select2TypeofTransfusion', data[0].Transfusion, data[0].TransfusionName);
            c.SetSelect2('#select2Ward', data[0].StationId, data[0].Ward);
            var boperatorid = data[0].boperatorid == 0 ? 0 : data[0].boperatorid;
            var Issuedby = data[0].Issuedby == null ? '' : data[0].Issuedby;
            c.SetSelect2('#select2IssuedBy', boperatorid, Issuedby);



            BindWardsOrder(data[0].WardDemandOrderDetails);
            BindIssueingBag(data[0].IssueBagDetails);
            BindReplacementDonor(data[0].ReplacementDonor);

            //BindPrevResults(data[0].PreviousResult);

            HandleEnableButtons();
            HandleEnableEntries();
            RedrawGrid();

            //var AntiBodyId = data[0].AntiBody == null ? 100 : data[0].AntiBodyId;
            //var AntiBody = data[0].AntiBody == null ? '' : data[0].AntiBody;
            //c.SetSelect2('#select2AntiBodyScreening', AntiBodyId, AntiBody);

            //c.SetValue('')
            //c.SetValue('#txtPIN', data[0].PIN);
            //c.SetValue('#txtName', data[0].Patientname);
            //c.SetValue('#txtSlNo', data[0].OrderNo);
            //c.SetValue('#txtBedNo', data[0].Bed);
            //c.SetValue('#txtAge', data[0].Age);
            //c.SetValue('#txtSex', data[0].Gender);
            //c.SetValue('#txtDoctor', data[0].Doctor);
            //c.SetValue('#txtWard', data[0].Ward);

            //c.SetValue('#txtWBC', data[0].BloodOrder[0].wbc);
            //c.SetValue('#txtHCT', data[0].BloodOrder[0].pcv);
            //c.SetValue('#txtRBC', data[0].BloodOrder[0].rbc);
            //c.SetValue('#txtPlatelets', data[0].BloodOrder[0].platelet);
            //c.SetValue('#txtHb', data[0].BloodOrder[0].hb);
            //c.SetValue('#txtOthers', data[0].BloodOrder[0].others);
            //c.SetValue('#txtPT', data[0].BloodOrder[0].pt);
            //c.SetValue('#txtPTTK', data[0].BloodOrder[0].pttk);
            //c.SetValue('#txtClinicalDiagnosis', data[0].BloodOrder[0].clinicaldetails);
            //c.SetValue('#txtTransfusionType', data[0].TransfussionType);
            //c.SetValue('#txtRequestType', data[0].RequestType);
            //c.SetValue('#txtReplacement', data[0].Replacement);
            //c.SetValue('#txtRemarks', data[0].Remarks);

            //var AntiBodyId = data[0].AntiBody == null ? 100 : data[0].AntiBodyId;
            //var AntiBody = data[0].AntiBody == null ? '' : data[0].AntiBody;
            //c.SetSelect2('#select2AntiBodyScreening', AntiBodyId, AntiBody);

            //var BloodGroupId = data[0].BloodGroupName == null ? 100 : data[0].BloodGroupId;
            //var BloodGroupName = data[0].BloodGroupName == null ? '' : data[0].BloodGroupName;
            //c.SetSelect2('#select2BGroup', BloodGroupId, BloodGroupName);

            //c.SetSelect2('#select2CrossmatchedBy', data[0].CrossMatchedById, data[0].CrossMatchedByName);

            //$('#AntiBodyScreeningCode').removeClass('ColorCodeWhite');
            //$('#AntiBodyScreeningCode').removeClass('ColorCodeRed');
            //$('#AntiBodyScreeningCode').removeClass('ColorCodeYellow');
            //$('#RequestType').removeClass('ColorCodeWhite');
            //$('#RequestType').removeClass('ColorCodeRed');
            //$('#RequestType').removeClass('ColorCodeYellow');

            //$('#AntiBodyScreeningCode').hide();
            //$('#RequestType').hide();

            //if (data[0].AntiBodyId == 0 && data[0].BloodGroupName != null) {
            //    $('#AntiBodyScreeningCode').addClass('ColorCodeRed');
            //    $('#AntiBodyScreeningCode').show();
            //} else if (data[0].BloodGroupName != null) {
            //    $('#AntiBodyScreeningCode').addClass('ColorCodeWhite');
            //    $('#AntiBodyScreeningCode').show();
            //}

            //if (data[0].reqtype == 0) { //Routine
            //    $('#RequestType').addClass('ColorCodeYellow');
            //    $('#RequestType').show();
            //}
            //else if (data[0].reqtype == 1) { // Stat
            //    $('#RequestType').addClass('ColorCodeRed');
            //    $('#RequestType').show();
            //}

            //BindCrossMatchType(data[0].CrossmatchValue);
            //BindCompatability(data[0].CrossmatchCompatibiliy);
            //BindFindingsDetailsTbl(data.FetchFindingsDetails);
    

        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

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

        OrderNo: c.GetValue('#OrderNo'),
        IPID:  c.GetValue('#IPID')
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

function Save() {

    var ret = Validated();
    if (!ret) return ret;

    req = c.GetSelect2Text('#select2IssuedBy');
    if (req == '') {
        c.MessageBoxErr('Empty...', 'Please Select IssuedBy');
        return;
    }

    req = c.GetSelect2Text('#select2Ward');
    if (req == '') {
        c.MessageBoxErr('Empty...', 'Please Select Ward');
        return;
    }

    //if (TblGridIssueingQuantityDataRow.rows('.selected').data().length == 0) {
    //        c.MessageBoxErr("Empty...", "No BagIssued Selected.", null);
    //        return;
    //    }

    

    else {


        c.ButtonDisable('#btnSave', true);


        var entry;
        entry = []
        entry = {}
        entry.Action = 1;
        entry.IPID = $('#IPID').val();
        entry.BedID = $('#bedid').val();
        entry.StationID = $('#ListOfStation').val();
        entry.WardID = c.GetSelect2Id('#select2Ward')
        //entry.operatorid = $('#reqtype').val();
        entry.ReceivedBy = c.GetSelect2Id('#select2IssuedBy')
        entry.DoctorID = $('#DoctorId').val();
        entry.Remarks = $('#txtRemarks').val();
        var OrderNo = gridListIssuesIPDataRow.orderno;
        entry.DemandID = OrderNo; //note this a DemandId for BloodDemand Table
        entry.CollectedBy = $('#txtCollectedBy').val();
        entry.OrderNo = $('#txtSlNo').val();
 
        entry.IPIssuedSaveDetails = []
        $.each(TblGridIssueingQuantity.rows().data(), function (i, row) {
            //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
            entry.IPIssuedSaveDetails.push({
                BagNumber: row.UnitNo,
                ComponentID: row.componentid,
                VolumeIssued: row.Qty,
                CrossID: row.ComponentTypeId,
                ExpiryDate: row.Expirydate,
                TransfusionType: row.transtype,
                BagGroup: row.bloodgroupId,
                PatBloodGroup: row.patbloodgroup,
                ComponentType: row.ComponentTypeId,
                BagID: row.bagId,
                ReplacementBags: row.replacementcount
                //Issued: row.type === 'false' ? 0 : 1

                //ParameterId: row.PenaltyName.split(" ")[0],
                ////type: c.MomentYYYYMMDD(row.PenaltyDate),
                //Refund: row.Refund === 'Yes' ? 1 : 0,
                //testAppId: false,
                //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
            });
        });
        console.log(entry);
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