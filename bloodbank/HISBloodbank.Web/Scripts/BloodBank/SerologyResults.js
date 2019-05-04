var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridSubCenter;
var TblGridSubCenterId = "#gridSubCenterIssue";
var TblGridSubCenterDataRow;

var datas = [
            { id: 'negative', text: 'Negative' },
            { id: 'positive', text: 'Positive' },
            { id: 'reactive', text: 'Reactive' }
];

$(document).ready(function () {

   // c.SetTitle("Serology Result");
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
        location.reload();
        //$('#btnViewFilter').click();
    });
    $('#btnFilter').click(function () {
        c.ModalShow('#modalFilter', true);
    });
    $('#btnView').click(function () {

        if (TblGridList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }

        var id = TblGridListDataRow.Donorreg;
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
        c.ButtonDisable('#btnSave', false);

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
        location.reload();
        //Action = -1;
        //HandleEnableButtons();
        //HandleEnableEntries();
        //RedrawGrid();
        //c.ModalShow('#modalEntry', false);

        //return;

        //var msg = "";
        //if (Action == 0) {
        //    msg = "Are you sure you want to cancel the update?";
        //}
        //else if (Action == 1) {
        //    msg = "Are you sure you want to cancel the creation of new entry?";
        //}
        //else if (Action == 2) {
        //    msg = "Are you sure you want to cancel updating this entry?";
        //}

        //var YesFunc = function () {
        //    Action = -1;
        //    HandleEnableButtons();
        //    HandleEnableEntries();
        //    c.ModalShow('#modalEntry', false);
        //};

        //var NoFunc = function () {
        //};

        //c.MessageBoxConfirm("Cancel...", msg, YesFunc, NoFunc);

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
            Delete();
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
    $('#iChkHBcAb1').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
    $('#iChkHBsAg1').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
    $('#iChkHCVAb1').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
    $('#iChkHIVAgAb1').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
    $('#iChkHTLVAbIII1').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
    $('#iChkVDRL1').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
    //----------------------------------------------------------------------------------------
    $('#iChkHBcAb2').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
    $('#iChkHBsAg2').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
    $('#iChkHCVAb2').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
    $('#iChkHIVAgAb2    ').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
    $('#iChkHTLVAbIII2').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
    $('#iChkVDRL2').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
}
function InitSelect2() {

    $('#select2StatHBcAb1').select2({
        containerCssClass: "",
        data: datas,
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
    });
    $('#select2StatHBsAg1').select2({
        containerCssClass: "",
        data: datas,
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
    });
    $('#select2StatHCVAb1').select2({
        containerCssClass: "",
        data: datas,
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
    });
    $('#select2StatHIVAgAb1').select2({
        containerCssClass: "",
        data: datas,
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
    });
    $('#select2StatHTLVAbIII1').select2({
        containerCssClass: "",
        data: datas,
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
    });
    $('#select2StatVDRL1').select2({
        containerCssClass: "",
        data: datas,
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
    });
    //--------------------------------------------------------------------------------------
    $('#select2StatHBcAb2').select2({
        containerCssClass: "",
        data: datas,
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
    });
    $('#select2StatHBsAg2').select2({
        containerCssClass: "",
        data: datas,
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
    });
    $('#select2StatHCVAb2').select2({
        containerCssClass: "",
        data: datas,
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
    });
    $('#select2StatHIVAgAb2').select2({
        containerCssClass: "",
        data: datas,
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
    });
    $('#select2StatHTLVAbIII2').select2({
        containerCssClass: "",
        data: datas,
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
    });
    $('#select2StatVDRL2').select2({
        containerCssClass: "",
        data: datas,
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;
    });



    $('#txtDonorReg').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2DonorRegList',
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
        var val = e.val;
        console.log(val);
       
        var param = { donorreg: val };
    
        c.SetValue('#DonorRegID', val);
  
        var Url = baseURL + "DonorRegList";
     ajaxWrapper.Get(Url, param, function (x, e) {

         var data = x.list[0];
         console.log(data);
         c.SetValue('#txtDonorReg', data.donorregistrationno);
         c.SetValue('#txtName', data.name);
         c.SetValue('#txtAge', data.age);
         c.SetValue('#txtIQama', data.iqama);
         c.SetValue('#txtGender', data.sex);
         c.SetDateTimePicker('#dtDonorSampleDate', data.datetime);

         /*  
     
         name	    testid	Id
         HBc Ab	    291	    128
         HBs Ag	    309	    2
         HCV Ab	    293	    4
         HIV Ag/Ab	319	    1
         HTLVAb I&II 1059	64
         V.D.R.L	325	    8
          */

         if (data.ScreenResultValue.length > 0) {

             $.each(data.ScreenResultValue, function (i, val) {

                 var testdata = val;
                 console.log(testdata);
                 if (testdata.tempid == 128) {
                     c.iCheckSet('#iChkHBcAb1', true);
                     
                 }

                 if (testdata.tempid == 2) {
                     c.iCheckSet('#iChkHBsAg1', true);
                     
                 }
                 if (testdata.tempid == 4) {
                     c.iCheckSet('#iChkHCVAb1', true);
                    
                 }
                 if (testdata.tempid == 1) {

                     c.iCheckSet('#iChkHIVAgAb1', true);
                      

                 }
                 if (testdata.tempid == 64) {
                     c.iCheckSet('#iChkHTLVAbIII1', true);
                     
                 }
                 if (testdata.tempid == 8) {
                     c.iCheckSet('#iChkVDRL1', true);
                      
                 }



             });
         }

     });
       


    });



}
function InitDateTimePicker() {
    $('#dtDonorSampleDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });

}
function InitDataTables() {
    //BindSubCenter([]);
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
    c.ReadOnly('#txtName', true);
    c.ReadOnly('#txtAge', true);
    c.ReadOnly('#txtIQama', true);
    c.ReadOnly('#txtGender', true);
    
}
function DefaultValues() {
    //c.SetValue('#Id', "0");
    //c.SetDateTimePicker('#dtCollectionDate', moment());
    //c.SetDateTimePicker('#dtExpiryDate', moment());
    //c.SetDateTimePicker('#dtToday', moment());
    //c.SetValue('#txtRowsPerPage', 500);
    //c.SetValue('#txtGetPage', 1);
    //c.SetSelect2('#select2TypeOfBlood', "0", 'Whole Blood');
}
function DefaultDisable() {
    c.DisableDateTimePicker('#dtDonorSampleDate', true);
}
function DefaultEmpty() {
    c.SetValue('#Id', '');

    //c.SetValue('#txtPIN', '');
    //c.SetValue('#txtSlNo', '');
    //c.SetValue('#txtPatientName', '');
    //c.SetValue('#txtDateTime', '');
    //c.SetValue('#txtAge', '');
    //c.SetValue('#txtOperator', '');
    //c.SetValue('#txtGender', '');
    //c.ClearSelect2('#select2BloodGroup');

    //c.ClearSelect2('#select2TypeOfBlood');
    //c.ClearSelect2('#select2TypeOfBloodValue');
    //c.ClearSelect2('#select2BloodGroupE');
    //c.ClearSelect2('#select2HospitalName');
    //c.ClearSelect2('#select2Quantity');
    //c.ClearSelect2('#select2ScreeningResult');
    //c.SetValue('#txtOutsideBagNo', '');

    //c.SetDateTimePicker('#dtCollectionDate', '');
    //c.SetDateTimePicker('#dtExpiryDate', '');

    //c.iCheckSet('#iChkCompleted', false);

    BindSubCenter([]);
}
function DisableDefault(flag) {
    //c.DisableSelect2('#select2TypeOfBlood', flag);
    //c.DisableSelect2('#select2TypeOfBloodValue', flag);
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

    
    req = c.IsEmptySelect2('#txtDonorReg');
    if (req) {
        c.MessageBoxErr('Required...', 'Donor Reg ID is required.');
        return false;
    }
  
    if (c.GetICheck('#iChkHBcAb1')) {
        if (c.IsEmptySelect2('#select2StatHBcAb1')) {
            c.MessageBoxErr('Required...', 'Result in HBc Ab  is required.');
            return false;
        }
    }
    if (c.GetICheck('#iChkHBsAg1')) {
        if (c.IsEmptySelect2('#select2StatHBsAg1')) {
            c.MessageBoxErr('Required...', 'Result in HBsAg  is required.');
            return false;
        }
    }
    if (c.GetICheck('#iChkHCVAb1')) {
        if (c.IsEmptySelect2('#select2StatHCVAb1')) {
            c.MessageBoxErr('Required...', 'Result in HCVAb is required.');
            return false;
        }
    }
    if (c.GetICheck('#iChkHIVAgAb1')) {
        if (c.IsEmptySelect2('#select2StatHIVAgAb1')) {
            c.MessageBoxErr('Required...', 'Result in HIVAgAb  is required.');
            return false;
        }
    }
    if (c.GetICheck('#iChkHTLVAbIII1')) {
        if (c.IsEmptySelect2('#select2StatHTLVAbIII1')) {
            c.MessageBoxErr('Required...', 'Result in HTLVAbIII  is required.');
            return false;
        }
    }
    if (c.GetICheck('#iChkVDRL1')) {
        if (c.IsEmptySelect2('#select2StatVDRL1')) {
            c.MessageBoxErr('Required...', 'Result in VDRL  is required.');
            return false;
        }
    }

    

    //req = c.IsEmptySelect2('#select2TypeOfBlood');
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Type of Blood is required.');
    //    return false;
    //}
    //req = c.IsEmptySelect2('#select2TypeOfBloodValue');
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Type Of Blood Value is required.');
    //    return false;
    //}
    //req = c.IsEmptySelect2('#select2BloodGroupE');
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Blood Group II is required.');
    //    return false;
    //}
    //req = c.IsDateEmpty('#dtCollectionDate');
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Collection Date is required.');
    //    return false;
    //}
    //req = c.IsDateEmpty('#dtExpiryDate');
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Expiry Date is required.');
    //    return false;
    //}
    //req = c.IsEmptySelect2('#select2HospitalName');
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Hospital Name is required.');
    //    return false;
    //}

    //$('#select2TypeOfBlood').select2({
    //      data: [
    //          { id: 0, text: 'Whole Blood' },
    //          { id: 1, text: 'Component' },
    //          { id: 2, text: 'SDPLR' }
    //req = c.IsEmptySelect2('#select2Quantity') && c.GetSelect2Id('#select2TypeOfBlood') !== 1;
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Quantity (ml) is required.');
    //    return false;
    //}
    //req = c.IsEmptySelect2('#select2ScreeningResult');
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Screening Result is required.');
    //    return false;
    //}


    //var from = c.GetDateTimePickerDate('#dtExpiryDate');
    //var today = c.GetDateTimePickerDate('#dtToday');
    //var ex = c.DateDiffDays(today, from);
    //if (ex <= 1) {
    //    c.MessageBoxErr('Required...', 'Expiry Date cannot be less than or equal to the present day.');
    //    return false;
    //}


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
        //c.DisableSelect2('#select2TypeOfBlood', true);
        //c.Disable('#txtPIN', true);
        //c.DisableDateTimePicker('#dtExpiryDate', true);
        //c.iCheckDisable('#iChkCompleted', true);
    }
    else if (Action == 1 || Action == 2) { // add or edit
        //c.DisableSelect2('#select2TypeOfBlood', true);
        //c.Disable('#txtPIN', true);
        //c.DisableDateTimePicker('#dtExpiryDate', true);
        //c.iCheckDisable('#iChkCompleted', true);
    }
    else {
        c.Show('#Entry', false);
        c.Show('#DashBoard', true);
    }
}
function HandleButtonNotUse() {
    $('.NotUse').hide();
}

