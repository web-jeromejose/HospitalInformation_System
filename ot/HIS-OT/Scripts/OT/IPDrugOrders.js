var c = new Common();
var Action = -1;
var DisableCancel_alreadydispatched = 0;
var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridDrugList;
var TblGridDrugListId = "#gridDrugs";
var TblGridDrugListDataRow;

var TblGridDrugIssue;
var TblGridDrugIssueId = "#gridDrugsIssue";
var TblGridDrugIssueDataRow;

var TblGridDrugAllergies;
var TblGridDrugAllergiesId = "#gridDrugsAllergies";
var TblGridDrugAllergiesDataRow;

var TblGridSearch;
var TblGridSearchId = "#gridSearchResults";
var TblGridSearchDataRow;

$(document).ready(function () {

    c.SetTitle("IP Drug Orders");
    c.DefaultSettings();

    SetupDataTables();

    InitButton();
    InitICheck();
    InitSelect2();
    InitDateTimePicker();
    InitDataTables();

    DefaultDisable();
    DefaultReadOnly();
    DefaultValues();

    HandleEnableButtons();
    HandleEnableEntries();

    setTimeout(function () {
        ShowList();
    }, 1 * 100);

});

function NumericOnly(event, t) {
    return c.IsNumber(event, t);
}

$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // for future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();

    //    TblGridSearch.columns.adjust().draw();
    RedrawGrid();
    
})

$(document).on("click", TblGridListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        //tr.toggleClass('selected');

        // Single selection
         tr.removeClass('selected');
         $('tr.selected').removeClass('selected');
         tr.addClass('selected')

        TblGridListDataRow = TblGridList.row($(this).parents('tr')).data();

    }
});
$(document).on("dblclick", TblGridListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        TblGridListDataRow = TblGridList.row($(this).parents('tr')).data();
        Action = 0;
        View(TblGridListDataRow.Id);
    }
});

$(document).on("click", TblGridDrugAllergiesId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        //tr.toggleClass('selected');

        // Single selection
        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected')

        TblGridDrugAllergiesDataRow = TblGridDrugAllergies.row($(this).parents('tr')).data();

    }
});

$(document).on("click", TblGridDrugListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        // Multiple selection
        tr.toggleClass('selected');

        //// Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')

        TblGridDrugListDataRow = TblGridDrugList.row($(this).parents('tr')).data();

    }
});

$(document).on("click", TblGridSearchId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        // Multiple selection
        tr.toggleClass('selected');

        //// Single selection
        //tr.removeClass('selected');
        //$('tr.selected').removeClass('selected');
        //tr.addClass('selected')

        TblGridSearchDataRow = TblGridSearch.row($(this).parents('tr')).data();

    }
});

