var ajaxWrapper = $.ajaxWrapper();
var tbl;
var keys;
var defaultStartDate;
var blnNextItem = true;
var messagebox = $.MessageBox({ DefaultTitle: '<span class="glyphicon glyphicon-imac modal-title-icon-spacer"></span> IP Tariff' });
var tblSearch;
var blnManualReDraw = false;
var c = new Common();

var tblNoItemsList;
var tblNoItemsListId = '#tblSearch'
var tblNoItemsListDataRow;


//$(document).ready(function () {


//    InitButton();
//    InitDataTables();

//});


$(function () {
    var d = new Date;
    defaultStartDate = [d.getDate(), d.getMonth() + 1, d.getFullYear()].join('/') + ' 12:00 AM';

    $.blockUI.defaults.css.padding = 0;
    $.blockUI.defaults.css.margin = 0;
    $.blockUI.defaults.css.width = "100%";
    $.blockUI.defaults.css.textAlign = 'center';
    $.blockUI.defaults.css.border = 'none';
    $.blockUI.defaults.css.backgroundColor = 'transparent';
    $.blockUI.defaults.css.cursor = 'wait';
    $.blockUI.defaults.message = '<img class="loadinggif" src="data:image/png;base64,R0lGODlhFAAUAIAAAP///wAAACH5BAEAAAAALAAAAAAUABQAAAIRhI+py+0Po5y02ouz3rz7rxUAOw==" width="128px" height="128px" alt="Loading">';
    $.blockUI.defaults.overlayCSS.backgroundColor = '#000';
    $.blockUI.defaults.overlayCSS.opacity = 0.3;
    $.blockUI.defaults.overlayCSS.cursor = 'default';
    $.blockUI.defaults.cursorReset = 'default';


    $("#cboTariff").select2({
        allowClear: false,
        dropdownAutoWidth: true
    }).on("change", function (e) {
        $('#cboService').select2("enable", true);
        $('#cboService').select2("val", 0);

        $('#tariffitem').html('-');
        if (tbl != null && tbl !== undefined) {
            tbl.clear().draw();
        }
        $('.buttongroups').prop('disabled', true);
        $('#chkTariffRevisedBy').iCheck('disable');
    });

    $("#cboService").select2({
        allowClear: false,
        dropdownAutoWidth: true
    }).on("change", function (e) {
        if (keys != null)
            keys == null;
        RefreshItemPriceList(null);
        $('.buttongroups').prop('disabled', false);
        $('#chkTariffRevisedBy').iCheck('enable');
    });

    $('#cboService').select2("enable", false);
    $('#chkTariffRevisedBy').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

        $('.tariffrevised').prop('disabled', !checked);
        $('.buttongroups').prop('disabled', checked);
        $('.datepicker').datepicker('hide');

        if (tbl != null && tbl !== undefined)
            tbl.clear().draw();

        $('#tariffitem').html('-');
        if (!checked)
            RefreshItemPriceList(null);
    });

    $('.datepicker').datepicker({
        autoclose: true,
        todayHighlight: true,
        format: "dd/mm/yyyy"
    });

    addEditors();
    BindDataTable();

    $('.recordset').click(function () {
        blnNextItem = $(this).data('actiontype') == 'next' ? true : false;
        var itemid = $('#tariffitem').data('itemid');
        RefreshItemPriceList(itemid);
    });

    $(document).on('click', '#btnSearchItemCode', function (e) {
        e.preventDefault();
        tblSearch.draw();
    });

    $('#btnFind').click(function () {
        var searchMsg = '<div class="row"><div class="col-xs-12"><form action="" method="get" class="form-inline"><div class="pull-left"> <div class="form-group"><label class="control-label">Find</label> <input id="txtSearchItem" class="form-control input-sm"/></div>';
        searchMsg += '  <button type="submit" id="btnSearchItemCode" class="btn btn-success">Search</button> </div> ';
        searchMsg += ' <div class="pull-left" style="margin-left: 10px;"> ';
        searchMsg += ' <div class="icheckbox"><input type="radio" id="byCode" name="finditemby" value="code" checked class="icheck-find" data-findby="code" data-skin="square" data-color="green"/></div><div class="icheckbox-label"><label for="byCode" style="padding-right: 10px;">Code</label></div>';
        searchMsg += ' <div class="icheckbox"><input type="radio" id="byName" name="finditemby" value="name" class="icheck-find" data-findby="name" data-skin="square" data-color="green"/></div><div class="icheckbox-label"><label for="byName">Name</label></div>';
        //        searchMsg += ' <div class="pull-left"><div class="check-line"><input type="radio" name="finditemby" id="byCode" value="code" class="icheck-find" data-skin="square" data-color="green"><label class="inline" for="byCode">Code</label></div></div>';
        //        searchMsg += ' <div class="pull-left"><div class="check-line"><input type="radio" name="finditemby" id="byName" value="name" class="icheck-find" data-skin="square" data-color="green"><label class="inline" for="byName">Name</label></div></div>';
        searchMsg += ' </div></form><div class="col-xs-12">';
        searchMsg += ' <table id="tblSearchItem" class="table table-nomargin table-hover table-bordered table-condensed"><thead><tr><th>ID</th><th>Code</th><th>Name</th></tr></thead><tbody></tbody></table> </div></div>';
        //searchMsg += '<table id="tblSearchItem">'+$('#tbltest').html() + '</table>';


        //$(".modal-dialog.ui-draggable").css("margin-top", "213.5px");

        messagebox.Show({
            Msg: searchMsg,
            Title: '<span class="glyphicon glyphicon-search modal-title-icon-spacer"></span> Find Item',
            showIcon: false,
            className: 'large',
            defaultButtonLabel: 'Close',
            fnShowCallBack: function () {
                $('.icheck-find').iCheck({
                    //checkboxClass: 'icheckbox_square-green',
                    radioClass: 'iradio_square-green'
                });

                bindSearchDataTable();
            }
        });

        $(".modal-dialog.ui-draggable").css("margin-top", "195px");
    });

    $(window).resize(function () {
        if (tblSearch != null)
            tblSearch.columns.adjust();

        tbl.columns.adjust();
    });

    $('#btnSave').click(function (e) {
        Save();
    });
});

