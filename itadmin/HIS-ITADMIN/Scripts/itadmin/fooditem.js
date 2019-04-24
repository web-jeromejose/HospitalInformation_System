var c = new Common();
var Action = -1;

var tblFoodItemList;
var tblFoodItemListId = '#gridFoodItemList'
var tblFoodItemListDataRow;

var tblFoodCategoryList;
var tblFoodCategoryListId = '#gridFoodCategoryList'
 



$(document).ready(function () {
    // SetupDataTables();
    //   SetupSelectedPrice();
    //SetupSelectedRange();
    //InitButton();
    ////InitDateTimePicker();
     InitSelect2();
    //DefaultValues();
     InitDataTables();
     InitClickDataTables();
});

function InitDataTables() {
 
    ShowDTFoodItem();
    ShowDTFoodCategory();
    
}

function NewEntry()
{
    $('#modalEntry').modal('show');
}
function NewCategory() {
    $('#modal-FoodCatNew').modal('show');
}

function InitSelect2() {

    ajaxWrapper.Get($("#url").data("getfoodcategory"), null, function (xx, e) {
        Sel2Client($("#select2Category"), xx, function (x) {
            console.log(x);
        })

        Sel2Client($("#select2CategoryView"), xx, function (x) {
            console.log(x);
        })

    });
}
function InitClickDataTables() {

    $(document).on("click", "#gridFoodItemList td", function () {
        var d = tblFoodItemList.row($(this).parents('tr')).data();
        console.log(d);
        $("#modal-FoodItemView").modal({ "keyboard": true });
        //$('#select2CategoryView').val(d.categoryname);
        $('#txtFnBItemView').val(d.name);
        $('#txtCodeView').val(d.code);
        $('#txtDateTimeView').val(d.StartDateTime);
        $('#hiddenFoodItemId').val(d.id);
        
        c.SetSelect2('#select2CategoryView', d.CategoryID, d.categoryname);
        
    });

    $(document).on("click", "#gridFoodCategoryList td", function () {
        var d = tblFoodCategoryList.row($(this).parents('tr')).data();
        console.log(d);
        //$("#modal-FoodItemView").modal({ "keyboard": true });
        ////$('#select2CategoryView').val(d.categoryname);
        //$('#txtFnBItemView').val(d.name);
        //$('#txtCodeView').val(d.code);
        //$('#txtDateTimeView').val(d.StartDateTime);
        //$('#hiddenFoodItemId').val(d.id);

        //c.SetSelect2('#select2CategoryView', d.CategoryID, d.categoryname);

    });

    $('#btnReportGen').click(function () {
        ToPDF();
    });

    $('#btnSave').click(function () {
        var entry = {};
        entry.categoryid = $('#select2Category').val();
        entry.name = $('#txtFnBItem').val();
        entry.code = $('#txtCode').val();
        entry.action = 1;

        if (entry.categoryid == '' || entry.name == '' || entry.code == '') {
            c.MessageBoxErr('Error.....', 'Please input all the fields. ');
            return false;
        }
       
        SaveFoodItem(entry);
    });

    $('#btnDeleteView').click(function () {
        var entry = {};
        entry.categoryid = $('#select2CategoryView').val();
        entry.name = $('#txtFnBItemView').val();
        entry.code = $('#txtCodeView').val();
        entry.id = $('#hiddenFoodItemId').val();
        entry.action = 3;

        var YesFunc = function () {
          
            SaveFoodItem(entry);
        };

        c.MessageBoxConfirm("Remove...", "Are you sure you want to remove this item " + entry.code +  " - " + entry.name + "?", YesFunc, null);
    });

    $('#btnModifyView').click(function () {
        var entry = {};
        entry.categoryid = $('#select2CategoryView').val();
        entry.name = $('#txtFnBItemView').val();
        entry.code = $('#txtCodeView').val();
        entry.id = $('#hiddenFoodItemId').val();
        entry.action = 2;
        

        if (entry.categoryid == '') {
            c.MessageBoxErr('Error...', 'Please select a Category');
            return false;
        }
        SaveFoodItem(entry);

    });
    //------------------CATEGORY 
    $('#btnFoodCatNew').click(function () {
        var entry = {};
        entry.name = $('#txtFoodCatNewName').val();
        entry.action = 1;
        console.log(entry);

        if (entry.name.trim() == '') {
            c.MessageBoxErr('Error!', 'Please input a category name');
            return false;
        }

        SaveFoodCategory(entry);
    });
}

function SaveFoodItem(entry)
{

    $.ajax({
        url: $('#url').data("savefooditem"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
 
        },
        success: function (data) {
 
            console.log(data);
            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                InitDataTables();
                 
            };

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
          
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

}
function SaveFoodCategory(entry) {

    $.ajax({
        url: $('#url').data("savefoodcategory"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

        },
        success: function (data) {

            console.log(data);
            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                InitDataTables();

            };

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {

            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

}

 
function ShowDTFoodCategory()
{

    var Url = $('#url').data("getfoodcategory");

    var param = {

    };

    $('#preloader').show();
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
            console.log('ShowDTFoodCategory');
            console.log(data);
             BindShowDTFoodCategory(data);
            $('#preloader').hide();
            //RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });

}

function BindShowDTFoodCategory(data) {
    tblFoodCategoryList = $(tblFoodCategoryListId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        bAutoWidth: false,
        dom: 'Rlfrtip',
        scrollY: 600,
        scrollX: true,
        fixedHeader: true,
        columns: [
 
                { targets: [2], data: "name", className: '', visible: true, searchable: true, width: "10%" },
 
                { targets: [4], data: "id", className: '', visible: false },
        


        ]


        //fnRowCallback: ShowHealtCheckDashboardCallBack(),
    });

}

function ShowDTFoodItem() {

    var Url = $('#url').data("fooditemlist");

    var param = {
        
    };

    $('#preloader').show();
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

            BindShowDTFoodItem(data.list);
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



function BindShowDTFoodItem(data) {
    tblFoodItemList = $(tblFoodItemListId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        bAutoWidth: false,
        dom: 'Rlfrtip',
        scrollY: 600,
        scrollX: true,
        fixedHeader: true,
        columns: [
              //  { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected"/>' },
                { targets: [1], data: "code", className: '', visible: true, searchable: true, width: "10%" },
                { targets: [2], data: "name", className: '', visible: true, searchable: true, width: "10%" },
                { targets: [3], data: "categoryname", className: ' ', visible: true, searchable: true, width: "10%" },
                { targets: [4], data: "id", className: '', visible: false },
                { targets: [5], data: "CategoryID", className: '', visible: false }
                

        ]

 
        //fnRowCallback: ShowHealtCheckDashboardCallBack(),
    });
 
}

function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblFoodItemList !== undefined) tblFoodItemList.columns.adjust().draw();
 


}

///--------------print

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

        DeptID: 5//c.GetSelect2Id('#cboDeptId'),
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

