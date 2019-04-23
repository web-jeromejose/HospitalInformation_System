var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridSelected;
var TblGridSelectedId = "#gridSelected";
var TblGridSelectedDataRow;

var TblGridSearch;
var TblGridSearchId = "#gridSearchResults";
var TblGridSearchDataRow;


$(document).ready(function () {

    c.SetTitle("Pack Definition");
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
    BindSearch([]);
    ShowSearch();
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

$(document).on("click", TblGridSelectedId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        // Multiple selection
        tr.toggleClass('selected');

        //// Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')

        TblGridSelectedDataRow = TblGridSelected.row($(this).parents('tr')).data();

    }
});

$(document).on("click", TblGridSearchId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        // Multiple selection
        tr.toggleClass('selected');

        //// Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')

        TblGridSearchDataRow = TblGridSearch.row($(this).parents('tr')).data();

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
        View(TblGridListDataRow.id);
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
                "code": rowdata["code"],
                "name": rowdata["name"],
                "Qty": 0
            }).draw();

            InitSelected();

        });
        RecountList();

        $('#btnFindClose').click();

    });

    $('#btnAddSelected').click(function () {
        c.ModalShow('#FrmFindSurgery', true);
        RedrawGrid();
    });
    $('#btnRemoveSelected').click(function () {
        if (TblGridSelected.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to be deleted.", null);
            return;
        }

        var YesFunc = function () {
            TblGridSelected.row('tr.selected').remove().draw(false);
            c.ReSequenceDataTable(TblGridSelectedId, 1);
            RecountList();
        };

        c.MessageBoxConfirm("Delete...", "Are you sure you want to delete the selected row/s?", YesFunc, null);

    });
    $('#btnClearSelected').click(function () {
        var YesFunc = function () {
            BindSelected([]);
        };

        var NoFunc = function () {
        };

        c.MessageBoxConfirm("Clear?", "Are you sure you want to clear the selected list?", YesFunc, NoFunc);

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
    //    $('#dtSurgeryDate').datetimepicker({
    //        pickTime: false
    //    }).on("dp.change", function (e) {

    //    });
}
function InitDataTables() {
    //BindSequence([]);
    BindSelected([]);
}
function SetupDataTables() {
    // SetupSequence();
    SetupSelected();
}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (TblGridList !== undefined) TblGridList.columns.adjust().draw();
    if (TblGridSelected !== undefined) TblGridSelected.columns.adjust().draw();
    if (TblGridSearch !== undefined) TblGridSearch.columns.adjust().draw();
    
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
    c.ClearAllText();

    //c.Select2Clear('#select2Department');

    BindSelected([]);
    //BindSearch([]);
}

