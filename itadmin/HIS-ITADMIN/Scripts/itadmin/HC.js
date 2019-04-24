var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridItemList'
var tblItemsListDataRow;

var tblItemsMapList;
var tblItemsMapListId = '#gridItemCodeMap'
var tblItemsMapListDataRow;


$(document).ready(function () {
    // SetupDataTables();
    //SetupSelectedPrice();
    InitButton();
    ShowListItemFetch();
    //InitDateTimePicker();
    InitSelect2();

    InitDataTables();

});

$(document).on("click", tblItemsListId + " td", function (e) {
    e.preventDefault();

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
    e.preventDefault();

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
        columns: ShowListitemsColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowListitemsColumns() {
    var cols = [
      //{ targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselectedtest" id="chkselectedtest"/>' },
      { targets: [1], data: "SNo", className: '', visible: true, searchable: true, width: "1%" },
      { targets: [2], data: "Test", className: '', visible: true, searchable: true, width: "20%" },
      { targets: [3], data: "CostPrice", className: '', visible: true, searchable: true, width: "10%" },
      { targets: [4], data: "Id", className: '', visible: false, searchable: true, width: "0%" },
      { targets: [5], data: "NewCode", className: '', visible: false, searchable: true, width: "0%" },
      { targets: [6], data: "Name", className: '', visible: false, searchable: true, width: "0%" },
      { targets: [7], data: "Code", className: '', visible: false, searchable: false }

    ];
    return cols;
}

function ShowListItemFetch() {
    var Url = $("#url").data("getlistitem");
    var param = {

    };

    $('#preloader').show();
    //$("#grid").css("visibility", "hidden");

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
            $('#preloader').hide();
            //if (TblGridCrossMatchAvail.rows('.selected').data().length == 0) {
            //    c.MessageBoxErr("Empty...", "No Bags Reserved.", null);
            //    return;
            //}
            BindListofItem(data.list);
            //$("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
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
      { targets: [0], data: "SNo", className: '', visible: true, searchable: true, width: "1%" },
      { targets: [1], data: "Test", className: '', visible: false, searchable: false },
      { targets: [2], data: "CostPrice", className: '', visible: true, searchable: false, width: "1%" },
      { targets: [3], data: "Id", className: '', visible: false, searchable: false },
      { targets: [4], data: "NewCode", className: '', visible: true, searchable: true, width: "15%" },
      { targets: [5], data: "Name", className: '', visible: true, searchable: true, width: "15%" },
      { targets: [6], data: "Code", className: '', visible: false, searchable: false }


    ];
    return cols;
}

function ShowListItemMapFetch() {
    var Url = $("#url").data("getlistitem");
    var param = {

    };

    $('#preloader').show();
    //$("#grid").css("visibility", "hidden");

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
            $('#preloader').hide();
            //if (TblGridCrossMatchAvail.rows('.selected').data().length == 0) {
            //    c.MessageBoxErr("Empty...", "No Bags Reserved.", null);
            //    return;
            //}
            BindWithPriceListofItem(data.list);
            //$("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

function SetupSelectedPrice() {

    $.editable.addInputType('txtPrice', {
        element: function (settings, original) {

            var input = $('<input id="txtPrice" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

}

function InitSelectedPrice() {

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassPrice', tblItemsWithPriceList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsWithPriceList.cell($(this).closest('td')).index();
        tblItemsWithPriceList.cell(cell.row, 3).data(sVal);


        return sVal;
    },
    {
        "type": 'txtPrice', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // Resize all rows.
    $(tblItemsWithPriceListId + ' tr').addClass('trclass');

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
            SNo: tblItemsList.cell(rowIndex, 0).data(),
            Test: tblItemsList.cell(rowIndex, 1).data(),
            CostPrice: tblItemsList.cell(rowIndex, 2).data(),
            Id: tblItemsList.cell(rowIndex, 3).data(),
            NewCode: tblItemsList.cell(rowIndex, 4).data(),
            Name: tblItemsList.cell(rowIndex, 5).data(),
            Code: tblItemsList.cell(rowIndex, 6).data(),

        }).draw();
        c.ReSequenceDataTable(tblItemsMapListId, 0);
    }
}

function remove_SelectedListofItem(cell) {
    rowV = $(cell).parents('tr');
    //tblItemsList.row(rowV).remove().draw();
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
            SNo: tblItemsMapList.cell(rowIndex, 0).data(),
            Test: tblItemsMapList.cell(rowIndex, 1).data(),
            CostPrice: tblItemsMapList.cell(rowIndex, 2).data(),
            Id: tblItemsMapList.cell(rowIndex, 3).data(),
            NewCode: tblItemsMapList.cell(rowIndex, 4).data(),
            Name: tblItemsMapList.cell(rowIndex, 5).data(),
            Code: tblItemsMapList.cell(rowIndex, 6).data(),
        }).draw();
        c.ReSequenceDataTable(tblItemsListId, 0);
    }
}

function remove_SelectedMapListofItem(cell) {
    rowV = $(cell).parents('tr');
    tblItemsMapList.row(rowV).remove().draw();
    //c.ReSequenceDataTable(tblItemsListId, 0);

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Validated() {

    var ret = false;

    //ret = c.IsEmpty('#txtHomeAdress');

    //if (ret) {
    //    c.MessageBoxErr('Y/N...', 'Please input Y for YES and N for NO');
    //    return false;
    //}







    return true;

}

function Process() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = 1;

    entry.ItemListMapProcess = [];
    $.each(tblItemsMapList.rows().data(), function (i, row) {
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;
        entry.ItemListMapProcess.push({
            SNo: row.SNo,
            Test: row.Test,
            CostPrice: row.CostPrice,
            Id: row.Id,
            NewCode: row.NewCode,
            Name: row.Name,
            Code: row.Code

            //ParameterId: row.PenaltyName.split(" ")[0],
            ////type: c.MomentYYYYMMDD(row.PenaltyDate),
            //Refund: row.Refund === 'Yes' ? 1 : 0,
            //testAppId: false,
            //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")
        });
    });
    $.ajax({
        url: $('#url').data("process"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            c.ButtonDisable('#btnSave', true);
            c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            c.ButtonDisable('#btnModify', false);
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