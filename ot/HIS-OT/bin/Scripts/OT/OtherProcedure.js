var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblSelectedProcedureList;
var TblSelectedProcedureId = "#gridSelectedProcedure";
var TblSelectedProcedureDataRow;



$(document).ready(function () {
     keydown();
 

    c.SetTitle("Other Procedure");
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

    
    setTimeout(function () {
        ShowList(-1);
    }, 1 * 100);

});
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // for future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();

    RedrawGrid();   
})
//$(document).keypress(function (e) {
//    IsModify = true;
//});


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
$(document).on("click", TblSelectedProcedureId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');
        TblSelectedProcedureDataRow = TblSelectedProcedureList.row($(this).parents('tr')).data();
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

        Action = 0;
        var id = TblGridListDataRow.ID;
        View(id);
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

        //if (!IsModify) {
        //    DefaultEmpty();
        //    c.ModalShow('#modalEntry', false);
        //    return;
        //}

        var YesFunc = function () {
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

        c.MessageBoxConfirm("Cancel Order?", "Are you sure you want to cancel this order?", YesFunc, NoFunc);

    });
    $('#btnEdit').click(function () {
        Action = 2;
        View(c.GetValue('#Id'));
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

    $('#btnAddProcedure').click(function () {
        var ctr = $(TblSelectedProcedureId).DataTable().rows().nodes().length + 1;
        TblSelectedProcedureList.row.add({
            "ServiceID": "",
            "No": ctr,
            "Name": "",
            "Quantity": "1"
        }).draw();
        InitSelectedProcedure();
    });
    $('#btnRemoveProcedure').click(function () {

        if (TblSelectedProcedureList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to be deleted.", null);
            return;
        }

        var YesFunc = function () {
            TblSelectedProcedureList.row('tr.selected').remove().draw(false);
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

    $('#select2PIN').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetPIN',
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
        c.SetSelect2('#select2Name', list[2], list[3]);
        c.SetSelect2('#select2BedNo', list[5], list[4]);
        FetchPatientDetails(list);
    });
    $('#select2Name').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetName',
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
        c.SetSelect2('#select2PIN', list[2], list[6]);
        c.SetSelect2('#select2BedNo', list[5], list[4]);
        FetchPatientDetails(list);
    });
    $('#select2BedNo').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetBedNo',
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
        c.SetSelect2('#select2PIN', list[2], list[6]);
        c.SetSelect2('#select2Name', list[2], list[3]);
        FetchPatientDetails(list);
    });
    $('#select2Doctor').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'select2Doctor',
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
    /*
        $('#dtOTStartDateTime').datetimepicker({
            pickTime: true
        }).on("dp.change", function (e) {
    
        });
        */
}
function InitDataTables() {
    BindSelectedProcedure([]);
}
function SetupDataTables() {
    SetupSelectedProcedure();
}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (TblGridList !== undefined) TblGridList.columns.adjust().draw();
    if (TblSelectedProcedureList !== undefined) TblSelectedProcedureList.columns.adjust().draw();

}

function DefaultReadOnly() {
    c.ReadOnly('#txtOrderNo', true);
    c.ReadOnly('#txtOperator', true);
    c.ReadOnly('#txtDateTime', true);
    //c.ReadOnly('#txtDoctorId', true);
    //c.ReadOnly('#txtDoctor', true);    
    c.ReadOnly('#txtDrugAllergies', true);
    c.ReadOnly('#txtAge', true);
    c.ReadOnly('#txtGender', true);
    c.ReadOnly('#txtBloodGroup', true);
}
function DefaultValues() {
    //    c.SetSelect2('#select2VacationType', '0', 'Normal');
    //    c.SetSelect2('#select2Category', '1', 'Local');
    //    c.iCheckSet('#iChkLast3Mos', true);
    //    c.SetRequired();
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
}
function DefaultEmpty() {
    IsModify = false;
    c.ClearAllText();
    c.ClearAlliCheck();

    c.ClearSelect2('#select2PIN');
    c.ClearSelect2('#select2Name');
    c.ClearSelect2('#select2BedNo');
    c.ClearSelect2('#select2Doctor');

    BindSelectedProcedure([]);
}

