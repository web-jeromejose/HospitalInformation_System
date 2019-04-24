var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridDiscounType'
var tblItemsListDataRow;

//var tblItemsWithPriceList;
//var tblItemsWithPriceListId = '#gridListWithPrice'
//var tblItemsWithPriceListDataRow;

var OrderId;
var ProcedureId;
var RequestedId;


$(document).ready(function () {
    // SetupDataTables();
    //SetupSelectedPrice();
    InitButton();
    //InitDateTimePicker();
    var DiscountType = 1;
    ShowListDiscount(DiscountType);
    InitSelect2();
    InitDataTables();
    DefaultValues();
    InitICheck();

});

$(document).on("click", tblItemsListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');
        tblItemsListDataRow = tblItemsList.row($(this).parents('tr')).data();
        var DiscountType = c.GetSelect2Id('#Select2DiscountTypes');
        var Name = tblItemsListDataRow.Name;
        var AuthCanEdit = tblItemsListDataRow.AuthCanEdit;
        var RequireNoAuth = tblItemsListDataRow.RequireNoAuth;
        var CompanyId = tblItemsListDataRow.CompanyId;
        var CompanyName = tblItemsListDataRow.CompanyName;
        var Id = tblItemsListDataRow.Id;
        c.SetValue('#DiscountId', Id);
        c.SetValue('#txtName', Name);
        c.SetSelect2('#Select2Company', CompanyId, CompanyName);
        c.iCheckSet('#isEdit', AuthCanEdit);
        c.iCheckSet('#isAuthorize', RequireNoAuth);
        c.SetSelect2('#select2Dumpdiscountype', ' ', ' ');
        if (DiscountType == 1) {
            c.Select2Clear('#Select2Company');
            c.DisableSelect2('#select2Dumpdiscountype', false);
            c.iCheckDisable('#isEdit', false);
            c.iCheckDisable('#isAuthorize', false);
            c.DisableSelect2('#Select2Company', true);
            c.ButtonDisable('#btnModify', false);
        } else {
            c.iCheckDisable('#isEdit', true);
            c.iCheckDisable('#isAuthorize', true);
            c.DisableSelect2('#Select2Company', true);
            c.DisableSelect2('#select2Dumpdiscountype', false);
            c.ButtonDisable('#btnModify', true);
        }

        c.iCheckSet('#isAuthorize', RequireNoAuth);
        DefaultDisable();
        c.ModalShow('#modalEntry', true);
        
        //View(Service, PackageId);
        //Action = 2;
       
    }

    Action = 2;
    HandleEnableButtons();

});

function InitDataTables() {
    //BindSequence([]);
    BindListofItem([]);
    //BindWithPriceListofItem([]);
}

