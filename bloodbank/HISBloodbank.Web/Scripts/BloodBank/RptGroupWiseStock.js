﻿var c = new Common();
var Action = 0;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var reportType = 0;

$(document).ready(function () {

    c.SetTitle("Donor Group Wise Stock");
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

    //HandleEnableButtons();
    //HandleEnableEntries();

    //ShowList();
    //BindSearch([]);
    //ShowSearch();

    c.ModalShow('#modalReport', true);
    GenerateReport();

    c.ResizeDiv('#reportBorder', reportHeight);
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



$(window).on("resize", function () {
    c.ResizeDiv('#reportBorder', reportHeight);
});
$('#myReport').on('load', function () {
    $('.loading').hide();
});
function GenerateReport() {
    $('.loading').show();

    var $report = $("#myReport");
    var UserId = "";
    var optionname = c.GetSelect2Text('#select2Option');
    var bloodgroupid = c.GetSelect2Id('#select2BloodGroup');
    var bloodgroupname = c.GetSelect2Text('#select2BloodGroup');
    var componentid = c.GetSelect2Id('#select2BloodComponent');
    var componentname = c.GetSelect2Text('#select2BloodComponent');
    

    var dlink = "";
    var repsrc = "";
    debugger;
    if (reportType == 0) {
        //dlink = hissystem.appsserver() + hissystem.appsname() + "/HISBLOODBANK/Areas/BloodBank/Reports/RptGroupWiseStock/RptGroupWiseStockBlood.aspx";
        dlink = hissystem.appsserver() + hissystem.appsname() + "/Areas/BloodBank/Reports/RptGroupWiseStock/RptGroupWiseStockBlood.aspx";
        repsrc = dlink + "?UserId=" + UserId + "&bloodgroupid=" + bloodgroupid + "&bloodgroupname=" + bloodgroupname + "&optionname=" + optionname;
    }
    else if (reportType == 1) {
        //dlink = hissystem.appsserver() + hissystem.appsname() + "/HISBLOODBANK/Areas/BloodBank/Reports/RptGroupWiseStock/RptGroupWiseStockComponent.aspx";
        dlink = hissystem.appsserver() + hissystem.appsname() + "/Areas/BloodBank/Reports/RptGroupWiseStock/RptGroupWiseStockComponent.aspx";
        repsrc = dlink + "?UserId=" + UserId + "&bloodgroupid=" + bloodgroupid + "&bloodgroupname=" + bloodgroupname + "&optionname=" + optionname + "&componentid=" + componentid + "&componentname=" + componentname;
    }
    else if (reportType == 2) {
        //dlink = hissystem.appsserver() + hissystem.appsname() + "/HISBLOODBANK/Areas/BloodBank/Reports/RptGroupWiseStock/RptGroupWiseStockSDPLR.aspx";
        dlink = hissystem.appsserver() + hissystem.appsname() + "/Areas/BloodBank/Reports/RptGroupWiseStock/RptGroupWiseStockSDPLR.aspx";
        repsrc = dlink + "?UserId=" + UserId + "&bloodgroupid=" + bloodgroupid + "&bloodgroupname=" + bloodgroupname + "&optionname=" + optionname;
    }
    
    
    c.LoadInIframe("myReport", repsrc);
}


function Refresh() {
    ShowList();
}
function InitButton() {
    $('#btnRefresh').click(function () {
        ShowList();
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


    $('#btnFilter').click(function () {
        c.ModalShow('#modalReport', true);
        $('#btnFilterReport').click();
    });
    $('#btnCloseReport').click(function () {
        c.ModalShow('#modalReport', false);
    });

    $('#btnFilterReport').click(function () {
        c.ModalShow('#FrmFilterReport', true);
    });
    $('#btnCloseFilterReport').click(function () {
        c.ModalShow('#FrmFilterReport', false);
    });
    $('#btnViewFilterReport').click(function () {
        if (!Validated()) return;
        $('#btnCloseFilterReport').click();
        GenerateReport();
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

        Action = 1;
        DefaultEmpty();
        DefaultValues();
        HandleEnableButtons();
        HandleEnableEntries();

        return;

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
    $('#iChkClear').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
    });

    $('#iChkModifyLastApproved').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

        c.Disable('#txtSequence3', !checked);
        c.DisableSelect2('#select2Position3', !checked);
        c.DisableSelect2('#select2Status3', !checked);

        if (!checked) {
            c.SetValue('#txtSequence3', '');
            c.ClearSelect2('#select2Position3');
            c.ClearSelect2('#select2Status3');
        }

    });
    $('#iChkModifyForApproval').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

        c.Disable('#txtSequence4', !checked);
        c.DisableSelect2('#select2Position4', !checked);
        c.DisableSelect2('#select2Status4', !checked);

        if (!checked) {
            c.SetValue('#txtSequence4', '');
            c.ClearSelect2('#select2Position4');
            c.ClearSelect2('#select2Status4');
        }

    });

    // $('#iChkPending, #iChkOnHold').iCheck('check');
}
function InitSelect2() {
    

    $('#select2Option').select2({
        data: [
            { id: 0, text: 'Blood' },
            { id: 1, text: 'Component' },
            { id: 2, text: 'SDPLR' }
        ],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;

        reportType = list.id;

        $('#rowType').hide();
        if (reportType == 0) {
            
        }
        else if (reportType == 1) {
            $('#rowType').show();
        }
        else if (reportType == 2) {

        }
        


    });
    $('#select2BloodGroup').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2RptBloodGroupWithAll',
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
    $('#select2BloodComponent').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2RptBloodComponent',
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
    //$('#select2OnlineTypeFilter').select2({
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2GetHROnlineProcess',
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
    //$('#select2Employee').select2({
    //    containerCssClass: "RequiredField",
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2ModifyFlowEmployee',
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
    //    c.SetSelect2('#select2EmployeeFilter', list[0], list[1]);
    //    c.SetValue('#txtPosition', list[3]);
    //    c.SetValue('#txtDepartment', list[2]);
    //    c.DisableSelect2('#select2Leave', false);
    //});
    //$('#select2Process').select2({
    //    containerCssClass: "RequiredField",
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2ModifyFlowProcess',
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
    //    c.SetSelect2('#select2OnlineTypeFilter', list[0], list[1]);

    //});
    //$('#select2Leave').select2({
    //    containerCssClass: "RequiredField",
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2ModifyFlowLeave',
    //        dataType: 'jsonp',
    //        cache: false,
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term,
    //                EmpID: c.GetSelect2Id('#select2Employee')
    //            };
    //        },
    //        results: function (data, page) {
    //            var more = (page * pageSize) < data.Total;
    //            return { results: data.Results, more: more };
    //        }
    //    }
    //}).change(function (e) {
    //    var list = e.added.list;
    //    c.SetValue('#Id', list[0]);

    //    c.SetValue('#txtSequence1', list[2] == 0 ? "" : list[2]);
    //    c.SetSelect2('#select2Position1', list[8], list[3] == null ? "" : list[3]);
    //    c.SetSelect2('#select2Status1', list[9], list[4] == null ? "" : list[4]);

    //    c.SetValue('#txtSequence2', list[5] == 0 ? "" : list[5]);
    //    c.SetSelect2('#select2Position2', list[10], list[6] == null ? "" : list[6]);
    //    c.SetSelect2('#select2Status2', list[11], list[7] = null ? "" : list[7]);

    //    c.SetValue('#LeaveID', list[12]);
    //    c.SetValue('#LeaveIDName', list[13]);
    //    c.SetSelect2('#select2LeaveTypeFilter', list[12], list[13] = null ? "" : list[13]);

    //    //if (list[2] == 0 || list[2].length==0) {
    //    //    $('#r3').hide();
    //    //}
    //    //else {
    //    //    $('#r3').show();
    //    //}

    //    //if (list[5] == 0 || list[5].length == 0) {
    //    //    $('#r4').hide();
    //    //}
    //    //else {
    //    //    $('#r4').show();
    //    //}

    //});

    //$('#select2Position1').select2({
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2ModifyFlowLeave',
    //        dataType: 'jsonp',
    //        cache: false,
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term,
    //                EmpID: c.GetSelect2Id('#select2Employee')
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
    //$('#select2Status1').select2({
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2ModifyFlowLeave',
    //        dataType: 'jsonp',
    //        cache: false,
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term,
    //                EmpID: c.GetSelect2Id('#select2Employee')
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
    //$('#select2Position2').select2({
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2ModifyFlowLeave',
    //        dataType: 'jsonp',
    //        cache: false,
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term,
    //                EmpID: c.GetSelect2Id('#select2Employee')
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
    //$('#select2Status2').select2({
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2ModifyFlowLeave',
    //        dataType: 'jsonp',
    //        cache: false,
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term,
    //                EmpID: c.GetSelect2Id('#select2Employee')
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

    //$('#select2Position3').select2({
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2ModifyFlowEmployeePositions',
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
    //$('#select2Position4').select2({
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2ModifyFlowEmployeePositions',
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
    //$('#select2Status3').select2({
    //    data: [
    //        { id: 0, text: 'Pending' },
    //        { id: 1, text: 'Approved' },
    //        { id: 2, text: 'Rejected' },
    //        { id: 3, text: 'OnHold' }
    //    ],
    //    minimumResultsForSearch: -1
    //}).change(function (e) {
    //    var list = e.added.list;
    //});
    //$('#select2Status4').select2({
    //    data: [
    //        { id: 0, text: 'Pending' },
    //        { id: 1, text: 'Approved' },
    //        { id: 2, text: 'Rejected' },
    //        { id: 3, text: 'OnHold' }
    //    ],
    //    minimumResultsForSearch: -1
    //}).change(function (e) {
    //    var list = e.added.list;
    //});
}
function InitDateTimePicker() {
    //$('#dtFromDate').datetimepicker({
    //    pickTime: false
    //}).on("dp.change", function (e) {

    //});
    //$('#dtToDate').datetimepicker({
    //    pickTime: false
    //}).on("dp.change", function (e) {

    //});
}
function InitDataTables() {
    //BindSequence([]);
    //BindSelected([]);
}
function SetupDataTables() {
    // SetupSequence();

}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (TblGridList !== undefined) TblGridList.columns.adjust().draw();
    //if (TblGridSelected !== undefined) TblGridSelected.columns.adjust().draw();
    //if (TblGridSearch !== undefined) TblGridSearch.columns.adjust().draw();

}