function Refresh() {
    ShowList();
}
function InitButton() {
    $('#btnRefresh').click(function () {
        ShowList();
    });
    $('#btnFilter').click(function () {
        c.ModalShow('#modalFilter', true);
    });
    $('#btnView').click(function () {

        if (TblGridList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }

        Action = 0;
        View(TblGridListDataRow.Id);
        c.SetActiveTab('sectionA');
    });
    $('#btnNewEntry').click(function () {

        Action = 1;
        DefaultDisable();
        DefaultReadOnly();
        DefaultEmpty();
        DefaultValues();
        InitDataTables();
        HandleEnableButtons();
        HandleEnableEntries();
        RedrawGrid();

        c.SetValue('#PositionId', c.GetSelect2Id('#select2Position'));
        c.SetValue('#txtPosition', c.GetSelect2Text('#select2Position'));

    });
    $('#btnCloseFilter').click(function () {
        c.ModalShow('#modalFilter', false);
    });
    
    $('#btnClose').click(function () {

        Action = -1;
        HandleEnableButtons();
        HandleEnableEntries();
        c.ModalShow('#modalEntry', false);

        return;

        var msg = "";
        if (Action == 0) {
            msg = "Are you sure you want to cancel the update?";
        }
        else if (Action == 1) {
            msg = "Are you sure you want to cancel the creation of new entry?";
        }
        else if (Action == 2) {
            msg = "Are you sure you want to cancel updating this entry?";
        }

        var YesFunc = function () {
            Action = -1;
            HandleEnableButtons();
            HandleEnableEntries();
            c.ModalShow('#modalEntry', false);
        };

        var NoFunc = function () {
        };

        c.MessageBoxConfirm("Cancel...", msg, YesFunc, NoFunc);

    });
    $('#btnClear').click(function () {

        var YesFunc = function () {
            Action = 1;
            DefaultEmpty();
            DefaultValues();
            HandleEnableButtons();
            HandleEnableEntries();
        };

        c.MessageBoxConfirm("Clear...", "Are you sure you want to clear the entry?", YesFunc, null);


    });
    $('#btnDelete').click(function () {


        if (DisableCancel_alreadydispatched == 0) {
            var YesFunc = function () {
                Action = 3;
                Save();              
            };

        
            c.MessageBoxConfirm("Delete?", "Are you sure you want to delete this order?", YesFunc);
             }
        else {
            c.MessageBox("Already Dispatched", "You can not cancel whole order..", null);
        }
      
    });
    $('#btnEdit').click(function () {

        c.MessageBox("Not Available...", "You can only edit in WARDS..", null);

        return;

        Action = 2;
        HandleEnableButtons();
        HandleEnableEntries();
    });
    $('#btnSave').click(function () {
        Save();
    });
    $('#btnNew').click(function () {

        var YesFunc = function () {
            Action = 1;
            DefaultDisable();
            DefaultReadOnly();
            DefaultEmpty();
            DefaultValues();
            InitDataTables();
            HandleEnableButtons();
            HandleEnableEntries();
            c.SetActiveTab('sectionA');
        };

        c.MessageBoxConfirm("Create a new one?", "Are you sure you want to clear the current entry and create a new one?", YesFunc, null);

    });

    $('#btnFindClose').click(function () {
        c.ModalShow('#FrmFindDrugs', false);
    });
    $('#btnFindOK').click(function () {
        
        var rowcollection = TblGridSearch.$(".selected", { "page": "all" });
        var ctr;
        rowcollection.each(function (index, elem) {
            var tr = $(elem).closest('tr');
            var row = TblGridSearch.row(tr);
            var rowdata = row.data();

            //rowdata["StatusId"],
            ctr = $(TblGridDrugListId).DataTable().rows().nodes().length + 1;
            TblGridDrugList.row.add({
                "ServiceID": rowdata["id"],
                "SqNo": ctr,
                "DrugName": rowdata["name"],
                "Units": rowdata["Unit"],
                "Quantity": rowdata["Qty"],
                "Remarks": "",
                "UnitId": rowdata["UnitId"]
            }).draw();
            
            InitDrugList();

        });
        RecountList();

        $('#btnFindClose').click();

    });

    $('#btnAddDrug').click(function () {
        c.ModalShow('#FrmFindDrugs', true);
        TblGridSearch.columns.adjust().draw();
    });
    $('#btnRemoveDrug').click(function () {
        if (TblGridDrugList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to be deleted.", null);
            return;
        }

        var YesFunc = function () {
            TblGridDrugList.row('tr.selected').remove().draw(false);            
            c.ReSequenceDataTable(TblGridDrugListId, 1);
            RecountList();
        };

        c.MessageBoxConfirm("Delete...", "Are you sure you want to delete the selected row/s?", YesFunc, null);

    });

    $('#txtSearch').keydown(function (e) {
        if (e.keyCode == 13) {
            e.preventDefault();
            ShowSearch();
        }
        
    });


    
}
function InitICheck() {
    //$('#iChkPending').iCheck({
    //    checkboxClass: 'icheckbox_square-red',
    //    radioClass: 'iradio_square-red'
    //}).on("ifChecked ifUnchecked", function (e) {
    //    var checked = e.type == "ifChecked" ? true : false;
    //}); 

    // $('#iChkPending, #iChkOnHold').iCheck('check');
}
function InitSelect2() {
    $('#select2PIN').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'select2PIN',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    type: 0
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        c.SetSelect2('#select2Name', list[8], list[5]);
        c.SetSelect2('#select2BedNo', list[3], list[4]);
        c.SetSelect2('#select2Doctor', list[6], list[7]);
        FetchPatientDetails(list);
        ShowDrugAllergies(list[8]);

    });
    $('#select2Name').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'select2Name',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    type: 0
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        c.SetSelect2('#select2PIN', list[8], list[2]);
        c.SetSelect2('#select2BedNo', list[3], list[4]);
        c.SetSelect2('#select2Doctor', list[6], list[7]);
        FetchPatientDetails(list);
        ShowDrugAllergies(list[8]);
    });
    $('#select2BedNo').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'select2BedNo',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    type: 0
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        c.SetSelect2('#select2PIN', list[8], list[2]);
        c.SetSelect2('#select2Name', list[8], list[5]);
        c.SetSelect2('#select2Doctor', list[6], list[7]);
        FetchPatientDetails(list);
        ShowDrugAllergies(list[8]);
    });
    $('#select2Doctor').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'select2Doctor',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    type: 0
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;

    });
    $('#select2RequestType').select2({
        data: [{ id: 0, text: 'Normal' }, { id: 1, text: 'Stat' }, { id: 2, text: 'Take Home' }],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added.list;
    });
}
function InitDateTimePicker() {
    //    $('#dtSurgeryDate').datetimepicker({
    //        pickTime: false
    //    }).on("dp.change", function (e) {

    //    });
}
function InitDataTables() {
    //BindSequence([]);
    BindDrugIssue([]);
    BindDrugAllergies([]);
}
function SetupDataTables() {
    // SetupSequence();
    SetupList();
    SetupDrugList();
    SetupSearch();
    SetupDrugList();
}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (TblGridDrugIssue !== undefined) TblGridDrugIssue.columns.adjust().draw();
    if (TblGridDrugAllergies !== undefined) TblGridDrugAllergies.columns.adjust().draw();
    if (TblGridDrugIssue !== undefined) TblGridDrugIssue.columns.adjust().draw();
    if (TblGridDrugList !== undefined) TblGridDrugList.columns.adjust().draw();
    if (TblGridSearch !== undefined) TblGridSearch.columns.adjust().draw();
    
}

