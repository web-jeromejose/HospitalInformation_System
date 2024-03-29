var c = new Common();
var Action = -1;
var Select2IsClicked = false;

//-------------------------------------------------------
var tblORTrackingDashboardList;
var tblORTrackingDashboardId = '#gridOTTracker'
var tblORTrackingDashboardDataRow;

var GetMaxRange;

$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // For future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();
    //if (tabNameSelected == $('.nav-tabs .active').text());
    //{
    //       RedrawGrid();
    //}

    RedrawGrid();

})

$(document).on("click", tblORTrackingDashboardId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblORTrackingDashboardDataRow = tblORTrackingDashboardList.row($(this).parents('tr')).data();
    }

    //remove_SelectedRangeMarkUp(this);
    OrId = tblORTrackingDashboardDataRow.Id;
    ////var Amount = 1;
    Action == 2;
    DefaultDisable();
    View(OrId);
    //InvestigationListWithPriceConnection(HealthCheckId);
    //ConsulDeptListWithConnection(HealthCheckId);
    //OtherProcedurewithPriceConnection(HealthCheckId);
    //$('#modalEntry').modal('show');
    RedrawGrid();

});

$(document).ready(function () {
    //SetupSelectedRange();
    //SetupSelectedRangeMarkUp();
    InitSelect2();
    InitButton();

    InitICheck();
    //ShowRangeMax();
    ORTrackingDashBoardConnection();
    //DepartLvlMarkUpConnection();
    //RangeMarkUpConnection();
    InitDateTimePicker();
    //InitDataTables();
    RedrawGrid();
    DefaultDisable();
 
});

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

function HandleButtonNotUse() {
    $('.NotUse').hide();
}

function InitDataTables() {
    //BindSequence([]);
    BindDeprtLvlMarkUpDashboardList([]);
    BindRangeMarkupList([]);
    //BindInvestigationWithPriceList([]);
    //BindConsulDeptWithPriceList([]);
    //BindOtherProcedureWithPriceList([]);
}

function HandleEnableEntries() {




}

function InitDateTimePicker() {
    //var minDate = moment(new Date()).format("DD-MMM-YYYY hh:mm A");
    var minDate = moment(new Date()).format("hh:mm A");
    // Sample usage
    $('#dtTimeinCathLab').datetimepicker({
        //minDate: minDate,
        // picktime: false,
        // minDate: minDate,
        //timepicker: false
        pickDate: false,
        format: 'LT'
    }).on('dp.change', function (e) {
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        //c.SetDateTimePicker('#dtfrom', b);
    });



    $('#dtTimeinProcedure').datetimepicker({
        // picktime: false,
        // minDate: minDate,
        //timepicker: false
        pickDate: false,
        format: 'LT'
    }).on('dp.change', function (e) {
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        //c.SetDateTimePicker('#dtfrom', b);
    });

    $('#dtTimeoutProcedure').datetimepicker({
        // picktime: false,
        // minDate: minDate,
        //timepicker: false
        pickDate: false,
        format: 'LT'
    }).on('dp.change', function (e) {
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        //c.SetDateTimePicker('#dtfrom', b);
    });

    $('#dtTimeoutCathLab').datetimepicker({
        // picktime: false,
        // minDate: minDate,
        //timepicker: false
        pickDate: false,
        format: 'LT'
    }).on('dp.change', function (e) {
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        //c.SetDateTimePicker('#dtfrom', b);
    });
    


}