function Validated() {
    var req = false;


    var station = $('#ListOfStation').val();
    if (station == null) {
        c.MessageBoxErr('Error...', 'Please select a station in the upper right.');
        return false;
    }

    req = c.IsEmptyById('#txtProfileName');
    if (req) {
        c.MessageBoxErr('Required...', 'Profile name is required');
        return false;
    }

    var IsEmpty = $(TblGridSelectedId).DataTable().rows().nodes().length == 0;
    if (IsEmpty) {
        c.MessageBoxErr('Empty...', 'The list should not be empty.');
        return false;
    }

    var ctr = 1;
    var required = '';
    $.each(TblGridSelected.rows().data(), function (i, row) {
        if (!$.isNumeric(row.Qty) || row.Qty < 1) {
            required = required + ctr + '.  Enter a valid quantity for row ' + row.ctr + '<br>';
            ctr++;
        }
    });
    if (required.length > 0) {
        c.MessageBoxErr('Required...', required);
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
        c.Disable('#txtProfileName', true);

        $('#btnAddSelected').hide();
        $('#btnClearSelected').hide();
        $('#btnRemoveSelected').hide();
    }
    else if (Action == 1) { // add
        c.Disable('#txtProfileName', false);

        $('#btnAddSelected').show();
        $('#btnClearSelected').show();
        $('#btnRemoveSelected').show();
    }
    else if (Action == 2) { // edit    
        c.Disable('#txtProfileName', true);

        $('#btnAddSelected').show();
        $('#btnClearSelected').show();
        $('#btnRemoveSelected').show();
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

    entry.Action = Action;
    entry.id = c.GetValue('#Id');
    entry.Name = c.GetValue('#txtProfileName');

    entry.CSSDProfileDetail = [];
    $.each(TblGridSelected.rows().data(), function (i, row) {
        entry.CSSDProfileDetail.push({
            ItemId: row.id,
            Qty: row.Qty,
            slNo: row.ctr
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

            if (data.list.length == 0) {
                Action = 1;
                HandleEnableButtons();
                HandleEnableEntries();
                RedrawGrid();
                return;
            }

            Action = 0;

            var data = data.list;

            DefaultEmpty();

            c.SetValue('#Id', Id);

            c.SetValue('#txtProfileName', data[0].name);

            BindSelected(data[0].PackDefinitionSelected);

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
    { targets: [0], data: "id", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "name", className: '', visible: true, searchable: true, width: "25%" },
    { targets: [2], data: "Selected", className: '', visible: true, searchable: true, width: "70%" }
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
    //    //fnRowCallback: ShowListRowCallBack(),
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
        scrollY: 420,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        //fnRowCallback: ShowListRowCallBack(),
        columns: ShowListColumns()

    });

    //InitList();
}

function SetupSelected() {
    $.editable.addInputType('txtQty', {
        element: function (settings, original) {

            var input = $('<input id="txtQty" type="number"  style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        }
    });
}
function InitSelected() {
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassTxtQty', TblGridSelected.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridSelected.cell($(this).closest('td')).index();
        TblGridSelected.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'txtQty', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    // Resize all rows.
    $(TblGridSelectedId + ' tr').addClass('trclass');
}
function ShowSelectedColumns() {
    var cols = [
    { targets: [0], data: "id", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "ctr", className: '', visible: true, searchable: true, width: "3%" },
    { targets: [2], data: "code", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [3], data: "name", className: '', visible: true, searchable: true, width: "50%" },
    { targets: [3], data: "Qty", className: 'ClassTxtQty', visible: true, searchable: true, width: "10%" }
    ];
    return cols;
}
function ShowSelected() {
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
function BindSelected(data) {
    //TblGridSelected = $(TblGridSelectedId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowSelectedColumns(),
    //    bAutoWidth: false,
    //    scrollY: 380,
    //    scrollX: true,
    //    //fnRowCallback: ShowListRowCallBack(),
    //    iDisplayLength: 25
    //});
    TblGridSelected = $(TblGridSelectedId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 350,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        //fnRowCallback: ShowListRowCallBack(),
        columns: ShowSelectedColumns()
    });

    InitSelected();
}

function ShowSearchColumns() {

    var cols = [
    { targets: [0], data: "id", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "code", className: '', visible: true, searchable: false, width: "25%" },
    { targets: [2], data: "name", className: '', visible: true, searchable: false, width: "75%" }
    ];
    return cols;
}
function ShowSearch() {
    var Url = baseURL + "ShowItems";
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
function BindSearch(data) {
    //TblGridSearch = $(TblGridSearchId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: false,
    //    columns: ShowSearchColumns(),
    //    bAutoWidth: false,
    //    scrollY: 400,
    //    scrollX: true,
    //    //fnRowCallback: ShowListRowCallBack(),
    //    iDisplayLength: 25
    //});
    TblGridSearch = $(TblGridSearchId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 350,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        //fnRowCallback: ShowListRowCallBack(),
        columns: ShowSearchColumns()
    });

    //InitSearch();
}

function RecountList() {
    // c.SetBadgeText('#badgeDrug', $(TblGridDrugListId).DataTable().rows().nodes().length);
}