function DefaultReadOnly() {
    c.ReadOnly('#txtOrderNo', true);
    c.ReadOnly('#txtDateTime', true);
    c.ReadOnly('#txtOrderBy', true);
    c.ReadOnly('#txtWard', true);
    c.ReadOnly('#txtCompany', true);
    c.ReadOnly('#txtAge', true);
    c.ReadOnly('#txtGender', true);
    c.ReadOnly('#txtBloodGroup', true);    
    c.ReadOnly('#txtDoctorId', true);
}
function DefaultValues() {
    //    c.SetDateTimePicker('#dtSurgeryDate', moment());
    c.SetSelect2('#select2RequestType', '0', 'Normal');
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
}
function DefaultEmpty() {
    c.SetValue('#Id', '');
    c.Select2Clear('#select2PIN');
    c.Select2Clear('#select2Name');
    c.Select2Clear('#select2BedNo');
    c.Select2Clear('#select2Doctor');
    c.SetValue('#txtOrderNo', '');
    c.SetValue('#txtDateTime', '');
    c.SetValue('#txtOrderBy', '');
    c.SetValue('#txtWard', '');
    c.SetValue('#txtCompany', '');
    c.SetValue('#txtAge', '');
    c.SetValue('#txtGender', '');
    c.SetValue('#txtBloodGroup', '');
    c.SetValue('#txtSearch', '');

    BindDrugList([]);
    BindDrugIssue([]);
    BindDrugAllergies([]);
    BindDrugIssue([]);
    BindSearch([]);
}

