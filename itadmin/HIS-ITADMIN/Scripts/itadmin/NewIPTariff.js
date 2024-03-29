var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblNoItemsList;
var tblNoItemsListId = '#gridNoItemList'
var tblNoItemsListDataRow;

var tblItemsWithPriceList;
var tblItemsWithPriceListId = '#gridNoItemListNew'
var tblItemsWithPriceListDataRow;

var OrderId;
var ProcedureId;
var RequestedId;
var IsJeddah = true;

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

    c.DisableSelect2('#select2ITemCode', true);
    //c.DisableSelect2('#Select2RefDoctor', true);
    //c.DisableSelect2('#Select2ProcedureDoneBy', true);

    c.ButtonDisable('#btnPricePercentage', true);
    c.ButtonDisable('#btnMarkup', true);

    $('#select2Tariff').select2('open');


}

function DefaultEmpty() {
    c.SetSelect2('#Select2Department', '0','');
    c.SetSelect2('#select2ITemCode', '0','');
    c.SetSelect2('#Select2Service', '0', '');
    //c.SetSelect2('#select2PatientTypeId', '1', 'In-patient');
}
    
//$(document).on("click", tblNoItemsListId + " td", function (e) {
//    e.preventDefault();

//    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
//        var tr = $(this).closest('tr');

//        //// Multiple selection
//        //tr.toggleClass('selected');

//        // Single selection
//        tr.removeClass('selected');
//        $('tr.selected').removeClass('selected');
//        tr.addClass('selected')

//        tblNoItemsListDataRow = tblItemsWithPriceList.row($(this).parents('tr')).data();

//        add_ListofItem(this);
//        remove_SelectedListofItem(this);
//    }
//});

$(document).on("dblclick", tblItemsWithPriceListId + " td", function (e) {
    e.preventDefault();

    //if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
    //    var tr = $(this).closest('tr');

    //    //// Multiple selection
    //    tr.toggleClass('selected');

    //    // Single selection
    //    //tr.removeClass('selected');
    //    //$('tr.selected').removeClass('selected');
    //    //tr.addClass('selected')

    //    tblItemsWithPriceListDataRow = tblItemsWithPriceList.row($(this).parents('tr')).data();

    //    add_ListWithItem(this);
    //    remove_SelectedWithListofItem(this);
    //}
});

