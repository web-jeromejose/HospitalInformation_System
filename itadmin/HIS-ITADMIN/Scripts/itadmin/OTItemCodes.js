var c = new Common();
var Action = -1;
var Select2IsClicked = false;

//-------------------------------------------------------
var tblRangeMarkUpDashboardList;
var tblRangeMarkUpDashboardId = '#gridRangeMarkup'
var tblRangeMarkUpDashboardDataRow;

//-------------------------------------------------------
var tblDepartlvlMarkupList;
var tblDepartlvlMarkupId = '#gridDeprtLvlmarkup'
var tblDepartlvlMarkupDataRow;

//-------------------------------------------------------

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

$(document).on("dblclick", tblRangeMarkUpDashboardId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblRangeMarkUpDashboardDataRow = tblRangeMarkUpDashboardList.row($(this).parents('tr')).data();
    }

    remove_SelectedRangeMarkUp(this);
    //HealthCheckId = tblHealtCheckDashboardDataRow.HealthCheckId;
    ////var Amount = 1;
    //View(HealthCheckId);
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
    ShowItemCodePatientPreFee();
    ShowItemCodeAsstSurgeon();
    //DepartLvlMarkUpConnection();
    //RangeMarkUpConnection();

  //  RedrawGrid();
  //  InitDataTables();
   // RedrawGrid();
  //  DefaultDisable();
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
    // Sample usage
    $('#dtMonth').datetimepicker({
        picktime: false
    }).on('dp.change', function (e) {
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        //c.SetDateTimePicker('#dtfrom', b);
    });



}

