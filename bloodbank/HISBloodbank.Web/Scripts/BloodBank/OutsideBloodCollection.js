var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridSubCenter;
var TblGridSubCenterId = "#gridSubCenterIssue";
var TblGridSubCenterDataRow;

$(document).ready(function () {

    c.SetTitle("Outside Blood Collection");
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

    ShowList(-1);

});
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // for future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();

    RedrawGrid();
})
$(document).on("click", TblGridListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected');

        TblGridListDataRow = TblGridList.row($(this).parents('tr')).data();

    }
});
$(document).on("dblclick", TblGridListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        $('#btnView').click();

    }
});

$(document).on("keypress", "#txtGetPage", function (e) {
    if (e.which == 13) {
        $('#btnViewFilter').click();
    }
});
$(document).on("keypress", "#txtPIN", function (e) {
    if (e.which == 13) {
        FindPatient();
    }
});


function InitButton() {
    $('#btnRefresh').click(function () {
        //ShowList(-1);
        $('#btnViewFilter').click();
    });
    $('#btnFilter').click(function () {
        c.ModalShow('#modalFilter', true);
    });
    $('#btnView').click(function () {

        if (TblGridList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }

        var id = TblGridListDataRow.id;
        Action = 0;
        View(id);
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
        $('#txtPIN').focus();
    });
    $('#btnCloseFilter').click(function () {
        c.ModalShow('#modalFilter', false);
    });
    $('#btnViewFilter').click(function () {
        var RowsPerPage = c.GetValue('#txtRowsPerPage');
        var GetPage = c.GetValue('#txtGetPage');
        if (RowsPerPage.length == 0) {
            c.MessageBoxErr("Required...", "Please enter value for rows per page.");
            return;
        }
        else if (GetPage.length == 0) {
            c.MessageBoxErr("Required...", "Please enter value for get page.");
            return;
        }

        ShowList(-1);
        c.ModalShow('#modalFilter', false);

    });

    $('#btnClose').click(function () {

        Action = -1;
        HandleEnableButtons();
        HandleEnableEntries();
        RedrawGrid();
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
            $('#txtPIN').focus();
        };

        c.MessageBoxConfirm("Clear...", "Are you sure you want to clear the entry?", YesFunc, null);


    });
    $('#btnDelete').click(function () {

        var YesFunc = function () {
            Action = 3;
            Save();
        };

        var NoFunc = function () {
        };

        c.MessageBoxConfirm("Delete?", "Are you sure you want to delete this entry?", YesFunc, NoFunc);

    });
    $('#btnEdit').click(function () {
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
            $('#txtPIN').focus();
        };

        c.MessageBoxConfirm("Create a new one?", "Are you sure you want to clear the current entry and create a new one?", YesFunc, null);

    });

    $('#btnAddSurgery').click(function () {
        var ctr = $(TblGridSurgeryId).DataTable().rows().nodes().length + 1;
        TblGridSurgery.row.add({
            "id": "",
            "No": ctr,
            "name": "",
            "Count": "1"
        }).draw();
        InitSelectedSurgery();
    });
    $('#btnRemoveSurgery').click(function () {

        if (TblGridSurgery.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to be deleted.", null);
            return;
        }

        var YesFunc = function () {
            TblGridSurgery.row('tr.selected').remove().draw(false);
        };

        c.MessageBoxConfirm("Delete...", "Are you sure you want to delete the selected row/s?", YesFunc, null);

    });

}
function InitICheck() {
    $('#iChkCompleted').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
}
function InitSelect2() {
    $('#select2BloodGroup').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2OutsideBloodCollectionBloodGroup',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        DisableDefault(false);
    });
    $('#select2HospitalName').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2OutsideBloodCollectionIssueHospital',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        ShowSubCenter(list[0]);
    });
    $('#select2ScreeningResult').select2({
        containerCssClass: "RequiredField",
        data: [
            { id: 0, text: 'Negative' },
            { id: 1, text: 'Positive' }
        ],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;


    });
    $('#select2TypeOfBlood').select2({
        containerCssClass: "RequiredField",
        data: [
            { id: 0, text: 'Whole Blood' },
            { id: 1, text: 'Component' },
            { id: 2, text: 'SDPLR' }
        ],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
        c.SetSelect2('#select2TypeOfBloodValue', '', '');
        c.SetSelect2('#select2BloodGroupE', '', '');

        if (list.id==1) {
            $('.hideqty').hide();
            c.SetSelect2('#select2Quantity', '', '');
        }
        else {
            $('.hideqty').show();
        }
    });
    $('#select2BloodGroupE').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2OutsideBloodCollectionBloodGroupE',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    componentid: c.GetSelect2Id('#select2TypeOfBloodValue'),
                    bloodgroopid: c.GetSelect2Id('#select2BloodGroup')
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        c.DisableSelect2('#select2HospitalName', false);
        c.DisableSelect2('#select2Quantity', false);
        c.DisableSelect2('#select2ScreeningResult', false);

        c.Disable('#txtOutsideBagNo', false);
        c.DisableDateTimePicker('#dtCollectionDate', false);
        c.DisableDateTimePicker('#dtExpiryDate', false);
        c.iCheckDisable('#iChkCompleted', false);
    });
    $('#select2TypeOfBloodValue').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetComponentByType',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    Id: c.GetSelect2Id('#select2TypeOfBlood')
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        c.SetSelect2('#select2BloodGroupE', '', '');
        c.DisableSelect2('#select2BloodGroupE', false);
    });
    $('#select2Quantity').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2BBBagQty',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    Id: c.GetSelect2Id('#select2TypeOfBlood')
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
    
}
function InitDateTimePicker() {
    $('#dtToday').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtCollectionDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtExpiryDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
}
function InitDataTables() {
    BindSubCenter([]);
}
function SetupDataTables() {
    //    SetupSelectedSurgery();
}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (TblGridList !== undefined) TblGridList.columns.adjust().draw();
    if (TblGridSubCenter !== undefined) TblGridSubCenter.columns.adjust().draw();

}

