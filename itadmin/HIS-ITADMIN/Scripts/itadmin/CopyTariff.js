var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridIPService'
var tblItemsListDataRow;

var tblOPItemsList;
var tblOPItemsListId = '#gridOPService'
var tblOPItemsListDataRow;

$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // For future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();
    //if (tabNameSelected == $('.nav-tabs .active').text());
    //{
    //       RedrawGrid();
    //}

    RedrawGrid();

})

$(document).ready(function () {

    InitButton();
    InitDateTimePicker();
    InitSelect2();
    CopyIPTariffDashBoardConnection();
    CopyOPTariffDashBoardConnection();
    InitDataTables();
    RedrawGrid();
    DefaultValues();
});
    
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();
    if (tblOPItemsList !== undefined) tblOPItemsList.columns.adjust().draw();
  
    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}


function InitDataTables() {
    //BindSequence([]);
    BindListofItem([]);
    BindOPListofItem([]);
}

function InitSelect2() {
    // Sample usage

    $('#select2FromTariff').select2({
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

    $('#select2ToTariff').select2({
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


    
    $('#select2FromOPTariff').select2({
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

    $('#select2ToIPTariff').select2({
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
        var list = e.added.list;
        //var TableExists = 0;
        //var TariffID =  c.GetSelect2Id('#select2Tariff');
        //var ServiceID = c.GetSelect2Id('#Select2Service');
        //var DepartmentID = c.GetSelect2Id('#Select2Department');
        //ShowListofNoPriceFetch(TariffID, ServiceID, DepartmentID, TableExists);
        //ShowListwithPriceFetch(TariffID, ServiceID, DepartmentID, TableExists);
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
        Process();
    });

    $('#btnSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
      
    });

    $('#btnOPSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            SaveOP();
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
}

function InitDateTimePicker() {
    // Sample usage

    $('#dtIPEffectivity').datetimepicker({
        picktime: false,
     }).on('dp.change', function (e) {
     });
 

    $('#dtOPEffectivity').datetimepicker({
        picktime: false,
     }).on('dp.change', function (e) {
   });

    
}

function DefaultValues() {
    // Sample usage
    c.SetValue('#txtOPPercentage', '0');
    c.SetValue('#txtPercentage', '0');
    //    c.SetSelect2('#select2PackageType', '7', 'Procedure');
    // c.iCheckSet('#iChkLast3Mos', true);

    //c.SetSelect2('#Select2Type', '1', 'Major');

}


//-----------------IP Services--List-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
$(document).on("click", "#iChkAllTestIP", function () {
    if ($('#iChkAllTestIP').is(':checked')) {
        $.each(tblItemsList.rows().data(), function (i, row) {
            tblItemsList.cell(i, 0).data('<input id="chkselectedIP" type="checkbox" checked="checked" >');
        });
    }
    else {
        $.each(tblItemsList.rows().data(), function (i, row) {
            tblItemsList.cell(i, 0).data('<input id="chkselectedIP" type="checkbox">');
        });
    }
});


function BindListofItem(data) {

    tblItemsList = $(tblItemsListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowListColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowListColumns() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselectedIP" id="chkselectedIP"/>' },
      { targets: [1], data: "ID", className: '', visible: false, searchable: false},
      { targets: [2], data: "ServiceName", className: '', visible: true, searchable: true, width: "10%" }


    ];
    return cols;
}

function CopyIPTariffDashBoardConnection() {

    var Url = $('#url').data("getipservicedash");
    $('#preloader').show();
    //$('#loadingpdf').show();
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

            BindListofItem(data.list);
            $('#preloader').hide();
            //RedrawGrid();
        },
        error: function (xhr, desc, err) {
            //$('#loadingpdf').hide();
            $('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}

//-----------------OP Services--List-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
$(document).on("click", "#iChkAllTestOP", function () {
    if ($('#iChkAllTestOP').is(':checked')) {
        $.each(tblOPItemsList.rows().data(), function (i, row) {
            tblOPItemsList.cell(i, 0).data('<input id="chkselectedOP" type="checkbox" checked="checked" >');
        });
    }
    else {
        $.each(tblOPItemsList.rows().data(), function (i, row) {
            tblOPItemsList.cell(i, 0).data('<input id="chkselectedOP" type="checkbox">');
        });
    }
});


function BindOPListofItem(data) {

    tblOPItemsList = $(tblOPItemsListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowOPListColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowOPListColumns() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselectedOP" id="chkselectedOP"/>' },
      { targets: [1], data: "ID", className: '', visible: false, searchable: false },
      { targets: [2], data: "ServiceName", className: '', visible: true, searchable: true, width: "10%" }


    ];
    return cols;
}

function CopyOPTariffDashBoardConnection() {

    var Url = $('#url').data("getopservicedash");
    $('#preloader').show();
    //$('#loadingpdf').show();
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

            BindOPListofItem(data.list);
            $('#preloader').hide();
            //RedrawGrid();
        },
        error: function (xhr, desc, err) {
            //$('#loadingpdf').hide();
            $('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Validated() {

    var ret = false;


    //ret = c.IsEmpty('#txtHomeAdress');

    //if (ret) {
    //    c.MessageBoxErr('Y/N...', 'Please input Y for YES and N for NO');
    //    return false;
    //}


    ret = c.IsEmptySelect2('#select2FromTariff');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a From Tariff');
        return false;
    }


    ret = c.IsEmptySelect2('#select2ToTariff');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a To Tariff');
        return false;
    }


    //ret = c.IsEmptySelect2('#select2FromOPTariff');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a From Tariff');
    //    return false;
    //}

    //ret = c.IsEmptySelect2('#select2ToIPTariff');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a To Tariff');
    //    return false;
    //}




    return true;

}


function ValidatedOP() {

    var ret = false;


    //ret = c.IsEmpty('#txtHomeAdress');

    //if (ret) {
    //    c.MessageBoxErr('Y/N...', 'Please input Y for YES and N for NO');
    //    return false;
    //}


    //ret = c.IsEmptySelect2('#select2FromTariff');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a From Tariff');
    //    return false;
    //}


    //ret = c.IsEmptySelect2('#select2FromTariff');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a To Tariff');
    //    return false;
    //}


    ret = c.IsEmptySelect2('#select2FromOPTariff');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a From OP Tariff');
        return false;
    }

    ret = c.IsEmptySelect2('#select2ToIPTariff');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a To OP Tariff');
        return false;
    }




    return true;

}

function Save() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = 1;
    entry.fromTariffId = c.GetSelect2Id('#select2FromTariff');
    entry.toTariffId = c.GetSelect2Id('#select2ToTariff');
    entry.Effecdate = c.GetDateTimePickerDateTimeSCS('#dtIPEffectivity');
    // var ParseFloat = $('#txtPercentage').parseFloat(val());
  //  var 
    entry.percentage = $('#txtPercentage').val();


    entry.CopyIPTariffServiceDetailsSave = [];
    var rowcollection = tblItemsList.$("#chkselectedIP:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsList.row(tr);
        var rowdata = row.data();

        entry.CopyIPTariffServiceDetailsSave.push({
            serviceId: rowdata.ID
        });
    });
    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $('#preloader').show();
            c.ButtonDisable('#btnSave', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            $('#preloader').hide();
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


function SaveOP() {

    var ret = ValidatedOP();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = 1;
    entry.fromTariffId = c.GetSelect2Id('#select2FromOPTariff');
    entry.toTariffId = c.GetSelect2Id('#select2ToIPTariff');
    entry.Effecdate = c.GetDateTimePickerDateTimeSCS('#dtOPEffectivity');
    entry.percentage = $('#txtOPPercentage').val();


    entry.CopyOPTariffServiceDetailsSave = [];
    var rowcollection = tblOPItemsList.$("#chkselectedOP:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblOPItemsList.row(tr);
        var rowdata = row.data();

        entry.CopyOPTariffServiceDetailsSave.push({
            serviceId: rowdata.ID
        });
    });
    $.ajax({
        url: $('#url').data("saveop"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $('#loadingpdf').show();
            $('#preloader').show();
            c.ButtonDisable('#btnSave', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            $('#loadingpdf').hide();
            $('#preloader').hide();
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