function bindSearchDataTable() {
    tblSearch = $('#tblSearchItem').DataTable({
        processing: false,
        serverSide: true,
        searching: false,
        ordering: false,
        retrieve: true,
        scrollY: 200,
        paging: false,
        lengthchange: false,
        info: false,
        dom: 'rt<"bottom"iflp<"clear">>',
        ajax: {
            url: $('#btnFind').data('find'),
            beforeSend: function () {
                //$('#divItemMaster').block();
            },
            complete: function () {
                //$('#divItemMaster').unblock();
            },
            data: function (d) {

                d.serviceid = $("#cboService").select2('val');
                if ($('#byCode').is(":checked"))
                    d.searchbycode = true;
                else
                    d.searchbycode = false;

                d.searchtext = $("#txtSearchItem").val();

              
            }
        },
        columns: [
             { visible: true, data: "ID" },
            //{ visible: false, targets: 0, data: "ID" },
            { data: "Code" },
            { data: "Name" }
        ]
    });
}

function InitButton() {

    $('#btnSearch').click(function () {
        var ServiceID = $('#cboService').select2('val');
        var SearchByCode = 1
        var SearchText = '';
        RedrawGrid();
        c.ModalShow('#modalEntry', true);
        ShowListofNoPriceFetch(ServiceID, SearchByCode, SearchText);

    });
}

function InitDataTables() {
    //BindSequence([]);
    BindListofItem([]);
    RedrawGrid();
    //BindWithPriceListofItem([]);
}


function addEditors() {
    $.editable.addInputType('datetimepicker', {
        element: function (settings, original) {
            keys.block = true;
            var input = $('<input type="text" class="form-control" value="' + defaultStartDate + '" style="width: 100%;height: 22px;padding-top:0px;padding-bottom:0px;"/>');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            if (!MakeCellEditable(original)) {
                $(this).find('input').focus(function () {
                    var esc = $.Event("keydown", { keyCode: 27 });
                    $(this).trigger(esc);
                });
                return;
            }

            $(this).find('input').val(defaultStartDate)
                            .inputmask("datetime12");
            setTimeout(function () { keys.block = true; }, 0);
        }
    });

    $.editable.addInputType('decimalinput', {
        element: function (settings, original) {
            setTimeout(function () { keys.block = true; }, 0);

            var input = $('<input type="text" class="form-control" style="height: 22px;padding-top:0px;padding-bottom:0px;"/>');
            $(this).append(input);
            return (input);
        },
        plugin: function (settings, original) {
            if (!MakeCellEditable(original)) {
                $(this).find('input').focus(function () {
                    var esc = $.Event("keydown", { keyCode: 27 });
                    $(this).trigger(esc);
                });
                return;
            }

            $(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSeparator: ",", groupSize: 3, digits: 2 });
            setTimeout(function () { keys.block = true; }, 0);
            $(this).find('input').keydown(function (e) {
                var cellIndex = tbl.cell(original).index();
                if (e.keyCode == 40) { //down                    
                    if (cellIndex.row < tbl.rows().data().length - 1) {
                        keys.block = false;
                        //                        if ($('.datetimeeditor', tbl.rows().nodes()).find('form').length > 0)
                        //                            $('.datetimeeditor', tbl.rows().nodes()).find('form').submit();
                        keys.fnSetPosition(cellIndex.column, cellIndex.row);
                    }
                }
                else if (e.keyCode == 38) { //up                                        
                    if (cellIndex.row > 0) {
                        keys.block = false;
                        //                        if ($('.datetimeeditor', tbl.rows().nodes()).find('form').length > 0)
                        //                            $('.datetimeeditor', tbl.rows().nodes()).find('form').submit();
                        keys.fnSetPosition(cellIndex.column, cellIndex.row);
                    }
                }
            });
        }
    });
}