function InitSelect2() {
    // Sample usage
    
  
    $("#Select2DiscountTypes").select2({
        data: [{ id: 1, text: 'IP' },
               { id: 2, text: 'OP'}],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added.list;
        var DiscountType = c.GetSelect2Id('#Select2DiscountTypes');
        ShowListDiscount(DiscountType);
    });


    Sel2Server($("#Select2Company"), $("#url").data("selectcompany"), function (d) {
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


    $('#select2Dumpdiscountype').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("selectdiscountype"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    DiscountType: c.GetSelect2Id('#Select2DiscountTypes')

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

    $('#btnProcess').click(function () {
        Process();
    });

    $('#btnSave').click(function () {
        var YesFunc = function () {
            //Action = 1;
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

    

    $('#btnDelete').click(function () {
        var YesFunc = function () {
            Action = 3;
            Save();

        };
        c.MessageBoxConfirm("Delete Entry?", "Are you sure you want to Delete the Entry?", YesFunc, null);

    });

    $('#btnReportGen').click(function () {

        //  print_preview();

        $('#myModal').modal('show');
        PrintPreview();

    });

    $('#btnNew').click(function () {
        DefaultEmpty();
        //  print_preview();
        Action = 1;
        HandleEnableButtons();
        var DiscountType = c.GetSelect2Id('#Select2DiscountTypes');
      // c.DisableSelect2('#select2Dumpdiscountype', true);
        //c.DisableSelect2('#Select2Company', true);
        // c.SetSelect2('#Select2Company', '1', '0000 - CASH PATIENT');
        if (DiscountType == 1) {
            c.Select2Clear('#Select2Company');
            c.DisableSelect2('#select2Dumpdiscountype', true);
            c.iCheckDisable('#isEdit', false);
            c.iCheckDisable('#isAuthorize', false);
            c.DisableSelect2('#Select2Company', true);
            c.ButtonDisable('#btnModify', false);
        } else {
            c.iCheckDisable('#isEdit', true);
            c.iCheckDisable('#isAuthorize', true);
            c.DisableSelect2('#Select2Company', false);
            c.DisableSelect2('#select2Dumpdiscountype', true);
            c.ButtonDisable('#btnModify', true);
            c.SetSelect2('#Select2Company', '1', '0000 - CASH PATIENT');
        }

        c.ModalShow('#modalEntry', true);


    });


    $('#btnDump').click(function () {
        var YesFunc = function () {
            //Action = 2;
            SaveDump();

        };
        c.MessageBoxConfirm("DUMP Entry?", "Are you sure you want to Dump the Entry?", YesFunc, null);

    });

    $('#btnRefresh').click(function () {
        var DiscountType = c.GetSelect2Id('#Select2DiscountTypes');
        ShowListDiscount(DiscountType);

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


function InitICheck() {

    //$('#iChkOthers').iCheck({
    //    checkboxClass: 'icheckbox_square-red',
    //    radioClass: 'iradio_square-red'
    //}).on("ifChecked ifUnchecked", function (e) {
    //    var checked = e.type == "ifChecked" ? true : false;

    //});

    //$('#isAuthorize').iCheck({
    //    //checkboxClass: 'icheckbox_square-red',
    //    //radioClass: 'iradio_square-red'
    //}).on("ifChecked ifUnchecked", function (e) {
    //    var checked = e.type == "ifChecked" ? 1 : 0;

    //});


    //    $('#iChkDateofBirth').iCheck({
    //        checkboxClass: 'icheckbox_square-red',
    //        radioClass: 'iradio_square-red'
    //    }).on("ifChecked ifUnchecked", function (e) {
    //        var checked = e.type == "ifChecked" ? true : false;
    ////      c.SetDateTimePicker('#dtBirth', checked ? moment() : "");

    //    });
}

function HandleEnableButtons() {


    // VAED
    if (Action == 0) {
        $('.HideOnView').hide();
        $('.ShowOnView').show();
    }
    else if (Action == 1) {
        $('.HideOnAdd').hide();
        $('.ShowOnAdd').show();
    }
    else if (Action == 2) {
        $('.HideOnEdit').hide();
        $('.ShowOnEdit').show();
    }
    else if (Action == 3) {
        $('.HideOnDelete').hide();
        $('.ShowOnDelete').show();
    }

    HandleButtonNotUse();




}

function HandleButtonNotUse() {
    $('.NotUse').hide();
}

function HandleEnableEntries() {
    // VAED
    if (Action == 0 || Action == 3) { // view or delete
        //c.Disable('#txtProfileName', true);

    }
    else if (Action == 1) { // add
        //c.Disable('#txtProfileName', false);

    }
    else if (Action == 2) { // edit    
        //c.Disable('#txtProfileName', true);

    }
    else {
        c.Show('#Entry', false);
        c.Show('#DashBoard', true);
    }

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

function DefaultValues() {
    // Sample usage
    // c.SetValue('#txtDays', '30');
    c.SetSelect2('#Select2DiscountTypes', '1', 'IP');
    // c.iCheckSet('#iChkLast3Mos', true);

    //c.SetSelect2('#select2PatientTypeId', '1', 'In-patient');

}

function DefaultDisable() {
    c.Disable('#txtName', true);
   

}

function DefaultEmpty() {

    //c.SetValue('#txtName', ' ');
    c.SetValue('#txtName', '');
    //c.Select2Clear('#Select2DiscountTypes');
    c.Select2Clear('#Select2Company');
    c.Select2Clear('#select2Dumpdiscountype');
    c.iCheckSet('#isEdit', false)
    c.iCheckSet('#isAuthorize', false)
    c.Disable('#txtName', false);
}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}


function View(Service, PackageId) {

    var Url = $('#url').data("getfetchvisit");
    //var Url = baseURL + "ShowSelected";
    var param = {
        Service: Service,
        PackageId: PackageId
     
    };
    $('#loadingpdf').show();
    $('#preloader').show();
    //$('.Hide').hide();

    $.ajax({
        url: Url,
        data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (result) {
            $('#preloader').hide();
            $('.Show').show();

            //if (FetchFindingsResults.length == 0) {
            //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
            //    tblRequisitionList.row('tr.selected').remove().draw(false);
            //    return;
            //}

            var data = result.list[0];
            c.SetSelect2('#select2Service', data.ID, data.Test);
            c.SetValue('#txtNoofDays', data.NoOfdays);
            c.SetValue('#txtNoofVisit', data.NoOfVisits);
         
            //HandleEnableEntries();
            c.ModalShow('#modalEntry', true);
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            $('#loadingpdf').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

//-------------------List-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindListofItem(data) {

    tblItemsList = $(tblItemsListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowListColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowListColumns() {
    var cols = [
      { targets: [0], data: "SNo", className: '', visible: true, searchable: true, width: "1%" },
      { targets: [1], data: "Name", className: '', visible: true, searchable: true, width: "20%" },
      { targets: [2], data: "CreatedOn", className: '', visible: true, searchable: true, width: "10%" },
      { targets: [3], data: "Id", className: '', visible: false },
      { targets: [4], data: "AuthCanEdit", className: '', visible: false },
      { targets: [5], data: "RequireNoAuth", className: '', visible: false },
      { targets: [6], data: "CompanyId", className: '', visible: false },
      { targets: [7], data: "CompanyName", className: '', visible: false },
    ];
    return cols;
}

function ShowListDiscount(DiscountType) {
    var Url = $("#url").data("selectypes");
    var param = {
        DiscountType: DiscountType
    };

    $('#preloader').show();
    $('#loadingpdf').show();
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
            $('#loadingpdf').hide();
            //if (TblGridCrossMatchAvail.rows('.selected').data().length == 0) {
            //    c.MessageBoxErr("Empty...", "No Bags Reserved.", null);
            //    return;
            //}
            BindListofItem(data.list);
            //$("#grid").css("visibility", "visibl`e");
     
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


function Validated() {

    var ret = false;

    ret = c.IsEmpty('#txtName');

    if (ret) {
        c.MessageBoxErr('Empty...','Please input a  Name');
        return false;
    }


    ret = c.IsEmpty('#txtName');

    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Name');
        return false;
    }

  

    return true;

}

function ValidatedDump() {

    var ret = false;

    //ret = c.IsEmpty('#txtHomeAdress');

    //if (ret) {
    //    c.MessageBoxErr('Y/N...', 'Please input Y for YES and N for NO');
    //    return false;
    //}

    ret = c.IsEmptyById('#select2Dumpdiscountype');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Dump Discount Type');
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
    //entry.Deleted = 0;
    entry.Name = $('#txtName').val();
    entry.AuthCanEdit = c.GetICheck('#isEdit'); /// $('#isEdit').val();
    entry.RequireNoAuth = c.GetICheck('#isAuthorize'); //$('#isAuthorize').val();
    entry.CompanyId = c.GetSelect2Id('#Select2Company');  //$('#Select2Company').select2('data').id;
    entry.DiscountType = c.GetSelect2Id('#Select2DiscountTypes');// $('#Select2DiscountTypes').select2('data').id;
    entry.Id = $('#DiscountId').val();
    entry.DumpDiscountId = c.GetSelect2Id('#select2Dumpdiscountype');

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
                HandleEnableButtons();
                //HandleEnableEntries();
                c.ModalShow('#modalEntry', false);
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

function SaveDump() {

    var ret = ValidatedDump();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = Action;
    //entry.Deleted = 0;
    //entry.Name = $('#txtName').val();
    //entry.AuthCanEdit = c.GetICheck('#isEdit'); /// $('#isEdit').val();
    //entry.RequireNoAuth = c.GetICheck('#isAuthorize'); //$('#isAuthorize').val();
    //entry.CompanyId = c.GetSelect2Id('#Select2Company');  //$('#Select2Company').select2('data').id;
    entry.DiscountType = c.GetSelect2Id('#Select2DiscountTypes');// $('#Select2DiscountTypes').select2('data').id;
    entry.Id = $('#DiscountId').val();
    entry.DumpDiscountId = c.GetSelect2Id('#select2Dumpdiscountype');

    $.ajax({
        url: $('#url').data("dumpsave"),
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
                HandleEnableButtons();
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