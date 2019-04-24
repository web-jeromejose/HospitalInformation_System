var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridItemList'
var tblItemsListDataRow;

var tblItemsMapList;
var tblItemsMapListId = '#gridItemZeroPrice'
var tblItemsMapListDataRow;


$(document).ready(function () {
    // SetupDataTables();
    //SetupSelectedPrice();
    InitButton();
    ShowListItemFetch();
    ShowListItemMapFetch();
    //InitDateTimePicker();
    InitSelect2();

    InitDataTables();
  
});

$(document).on("click", tblItemsListId + " td", function (e) {
    //e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        //tr.toggleClass('selected');

        // Single selection
        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected')

        tblItemsListDataRow = tblItemsList.row($(this).parents('tr')).data();

        add_ListofItem(this);
        remove_SelectedListofItem(this);
    }
});

$(document).on("click", tblItemsMapListId + " td", function (e) {
    //e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        tr.toggleClass('selected');

        // Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')

        tblItemsMapListDataRow = tblItemsMapList.row($(this).parents('tr')).data();

        add_ListMapItem(this);
        remove_SelectedMapListofItem(this);
    }
});

function InitDataTables() {
    //BindSequence([]);
    BindListofItem([]);
    BindMapListofItem([]);
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
        var TariffID = c.GetSelect2Id('#select2Tariff');
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
}

function InitDateTimePicker() {
    // Sample usage
    $('#dtMonth').datetimepicker({
        picktime: false,
        format: 'mm-yyyy'
    }).on('dp.change', function (e) {
        //c.SetDateTimePicker('#dtMonth');
        //var a = $('#dtfrom').data("DateTimePicker").getDate();
        //var b = moment(a).format(dateFormatOnDisplay);
        c.SetDateTimePicker('#dtfrom', new Date(year, month, 1));
    });
    //$('#dtTo').datetimepicker({
    //    picktime: false
    //}).on('dp.change', function (e) {

    //});

    //$('#dtProceduredoneon').datetimepicker({
    //    picktime: true
    //}).on('dp.change', function (e) {
    //    //var a = $('#dtfrom').data("DateTimePicker").getDate();
    //    //var b = moment(a).format(dateFormatOnDisplay);
    //    //c.SetDateTimePicker('#dtfrom', b);
    //});
}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}

//-------------------List of  Item--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindListofItem(data) {

    tblItemsList = $(tblItemsListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowListitemsColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowListitemsColumns() {
    var cols = [
      //{ targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselectedtest" id="chkselectedtest"/>' },
      { targets: [0], data: "SelectedItem", className: '', visible: true, searchable: true, width: "1%" },
      { targets: [1], data: "ItemCode", className: '', visible: false, searchable: false},
      { targets: [2], data: "Name", className: '', visible: false, searchable: false },
      { targets: [3], data: "CategoryID", className: '', visible: false, searchable: false },
      { targets: [4], data: "ItemId", className: '', visible: false, searchable: false }
  
    ];
    return cols;
}

function ShowListItemFetch() {
    var Url = $("#url").data("getlistitem");
    //var param = {

    //};
    //$('#preloader').show();
  
    //$("#grid").css("visibility", "hidden");

    $('#preloader').show();
    $.ajax({
        url: Url,
        //data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {
            //showindicator.Show('#gridItemList');
        },
        success: function (data) {
            //showindicator.Stop('#gridItemList');
            //if (TblGridCrossMatchAvail.rows('.selected').data().length == 0) {
            //    c.MessageBoxErr("Empty...", "No Bags Reserved.", null);
            //    return;
            //}
            BindListofItem(data.list);
            //$("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            //showindicator.Stop('#gridItemList');

            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });
 
}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

//-------------------List of Mapping--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindMapListofItem(data) {

    tblItemsMapList = $(tblItemsMapListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowListMapitemsColumns()
        //fnRowCallback: ShowWithPriceRowCallBack()
    });

    //InitSelectedPrice();
}

function ShowMapRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['Price'];
        var $nRow = $(nRow);

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