function Delete()
{
    

    var DonorReg = c.GetValue('#DonorRegID');
    console.log(DonorReg);
    if (DonorReg > 0)
    {
        var Url = baseURL + "Delete";
        ajaxWrapper.Post(Url, JSON.stringify({ donorregno: DonorReg }), function (x, e) {
            
            if (x.ErrorCode == 0) {
                c.MessageBox("Error...", x.Message, function () { location.reload(); });
                return false;
            } else {
              
                c.MessageBox("Success", x.Message, function () { location.reload(); });

            }
        });

    }
  
    
}
function Save() {

    var ret = Validated();
    if (!ret) return ret;

    c.ButtonDisable('#btnSave', true);

    var entry;
    entry = [];
    entry = {};
    entry.Action = Action;

    entry.DonorId = c.GetSelect2Id('#txtDonorReg');
    
    //var i = c.GetValue('#Id');

    //var param = {
    //    Action: Action,
    //    Id: parseInt(i)
    //};

    //fire = {
    //    entry: param
    //};

   
    var testIdrows = [];
    if (c.GetICheck('#iChkHBcAb1')) {
      
        testIdrows.push({ testid: 291, result: c.GetSelect2Id('#select2StatHBcAb1') });
        
    }
    if (c.GetICheck('#iChkHBsAg1')) {
      
        testIdrows.push({ testid: 309, result: c.GetSelect2Id('#select2StatHBsAg1') });
       
    }
    if (c.GetICheck('#iChkHCVAb1')) {
      
        testIdrows.push({ testid: 293, result: c.GetSelect2Id('#select2StatHCVAb1') });
        
    }
    if (c.GetICheck('#iChkHIVAgAb1')) {

        testIdrows.push({ testid: 319, result: c.GetSelect2Id('#select2StatHIVAgAb1') });
       
    }
    if (c.GetICheck('#iChkHTLVAbIII1')) {
        
        testIdrows.push({ testid: 1059, result: c.GetSelect2Id('#select2StatHTLVAbIII1') });
  
    }
    if (c.GetICheck('#iChkVDRL1')) {

        testIdrows.push({ testid: 325, result: c.GetSelect2Id('#select2StatVDRL1') });
 
    }

    entry.TestIds = testIdrows;



  
 
    //entry.Bagnumber = c.GetValue('#txtOutsideBagNo');
    //entry.Coldate = c.GetDateTimePickerDate('#dtCollectionDate');
    //entry.ExpiryDate = c.GetDateTimePickerDate('#dtExpiryDate');
    //entry.Tvolume = c.GetSelect2Text('#select2Quantity');
    //entry.Cvolume = c.GetSelect2Text('#select2Quantity');
    //entry.Bloodgroup = c.GetSelect2Id('#select2BloodGroupE');
    //entry.ScreenValue = c.GetSelect2Id('#select2ScreeningResult');

    //entry.BloodCollectionIssuesD = [];
    //var rowcollection = TblGridSubCenter.$("#chkCrossMatchtype:checked", { "page": "all" });
    //rowcollection.each(function (index, elem) {
    //    var tr = $(elem).closest('tr');
    //    var row = TblGridSubCenter.row(tr);
    //    var rowdata = row.data();

    //    entry.BloodCollectionIssuesD.push({
    //        Hospitalid: c.GetSelect2Id('#select2HospitalName'),
    //        Collectionbag: c.GetValue('#txtOutsideBagNo'),
    //        Issuebag: rowdata["name"],
    //        Issueid: rowdata["id"]
    //    });
    //});


    //var type1 = c.GetSelect2Id('#select2TypeOfBlood');

    //entry.OutsideBagsCollectionD = [];
    //entry.OutsideBagsCollectionD.push({
    //    cdatetime: c.GetDateTimePickerDate('#dtCollectionDate'),
    //    bloodgroup: c.GetSelect2Id('#select2BloodGroupE'),
    //    purchasebagnumber: c.GetValue('#txtOutsideBagNo'),
    //    screenvalue: c.GetSelect2Id('#select2ScreeningResult'),
    //    expirydatetime: c.GetDateTimePickerDate('#dtExpiryDate'),
    //    hospitalid: c.GetSelect2Id('#select2HospitalName'),
    //    type: type1 == 0 ? false : true,
    //    componentid: c.GetSelect2Id('#select2TypeOfBlood'),
    //    Quantity: c.GetSelect2Id('#select2Quantity'),
    //    screenbagnumber: c.GetValue('#txtOutsideBagNo'),
    //    RegistrationNo: c.GetValue('#registrationno'),
    //    pBloodgroup: c.GetSelect2Id('#select2BloodGroup')
    //});

    console.log(entry);

   /* $.ajax({
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
    });*/

   
    ajaxWrapper.Post($("#url").data("save"), JSON.stringify(entry), function (x, e) {
        c.ButtonDisable('#btnSave', false);
        if (x.ErrorCode == 0) {
            c.MessageBox("Error...", x.Message, function () {   });
            return false;
        } else {
            c.MessageBox("Notify!", x.Message, function () {
                Action = 0;
                HandleEnableButtons();
                HandleEnableEntries();
                $('#btnRefresh').click();
            });

        }
 

    }); 


    return ret;
}
function View(id) {
    var Url = baseURL + "DonorRegList";
    var param = { donorreg: id };
    c.SetValue('#DonorRegID', id);
    c.ButtonDisable('#btnSave', false);
    $('#preloader').show();
    $('.Hide').hide();
  
    ajaxWrapper.Get(Url, param, function (x, e) {
       
        //$('#preloader').hide();
        $('.Show').show();
       
        
        //if (data.list.length == 0) {
        //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
        //    TblGridList.row('tr.selected').remove().draw(false);
        //    RedrawGrid();
        //    return;
        //}

         var data = x.list[0];
        
        c.SetSelect2('#txtDonorReg',  data.donorregistrationno, data.donorregistrationno);
    
        c.SetValue('#txtName', data.name);
        c.SetValue('#txtAge', data.age);
        c.SetValue('#txtIQama', data.iqama);
        c.SetValue('#txtGender', data.sex);
        c.SetDateTimePicker('#dtDonorSampleDate', data.datetime);

        /*  name	      testid
      HBc Ab	        291 iChkHBcAb1 / select2StatHBcAb1
      HBs Ag	        309
      HCV Ab	        293
      HIV Ag/Ab	    319
      HTLV Ab I&II	1059
      V.D.R.L	        325
      */
       
        console.log('data.LabEquipTestResultDetail');
        console.log(data.LabEquipTestResultDetail);

        if (data.LabEquipTestResultDetail.length > 0) {

            $.each(data.LabEquipTestResultDetail, function (i, val) {

                var testdata = val;
                
                if (testdata.testid == 291) {
                    c.iCheckSet('#iChkHBcAb1', true);
                    if (testdata.testresult.toLowerCase() == 'negative' || testdata.testresult.toLowerCase() == 'positive' || testdata.testresult.toLowerCase() == 'reactive') {
                        c.SetSelect2('#select2StatHBcAb1', testdata.testresult.toLowerCase(), testdata.testresult);
                    } else {
                        c.SetValue('#resultPOSHBcAb1', testdata.testresult);
                    }                   
                }

                if (testdata.testid == 309) {
                    c.iCheckSet('#iChkHBsAg1', true);
                     if (testdata.testresult.toLowerCase() == 'negative' || testdata.testresult.toLowerCase() == 'positive' || testdata.testresult.toLowerCase() == 'reactive') {
                        c.SetSelect2('#select2StatHBsAg1', testdata.testresult.toLowerCase(), testdata.testresult);
                    } else {
                        c.SetValue('#resultPOSHBsAg1', testdata.testresult);
                    }
                }
                if (testdata.testid == 293) {
                    c.iCheckSet('#iChkHCVAb1', true);
                     if (testdata.testresult.toLowerCase() == 'negative' || testdata.testresult.toLowerCase() == 'positive' || testdata.testresult.toLowerCase() == 'reactive') {
                        c.SetSelect2('#select2StatHCVAb1', testdata.testresult.toLowerCase(), testdata.testresult);
                    } else {
                        c.SetValue('#resultPOSHCVAb1', testdata.testresult);
                    }
                }
                if (testdata.testid == 319) {

                    c.iCheckSet('#iChkHIVAgAb1', true);            
                    if (testdata.testresult.toLowerCase() == 'negative' || testdata.testresult.toLowerCase() == 'positive' || testdata.testresult.toLowerCase() == 'reactive') {
                        c.SetSelect2('#select2StatHIVAgAb1', testdata.testresult.toLowerCase(), testdata.testresult);
                    } else {
                        c.SetValue('#resultPOSHIVAgAb1', testdata.testresult);
                    }
                  
                }
                if (testdata.testid == 1059) {
                    c.iCheckSet('#iChkHTLVAbIII1', true);
                     if (testdata.testresult.toLowerCase() == 'negative' || testdata.testresult.toLowerCase() == 'positive' || testdata.testresult.toLowerCase() == 'reactive') {
                        c.SetSelect2('#select2StatHTLVAbIII1', testdata.testresult.toLowerCase(), testdata.testresult);
                    } else {
                        c.SetValue('#resultPOSHTLVAbIII1', testdata.testresult);
                    }
                }
                if (testdata.testid == 325) {
                    c.iCheckSet('#iChkVDRL1', true);
                     if (testdata.testresult.toLowerCase() == 'negative' || testdata.testresult.toLowerCase() == 'positive' || testdata.testresult.toLowerCase() == 'reactive') {
                        c.SetSelect2('#select2StatVDRL1', testdata.testresult.toLowerCase(), testdata.testresult);
                    } else {
                        c.SetValue('#resultPOSVDRL1', testdata.testresult);
                    }
                }



            });
        }

        console.log('data.DonorTestResults');
        console.log(data.DonorTestResults);
        if (data.DonorTestResults.length > 0) {
            //disable btn SAVE because it has the result
            c.ButtonDisable('#btnSave', true);

            $.each(data.DonorTestResults, function (i, val) {

                var testdata = val;
            
                if (testdata.TestId == 291) {
                    c.iCheckSet('#iChkHBcAb1', true);
                    c.SetSelect2('#select2StatHBcAb1', testdata.Result.toLowerCase, testdata.Result);
                }

                if (testdata.TestId == 309) {
                    c.iCheckSet('#iChkHBsAg1', true);
                    c.SetSelect2('#select2StatHBsAg1', testdata.Result.toLowerCase, testdata.Result);
                }
                if (testdata.TestId == 293) {
                    c.iCheckSet('#iChkHCVAb1', true);
                    c.SetSelect2('#select2StatHCVAb1', testdata.Result.toLowerCase, testdata.Result);
                }
                if (testdata.TestId == 319) {
                    c.iCheckSet('#iChkHIVAgAb1', true);
                    c.SetSelect2('#select2StatHIVAgAb1', testdata.Result.toLowerCase, testdata.Result);
                }
                if (testdata.TestId == 1059) {
                    c.iCheckSet('#iChkHTLVAbIII1', true);
                    c.SetSelect2('#select2StatHTLVAbIII1', testdata.Result.toLowerCase, testdata.Result);
                }
                if (testdata.TestId == 325) {
                    c.iCheckSet('#iChkVDRL1', true);
                    c.SetSelect2('#select2StatVDRL1', testdata.Result.toLowerCase, testdata.Result);
                }



            });

          
        }
        

        //c.SetValue('#txtPIN', data.PIN);
        //c.SetValue('#txtSlNo', data.id);
        //c.SetValue('#txtPatientName', data.PatientName);
        //c.SetValue('#txtDateTime', data.DateTimeD);
        //c.SetValue('#txtAge', data.Age);
        //c.SetValue('#txtOperator', data.OperatorName);
        //c.SetValue('#txtGender', data.Gender);
        //c.SetSelect2('#select2BloodGroup', data.pBloodgroup, data.BloodGroupName);
        //c.SetValue('#txtOutsideBagNo', data.purchasebagnumber);

        //c.SetSelect2('#select2TypeOfBlood', data.type ? 1 : 0, data.TypeName);
        //c.SetSelect2('#select2TypeOfBloodValue', data.componentid, data.ComponentName);
        //c.SetSelect2('#select2BloodGroupE', data.bloodgroup, data.BloodGroupName1);
        //c.SetSelect2('#select2HospitalName', data.hospitalid, data.hospitalname);
        //c.SetSelect2('#select2Quantity', data.Quantity, data.QuantityName);
        //c.SetSelect2('#select2ScreeningResult', data.screenvalue, data.screenvalue == 1 ? 'Positive' : 'Negative');
        //c.SetDateTimePicker('#dtCollectionDate', data.collectiondatetimeD);
        //c.SetDateTimePicker('#dtExpiryDate', data.expirydatetimeD);

        //c.iCheckSet('#iChkCompleted', false);

        //// if component
        //if (data.type) {
        //    $('.hideqty').hide();
        //    c.SetSelect2('#select2Quantity', '', '');
        //}
        //else {
          //$('.hideqty').show();
        //}

        //BindSubCenter(data.GetSubcenterIssuesByHospList);

    

        HandleEnableButtons();
        HandleEnableEntries();
        RedrawGrid();
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



function ShowList(id) {
    var Url = baseURL + "ShowList";
    var param = {
        Id: id,
        RowsPerPage: c.GetValue('#txtRowsPerPage'),
        GetPage: c.GetValue('#txtGetPage')
    };
    c.ButtonDisable('#btnSave', false);
   // $('#preloader').show();
   // $("#grid").css("visibility", "hidden");
    
    ajaxWrapper.Get(Url, param, function (x, e) {
       
        BindList(x.list);
    //    $("#grid").css("visibility", "visible");
    });
 

}
var calcHeightDashboardScreenDashboard = function () {
    return $(window).height() * 50 / 100;
};
function BindList(data) {
  
    TblGridList = $(TblGridListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: true,
        processing: false,
        autoWidth: false,
        scrollCollapse: false,
        pageLength: 20,
        lengthChange: false,
        scrollY: calcHeightDashboardScreenDashboard(),
        scrollX: "100%",
        sScrollXInner: "100%",

        dom: '<"tbDashboardScreenDashboard">Rlfrtip',
        columns: ShowListColumns(),
        fnRowCallback: ShowListRowCallBack()

    });

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
    //    scrollY: 550,
    //    scrollX: true,
    //    fnRowCallback: ShowListRowCallBack(),
    //    iDisplayLength: 25
    //});
}
function ShowListColumns() {
    var cols = [
        { data: "Donorreg", title: 'Donor No', className: '   ', visible: true, searchable: true, width: "1%" },
        { data: "Name", title: 'Name', className: '   ', visible: true, searchable: true, width: "1%" },
        { data: "PatientRegistrationNO", title: 'Registration No', className: '   ', visible: true, searchable: true, width: "1%" },
        { data: "DateTime", title: 'Date', className: '   ', visible: true, searchable: true, width: "1%" },
        { data: "unitno", title: 'Unit No', className: '   ', visible: true, searchable: true, width: "1%" },
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

