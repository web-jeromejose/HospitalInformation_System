var c = new Common();
var Action = -1;
var Select2IsClicked = false;

//-------------------------------------------------------
var tblItemsList;
var tblItemsListId = '#gridOPClinicView'
var tblItemsListDataRow;



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

    //remove_SelectedRangeMarkUp(this);

    RedrawGrid();

});

$(document).on("click", "#iChkAll", function () {
    if ($('#iChkAll').is(':checked')) {
        $.each(tblItemsList.rows().data(), function (i, row) {
            tblItemsList.cell(i, 9).data('<input id="chkselected" type="checkbox" checked="checked" >');
        });
    }
    else {
        $.each(tblItemsList.rows().data(), function (i, row) {
            tblItemsList.cell(i, 9).data('<input id="chkselected" type="checkbox">');
        });
    }
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
    BindOPDoctorList([]);
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
    Sel2Server($("#Select2Depart"), $("#url").data("getdepartment"), function (d) {
        //alert(d.tariffid);
        //var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);
        //var list = e.added.list;
        //var CategoryId = (d.id);
        //InvenItemMarkupConnection(CategoryId, TypeId)
        //var CategoryId = c.GetSelect2Id('#Select2DeptStation');
        var Id = (d.id);
        OPClinicView(Id);
            
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
function BindOPDoctorList(data) {
    tblItemsList = $(tblItemsListId).DataTable({
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
        columns: ShowOPClinicItem(),
        fnRowCallback: ShowOPClinicCallBack()
    });

    InitSelectedRange();
}

function ShowOPClinicCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['selected'];
        var $nRow = $(nRow);

      ///  WardDemand
        if (value == 0) {
            $('#chkselected', nRow).prop('checked', aData.selected === 1);
            //if (value === 2) {
            //    $('#chkselected', nRow).prop("disabled", "disabled");
            //}
        }
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    };
    return rc;

}

function ShowOPClinicItem() {
    var cols = [
    { targets: [0], data: "SNo", className: '', visible: true, searchable: false, width: "2%" },
    { targets: [1], data: "Id", className: '', visible: false,  searchable: false},
    { targets: [2], data: "DoctorName", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [3], data: "ClinicName", className: 'ClassClinicalName', visible: true, searchable: true, width: "5%" },
    { targets: [4], data: "WaitTime", className: 'ClassAvewait', visible: true, searchable: true, width: "10%" },
    { targets: [5], data: "Sequence", className: 'ClassSquence', visible: true, searchable: true, width: "10%" },
    { targets: [6], data: "BuildingId", className: 'ClassBuilding', visible: true, searchable: true, width: "5%" },
    { targets: [7], data: "RoomId", className: 'ClassRoom', visible: true, searchable: true, width: "5%" },
    { targets: [8], data: "ClinicId", className: 'ClassClinc', visible: false},
    { targets: [9], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected" checked = "checked"/>' },
   
    ];
    return cols;
}


function OPClinicView(Id) {

    var Url = $('#url').data("fetchopclinic");
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

            BindOPDoctorList(data.list);
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
    $.editable.addInputType('txtClinicalName', {
        element: function (settings, original) {

            var input = $('<input id="txtClinicalName" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);

        }
    });

    $.editable.addInputType('txtAverangeWait', {
        element: function (settings, original) {

            var input = $('<input id="txtAverangeWait" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

    $.editable.addInputType('txtSequence', {
        element: function (settings, original) {

            var input = $('<input id="txtSequence" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

    $.editable.addInputType('txtbuildingNo', {
        element: function (settings, original) {

            var input = $('<input id="txtbuildingNo" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

    $.editable.addInputType('txtClinic', {
        element: function (settings, original) {

            var input = $('<input id="txtClinic" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

    $.editable.addInputType('txtRoomId', {
        element: function (settings, original) {

            var input = $('<input id="txtRoomId" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

}

function InitSelectedRange() {

    $('.ClassClinicalName', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        /*to Get ID*/
        //   var id = c.GetSelect2Id('#select2Relationship');
        tblItemsList.cell(cell.row, 3).data(sVal);
        //tblItemsList.cell(cell.row, cell.column).data(sVal);

        return sVal;
    },
{
    "type": 'txtClinicalName', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
    "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
});
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassAvewait', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        tblItemsList.cell(cell.row, 4).data(sVal);


        return sVal;
    },
    {
        "type": 'txtAverangeWait', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassSquence', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        tblItemsList.cell(cell.row, 5).data(sVal);


        return sVal;
    },
    {
        "type": 'txtSequence', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassBuilding', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        tblItemsList.cell(cell.row, 6).data(sVal);


        return sVal;
    },
    {
        "type": 'txtbuildingNo', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    $('.ClassRoom', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        tblItemsList.cell(cell.row, 7).data(sVal);


        return sVal;
    },
   {
       "type": 'txtRoomId', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
       "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
   });
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassClinc', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        tblItemsList.cell(cell.row, 8).data(sVal);


        return sVal;
    },
    {
        "type": 'txtClinic', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

   
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
   
    // Resize all rows.
    $(tblItemsListId + ' tr').addClass('trclass');

}

//function remove_SelectedRangeMarkUp(cell) {
//    rowV = $(cell).parents('tr');
//    tblItemsList.row(rowV).remove().draw();
//    c.ReSequenceDataTable(tblItemsListId, 0);
//}

//-------------------------------------------------------------------------------------------------------------------------------

function Validated() {

    var ret = false;

  

    ret = c.IsEmptyById('#Select2Depart');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select Department');
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
    entry.Action = 1;
    entry.DepartmentId = c.GetSelect2Id('#Select2Depart');


    entry.OPDoctorClinicDetailsSave = [];
    var rowcollection = tblItemsList.$("#chkselected:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsList.row(tr);
        var rowdata = row.data();
    //$.each(tblItemsList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.OPDoctorClinicDetailsSave.push({
            DoctorId: rowdata.Id,
            DoctorName: rowdata.DoctorName,
            ClinicName: rowdata.ClinicName,
            WaitTime: rowdata.WaitTime,
            BuildingNo: rowdata.BuildingNo,
            RoomNo: rowdata.RoomNo,
            Sequence: rowdata.Sequence
            

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
                InitDataTables();
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
