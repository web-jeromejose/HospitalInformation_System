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
    //SetupSelectedPrice();
    InitButton();
    //InitDateTimePicker();
    InitSelect2();
    DefaultDisable();
    InitDataTables();
    c.DisableSelect2('#Select2Role', true);
    c.Disable('#txtNewRole', true);
    c.ButtonDisable('#btnNew', true);
    c.ButtonDisable('#btnSave', true);
});

$(document).on("click", "#iChkAll", function () {
    if ($('#iChkAll').is(':checked')) {
        $.each(tblNoItemsList.rows().data(), function (i, row) {
            tblNoItemsList.cell(i, 0).data('<input id="chkselected" type="checkbox" checked="checked" >');
        });
    }
    else {
        $.each(tblNoItemsList.rows().data(), function (i, row) {
            tblNoItemsList.cell(i, 0).data('<input id="chkselected" type="checkbox">');
        });
    }
});

function DefaultDisable() {
    // Sample usage
    c.DisableSelect2('#Select2Department', true);
    c.DisableSelect2('#Select2Service', true);

    //c.DisableSelect2('#Select2RefDoctor', true);
    //c.DisableSelect2('#Select2ProcedureDoneBy', true);




}
    
//$(document).on("click", tblNoItemsListId + " td", function (e) {
//    e.preventDefault();

//    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
//        var tr = $(this).closest('tr');

//        //// Multiple selection
//        //tr.toggleClass('selected');

//        // Single selection
//        //tr.removeClass('selected');
//        //$('tr.selected').removeClass('selected');
//        //tr.addClass('selected')
//            var entry;
//            entry = []
//            entry = {}
//            var rowcollection = tblItemsList.$("#chkselected:checked", { "page": "all" });
//            rowcollection.each(function (index, elem) {
//                var tr = $(elem).closest('tr');
//                var row = tblItemsList.row(tr);
//                var rowdata = row.data();
//                var FeatureId;
//                FeatureId: rowdata.FeatureId;

               
//            });



//        //tblNoItemsListDataRow = tblItemsWithPriceList.row($(this).parents('tr')).data();

//        //add_ListofItem(this);
//        //remove_SelectedListofItem(this);
//    }
//});

//$(document).on("dblclick", tblItemsWithPriceListId + " td", function (e) {
//    e.preventDefault();

//    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
//        var tr = $(this).closest('tr');

//        //// Multiple selection
//        tr.toggleClass('selected');

//        // Single selection
//        //tr.removeClass('selected');
//        //$('tr.selected').removeClass('selected');
//        //tr.addClass('selected')

//        tblItemsWithPriceListDataRow = tblItemsWithPriceList.row($(this).parents('tr')).data();

//        add_ListWithItem(this);
//        remove_SelectedWithListofItem(this);
//    }
//});

function InitDataTables() {
    //BindSequence([]);
    BindListofItem([]);
    BindListofFunction([]);
}