$(document).on("click", "#iChkAll", function () {
    if ($('#iChkAll').is(':checked')) {
        $.each(tblItemsWithPriceList.rows().data(), function (i, row) {
            tblItemsWithPriceList.cell(i, 0).data('<input id="chkselected" type="checkbox" checked="checked" >');
        });
    }
    else {
        $.each(tblItemsWithPriceList.rows().data(), function (i, row) {
            tblItemsWithPriceList.cell(i, 0).data('<input id="chkselected" type="checkbox">');
        });
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
        c.DisableSelect2('#Select2Service', false);
        c.SetSelect2('#select2ITemCode', '0', '');
       
        InitDataTables();
        c.SetSelect2('#Select2Service', '', '');
        $('#Select2Service').select2('open');
    });


    $('#select2ITemCode').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("selectfinditemcode"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                ///   GetSelect2Id('#Select2Service')
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    ServiceID: c.GetSelect2Id('#Select2Service'),
                    SearchByCode: 1,
                    SearchText: 1
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added;
        var TariffID = c.GetSelect2Id('#select2Tariff');
        var ServiceID = c.GetSelect2Id('#Select2Service');
        var ItemId = c.GetSelect2Id('#select2ITemCode');
        //c.DisableSelect2('#Select2Department', false);
        ShowListofNoPriceFetch(TariffID, ServiceID, ItemId);
        ShowListwithPriceFetch();
      //  c.DisableSelect2('#Select2Service', false);
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
       
    });

  
 
    
    ajaxWrapper.Get($("#url").data("getserviceslistwithdynamictable"), null, function (xx, e) {
        Sel2Client($("#Select2Service"), xx, function (x) {
            console.log(x);
            if (x.column1 == 1) //dynamic table
            {
                        var list = e.added;
                        c.DisableSelect2('#Select2Department', false);
                        c.DisableSelect2('#select2ITemCode', false);
                        InitDataTables();
                        c.SetSelect2('#select2ITemCode', '0', '');

                        c.ButtonDisable('#btnPricePercentage', false);
                        c.ButtonDisable('#btnMarkup', false);

            }
            else //not dynamic room and board , nurse etc...
            {

                
                        var TariffID = c.GetSelect2Id('#select2Tariff');
                       
                        var Url = $("#url").data("geitempricenotdynamictable");
                        c.DisableSelect2('#select2ITemCode', true);
                        c.SetSelect2('#select2ITemCode', '0', '');
                         ShowListofNoPriceNotDynamicTable(TariffID, x.id, Url);
                         ShowListwithPriceFetch();

                        c.ButtonDisable('#btnPricePercentage', true);
                        c.ButtonDisable('#btnMarkup', true);


            }
 
        })
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
        empty = c.IsEmptySelect2('#select2ITemCode');
        if (empty == true) {

            c.MessageBoxErr('Empty...', 'Please select Item');
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
        columns: ShowListNoitemsColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowListNoitemsColumns() {
    var cols = [
    //{ targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "0%" },
      { targets: [0], data: "BedTypeId", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [0], data: "name", className: '', visible: true, searchable: true, width: "50%" },
      { targets: [1], data: "Price", className: '', visible: true, searchable: true, width: "10%" },
      { targets: [2], data: "StartDateTime", className: '', visible: true, searchable: true, width: "30%" },
      { targets: [3], data: "BedTypeId", className: '', visible: false, searchable: true, width: "0%" },
      { targets: [4], data: "ItemId", className: '', visible: false, searchable: true, width: "0%" }

    ];
    return cols;
}

function ShowListofNoPriceFetch(TariffID, ServiceID,ItemId) {
    var Url = $("#url").data("geitemprice");
    var param = {
        TariffID: TariffID,
        ServiceID: ServiceID,
        ItemId: ItemId
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


function ShowListofNoPriceNotDynamicTable(TariffID, ServiceID,Url) {
  
    var param = {
        TariffID: TariffID,
        ServiceID: ServiceID
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

//-------------------List of Item with New Price--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindWithPriceListofItem(data) {

    tblItemsWithPriceList = $(tblItemsWithPriceListId).DataTable({
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
        columns: ShowListwithPriceitemsColumns(),
        fnRowCallback: ShowWithPriceRowCallBack()
    });

    InitSelectedPrice();
}

function ShowWithPriceRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['selected'];
        var $nRow = $(nRow);

        if (value == 1) {
            $('#chkselected', nRow).prop('checked', aData.selected === 1);
            //if (value.selected == 1) {
            //  //  $('#chkselected', nrow).prop("disabled", "disabled");
            //}
        }
 
       // $('td:eq(2)',nRow).html('<b>2</b>');
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
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected"/>' },
      { targets: [0], data: "BedTypeId", className: '', visible: true, searchable: false, width: "1%" },
      { targets: [1], data: "name", className: '', visible: true, searchable: true, width: "0%" },
      { targets: [2], data: "Price", className: 'ClassPrice classSelectPrice', visible: true, searchable: true, width: "0%" },
      { targets: [3], data: "startdatetime", className: 'ClassToDate', visible: true, searchable: true, width: "0%" },
      { targets: [4], data: "BedTypeId", className: '', visible: false, searchable: true, width: "0%" }

    ];
    return cols;
}

function ShowListwithPriceFetch() {
    // var Url = $("#url").data("getnewprice");
    console.log('ShowListwithPriceFetch()');
    var Url = $("#url").data("getnewpricewitheffectivedate");
    var TariffID = c.GetSelect2Id('#select2Tariff');
    var ServiceID = c.GetSelect2Id('#Select2Service');
    var ItemId = c.GetSelect2Id('#select2ITemCode');
    var param = {
        TariffID: TariffID,
        ServiceID: ServiceID,
        ItemId: ItemId
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
 
    $.editable.addInputType('datepickerCurrentDate', {
        element: function (settings, original) {
            var input = $('<input id="txtCurrentDate" style="width:100%; height:30px;" type="text" class="form-control" >');
            //var input = $('<input id="txtCurrentDate" style="width:100%; height:30px;" type="text" class="form-control" value="' + defaultStartDate + '" >');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var dateToday = new Date();
            $(this).find('#txtCurrentDate').datepicker({ autoclose: true, todayHighlight: true, startDate: dateToday });
 
        }
    });

}

function getFormattedDate(date)
{
    var day = date.getDate();
    var month = date.getMonth() + 1;
    var year = date.getFullYear().toString().slice(2);
    return month + '-' + day + '-' + year;
}
$(function(){
 
    console.log('BranchCODE -> ' +$('#url').data('branchname'));
    if ($('#url').data('branchname') != 'SA01')
    {
        //$('#DivMarkUP').hide();
        IsJeddah = false;
    }
    
    
    
});

function BtnChangePriceviaPercentage()
{
    var costprice = $('#selectPercentage').val();
    console.log('costprice' + costprice);
     $.each(tblNoItemsList.rows().data(), function (i, re) {
         var PresentBedID = tblNoItemsList.cell(i, 0).data();
         var PresentPrice = tblNoItemsList.cell(i, 2).data();
         var rowcollection = tblItemsWithPriceList.$("#chkselected:checked", { "page": "all" });

         rowcollection.each(function (index, elem) {
             var tr = $(elem).closest('tr');
             var row = tblItemsWithPriceList.row(tr);
             var rowdata = row.data();
           
             if (PresentBedID == rowdata.BedTypeId)
             {
                 var CalculatedPrice = 0;
                 var FINALCalculatedPrice = 0;
                 var MarkUpPerBed = 0;
                 var NewTableBedID = rowdata.BedTypeId;
               
                 //calculate the price
                 $("input.CLMarkup").each(function () {

                     var MarkUPBedTypeID = $(this).data("bedtypeid");
                     if (MarkUPBedTypeID == NewTableBedID)
                     {
                         MarkUpPerBed =  $(this).val();
                         return false;
                     }
                 });
                 CalculatedPrice = parseInt(MarkUpPerBed * costprice) + parseInt(costprice);
                 //set the price
                 if (IsJeddah == true)//JEDDAH ONLY
                 {
                     //set PRICE for FIRST CLASS
                     if (NewTableBedID == 1) {
                         FINALCalculatedPrice = Math.ceil(parseInt(CalculatedPrice - 10) / 10) * 10;
                     }
                     else {
                         FINALCalculatedPrice = Math.ceil(parseInt(CalculatedPrice) / 10) * 10;
                     }
                 } else {
                     FINALCalculatedPrice = Math.ceil(parseInt(CalculatedPrice) / 10) * 10;
                 }

                 rowdata.Price = FINALCalculatedPrice.toFixed(2);
                 $('#gridNoItemListNew tbody tr').each(function () {
                     var tr = $(this).closest('tr');
                     var NewBedID = $(this).find('td:eq(1)').text();
                     var NewPrice = $(this).find('td:eq(3)');
                     if (NewTableBedID == NewBedID)
                     {
                         NewPrice.html(FINALCalculatedPrice.toFixed(2));
                         return false;
                     }
                 });
                 return false;
             }

         });
     });

    // $("#modal-feat").modal({ keyboard: true });
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

    $('.ClassToDate', tblItemsWithPriceList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsWithPriceList.cell($(this).closest('td')).index();
        tblItemsWithPriceList.cell(cell.row, 4).data(sVal);
        /*to Get ID*/
        //   var id = c.GetSelect2Id('#select2Relationship');
        //   tblFamilyDetails.cell(cell.row, 0).data(id);
        //tblPreviousExpDetails.cell(cell.row, cell.column).data(sVal);
        //sVal = defaultStartDate;
        return sVal;
    },
        {
            "type": 'datepickerCurrentDate', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
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
    entry.Action = Action;
    entry.TariffId = c.GetSelect2Id('#select2Tariff');
    entry.ServiceId = c.GetSelect2Id('#Select2Service');
    entry.ItemId = c.GetSelect2Id('#select2ITemCode');

    entry.IPTariffDetailsSave = [];
    var rowcollection = tblItemsWithPriceList.$("#chkselected:checked", { "page": "all" });
    var error = 0;
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsWithPriceList.row(tr);
        var rowdata = row.data();

        if (rowdata.Price == '' || rowdata.Price == 0)
        {
            c.MessageBoxErr("Error...", "0 price is not a valid price.");
            error = 1;
            return false;
        }

        if (rowdata.startdatetime == '' || rowdata.startdatetime == 0 || rowdata.BedTypeId == '' || rowdata.BedTypeId == 0) {
            c.MessageBoxErr("Error...", "Please check your update selection.");
            error = 1;
            return false;
        }
     
        entry.IPTariffDetailsSave.push({
            BedTypeId: rowdata.BedTypeId,
            Price: rowdata.Price,
            StartDate: rowdata.startdatetime//data_date
        });
    });
 
    if (JSON.stringify(entry.IPTariffDetailsSave) === '[]') {
        c.MessageBoxErr("Error...", "Please check your update selection."); 
        error = 1;
        return false;
    }

    if (error == 0)
    {

        $('#preloader').show();
        $('#btnSave').hide();

                    $.ajax({
                        url: $('#url').data("save"),
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
                            $('#btnSave').show();
                            $('#preloader').hide();
                            if (data.ErrorCode == 0) {
                                c.MessageBoxErr("Error...", data.Message);
                                return;
                            }

                            var OkFunc = function () {

                                if (Action == 3) {
      
                                }
                                InitDataTables();
                                DefaultEmpty();
                                Action = 0;
      
                            };

                            c.MessageBox(data.Title, data.Message, OkFunc);
                        },
                        error: function (xhr, desc, err) {
                            c.ButtonDisable('#btnSave', false);
                            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                            c.MessageBox("Error...", errMsg, null);
                        }
                     });
    }

    return ret;
}

function ShowModalMarkup() {
    $("#modal-feat").attr
    $("#modal-feat").modal({ keyboard: true });
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
        ItemId: c.GetSelect2Id('#select2ITemCode'),
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
        ItemId: c.GetSelect2Id('#select2ITemCode'),
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