function InitICheck() {

    $('#ichkTimeinCathLab').click(function () {
        var isChecked = $('#ichkTimeinCathLab').attr('checked') ? true : false;
        if (isChecked == true) {
            c.DisableDateTimePicker('#dtTimeinCathLab', false);
     
        } else {
            c.DisableDateTimePicker('#dtTimeinCathLab', true);
            c.SetDateTimePicker('#dtTimeinCathLab', '');
        }

    });

    $('#ichkTimeinProcedure').click(function () {
        var isChecked = $('#ichkTimeinProcedure').attr('checked') ? true : false;
        if (isChecked == true) {
            c.DisableDateTimePicker('#dtTimeinProcedure', false);

        } else {
            c.DisableDateTimePicker('#dtTimeinProcedure', true);
            c.SetDateTimePicker('#dtTimeinProcedure', '');

        }

    });

    $('#ichkTimeoutProcedure').click(function () {
        var isChecked = $('#ichkTimeoutProcedure').attr('checked') ? true : false;
        if (isChecked == true) {
            c.DisableDateTimePicker('#dtTimeoutProcedure', false);
            

        } else {
            c.DisableDateTimePicker('#dtTimeoutProcedure', true);
            c.SetDateTimePicker('#dtTimeoutProcedure', '');
           
            
        }

    });


       

    $('#ichkTimeoutCathlab').click(function () {
        var isChecked = $('#ichkTimeoutCathlab').attr('checked') ? true : false;
        if (isChecked == true) {
            c.DisableDateTimePicker('#dtTimeoutCathLab', false);
            c.SetValue('#txtStatus', 'Patient has been transferred into Ward');
        } else {
            c.DisableDateTimePicker('#dtTimeoutCathLab', true);
            c.SetDateTimePicker('#dtTimeoutCathLab', '');
            c.SetValue('#txtStatus', ' ');

        }

    });

 


}

function InitSelect2() {
    // Sample usage
    //Sel2Server($("#Select2CurrentRoom"), $("#url").data("getcurrentRoom"), function (d) {
    //    //alert(d.tariffid);
    //    //var CompanyID = (d.id);
    //    //var tarrifId = (d.tariffid);

    //});
    

    $('#Select2Item').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getitemlist"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: c.GetSelect2Id
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        //c.SetValue('#txtPatient', list[2]);
    });

    $('#Select2ORBed').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getorbed"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: c.GetSelect2Id
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        //c.SetValue('#txtPatient', list[2]);
    });

    $('#Select2Anesthesiologist').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getsurgeon"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: c.GetSelect2Id
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        //c.SetValue('#txtPatient', list[2]);
    });

    $('#Select2AsstSurgeon').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getsurgeon"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: c.GetSelect2Id
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        //c.SetValue('#txtPatient', list[2]);
    });
    $('#Select2Surgeon').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getsurgeon"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: c.GetSelect2Id
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        //c.SetValue('#txtPatient', list[2]);
    });

    $('#Select2Pin').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getinpatient"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: c.GetSelect2Id
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        c.SetValue('#txtPatient', list[2]);
    });

    $('#Select2CurrentRoom').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getcurrentroom"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: c.GetSelect2Id
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        //c.SetValue('#txtPatient', list[2]);
    });




}