function InitSelect2() {
    // Sample usage

    Sel2Server($("#Select2Module"), $("#url").data("getmodulelist"), function (d) {
        //alert(d.tariffid);
        //var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);
        c.DisableSelect2('#Select2Role', false);
        c.ButtonDisable('#btnNew', false);
    });

    Sel2Server($("#Select2User"), $("#url").data("getuserdetails"), function (d) {
        //alert(d.tariffid);
        //var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);
        //c.DisableSelect2('#Select2Role', false);
        //c.ButtonDisable('#btnNew', false);
    });
    
    
    $('#Select2Role').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getmoduleroles"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    ModuleId: c.GetSelect2Id('#Select2Module')
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added;
       
        ModuleId = c.GetSelect2Id('#Select2Module')
        RoleId = c.GetSelect2Id('#Select2Role')
        UserId = c.GetSelect2Id('#Select2User')

        ShowListofNoPriceFetch(ModuleId, RoleId, c.GetSelect2Id('#Select2User'));
        //ShowListFunctionConnection(UserId,ModuleId, RoleId);
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

    $('#btnNew').click(function () {
        //Process();
        c.Disable('#txtNewRole', false);
        c.DisableSelect2('#Select2Role', true);
        c.ButtonDisable('#btnSave', false);
        c.ButtonDisable('#btnCopyRole', true);
        var ModuleId
        ModuleId = c.GetSelect2Id('#Select2Module');
        c.SetSelect2('#Select2Role', 0, ' ');
        ShowListNewFeature(ModuleId);
        //ShowNewFunctionConnection();
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

    $('#btnCopyRole').click(function () {
        var YesFunc = function () {
            Action = 2;
            Save();

        };
        c.MessageBoxConfirm("Copy Role Entry?", "Are you sure you want to copy the Role?", YesFunc, null);

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
        columns: ShowListFeaturesColumns(),
        fnRowCallback: ShowFeatureSelectedCallBack()
    });

    //InitSelected();
}


function ShowFeatureSelectedCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['selected'];
        var $nRow = $(nRow);

        if (aData.selected.length != 1) {
            $('#chkselected', nRow).prop('checked', aData.selected === 1);
            if (aData.selected === 1) {
                //$('#chkselected', nRow).prop("disabled", "disabled");
            }
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

function ShowListFeaturesColumns() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected" checked = "checked"/>' },
      { targets: [1], data: "FeatureName", className: '', visible: true, searchable: true, width: "30%" },
      { targets: [2], data: "FeatureId", className: '', visible: false, searchable: true, width: "1%" }
    

    ];
    return cols;
}

function ShowListofNoPriceFetch(ModuleId, RoleId, UserId) {
    var Url = $("#url").data("getfeaturelist");
    var param = {
        ModuleId: ModuleId,
        RoleId: RoleId,
        UserId : UserId
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

function ShowListNewFeature(ModuleId) {
    var Url = $("#url").data("getnewfeature");
    var param = {
       ModuleId: ModuleId
     //,   RoleId: RoleId
    }

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

//-------------------List of Item with Price--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindListofFunction(data) {

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
        columns: Showlistoffunction(),
        fnRowCallback: ShowWithPriceRowCallBack()
    });

    //InitSelectedPrice();
}

function ShowWithPriceRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['selected'];
        var $nRow = $(nRow);

        if (aData.selected.length != 1) {
            $('#chkselected', nRow).prop('checked', aData.selected === 1);
            if (aData.selected === 1) {
                //$('#chkselected', nRow).prop("disabled", "disabled");
            }
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

function Showlistoffunction() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected" checked = "checked"/>' },
      { targets: [1], data: "FunctionName", className: '', visible: true, searchable: true, width: "30%" },
      { targets: [2], data: "FunctionID", className: '', visible: false, searchable: true, width: "1%" }

    ];
    return cols;
}

function ShowListFunctionConnection(UserId,ModuleId, RoleId) {
    var Url = $("#url").data("getfunctionlist");
    var param = {
        UserId: UserId,
        ModuleId: ModuleId,
        RoleId: RoleId
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
            BindListofFunction(data.list);
            //$("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

function ShowNewFunctionConnection() {
    var Url = $("#url").data("getnewfunction");
    //var param = {
    //    ModuleId: ModuleId,
    //    RoleId: RoleId
    //};

    $('#preloader').show();
    //$("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
     //   data: param,
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
            BindListofFunction(data.list);
            //$("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

function ShowListwithPriceFetch(TariffID, ServiceID, DepartmentID, TableExists) {
    var Url = $("#url").data("getfunctionlist");
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
            selected: tblNoItemsList.cell(rowIndex, 0).data(),
            FeatureName: tblNoItemsList.cell(rowIndex, 1).data(),
            FeatureId: tblNoItemsList.cell(rowIndex, 2).data(),
            //Price: tblNoItemsList.cell(rowIndex, 3).data(),
        }).draw();
      //  InitSelectedPrice();
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

    ret = c.IsEmpty('#Select2User');
    if (ret) {
        c.MessageBoxErr('Empty', "You didn't enter a valid User");
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
    entry.Action = Action;
    entry.UserId = c.GetSelect2Id('#Select2User');
    entry.ModuleId = c.GetSelect2Id('#Select2Module');
    entry.RoleId = c.GetSelect2Id('#Select2Role');
    entry.RoleName = $('#txtNewRole').val();
   // entry.StationId = c.GetSelect2Id('#Select2DeptStation');

    entry.UserRolesDetailsSave = [];
    var rowcollection = tblNoItemsList.$("#chkselected:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblNoItemsList.row(tr);
        var rowdata = row.data();

        entry.UserRolesDetailsSave.push({
            FeatureId: rowdata.FeatureId
            //maxId: rowdata.maxId,
            //stationid: rowdata.stationid
        });
    });
    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            $('#loadingpdf').show();
            c.ButtonDisable('#btnSave', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            $('#loadingpdf').hide();
            //c.ButtonDisable('#btnModify', false);
            c.ButtonDisable('#btnSave', false);
            c.ButtonDisable('#btnCopyRole', true);
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
                //  TransacListDashBoardConnection();
                InitDataTables();

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