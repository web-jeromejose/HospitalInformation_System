var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

$(document).ready(function () {

    c.SetTitle("Surgery Record Date Wise");
    c.DefaultSettings();

    SetupDataTables();

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

    //ShowList();
    BindList([]);
});

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
$(document).on("dblclick", TblGridListId + " td", function (e) {
    //e.preventDefault();

    //if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
    //    var tr = $(this).closest('tr');

    //    TblGridListDataRow = TblGridList.row($(this).parents('tr')).data();
    //    Action = 2;
    //    View(TblGridListDataRow.id, TblGridListDataRow.name);
    //}
});

function Refresh() {
    ShowList();
}
function InitButton() {
    $('#btnRefresh').click(function () {
        $('#btnViewFilter').click();
    });
    $('#btnView').click(function () {

        if (TblGridList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }

        Action = 2;
        View(TblGridListDataRow.id, TblGridListDataRow.name);
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

    $('#btnClose').click(function () {

        Action = -1;
        HandleEnableButtons();
        HandleEnableEntries();
        c.ModalShow('#modalEntry', false);

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

        c.MessageBoxConfirm("Delete?", "Are you sure you want to delete this order?", YesFunc, NoFunc);

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

    $('#btnFilter').click(function () {
        c.ModalShow('#FrmFilter', true);
    });
    $('#btnCloseFilter').click(function () {
        c.ModalShow('#FrmFilter', false);
    });
    $('#btnViewFilter').click(function () {
        var f=c.GetDateTimePickerDate('#dtFromDate');
        var t = c.GetDateTimePickerDate('#dtToDate');
        var isChecked = c.GetICheck('#iChkWithOrNotes');
        View(f, t, isChecked);
    });

}
function InitICheck() {
    $('#iChkWithOrNotes').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
    }); 

    // $('#iChkPending, #iChkOnHold').iCheck('check');
}
function InitSelect2() {
    //$('#select2Department').select2({
    //    containerCssClass: "RequiredField",
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2SurgeryDepartment',
    //        dataType: 'jsonp',
    //        cache: false,
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term,
    //                type: 0
    //            };
    //        },
    //        results: function (data, page) {
    //            var more = (page * pageSize) < data.Total;
    //            return { results: data.Results, more: more };
    //        }
    //    }
    //}).change(function (e) {
    //    var list = e.added.list;
    //    Action = 2;
    //    View(list[0], list[1]);
    //});

}
function InitDateTimePicker() {
    $('#dtFromDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtToDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
}
function InitDataTables() {
    //BindSequence([]);
}
function SetupDataTables() {
    // SetupSequence();

}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();
    if (TblGridList !== undefined) TblGridList.columns.adjust().draw();
}

function DefaultReadOnly() {
    //c.ReadOnly('#txtOrderNo', true);

}
function DefaultValues() {
    //    c.SetDateTimePicker('#dtSurgeryDate', moment());
    c.SetDateTimePicker('#dtFromDate', moment());
    c.SetDateTimePicker('#dtToDate', moment());
    c.iCheckSet('#iChkWithOrNotes', false);
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
}
function DefaultEmpty() {
    c.SetValue('#Id', '');

    //BindSearch([]);
}

function Validated() {
    var req = false;

    //req = c.IsEmptySelect2('#select2Department');
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Department is required');
    //    return false;
    //}

    //var IsEmpty = $(TblGridSelectedId).DataTable().rows().nodes().length == 0;
    //if (IsEmpty) {
    //    c.MessageBoxErr('Empty...', 'The list should not be empty.');
    //    return false;
    //}


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
        //c.DisableSelect2('#select2Department', false);

        //$('#btnAddSelected').hide();
        //$('#btnClearSelected').hide();
        //$('#btnRemoveSelected').hide();
    }
    else if (Action == 1) { // add
        //c.DisableSelect2('#select2Department', false);

        //$('#btnAddSelected').show();
        //$('#btnClearSelected').show();
        //$('#btnRemoveSelected').show();
    }
    else if (Action == 2) { // edit    
        //c.DisableSelect2('#select2Department', false);

        //$('#btnAddSelected').show();
        //$('#btnClearSelected').show();
        //$('#btnRemoveSelected').show();
    }
    else {
        c.Show('#Entry', false);
        c.Show('#DashBoard', true);
    }

}
function HandleButtonNotUse() {
    $('.NotUse').hide();
}

function Save() {

    var ret = Validated();
    if (!ret) return ret;


    var entry;
    entry = [];
    entry = {};

    var deptid = c.GetValue('#Id');

    entry.Action = Action;
    entry.id = deptid;

    entry.SurgeryStation = [];
    $.each(TblGridSelected.rows().data(), function (i, row) {
        entry.SurgeryStation.push({
            SurgeryId: row.ID,
            DeptId: deptid
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
        },
        success: function (data) {
            c.ButtonDisable('#btnSave', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                if (Action == 3) {
                    c.Show('#ButtonsOnBoard', true);
                    c.Show('#ButtonsOnEntry', false);
                    c.Show('#DashBoard', true);
                    c.Show('#Entry', false);
                    TblGridList.row('tr.selected').remove().draw(false);
                    return;
                }

                Action = 0;
                HandleEnableButtons();
                HandleEnableEntries();

                $("#btnClose").click();
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
function View(from, to, isChecked) {
    Url = baseURL + "MainListSurgeryRecordDateWise";
    param = {
        from: from,
        to: to,
        flag: isChecked
    };

    c.ModalShow('#FrmFilter', false);
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
        success: function (data) {
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

            var data = data.list;

            DefaultEmpty();

            //c.SetValue('#Id', Id);

            BindList(data);

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

function ShowListColumns() {
    var cols = [
    { targets: [0], data: "Id", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "SqNo", className: '', visible: true, searchable: true, width: "2%" },
    { targets: [2], data: "IpIdOpId", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [3], data: "PatientName", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [4], data: "BedName", className: '', visible: true, searchable: true, width: "3%" },
    { targets: [5], data: "RegNo", className: '', visible: true, searchable: true, width: "3%" },
    { targets: [6], data: "IssueAuth", className: '', visible: true, searchable: true, width: "3%" },
    { targets: [7], data: "Age", className: '', visible: true, searchable: true, width: "4%" },
    { targets: [8], data: "Sex", className: '', visible: true, searchable: true, width: "3%" },
    { targets: [9], data: "OTNo", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [10], data: "OtStartDateTimeT", className: '', visible: true, searchable: true, width: "6%" },
    { targets: [11], data: "OtEndDateTimeT", className: '', visible: true, searchable: true, width: "6%" },
    { targets: [12], data: "Operation", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [13], data: "SurgeonName", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [14], data: "Anaesthetist", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [15], data: "Anaesthesia", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [16], data: "MRDStatus", className: '', visible: true, searchable: true, width: "3%" },
    { targets: [17], data: "StationName", className: '', visible: true, searchable: true, width: "7%" },
    { targets: [18], data: "BedId", className: '', visible: false, searchable: false, width: "0%" }
    ];
    return cols;
}
function ShowListRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['Dispatched'];
        var $nRow = $(nRow);
        if (value == 1) { // new
            $nRow.css({ "background-color": "#fcc9c9" })
        }
        else if (value == 3) { // Received
            $nRow.css({ "background-color": "#aaffc8" })
        }

    };
    return rc;
}
function ShowList() {
    var Url = baseURL + "MainListSurgeryRecordDateWise";
    var param = {
        from: '',
        to: ''
    };

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
    TblGridList = $(TblGridListId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: true,
        searching: true,
        ordering: false,
        info: true,
        columns: ShowListColumns(),
        bAutoWidth: false,
        scrollY: 450,
        scrollX: true,
        //fnRowCallback: ShowListRowCallBack(),
        iDisplayLength: 25
    });

    //InitList();
}


function RecountList() {
    // c.SetBadgeText('#badgeDrug', $(TblGridDrugListId).DataTable().rows().nodes().length);
}