function DefaultReadOnly() {
    //c.ReadOnly('#txtCreatedDateTime', true);
    c.ReadOnly('#txtPatientName', true);
    c.ReadOnly('#txtAge', true);
    c.ReadOnly('#txtGender', true);
    c.ReadOnly('#txtSlNo', true);
    c.ReadOnly('#txtDateTime', true);
    c.ReadOnly('#txtOperator', true);
}
function DefaultValues() {
    c.SetValue('#Id', "0");
    c.SetDateTimePicker('#dtCollectionDate', moment());
    c.SetDateTimePicker('#dtExpiryDate', moment());
    c.SetDateTimePicker('#dtToday', moment());
    c.SetValue('#txtRowsPerPage', 500);
    c.SetValue('#txtGetPage', 1);
    c.SetSelect2('#select2TypeOfBlood', "0", 'Whole Blood');
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
    c.DisableSelect2('#select2BloodGroup', true);
    DisableDefault(true);
}
function DefaultEmpty() {
    c.SetValue('#Id', '');
       
    c.SetValue('#txtPIN', '');
    c.SetValue('#txtSlNo', '');
    c.SetValue('#txtPatientName', '');
    c.SetValue('#txtDateTime', '');
    c.SetValue('#txtAge', '');
    c.SetValue('#txtOperator', '');
    c.SetValue('#txtGender', '');
    c.ClearSelect2('#select2BloodGroup');

    c.ClearSelect2('#select2TypeOfBlood');
    c.ClearSelect2('#select2TypeOfBloodValue');
    c.ClearSelect2('#select2BloodGroupE');
    c.ClearSelect2('#select2HospitalName');
    c.ClearSelect2('#select2Quantity');
    c.ClearSelect2('#select2ScreeningResult');
    c.SetValue('#txtOutsideBagNo', '');

    c.SetDateTimePicker('#dtCollectionDate', '');
    c.SetDateTimePicker('#dtExpiryDate', '');

    c.iCheckSet('#iChkCompleted', false);

    BindSubCenter([]);
}
function DisableDefault(flag) {
    c.DisableSelect2('#select2TypeOfBlood', flag);
    c.DisableSelect2('#select2TypeOfBloodValue', flag);
    //c.DisableSelect2('#select2BloodGroupE', flag);
    //c.DisableSelect2('#select2HospitalName', flag);
    //c.DisableSelect2('#select2Quantity', flag);
    //c.DisableSelect2('#select2ScreeningResult', flag);
    
    //c.Disable('#txtOutsideBagNo', flag);
    //c.DisableDateTimePicker('#dtCollectionDate', flag);
    //c.DisableDateTimePicker('#dtExpiryDate', flag);
    //c.iCheckDisable('#iChkCompleted', flag);
}