function InitSelect2() {
    // Sample usage
    Sel2Server($("#Select2OTRecove"), $("#url").data("otlist"), function (d) {
        //alert(d.tariffid);
        var OtId = (d.id);
        //var tarrifId = (d.tariffid);
        ViewRecoveryRoomCharges(OtId);
    });

    Sel2Server($("#Select2RecovDepartment"), $("#url").data("deprt"), function (d) {
        //alert(d.tariffid);
        // var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);

    });


    Sel2Server($("#Select2OTCharge"), $("#url").data("otlist"), function (d) {
        //alert(d.tariffid);
        var OtId = (d.id);
        //var tarrifId = (d.tariffid);
        ViewOTCharges(OtId);
    });


    Sel2Server($("#Select2DepartmentOTcharge"), $("#url").data("deprt"), function (d) {
        //alert(d.tariffid);
        // var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);

    });


    $('#Select2Category').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("cat"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    CompanyId: c.GetSelect2Id('#Select2Company')
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added;

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


        $('#modalEntry').modal('show');
        RedrawGrid();
        HealthCheckId = 0;
        DefaultEmpty();
    });

    $('#btnSavePatientprefee').click(function () {
        var YesFunc = function () {
            Action = 1;
            SavePatientPreparation();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
        //c.ModalShow('#modalEntry', true);
    });

    $('#btnSaveRecovcharge').click(function () {
        var YesFunc = function () {
            Action = 1;
            SaveRecoveryRoomCharge();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
        //c.ModalShow('#modalEntry', true);
    });

    $('#btnSaveOTCharge').click(function () {
        var YesFunc = function () {
            Action = 1;
            SaveOTCharge();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
        //c.ModalShow('#modalEntry', true);
    });
    
    $('#btnSaveAsstCode').click(function () {
        var YesFunc = function () {
            Action = 1;
            SaveAsstSurgeon();
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
    c.SetValue('#txtName', '');
    c.SetValue('#txtCode', '');
    c.SetValue('#txtAmount', '');

    c.Select2Clear('#Select2Company');
    c.Select2Clear('#Select2Department');

    c.SetDateTimePicker('#dtMonth', '');

    BindInvestigationWithPriceList([]);
    BindConsulDeptWithPriceList([]);
    BindOtherProcedureWithPriceList([]);

}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}

function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblDepartlvlMarkupList !== undefined) tblDepartlvlMarkupList.columns.adjust().draw();
    if (tblRangeMarkUpDashboardList !== undefined) tblRangeMarkUpDashboardList.columns.adjust().draw();
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
    c.DisableDateTimePicker('#dtMonth', true);
    //c.DisableSelect2('#Select2RefDoctor', true);
    //c.DisableSelect2('#Select2ProcedureDoneBy', true);




}


//-------------------DepartlevelMarkupDashboard------------------------------------------------------------------------------------------------------------
// Sample usage
// BindDashboard([]);
/*[RenderTable]*/
function BindDeprtLvlMarkUpDashboardList(data) {
    tblDepartlvlMarkupList = $(tblDepartlvlMarkupId).DataTable({
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
        fnRowCallback: ShowDeprtLvlMarkUpDashboardCallBack(),
        columns: ShowLvlMarkUpDashboard()
    });

    InitSelectedRange();
}

function ShowDeprtLvlMarkUpDashboardCallBack() {
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

function ShowLvlMarkUpDashboard() {
    var cols = [
    { targets: [0], data: "SNo", className: '', visible: true, searchable: true, width: "1%" },
    { targets: [1], data: "Name", className: '', visible: true, searchable: true, width: "30%" },
    { targets: [2], data: "MaxRange", className: 'ClassMaxRange', visible: true, searchable: true, width: "15%" },
    { targets: [3], data: "Percentage", className: 'ClassPercentage', visible: true, searchable: true, width: "15%" },
    { targets: [4], data: "ID", className: '', visible: false, searchable: false}
   
    ];
    return cols;
}

function DepartLvlMarkUpConnection() {

    var Url = $('#url').data("getdepartlvlmarkup");

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

            BindDeprtLvlMarkUpDashboardList(data.list);
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


function SetupSelectedRange() {

    $.editable.addInputType('txtMaxRange', {
        element: function (settings, original) {

            var input = $('<input id="txtMaxRange" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

    $.editable.addInputType('txtPercentage', {
        element: function (settings, original) {

            var input = $('<input id="txtPercentage" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

}

function InitSelectedRange() {

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassMaxRange', tblDepartlvlMarkupList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblDepartlvlMarkupList.cell($(this).closest('td')).index();
        tblDepartlvlMarkupList.cell(cell.row, 2).data(sVal);


        return sVal;
    },
    {
        "type": 'txtMaxRange', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });



    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassPercentage', tblDepartlvlMarkupList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblDepartlvlMarkupList.cell($(this).closest('td')).index();
        tblDepartlvlMarkupList.cell(cell.row, 3).data(sVal);


        return sVal;
    },
    {
        "type": 'txtPercentage', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // Resize all rows.
    $(tblDepartlvlMarkupId + ' tr').addClass('trclass');

}


function remove_SelectedRangeMarkUp(cell) {
    rowV = $(cell).parents('tr');
    tblRangeMarkUpDashboardList.row(rowV).remove().draw();
    c.ReSequenceDataTable(tblRangeMarkUpDashboardId, 0);
}
//-------------------RangeMarkup ------------------------------------------------------------------------------------------------------------
function BindRangeMarkupList(data) {
    tblRangeMarkUpDashboardList = $(tblRangeMarkUpDashboardId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        bAutoWidth: false,
        dom: 'Rlfrtip',
        scrollY: 400,
        scrollX: true,
        fixedHeader: true,
        fnRowCallback: ShowRangeMarkupCallBack(),
        columns: ShowRangeMarkup()
    });

    InitSelectedRangeMarkup();

}

function ShowRangeMarkupCallBack() {
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

function ShowRangeMarkup() {
    var cols = [
    { targets: [0], data: "SNo", className: '', visible: true, searchable: true, width: "1%" },
    { targets: [1], data: "MinRange", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [2], data: "MaxRange", className: 'ClassMaxRange', visible: true, searchable: true, width: "5%" },
    { targets: [3], data: "Percentage", className: 'ClassPercentage', visible: true, searchable: true, width: "5%" },
    { targets: [4], data: "ID", className: '', visible: false, searchable: false }
   

    ];
    return cols;
}

function RangeMarkUpConnection() {

    var Url = $('#url').data("getrangemarkup");

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

            BindRangeMarkupList(data.list);
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


function SetupSelectedRangeMarkUp() {

    $.editable.addInputType('txtMaxRange', {
        element: function (settings, original) {

            var input = $('<input id="txtMaxRange" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

    $.editable.addInputType('txtPercentage', {
        element: function (settings, original) {

            var input = $('<input id="txtPercentage" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

}

function InitSelectedRangeMarkup() {

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassMaxRange', tblRangeMarkUpDashboardList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblRangeMarkUpDashboardList.cell($(this).closest('td')).index();
        tblRangeMarkUpDashboardList.cell(cell.row, 2).data(sVal);


        return sVal;
    },
    {
        "type": 'txtMaxRange', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });



    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassPercentage', tblRangeMarkUpDashboardList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblRangeMarkUpDashboardList.cell($(this).closest('td')).index();
        tblRangeMarkUpDashboardList.cell(cell.row, 3).data(sVal);


        return sVal;
    },
    {
        "type": 'txtPercentage', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // Resize all rows.
    $(tblRangeMarkUpDashboardId + ' tr').addClass('trclass');

}


function ShowItemCodePatientPreFee() {

    var Url = $('#url').data("getitemcodepatientprep");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (GetItemCode) {
          
          var  GetItemCodes = GetItemCode[0].ItemCode;
          c.SetValue('#txtPatientPreCode', GetItemCodes);
        }
    });

}


function ShowItemCodeAsstSurgeon() {

    var Url = $('#url').data("getasstsurgeon");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (GetItemCode) {

            var GetItemCodes = GetItemCode[0].ItemCode;
            c.SetValue('#txtAsstCode', GetItemCodes);
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

function SavePatientPreparation() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    //Id-MaxIdSql
    entry.Action = Action;
    entry.ItemCode = c.GetValue('#txtPatientPreCode');
    entry.Type = 1;
    entry.DepartmentId = null;
    entry.OTNO = 1;

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

function SaveRecoveryRoomCharge() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    //Id-MaxIdSql
    entry.Action = Action;
    entry.ItemCode = c.GetValue('#txtRecovCode');
    entry.Type = 2;
    entry.DepartmentId = c.GetSelect2Id('#Select2RecovDepartment');
    entry.OTNO = c.GetSelect2Id('#Select2OTRecove');

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

function SaveOTCharge() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    //Id-MaxIdSql
    entry.Action = Action;
    entry.ItemCode = c.GetValue('#txtOTCodecharge');
    entry.Type = 3;
    entry.DepartmentId = c.GetSelect2Id('#Select2DepartmentOTcharge');
    entry.OTNO = c.GetSelect2Id('#Select2OTCharge');

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

function SaveAsstSurgeon() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    //Id-MaxIdSql
    entry.Action = Action;
    entry.ItemCode = c.GetValue('#txtAsstCode');
    entry.Type = 4;
    entry.DepartmentId = null;
    entry.OTNO = 1;

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




function ViewRecoveryRoomCharges(OtId) {

    var Url = $('#url').data("fetchrecoveryroomcharges");
    //var Url = baseURL + "ShowSelected";
    var param = {
        OtId: OtId

    };

    $('#preloader').show();
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
            $('#preloader').hide();
            //$('.Show').show();

            //if (FetchFindingsResults.length == 0) {
            //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
            //    tblRequisitionList.row('tr.selected').remove().draw(false);
            //    return;
            //}

            var data = result.list[0];

            /*Select2*/
            c.SetSelect2('#Select2RecovDepartment', data.DepartmentId, data.DepartmentName);
            c.SetValue('#txtRecovCode', data.ItemCode);

         
      

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



function ViewOTCharges(OtId) {

    var Url = $('#url').data("fetchrecoveryroomcharges");
    //var Url = baseURL + "ShowSelected";
    var param = {
        OtId: OtId

    };

    $('#preloader').show();
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
            $('#preloader').hide();
            //$('.Show').show();

            //if (FetchFindingsResults.length == 0) {
            //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
            //    tblRequisitionList.row('tr.selected').remove().draw(false);
            //    return;
            //}

            var data = result.list[0];

            /*Select2*/
            c.SetSelect2('#Select2DepartmentOTcharge', data.DepartmentId, data.DepartmentName);
            c.SetValue('#txtOTCodecharge', data.ItemCode);




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
