var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridBlood;
var TblGridBloodId = "#gridBlood";
var TblGridBloodDataRow;

$(document).ready(function () {

    c.SetTitle("Blood Group Mapping");
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


$(document).on("click", TblGridBloodId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        // Multiple selection
        tr.toggleClass('selected');

        // Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')


        TblGridListDataRow = TblGridList.row($(this).parents('tr')).data();

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

        //var id = TblGridListDataRow.Id;
        //Action = 0;
        //View(id);
        //c.SetActiveTab('sectionA');
        $('#btnNewEntry').click();
        Action = 2;
        
        c.SetSelect2('#select2BloodGroup', TblGridListDataRow.bloodid, TblGridListDataRow.bloodgroup);
        c.SetSelect2('#select2Type', TblGridListDataRow.TypeId+1, TblGridListDataRow.TypeName);
        c.SetSelect2('#select2Component', TblGridListDataRow.componentid, TblGridListDataRow.componentname);

        ShowSelected(TblGridListDataRow.bloodid, TblGridListDataRow.TypeId+1, TblGridListDataRow.componentid)
    });
    $('#btnNewEntry').click(function () {
        Action = 2;
        DefaultDisable();
        DefaultReadOnly();
        DefaultEmpty();
        DefaultValues();
        InitDataTables();
        HandleEnableButtons();
        HandleEnableEntries();
        RedrawGrid();
        ShowSelected(0, 0, 0);
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
            Action = 2;
            DefaultEmpty();
            DefaultValues();
            HandleEnableButtons();
            HandleEnableEntries();
            ShowSelected(0,0,0);
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
            Action = 2;
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
            url: baseURL + 'Select2BGMBloodGroup',
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

        var vbloodgroop = c.GetSelect2Id('#select2BloodGroup');
        var vtype = c.GetSelect2Id('#select2Type');
        var vcomponentid = c.GetSelect2Id('#select2Component');

        ShowSelected(vbloodgroop, vtype, vcomponentid);
    });
    $("#select2Type").select2({
        containerCssClass: "RequiredField",
        data: [{ id: 1, text: 'Blood' }, { id: 2, text: 'Component' }, { id: 3, text: 'SDPLR' }],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added.list;

        var vbloodgroop = c.GetSelect2Id('#select2BloodGroup');
        var vtype = c.GetSelect2Id('#select2Type');
        var vcomponentid = c.GetSelect2Id('#select2Component');

        ShowSelected(vbloodgroop, vtype, vcomponentid);


    });
    $('#select2Component').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2BGMComponent',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    IdType: c.GetSelect2Id('#select2Type')
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;

        var vbloodgroop = c.GetSelect2Id('#select2BloodGroup');
        var vtype = c.GetSelect2Id('#select2Type');
        var vcomponentid = c.GetSelect2Id('#select2Component');

        ShowSelected(vbloodgroop, vtype, vcomponentid);

    });

}
function InitDateTimePicker() {
    //    $('#dtSurgeryDate').datetimepicker({
    //        pickTime: false
    //    }).on("dp.change", function (e) {

    //    });
}
function InitDataTables() {
    BindSelected([]);
}
function SetupDataTables() {
    //    SetupSelectedSurgery();
}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (TblGridList !== undefined) TblGridList.columns.adjust().draw();
    if (TblGridBlood !== undefined) TblGridBlood.columns.adjust().draw();

}

function DefaultReadOnly() {
    //c.ReadOnly('#txtCreatedDateTime', true);

}
function DefaultValues() {
    //    c.SetDateTimePicker('#dtSurgeryDate', moment());
    c.SetSelect2('#select2Type', 1, 'Blood');
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
}
function DefaultEmpty() {
    c.SetValue('#Id', '');

    c.ClearSelect2('#select2BloodGroup');
    c.ClearSelect2('#select2Type');
    c.ClearSelect2('#select2Component');

    //    BindSelectedSurgery([]);
}