function Validated() {
    var req = false;


    var station = $('#ListOfStation').val();
 
    if (station == null) {
        c.MessageBoxErr('Error...', 'Please select a station in the upper right.');
        return false;
    }
 
    req = c.IsEmptySelect2('#select2PIN') || 
          c.IsEmptySelect2('#select2Name') ||
          c.IsEmptySelect2('#select2BedNo');
    if (req) {
        c.MessageBoxErr('Required...', 'Patient detail is required');
        return false;
    }
 
    if (Action == 1 && $(TblGridDrugListId).DataTable().rows().nodes().length == 0) {
        c.MessageBoxErr('Required...', 'Drug is required. Please add an item on the list.');
        return false;
    }
   
    var ctr = 1;
    var required = '';
    $.each(TblGridDrugList.rows().data(), function (i, row) {
        if (row.ServiceID.length == 0) {
            required = required + ctr + '.  Select an item for row ' + row.SqNo + '<br>';
            ctr++;
        }
        else if (!$.isNumeric(row.Quantity) || row.Quantity < 1) {
            required = required + ctr + '.  Enter a valid quantity for row ' + row.SqNo + '<br>';
            ctr++;
        }        
    });
    if (required.length > 0) {
        c.MessageBoxErr('Required...', required);
        return false;
    }
   
    return true;
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
    else {
        c.Show('#ButtonsOnBoard', true);
        c.Show('#ButtonsOnEntry', false);
    }

    HandleButtonNotUse();
}
function HandleEnableEntries() {
    // VAED
    if (Action == 0 || Action == 3) { // view or delete
        c.DisableSelect2('#select2PIN', true);
        c.DisableSelect2('#select2Name', true);
        c.DisableSelect2('#select2BedNo', true);

        c.DisableSelect2('#select2RequestType', true);
        c.DisableSelect2('#select2Doctor', true);

        $('#btnRemoveDrug').hide();
        $('#btnAddDrug').hide();
    }
    else if (Action == 1) { // add
        c.DisableSelect2('#select2PIN', false);
        c.DisableSelect2('#select2Name', false);
        c.DisableSelect2('#select2BedNo', false);

        c.DisableSelect2('#select2RequestType', false);
        c.DisableSelect2('#select2Doctor', false);

        $('#btnRemoveDrug').show();
        $('#btnAddDrug').show();
    }
    else if (Action == 2) { // edit    
        c.DisableSelect2('#select2PIN', true);
        c.DisableSelect2('#select2Name', true);
        c.DisableSelect2('#select2BedNo', true);

        c.DisableSelect2('#select2RequestType', false);
        c.DisableSelect2('#select2Doctor', false);

        $('#btnRemoveDrug').show();
        $('#btnAddDrug').show();
    }
    else {
        c.Show('#Entry', false);
        c.Show('#DashBoard', true);
    }

}
function HandleButtonNotUse() {
    $('.NotUse').hide();
}