function bindTariffCheckBox() {
    $('.icheck-me').iCheck({
        checkboxClass: 'icheckbox_square-green',
        radioClass: 'iradio_square-green'
    }).on("ifChecked ifUnchecked", function (e) {
        if (tbl != null && tbl !== undefined) {
            if ($('.priceeditor', tbl.rows().nodes()).find('form').length > 0)
                $('.priceeditor', tbl.rows().nodes()).find('form').submit();

            if ($('.datetimeeditor', tbl.rows().nodes()).find('form').length > 0)
                $('.datetimeeditor', tbl.rows().nodes()).find('form').submit();
        }

        var checked = e.type == "ifChecked" ? true : false;
        if ($(this).data('checkall') == "1") {
            blnManualReDraw = true;
            $('.icheck-me').iCheck(checked ? 'check' : 'uncheck');
            blnManualReDraw = false;
            if (tbl != null && tbl !== undefined) {
                tbl.draw();
            }
        }

        if ($(this).closest('tr').length > 0) {
            var rowIndex = tbl.row($(this).closest('tr')).index();
            //            tbl.cell(rowIndex, 3).data('')
            //               .cell(rowIndex, 4).data('')
            tbl.cell(rowIndex, 5).data(checked ? "1" : "0");
            if (!blnManualReDraw)
                tbl.draw();
        }
        //bindTariffCheckBox();
    });
}

function RefreshItemPriceList(itemID) {
    ajaxWrapper.Get($('#frmIPTariff').attr('action'), { tariffid: $('#cboTariff').select2('val'), serviceid: $('#cboService').select2('val'), itemid: itemID, bNextItem: blnNextItem },
        function (data, e) {
            $('#itemPriceList').html(data);
            BindDataTable();
        });
}

function BindDataTable() {
    tbl = $("#tblItemPrice").DataTable(
    {
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        columnDefs: [
            {
                render: function (data, type, full, meta) {
                    var checked = full[5] == "1" ? "checked" : "";

                    return '<div class="icheckbox"><input type="checkbox" id="chk' + full[6] + '" ' + checked + ' data-checkall="0" class="icheck-me" data-skin="square" data-color="green"></div> ' +
                       '<div class="icheckbox-label"><label for="chk' + full[6] + '">' + full[7] + '</label></div>';
                }, targets: 0
            },
            {
                visible: false, targets: [5, 6, 7]
            }
        ],
        drawCallback: function (settings) {
            bindTariffCheckBox();
        },
        initComplete: function (settings, json) {
            $('.icheck-me').iCheck('check');
        }
    });

    //$('.icheck-me').iCheck('check');
    keys = new $.fn.dataTable.KeyTable(tbl);

    keys.event.action(3, null, function (nCell) {
        MakeCellEditable(nCell);
    });

    keys.event.action(4, null, function (nCell) {
        MakeCellEditable(nCell);
    });

    keys.event.blur(3, null, function (nCell) {
        if ($('.priceeditor').find('form').length > 0)
            $('.priceeditor').find('form').submit();
    });
    keys.event.blur(4, null, function (nCell) {
        if ($('.datetimeeditor', tbl.rows().nodes()).find('form').length > 0)
            $('.datetimeeditor', tbl.rows().nodes()).find('form').submit();
    });

    keys.event.focus(3, null, function (nCell) {
        MakeCellEditable(nCell);
    });

    keys.event.focus(4, null, function (nCell) {
        MakeCellEditable(nCell);
    });

    initEditable();
}

