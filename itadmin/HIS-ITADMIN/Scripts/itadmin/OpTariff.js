var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblNoItemsList;
var tblNoItemsListId = '#gridNoItemList'
var tblNoItemsListDataRow;

var tblItemsWithPriceList;
var tblItemsWithPriceListId = '#gridListWithPrice'
var tblItemsWithPriceListDataRow;

var OrderId;
var ProcedureId;
var RequestedId;


$(document).ready(function () {
    // SetupDataTables();
    SetupSelectedPrice();
    InitButton();
    //InitDateTimePicker();
    InitSelect2();
    DefaultDisable();
    InitDataTables();

});

function DefaultDisable() {
    // Sample usage
    c.DisableSelect2('#Select2Department', true);
    c.DisableSelect2('#Select2Service', true);
    //c.DisableSelect2('#Select2RefDoctor', true);
    //c.DisableSelect2('#Select2ProcedureDoneBy', true);




}
    
$(document).on("click", tblNoItemsListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        //tr.toggleClass('selected');

        // Single selection
        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected')

      //  tblNoItemsListDataRow = tblItemsWithPriceList.row($(this).parents('tr')).data();

        add_ListofItem(this);
        remove_SelectedListofItem(this);
    }
});

$(document).on("dblclick", tblItemsWithPriceListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        tr.toggleClass('selected');

        // Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')

        //tblItemsWithPriceListDataRow = tblItemsWithPriceList.row($(this).parents('tr')).data();

        add_ListWithItem(this);
        remove_SelectedWithListofItem(this);
    }
});

