var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblNoItemsList;
var tblNoItemsListId = '#gridNoItemList'
var tblNoItemsListDataRow;



$(document).ready(function () {
 
    InitDateTimePicker();
    InitButton();
    ShowListDashboard();
 
});

function InitButton() {
   
    $('#btnProcess').click(function () {
        ShowListDashboard();
    });
    $('#btnSave').click(function () {
        Save();
    });
    $(document).on("click", "#iChkAllTest", function () {
        $('#preloader').show();
        if ($('#iChkAllTest').is(':checked')) {
            $.each(tblNoItemsList.rows().data(), function (i, row) {
                tblNoItemsList.cell(i, 0).data('<input id="chkselected" type="checkbox" checked="checked" >');
            });
        }
        else {
            $.each(tblNoItemsList.rows().data(), function (i, row) {
                tblNoItemsList.cell(i, 0).data('<input id="chkselected" type="checkbox">');
            });
        }
        $('#preloader').hide();
    });

 
}



function InitDateTimePicker() {

    $('#dtStart').datetimepicker
    ({
        picktime: false,
      //  format: 'dd-mm-yyyy'
    }).on('dp.change', function (e) {
        //c.SetDateTimePicker('#dtfrom', new Date(year, month, 1));
    });
    $('#dtChange').datetimepicker
    ({
        picktime: false,
     //   format: 'dd-mm-yyyy'
    }).on('dp.change', function (e) {
        //c.SetDateTimePicker('#dtfrom', new Date(year, month, 1));
    });


  
    
}



function Save()
{
    var entry;
    entry = []
    entry = {} 
    entry.Date = c.GetDateTimePicker('#dtChange');
    entry.OpBillList = [];
    var rowcollection = tblNoItemsList.$("#chkselected:checked", { "page": "all" });

    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblNoItemsList.row(tr);
        var rowdata = row.data();
      
        entry.OpBillList.push({
            billno: rowdata.billno,
            opbillid: rowdata.opbillid,
        });
    });
    console.log(entry);

    if (entry.OpBillList == '')
    {
        c.MessageBox("Error...", 'Please select data!!', null);
        return false;
    }
    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
 
        },
        success: function (data) {
 
            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {
                ShowListDashboard();
            };

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
 
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

}
function ShowListDashboard() {
    var Url = $("#url").data("getdashboard");
    var CancelDate = c.GetDateTimePicker('#dtStart');
    var param = {  date: CancelDate };

    $('#preloader').show();
 
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
            console.log(data);
            //if (TblGridCrossMatchAvail.rows('.selected').data().length == 0) {
            //    c.MessageBoxErr("Empty...", "No Bags Reserved.", null);
            //    return;
            //}
            BindListofItem(data);
            //$("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

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
        { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected"/>' },
         { data: "opbillid", className: '', visible: true, searchable: true, width: "2%" },
        {  data: "billno", className: '', visible: true, searchable: true, width: "2%" },
     
 

    ];
    return cols;
}
function ShowListofNoPriceNotDynamicTable(TariffID, ServiceID, Url) {

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
//-------------------List of No Item--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