function Save() {

    var ret = Validated();
    if (!ret) return ret;


    var entry;
    entry = [];
    entry = {};

    entry.Action = Action;
    entry.ID = c.GetValue('#Id');
    entry.CurrentStationID = $("#ListOfStation").val();
    entry.BedID = c.GetSelect2Id('#select2BedNo');
    entry.IPID = c.GetSelect2Id('#select2PIN');
    entry.DoctorID = c.GetSelect2Id('#select2Doctor');
    entry.Istakehome = c.GetSelect2Id('#select2RequestType');

    entry.DrugOrderDetail = [];
    $.each(TblGridDrugList.rows().data(), function (i, row) {
        entry.DrugOrderDetail.push({
            SqNo: row.SqNo,
            ServiceID: row.ServiceID,
            Remarks: row.Remarks,
            Quantity: row.Quantity,
            unitid: row.UnitId,
            OrderID: "",
            dispatchquantity:"", 
            substituteid: "",
            Strength:"", 
            RouteOfAdmin:"", 
            Frequency_ID:"", 
            Duration_ID:"", 
            BeforeAfter: "",            
            Strength_No:"", 
            Duration_No:"",             
            BrandType:""            
        });

        //OrderID, ServiceID, Remarks, dispatchquantity, substituteid
        //, Strength, RouteOfAdmin, Frequency_ID, Duration_ID, BeforeAfter
        //, SqNo, Strength_No, Duration_No, Quantity, BrandType, unitid

    });

   
    $.ajax({
        url: baseURL + 'Save',
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            c.ButtonDisable('#btnSave', true);
        },
        success: function (data) {
            c.ButtonDisable('#btnSave', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                if (Action == 3) {
                    c.Show('#ButtonsOnBoard', true);
                    c.Show('#ButtonsOnEntry', false);
                    c.Show('#DashBoard', true);
                    c.Show('#Entry', false);
                    TblGridList.row('tr.selected').remove().draw(false);
                    return;
                }

                Action = 0;
                HandleEnableButtons();
                HandleEnableEntries();
            };

            c.MessageBox(data.Title, data.Message, OkFunc);

            var s = data.Message;
            var on = s.split(':');
            c.SetValue('#txtOrderNo', on[1]);

        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#btnSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

    return ret;
}
function View(Id) {
    Url = baseURL + "ShowSelected";
    param = {
        Id: Id
    };

    $('#preloader').show();
    $('.Hide').hide();

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
            $('.Show').show();

            if (data.list.length == 0) {
                Action = 1;
                HandleEnableButtons();
                HandleEnableEntries();
                RedrawGrid();
                return;
            }

            Action = 0;

            var data = data.list[0];

            DefaultEmpty();

            c.SetValue('#Id', data.ID);

            if (data.InpatientDetails.length > 0) {
                c.SetSelect2('#select2PIN', data.InpatientDetails[0].IPID, data.InpatientDetails[0].PIN);
                c.SetSelect2('#select2Name', data.InpatientDetails[0].IPID, data.InpatientDetails[0].PatientName);
                c.SetSelect2('#select2BedNo', data.BedID, data.BedName);
                c.SetSelect2('#select2Doctor', data.InpatientDetails[0].DoctorId, data.InpatientDetails[0].Doctor);
                c.SetValue('#txtWard', data.InpatientDetails[0].Ward);
                c.SetValue('#txtCompany', data.InpatientDetails[0].Company);
                c.SetValue('#txtAge', data.InpatientDetails[0].Age);
                c.SetValue('#txtGender', data.InpatientDetails[0].Sex);
                c.SetValue('#txtBloodGroup', data.InpatientDetails[0].BloodGroup);
            }

            c.SetSelect2('#select2RequestType', data.ISTAKEHOME, data.RequestType);
            c.SetValue('#txtOrderNo', TblGridListDataRow.OrderNo);
            c.SetValue('#txtDateTime', TblGridListDataRow.datetime);
            c.SetValue('#txtOrderBy', data.OperatorName);

            BindDrugList(data.DrugList);
            BindDrugAllergies(data.DrugAllergies);
            BindDrugIssue(data.IssuedDrugs);

            HandleEnableButtons();
            HandleEnableEntries();
            RedrawGrid();

        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}


function ShowListColumns() {
    var cols = [
    { targets: [0], data: "Id", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "OrderNo", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [2], data: "IPID", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [3], data: "PIN", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [4], data: "PatientName", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [5], data: "Bed", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [6], data: "datetime", className: '', visible: true, searchable: false, width: "8%" },
    { targets: [7], data: "stationslno", className: '', visible: false, searchable: true, width: "5%" },
    { targets: [8], data: "prefix", className: '', visible: false, searchable: true, width: "5%" },
    { targets: [9], data: "Operator", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [10], data: "Dispatched", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [11], data: "Station", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [12], data: "Acknowledged", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [13], data: "operatorid", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [14], data: "DocName", className: '', visible: true, searchable: true, width: "20%" }
    ];
    return cols;
}
function ShowListRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['Dispatched'];
        var $nRow = $(nRow);
        if (value == 1) { // new
            $nRow.css({ "background-color": "#fcc9c9" })
        }
        else if (value == 3) { // Received
            $nRow.css({ "background-color": "#aaffc8" })
        }

    };
    return rc;
}
function SetupList() {
    $.editable.addInputType('select2Status', {
        element: function (settings, original) {
            var input = $('<input id="select2Status" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#select2Status').select2({
                minimumResultsForSearch: -1,
                minimumInputLength: 0,
                allowClear: true,
                data: [
                    { id: 0, text: '' },
                    { id: 1, text: 'Approved' },
                    { id: 2, text: 'Rejected' },
                    { id: 3, text: 'OnHold' }
                ]
            }).on("select2-blur", function () {
                $("#select2Status").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#select2Status").closest('form').submit(); }
                else { $("#select2Status").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#select2Status').val();
                $("#select2Status").select2("data", { id: a, text: a });
            }).data('select2');

            select2.onSelect = (function (fn) {
                return function (data, options) {
                    var target;
                    if (options != null) {
                        target = $(options.target);
                    }
                    Select2IsClicked = true;
                    return fn.apply(this, arguments);
                }
            })(select2.onSelect);


        },
        submit: function (settings, original) {
            if ($("#select2Status", this).select2('val') != null && $("#select2Status", this).select2('val') != '') {
                $("input", this).val($("#select2Status", this).select2("data").text);

            }
        }
    });
}
function InitList() {
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassSelect2Status', TblGridList.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridList.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#select2Status');
        TblGridList.cell(cell.row, 1).data(id);
        TblGridList.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'select2Status', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    // Resize all rows.
    $(TblGridListId + ' tr').addClass('trclass');
}
function ShowList() {
    var Url = baseURL + "ShowList";
    var stationid = $("#ListOfStation").val();
    var param = {
        CurrentStationID: stationid == null ? 0 : stationid
    };

    $('#preloader').show();
    $("#grid").css("visibility", "hidden");

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
            BindList(data.list);
            $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindList(data) {
    //TblGridList = $(TblGridListId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowListColumns(),
    //    bAutoWidth: false,
    //    scrollY: 450,
    //    scrollX: true,
    //    fnRowCallback: ShowListRowCallBack(),
    //    iDisplayLength: 25
    //});
    TblGridList = $(TblGridListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 420,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        fnRowCallback: ShowListRowCallBack(),
        columns: ShowListColumns()

    });


    //InitList();
}