function InitButton() {
    var NoFunc = function () {
        //c.ModalShow('#modalEntry', true);
        //$('#modalEntry').modal('show');
    };
    // Sample usage
    //$('#btnProcess').click(function () {

    //    var RegNo = c.GetValue('#txtRegno');
    //    if (RegNo == '') {
    //       RegNo = -1
    //    } 
    //    var FromDate = c.GetDateTimePickerDate('#dtFrom');
    //    var ToDate = c.GetDateTimePickerDate('#dtTo');
    //    Requisitionlist(RegNo, FromDate, ToDate);
    //});

    $('#btnNew').click(function () {
        //if (tblHealtCheckDashboardId.rows('.selected').data().length == 0) {
        //    c.MessageBoxErr("Select...", "Please select a row to view.", null);
        //    return;
        //}

        Action = 1;
        $('#modalEntry').modal('show');
        RedrawGrid();
        HandleEnableButtons();
        DefaultEmpty();
    });

    $('#btnSaveRangelvl').click(function () {
        var YesFunc = function () {
            Action = 3;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
        //c.ModalShow('#modalEntry', true);
    });

    $('#btnSavecomlvl').click(function () {
        var YesFunc = function () {
            Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
        //c.ModalShow('#modalEntry', true);
    });

    $('#btnSavedeptvl').click(function () {
        var YesFunc = function () {
            Action = 2;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
        //c.ModalShow('#modalEntry', true);
    });

    $('#btnModify').click(function () {
        var YesFunc = function () {
            Action = 2;
            Save();

        };
        c.MessageBoxConfirm("Modify Entry?", "Are you sure you want to Modify the Entry?", YesFunc, null);

    });

    $('#btnReportGen').click(function () {

        //  print_preview();

        $('#myModal').modal('show');
        PrintPreview();

    });

    $('#btnCalculate').click(function () {

        ComputePrice();
        //RedrawGrid();

    });


    $('#btnadd').click(function () {

        var ctr = $(tblRangeMarkUpDashboardId).DataTable().rows().nodes().length + 1;
        //var MaxRange = tblRangeMarkUpDashboardDataRow.MinRange;
        tblRangeMarkUpDashboardList.row.add({
            "SNo": ctr,
            "MinRange": GetMaxRange,
            "MaxRange": "",
            "Percentage": "",
            "ID": ""
            //"EmpId": Action == 1 ? "" : GetID,
            //"AchievementYear": ""
        }).draw();
        InitSelectedRangeMarkup();
    });

    $('#btnRemove').dblclick(function () {

        if (tblRangeMarkUpDashboardList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to be deleted.", null);
            return;
        }

        var YesFunc = function () {
            tblRangeMarkUpDashboardList.row('tr.selected').remove().draw(false);
        };

        c.MessageBoxConfirm("Remove...", "Are you sure you want to remove the selected row/s?", YesFunc, null);

    });


}

function DefaultEmpty()
{
    c.SetValue('#txtPatient', '');
    c.SetValue('#txtStatus', '');
    c.SetValue('#txtSeq', '');
    c.Select2Clear('#Select2Pin');
    c.Select2Clear('#Select2ORBed');
    c.Select2Clear('#Select2CurrentRoom');
    c.Select2Clear('#Select2AsstSurgeon');
    c.Select2Clear('#Select2Surgeon');
    c.Select2Clear('#Select2Anesthesiologist');
    c.Select2Clear('#Select2Item');
    c.SetDateTimePicker('#dtTimeinCathLab', '');
    c.SetDateTimePicker('#dtTimeinProcedure', '');
    c.SetDateTimePicker('#dtTimeoutProcedure', '');
    c.SetDateTimePicker('#dtTimeoutCathLab', '');
    c.iCheckSet('#ichkTimeinCathLab', false);
    c.iCheckSet('#ichkTimeinProcedure', false);
    c.iCheckSet('#ichkTimeoutProcedure', false);
    c.iCheckSet('#ichkTimeoutCathlab', false);
    DefaultDisable();
    //BindInvestigationWithPriceList([]);;
    //BindConsulDeptWithPriceList([]);
    //BindOtherProcedureWithPriceList([]);

}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}

function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblORTrackingDashboardList !== undefined) tblORTrackingDashboardList.columns.adjust().draw();
    //if (tblRangeMarkUpDashboardList !== undefined) tblRangeMarkUpDashboardList.columns.adjust().draw();
    //if (tblConsulDeprtList !== undefined) tblConsulDeprtList.columns.adjust().draw();
    //if (tblProcedureList !== undefined) tblProcedureList.columns.adjust().draw();
    //if (tblSelectedInvestigationList !== undefined) tblSelectedInvestigationList.columns.adjust().draw();
    //if (tblSelectedConsulDeprtList !== undefined) tblSelectedConsulDeprtList.columns.adjust().draw();
    //if (tblSelectedProcedureList !== undefined) tblSelectedProcedureList.columns.adjust().draw();
    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}

function DefaultDisable() {
    // Sample usage

    if (Action == 1) {
        c.Disable('#txtPatient', true);
        c.DisableDateTimePicker('#dtTimeinCathLab', true);
        c.DisableDateTimePicker('#dtTimeinProcedure', true);
        c.DisableDateTimePicker('#dtTimeoutProcedure', true);
        c.DisableDateTimePicker('#dtTimeoutCathLab', true);
        //c.DisableSelect2('#Select2RefDoctor', true);
        //c.DisableSelect2('#Select2ProcedureDoneBy', true);
    }
    if (Action == 2) {
        c.Disable('#txtPatient', true);
        c.DisableDateTimePicker('#dtTimeinCathLab', false);
        c.DisableDateTimePicker('#dtTimeinProcedure', false);
        c.DisableDateTimePicker('#dtTimeoutProcedure', false);
        c.DisableDateTimePicker('#dtTimeoutCathLab', false);
        //c.DisableSelect2('#Select2RefDoctor', true);
        //c.DisableSelect2('#Select2ProcedureDoneBy', true);
    }


}