function ShowListMapitemsColumns() {
    var cols = [
      { targets: [0], data: "SelectedItem", className: '', visible: true, searchable: true, width: "1%" },
      { targets: [1], data: "ItemCode", className: '', visible: false, searchable: false },
      { targets: [2], data: "Name", className: '', visible: false, searchable: false },
      { targets: [3], data: "CategoryID", className: '', visible: false, searchable: false },
      { targets: [4], data: "ItemId", className: '', visible: false, searchable: false }
    


    ];
    return cols;
}

function ShowListItemMapFetch() {
    var Url = $("#url").data("getlistitemzero");
    //var param = {

    //};
  
    $('#preloader').show();
    //$("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        //data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {
           $('#preloader').show();
          
        },
        success: function (data) {
            $('#preloader').hide();
            //$('#preloader').hide();
            //showindicator.Stop('#gridItemList');
      
            //if (TblGridCrossMatchAvail.rows('.selected').data().length == 0) {
            //    c.MessageBoxErr("Empty...", "No Bags Reserved.", null);
            //    return;
            //}
            BindMapListofItem(data.list);
            //$("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            //showindicator.Stop('#gridItemList');
      
            //if (TblGridCrossMatchAvail.rows('.selected').data().length == 0) {
           
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function add_ListofItem(cell) {
    rowIndex = tblItemsList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    //$.each(tblItemsList.rows().data(), function (i, re) {
    //    if (tblItemsList.cell(i, 0).data() == tblItemsMapList.cell(rowIndex, 0).data()) {
    //        $ex = 1;
    //    }
    //});
    if ($ex == 0) {
        tblItemsMapList.row.add({
            SelectedItem: tblItemsList.cell(rowIndex, 0).data(),
            ItemCode: tblItemsList.cell(rowIndex, 1).data(),
            Name: tblItemsList.cell(rowIndex, 2).data(),
            CategoryID: tblItemsList.cell(rowIndex, 3).data(),
            ItemId: tblItemsList.cell(rowIndex, 4).data(),
        }).draw();
        //c.ReSequenceDataTable(tblItemsMapListId, 0);
    }
}

function remove_SelectedListofItem(cell) {
    rowV = $(cell).parents('tr');
    tblItemsList.row(rowV).remove().draw();
    //c.ReSequenceDataTable(tblItemsListId, 0);
}

function add_ListMapItem(cell) {
    rowIndex = tblItemsMapList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    //$.each(tblItemsMapList.rows().data(), function (i, re) {
    //    if (tblItemsMapList.cell(i, 0).data() == tblItemsList.cell(rowIndex, 0).data()) {
    //        $ex = 1;
    //    }
    //});
    if ($ex == 0) {
        tblItemsList.row.add({
            SelectedItem: tblItemsMapList.cell(rowIndex, 0).data(),
            ItemCode: tblItemsMapList.cell(rowIndex, 1).data(),
            Name: tblItemsMapList.cell(rowIndex, 2).data(),
            CategoryID: tblItemsMapList.cell(rowIndex, 3).data(),
            ItemId: tblItemsMapList.cell(rowIndex, 4).data(),
        }).draw();
        //c.ReSequenceDataTable(tblItemsListId, 0);
    }
}

function remove_SelectedMapListofItem(cell) {
    rowV = $(cell).parents('tr');
    tblItemsMapList.row(rowV).remove().draw();
    //c.ReSequenceDataTable(tblItemsListId, 0);

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
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

function Save() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    //Id-MaxIdSql
    entry.Action = 1;
   

    entry.CSTZeroItemDetails = [];
    $.each(tblItemsMapList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.CSTZeroItemDetails.push({
            ItemID: row.ItemId,
            ItemCode: row.ItemCode,
            ItemName: row.Name,
            CategoryId: row.CategoryID
       
            //ParameterId: row.PenaltyName.split(" ")[0],
            ////type: c.MomentYYYYMMDD(row.PenaltyDate),
            //Refund: row.Refund === 'Yes' ? 1 :     0,
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

            c.ButtonDisable('#btnCalculate', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            c.ButtonDisable('#btnCalculate', false);
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
                ShowListItemFetch();
                ShowListItemMapFetch();
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