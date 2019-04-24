var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridIPCashConfig'
var tblItemsListDataRow;

var GetCashMarckUp;

//var tblItemsMapListId = '#gridItemCodeMap'
//var tblItemsMapListDataRow;


$(document).ready(function () {
  
    //SetupSelectedMarkup();
    InitButton();
    IPCashMarkUpConnection();
    ShowRangeMax();
    //InitDateTimePicker();
    //InitSelect2();
 
    InitDataTables();

    RedrawGrid();
    
});
    
//$(document).on("click", "#iChkAllTest", function () {
//    if ($('#iChkAllTest').is(':checked')) {
//        $.each(tblItemsList.rows().data(), function (i, row) {
//            tblItemsList.cell(i, 0).data('<input id="chkselected" type="checkbox" checked="checked" >');
//        });
//    }
//    else {
//        $.each(tblItemsList.rows().data(), function (i, row) {
//            tblItemsList.cell(i, 0).data('<input id="chkselected" type="checkbox">');
//        });
//    }
//});

function InitDataTables() {
    //BindSequence([]);
    BindIPCashMarkUp([]);
    //BindMapListofItem([]);
}

function InitSelect2() {
    // Sample usage

    $('#select2Tariff').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("gettariff"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: c.GetSelect2
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

    
    $('#Select2Service').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getservices"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: c.GetSelect2
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

    $('#Select2Department').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getservicesdept"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    ServiceID: c.GetSelect2Id('#Select2Service')
                   
                };
            },

            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }

        }
    }).change(function (e) {
        var list = e.added.list;
        var TableExists = 0;
        var TariffID =  c.GetSelect2Id('#select2Tariff');
        var ServiceID = c.GetSelect2Id('#Select2Service');
        var DepartmentID = c.GetSelect2Id('#Select2Department');
        ShowListofNoPriceFetch(TariffID, ServiceID, DepartmentID, TableExists);
        ShowListwithPriceFetch(TariffID, ServiceID, DepartmentID, TableExists);
        //c.SetDateTimePicker('#dtORderdate', list[0]);
        //c.SetSelect2('#select2TicketType', list[1], list[2]);
        //var ID = c.GetSelect2Id('#select2orderno');
        //TravelOrderList(ID);
        //c.SetValue('#txtOrderNumber', c.GetSelect2Text('#select2orderno'));
        //$("#btngetOrder").prop("disabled", true);
        //$("#btnAdd").prop("disabled", false);
        //$("#btnNewEntry").prop("disabled", true);
        //FetchAgencyName(list);

    });



}

function InitButton() {
    var NoFunc = function () {
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

    $('#btnProcess').click(function () {

        var YesFunc = function () {
            Action = 1;
            Process();
        };
        c.MessageBoxConfirm("Mapping Code Entry?", "Are you sure you want to Map NewCode?", YesFunc, null);
        //c.ModalShow('#modalEntry', true);
     
    });

    $('#btnSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
      
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


    //$('#btnAddScientificAchievement').click(function () {
    //    var ctr = $(tblScientificAchievementListId).DataTable().rows().nodes().length + 1;
    //    tblScientificAchievement.row.add({
    //        "SNo": ctr,
    //        "ScientificAchievement": "",
    //        "TransAchievementYear": "",
    //        "Awards": "",
    //        "Remarks": "",
    //        "EmpId": Action == 1 ? "" : GetID,
    //        "AchievementYear": ""
    //    }).draw();
    //    InitSelectedScientificAchievement();
    //});

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
}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindIPCashMarkUp(data) {

    tblItemsList = $(tblItemsListId).DataTable({
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
        columns: ShowIPCashMarkUpColumns(),
        fnRowCallback: ShowIPCashCallBack()
    });

   //InitSelectedMarkUp();
}

function ShowIPCashCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['selected'];
        var $nRow = $(nRow);

        if (aData.selected.length != 1) {
            $('#chkselected', nRow).prop('checked', aData.selected === 1);
        }
        //var value = aData['Price'];
        //var $nRow = $(nRow);

        ////WardDemand
        //if (value == '') {
        //    $nRow.css({ "background-color": "#d7ffea" })
        //}
            //ISSUED
        //else if (value == 1) {
        //    $nRow.css({ "background-color": "#d7ffea" })
        //}
        //    //Partial Issues
        //else if (value == 3) {
        //    $nRow.css({ "background-color": "#f5b044" })
        //}

    };
    return rc;

}

function ShowIPCashMarkUpColumns() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected"/>' },
      { targets: [1], data: "ServiceName", className: '', visible: true, searchable: true, width: "40%" },
      { targets: [2], data: "ID", className: '', visible: false, searchable: false }
    
    ];
    return cols;
}

function IPCashMarkUpConnection() {

    var Url = $('#url').data("getipcashmarkup");

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

            BindIPCashMarkUp(data.list);
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

function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();
    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}

function ShowRangeMax() {

    var Url = $('#url').data("getdefaultmarkup");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (DefaultMarkUp) {
            //var data = DefaultMarkUp.list[0];
            GetCashMarckUp = DefaultMarkUp[0].CashMarkUp;
            c.SetValue('#txtMarkUp', GetCashMarckUp);


        }
    });

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Validated() {

    //var ret = false;

    //ret = c.IsEmptyById('#Select2Pharmacy');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a Pharmacy');
    //    return false;
    //}







    return true;

}

function Save() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = 1;
    entry.CashMarkUpDefault = $('#txtMarkUp').val();
    entry.IPCashMarkupDetailsSave = [];
    var rowcollection = tblItemsList.$("#chkselected:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsList.row(tr);
        var rowdata = row.data();

        entry.IPCashMarkupDetailsSave.push({
            ID: rowdata.ID
           
         
        });
    });


    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            c.ButtonDisable('#btnSave', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            //c.ButtonDisable('#btnModify', false);
            c.ButtonDisable('#btnSave', false);

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
                //HandleEnableButtons();
                //HandleEnableEntries();
                IPCashMarkUpConnection();
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