//-------------------DepartlevelMarkupDashboard------------------------------------------------------------------------------------------------------------
// Sample usage
// BindDashboard([]);
/*[RenderTable]*/
function BindORTrackingDashboardList(data) {
    tblORTrackingDashboardList = $(tblORTrackingDashboardId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        bAutoWidth: true,
        dom: 'Rlfrtip',
        scrollY: 350,
        scrollX: false,
        fixedHeader: true,
        fnRowCallback: ShowORTrackingDashboardCallBack(),
        columns: ShowORTrackingDashboard()
    });

    //InitSelectedRange();
}

function ShowORTrackingDashboardCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowORTrackingDashboard() {
    var cols = [
    { targets: [0], data: "PIN", className: '', visible: true, searchable: true, width: "1%" },
    { targets: [1], data: "Status", className: '', visible: true, searchable: true, width: "30%" },
    { targets: [2], data: "TimeOR", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [3], data: "TimeTheatre", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [4], data: "Recovery", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [5], data: "SurgeonName", className: '', visible: true, searchable: true, width: "25%" },
    { targets: [6], data: "Id", className: '', visible: false, searchable: false}
   
    ];
    return cols;
}

function ORTrackingDashBoardConnection() {

    var Url = $('#url').data("getdashboard");

    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {

            BindORTrackingDashboardList(data.list);
            $('#preloader').hide();
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}


//function SetupSelectedRange() {

//    $.editable.addInputType('txtMaxRange', {
//        element: function (settings, original) {

//            var input = $('<input id="txtMaxRange" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
//            $(this).append(input);

//            return (input);

//        },

//        plugin: function (settings, original) {
//            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
//        }
//    });

//    $.editable.addInputType('txtPercentage', {
//        element: function (settings, original) {

//            var input = $('<input id="txtPercentage" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
//            $(this).append(input);

//            return (input);

//        },
//        plugin: function (settings, original) {
//            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
//        }
//    });

//}

//function InitSelectedRange() {

//    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
//    $('.ClassMaxRange', tblDepartlvlMarkupList.rows().nodes()).editable(function (sVal, settings) {
//        var cell = tblDepartlvlMarkupList.cell($(this).closest('td')).index();
//        tblDepartlvlMarkupList.cell(cell.row, 2).data(sVal);


//        return sVal;
//    },
//    {
//        "type": 'txtMaxRange', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
//        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
//    });



//    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
//    $('.ClassPercentage', tblDepartlvlMarkupList.rows().nodes()).editable(function (sVal, settings) {
//        var cell = tblDepartlvlMarkupList.cell($(this).closest('td')).index();
//        tblDepartlvlMarkupList.cell(cell.row, 3).data(sVal);


//        return sVal;
//    },
//    {
//        "type": 'txtPercentage', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
//        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
//    });
//    // Resize all rows.
//    $(tblDepartlvlMarkupId + ' tr').addClass('trclass');

//}

function ShowRangeMax() {

    var Url = $('#url').data("getrangemax");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (MaxRangeMarkup) {

            GetMaxRange = MaxRangeMarkup[0].MaxRange;

        }
    });

}


//-------------------------------------------------------------------------------------------------------------------------------

function Validated() {

    //var ret = false;

    //ret = c.IsEmpty('#txtCode');

    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a Code');
    //    return false;
    //}

    //ret = c.IsEmpty('#txtName');

    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a HealthCheckup Name');
    //    return false;
    //}

    //ret = c.IsEmptyById('#Select2Department');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a Department');
    //    return false;
    //}

    //ret = c.IsEmptyById('#Select2Company');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a Company');
    //    return false;
    //}


    return true;

}
//-------------------------------------------------------------------------------------------------------------------------------

