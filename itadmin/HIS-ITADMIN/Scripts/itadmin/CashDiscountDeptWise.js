var c = new Common();
var Action = -1;

var Select2IsClicked = false;

//-------------------------------------------------------
var tblGeneralListDashboardList;
var tblGeneralListDashboardId = '#gridGeneralList'
var tblGeneralListDashboardDataRow;

//-------------------------------------------------------
var tblSelectedList;
var tblSelectedListId = '#gridSelectedlist'
var tblSelectedListDataRow;



$(document).ready(function () {
    // SetupDataTables();
    //   SetupSelectedPrice();
    SetupSelectedRange();
    InitButton();
    //InitDateTimePicker();
    InitSelect2();
    DefaultValues();
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
    BindGeneralListDashboardList([]);
    BindSelectedListList([]);
}

function InitSelect2() {
    // Sample usage
    Sel2Server($("#select2Category"), $("#url").data("selectcategory"), function (d) {
        //alert(d.tariffid);
        //var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);
        //var list = e.added.list;
        //var CategoryId = (d.id);
        //InvenItemMarkupConnection(CategoryId, TypeId)
        //var CategoryId = c.GetSelect2Id('#Select2DeptStation');
        //var Id = (d.id);
        //ReroutingItem(Id);

    });

    Sel2Server($("#select2Company"), $("#url").data("selectcomp"), function (d) {
        //alert(d.tariffid);
        //var CompanyID = (d.id);
        //var tarrifId = (d.tariffid);
        //var list = e.added.list;
        //var CategoryId = (d.id);
        //InvenItemMarkupConnection(CategoryId, TypeId)
        //var CategoryId = c.GetSelect2Id('#Select2DeptStation');
        //var Id = (d.id);
        //ReroutingItem(Id);

    });


    $("#select2ListService").select2({
        data: [{ id: 1, text: 'IP' },
               { id: 2, text: 'OP' }],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added.list;
        //var DiscountType = c.GetSelect2Id('#Select2DiscountTypes');
        //ShowListDiscount(DiscountType);
   
    }); 


    $('#select2Discountypes').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("select2distype"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    DiscountType: c.GetSelect2Id('#select2ListService')

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
        //var DiscountType = c.GetSelect2Id('#select2ListService');
        //var DiscountId = c.GetSelect2Id('#select2Discountypes');
        //var CompanyId = c.GetSelect2Id('#select2Company');
        //var Categoryid = c.GetSelect2Id('#select2Category');
        //ShowListFetch(DiscountType, DiscountId, CompanyId, Categoryid);
       
    });



    $('#select2Services').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("select2service"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    DiscountType: c.GetSelect2Id('#select2ListService'),
                    DiscountId: c.GetSelect2Id('#select2Discountypes'),
                    CompanyId: c.GetSelect2Id('#select2Company'),
                    CategoryId: c.GetSelect2Id('#select2Category')
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
        //var TariffID = c.GetSelect2Id('#select2Tariff');
        //var ServiceID = c.GetSelect2Id('#Select2Service');
        //var DepartmentID = c.GetSelect2Id('#Select2Department');
        //ShowListofNoPriceFetch(TariffID, ServiceID, DepartmentID, TableExists);
        //ShowListwithPriceFetch(TariffID, ServiceID, DepartmentID, TableExists);
        var DiscountType = c.GetSelect2Id('#select2ListService');
        var CompanyId = c.GetSelect2Id('#select2Company');
        var CategoryId = c.GetSelect2Id('#select2Category');
        var DiscountId = c.GetSelect2Id('#select2Discountypes');
        var ServiceId = c.GetSelect2Id('#select2Services');
        var DepartmentId = 0;
        GeneralListConnection(DiscountType,ServiceId);
        SelectedListConnection(DiscountType, CompanyId, CategoryId, DiscountId, ServiceId, DepartmentId);

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

    $('#btnClear').click(function () {
        DefaultEmpty();
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

function DefaultEmpty() {

    //c.SetValue('#txtName', ' ');
    c.SetValue('#select2ListService', '');
    c.Select2Clear('#select2Discountypes');
    c.Select2Clear('#select2Company');
    InitDataTables();
}

function DefaultValues() {
    // Sample usage
    // c.SetValue('#txtDays', '30');
    c.SetSelect2('#select2Class', '1', 'NOCLASS');
    c.SetSelect2('#select2Category', '1', 'CASH PATIENT ACCOUNT');
    // c.iCheckSet('#iChkLast3Mos', true);

    //c.SetSelect2('#select2PatientTypeId', '1', 'In-patient');

}

function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblGeneralListDashboardList !== undefined) tblGeneralListDashboardList.columns.adjust().draw();
    if (tblSelectedList !== undefined) tblSelectedList.columns.adjust().draw();


}
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function BindGeneralListDashboardList(data) {
    tblGeneralListDashboardList = $(tblGeneralListDashboardId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        bAutoWidth: false,
        dom: 'Rlfrtip',
        scrollY: 400,
        scrollX: true,
        fixedHeader: true,
        columns: ShowGeneralListDashboard()
        //fnRowCallback: ShowHealtCheckDashboardCallBack(),

    });

    InitSelectedRange();
}

function ShowGeneralListDashboardCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowGeneralListDashboard() {
    var cols = [
    { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected"/>' },
    { targets: [1], data: "Code", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [2], data: "Name", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [3], data: "Percentage", className: 'ClassPercentage', visible: true, searchable: true, width: "10%" },
    { targets: [4], data: "Amount", className: '', visible: false },
    { targets: [5], data: "Id", className: '', visible: false }

    ];
    return cols;
}

function GeneralListConnection(DiscountType,ServiceId) {

    var Url = $('#url').data("getcashdiscdeptwisedashboard");

    var param = {
        DiscountType: DiscountType,
        ServiceId: ServiceId
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

            BindGeneralListDashboardList(data.list);
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

function SetupSelectedRange() {

    $.editable.addInputType('txtPercentage', {
        element: function (settings, original) {

            var input = $('<input id="txtPercentage" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

}

function InitSelectedRange() {




    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassPercentage', tblGeneralListDashboardList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblGeneralListDashboardList.cell($(this).closest('td')).index();
        tblGeneralListDashboardList.cell(cell.row, 3).data(sVal);


        return sVal;
    },
    {
        "type": 'txtPercentage', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // Resize all rows.
    $(tblGeneralListDashboardList + ' tr').addClass('trclass');

}

//-------------------List of Item with Price--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindSelectedListList(data) {
    tblSelectedList = $(tblSelectedListId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        bAutoWidth: false,
        dom: 'Rlfrtip',
        scrollY: 400,
        scrollX: true,
        fixedHeader: true,
        columns: ShowSelectedlist()
        //fnRowCallback: ShowHealtCheckDashboardCallBack(),

    });


}

function ShowSelectedlistCallBack() {
    //var rc = function (nRow, aData) {
    //    //var value = aData['Status'];
    //    //var $nRow = $(nRow);

    //    //WardDemand
    //    //if (value == 0) {
    //    //    $nRow.css({ "background-color": "white" })
    //    //}
    //    //    //ISSUED
    //    //else if (value == 1) {
    //    //    $nRow.css({ "background-color": "#d7ffea" })
    //    //}
    //    //    //Partial Issues
    //    //else if (value == 3) {
    //    //    $nRow.css({ "background-color": "#f5b044" })
    //    //}

    //};
    //return rc;

}

function ShowSelectedlist() {
    var cols = [
    { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected"/>' },
    { targets: [1], data: "Code", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [2], data: "Name", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [3], data: "Percentage", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [4], data: "Amount", className: '', visible: false },
    { targets: [5], data: "DepartmentId", className: '', visible: false }


    ];
    return cols;
}

function SelectedListConnection(DiscountType,CompanyId,CategoryId,DiscountId,ServiceId,DepartmentId) {

    var Url = $('#url').data("getdeptwiseitem");

    var param = {
        DiscountType: DiscountType,
        CompanyId: CompanyId,
        CategoryId: CategoryId,
        DiscountId: DiscountId,
        ServiceId: ServiceId,
        DepartmentId: DepartmentId
    };

    $('#loadingpdf').show();
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

            BindSelectedListList(data.list);
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

function add_GeneralItem(cell) {
    rowIndex = tblGeneralListDashboardList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    $.each(tblGeneralListDashboardList.rows().data(), function (i, re) {
        if (tblGeneralListDashboardList.cell(i, 0).data() == tblSelectedList.cell(rowIndex, 0).data()) {
            $ex = 1;
        }
    });
    if ($ex == 0) {
        tblSelectedList.row.add({
            Items: tblGeneralListDashboardList.cell(rowIndex, 0).data(),
            Id: tblGeneralListDashboardList.cell(rowIndex, 1).data(),
        }).draw();
        //c.ReSequenceDataTable(tblSelectedList, 0);
        //InitSelectedPrice();
    }
}

function remove_GeneralItem(cell) {
    rowV = $(cell).parents('tr');
    tblGeneralListDashboardList.row(rowV).remove().draw();
    //c.ReSequenceDataTable(tblGeneralListDashboardList, 0);
}

function add_SelectedItem(cell) {
    rowIndex = tblSelectedList.cell(cell).index().row;
    //checking if exisiting 
    var $ex = 0;
    $.each(tblSelectedList.rows().data(), function (i, re) {
        if (tblSelectedList.cell(i, 0).data() == tblGeneralListDashboardList.cell(rowIndex, 0).data()) {
            $ex = 1;
        }
    });
    if ($ex == 0) {
        tblGeneralListDashboardList.row.add({
            Items: tblSelectedList.cell(rowIndex, 0).data(),
            Id: tblSelectedList.cell(rowIndex, 1).data(),
        }).draw();
        //c.ReSequenceDataTable(tblSelectedList, 0);
        //InitSelectedPrice();
    }
}

function remove_SelectedItem(cell) {
    rowV = $(cell).parents('tr');
    tblSelectedList.row(rowV).remove().draw();
    //c.ReSequenceDataTable(tblGeneralListDashboardList, 0);
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
    entry.DiscountType = c.GetSelect2Id('#select2ListService');
    entry.CategoryId = c.GetSelect2Id('#select2Category');
    entry.CompanyId = c.GetSelect2Id('#select2Company');
    entry.DiscountId = c.GetSelect2Id('#select2Discountypes');
    entry.GradeId = c.GetSelect2Id('#select2Class');

    entry.CashDiscountDetailsSave = [];
    var rowcollection = tblItemsList.$("#chkselected:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsList.row(tr);
        var rowdata = row.data();
        entry.CashDiscountDetailsSave.push({
            serviceId: rowdata.ServiceId,
            Percentage: rowdata.Percentage,
            Amount: rowdata.Amount
        });
    });
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