function SetupDrugList() {
    $.editable.addInputType('txtDrugQty', {
        element: function (settings, original) {

            var input = $('<input id="txtDrugQty" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        }
    });
    $.editable.addInputType('txtRemarks', {
        element: function (settings, original) {

            var input = $('<input id="txtRemarks" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        }
    });
}
function InitDrugList() {
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassTxtDrugQty', TblGridDrugList.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridDrugList.cell($(this).closest('td')).index();
        TblGridDrugList.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'txtDrugQty', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassTxtRemarks', TblGridDrugList.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridDrugList.cell($(this).closest('td')).index();
        TblGridDrugList.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'txtRemarks', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    // Resize all rows.
    $(TblGridDrugListId + ' tr').addClass('trclass');
}
function ShowDrugListColumns() {

    var cols = [
    { targets: [0], data: "ServiceID", className: '', visible: false, searchable: false, width: "3%" },
    { targets: [1], data: "SqNo", className: '', visible: true, searchable: false, width: "1%" },
    { targets: [2], data: "DrugName", className: '', visible: true, searchable: false, width: "15%" },
    { targets: [3], data: "Units", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [4], data: "Quantity", className: 'ClassTxtDrugQty column-input', visible: true, searchable: false, width: "3%" },
    { targets: [5], data: "Remarks", className: 'ClassTxtRemarks column-input', visible: true, searchable: true, width: "15%" },
    { targets: [6], data: "UnitId", className: '', visible: false, searchable: true, width: "3%" }
    ];
    return cols;
}
function BindDrugList(data) {
    //TblGridDrugList = $(TblGridDrugListId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: false,
    //    ordering: false,
    //    info: false,
    //    columns: ShowDrugListColumns(),
    //    bAutoWidth: false,
    //    scrollY: 300,
    //    scrollX: true
    //    //fnRowCallback: ShowListRowCallBack(),
    //    //iDisplayLength: 25
    //});
    TblGridDrugList = $(TblGridDrugListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 200,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        //iDisplayLength: 25,
        //fnRowCallback: ShowListRowCallBack(),
        columns: ShowDrugListColumns()
    });


    InitDrugList();
    c.SetBadgeText('#badgeDrug', $(TblGridDrugListId).DataTable().rows().nodes().length);
}

function ShowDrugIssueColumns() {

    var cols = [
    { targets: [0], data: "ctr", className: '', visible: true, searchable: false, width: "2%" },
    { targets: [1], data: "DrugName", className: '', visible: true, searchable: true, width: "20%" },
    { targets: [2], data: "Units", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [3], data: "DispatchQuantity", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [4], data: "SubDrugName", className: '', visible: true, searchable: true, width: "30%" },
    { targets: [5], data: "remarks", className: '', visible: true, searchable: true, width: "15%" }
    ];
    return cols;
}
function BindDrugIssue(data) {
    DisableCancel_alreadydispatched = (data.length !== 0 ? 1 : 0);
   

    TblGridDrugIssue = $(TblGridDrugIssueId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: false,
        ordering: false,
        info: false,
        columns: ShowDrugIssueColumns(),
        bAutoWidth: false,
        scrollY: 200,
        scrollX: true
        //fnRowCallback: ShowListRowCallBack(),
        //iDisplayLength: 25
    });

    c.SetBadgeText('#badgeIssueDrug', $(TblGridDrugIssueId).DataTable().rows().nodes().length);
}

function ShowDrugAllergiesColumns() {
    var cols = [
    { targets: [0], data: "ID", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "ctr", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [2], data: "Name", className: '', visible: true, searchable: true, width: "90%" }
    ];
    return cols;
}
function ShowDrugAllergies(id) {
    var Url = baseURL + "DrugAllergiesList";
        var param = {
            IPID: id
        };

    $('#preloader').show();
    $("#grid").css("visibility", "hidden");

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
            BindDrugAllergies(data.list);
            $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindDrugAllergies(data) {
    //TblGridDrugAllergies = $(TblGridDrugAllergiesId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: false,
    //    ordering: false,
    //    info: false,
    //    columns: ShowDrugAllergiesColumns(),
    //    bAutoWidth: false,
    //    scrollY: 200,
    //    scrollX: true
    //    //fnRowCallback: ShowListRowCallBack(),
    //    //iDisplayLength: 25
    //});
    TblGridDrugAllergies = $(TblGridDrugAllergiesId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 200,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        //iDisplayLength: 25,
        //fnRowCallback: ShowListRowCallBack(),
        columns: ShowDrugAllergiesColumns()
    });

    c.SetBadgeText('#badgeDrugAllergy', $(TblGridDrugAllergiesId).DataTable().rows().nodes().length);
}

function SetupSearch() {
    $.editable.addInputType('txtQty', {
        element: function (settings, original) {

            var input = $('<input id="txtQty" type="number"  style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        }
    });
}
function InitSearch() {
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassTxtQty', TblGridSearch.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridSearch.cell($(this).closest('td')).index();
        TblGridSearch.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'txtQty', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    // Resize all rows.
    $(TblGridSearchId + ' tr').addClass('trclass');
}
function ShowSearchColumns() {

    var cols = [
    { targets: [0], data: "id", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "code", className: '', visible: true, searchable: false, width: "3%" },
    { targets: [2], data: "name", className: '', visible: true, searchable: false, width: "20%" },
    { targets: [3], data: "Unit", className: '', visible: true, searchable: false, width: "5%" },
    { targets: [4], data: "Qty", className: 'ClassTxtQty', visible: true, searchable: false, width: "5%" },
    { targets: [5], data: "UnitId", className: '', visible: false, searchable: false, width: "5%" }
    ];
    return cols;
}
function ShowSearch() {
    var Url = baseURL + "SearchDrugs";
    var searchItem = c.GetValue('#txtSearch');
    if (searchItem.length == 0) return;
    var param = {
        search: searchItem
    };

    $('.loading').show();

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
            BindSearch(data.list);
            $('.loading').hide();
        },
        error: function (xhr, desc, err) {
            $('.loading').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindSearch(data) {
    //TblGridSearch = $(TblGridSearchId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: false,
    //    columns: ShowSearchColumns(),
    //    bAutoWidth: false,
    //    scrollY: 400,
    //    scrollX: true,
    //    //fnRowCallback: ShowListRowCallBack(),
    //    iDisplayLength: 25
    //});
    TblGridSearch = $(TblGridSearchId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 400,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        //iDisplayLength: 25,
        //fnRowCallback: ShowListRowCallBack(),
        columns: ShowSearchColumns()
    });

    InitSearch();
}


function RecountList() {
    c.SetBadgeText('#badgeDrug', $(TblGridDrugListId).DataTable().rows().nodes().length);
    c.SetBadgeText('#badgeIssueDrug', $(TblGridDrugIssueId).DataTable().rows().nodes().length);
    c.SetBadgeText('#badgeDrugAllergy', $(TblGridDrugAllergiesId).DataTable().rows().nodes().length);
}

function FetchPatientDetails(list) {
    c.SetValue('#txtWard', list[9]);
    c.SetValue('#txtAge', list[12]);
    c.SetValue('#txtGender', list[13]);
    c.SetValue('#txtDoctorId', list[6]);
    c.SetValue('#txtPackage', list[10]);
    c.SetValue('#txtBloodGroup', list[14]);
    c.SetValue('#txtCompany', list[11]);
}

