var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridlistcashdiscount'
var tblItemsListDataRow;



$(document).ready(function () {
    // SetupDataTables();
    SetupSelectedPrice();
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
    BindListofItem([]);
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
        var DiscountType = c.GetSelect2Id('#select2ListService');
        var DiscountId = c.GetSelect2Id('#select2Discountypes');
        var CompanyId = c.GetSelect2Id('#select2Company');
        var Categoryid = c.GetSelect2Id('#select2Category');
        //ShowListofNoPriceFetch(TariffID, ServiceID, DepartmentID, TableExists);
        //ShowListwithPriceFetch(TariffID, ServiceID, DepartmentID, TableExists);
        ShowListFetch(DiscountType, DiscountId, CompanyId, Categoryid);

    });



    $('#select2Class').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("select2class"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    CompanyId: c.GetSelect2Id('#select2Company')

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
//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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

    InitSelectedPrice();
}

function ShowRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['selected'];
        var $nRow = $(nRow);

        if (aData.Selected.length != 1) {
            $('#chkselected', nRow).prop('checked', aData.Selected === 1);
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
      { targets: [1], data: "ServiceName", className: '', visible: true, searchable: true, width: "40%" },
      { targets: [2], data: "Percentage", className: 'ClassPercentage', visible: true, searchable: true, width: "30%" },
      { targets: [3], data: "Amount", className: '', visible: false},
      { targets: [4], data: "ServiceId", className: '', visible: false }

    ];
    return cols;
}

function ShowListFetch(DiscountType, DiscountId, CompanyId, Categoryid) {
    var Url = $("#url").data("fetchcashdiscount");
    var param = {
        DiscountType: DiscountType,
        DiscountId: DiscountId,
        CompanyId: CompanyId,
        Categoryid: Categoryid
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

function SetupSelectedPrice() {

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

function InitSelectedPrice() {

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassPercentage', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        tblItemsList.cell(cell.row, 2).data(sVal);


        return sVal;
    },
    {
        "type": 'txtPercentage', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // Resize all rows.
    $(tblItemsList + ' tr').addClass('trclass');

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