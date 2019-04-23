
var c = new Common();
var Action = 1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblSampleCollection;
var TblSampleCollectionId = "#gridSampleCollection";
var TblSampleCollectionDataRow;
var TblSampleCollectionChkIndex = 3;

$(document).ready(function () {

    c.SetTitle("IP Investigation");
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

    //ShowList();

    setTimeout(function () {
        ShowList();
    }, 1 * 100);


});
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // for future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();

    //TblSelectedProcedureList.columns.adjust().draw();
    TblGridList.columns.adjust().draw();
    TblSampleCollection.columns.adjust().draw();
})
//$("#modalSample").on('shown.bs.modal', function (event) {
//    setTimeout(function () {
//        if (TblSampleCollection != undefined || TblSampleCollection != null) {
//            TblSampleCollection.columns.adjust().draw();
//        }
//    }, 1 * 250);
//});

$(document).keypress(function (e) {
    IsModify = true;
});

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

//        TblGridListDataRow = TblGridList.row($(this).parents('tr')).data();
//        var id = TblGridListDataRow.ID;
//        Action = 0;
        //        View(id);

        if (TblGridList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }

        Action = 0;
        var id = TblGridListDataRow.ID;
        View(id);

        

    }
});

$(document).on("click", "#chkCollectAll", function () {

    if ($('#chkCollectAll').is(':checked')) {
        $.each(TblSampleCollection.rows().data(), function (i, row) {
            TblSampleCollection.cell(i, TblSampleCollectionChkIndex).data('<input type="checkbox" class="Selected" checked="checked" >');
        });
    } else {
        $.each(TblSampleCollection.rows().data(), function (i, row) {
            TblSampleCollection.cell(i, TblSampleCollectionChkIndex).data('<input type="checkbox" class="Selected">');
        });
    }

});

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

        Action = 0;
        var id = TblGridListDataRow.ID;
        View(id);

    });
    $('#btnNewEntry').click(function () {
        
        Action = 1;
        c.ModalShow('#modalEntry', true);
        DefaultDisable();
        DefaultReadOnly();
        DefaultEmpty();
        DefaultValues();
        InitDataTables();
        HandleEnableButtons();
        HandleEnableEntries();
        c.SetActiveTab('sectionA');
    });
    $('#btnCloseFilter').click(function () {
        c.ModalShow('#modalFilter', false);
    });
    $('#btnSample').click(function () {
        ShowSampleCollection();        
    });

    $('#btnClose').click(function () {
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

        if (!IsModify) {
            DefaultEmpty();
            c.ModalShow('#modalEntry', false);
            return;
        }

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
            c.ModalShow('#modalEntry', false);
        };

        var NoFunc = function () {
        };

        c.MessageBoxConfirm("Cancel Order?", "Are you sure you want to cancel this order?", YesFunc, NoFunc);

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

    $('#btnCloseSample').click(function () {
        c.ModalShow('#modalSample', false);
    });
    $('#btnCollect').click(function () {
        Collect();
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

    $('#iChkPhlebotomy').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
        c.SetDateTimePicker('#dtCollectSample', checked ? moment() : "");
        c.DisableDateTimePicker('#dtCollectSample', !checked);
    });

}
function InitSelect2() {

    $('#select2PIN').select2({
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
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2IPInvestigationDoctor',
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

    $('#select2Status').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetLabPatientStatus',
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
    $('#select2Priority').select2({
        data: [{ id: 0, text: 'Normal' }, { id: 1, text: 'Stat'}],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added.list;
    });
    $('#select2ToBeDoneAt').select2({
        data: [{ id: 0, text: 'Lab' }, { id: 1, text: 'BedSide'}],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added.list;
    });

    $("#select2SelectedTest").select2({
        data: [],
        minimumInputLength: 0,
        tags: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetAllTest',
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
            success: function () {

            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    });    
    

}
function InitDateTimePicker() {

    $('#dtCollectSample').datetimepicker({
        pickTime: true
    }).on("dp.change", function (e) {

    });
    
}
function InitDataTables() {
    //    BindSelectedProcedure([]);
    BindSampleCollection([]);
}
function SetupDataTables() {
    // SetupSelectedProcedure();
    SetupSampleCollection();
}

function DefaultReadOnly() {
    c.ReadOnly('#txtDoctor', true);
    c.ReadOnly('#txtDoctorId', true);
    c.ReadOnly('#txtDrugAllergies', true);
    c.ReadOnly('#txtAge', true);
    c.ReadOnly('#txtGender', true);
    c.ReadOnly('#txtBloodGroup', true);
    c.ReadOnly('#txtOperator', true);
    c.ReadOnly('#txtWard', true);
    c.ReadOnly('#txtDateTime', true);
    c.ReadOnly('#txtOrderNo', true);

    c.ReadOnly('#txtSOrderNo', true);
    c.ReadOnly('#txtSPIN', true);
    c.ReadOnly('#txtSName', true);
    c.ReadOnly('#txtSBedNo', true);
}
function DefaultValues() {
    c.SetSelect2('#select2Priority', '0', 'Normal');
    c.SetSelect2('#select2ToBeDoneAt', '0', 'Lab');
    c.SetDateTimePicker('#dtCollectSample', moment());
    c.iCheckSet('#iChkPhlebotomy', true);
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
}
function DefaultEmpty() {
    IsModify = false;
    c.ClearAllText();
    c.ClearAlliCheck();

    c.Select2Clear('#select2PIN');
    c.Select2Clear('#select2Name');
    c.Select2Clear('#select2BedNo');
    c.Select2Clear('#select2Status');
    c.Select2Clear('#select2SelectedTest');

    c.SetDateTimePicker('#dtCollectSample', '');

    c.SetValue('#txtRemarks', '');

    InitDataTables();
}

function Validated() {
    var req = false;


    var station = $('#ListOfStation').val();
    if (station == null) {
        c.MessageBoxErr('Error...', 'Please select a station in the upper right.');
        return false;
    }

    req = !c.IsDate('#dtCollectSample');
    if (req) {
        c.MessageBoxErr('Invalid...', 'Invalid Date on Collect Sample at Phlebotomy.');
        return false;
    }

    req = c.IsEmptySelect2('#select2PIN');
    if (req) {
        c.MessageBoxErr('Empty...', 'Please select a PIN / Name.');
        return false;
    }

    req = c.IsEmptySelect2('#select2Status');
    if (req) {
        c.MessageBoxErr('Empty...', 'Please select a status.');
        return false;
    }

    var arr = $('#select2SelectedTest').val()
    req = arr.length == 0;
    if (req) {
        c.MessageBoxErr('Empty...', 'Please enter a selected test.');
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

    HandleButtonNotUse();
}
function HandleEnableEntries() {
    // VAED
    if (Action == 0 || Action == 3) { // view or delete

        c.DisableSelect2('#select2PIN', true);
        c.DisableSelect2('#select2Name', true);
        c.DisableSelect2('#select2BedNo', true);
        c.DisableSelect2('#select2Doctor', true);
        c.DisableSelect2('#select2Status', true);
        c.DisableSelect2('#select2Priority', true);
        c.DisableSelect2('#select2ToBeDoneAt', true);
        c.DisableSelect2('#select2SelectedTest', true);

        c.iCheckDisable('#iChkPhlebotomy', true);

        c.Disable('#txtRemarks', true);

    }
    else if (Action == 1) { // Add

        c.DisableSelect2('#select2PIN', false);
        c.DisableSelect2('#select2Name', false);
        c.DisableSelect2('#select2BedNo', false);
        c.DisableSelect2('#select2Doctor', false);
        c.DisableSelect2('#select2Status', false);
        c.DisableSelect2('#select2Priority', false);
        c.DisableSelect2('#select2ToBeDoneAt', false);
        c.DisableSelect2('#select2SelectedTest', false);

        c.iCheckDisable('#iChkPhlebotomy', false);

        c.Disable('#txtRemarks', false);

    }
    else if (Action == 2) { // edit

        c.DisableSelect2('#select2PIN', true);
        c.DisableSelect2('#select2Name', true);
        c.DisableSelect2('#select2BedNo', true);
        c.DisableSelect2('#select2Doctor', false);
        c.DisableSelect2('#select2Status', false);
        c.DisableSelect2('#select2Priority', false);
        c.DisableSelect2('#select2ToBeDoneAt', false);
        c.DisableSelect2('#select2SelectedTest', true);

        c.iCheckDisable('#iChkPhlebotomy', false);

        c.Disable('#txtRemarks', false);

    }

}
function HandleButtonNotUse() {
    $('.NotUse').hide();
}

function Collect(datarow) {
    // var rowcollectionChecked = TblSampleCollection.$("#chkCollect:checked", { "page": "all" });

    c.ButtonDisable('#btnCollect', true);

    $('#preloader').show();
    $('.Hide').hide();

    var entry;
    entry = [];
    entry = {};
    entry.ID = datarow.ID;
    entry.CurrentStationID = $("#ListOfStation").val();

    entry.RequestedTest = [];
    entry.RequestedTest.push({
        OrderID: datarow.ID,
        SampleID: datarow.sampleid
    });

    $.ajax({
        url: baseURL + 'Collect',
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            c.ButtonDisable('#btnCollect', true);
        },
        success: function (data) {
            $('#preloader').hide();
            $('.Show').show();

            c.ButtonDisable('#btnCollect', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {
                Action = 0;
                HandleEnableButtons();
                HandleEnableEntries();
            };

            ShowSampleCollection();

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            $('.Show').show();

            c.ButtonDisable('#btnCollect', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

}
function CollectUndo(datarow) {
    // var rowcollectionChecked = TblSampleCollection.$("#chkCollect:checked", { "page": "all" });

    c.ButtonDisable('#btnCollect', true);

    $('#preloader').show();
    $('.Hide').hide();

    var entry;
    entry = [];
    entry = {};
    entry.ID = datarow.ID;
    entry.CurrentStationID = $("#ListOfStation").val();

    entry.RequestedTest = [];
    entry.RequestedTest.push({
        OrderID: datarow.ID,
        SampleID: datarow.sampleid
    });

    $.ajax({
        url: baseURL + 'CollectUndo',
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            c.ButtonDisable('#btnCollect', true);
        },
        success: function (data) {
            $('#preloader').hide();
            $('.Show').show();

            c.ButtonDisable('#btnCollect', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            ShowSampleCollection();

            Action = 0;
            HandleEnableButtons();
            HandleEnableEntries();

        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            $('.Show').show();

            c.ButtonDisable('#btnCollect', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

}
function Save() {

    var ret = Validated();
    if (!ret) return ret;

    c.ButtonDisable('#btnSave', true);

    var entry;
    entry = [];
    entry = {};
    entry.Action = Action;
    entry.ID = c.GetValue('#Id');
    entry.CurrentStationID = $("#ListOfStation").val();
    entry.BedID = c.GetSelect2Id('#select2BedNo');
    entry.IPID = c.GetSelect2Id('#select2PIN');
    entry.Priority = c.GetSelect2Id('#select2Priority');
    entry.ToBeDoneAt = c.GetSelect2Id('#select2ToBeDoneAt');
    entry.Remarks = c.GetValue('#txtRemarks');
    //entry.DoctorID = c.GetValue('#txtDoctorId');
    entry.DoctorID = c.GetSelect2Id('#select2Doctor');
    entry.ToBeDoneBy = c.GetDateTimePickerDateTime('#dtCollectSample');
    entry.Phlebotomy = c.GetICheck('#iChkPhlebotomy');
    entry.patientstatus = c.GetSelect2Id('#select2Status');

    var arr = $('#select2SelectedTest').val();
    entry.RequestedTest = [];
    $.each(arr.split(','), function (i, val) {
        entry.RequestedTest.push({            
            ServiceID: val
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
                    TblGridList.row('tr.selected').remove().draw(false);
                }

                Action = 0;
                HandleEnableButtons();
                HandleEnableEntries();
            };

            c.MessageBox(data.Title, data.Message, OkFunc);

            var s = data.Message;
            var on = s.split(':');
            c.SetValue('#txtOrderNo', on[1]);

            //Command: toastr["success"](data.Message, data.Title)
            //OkFunc();

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
        LastPrevDays: LastPrevDays
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
                c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
                TblGridList.row('tr.selected').remove().draw(false);
                return;
            }

            var data = list[0];

            c.SetValue('#Id', data.ID);
            c.SetSelect2('#select2PIN', data.IPID, data.PIN);
            c.SetSelect2('#select2Name', data.IPID, data.Name);
            c.SetSelect2('#select2BedNo', data.BedId, data.BedNo);
            c.SetSelect2('#select2Doctor', data.DoctorID, data.DoctorIdName);

            c.SetSelect2('#select2Status', data.Exstatus, data.Status);
            c.SetSelect2('#select2Priority', data.Priority, data.Priority=="0"? "Normal": "Stat");
            c.SetSelect2('#select2ToBeDoneAt', data.ToBeDoneAt, data.ToBeDoneAt=="0"? "Lab":"BedSide");
            c.SetSelect2List('#select2SelectedTest', data.RequestedTestSelected);

            c.SetValue('#txtOrderNo', data.RequisitionNo);
            //c.SetValue('#txtDoctor', data.DoctorIdName);
            //c.SetValue('#txtDoctorId', data.DoctorID);
            c.SetValue('#txtDrugAllergies', "");
            c.SetValue('#txtAge', data.Age);
            c.SetValue('#txtGender', data.Gender);
            c.SetValue('#txtBloodGroup', data.BloodGroup);
            c.SetValue('#txtOperator', data.OperatorName);
            c.SetValue('#txtWard', data.Ward);
            c.SetValue('#txtDateTime', data.DateTimeD);
            c.SetValue('#txtRemarks', data.Remarks);
            c.iCheckSet('#iChkPhlebotomy', data.Phlebotomy=="1" ? true:false);

            c.SetDateTimePicker('#dtCollectSample', data.ToBeDoneByD);

            HandleEnableButtons();
            HandleEnableEntries();
            c.ModalShow('#modalEntry', true);

        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });
}
function Refresh() {
    ShowList();
}


function ShowListColumns() {
    var cols = [
    { targets: [0], data: "ID", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "W", className: '', visible: true, searchable: false, width: "0%" },
    { targets: [2], data: "RequisitionNo", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [3], data: "Name", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [4], data: "PIN", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [5], data: "BedNo", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [6], data: "DateTimeD", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [7], data: "OperatorName", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [8], data: "Executed", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [9], data: "Stat", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [10], data: "Priority", className: '', visible: false, searchable: true, width: "0%" }
    ]
    return cols;
}
function ShowListRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['Stat'];
        var $nRow = $(nRow);
        if (value == 1) {
            $nRow.css({ "background-color": "#b7f5ff" })
        }
        else if (value == 2) {
            $nRow.css({ "background-color": "#ffffe5" })
        }
        else if (value == 3) {
            $nRow.css({ "background-color": "#fcc9c9" })
        }

        if (aData['Priority'] == 1) { // Stat Request Type
            //$('td:eq(0)', nRow).addClass("btn-data-priority");
            $('td:eq(0)', nRow).css({ "background-color": "#f98181" })
        }
    };
    return rc;
}
function ShowList() {
    var Url = baseURL + "ShowList";
    var param = {
        FromDateF: "",
        FromDateT: "",
        StationId: "-1",
        CurrentStationID: $("#ListOfStation").val()
    }

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

function handleCheckTag(e) {

    $row = $(e).parents('tr');

    // Set the TestICheck column when check or not.
    TblSampleCollection.cell($row, 9).data(e.checked ? 1 : 0);

    var datarow = TblSampleCollection.row($row).data();

    if (e.checked) {
        Collect(datarow);
    }
    else if (!e.checked) {

        var YesFunc = function () {
            CollectUndo(datarow);
        };
        var NoFunc = function () {
            e.checked = true;
        };

        c.MessageBoxConfirm("Cancel...", "Test already done...  <br> Are you sure you want to undo the collected sample?", YesFunc, NoFunc);

    }
}

var ctr = 1;
function ShowSampleCollectionColumns() {
    var cols = [
    { targets: [0], data: "profile", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "SNo", className: '', visible: true, searchable: true, width: "2%" },
    { targets: [2], data: "StationName", className: '', visible: true, searchable: true, width: "8%" },
    { targets: [3], data: "", className: 'cAR-align-center', visible: true, width: "2%", defaultContent: '<input type="checkbox" id="chkCollect" onclick="handleCheckTag(this)" />' },
    { targets: [4], data: "TestName", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [5], data: "Sample", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [6], data: "Comments", className: '', visible: true, searchable: false, width: "10%" },
    { targets: [7], data: "OID", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [8], data: "sampleid", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [9], data: "TestIChk", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [10], data: "ServiceID", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [11], data: "Stat", className: '', visible: false, searchable: false, width: "0%" }
    ]
    return cols;
}
function ShowSampleCollectionRowCallBack() {
    ctr = 1;
    var rc = function (nRow, aData) {
        var value = aData['sampleid'];
        var $nRow = $(nRow);
        if (aData.sampleid.length != 0) {
            $('#chkCollect', nRow).prop('checked', aData.TestIChk == 1);
            $('td:eq(0)', nRow).html(ctr.toString());
            ctr++;
        }

        if (aData['Stat'] == 2) { // Stat Request Type
            // yellow
            $('td:eq(2)', nRow).css({ "background-color": "#ffffe5" })
        }
        else if (aData['Stat'] == 3) { // Stat Request Type
            // light red
            $('td:eq(2)', nRow).css({ "background-color": "#fcc9c9" })
        }
    };
    return rc;
}
function ShowSampleCollection() {
    var Url = baseURL + "SampleCollectionResultList";
    var id = TblGridListDataRow.ID;
    var param = {
        Id: id
    }

    $('#preloader').show();

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

            c.SetValue('#txtSOrderNo', TblGridListDataRow.OrderNo);
            c.SetValue('#txtSPIN', TblGridListDataRow.PIN);
            c.SetValue('#txtSName', TblGridListDataRow.Name);
            c.SetValue('#txtSBedNo', TblGridListDataRow.BedNo);

            BindSampleCollection(data);
            c.ModalShow('#modalSample', true);

            TblSampleCollection.columns.adjust().draw();
            
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindSampleCollection(data) {
    var cols = 6;
    //TblSampleCollection = $(TblSampleCollectionId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowSampleCollectionColumns(),
    //    bAutoWidth: false,
    //    scrollY: 400,
    //    scrollX: "100%",
    //    fnRowCallback: ShowSampleCollectionRowCallBack(),
    //    drawCallback: function (settings) {
    //        var api = this.api();
    //        var rows = api.rows({ page: 'current' }).nodes();
    //        var last = null;

    //        api.column(0, { page: 'current' }).data().each(function (group, i) {
    //            if (last !== group) {
    //                $(rows).eq(i).before(
    //                            '<tr class="group"><td style="text-align:center; vertical-align:middle;" colspan="' + cols + '">' + group + '</td></tr>'
    //                        );

    //                last = group;
    //            }
    //        });
    //    }
    //});
    TblSampleCollection = $(TblSampleCollectionId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 300,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        fnRowCallback: ShowSampleCollectionRowCallBack(),
        columns: ShowSampleCollectionColumns(),
        drawCallback: function (settings) {
            var api = this.api();
            var rows = api.rows({ page: 'current' }).nodes();
            var last = null;

            api.column(0, { page: 'current' }).data().each(function (group, i) {
                if (last !== group) {
                    $(rows).eq(i).before(
                                '<tr class="group"><td style="text-align:center; vertical-align:middle;" colspan="' + cols + '">' + group + '</td></tr>'
                            );

                    last = group;
                }
            });
        }
    });



    InitSampleCollection();
}
function SetupSampleCollection() {

    $.editable.addInputType('iChkCollect', {
        element: function (settings, original) {
            var input = $('<input id="iChkCollect" type="checkbox"/>');
            $(this).append(input);

            return (input);
        }
    });

}
function InitSampleCollection() {

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassIChkCollect', TblSampleCollection.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblSampleCollection.cell($(this).closest('td')).index();
        TblSampleCollection.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'iChkCollect', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    // Resize all rows.
    //$(TblSampleCollectionId + ' tr').addClass('trclass');

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