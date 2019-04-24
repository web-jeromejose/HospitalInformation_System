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

   // remove_SelectedRangeMarkUp(this);
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
    SetupSelectedRange();
    SetupSelectedRangeMarkUp();
    InitSelect2();
    InitButton();
    ShowRangeMax();
    DepartLvlMarkUpConnection();
    RangeMarkUpConnection();
    OLDRangeMarkUpConnection();

    RedrawGrid();
    InitDataTables();
    RedrawGrid();
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
    Sel2Server($("#Select2Company"), $("#url").data("comp"), function (d) {
        //alert(d.tariffid);
        var CompanyID = (d.id);
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
        searching: false,
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
    { targets: [2], data: "MaxRange", className: ' ', visible: true, searchable: true, width: "5%" },
    { targets: [3], data: "Percentage", className: ' ', visible: true, searchable: true, width: "5%" },
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

             BindDashboardRangeMarkup(data.list);
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


function OLDRangeMarkUpConnection() {

    var Url = $('#url').data("oldgetrangemarkup");

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


function SaveRangelvl() {
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
    //$.each(tblDepartlvlMarkupList.rows().data(), function (i, row) {
    //    //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
    //    entry.DepartLvlMarkUpSave.push({
    //        MaxRange: row.MaxRange,
    //        Percentage: row.Percentage,
    //        ID: row.ID

    //    });
    //});

    entry.RangeMarkupSave = [];
    $.each(TblDashboardRangeMarkup.rows().data(), function (i, row) {
        console.log(row);
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
    console.log(entry);

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

                BindDashboardRangeMarkup([])
                BindRangeMarkupList([]);

                RangeMarkUpConnection();
                OLDRangeMarkUpConnection();
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

function View(HealthCheckId) {

    var Url = $('#url').data("view");
    //var Url = baseURL + "ShowSelected";
    var param = {
        HealthCheckId: HealthCheckId

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
            $('.Show').show();

            //if (FetchFindingsResults.length == 0) {
            //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
            //    tblRequisitionList.row('tr.selected').remove().draw(false);
            //    return;
            //}

            var data = result.list[0];
            c.SetValue('#txtCode', data.Code);
            c.SetValue('#txtName', data.HealthCheckUpName);
            c.SetValue('#txtAmount', data.Amount);
            /*Select2*/
            c.SetSelect2('#Select2Company', data.companyid, data.CompanyName);
            c.SetSelect2('#Select2Department', data.DepartmentId, data.DepartmentName);

            c.SetDateTimePicker('#dtMonth', data.Date);
            //c.SetDateTimePicker('#dtProceduredoneon', moment(data.TestDoneDttm));


            ///*Table Show*/
            
            BindInvestigationWithPriceList(data.InvestigationList);
            BindConsulDeptWithPriceList(data.ConsultationDept);
            BindOtherProcedureWithPriceList(data.OtherProceduresList);
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


// ----------------------------------------- RangeMarkup------------------------------------------------------------------------------------------------------------------
SetupRangeMarkup()
var LoadRangeMarkup = function () {
    ajaxWrapper.Get($("#url").data("vatpresentprice"), null, function (x, e) {
        BindDashboardRangeMarkup(x.list);
    });
};
var TblDashboardRangeMarkup;
var TblDashboardRangeMarkupId = '#DTgridRangeMarkup';
var TblDashboardRangeMarkupDataRow;
var ennDashboardRangeMarkup = { Btn: 0, del: 1, ctr: 2, ID: 3, Name: 4, Edited: 5, Deleted: 6 };

var Format24 = "HH:mm";
var calcHeightDashboardRangeMarkup = function () {
    return $(window).height() * 35 / 100;
};

function ShowDashboardRowCallDashboardRangeMarkup() {
    var rc = function (nRow, aData) {
        var $nRow = $(nRow);
        //if (aData["HasAccess"] === 1) {
        //    //$('td:eq(3)', nRow).html("Yes");
        //    $nRow.addClass("row_green");
        //    $('#checkFunctionConfigRole', nRow).prop('checked', true);
        //}
    };
    return rc;
}
function BindDashboardRangeMarkup(data) {

    // http://legacy.datatables.net/release-datatables/examples/basic_init/scroll_x.html
    TblDashboardRangeMarkup = $(TblDashboardRangeMarkupId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        //info: false,
        scrollY: calcHeightDashboardRangeMarkup(),
        scrollX: "409px",
        sScrollXInner: "409px",
        //processing: true,
        autoWidth: false,
        dom: '<"tbDashboardRangeMarkup">Rlfrtip',
        scrollCollapse: false,
       // pageLength: 75,
        //lengthChange: false,
        columns: [
           // { data: "", title: '', className: 'control-center', visible: true, searchable: false, width: "1px", defaultContent: '<button type="button" class="btn btn-sm btn-danger" Id="btnDetailsModif" title="Delete" rel="tooltip"> <i class="glyphicon glyphicon-trash"></i></button>' },
           // { data: "", title: ' ', className: ' ', visible: true, searchable: false, width: "0%", defaultContent: '<input type="checkbox" class="control-center iCheck-helper" id="checkFunctionConfigRole" />' },

        //    { data: "TaxName", title: 'Tax Name', className: '  ', visible: true, searchable: true, width: "20%" },
        //    { data: "Percentage", title: 'Percentage', className: ' ', visible: true, searchable: true, width: "5%" },
        //    { data: "StartDateTime", title: 'Start Date', className: '   ', visible: true, searchable: true, width: "20%" },
        //     { data: "EndDateTime", title: 'End Date', className: ' ', visible: true, searchable: false, width: "20%" }
        //    //{ data: "StationId", title: 'StationId', className: '', visible: false, searchable: false, width: "0%" },
        //    //{ data: "RoleId", title: 'RoleId', className: '', visible: false, searchable: false, width: "0%" },
        //    //{ data: "ModuleId", title: 'ModuleId', className: '', visible: false, searchable: false, width: "0%" }
        //, { data: "Id", title: ' ', className: '', visible: false, searchable: true, width: "0%" }

        { data: "SNo", title: 'SNo', className: '', visible: true, searchable: true, width: "1%" },
{ data: "MinRange", title: 'Min Range', className: 'ClassMinRange', visible: true, searchable: true, width: "5%" },
{ data: "MaxRange", title: 'Max Range', className: ' ClassMaxRange', visible: true, searchable: true, width: "5%" },
{ data: "Percentage", title: 'Percentage', className: 'ClassPercentage', visible: true, searchable: true, width: "5%" },
{   data: "ID", className: '', visible: false, searchable: false }
   

        ],
        fnRowCallback: ShowDashboardRowCallDashboardRangeMarkup()
    });

    InitRangeMarkup();

    var btns = '';
    var toolbar = btns.concat(
         '<div style="float:left;">'
         , '<button type="button" class="btn-margin-right btn btn-xs blue btn-primary " Id="btnSaveRangelvlNEW"> <i class="glyphicon glyphicon-check"></i> SAVE </button>'
        //, '<button type="button" class="btn-margin-right btn btn-xs blue" Id="btnUNCheckAllFunctions"> <i class="glyphicon glyphicon-unchecked"></i> All </button>'
        , '</div><br><br>');
     $("div.tbDashboardRangeMarkup").html(toolbar);



     $('#btnSaveRangelvlNEW').click(function () {
         var YesFunc = function () {
             Action = 3;
             SaveRangelvl();
         };
         c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
         //c.ModalShow('#modalEntry', true);
     });

     $('#btnADDFunctions').click(function () {
        $('#preloader').show();
      //  $.each(TblDashboardRangeMarkup.rows().data(), function (i, row) {
      //      TblDashboardRangeMarkup.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox" checked="checked" >');
        //    });

        var ctr = $(TblDashboardRangeMarkupId).DataTable().rows().nodes().length + 1;
        //var MaxRange = tblRangeMarkUpDashboardDataRow.MinRange;
        TblDashboardRangeMarkup.row.add({
            "SNo": ctr,
            "MinRange": "",
            "MaxRange": "",
            "Percentage": "",
            "ID": ""

        }).draw();
      
        InitSelectedRangeMarkup();

        c.ReSequenceDataTable(TblDashboardRangeMarkupId, 0);
         // Scroll to the bottom
        var $scrollBody = $(TblDashboardRangeMarkup.table().node()).parent();
        $scrollBody.scrollTop($scrollBody.get(0).scrollHeight);

        $('#preloader').hide();
    });
    $('#btnUNCheckAllFunctions').click(function () {
        $('#preloader').show();
        $.each(TblDashboardRangeMarkup.rows().data(), function (i, row) {
            TblDashboardRangeMarkup.cell(i, 0).data('<input id="checkFunctionConfigRole" type="checkbox">');
        });
        $('#preloader').hide();

    });

    $(TblDashboardRangeMarkupId + ' tbody').on('click', '#checkFunctionConfigRole', function (e) {
        var $cell = $(this).closest('td');
        var $row = $(this).closest('tr');
        var Tbl = TblDashboardRangeMarkup;
        var data = Tbl.row($row).data();
        var rowId = data[0];
        var col = Tbl.cell($(this).closest('td')).index();
        if (this.checked) {
            $row.addClass("row_green");
        } else {
            $row.removeClass("row_green");
        }
        e.stopPropagation();
    });
}


function SetupRangeMarkup() {

    // ------------ ------------------------------------------------------------------------------------------------------------------------------------------------
    $.editable.addInputType('EditableMinRange', {
        element: function (settings, original) {

            var input = $('<input id="dtTxtMinRange" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
            $(this).append(input);

            return (input);
        }
    });
    // ------------ ------------------------------------------------------------------------------------------------------------------------------------------------
    $.editable.addInputType('EditableMaxRange', {
        element: function (settings, original) {

            var input = $('<input id="dtTxtMaxRange" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
            $(this).append(input);

            return (input);
        }
    });

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $.editable.addInputType('EditableYesNo', {
        element: function (settings, original) {
            //  var input = $('<input id="dtS2YesNo" style="width:100%; height:30px;" type="text" class="form-control">');
            var input = $('<select id="dtS2YesNo" class="form-control input-xs select2me input-sm" data-placeholder="Select..."> <option value="1">Yes</option> <option value="0">No</option> </select>');
            $(this).append(input);
            return (input);
        },
        plugin: function (settings, original) {

        },
        submit: function (settings, original) {
            console.log($("#dtS2YesNo", this).select2("data").name);
            console.log($("#dtS2YesNo", this).select2("data"));
            if ($("#dtS2YesNo", this).select2('val') != null && $("#dtS2YesNo", this).select2('val') != '') {

                $("input", this).val($("#dtS2YesNo", this).select2("data").name);
            }
        }
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $.editable.addInputType('EditableName', {
        element: function (settings, original) {

            var input = $('<input id="dtTxtName" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        }
    });
    $.editable.addInputType('EditableDeleted', {
        element: function (settings, original) {

            var input = $('<input id="dtTxtDeleted" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
            $(this).append(input);

            return (input);
        }
    });

    // ------------ ------------------------------------------------------------------------------------------------------------------------------------------------
    $.editable.addInputType('EditablePercentage', {
        element: function (settings, original) {

            var input = $('<input id="dtTxtPercentage" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
            $(this).append(input);

            return (input);
        }
    });

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $.editable.addInputType('EditableDOB', {
        element: function (settings, original) {
            var input = $('<input id="dtDateDOB" style="width:100%; height:30px;" type="text" class="form-control date" data-date-format="DD-MMM-YYYY"/>');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            $(this).find('#dtDateDOB')
                    .datetimepicker({
                        pickTime: false
                    });
        }
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $.editable.addInputType('EditableRelationship', {
        element: function (settings, original) {
            var input = $('<input id="dtS2Relationship" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#dtS2Relationship').select2({
                allowClear: false,
                ajax: {
                    cache: false,
                    type: 'GET',
                    dataType: "json",
                    url: $('#UrlEntry').data('s2relationship'),
                    data: function (searchTerm) {
                        return { search: searchTerm };
                    },
                    results: function (data) {
                        return { results: data };
                    }
                },
                dropdownAutoWidth: true,
                formatResult: function (data) {
                    var markup = "<table><tr>";
                    if (data.name !== undefined) {
                        markup += "<td>" + data.text + "</td>";
                    }
                    markup += "</td></tr></table>"
                    return markup;
                }
            }).on("select2-blur", function () {
                $("#dtS2Relationship").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#dtS2Relationship").closest('form').submit(); }
                else { $("#dtS2Relationship").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#dtS2Relationship').val();
                $("#dtS2Relationship").select2("data", { id: a, text: a });
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
            if ($("#dtS2Relationship", this).select2('val') != null && $("#dtS2Relationship", this).select2('val') != '') {
                $("input", this).val($("#dtS2Relationship", this).select2("data").text);

            }
        }
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $.editable.addInputType('EditableEligibility', {
        element: function (settings, original) {
            var input = $('<input id="dtS2Eligibility" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#dtS2Eligibility').select2({
                minimumResultsForSearch: -1,
                minimumInputLength: 0,
                allowClear: true,
                data: [
                    { id: 1, text: 'Half' },
                    { id: 2, text: 'Full' }
                ]
            }).on("select2-blur", function () {
                $("#dtS2Eligibility").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#dtS2Eligibility").closest('form').submit(); }
                else { $("#dtS2Eligibility").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#dtS2Eligibility').val();
                $("#dtS2Eligibility").select2("data", { id: a, text: a });
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
            if ($("#dtS2Eligibility", this).select2('val') != null && $("#dtS2Eligibility", this).select2('val') != '') {
                $("input", this).val($("#dtS2Eligibility", this).select2("data").text);

            }
        }
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $.editable.addInputType('EditableRoute', {
        element: function (settings, original) {
            var input = $('<input id="dtS2Route" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#dtS2Route').select2({
                allowClear: false,
                ajax: {
                    cache: false,
                    type: 'GET',
                    dataType: "json",
                    url: $('#UrlEntry').data('s2sectors'),
                    data: function (searchTerm) {
                        return { search: searchTerm };
                    },
                    results: function (data) {
                        return { results: data };
                    }
                },
                dropdownAutoWidth: true,
                formatResult: function (data) {
                    var markup = "<table><tr>";
                    if (data.name !== undefined) {
                        markup += "<td>" + data.text + "</td>";
                    }
                    markup += "</td></tr></table>"
                    return markup;
                }
            }).on("select2-blur", function () {
                $("#dtS2Route").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#dtS2Route").closest('form').submit(); }
                else { $("#dtS2Route").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#dtS2Route').val();
                $("#dtS2Route").select2("data", { id: a, text: a });
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
            if ($("#dtS2Route", this).select2('val') != null && $("#dtS2Route", this).select2('val') != '') {
                $("input", this).val($("#dtS2Route", this).select2("data").text);

            }
        }
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $.editable.addInputType('EditableTicket', {
        element: function (settings, original) {
            //var input = $('<input id="dtChkTicket" type="checkbox" checked>');
            var input = $('<input id="dtChkTicket" type="checkbox" checked data-toggle="toggle" data-style="ios" data-size="mini" data-onstyle="success" data-offstyle="danger">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            $(this).find('#dtChkTicket')
                    .bootstrapToggle({
                        "on": "yes",
                        "off": "no"
                    });
        }
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
}
function InitRangeMarkup() {


    var Tbl = TblDashboardRangeMarkup;

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassMinRange', Tbl.rows().nodes()).editable(function (sVal, settings) {
        var cell = Tbl.cell($(this).closest('td')).index();
        Tbl.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'EditableMinRange', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassMaxRange', Tbl.rows().nodes()).editable(function (sVal, settings) {
        var cell = Tbl.cell($(this).closest('td')).index();
        Tbl.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'EditableMaxRange', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassYesorNo', Tbl.rows().nodes()).editable(function (sVal, settings) {


        var cell = Tbl.cell($(this).closest('td')).index();
        //var id = $('#dtS2Approver').select2('data').id;
        //var name = $('#dtS2Approver').select2('data').RelName;
        //var age = $('#dtS2Approver').select2('data').Age;
        //var dob = $('#dtS2Approver').select2('data').dob;
        Tbl.cell(cell.row, cell.column).data(sVal);
        //Tbl.cell(cell.row, ennTicket.id).data(id);
        //Tbl.cell(cell.row, ennTicket.dob).data(dob);
        //Tbl.cell(cell.row, ennTicket.RelName).data(name);
        //Tbl.cell(cell.row, ennTicket.Age).data(age);


        return sVal;
    },
    {
        "type": 'EditableYesNo', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassName', Tbl.rows().nodes()).editable(function (sVal, settings) {
        var cell = Tbl.cell($(this).closest('td')).index();
        Tbl.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'EditableName', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassDeleted', Tbl.rows().nodes()).editable(function (sVal, settings) {
        var cell = Tbl.cell($(this).closest('td')).index();
        Tbl.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'EditableDeleted', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });



    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassPercentage', Tbl.rows().nodes()).editable(function (sVal, settings) {
        var cell = Tbl.cell($(this).closest('td')).index();
        Tbl.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'EditablePercentage', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassDOB', Tbl.rows().nodes()).editable(function (sVal, settings) {
        var cell = Tbl.cell($(this).closest('td')).index();
        Tbl.cell(cell.row, cell.column).data(sVal);

        //if (sVal.trim().length > 0) {
        //    var age = c.GetAge(sVal);
        //    Tbl.cell(cell.row, ennTicket.Age).data(age);
        //}

        return sVal;
    },
    {
        "type": 'EditableDOB', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassS2Relationship', Tbl.rows().nodes()).editable(function (sVal, settings) {
        var cell = Tbl.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#dtS2Relationship');
        Tbl.cell(cell.row, ennTicket.RelationshipID).data(id);
        Tbl.cell(cell.row, cell.column).data(sVal);

        return sVal;
    },
    {
        "type": 'EditableRelationship', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassS2Eligibility', Tbl.rows().nodes()).editable(function (sVal, settings) {
        var cell = Tbl.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#dtS2Eligibility');
        Tbl.cell(cell.row, ennTicket.EligibleID).data(id);
        Tbl.cell(cell.row, cell.column).data(sVal);

        return sVal;
    },
    {
        "type": 'EditableEligibility', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassS2Route', Tbl.rows().nodes()).editable(function (sVal, settings) {
        var cell = Tbl.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#dtS2Route');
        Tbl.cell(cell.row, ennTicket.RouteID).data(id);
        Tbl.cell(cell.row, cell.column).data(sVal);

        return sVal;
    },
    {
        "type": 'EditableRoute', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassTicket', Tbl.rows().nodes()).editable(function (event, state) {
        var cell = Tbl.cell($(this).closest('td')).index();
        Tbl.cell(cell.row, ennTicket.TicketEnt).data(state === true ? 1 : 0);

    },
    {
        "type": 'EditableTicket', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------


}

// -----------------------------------------------------------------------------------------------------------------------------------------------------------