function Validated() {
    var req = false;

    req = c.IsEmptyById('#txtPIN');
    if (req) {
        c.MessageBoxErr('Required...', 'PIN is required.');
        return false;
    }
    req = c.IsEmptySelect2('#select2BloodGroup');
    if (req) {
        c.MessageBoxErr('Required...', 'Blood Group I is required.');
        return false;
    }    
    req = c.IsEmptySelect2('#select2TypeOfBlood');
    if (req) {
        c.MessageBoxErr('Required...', 'Type of Blood is required.');
        return false;
    }
    req = c.IsEmptySelect2('#select2TypeOfBloodValue');
    if (req) {
        c.MessageBoxErr('Required...', 'Type Of Blood Value is required.');
        return false;
    }
    req = c.IsEmptySelect2('#select2BloodGroupE');
    if (req) {
        c.MessageBoxErr('Required...', 'Blood Group II is required.');
        return false;
    }
    req = c.IsDateEmpty('#dtCollectionDate');
    if (req) {
        c.MessageBoxErr('Required...', 'Collection Date is required.');
        return false;
    }
    req = c.IsDateEmpty('#dtExpiryDate');
    if (req) {
        c.MessageBoxErr('Required...', 'Expiry Date is required.');
        return false;
    }
    req = c.IsEmptySelect2('#select2HospitalName');
    if (req) {
        c.MessageBoxErr('Required...', 'Hospital Name is required.');
        return false;
    }

  //$('#select2TypeOfBlood').select2({
  //      data: [
  //          { id: 0, text: 'Whole Blood' },
  //          { id: 1, text: 'Component' },
  //          { id: 2, text: 'SDPLR' }
    req = c.IsEmptySelect2('#select2Quantity') && c.GetSelect2Id('#select2TypeOfBlood')!==1;
    if (req) {
        c.MessageBoxErr('Required...', 'Quantity (ml) is required.');
        return false;
    }
    req = c.IsEmptySelect2('#select2ScreeningResult');
    if (req) {
        c.MessageBoxErr('Required...', 'Screening Result is required.');
        return false;
    }
    

    var from = c.GetDateTimePickerDate('#dtExpiryDate');
    var today = c.GetDateTimePickerDate('#dtToday');
    var ex = c.DateDiffDays(today, from);
    if (ex <= 1) {
        c.MessageBoxErr('Required...', 'Expiry Date cannot be less than or equal to the present day.');
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
        c.DisableSelect2('#select2TypeOfBlood', true);
        c.DisableSelect2('#select2TypeOfBloodValue', true);
        c.DisableSelect2('#select2BloodGroupE', true);
        c.DisableSelect2('#select2HospitalName', true);
        c.DisableSelect2('#select2Quantity', true);
        c.DisableSelect2('#select2ScreeningResult', true);
        c.DisableSelect2('#select2BloodGroup', true);

        c.Disable('#txtPIN', true);
        c.Disable('#txtOutsideBagNo', true);
        c.DisableDateTimePicker('#dtCollectionDate', true);
        c.DisableDateTimePicker('#dtExpiryDate', true);
        c.iCheckDisable('#iChkCompleted', true);
    }
    else if (Action == 1 || Action == 2) { // add or edit
        c.DisableSelect2('#select2TypeOfBlood', true);
        c.DisableSelect2('#select2TypeOfBloodValue', true);
        c.DisableSelect2('#select2BloodGroupE', true);
        c.DisableSelect2('#select2HospitalName', true);
        c.DisableSelect2('#select2Quantity', true);
        c.DisableSelect2('#select2ScreeningResult', true);
        c.DisableSelect2('#select2BloodGroup', true);

        c.Disable('#txtPIN', false);
        c.Disable('#txtOutsideBagNo', true);
        c.DisableDateTimePicker('#dtCollectionDate', true);
        c.DisableDateTimePicker('#dtExpiryDate', true);
        c.iCheckDisable('#iChkCompleted', true);
        DisableDefault(true);
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

    c.ButtonDisable('#btnSave', true);

    var entry;
    entry = [];
    entry = {};
    entry.Action = Action;
    
    entry.Id = c.GetValue('#Id');

    //var i = c.GetValue('#Id');
    
    //var param = {
    //    Action: Action,
    //    Id: parseInt(i)
    //};

    //fire = {
    //    entry: param
    //};

    entry.Bagnumber = c.GetValue('#txtOutsideBagNo');
    entry.Coldate = c.GetDateTimePickerDate('#dtCollectionDate');
    entry.ExpiryDate = c.GetDateTimePickerDate('#dtExpiryDate');
    entry.Tvolume = c.GetSelect2Text('#select2Quantity');
    entry.Cvolume = c.GetSelect2Text('#select2Quantity');
    entry.Bloodgroup = c.GetSelect2Id('#select2BloodGroupE');
    entry.ScreenValue = c.GetSelect2Id('#select2ScreeningResult');

    entry.BloodCollectionIssuesD = [];
    var rowcollection = TblGridSubCenter.$("#chkCrossMatchtype:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = TblGridSubCenter.row(tr);
        var rowdata = row.data();

        entry.BloodCollectionIssuesD.push({
            Hospitalid: c.GetSelect2Id('#select2HospitalName'),
            Collectionbag: c.GetValue('#txtOutsideBagNo'),
            Issuebag: rowdata["name"],
            Issueid: rowdata["id"]
        });
    });


    var type1 = c.GetSelect2Id('#select2TypeOfBlood');

    entry.OutsideBagsCollectionD = [];
    entry.OutsideBagsCollectionD.push({
        cdatetime: c.GetDateTimePickerDate('#dtCollectionDate'),
        bloodgroup: c.GetSelect2Id('#select2BloodGroupE'),
        purchasebagnumber: c.GetValue('#txtOutsideBagNo'),
        screenvalue: c.GetSelect2Id('#select2ScreeningResult'),
        expirydatetime: c.GetDateTimePickerDate('#dtExpiryDate'),
        hospitalid: c.GetSelect2Id('#select2HospitalName'),
        type: type1 == 0 ? false : true,
        componentid: c.GetSelect2Id('#select2TypeOfBlood'),
        Quantity: c.GetSelect2Id('#select2Quantity'),
        screenbagnumber: c.GetValue('#txtOutsideBagNo'),
        RegistrationNo: c.GetValue('#registrationno'),
        pBloodgroup: c.GetSelect2Id('#select2BloodGroup')
    });
    
    //alert(JSON.stringify(entry));

    $.ajax({
        url: baseURL + 'Save1',
        data: JSON.stringify(entry),
        //dataType: 'json',
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
        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#btnSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });


    return ret;
}
function View(id) {
    var Url = baseURL + "ShowSelected";
    var param = { Id: id };

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
                c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
                TblGridList.row('tr.selected').remove().draw(false);
                RedrawGrid();
                return;
            }

            var data = data.list[0];

            c.SetValue('#Id', data.id);

            c.SetValue('#txtPIN', data.PIN);
            c.SetValue('#txtSlNo', data.id);
            c.SetValue('#txtPatientName', data.PatientName);
            c.SetValue('#txtDateTime', data.DateTimeD);
            c.SetValue('#txtAge', data.Age);
            c.SetValue('#txtOperator', data.OperatorName);
            c.SetValue('#txtGender', data.Gender);
            c.SetSelect2('#select2BloodGroup', data.pBloodgroup, data.BloodGroupName);
            c.SetValue('#txtOutsideBagNo', data.purchasebagnumber);
            
            c.SetSelect2('#select2TypeOfBlood', data.type ? 1:0, data.TypeName);
            c.SetSelect2('#select2TypeOfBloodValue', data.componentid, data.ComponentName);
            c.SetSelect2('#select2BloodGroupE', data.bloodgroup, data.BloodGroupName1);

            c.SetSelect2('#select2HospitalName', data.hospitalid, data.hospitalname);
            c.SetSelect2('#select2Quantity', data.Quantity, data.QuantityName);
            
            c.SetSelect2('#select2ScreeningResult', data.screenvalue, data.screenvalue == 1 ? 'Positive' : 'Negative');
            
            c.SetDateTimePicker('#dtCollectionDate', data.collectiondatetimeD);
            c.SetDateTimePicker('#dtExpiryDate', data.expirydatetimeD);

            c.iCheckSet('#iChkCompleted', false);

            // if component
            if (data.type) {
                $('.hideqty').hide();
                c.SetSelect2('#select2Quantity', '', '');
            }
            else {
                $('.hideqty').show();
            }

            BindSubCenter(data.GetSubcenterIssuesByHospList);

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
function FindPatient() {
    var Url = baseURL + "FindPatientDetails";
    var param = { registrationno: c.GetValue('#txtPIN') };

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
                DefaultEmpty();
                DefaultValues();
                HandleEnableButtons();
                HandleEnableEntries();
                return;
            }

            var data = data.list[0];
            
            c.SetValue('#txtPIN', data.PIN);            
            c.SetValue('#txtPatientName', data.name);            
            c.SetValue('#txtAge', data.Age);
            c.SetValue('#txtGender', data.Gender);
            c.SetValue('#registrationno', data.registrationno);
            c.DisableSelect2('#select2BloodGroup', false);

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
    { targets: [0], data: "ctr", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [1], data: "W", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [2], data: "id", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [3], data: "hospitalname", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [4], data: "DateTimeD", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [5], data: "purchasebagnumber", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [6], data: "OperatorName", className: '', visible: true, searchable: true, width: "0%" }
    ];
    return cols;
}
function ShowListRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowList(id) {
    var Url = baseURL + "ShowList";
    var param = {
        Id: id,
        RowsPerPage: c.GetValue('#txtRowsPerPage'),
        GetPage: c.GetValue('#txtGetPage')
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
    TblGridList = $(TblGridListId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: true,
        searching: true,
        ordering: false,
        info: true,
        columns: ShowListColumns(),
        bAutoWidth: false,
        scrollY: 550,
        scrollX: true,
        fnRowCallback: ShowListRowCallBack(),
        iDisplayLength: 25
    });
}

