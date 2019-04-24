var c = new Common();
var Action = -1;
var Select2IsClicked = false;

//-------------------------------------------------------
var tblItemsList;
var tblItemsListId = '#gridORCharges'
var tblItemsListDataRow;


var GetMaxRange;

var CategoryId;

$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // For future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();
    //if (tabNameSelected == $('.nav-tabs .active').text());
    //{
    //       RedrawGrid();
    //}

    RedrawGrid();

})

$(document).on("dblclick", tblItemsListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');

        tblItemsListDataRow = tblItemsList.row($(this).parents('tr')).data();
    }

    remove_SelectedRangeMarkUp(this);

    RedrawGrid();

});


$(document).ready(function () {
    SetupSelectedRange();
    //SetupSelectedRangeMarkUp();
    InitSelect2();
    InitButton();
    //ShowRangeMax();
    
    //RangeMarkUpConnection();

    DefaultValues();
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
    BindOrCharges([]);
    //BindRangeMarkupList([]);
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
    Sel2Server($("#Select2Tariff"), $("#url").data("selecttariff"), function (d) {
        //alert(d.tariffid);
        //var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);
        //var list = e.added.list;
        //var CategoryId = (d.id);
        //InvenItemMarkupConnection(CategoryId, TypeId)
        var CategoryId = (d.id);
       
        ORChargesConnection(CategoryId);
            
    });


    //FOR SERVER SIDE
    //Sel2Server($("#Select2Type"), $("#url").data("gettypes"), function (d) {
    //    //alert(d.tariffid);
    //    TypeId = (d.id);
    //    //var CompanyID = (d.id);
    //    //var tarrifId = (d.tariffid);
    //        var CategoryId = c.GetSelect2Id('#Select2DeptStation');
    //        var TypeId = c.GetSelect2Id('#Select2Type');
    //        InvenItemMarkupConnection(CategoryId, TypeId);


    //});
    /////----Client Side
    //$("#Select2Type").select2({
    //    data: [{ id: 1, text: 'IMPORT' },
    //           { id: 2, text: 'LOCAL' }],
    //    minimumResultsForSearch: -1
    //}).change(function (e) {
    //    //var list = e.added.list;
    //    var CategoryId = c.GetSelect2Id('#Select2DeptStation');
    //    var TypeId = c.GetSelect2Id('#Select2Type');
    //    InvenItemMarkupConnection(CategoryId, TypeId);
    //});




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

    $('#btnSave').click(function () {
        var YesFunc = function () {
            Action = 1;
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


    $('#btnAdd').click(function () {
        var ret = Validated();
        if (!ret) return ret;

        var ctr = $(tblItemsListId).DataTable().rows().nodes().length + 1;
        //var MaxRange = tblRangeMarkUpDashboardDataRow.MinRange;
        tblItemsList.row.add({
            "SNo": ctr,
            "MinRange": "",
            "MaxRange": "",
            "Percentage": ""
            //"EmpId": Action == 1 ? "" : GetID,
            //"AchievementYear": ""
        }).draw();
        InitSelectedRange();
        return ret;
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

    //
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

    if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();
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
    c.DisableDateTimePicker('#dtMonth', true);
    //c.DisableSelect2('#Select2RefDoctor', true);
    //c.DisableSelect2('#Select2ProcedureDoneBy', true);




}

function DefaultValues()
{

    c.SetSelect2('#Select2Type', "1", 'IMPORT');


}

//-------------------DepartlevelMarkupDashboard------------------------------------------------------------------------------------------------------------
// Sample usage
// BindDashboard([]);
/*[RenderTable]*/
function BindOrCharges(data) {
    tblItemsList = $(tblItemsListId).DataTable({
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
        columns: ShowOrCharges(),
        fnRowCallback: ShowOrchargesCallBack()
    });

    InitSelectedRange();
}

function ShowOrchargesCallBack() {
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

function ShowOrCharges() {
    var cols = [
    { targets: [0], data: "SNo", className: '', visible: true, searchable: true, width: "2%" },
    { targets: [1], data: "ORNo", className: '', visible: false},
    { targets: [2], data: "ORNoName", className: '', visible: true, searchable: true, width: "20%" },
    { targets: [3], data: "Percentage", className: 'ClassPercentage', visible: true, searchable: true, width: "20%" }
    //{ targets: [4], data: "ID", className: '', visible: false, searchable: false}
   
    ];
    return cols;
}

function ORChargesConnection(CategoryId) {

    var Url = $('#url').data("orchargesdashboard");
    var param = {
        CategoryId: CategoryId
    };

    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

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

            BindOrCharges(data.list);
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

    $.editable.addInputType('txtMinRange', {
        element: function (settings, original) {

            var input = $('<input id="txtMinRange" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
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
    $('.ClassMinRange', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        tblItemsList.cell(cell.row, 1).data(sVal);


        return sVal;
    },
    {
        "type": 'txtMinRange', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassMaxRange', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        tblItemsList.cell(cell.row, 2).data(sVal);


        return sVal;
    },
    {
        "type": 'txtMaxRange', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });



    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassPercentage', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        tblItemsList.cell(cell.row, 3).data(sVal);


        return sVal;
    },
    {
        "type": 'txtPercentage', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // Resize all rows.
    $(tblItemsListId + ' tr').addClass('trclass');

}

function remove_SelectedRangeMarkUp(cell) {
    rowV = $(cell).parents('tr');
    tblItemsList.row(rowV).remove().draw();
    c.ReSequenceDataTable(tblItemsListId, 0);
}

//-------------------------------------------------------------------------------------------------------------------------------

function Validated() {

    var ret = false;

  

    ret = c.IsEmptyById('#Select2Tariff');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Tariff');
        return false;
    }



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
    entry.CategoryId = c.GetSelect2Id('#Select2Tariff');
   

    entry.ORChargesDetailsSave = [];
    $.each(tblItemsList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.ORChargesDetailsSave.push({
            ORNo: row.ORNo,
            Percentage: row.Percentage

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
