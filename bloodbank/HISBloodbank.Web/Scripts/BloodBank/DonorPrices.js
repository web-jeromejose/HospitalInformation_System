var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

$(document).ready(function () {

    c.SetTitle("Donor Prices");
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

    ShowList(-1);

});
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // for future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();


})
$(document).on("click", TblGridListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected');

        TblGridListDataRow = TblGridList.row($(this).parents('tr')).data();

    }
});
$(document).on("dblclick", TblGridListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        $('#btnView').click();

    }
});

function InitButton() {
    $('#btnRefresh').click(function () {
        ShowList(-1);
    });
    $('#btnFilter').click(function () {
        c.ModalShow('#modalFilter', true);
    });
    $('#btnView').click(function () {

        if (TblGridList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }

        var id = TblGridListDataRow.id;
        Action = 0;
        View(id);
        c.SetActiveTab('sectionA');
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
    });
    $('#btnCloseFilter').click(function () {
        c.ModalShow('#modalFilter', false);
    });
    $('#btnViewFilter').click(function () {
        var ID = c.GetSelect2Id('#select2EmployeeIDFilter');
        var isChecked = c.GetICheck('#iChkLast3Mos') == "1";
        if (!isChecked && ID.length == 0) {
            c.MessageBoxErr("Required...", "Please select an employee.");
            return;
        }

        LeaveApplicationList();
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

    $('#btnAddSurgery').click(function () {
        var ctr = $(TblGridSurgeryId).DataTable().rows().nodes().length + 1;
        TblGridSurgery.row.add({
            "id": "",
            "No": ctr,
            "name": "",
            "Count": "1"
        }).draw();
        InitSelectedSurgery();
    });
    $('#btnRemoveSurgery').click(function () {

        if (TblGridSurgery.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to be deleted.", null);
            return;
        }

        var YesFunc = function () {
            TblGridSurgery.row('tr.selected').remove().draw(false);
        };

        c.MessageBoxConfirm("Delete...", "Are you sure you want to delete the selected row/s?", YesFunc, null);

    });

}
function InitICheck() {
    //    $('#iChkStart').iCheck({
    //        checkboxClass: 'icheckbox_square-red',
    //        radioClass: 'iradio_square-red'
    //    }).on("ifChecked ifUnchecked", function (e) {
    //        var checked = e.type == "ifChecked" ? true : false;
    //        c.SetDateTimePicker('#dtOTStartDateTime', checked ? moment() : "");
    //        c.SetDateTimePicker('#dtAnaesthesiaStartDateTime', checked ? moment() : "");
    //        c.SetDateTimePicker('#dtIncisionDateTime', checked ? moment() : "");
    //        c.SetDateTimePicker('#dtRecoveryStartDateTime', checked ? moment() : "");
    //    });
}
function InitSelect2() {
    $('#select2BloodGroup').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2BloodGroupDonor',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                var id = c.GetSelect2Id('#select2ComponentName');
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    componentid: id.length == 0 ? 0 : id
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        Action = (list[2] == null) ? 2 : 1; // if null then action is edit.
        c.SetValue('#txtPrice', list[2]);
    });
    $('#select2ComponentName').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2ComponentNameDonor',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                var id = c.GetSelect2Id('#select2BloodGroup');
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    Bloodgroupid: id.length == 0 ? 0 : id
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        Action = (list[2] == null) ? 2 : 1; // if null then action is edit.
        c.SetValue('#txtPrice', list[2]);
    });

}
function InitDateTimePicker() {
    //    $('#dtSurgeryDate').datetimepicker({
    //        pickTime: false
    //    }).on("dp.change", function (e) {

    //    });
}
function InitDataTables() {

}
function SetupDataTables() {
    //    SetupSelectedSurgery();
}

function DefaultReadOnly() {
    //c.ReadOnly('#txtCreatedDateTime', true);

}
function DefaultValues() {
    //    c.SetDateTimePicker('#dtSurgeryDate', moment());
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
}
function DefaultEmpty() {
    c.SetValue('#Id', '');

    c.ClearSelect2('#select2BloodGroup');
    c.ClearSelect2('#select2ComponentName');
    c.SetValue('#txtPrice', '');

    //    BindSelectedSurgery([]);
}

function Validated() {
    var req = false;

    req = c.IsEmptySelect2('#select2BloodGroup');
    if (req) {
        c.MessageBoxErr('Required...', 'Blood group is required.');
        return false;
    }
    req = c.IsEmptySelect2('#select2ComponentName');
    if (req) {
        c.MessageBoxErr('Required...', 'Component name is required.');
        return false;
    }
    req = c.IsEmptyById('#txtPrice');
    if (req) {
        c.MessageBoxErr('Required...', 'Price is required.');
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
        c.DisableSelect2('#select2BloodGroup', true);
        c.DisableSelect2('#select2ComponentName', true);
        c.Disable('#txtPrice', true);
    }
    else if (Action == 1 || Action == 2) { // add or edit
        c.DisableSelect2('#select2BloodGroup', false);
        c.DisableSelect2('#select2ComponentName', false);
        c.Disable('#txtPrice', false);
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

    c.ButtonDisable('#btnSave', true);

    var entry;
    entry = [];
    entry = {};
    entry.Action = Action;
    entry.id = c.GetValue('#Id');
    entry.Bloodgroupid = c.GetSelect2Id('#select2BloodGroup');
    entry.componentid = c.GetSelect2Id('#select2ComponentName');
    entry.amount = c.GetValue('#txtPrice');

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
function View(id) {
    var Url = baseURL + "ShowSelected";
    var param = { Id: id };

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
                c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
                TblGridList.row('tr.selected').remove().draw(false);
                return;
            }

            var data = data.list[0];

            c.SetValue('#Id', data.id);

            c.SetSelect2('#select2BloodGroup', data.Bloodgroupid, data.BloodGroup);
            c.SetSelect2('#select2ComponentName', data.componentid, data.component);
            c.SetValue('#txtPrice', data.price);

            HandleEnableButtons();
            HandleEnableEntries();

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
    { targets: [0], data: "ctr", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [1], data: "id", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [2], data: "BloodGroup", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [3], data: "component", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [4], data: "price", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [5], data: "CreatedBy", className: '', visible: true, searchable: true, width: "0%" }
    ];
    return cols;
}
function ShowListRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowList(id) {
    var Url = baseURL + "ShowList";
    var param = { Id: id };

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
        scrollY: 550,
        scrollX: true,
        fnRowCallback: ShowListRowCallBack(),
        iDisplayLength: 25
    });
}


