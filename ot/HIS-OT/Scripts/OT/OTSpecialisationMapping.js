var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridSpecialization;
var TblGridSpecializationId = '#gridSpecialization';
var TblGridSpecializationDataRow;

$(document).ready(function () {

    c.SetTitle("OT Specialization Mapping");
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
        Action = 2;
        View(TblGridListDataRow.id, TblGridListDataRow.name);
    }
});

$(document).on("click", TblGridSpecializationId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        // Multiple selection
        tr.toggleClass('selected');

        //// Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')

        TblGridSpecializationDataRow = TblGridSpecialization.row($(this).parents('tr')).data();

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

        c.MessageBoxConfirm("Delete?", "Are you sure you want to delete this record?", YesFunc, NoFunc);

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

    $('#btnAddSelected').click(function () {
        c.ModalShow('#FrmFindSurgery', true);
        TblGridSearch.columns.adjust().draw();
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
    //$('#chkAll').iCheck({
    //    checkboxClass: 'icheckbox_square-red',
    //    radioClass: 'iradio_square-red'
    //}).on("ifChecked ifUnchecked", function (e) {
    //    var checked = e.type == "ifChecked" ? true : false;
    //}); 

    // $('#iChkPending, #iChkOnHold').iCheck('check');
}
function InitSelect2() {
    $('#select2Station').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2OTSpecializationMappingStation',
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
    //    $('#dtSurgeryDate').datetimepicker({
    //        pickTime: false
    //    }).on("dp.change", function (e) {

    //    });
}
function InitDataTables() {
    BindSpecialization([]);
}
function SetupDataTables() {
    // SetupSequence();

}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    //if (TblGridSelected !== undefined) TblGridSelected.columns.adjust().draw();
    if (TblGridSpecialization !== undefined) TblGridSpecialization.columns.adjust().draw();
}

function DefaultReadOnly() {
    //c.ReadOnly('#txtOrderNo', true);

}
function DefaultValues() {
    //    c.SetDateTimePicker('#dtSurgeryDate', moment());
    c.SetSelect2('#select2Station', '', '');
    c.SetValue('#txtOperationTheatre', '');
    BindSpecialization([]);
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
}
function DefaultEmpty() {
    c.SetValue('#Id', '');

    c.Select2Clear('#select2Department');

    BindSpecialization([]);
}

function Validated() {
    var req = false;

    req = c.IsEmptySelect2('#select2Station');
    if (req) {
        c.MessageBoxErr('Required...', 'Station is required');
        return false;
    }
    req = c.IsEmptyById('#txtOperationTheatre');
    if (req) {
        c.MessageBoxErr('Required...', 'Operation Theatre is required');
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
        c.DisableSelect2('#select2Department', false);

        $('#btnAddSelected').hide();
        $('#btnClearSelected').hide();
        $('#btnRemoveSelected').hide();
    }
    else if (Action == 1) { // add
        c.DisableSelect2('#select2Department', false);

        $('#btnAddSelected').show();
        $('#btnClearSelected').show();
        $('#btnRemoveSelected').show();
    }
    else if (Action == 2) { // edit    
        c.DisableSelect2('#select2Department', false);

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
    entry.ID = c.GetValue('#Id');
    entry.Name = c.GetValue('#txtOperationTheatre');
    entry.stationid = c.GetSelect2Id('#select2Station');

    entry.OTSpecialisation = [];
    var rowcollection = TblGridSpecialization.$(".selected", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = TblGridSpecialization.row(tr);
        var rowdata = row.data();
        
        entry.OTSpecialisation.push({
            OTid: entry.ID,
            Specialisationid: rowdata['ID']
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
                $("#btnRefresh").click();
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

            var data = data.list;

            DefaultEmpty();

            c.SetValue('#Id', Id);

            c.SetSelect2('#select2Station', '', '');
            c.SetValue('#txtOperationTheatre', '');
            BindSpecialization([]);

            if (data.length > 0) {
                c.SetSelect2('#select2Station', data[0].stationid, data[0].StationName);
                c.SetValue('#txtOperationTheatre', data[0].Name);
                BindSpecialization(data[0].Specialisation);
            }
            

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
    { targets: [1], data: "ctr", className: '', visible: true, searchable: true, width: "3%" },
    { targets: [2], data: "name", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [3], data: "stationid", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [4], data: "StationName", className: '', visible: true, searchable: true, width: "25%" },
    { targets: [5], data: "Specialization", className: '', visible: true, searchable: true, width: "70%" }
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
        fnRowCallback: ShowListRowCallBack(),
        columns: ShowListColumns()

    });

    //InitList();
}

function handleCheckTag(e) {
    alert(e);
    //$row = $(e).parents('tr');

    //// Set the TestICheck column when check or not.
    //TblGridSpecialization.cell($row, 2).data(e.checked ? 1 : 0);

    //var datarow = TblGridSpecialization.row($row).data();

    //if (e.checked) {
    //    Collect(datarow);
    //}
    //else if (!e.checked) {

    //    var YesFunc = function () {
    //        CollectUndo(datarow);
    //    };
    //    var NoFunc = function () {
    //        e.checked = true;
    //    };

    //    c.MessageBoxConfirm("Cancel...", "Test already done...  <br> Are you sure you want to undo the collected sample?", YesFunc, NoFunc);

    //}
}

function ShowSpecializationColumns() {
    var cols = [
    { targets: [0], data: "ID", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "ctr", className: '', visible: true, searchable: false, width: "3%" },
    { targets: [2], data: "chk", className: '', visible: false, searchable: false, width: "3%" },
    { targets: [3], data: "", className: 'cAR-align-center', visible: false, width: "3%", defaultContent: '<input type="checkbox" id="chkSelected" onclick="handleCheckTag(this)" />' },
    { targets: [4], data: "Name", className: '', visible: true, searchable: true, width: "55%" }
    ];
    return cols;
}
function ShowSpecializationRowCallBack() {

    var rc = function (nRow, aData) {
        var value = aData['chk'];
        var $nRow = $(nRow);
        if (value > 0) { // checked
            $nRow.addClass('selected');
        }

    };
    return rc;
}
function ShowSpecialization() {
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
function BindSpecialization(data) {
    //TblGridSpecialization = $(TblGridSpecializationId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowSpecializationColumns(),
    //    bAutoWidth: false,
    //    scrollY: 380,
    //    scrollX: true,
    //    fnRowCallback: ShowSpecializationRowCallBack()
    //    //iDisplayLength: 25
    //});
    TblGridSpecialization = $(TblGridSpecializationId).DataTable({
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
        fnRowCallback: ShowSpecializationRowCallBack(),
        columns: ShowSpecializationColumns()
    });

    //InitList();
}



function RecountList() {
    // c.SetBadgeText('#badgeDrug', $(TblGridDrugListId).DataTable().rows().nodes().length);
}