function DefaultReadOnly() {
    //c.ReadOnly('#txtOrderNo', true);
    c.ReadOnly('#txtPosition', true);
    c.ReadOnly('#txtDepartment', true);

    c.ReadOnly('#txtSequence1', true);
    c.DisableSelect2('#select2Position1', true);
    c.DisableSelect2('#select2Status1', true);

    c.ReadOnly('#txtSequence2', true);
    c.DisableSelect2('#select2Position2', true);
    c.DisableSelect2('#select2Status2', true);

}
function DefaultValues() {
    //c.SetDateTimePicker('#dtFromDate', moment());
    //c.SetDateTimePicker('#dtToDate', moment());
    c.SetSelect2('#select2Option', 0, 'Blood');
    c.SetSelect2('#select2BloodGroup', -1, '< ALL >');

    $('#rowType').hide();
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
    c.Disable('#txtSequence3', true);
    c.Disable('#txtSequence4', true);
    c.DisableSelect2('#select2Leave', true);
    c.DisableSelect2('#select2Position3', true);
    c.DisableSelect2('#select2Position4', true);
    c.DisableSelect2('#select2Status3', true);
    c.DisableSelect2('#select2Status4', true);
}
function DefaultEmpty() {
    c.SetValue('#Id', '');
    c.ClearAllText();

    c.Select2Clear('#select2Employee');
    c.Select2Clear('#select2Process');
    c.Select2Clear('#select2Leave');
    c.Select2Clear('#select2Position1');
    c.Select2Clear('#select2Status1');
    c.Select2Clear('#select2Position2');
    c.Select2Clear('#select2Status2');
    c.Select2Clear('#select2Position3');
    c.Select2Clear('#select2Status3');
    c.Select2Clear('#select2Position4');
    c.Select2Clear('#select2Status4');

    c.iCheckSet('#iChkClear', false);
    c.iCheckSet('#iChkModifyLastApproved', false);
    c.iCheckSet('#iChkModifyForApproval', false);

    //BindSearch([]);
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
        //c.Disable('#txtProfileName', true);

        //$('#btnAddSelected').hide();
        //$('#btnClearSelected').hide();
        //$('#btnRemoveSelected').hide();
    }
    else if (Action == 1) { // add
        //c.Disable('#txtProfileName', false);

        //$('#btnAddSelected').show();
        //$('#btnClearSelected').show();
        //$('#btnRemoveSelected').show();
    }
    else if (Action == 2) { // edit    
        //c.Disable('#txtProfileName', true);

        //$('#btnAddSelected').show();
        //$('#btnClearSelected').show();
        //$('#btnRemoveSelected').show();
    }
    else {
        //c.Show('#Entry', false);
        //c.Show('#DashBoard', true);
    }

}
function HandleButtonNotUse() {
    $('.NotUse').hide();
}

function Validated() {
    var req = false;
    var val = "";

    //req = c.IsDate('#dtFromDate');
    //if (!req) {
    //    c.MessageBoxErr('Invalid...', 'Invalid date input.');
    //    return false;
    //}

    //req = c.IsDate('#dtToDate');
    //if (!req) {
    //    c.MessageBoxErr('Invalid...', 'Invalid date input.');
    //    return false;
    //}

    return true;
}



