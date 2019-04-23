var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridFrom;
var TblGridFromId = "#gridFrom";
var TblGridFromDataRow;

var TblGridTo;
var TblGridToId = "#gridTo";
var TblGridToDataRow;

var days = [{ id: 1, name: "Sunday" },
            { id: 2, name: "Monday" },
            { id: 3, name: "Tuesday" },
            { id: 4, name: "Wednesday" },
            { id: 5, name: "Thursday" },
            { id: 6, name: "Friday" },
            { id: 7, name: "Saturday" },
            ];
 

$(document).ready(function () {

    c.SetTitle("Department Schedule");
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

    ShowList();

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
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        TblGridListDataRow = TblGridList.row($(this).parents('tr')).data();
        $('#btnView').click();
    }
});

$(document).on("click", TblGridFromId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        // Multiple selection
        tr.toggleClass('selected');

        //// Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')

        TblGridFromDataRow = TblGridFrom.row($(this).parents('tr')).data();
        $('#btnInclude').click();
    }
});

$(document).on("click", TblGridToId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        // Multiple selection
        tr.toggleClass('selected');

        //// Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')

        TblGridToDataRow = TblGridTo.row($(this).parents('tr')).data();
        $('#btnExclude').click();
    }
});

function Refresh() {
    ShowList();
}
function InitButton() {
    $('#btnRefresh').click(function () {
        ShowList();
    });
    $('#btnFilter').click(function () {
        c.ModalShow('#modalFilter', true);
    });
    $('#btnView').click(function () {

        if (TblGridList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }

        Action = 2;
        View(TblGridListDataRow.Id);
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
        RedrawGrid();
        //c.ModalShow('#modalEntry', false);

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
        var ctr = $(TblGridToId).DataTable().rows().nodes().length;
        if (Action == 2 && ctr > 1) {
            c.MessageBoxErr("Error...", "Select only one day/date to update the record.", null);
            return;
        }

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
                "ID": rowdata["ID"],
                "ctr": ctr,
                "Code": rowdata["Code"],
                "Name": rowdata["Name"]
            }).draw();

            //InitDrugList();

        });
        RecountList();

        $('#btnFindClose').click();

    });

    $('#btnInclude').click(function () {
        TransferSelected(TblGridFrom, TblGridTo);
    });
    $('#btnIncludes').click(function () {
        c.GridSelectAll(TblGridFromId);
        TransferSelected(TblGridFrom, TblGridTo);
    });
    $('#btnExclude').click(function () {
        TransferSelected(TblGridTo, TblGridFrom);
    });
    $('#btnExcludes').click(function () {
        c.GridSelectAll(TblGridToId);
        TransferSelected(TblGridTo, TblGridFrom);
    });




    $('#txtSearch').keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            ShowSearch();
        }

    });



}
function InitICheck() {
    //$('#iChkPending').iCheck({
    //    checkboxClass: 'icheckbox_square-red',
    //    radioClass: 'iradio_square-red'
    //}).on("ifChecked ifUnchecked", function (e) {
    //    var checked = e.type == "ifChecked" ? true : false;
    //}); 

    // $('#iChkPending, #iChkOnHold').iCheck('check');
}
function InitSelect2() {
    $('#select2Department').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2DeptSchedDepartment',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    type: 0
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
    $('#dtFromDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtToDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtFromTime').datetimepicker({
        pickDate: false
    }).on("dp.change", function (e) {

    });
    $('#dtToTime').datetimepicker({
        pickDate: false
    }).on("dp.change", function (e) {

    });
}
function InitDataTables() {
    //BindSequence([]);
    BindFrom(days);
    BindTo([]);
}
function SetupDataTables() {
    // SetupSequence();

}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();
    if (TblGridList !== undefined) TblGridList.columns.adjust().draw();
    if (TblGridFrom !== undefined) TblGridFrom.columns.adjust().draw();
    if (TblGridTo !== undefined) TblGridTo.columns.adjust().draw();
}

function DefaultReadOnly() {
    //c.ReadOnly('#txtOrderNo', true);

}
function DefaultValues() {
    //    c.SetDateTimePicker('#dtSurgeryDate', moment());
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
}
function DefaultEmpty() {
    c.SetValue('#Id', '');

    c.Select2Clear('#select2Department');
    c.SetDateTimePicker('#dtFromDate', '');
    c.SetDateTimePicker('#dtToDate', '');
    c.SetDateTimePicker('#dtFromTime', '');
    c.SetDateTimePicker('#dtToTime', '');

    BindFrom(days);
    BindTo([]);

}