function Save() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    //Id-MaxIdSql
    entry.Action = Action;
    entry.CompanyId = c.GetSelect2Id('#Select2Company');
    entry.CategoryId = c.GetSelect2Id('#Select2Category');;
    entry.MarkupPer = c.GetValue('#txtPercentage');

    entry.DepartLvlMarkUpSave = [];
    $.each(tblDepartlvlMarkupList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.DepartLvlMarkUpSave.push({
            MaxRange: row.MaxRange,
            Percentage: row.Percentage,
            ID: row.ID

        });
    });
 
    entry.RangeMarkupSave = [];
    $.each(tblRangeMarkUpDashboardList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.RangeMarkupSave.push({
            MinRange: row.MinRange,
            MaxRange: row.MaxRange,
            Percentage: row.Percentage,
            ID: row.ID
            //HCUId: HealthCheckId === '' ? 0 : HealthCheckId
            //ParameterId: row.PenaltyName.split(" ")[0],
            ////type: c.MomentYYYYMMDD(row.PenaltyDate),
            //Refund: row.Refund === 'Yes' ? 1 : 0,
            //testAppId: false,
            //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
        });
    });


    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            //c.ButtonDisable('#btnCalculate', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            //c.ButtonDisable('#btnCalculate', false);
            //c.ButtonDisable('#btnSave', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                if (Action == 3) {
                    //                    tblScientificAchievement.row('tr.selected').remove().draw(false);
                    //                    tblTrainingDetails.row('tr.selected').remove().draw(false);
                    //tblFamilyDetails.row('tr.selected').remove().draw(false);
                    //                    tblRelationShipDetails.row('tr.selected').remove().draw(false);
                    //                    tblPreviousExpDetails.row('tr.selected').remove().draw(false);
                    //                    tblQualificationDetails.row('tr.selected').remove().draw(false);
                }

                Action = 0;
                HandleEnableButtons();
                //HandleEnableEntries();

            };

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
            //c.ButtonDisable('#btnSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

    return ret;
}
//-------------------------------------------------------------------------------------------------------------------------------

function View(OrId) {

    var Url = $('#url').data("view");
    //var Url = baseURL + "ShowSelected";
    var param = {
        OrId: OrId

    };

    $('#loadingpdf').show();
    //$('.Hide').hide();

    $.ajax({
        url: Url,
        data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (result) {
            $('#loadingpdf').hide();

            //if (FetchFindingsResults.length == 0) {
            //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
            //    tblRequisitionList.row('tr.selected').remove().draw(false);
            //    return;
            //}

            var data = result.list[0];
            c.SetValue('#txtSeq', data.ItemCode);
            c.SetValue('#txtPatient', data.PatientName);
          
            c.SetValue('#txtStatus', data.Status);
            /*Select2*/
            c.SetSelect2('#Select2Pin', data.RegistrationNo, data.PIN);
            //var ServiceName = (data.ServiceName == null);
            c.SetSelect2('#Select2Item', data.ServiceCode, data.ServiceName);
            c.SetSelect2('#Select2ORBed', data.ORRoomId, data.ORRoomName);
            c.SetSelect2('#Select2CurrentRoom', data.BedId, data.BedName);
            c.SetSelect2('#Select2Surgeon', data.SurgeonId, data.SurgeonName);
            c.SetSelect2('#Select2AsstSurgeon', data.AsstSurgeonId, data.AsstSurgeonName);
            c.SetSelect2('#Select2Anesthesiologist', data.Anestid, data.AnestName);

            c.SetDateTimePicker('#dtTimeinCathLab', data.TimeOR);
            c.SetDateTimePicker('#dtTimeinProcedure', data.TimeTheatre);
            c.SetDateTimePicker('#dtTimeoutProcedure', data.OutProcedure);
            c.SetDateTimePicker('#dtTimeoutCathLab', data.OutCathLab);
            //c.SetDateTimePicker('#dtProceduredoneon', moment(data.TestDoneDttm));


            ///*Table Show*/
            
        
           // InitSelec2Sample();
            //BindFindingsTbl(data.FindingsResult);
            //BindTrainingDetails(data.TrainingDetailsTable);
            //BindFamilyDetails(data.FamilyDetailsTable);
            //BindRelationShipDetails(data.RelationShipDetailsTable);
            //BindPreviousExpDetails(data.PreviousExperienceDetailsTable);
            //BindQualificationDetails(data.QualificationDetailsTable);


           // /HandleEnableButtons();
            HandleEnableEntries();
            c.ModalShow('#modalEntry', true);
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