function Validated() {
    var req = false;


    var station = $('#ListOfStation').val();
    if (station == null) {
        c.MessageBoxErr('Error...', 'Please select a station in the upper right.');
        return false;
    }

    req = c.IsEmptySelect2('#select2PIN');
    if (req) {
        c.MessageBoxErr('Empty...', 'Please select a PIN / Name.');
        return false;
    }

    req = $(TblSelectedProcedureId).DataTable().rows().nodes().length == 0;
    if (req) {
        c.MessageBoxErr('Empty...', 'Please enter procedure on the list.');
        return false;
    }

    var tbl = $(TblSelectedProcedureId).DataTable();
    var ctr = 1;
    var required = '';
    $.each(tbl.rows().data(), function (i, row) {
        if (c.IsEmpty(row.Name)) {
            required = required + '<br>' + 'Select procedure for row ' + ctr;
        }
        if (c.IsEmpty(row.Quantity)) {
            required = required + '<br>' + 'Enter quantity for row ' + ctr;
        }
        ctr++;
    });
    if (required.length > 0) {
        c.MessageBoxErr('Please check the required entry on the list...', required);
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
        $('.ShowOnAdd').fadeIn('slow');
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

        c.DisableSelect2('#select2PIN', true);
        c.DisableSelect2('#select2Name', true);
        c.DisableSelect2('#select2BedNo', true);
        c.DisableSelect2('#select2Doctor', true);

        c.DisableDataTable('.gridReadOnly', true);

        c.ButtonDisable('#btnAddProcedure', true);
        c.ButtonDisable('#btnRemoveProcedure', true);

    }
    else if (Action == 1) { // add

        c.DisableSelect2('#select2PIN', false);
        c.DisableSelect2('#select2Name', false);
        c.DisableSelect2('#select2BedNo', false);
        c.DisableSelect2('#select2Doctor', false);

        c.DisableDataTable('.gridReadOnly', false);

        c.ButtonDisable('#btnAddProcedure', false);
        c.ButtonDisable('#btnRemoveProcedure', false);

    }
    else if (Action == 2) { // edit

        c.DisableSelect2('#select2PIN', true);
        c.DisableSelect2('#select2Name', true);
        c.DisableSelect2('#select2BedNo', true);
        c.DisableSelect2('#select2Doctor', false);

        c.DisableDataTable('.gridReadOnly', true);

        c.ButtonDisable('#btnAddProcedure', true);
        c.ButtonDisable('#btnRemoveProcedure', true);

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
    entry.CurrentStationID = $("#ListOfStation").val();
    entry.ID = c.GetValue('#Id');
    entry.IPID = c.GetSelect2Id('#select2PIN');
    entry.BedID = c.GetSelect2Id('#select2BedNo');
    //entry.DoctorID = c.GetValue('#txtDoctorId');
    entry.DoctorID = c.GetSelect2Id('#select2Doctor');

    var ctr = 0;
    var rowQty = 0;
    var rowServiceID;
    entry.OtherProceduresOrderDetail = [];
    $.each(TblSelectedProcedureList.rows().data(), function (i, row) {
        rowQty = row.Quantity;
        rowServiceID = row.ServiceID;
        while (ctr < rowQty) {
            entry.OtherProceduresOrderDetail.push({
                ServiceID: rowServiceID,
                Quantity: 1
            });
            ctr++;
        }
        ctr = 0;
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

                if (Action == 2) {
                    Action = 0;
                }
                else if (Action == 1) {
                    Action = -1;
                }
                else if (Action == 3) {
                    TblGridList.row('tr.selected').remove().draw(false);
                    Action = -1;
                }

                HandleEnableButtons();
                HandleEnableEntries();
                RedrawGrid();
            };

            c.MessageBox(data.Title, data.Message, OkFunc);

            var s = data.Message;
            var on = s.split(':');
            c.SetValue('#txtOrderNo', on[1]);

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
    var LastPrevDays = 120;
    var Url = baseURL + "ShowSelected";
    var param = {
        FromDateF: null,
        FromDateT: null,
        PIN: -1,
        ID: id,
        LastPrevDays: LastPrevDays,
        CurrentStationID:$("#ListOfStation").val()
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
        success: function (list) {
            $('#preloader').hide();
            $('.Show').show();

            if (list.length == 0) {
                Action = 1;
                HandleEnableButtons();
                HandleEnableEntries();
                RedrawGrid();
                return;
            }

            var data = list[0];

            c.SetValue('#Id', data.ID);
            c.SetValue('#Is24', data.Is24);

            c.SetSelect2('#select2PIN', data.IPID, data.PIN);
            c.SetSelect2('#select2Name', data.IPID, data.Name);
            c.SetSelect2('#select2BedNo', data.BedID, data.BedNo);

            c.SetValue('#txtOrderNo', data.OrderNo);
            c.SetValue('#txtOperator', data.OperatorName);
            c.SetValue('#txtDateTime', data.DateTime);
            //c.SetValue('#txtDoctor', data.DoctorIdName);
            c.SetValue('#txtAge', data.Age);
            c.SetValue('#txtGender', data.Gender);
            c.SetValue('#txtBloodGroup', data.BloodGroup);
            //c.SetValue('#txtDoctorId', data.DoctorID);
            c.SetSelect2('#select2Doctor', data.DoctorID, data.DoctorIdName);


            BindSelectedProcedure(data.OtherProceduresOrderDetail);
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
function Refresh() {
    ShowList(-1);
}

function ShowListColumns() {
    var cols = [
    { targets: [0], data: "ID", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "W", className: '', visible: true, searchable: false, width: "0%" },
    { targets: [2], data: "OrderNo", className: '', visible: true, searchable: false, width: "0%" },
    { targets: [3], data: "Name", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [4], data: "PIN", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [5], data: "BedNo", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [6], data: "DoctorIdName", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [7], data: "OperatorName", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [8], data: "DateTime", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [9], data: "Is24", className: '', visible: false, searchable: true, width: "0%" }
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
    var LastPrevDays = 120;
    var Url = baseURL + "ShowList";
    var param = {
        FromDateF: null,
        FromDateT: null,
        PIN: -1,
        ID: id,
        LastPrevDays: LastPrevDays,
        CurrentStationID: $("#ListOfStation").val()
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
    //    scrollY: 400,
    //    scrollX: true,
    //    fnRowCallback: ShowListRowCallBack()
    //});
    TblGridList = $(TblGridListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 380,
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


}


function ShowSelectedProcedureColumns() {
    var Is24 = c.GetValue('#Is24')==1;
    var cols = [
    { targets: [0], data: "ServiceID", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "No", className: '', visible: true, searchable: false, width: "5%" },
    {
        targets: [2], data: "Name"
        , className: Action == 1 ? 'ClassSelect2TOtherProcedure': ''
        , visible: true, searchable: true, width: "60%"
    },
    {
        targets: [3], data: "Quantity"
        , className: (Action == 2 && Is24==false) || Action == 1 ? 'ClassTxtQty' : ''
        , visible: true, searchable: true, width: "15%"
    },
    ];
    return cols;
}
function ShowSelectedProcedureRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function SetupSelectedProcedure() {

    $.editable.addInputType('txtQty', {
        element: function (settings, original) {

            var input = $('<input id="txtQty" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        }
    });
    $.editable.addInputType('select2TOtherProcedure', {
        element: function (settings, original) {
            var input = $('<input id="select2TOtherProcedure" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#select2TOtherProcedure').select2({
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    cache: false,
                    quietMillis: 150,
                    url: baseURL + 'Select2GetOtherProcedures',
                    dataType: 'jsonp',
                    data: function (term, page) {
                        return {
                            pageSize: pageSize,
                            pageNum: page,
                            searchTerm: term,
                            SurgeryRecordId: 0,
                            IsSelected: 0
                        };
                    },
                    results: function (data, page) {
                        var more = (page * pageSize) < data.Total;
                        return { results: data.Results, more: more };
                    }
                }
            }).on("select2-blur", function () {
                $("#select2TOtherProcedure").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#select2TOtherProcedure").closest('form').submit(); }
                else { $("#select2TOtherProcedure").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#select2TOtherProcedure').val();
                $("#select2TOtherProcedure").select2("data", { id: a, text: a });
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
            if ($("#select2TOtherProcedure", this).select2('val') != null && $("#select2TOtherProcedure", this).select2('val') != '') {
                $("input", this).val($("#select2TOtherProcedure", this).select2("data").text);

            }
        }
    });
    //$.editable.addInputType('txtRegNo', {
    //    element: function (settings, original) {

    //        var input = $('<input id="txtRegNo" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
    //        $(this).append(input);

    //        return (input);
    //    },
    //    plugin: function (settings, original) {
    //        $(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
    //    }

    //});



}
function InitSelectedProcedure() {

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    //$('.ClassTxtQty', TblSelectedProcedureList.rows().nodes()).editable(function (sVal, settings) {
    //    var cell = TblSelectedProcedureList.cell($(this).closest('td')).index();
    //    TblSelectedProcedureList.cell(cell.row, cell.column).data(sVal);
    //    return sVal;
    //},
    //{
    //    //"type": 'txtQty', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
    //    "type": 'txtQty', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { },
    //    "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    //});
    $('.ClassTxtQty', TblSelectedProcedureList.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblSelectedProcedureList.cell($(this).closest('td')).index();
        TblSelectedProcedureList.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'txtQty', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassSelect2TOtherProcedure', TblSelectedProcedureList.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblSelectedProcedureList.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#select2TOtherProcedure');
        TblSelectedProcedureList.cell(cell.row, 0).data(id);
        TblSelectedProcedureList.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'select2TOtherProcedure', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    //$('.ClassRegNo', TblSelectedProcedureList.rows().nodes()).editable(function (sVal, settings) {
    //    var cell = TblSelectedProcedureList.cell($(this).closest('td')).index();
    //    TblSelectedProcedureList.cell(cell.row, cell.column).data(sVal);
    //    return sVal;
    //},
    //{
    //    "type": 'txtRegNo', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
    //    "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    //});

    // Resize all rows.
    $(TblSelectedProcedureId + ' tr').addClass('trclass');

}
function BindSelectedProcedure(data) {
    //TblSelectedProcedureList = $(TblSelectedProcedureId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: false,
    //    ordering: false,
    //    info: false,
    //    columns: ShowSelectedProcedureColumns(),
    //    bAutoWidth: false,
    //    scrollY: 350,
    //    scrollX: true,
    //    fnRowCallback: ShowSelectedProcedureRowCallBack()
    //});
    TblSelectedProcedureList = $(TblSelectedProcedureId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 320,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        fnRowCallback: ShowSelectedProcedureRowCallBack(),
        columns: ShowSelectedProcedureColumns()
    });

    if (Action == 1) // Add
    {
        InitSelectedProcedure();
    }


    //if (Action == 2 || Action == 0 ) {
    //    // Edit and View
    //    TblSelectedProcedureList = $(TblSelectedProcedureId).DataTable({
    //        data: data,
    //        cache: false,
    //        destroy: true,
    //        paging: false,
    //        searching: false,
    //        ordering: false,
    //        info: false,
    //        columns: ShowSelectedProcedureColumnsOnEdit(),
    //        bAutoWidth: false,
    //        scrollY: 350,
    //        scrollX: true,
    //        fnRowCallback: ShowSelectedProcedureRowCallBack()
    //    });
    //    InitSelectedProcedure();
    //}
    //else if (Action == 1) {
    //    // Add
    //    TblSelectedProcedureList = $(TblSelectedProcedureId).DataTable({
    //        data: data,
    //        cache: false,
    //        destroy: true,
    //        paging: false,
    //        searching: false,
    //        ordering: false,
    //        info: false,
    //        columns: ShowSelectedProcedureColumns(),
    //        bAutoWidth: false,
    //        scrollY: 350,
    //        scrollX: true,
    //        fnRowCallback: ShowSelectedProcedureRowCallBack()
    //    });
    //    InitSelectedProcedure();
    //}    

    //TblSelectedProcedureList = $(TblSelectedProcedureId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: false,
    //    ordering: false,
    //    info: false,
    //    columns: ShowSelectedProcedureColumns(),
    //    bAutoWidth: false,
    //    scrollY: 350,
    //    scrollX: true,
    //    fnRowCallback: ShowSelectedProcedureRowCallBack()
    //});

    //if (Action == 1) // Add
    //{
    //    InitSelectedProcedure();
    //}
}


function FetchPatientDetails(list) {
    c.SetValue('#txtWard', list[7]);
    c.SetValue('#txtAge', list[8]);
    c.SetValue('#txtGender', list[9]);
    //c.SetValue('#txtDoctor', list[10]);
    c.SetValue('#txtPackage', list[11]);
    c.SetValue('#txtCompany', list[13]);
    c.SetValue('#txtCategory', list[14]);
    c.SetValue('#txtBloodGroup', list[15]);
    //c.SetValue('#txtDoctorId', list[16]);
    c.SetSelect2('#select2Doctor', list[16], list[10]);
}


let key_first = "";
let key_second = "";
function keydown() {

    $(document).bind('keydown', 'alt+n', function () {
        console.log('alt+n');
        $('#btnNewEntry').trigger('click');
    });

    $(document).bind('keydown', 'alt+r', function () {
        console.log('alt+r');
        $('#btnRefresh').trigger('click');
    });

    $(document).bind('keydown', 'alt+v', function () {
        console.log('alt+v');
        $('#btnView').trigger('click');
    });

    $(document).bind('keydown', 'alt+c', function () {
        console.log('alt+c');
        $('#btnClose').trigger('click');
    });

    $(document).bind('keydown', 'alt+s', function () {
        console.log('alt+s');
        $('#btnSave').trigger('click');
    });

 

    
    

  /* The syntax is as follows:

    $(expression).bind(types, keys, handler);
    $(expression).unbind(types, handler);

    $(document).bind('keydown', 'ctrl+a', fn);

    // e.g. replace '$' sign with 'EUR'
    $('input.foo').bind('keyup', '$', function () {
        this.value = this.value.replace('$', 'EUR');
    });
    Syntax when wanting to use jQuery's on()/off methods:

    $(expression).on(types, null, keys, handler);
    $(expression).off(types, handler);

    $(document).on('keydown', null, 'ctrl+a', fn);

    // e.g. replace '$' sign with 'EUR'
    $('input.foo').on('keyup', null, '$', function () {
        this.value = this.value.replace('$', 'EUR');
    });   
    */
}

 