function ShowSubCenterRowCallBack() {
    //ctr = 1;
    var rc = function (nRow, aData) {
        //var value = aData['sampleid'];
        var $nRow = $(nRow);
        if (aData.isChk.length != 0) {
            $('#chkCrossMatchtype', nRow).prop('checked', aData.isChk == 1);
            //$('td:eq(0)', nRow).html(ctr.toString());
            //ctr++;
        }
    };
    return rc;
}
function ShowSubCenterColumns() {
    var cols = [
//    { targets: [0], data: "", className: '', visible: true, searchable: false, width: "10%", defaultContent: '<input type="checkbox" id="chkCrossMatchtype" DISABLED />' },
    { targets: [0], data: "", className: '', visible: true, searchable: false, width: "10%", defaultContent: '<input type="checkbox" id="chkCrossMatchtype"/>' },
    { targets: [1], data: "isChk", className: 'cAR-align-center', visible: false, searchable: false, width: "0%" },
    { targets: [2], data: "name", className: '', visible: true, searchable: true, width: "90%" },
    { targets: [3], data: "id", className: '', visible: false, searchable: false, width: "0%" }
    ];
    return cols;
}
function ShowSubCenter(Id) {
    var Url = baseURL + "GetSubcenterIssuesByHosp";
        var param = {
            Hospitalid: Id
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
            BindSubCenter(data.list);
            $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindSubCenter(data) {
    TblGridSubCenter = $(TblGridSubCenterId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        columns: ShowSubCenterColumns(),
        bAutoWidth: false,
        scrollY: 200,
        scrollX: true,
        fnRowCallback: ShowSubCenterRowCallBack(),
        iDisplayLength: 25
    });

    //InitSelected();
}

