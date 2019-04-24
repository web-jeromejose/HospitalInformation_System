var c = new Common();
var Action = -1;
var StationID = 0;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridlistcashdiscount'
var tblItemsListDataRow;


$(document).ready(function () {
    InitButton();
    InitSelect2();
    InitDataTables();

});

$(document).on("click", "#iChkAllTest", function () {
    if ($('#iChkAllTest').is(':checked')) {
        $.each(tblItemsList.rows().data(), function (i, row) {
            tblItemsList.cell(i, 0).data('<input id="chkselected" type="checkbox" checked="checked" >');
        });
    }
    else {
        $.each(tblItemsList.rows().data(), function (i, row) {
            tblItemsList.cell(i, 0).data('<input id="chkselected" type="checkbox">');
        });
    }
});

function InitDataTables() {
    //BindSequence([]);
    //BindListofItem([]);
    BindListofItem([]);
}

//-------------------List of Item with Price--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
        columns: ShowListitemsColumns(),
        fnRowCallback: ShowRowCallBack()
    });

  
}

function ShowRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData.chkbox;
        var $nRow = $(nRow);
        console.log(aData.chkbox);
        if (aData.chkbox != 0) {
            $('#chkselected', nRow).prop('checked', true);
            //$nRow.css({ "background-color": "#d7ffea" })

        }
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

function ShowListitemsColumns() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected"/>' },
      { targets: [1], data: "ID", className: '', visible: true, searchable: true, width: "10%" },
      { targets: [2], data: "Name", className: '', visible: true, searchable: true, width: "60%" },
      { targets: [3], data: "ID", className: '', visible: false },
      { targets: [4], data: "chkbox", className: '', visible: false }

    ];
    return cols;
}

function ShowListFetch(stationid) {
    var Url = $("#url").data("fetchmmsreportmapping");
    var param = {
        stationid: stationid
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
            //    c.MessageBoxErr("Empty...", "No Data.", null);
            //    return;
            //}
            console.log(data.list);
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

 
 

























//---------------------------------------------------------------------------------------------------------------------------------------------------------------------

function InitSelect2() {
 

    Sel2Server($("#select2From"), $("#url").data("getstation"), function (d) {
        StationID = d.id;
        ShowListFetch(d.id);
        c.ButtonDisable('#btnSave', false);
    });

}

function InitButton() {

    c.ButtonDisable('#btnSave', true);
   
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
 

 
}

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
    //entry.Action = Action;
    //entry.DiscountType = c.GetSelect2Id('#select2ListService');
    //entry.CategoryId = c.GetSelect2Id('#select2Category');
    //entry.CompanyId = c.GetSelect2Id('#select2Company');
    //entry.DiscountId = c.GetSelect2Id('#select2Discountypes');
    entry.StationID = StationID;
    entry.MmsReportMappingSaveDetails = [];

    var rowcollection = tblItemsList.$("#chkselected:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsList.row(tr);
        var rowdata = row.data();
      
        entry.MmsReportMappingSaveDetails.push({
            ReportID: rowdata.ID 
        });

    });

   
    if (entry.MmsReportMappingSaveDetails.length === 0)
    {
        entry.MmsReportMappingSaveDetails.push({
            ReportID: 0
        });
    }
    console.log(entry);

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

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                if (Action == 3) {
                }
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

    return ret;
}
 