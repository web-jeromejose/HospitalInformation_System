var c = new Common();
var Action = -1;
var Select2IsClicked = false;

//-------------------------------------------------------
var tblItemsList;
var tblItemsListId = '#gridReouringItem'
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
    BindReroutingList([]);
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
    Sel2Server($("#Select2Pharmacy"), $("#url").data("getpahar"), function (d) {
        //alert(d.tariffid);
        //var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);
        //var list = e.added.list;
        //var CategoryId = (d.id);
        //InvenItemMarkupConnection(CategoryId, TypeId)
        //var CategoryId = c.GetSelect2Id('#Select2DeptStation');
        var Id = (d.id);
        ReroutingItem(Id);
            
    });



    ///----Client Side
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
            "Station": "",
            "FromTime": "12:00:00 AM",
            "ToTime": "11:59:59 PM",
            "stationid": "",//c.GetSelect2Id('#Select2Pharmacy'),
            "blank": "Remove"
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
function BindReroutingList(data) {
    tblItemsList = $(tblItemsListId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        bAutoWidth: true,
        dom: 'Rlfrtip',
        scrollY: 350,
        scrollX: false,
        fixedHeader: true,
        columns: ShowReroutingItem()
        //fnRowCallback: ShowDeprtLvlMarkUpDashboardCallBack(),
    });

    InitSelectedRange();
}

function ShowInvetoryItemMarkUpCallBack() {
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

function ShowReroutingItem() {
    var cols = [
    { targets: [0], data: "Station", className: 'ClassSelect2Station', visible: true, searchable: true, width: "10%" },
    { targets: [1], data: "FromTime", className: 'CLassFromTime', visible: true, searchable: true, width: "20%" },
    { targets: [2], data: "ToTime", className: 'CLassToTime', visible: true, searchable: true, width: "20%" },
    { targets: [3], data: "stationid", className: '', visible: false, searchable: false},
    { targets: [4], data: "blank", className: '', visible: true, searchable: false, width: "1%" }
   
    ];
    return cols;
}


function ReroutingItem(Id) {

    var Url = $('#url').data("fetchreoutingitem");
    var param = {
        Id: Id
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

            BindReroutingList(data.list);
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


    $.editable.addInputType('datepickerFromTime', {
        element: function (settings, original) {
            var input = $('<input id="txtfromTime" type="text" class="form-group date"/>');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            $(this).find('#txtfromTime')
                    .datetimepicker({
                        pickDate: false
                       // format: 'LT'
                        //pickTime: true

                    });

        }
    });

    $.editable.addInputType('datepickerToTime', {
        element: function (settings, original) {
            var input = $('<input id="txtToTime" type="text" class="form-group date"/>');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            $(this).find('#txtToTime')
                    .datetimepicker({
                        pickDate: false
                        // format: 'LT'
                        //pickTime: true

                    });

        }
    });



    $.editable.addInputType('select2Stations', {
        element: function (settings, original) {
            var input = $('<input id="txtstation" style="width:100%; height:30px;" type="text" class="sel">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#txtstation').select2({
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    cache: false,
                    quietMillis: 150,
                    url: $('#url').data("getstationlist"),
                    //url: baseURL + 'Select2EmployeeRelationShip',
                    dataType: 'jsonp',
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
            }).on("select2-blur", function () {
                $("#txtstation").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#txtstation").closest('form').submit(); }
                else { $("#txtstation").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#txtstation').val();
                $("#txtstation").select2("data", { id: a, text: a });
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
            if ($("#txtstation", this).select2('val') != null && $("#txtstation", this).select2('val') != '') {
                $("input", this).val($("#txtstation", this).select2("data").text);

                var rowIndex = tblItemsList.row($(this).closest('tr')).index();
                var id = $("#txtstation", this).select2('data').id;
                tblItemsList.cell(rowIndex, 3).data(id);

            }
        }
    });

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

    $('.CLassFromTime', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        tblItemsList.cell(cell.row, cell.column).data(sVal);

        //if (sVal.trim().length > 0) {
        //    var age = c.GetAge(sVal);
        //    tblItemsList.cell(cell.row, 1).data(age);
        //}

        return sVal;
    },
    {
        "type": 'datepickerFromTime', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.CLassToTime', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        tblItemsList.cell(cell.row, cell.column).data(sVal);

        //if (sVal.trim().length > 0) {
        //    var age = c.GetAge(sVal);
        //    tblItemsList.cell(cell.row, 1).data(age);
        //}

        return sVal;
    },
   {
       "type": 'datepickerToTime', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
       "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
   });
   
    //-------------------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassSelect2Station', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        /*to Get ID*/
        //   var id = c.GetSelect2Id('#select2Relationship');
        //   tblFamilyDetails.cell(cell.row, 0).data(id);
        tblItemsList.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'select2Stations', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
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

  

    ret = c.IsEmptyById('#Select2Pharmacy');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Pharmacy');
        return false;
    }

    //ret = c.IsEmptyById('#Select2Type');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a Type');
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
    entry.PharmacyId = c.GetSelect2Id('#Select2Pharmacy');


    entry.ReRouteDetailsSaveModel = [];
    $.each(tblItemsList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.ReRouteDetailsSaveModel.push({
            ActivePharmacyStnId: row.stationid,
            FromTime: row.FromTime,
            ToTime: row.ToTime
            

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
