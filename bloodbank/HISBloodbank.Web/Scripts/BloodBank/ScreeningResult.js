var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridSequence;
var TblGridSequenceId = "#gridSequence";
var TblGridSequenceDataRow;

$(document).ready(function () {

    c.SetTitle("Screening Result");
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

$(document).on("click", TblGridSequenceId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected');

        TblGridSequenceDataRow = TblGridList.row($(this).parents('tr')).data();

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

        var id = TblGridListDataRow.Id;
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

    $('#btnSequence').click(function () {
        c.ModalShow('#FrmSequence', true);
        RedrawGrid();
    });
    $('#btnSeqClose').click(function () {
        c.ModalShow('#FrmSequence', false);
        RedrawGrid();
    });
    $('#btnSeqSave').click(function () {
        c.MessageBoxErr("Error...", "Unable to save.", null);
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
    $('#select2Department').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2BloodGroupDepartment',
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
    BindSequence([]);
}
function SetupDataTables() {
    //    SetupSelectedSurgery();
    SetupSequence();
}
function RedrawGrid() {
    if (TblGridList !== undefined) TblGridList.columns.adjust().draw();
    if (TblGridSequence !== undefined) TblGridSequence.columns.adjust().draw();
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

    c.SetValue('#txtCode', '');
    c.SetValue('#txtArabicCode', '');
    c.SetValue('#txtName', '');
    c.SetValue('#txtArabicName', '');
    c.ClearSelect2('#select2Department');

    //    BindSelectedSurgery([]);
}

function Validated() {
    var req = false;

    req = c.IsEmptyById('#txtCode');
    if (req) {
        c.MessageBoxErr('Required...', 'Code is required.');
        return false;
    }
    req = c.IsEmptyById('#txtArabicCode');
    if (req) {
        c.MessageBoxErr('Required...', 'Arabic Code is required.');
        return false;
    }
    req = c.IsEmptyById('#txtName');
    if (req) {
        c.MessageBoxErr('Required...', 'Name is required.');
        return false;
    }
    req = c.IsEmptyById('#txtArabicName');
    if (req) {
        c.MessageBoxErr('Required...', 'Arabic Name is required.');
        return false;
    }
    //req = c.IsEmptySelect2('#select2Department');
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Department is required.');
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
    entry = {};
    entry.Action = Action;
    entry.id = c.GetValue('#Id');
    entry.code = c.GetValue('#txtCode');
    entry.arabiccode = c.GetValue('#txtArabicCode');
    entry.name = c.GetValue('#txtName');
    entry.arabicname = c.GetValue('#txtArabicName');
    entry.departmentid = c.GetSelect2Id('#select2Department');

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

            c.SetValue('#txtCode', data.code);
            c.SetValue('#txtArabicCode', data.ArabicCode);
            c.SetValue('#txtName', data.Name);
            c.SetValue('#txtArabicName', data.ArabicName);
            c.SetSelect2('#select2Department', data.Departmentid, data.DepartmentName);

            BindSequence(data.Sequence);

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
    { targets: [1], data: "Id", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [2], data: "code", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [3], data: "ArabicCode", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [4], data: "Name", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [5], data: "ArabicName", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [6], data: "StartDateTime", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [7], data: "CreatedBy", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [8], data: "updatedatetime", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [9], data: "LastModifiedBy", className: '', visible: true, searchable: true, width: "0%" }
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

function SetupSequence() {
    $.editable.addInputType('select2SequenceE', {
        element: function (settings, original) {
            var input = $('<input id="selectSeq" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#selectSeq').select2({
                data: [
                     { id: 1, text: '1' },{ id: 2, text: '2' },{ id: 3, text: '3' },{ id: 4, text: '4' },{ id: 5, text: '5' }
                    ,{ id: 5, text: '6' },{ id: 5, text: '7' },{ id: 5, text: '8' },{ id: 5, text: '9' },{ id: 5, text: '10' }
                    ,{ id: 2, text: '11' },{ id: 3, text: '12' },{ id: 4, text: '13' },{ id: 5, text: '14' },{ id: 5, text: '15' }
                    ,{ id: 5, text: '16' },{ id: 5, text: '17' },{ id: 5, text: '18' },{ id: 5, text: '19' },{ id: 5, text: '20' },{ id: 5, text: '21' }
                    ],
                minimumResultsForSearch: -1
            }).on("select2-blur", function () {
                $("#selectSeq").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#selectSeq").closest('form').submit(); }
                else { $("#selectSeq").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#selectSeq').val();
                $("#selectSeq").select2("data", { id: a, text: a });
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
            if ($("#selectSeq", this).select2('val') != null && $("#selectSeq", this).select2('val') != '') {
                $("input", this).val($("#selectSeq", this).select2("data").text);

            }
        }
    });
}
function InitSequence() {
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassSelect2Sequence', TblGridSequence.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridSequence.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#selectSeq');
        //TblGridSequence.cell(cell.row, 10).data(id);
        TblGridSequence.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'select2SequenceE', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    // Resize all rows.
    $(TblGridSequenceId + ' tr').addClass('trclass');
}
function ShowSequenceColumns() {
    var cols = [
    { targets: [0], data: "id", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [1], data: "name", className: '', visible: true, searchable: true, width: "300px" },    
    { targets: [2], data: "sequence", className: 'ClassSelect2Sequence', visible: true, searchable: true, width: "0%" }
    ];
    return cols;
}
function ShowSequenceRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function BindSequence(data) {
    TblGridSequence = $(TblGridSequenceId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: true,
        searching: true,
        ordering: false,
        info: true,
        columns: ShowSequenceColumns(),
        bAutoWidth: false,
        scrollY: 450,
        scrollX: true,
        fnRowCallback: ShowSequenceRowCallBack(),
        iDisplayLength: 25
    });

    InitSequence();
}