function Validated() {
    var req = false;

    req = c.IsEmptySelect2('#select2Department');
    if (req) {
        c.MessageBoxErr('Required...', 'Department is required');
        return false;
    }

    var IsEmpty = $(TblGridToId).DataTable().rows().nodes().length == 0;
    if (IsEmpty) {
        c.MessageBoxErr('Empty...', 'The list should not be empty.');
        return false;
    }

    IsEmpty = c.IsDateEmpty('#dtFromDate');
    if (IsEmpty) {
        c.MessageBoxErr('Empty...', 'The Date From should not be empty.');
        return false;
    }
    IsEmpty = c.IsDateEmpty('#dtToDate');
    if (IsEmpty) {
        c.MessageBoxErr('Empty...', 'The Date To should not be empty.');
        return false;
    }
    IsEmpty = c.IsDateEmpty('#dtFromTime');
    if (IsEmpty) {
        c.MessageBoxErr('Empty...', 'The Time From should not be empty.');
        return false;
    }
    IsEmpty = c.IsDateEmpty('#dtToTime');
    if (IsEmpty) {
        c.MessageBoxErr('Empty...', 'The Time To should not be empty.');
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
        c.DisableSelect2('#select2Department', true);

        //$('#btnAddSelected').hide();
        //$('#btnClearSelected').hide();
        //$('#btnRemoveSelected').hide();
    }
    else if (Action == 1) { // add
        c.DisableSelect2('#select2Department', false);

        //$('#btnAddSelected').show();
        //$('#btnClearSelected').show();
        //$('#btnRemoveSelected').show();
    }
    else if (Action == 2) { // edit    
        c.DisableSelect2('#select2Department', true);

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
    //entry = {};
    var Id = c.GetValue('#Id');


    var from = c.GetDateTimePickerDateTime('#dtFromTime');
    var to = c.GetDateTimePickerDateTime('#dtToTime');
    var fromtime = from.substring(11, 22);
    var totime = to.substring(11, 22);

    
    $.each(TblGridTo.rows().data(), function (i, row) {
        entry.push({
            Action: Action,
            Id: c.GetValue('#Id'),
            Equipmentid: c.GetSelect2Id('#select2Department'),
            Day: row.id,
            DayName: row.name,
            FromTime:fromtime,
            ToTime:totime,
            FromDate: c.GetDateTimePickerDateTime('#dtFromDate'),
            ToDate: c.GetDateTimePickerDateTime('#dtToDate')
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

            var data = data[0];

            DefaultEmpty();

            c.SetValue('#Id', Id);

            var OnTheList = [{ id: data.Day, name: data.DayName }];

            c.SetSelect2('#select2Department', data.Equipmentid, data.name);
            c.SetDateTimePicker('#dtFromDate', data.FromDateW);
            c.SetDateTimePicker('#dtToDate', data.ToDateW);
            c.SetDateTimePicker('#dtFromTime', data.FromTimeW);
            c.SetDateTimePicker('#dtToTime', data.ToTimeW);
            BindTo(OnTheList);

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
    { targets: [1], data: "ctr", className: '', visible: true, searchable: false, width: "3%" },
    { targets: [2], data: "name", className: '', visible: true, searchable: false, width: "10%" },
    { targets: [3], data: "Day", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [4], data: "DayName", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [5], data: "FromTimeW", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [6], data: "ToTimeW", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [7], data: "FromDateW", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [8], data: "ToDateW", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [9], data: "FromTime", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [10], data: "ToTime", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [11], data: "FromDate", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [12], data: "ToDate", className: '', visible: false, searchable: false, width: "0%" }
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
        fnRowCallback: ShowListRowCallBack(),
        iDisplayLength: 25
    });

    //InitList();
}

function ShowFromColumns() {

    var cols = [
    { targets: [0], data: "id", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "name", className: '', visible: true, searchable: false, width: "100%" }    
    ];
    return cols;
}
function ShowFrom() {
    var Url = baseURL + "FindSurgery";
    //var searchItem = c.GetValue('#txtSearch');
    //if (searchItem.length == 0) return;
    //var param = {
    //    search: searchItem
    //};

    $('.loading').show();

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
            BindSearch(data.list);
            $('.loading').hide();
        },
        error: function (xhr, desc, err) {
            $('.loading').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindFrom(data) {
    //TblGridFrom = $(TblGridFromId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: false,
    //    ordering: false,
    //    info: false,
    //    columns: ShowFromColumns(),
    //    bAutoWidth: false,
    //    scrollY: 400,
    //    scrollX: true,
    //    //fnRowCallback: ShowListRowCallBack(),
    //    iDisplayLength: 25
    //});
    TblGridFrom = $(TblGridFromId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 400,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        fnRowCallback: ShowListRowCallBack(),
        columns: ShowFromColumns()
    });


    //InitSearch();
}

function ShowToColumns() {

    var cols = [
    { targets: [0], data: "id", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "name", className: '', visible: true, searchable: false, width: "100%" }
    ];
    return cols;
}
function ShowTo() {
    var Url = baseURL + "FindSurgery";
    //var searchItem = c.GetValue('#txtSearch');
    //if (searchItem.length == 0) return;
    //var param = {
    //    search: searchItem
    //};

    $('.loading').show();

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
            BindSearch(data.list);
            $('.loading').hide();
        },
        error: function (xhr, desc, err) {
            $('.loading').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindTo(data) {
    //TblGridTo = $(TblGridToId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: false,
    //    ordering: false,
    //    info: false,
    //    columns: ShowToColumns(),
    //    bAutoWidth: false,
    //    scrollY: 400,
    //    scrollX: true,
    //    //fnRowCallback: ShowListRowCallBack(),
    //    iDisplayLength: 25
    //});
    TblGridTo = $(TblGridToId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 400,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        fnRowCallback: ShowListRowCallBack(),
        columns: ShowToColumns()
    });


    //InitSearch();
}


function RecountList() {
    // c.SetBadgeText('#badgeDrug', $(TblGridDrugListId).DataTable().rows().nodes().length);
}


function TransferSelected(gridFrom, gridTo) {          
    var rowcollection = gridFrom.$(".selected", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = gridFrom.row(tr);
        var rowdata = row.data();

        gridTo.row.add({
            "id": rowdata["id"],
            "name": rowdata["name"]
        }).draw();        
        
        //TblGridSurgery.row.add({
        //    "id": "",
        //    "No": ctr,
        //    "name": "",
        //    "Count": "1"
        //}).draw();
    });

    gridFrom.row('tr.selected').remove().draw(false);
}