function Validated() {
    var req = false;

    req = c.IsEmptySelect2('#select2BloodGroup');
    if (req) {
        c.MessageBoxErr('Required...', 'Blood group is required.');
        return false;
    }
    req = c.IsEmptySelect2('#select2Type');
    if (req) {
        c.MessageBoxErr('Required...', 'Type is required.');
        return false;
    }
    req = c.IsEmptySelect2('#select2Component');
    if (req) {
        c.MessageBoxErr('Required...', 'Component is required.');
        return false;
    }

    var rowcollection = TblGridBlood.$(".selected", { "page": "all" });
    if (rowcollection.length == 0) {
        c.MessageBoxErr('Selection...', "Please select a row/s.");
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
        c.Disable('#txtCode', true);
        c.Disable('#txtArabicCode', true);
        c.Disable('#txtName', true);
        c.Disable('#txtArabicName', true);
        c.DisableSelect2('#select2Department', true);
    }
    else if (Action == 1 || Action == 2) { // add or edit
        c.Disable('#txtCode', false);
        c.Disable('#txtArabicCode', false);
        c.Disable('#txtName', false);
        c.Disable('#txtArabicName', false);
        c.DisableSelect2('#select2Department', false);
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
    //entry = {};

    var typeId = c.GetSelect2Id('#select2Type');

    var ctr=1;
    var msg = "";
    var rowcollection = TblGridBlood.$(".selected", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = TblGridBlood.row(tr);
        var rowdata = row.data();

        if (rowdata["StatusId"] !== 0) {

            entry.push({
                Action: Action,
                bloodgroop: c.GetSelect2Id('#select2BloodGroup'),
                type: typeId-1,
                issgroop:rowdata["id"],
                componentid: c.GetSelect2Id('#select2Component'),
                deleted:0
            });
            msg = msg + ctr + '.   ' + rowdata["name"] + '. <br>';
            ctr++;
        }

    });

    var YesFunc = function () {
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

                ShowList(-1);
                c.MessageBox(data.Title, data.Message, null);
            },
            error: function (xhr, desc, err) {
                c.ButtonDisable('#btnSave', false);
                var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                c.MessageBox("Error...", errMsg, null);
            }
        });

    };
    var NoFunc = function () {
    }

    c.MessageBoxConfirm("Save?", "Are you sure you want to save the following: <br> <br>" + msg, YesFunc, NoFunc);


    return ret;
}
function View(id) {
    var Url = baseURL + "BloodGroupMappingSelected";
    var param = {
        bloodgroop: TblGridListDataRow.bloodid,
        type: TblGridListDataRow.TypeId,
        componentid: TblGridListDataRow.componentid
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
                c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
                TblGridList.row('tr.selected').remove().draw(false);
                return;
            }

            BindSelected(data.list);

            var data = data.list[0];

            //c.SetValue('#Id', data.Id);

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
    { targets: [0], data: "ctr", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [1], data: "id", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [2], data: "name", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [3], data: "TypeName", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [4], data: "bloodgroup", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [5], data: "componentname", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [6], data: "bloodid", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [7], data: "componentid", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [8], data: "TypeId", className: '', visible: true, searchable: true, width: "0%" }
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

function ShowSelectedColumns() {
    var cols = [
    { targets: [0], data: "ctr", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [1], data: "id", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [2], data: "name", className: '', visible: true, searchable: true, width: "90%" },
    { targets: [3], data: "chk", className: '', visible: false, searchable: true, width: "5%" }
    ];
    return cols;
}
function ShowSelectedRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['chk'];
        var $nRow = $(nRow);
        if (value == 1) { // checked
            $nRow.addClass('selected');
        }
    };
    return rc;
}
function ShowSelected(vbloodgroop, vtype, vcomponentid) {
    var Url = baseURL + "BloodGroupMappingSelected";

    var param = {
        bloodgroop: vbloodgroop.length == 0 ? 0 : vbloodgroop,
        type: vtype.length == 0 ? 0 : vtype,
        componentid: vcomponentid.length == 0 ? 0 : vcomponentid
    };

    //$('#preloader').show();
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
            //$('#preloader').hide();
            BindSelected(data.list);
            //$("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            //$('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindSelected(data) {
    TblGridBlood = $(TblGridBloodId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        columns: ShowSelectedColumns(),
        bAutoWidth: false,
        scrollY: 350,
        scrollX: true,
        fnRowCallback: ShowSelectedRowCallBack(),
        iDisplayLength: 25
    });
}