function initEditable() {
    $('.priceeditor', tbl.rows().nodes()).editable(function (sVal, settings) {
        setTimeout(function () { keys.block = false; }, 0);
        var rowIndex = tbl.row($(this).closest('tr')).index();
        tbl.cell(rowIndex, 3).data(sVal).draw();

        return sVal;
    },
    {
        "type": 'decimalinput', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'dblclick', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    $('.datetimeeditor', tbl.rows().nodes()).editable(function (sVal, settings) {
        setTimeout(function () { keys.block = false; }, 0);
        var rowIndex = tbl.row($(this).closest('tr')).index();
        tbl.cell(rowIndex, 4).data(sVal).draw();
        return sVal;
    },
    {
        "type": 'datetimepicker', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'dblclick', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

}

function MakeCellEditable(cell) {
    //keys.block = true;

    var rowIndex = tbl.cell(cell).index().row;

    if (tbl.cell(rowIndex, 5).data() == "0") { //$($(cell).closest('tr')[0]).data('oktoedit') 
        setTimeout(function () { $(cell).click(); }, 0);
        setTimeout(function () { keys.block = false; }, 0);
        return false;
    }
    else {
        setTimeout(function () { $(cell).dblclick(); }, 0);
        setTimeout(function () { keys.block = true; }, 10);
        return true;
    }
}

function SaveByPercent() {
    var Param = {};

    Param.ServiceID = $('#cboService').select2('val');
    Param.TariffID = $('#cboTariff').select2('val');
    Param.StartDate = $('.datepicker').val();
    Param.Percent = $('#txtPercent').val();
    ajaxWrapper.Post($('#btnSave').data('saveactionbypercent'), Param, function (data, e) {

    });
}

function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblNoItemsList !== undefined) tblNoItemsList.columns.adjust().draw();
    //if (tblInvestigationList !== undefined) tblInvestigationList.columns.adjust().draw();
    //if (tblConsulDeprtList !== undefined) tblConsulDeprtList.columns.adjust().draw();
    //if (tblProcedureList !== undefined) tblProcedureList.columns.adjust().draw();
    //if (tblSelectedInvestigationList !== undefined) tblSelectedInvestigationList.columns.adjust().draw();
    //if (tblSelectedConsulDeprtList !== undefined) tblSelectedConsulDeprtList.columns.adjust().draw();
    //if (tblSelectedProcedureList !== undefined) tblSelectedProcedureList.columns.adjust().draw();
    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}


function Save() {
    var errorMsg = '';
    var TariffParam = {};
    TariffParam.ServiceID = $('#cboService').select2('val');
    TariffParam.TariffID = $('#cboTariff').select2('val');
    TariffParam.ItemID = $('#tariffitem').data('itemid');
    TariffParam.PriceList = [];

    $.each(tbl.rows().data(), function (i, row) {
        if (row[5] == '1' && (row[3].trim() == '' || row[4].trim() == '')) {
            errorMsg += 'Please enter the ';
            if (row[3].trim() == '')
                errorMsg += ' [Price],';

            if (row[4].trim() == '')
                errorMsg += '[With Effect From],';

            errorMsg = errorMsg.substr(0, errorMsg.length - 1);
            errorMsg += ' for ' + row[7] + '.<br/>';
            return true;
        }

        if (row[5] == '1')
            TariffParam.PriceList.push({ BedTypeID: row[6], Price: row[3], EffectiveFrom: row[4] });
    });

    if (errorMsg.length > 0) {

        messagebox.Show({
            Msg: errorMsg
            
        });
        $(".modal-dialog.ui-draggable").css("margin-top", "222px");
        return;
    }

    ajaxWrapper.Post($('#btnSave').data('saveaction'), TariffParam, function (data, e) {
        if (data) {
            messagebox.Show({
                Msg: "Record successfully saved."
            });
            $(".modal-dialog.ui-draggable").css("margin-top", "222px");
        }
    });
}

///-----Sheldon ito
function BindListofItem(data) {

    tblNoItemsList = $(tblNoItemsListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 300,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 200,
        lengthChange: false,
        columns: ShowListNoitemsColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowListNoitemsColumns() {
    var cols = [
    //{ targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "0%" },
      { targets: [0], data: "ID", className: '', visible: false, searchable: true, width: "0%" },
      { targets: [1], data: "Name", className: '', visible: true, searchable: true, width: "50%" },
      { targets: [2], data: "Code", className: '', visible: true, searchable: true, width: "50%" }
      //{ targets: [3], data: "Price", className: '', visible: false, searchable: true, width: "0%" }

    ];
    return cols;
}

function ShowListofNoPriceFetch(ServiceID, SearchByCode, SearchText) {
    var Url = $("#url").data("getfinditem");
    var param = {
        ServiceID: ServiceID,
        SearchByCode: 1,
        SearchText: SearchText

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
            RedrawGrid();
            //$("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}