function InitDataTables() {
    //BindSequence([]);
    BindListofItem([]);
    BindWithPriceListofItem([]);
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
        c.SetSelect2('#Select2Department', '0', '');
        c.SetSelect2('#Select2Service', '0', '');
        InitDataTables();
        c.DisableSelect2('#Select2Service', false);
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
        $('#preloader').show();
        var list = e.added;
        c.DisableSelect2('#Select2Department', false);
        c.SetSelect2('#Select2Department', '0', '');
        InitDataTables();

        console.log(list.id);
        //if (list.id == 14) //fooditem
        //{
            c.SetSelect2('#Select2Department', '0', '--ALL--');
            var TableExists = 0;
            var TariffID = c.GetSelect2Id('#select2Tariff');
            var ServiceID = c.GetSelect2Id('#Select2Service');
            var DepartmentID = c.GetSelect2Id('#Select2Department');
            console.log(DepartmentID);
            ShowListofNoPriceFetch(TariffID, ServiceID, DepartmentID, TableExists);
            ShowListwithPriceFetch(TariffID, ServiceID, DepartmentID, TableExists);
       // }
        $('#preloader').hide();
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
        console.log(DepartmentID);
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
        Process();
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

    $("#btnPrint").on("click", function () {
        var empty = false
        empty = c.IsEmptySelect2('#Select2Department');
        if (empty == true) {

            c.MessageBoxErr('Empty...', 'Please select Department');
        } else {
            ToPDF();

        }
    });

    $("#ExportToXLS").on("click", function () {
        ToXLS();
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

//-------------------List of No Item--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindListofItem(data) {

    tblNoItemsList = $(tblNoItemsListId).DataTable({
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
        columns: ShowListNoitemsColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowListNoitemsColumns() {
    var cols = [
    //{ targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "0%" },
      { targets: [0], data: "Id", className: '', visible: false, searchable: true, width: "0%" },
      { targets: [1], data: "Name", className: '', visible: true, searchable: true, width: "0%" },
      { targets: [2], data: "Code", className: '', visible: false, searchable: true, width: "0%" },
      { targets: [3], data: "Price", className: '', visible: false, searchable: true, width: "0%" },
      { targets: [4], data: "ctr", className: '', visible: false },
      { targets: [5], data: "RefPrice", className: '', visible: false },
    ];
    return cols;
}

function ShowListofNoPriceFetch(TariffID, ServiceID, DepartmentID, TableExists) {
    var Url = $("#url").data("getlistnoprice");
    var param = {
        TariffID: TariffID,
        ServiceID: ServiceID,
        DepartmentID: DepartmentID,
        TableExists: TableExists
    };

    $('#preloader').show();
    //$("#grid").css("visibility", "hidden");
    console.log(param);
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

//-------------------List of Item with Price--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindWithPriceListofItem(data) {
    console.log('BindWithPriceListofItemasdasdasd');
    console.log(data);
    if (data == "")
    {
         data = [{ Id: 0, Name: " ", Code: " ", Price: "0", ctr: "0", RefPrice: "0" }];
    }
    console.log(data);
    tblItemsWithPriceList = $(tblItemsWithPriceListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowListwithPriceitemsColumns()
        //fnRowCallback: ShowWithPriceRowCallBack()
    });

    InitSelectedPrice();
}

function ShowWithPriceRowCallBack() {
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

function ShowListwithPriceitemsColumns() {
    var cols = [
    //{ targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "0%" },
      { targets: [0], data: "Id", className: '', visible: false, searchable: true, width: "0%" },
      { targets: [1], data: "Name", className: '', visible: true, searchable: true, width: "30%" },
      { targets: [2], data: "Code", className: '', visible: true, searchable: true, width: "15%" },
      { targets: [3], data: "Price", className: 'ClassPrice', visible: true, searchable: true, width: "10%" },
      { targets: [4], data: "ctr", className: '', visible: false},
      { targets: [5], data: "RefPrice", className: 'ClassRefPrice', visible: true, searchable: true, width: "5%" },

    ];
    return cols;
}

function ShowListwithPriceFetch(TariffID, ServiceID, DepartmentID, TableExists) {
    var Url = $("#url").data("getlistwithprice");
    var param = {
        TariffID: TariffID,
        ServiceID: ServiceID,
        DepartmentID: DepartmentID,
        TableExists: TableExists
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


    $.editable.addInputType('txtRefPrice', {
        element: function (settings, original) {

            var input = $('<input id="txtRefPrice" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
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

        tblItemsWithPriceList.cell(cell.row, 4).data('1');
        return sVal;
    },
    {
        "type": 'txtPrice', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // Resize all rows.
    $(tblItemsWithPriceListId + ' tr').addClass('trclass');



    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassRefPrice', tblItemsWithPriceList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsWithPriceList.cell($(this).closest('td')).index();
        tblItemsWithPriceList.cell(cell.row, 5).data(sVal);

        //tblItemsWithPriceList.cell(cell.row, 4).data('1');
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
    rowIndex = tblNoItemsList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    $.each(tblNoItemsList.rows().data(), function (i, re) {
        if (tblNoItemsList.cell(i, 0).data() == tblItemsWithPriceList.cell(rowIndex, 0).data()) {
            $ex = 1;
        }
    });
    if ($ex == 0) {
        tblItemsWithPriceList.row.add({
            Id: tblNoItemsList.cell(rowIndex, 0).data(),
            Name: tblNoItemsList.cell(rowIndex, 1).data(),
            Code: tblNoItemsList.cell(rowIndex, 2).data(),
            Price: tblNoItemsList.cell(rowIndex, 3).data(),
            ctr: 1,
            RefPrice: tblNoItemsList.cell(rowIndex, 5).data(),
        }).draw();
        InitSelectedPrice();
    }
}

function remove_SelectedListofItem(cell) {
    rowV = $(cell).parents('tr');
    tblNoItemsList.row(rowV).remove().draw();

}

function add_ListWithItem(cell) {
    rowIndex = tblItemsWithPriceList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    $.each(tblItemsWithPriceList.rows().data(), function (i, re) {
        if (tblItemsWithPriceList.cell(i, 0).data() == tblNoItemsList.cell(rowIndex, 0).data()) {
            $ex = 1;
        }
    });
    if ($ex == 0) {
        tblNoItemsList.row.add({
            Id: tblItemsWithPriceList.cell(rowIndex, 0).data(),
            Name: tblItemsWithPriceList.cell(rowIndex, 1).data(),
            Code: tblItemsWithPriceList.cell(rowIndex, 2).data(),
            Price: tblItemsWithPriceList.cell(rowIndex, 3).data(),
            ctr: 0,
            RefPrice: tblItemsWithPriceList.cell(rowIndex, 5).data(),
        }).draw();
    }
}

function remove_SelectedWithListofItem(cell) {
    rowV = $(cell).parents('tr');
    tblItemsWithPriceList.row(rowV).remove().draw();

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

function Save() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = 1;
    entry.Deleted = 0;
    entry.TariffID  = c.GetSelect2Id('#select2Tariff');
    entry.ServiceID = c.GetSelect2Id('#Select2Service');
    entry.OPTariffDetailsNotSelectedItem = [];
    entry.OPTariffDetails = [];
    entry.OPTariffDetailsTest = []
    $.each(tblItemsWithPriceList.rows().data(), function (i, row) {
        if (row.ctr == 1) {

            entry.OPTariffDetailsTest.push({
                Id: row.Id,
                Price: row.Price,
                RefPrice: row.RefPrice
            });
          

        }
        //if (storeOrderId.length == 0) storeOrderId = row.OrderId;

        //ParameterId: row.PenaltyName.split(" ")[0],
        ////type: c.MomentYYYYMMDD(row.PenaltyDate),
        //Refund: row.Refund === 'Yes' ? 1 : 0,
        //testAppId: false,
        //RefundDate: row.RefundDate.replace(" ", "-").replace(" ", "-")

    });
 

    $.each(tblNoItemsList.rows().data(), function (ii, RowW) {
       
        entry.OPTariffDetailsNotSelectedItem.push({
            Id: RowW.Id,
            Price: RowW.Price,
            RefPrice: RowW.RefPrice
        });
    });

 

    console.log('entry');
    console.log(entry);
 
    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            
            $('#preloader').show();
            c.ButtonDisable('#btnSave', true);
            c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
             
            $('#preloader').hide();
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
           //     HandleEnableEntries();
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

///-------------
function setCookie(name, value, days) {
    var expires;

    if (days) {
        var date = new Date();
        date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
        expires = "; expires=" + date.toGMTString();
    } else {
        expires = "";
    }
    //document.cookie = encodeURIComponent(name) + "=" + encodeURIComponent(value) + expires + "; path=/";
    document.cookie = name + "=" + value + expires + "; path=/";
}


function ToPDF() {
    //if (debug) debugger;

    $('#PDFMaximize').show();
    $('.loadingpdf').show();

    var filter = [{
        Id: 0,
    }];
    var filterfy = JSON.stringify(filter);
    setCookie('Filterfy', filterfy, 365);


    var url = $("#url").data("pdf") + "?page=1#zoom=100";
    var content = '<iframe id="MyIFRAME" src="' + url + '" width="100%"  height="100%" frameborder="0" class="rpt-viewer-frame"></iframe>';

    //$('#rptMaximize').empty();
    //$('#rptMaximize').append(content);

    $('#PreviewInPDF').empty();
    $('#PreviewInPDF').append(content);

    $('#MyIFRAME').unbind('load');
    $('#MyIFRAME').load(function () {
        $('.loadingpdf').hide();
    });

}
function ToXLS() {
    $('#PDFMaximize').show();
    $('.loadingpdf').show();

    var filter = [{
        ItemId: 0,
    }];
    var filterfy = JSON.stringify(filter);
    setCookie('Filterfy', filterfy, 365);

    var url = $("#url").data("xls") + "?page=1#zoom=100";
    var content = '<iframe id="MyIFRAME" src="' + url + '" width="100%"  height="100%" frameborder="0" class="rpt-viewer-frame"></iframe>';

    //$('#rptMaximize').empty();
    //$('#rptMaximize').append(content);

    $('#PreviewInPDF').empty();
    $('#PreviewInPDF').append(content);

    $('#PDFMaximize').hide();
    $('#MyIFRAME').unbind('load');
    $('#MyIFRAME').load(function () {
        $('.loadingpdf').hide();
        $('#PDFMaximize').hide();
    });


}