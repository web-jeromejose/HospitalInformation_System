// http://www.neodynamic.com/articles/How-to-add-Cross-Browser-Printing-to-ASP-NET-ReportViewer-toolbar/

var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridFilter;
var TblGridFilterId = "#gridFilter";
var TblGridFilterDataRow;

var TblGridDrugAllergies;
var TblGridDrugAllergiesId = "#gridDrugAllergies";
var TblGridDrugAllergiesDataRow;

var TblGridFoodAllergies;
var TblGridFoodAllergiesId = "#gridFoodAllergies";
var TblGridFoodAllergiesDataRow;

var TblGridSurgeries;
var TblGridSurgeriesId = "#gridSurgeries";
var TblGridSurgeriesDataRow;

var TblGridQuestionaire;
var TblGridQuestionaireId = "#gridQuestionaire";
var TblGridQuestionaireDataRow;

var TblGridScreenResults;
var TblGridScreenResultsId = "#gridScreenResult";
var TblGridScreenResultsDataRow;



$(document).ready(function () {

    c.SetTitle("Donor Registration");
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

    BindList([]);
    setTimeout(function () {
        ShowList(-1);               
    }, 1 * 100);

    c.ResizeDiv('#reportBorder', reportHeight);
    //$('.hideExpiryDate').hide();
});
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // for future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();

    //if (tabNameSelected == "Health BackgroundAllergies") {
    //    ShowDrugAllergies(-1);
    //    ShowFoodAllergies(-1);
    //}
    //else if (tabNameSelected == "Health BackgroundSurgeries") {
    //    ShowSurgeries(-1);
    //}


    RedrawGrid();
})

$("#dtDateOfBirth").blur(function () {
    $('#txtAge').val(c.GetAgeFromMask('#dtDateOfBirth'));
});

$(document).on("click", TblGridListId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        //// Multiple selection
        //tr.toggleClass('selected');

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

        TblGridListDataRow = TblGridList.row($(this).parents('tr')).data();
        $('#btnView').click();

    }
});

$(document).on("keyup", "#grid [type='search']", function () {
    var searchText = $("#grid [type='search']").val();
    var foundAt = searchText.search('H1038');
    var newTextToSearch = searchText.substring(foundAt + 7);
    newTextToSearch = Number(newTextToSearch);

    if (!newTextToSearch == 0) {
        $("#grid [type='search']").val(newTextToSearch);
    }
});

$(document).on("click", "#chkAll", function () {
    if ($('#chkAll').is(':checked')) {
        $.each(TblGridFilter.rows().data(), function (i, row) {
            TblGridFilter.cell(i, ennFilterCols.checkbox).data('<input id="chkFilter" type="checkbox" checked="checked" >');
        });
    }
    else {
        $.each(TblGridFilter.rows().data(), function (i, row) {
            TblGridFilter.cell(i, ennFilterCols.checkbox).data('<input id="chkFilter" type="checkbox">');
        });
    }
});

//$(document).on("click", "#iChkAllSelScreenRes", function () {
//    if ($('#iChkAllSelScreenRes').is(':checked')) {
//        $.each(TblGridScreenResults.rows().data(), function (i, row) {
//            TblGridScreenResults.cell(i, 0).data('<input id="chkSelScreenRes" type="checkbox" checked="checked" >');
//        });
//    }
//    else {
//        $.each(TblGridScreenResults.rows().data(), function (i, row) {
//            TblGridScreenResults.cell(i, 0).data('<input id="chkSelScreenRes" type="checkbox">');
//        });
//    }
//});
$(document).on("keypress", "#txtGetPage", function (e) {
    if (e.which == 13) {
        $('#btnViewFilter').click();
    }
});
$(document).on("keypress", "#txtID", function (e) {
    if (e.which == 13) {
        Search();
    }
});
$(document).on("keypress", ".DecimalOnly", function (e) {
    return DecimalOnly(e, this);
});

$(window).on("resize", function () {
    c.ResizeDiv('#reportBorder', reportHeight);
});
$('#myReport').on('load', function () {
    $('.loading').hide();
});
function GenerateReport(report) {
    $('.loading').show();

    var $report = $("#myReport");
    var UserId = "";

    var dlink;
    var repsrc;

    if (report == 1) {
        $('#ReportCaption').text('DONOR REGISTRATION LIST');
        var isCustom = c.GetICheck('#iChkCustom') == 1;
        var para;
        para = [];
        para = {};
        para.DonorRegFilter = [];
        para.Id = isCustom ? -2 : -1;

        var filter = [
            { SearchForId: 1, SearchFor: 'Iqama / Saudi ID', OperatorId: 1, Operator: '=', Value1: c.GetValue('#txtFindIqama'), Value2: '', ActualValue1: c.GetValue('#txtFindIqama'), ActualValue2: '', Column: 'iqama' },
            { SearchForId: 2, SearchFor: 'PIN', OperatorId: 1, Operator: '=', Value1: c.GetValue('#txtFindPIN'), Value2: '', ActualValue1: c.GetValue('#txtFindPIN'), ActualValue2: '', Column: 'PatientRegistrationNO' },
            { SearchForId: 3, SearchFor: 'Registration NO', OperatorId: parseInt(c.GetSelect2Id('#txtFindCondition01')), Operator: c.GetSelect2Text('#txtFindCondition01'), Value1: c.GetValue('#txtFindRegistrationNo1'), Value2: c.GetValue('#txtFindRegistrationNo2'), ActualValue1: c.GetValue('#txtFindRegistrationNo1'), ActualValue2: c.GetValue('#txtFindRegistrationNo2'), Column: 'DonorRegistrationNO' },
            { SearchForId: 4, SearchFor: 'Registration Date', OperatorId: parseInt(c.GetSelect2Id('#txtFindCondition02')), Operator: c.GetSelect2Text('#txtFindCondition02'), Value1: c.GetDateTimePickerDate('#dtFindRegistrationDate1'), Value2: c.GetDateTimePickerDate('#dtFindRegistrationDate2'), ActualValue1: c.GetDateTimePickerDate('#dtFindRegistrationDate1'), ActualValue2: c.GetDateTimePickerDate('#dtFindRegistrationDate2'), Column: 'DateTime' },
            { SearchForId: 5, SearchFor: 'Donation Date', OperatorId: parseInt(c.GetSelect2Id('#txtFindCondition03')), Operator: c.GetSelect2Text('#txtFindCondition03'), Value1: c.GetDateTimePickerDate('#dtFindDonationDate1'), Value2: c.GetDateTimePickerDate('#dtFindDonationDate2'), ActualValue1: c.GetDateTimePickerDate('#dtFindDonationDate1'), ActualValue2: c.GetDateTimePickerDate('#dtFindDonationDate2'), Column: 'DonatedDate' },
            { SearchForId: 6, SearchFor: 'Age', OperatorId: parseInt(c.GetSelect2Id('#txtFindCondition04')), Operator: c.GetSelect2Text('#txtFindCondition04'), Value1: c.GetValue('#txtFindAge1'), Value2: c.GetValue('#txtFindAge2'), ActualValue1: c.GetValue('#txtFindAge1'), ActualValue2: c.GetValue('#txtFindAge2'), Column: 'Age' },
            { SearchForId: 7, SearchFor: 'Donor Name', OperatorId: 7, Operator: 'Like', Value1: c.GetValue('#txtFindDonorName'), Value2: '', ActualValue1: c.GetValue('#txtFindDonorName'), ActualValue2: '', Column: 'Name' },
            { SearchForId: 8, SearchFor: 'Gender', OperatorId: 1, Operator: '=', Value1: c.GetSelect2Id('#txtFindGender'), Value2: '', ActualValue1: c.GetSelect2Id('#txtFindGender'), ActualValue2: '', Column: 'Sex' },
            { SearchForId: 9, SearchFor: 'Address 1', OperatorId: 1, Operator: '=', Value1: c.GetValue('#txtFindAddress1'), Value2: '', ActualValue1: c.GetValue('#txtFindAddress1'), ActualValue2: '', Column: 'address1' },
            { SearchForId: 10, SearchFor: 'Address 2', OperatorId: 1, Operator: '=', Value1: c.GetValue('#txtFindAddress2'), Value2: '', ActualValue1: '', ActualValue2: c.GetValue('#txtFindAddress2'), Column: 'address2' },
            { SearchForId: 11, SearchFor: 'Bag No', OperatorId: 1, Operator: '=', Value1: c.GetValue('#txtFindBagNo'), Value2: '', ActualValue1: c.GetValue('#txtFindBagNo'), ActualValue2: '', Column: 'ID' },
            { SearchForId: 12, SearchFor: 'Donor Type', OperatorId: 1, Operator: '=', Value1: c.GetSelect2Id('#txtFindDonorType'), Value2: '', ActualValue1: c.GetSelect2Id('#txtFindDonorType'), ActualValue2: '', Column: 'DonorType' },
            { SearchForId: 13, SearchFor: 'Blood Group', OperatorId: 1, Operator: '=', Value1: c.GetSelect2Id('#txtFindBloodGroup'), Value2: '', ActualValue1: c.GetSelect2Id('#txtFindBloodGroup'), ActualValue2: '', Column: 'BloodGroup' },
            { SearchForId: 14, SearchFor: 'Donor Status', OperatorId: 1, Operator: '=', Value1: c.GetSelect2Id('#txtFindDonorStatus'), Value2: '', ActualValue1: c.GetSelect2Id('#txtFindDonorStatus'), ActualValue2: '', Column: 'DonorStatus' }
        ];
        para.DonorRegFilter = filter;
        para.RowsPerPage = parseInt(c.GetValue('#txtRowsPerPage')),
        para.GetPage = parseInt(c.GetValue('#txtGetPage'));
        
        var filterfy = JSON.stringify(filter);
        setCookie('DonorRegFilter', filterfy, 365);


        dlink = hissystem.appsserver() + hissystem.appsname() + "Areas/BloodBank/Reports/DonorRegistrationList/DonorRegistrationList.aspx";
        console.log(dlink);
        repsrc = dlink + "?UserId=" + UserId + "&Id=" + para.Id + "&RowsPerPage=" + c.GetValue('#txtRowsPerPage') + "&GetPage=" + c.GetValue('#txtGetPage') + "&xmlDonorRegFilter=''";
    }
    else if (report == 2) {
        $('#ReportCaption').text('DONOR REGISTRATION GROUPING');

        dlink = hissystem.appsserver() + hissystem.appsname() + "Areas/BloodBank/Reports/DonorRegistrationList/DonorRegistrationPrintGrouping.aspx";
        repsrc = dlink + "?UserId=" + UserId + "&Id=" + c.GetValue('#Id');
    }
    else if (report == 2) {
        $('#ReportCaption').text('DONOR REGISTRATION SCREENING');

        dlink = hissystem.appsserver() + hissystem.appsname() + "Areas/BloodBank/Reports/DonorRegistrationList/DonorRegistrationList.aspx";
        repsrc = dlink + "?UserId=" + UserId + "&Id=" + para.Id + "&RowsPerPage=" + c.GetValue('#txtRowsPerPage') + "&GetPage=" + c.GetValue('#txtGetPage') + "&xmlDonorRegFilter=''";
    }

    console.log(repsrc);
    c.LoadInIframe("myReport", repsrc);
}
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
function getCookie(name) {
    var nameEQ = encodeURIComponent(name) + "=";
    var ca = document.cookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) === ' ') c = c.substring(1, c.length);
        if (c.indexOf(nameEQ) === 0) return decodeURIComponent(c.substring(nameEQ.length, c.length));
    }
    return null;
} btnRefresh

function ValidateFilter() {

    if (!c.IsEmptyById('#txtFindPIN')) return true;
    if (!c.IsEmptyById('#txtFindRegistrationNo1')) return true;
    if (!c.IsDateEmpty('#dtFindRegistrationDate1')) return true;
    if (!c.IsDateEmpty('#dtFindDonationDate1')) return true;
    if (!c.IsEmptyById('#txtFindAge1')) return true;
    if (!c.IsEmptyById('#txtFindDonorName')) return true;
    if (!c.IsEmptySelect2('#txtFindGender')) return true;
    if (!c.IsEmptyById('#txtFindAddress1')) return true;
    if (!c.IsEmptyById('#txtFindAddress2')) return true;
    if (!c.IsEmptyById('#txtFindBagNo')) return true;
    if (!c.IsEmptySelect2('#txtFindDonorType')) return true;
    if (!c.IsEmptySelect2('#txtFindBloodGroup')) return true;
    if (!c.IsEmptySelect2('#txtFindDonorStatus')) return true;
    if (!c.IsEmptyById('#txtFindIqama')) return true;

    c.MessageBoxErr("Search...", "Search option should atleast have one value.", null);
    return false;
}

function InitButton() {
    $('#btnRefresh').click(function () {
        //ShowList(-1);
        location.reload();
        //$('#btnViewFilter').click();
    });
    $('#btnFilter').click(function () {        
        c.ModalShow('#modalFilter', true);
        RedrawGrid();

        //var isCustomFilter = c.GetICheck('#iChkCustom') == 1;

        //c.Show('#btnClearFilter', isCustomFilter);
        //c.Show('#btnRemoveFilter', isCustomFilter);
        //c.Show('#btnAddFilter', isCustomFilter);
        //c.iCheckSet('#iChkCustom', true);
        //c.Disable('#txtRowsPerPage', true);
        //c.Disable('#txtGetPage', true);
        //BindFilter(filterData);
    });
    $('#btnView').click(function () {

        if (TblGridList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }

        var id = TblGridListDataRow.idd;
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
    });

    $('#btnCloseFilter').click(function () {
        c.ModalShow('#modalFilter', false);
    });
    $('#btnViewFilter').click(function () {
        var isCustom = c.GetICheck('#iChkCustom') == 1;
        var RowsPerPage = c.GetValue('#txtRowsPerPage');
        var GetPage = c.GetValue('#txtGetPage');
        if (RowsPerPage.length == 0 && !isCustom) {
            c.MessageBoxErr("Required...", "Please enter value for rows per page.");
            return;
        }
        else if (GetPage.length == 0 && !isCustom) {
            c.MessageBoxErr("Required...", "Please enter value for get page.");
            return;
        }
        else if (isCustom && !ValidateFilter()) {
            return;
        }
        

        ShowList(-1);
        c.ModalShow('#modalFilter', false);

    });
    $('#btnFilterClear').click(function () {
        c.ClearAllText();
        c.ClearSelect2('#txtFindGender');
        c.ClearSelect2('#txtFindDonorType');
        c.ClearSelect2('#txtFindBloodGroup');
        c.ClearSelect2('#txtFindDonorStatus');
        c.SetDateTimePicker('#dtFindRegistrationDate1', '');
        c.SetDateTimePicker('#dtFindDonationDate1', '');

        c.SetValue('#txtRowsPerPage', '500');
        c.SetValue('#txtGetPage', '1');
    });
    

    $('#btnClose').click(function () {

        Action = -1;
        $(".cancelreason").hide();
        $("#txtreason").val("");
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
        HandleDonorStatus(c.GetSelect2Id('#select2DonorStatus'));
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

    

    $('#btnPrint').click(function () {
        $('#ReportCaption ').text('PRINT');
        c.ModalShow('#modalReport', true);
    });
    $('#btnPrintLabel').click(function () {
        $('#ReportCaption').text('PRINT LABEL');
        c.ModalShow('#modalReport', true);
    });
    $('#btnPrintReceipt').click(function () {
        $('#ReportCaption').text('PRINT RECEIPT');
        c.ModalShow('#modalReport', true);
    });
    $('.btnCloseReport').click(function () {
        c.ModalShow('#modalReport', false);
    });

    $('#btnPreview').click(function () {
        c.ModalShow('#modalReport', true);
        GenerateReport(1);
        c.ResizeDiv('#reportBorder', reportHeight);
    });
    $('#btnPrintGrouping').click(function () {
        c.ModalShow('#modalReport', true);
        GenerateReport(2);
        c.ResizeDiv('#reportBorder', reportHeight);
    });
    $('#btnPrintScreening').click(function () {
        c.ModalShow('#modalReport', true);
        GenerateReport(3);
        c.ResizeDiv('#reportBorder', reportHeight);
    });

    
    
    $('#btnCheckBBRegNo').click(function () {
        GetLastBBRegNo();
    });
    

}
function InitICheck() {
    $('#iChkCustom').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
        c.Disable('#txtRowsPerPage', checked);
        c.Disable('#txtGetPage', checked);
        
        if (checked) {
            //$("#CustomFilter").children().prop('disabled', false);
            $("#CustomFilter").find("*").prop("disabled", false);
            c.DisableSelect2('#txtFindGender', false);
            c.DisableSelect2('#txtFindDonorType', false);
            c.DisableSelect2('#txtFindBloodGroup', false);
            c.DisableSelect2('#txtFindDonorStatus', false);
        }
        else {
            //$("#CustomFilter").children().prop('disabled', true);
            $("#CustomFilter").find("*").prop("disabled", true);
            c.DisableSelect2('#txtFindGender', true);
            c.DisableSelect2('#txtFindDonorType', true);
            c.DisableSelect2('#txtFindBloodGroup', true);
            c.DisableSelect2('#txtFindDonorStatus', true);
        }
    });
    $('#iChkWilling').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
    });
    
}

var isDonatingFor = false;
function InitSelect2() {
    
    $('#select2DonatingFor').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2DonatingFor',
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
        c.SetValue('#txtPIN1', list[3]);
        c.SetValue('#txtPIN2', list[3]);
        c.SetValue('#txtBloodGroup', list[4]);
        c.SetSelect2('#select2BedNo', list[6], list[5]);
        c.SetValue('#PatientRegistrationNO', list[8]);
    });
    $('#select2IssueBags').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2IssueBags',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    IPID: c.GetSelect2Id('#select2DonatingFor')
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        c.SetValue('#ReplacementCount', list[2]);
    });
    //$('#select2TypeOfDonor').select2({
    //    //containerCssClass: "RequiredField",
    //    data: [
    //        { id: 1, text: 'Inpatient Replacement' },
    //        { id: 2, text: 'Patient Bill' },
    //        { id: 3, text: 'Voluntary Donor' },
    //        { id: 4, text: 'Other / Paid Donor' }
    //    ],
    //    minimumResultsForSearch: -1
    //}).change(function (e) {
    //    var list = e.added;

    //    if (list.id == 1 || list.id == 2) {
    //        $('#DonatingFor').show();
    //    } else {
    //        $('#DonatingFor').hide();
    //    }
    //});
    $('#select2TypeOfDonor').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2DonorType',
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
        if (list[0] == 0 || list[0] == 6) { // IP Replacement, Patient Bill
            isDonatingFor = true;
            $('#DonatingFor').show();
        } else {
            isDonatingFor = false;
            $('#DonatingFor').hide();
        }

        //c.DisableSelect2('#select2IssueBags', list[0] == 0); // if IP Replacement.
        c.SetValue('#txtPIN1', '');
        c.Select2Clear('#select2DonatingFor');
        c.SetValue('#txtPIN2', '');
        c.Select2Clear('#select2IssueBags');
        c.SetDateTimePicker('#dtAdmitDate', '');
        c.SetValue('#txtBloodGroup', '');
        c.Select2Clear('#select2BedNo');
        });

    //HandleDonorStatus(data.DonorStatus);

    $('#select2TypeOfID').select2({
        containerCssClass: "RequiredField",
        data: [
            { id: 0, text: 'IQAMA / S.ID' },
            { id: 1, text: 'PIN' }
        ],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added;


        });
    
    $('#select2MaritalStatus').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2MaritalStatus',
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
        });

    $('#select2BloodGroup').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2BloodGroup',
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
        });

    $('#select2Nationality').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Nationality',
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
        });

    $('#select2Gender').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Gender',
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
        });

    $('#select2Title').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Title',
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
        });

    $('#select2BedNo').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Bed',
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
        c.SetValue('#txtPIN1', list[3]);
        c.SetValue('#txtPIN2', list[3]);
        c.SetValue('#txtBloodGroup', list[4]);
        c.SetSelect2('#select2DonatingFor', list[0], list[7]);
        });

    $('#select2Religion').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'select2Religion',
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
        });

    $('#select2Occupation').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Occupation',
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
        });

    $('#select2Country').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'select2Country',
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
        });

    $('#select2City').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2City',
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
        });

    $("#select2DrugAllergies").select2({
        placeholder: "Type to include multiple selection...",
        data: [],
        minimumInputLength: 0,
        tags: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2DrugAllergies',
            dataType: 'jsonp',
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term
                };
            },
            success: function () {

            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    });
    $("#select2FoodAllergies").select2({
        placeholder: "Type to include multiple selection...",
        data: [],
        minimumInputLength: 0,
        tags: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2FoodAllergies',
            dataType: 'jsonp',
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term
                };
            },
            success: function () {

            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    });
    $("#select2Surgeries").select2({
        placeholder: "Type to include multiple surgeries...",
        data: [],
        minimumInputLength: 0,
        tags: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Surgeries',
            dataType: 'jsonp',
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term
                };
            },
            success: function () {

            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    });
    /////////////
    $('#select2DonorSuffers').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2DonorSuffers',
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
    })
    ///////////// Changed List to Dropdown.
    //$("#select2DonorSuffers").select2({
    //    placeholder: "Type to include multiple selection...",
    //    data: [],
    //    minimumInputLength: 0,
    //    tags: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2DonorSuffers',
    //        dataType: 'jsonp',
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term
    //            };
    //        },
    //        success: function () {

    //        },
    //        results: function (data, page) {
    //            var more = (page * pageSize) < data.Total;
    //            return { results: data.Results, more: more };
    //        }
    //    }
    //});

    ///////////// 
    $('#select2DonorAntiDrugs').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2DonorAntiDrugs',
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
    })
   ///////////// Changed List to Dropdown.
    //$("#select2DonorAntiDrugs").select2({
    //    placeholder: "Type to include multiple selection...",
    //    data: [],
    //    minimumInputLength: 0,
    //    tags: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2DonorAntiDrugs',
    //        dataType: 'jsonp',
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term
    //            };
    //        },
    //        success: function () {

    //        },
    //        results: function (data, page) {
    //            var more = (page * pageSize) < data.Total;
    //            return { results: data.Results, more: more };
    //        }
    //    }
    //});

    /////////////
    $('#select2DonorVaccination').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2DonorVaccination',
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
    })
    ///////////// Changed List to Dropdown.
    //$("#select2DonorVaccination").select2({
    //    placeholder: "Type to include multiple selection...",
    //    data: [],
    //    minimumInputLength: 0,
    //    tags: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2DonorVaccination',
    //        dataType: 'jsonp',
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term
    //            };
    //        },
    //        success: function () {

    //        },
    //        results: function (data, page) {
    //            var more = (page * pageSize) < data.Total;
    //            return { results: data.Results, more: more };
    //        }
    //    }
    //});

    $('#select2DonorStatus').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2DonorStatus',
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
        var Id = list[0];

        HandleDonorStatus(Id);

        });

    $('#select2BagType').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2BagType',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {

                return {
                    componentId: $('#select2SDPLRProcedures').select2('data')[0] == undefined ? 0 : $('#select2SDPLRProcedures').select2('data')[0].id, //c.GetSelect2Id('#select2SDPLRProcedures'),
                    currentDate: c.GetDateTimePickerDate('#dtDonationDate') == "" ? moment(Date()).format('DD-MMM-YYYY') : c.GetDateTimePickerDate('#dtDonationDate'),
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
        var ExpiryDate = list[2];

        c.DisableDateTimePicker('#dtDonationDate', false);
        c.SetSelect2('#select2DonorStatus', 4, 'Donated');

        //c.SetDateTimePicker('#dtExpiryDate', ExpiryDate);
        //$('.hideBleedingDate').hide();
        $('.hideExpiryDate').show();

        //if (ExpiryDate == '-') {
        //    c.SetDateTimePicker('#dtExpiryDate', '');
        //    c.MessageBoxErr("Error...", 'Expiry date is not mapped.');
        //    return;
        //}
        });


    //$('#select2BagType').select2({
    //    minimumInputLength: 0,
    //    allowClear: true
    //}).change(function (e) {
        
    //    var list = $("#select2BagType option:selected").data('list');;
    //    var ExpiryDate = list[2];

    //    c.DisableDateTimePicker('#dtDonationDate', false);
    //    c.SetSelect2('#select2DonorStatus', 4, 'Donated');

    //    c.SetDateTimePicker('#dtExpiryDate', ExpiryDate);
    //    //$('.hideBleedingDate').hide();
    //    $('.hideExpiryDate').show();

    //    if (ExpiryDate == '-') {
    //        c.SetDateTimePicker('#dtExpiryDate', '');
    //        c.MessageBoxErr("Error...", 'Expiry date is not mapped.');
    //        return;
    //    }
    //});

    $('#select2Phlebotomist').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Phlebotomist',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                var StationId = $("#ListOfStation").val();
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    StationId: (StationId == null || StationId == '' ? 30 : StationId) //30 bloodbank
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
 
    //$('#select2BBBagCompany').select2({
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2BBBagCompany',
    //        dataType: 'jsonp',
    //        cache: false,
    //        data: function (term, page) {
    //            return {
    //                pageSize: pageSize,
    //                pageNum: page,
    //                searchTerm: term
    //            };
    //        },
    //        results: function (data, page) {
    //            var more = (page * pageSize) < data.Total;
    //            return { results: data.Results, more: more };
    //        }
    //    }
    //}).change(function (e) {
    //    var list = e.added.list;

    //});
    $("#select2ScreenResult").select2({
        data: [],
        minimumInputLength: 0,
        tags: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2ScreeningResult',
            dataType: 'jsonp',
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term
                };
            },
            success: function () {

            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    });
    $('#select2Reaction').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Reaction',
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

    });
    $('#select2Venipuncture').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Venisite',
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

    });
 /*   $('#select2VolOfBlood').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2DonorRegBBBagQty',
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
                console.log(data);
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;

    });*/
  
    ajaxWrapper.Get($("#url").data("getvolumeblood"), null, function (x, e) {
        Sel2Client($("#select2VolOfBlood"), x, function (xx) {
        });
    });
    //ajaxWrapper.Get($("#url").data("getsdlprod"), null, function (x, e) {
    //    Sel2Client($("#select2SDPLRProcedures"), x, function (xx) {
    //    })
    //});


    ////////////
    $("#select2SDPLRProcedures").select2({
        placeholder: "Type to include multiple components...",
        data: [],
        minimumInputLength: 0,
        tags: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2SDPLR',
            dataType: 'jsonp',
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    currentDate: c.GetDateTimePickerDate('#dtDonationDate') == "" ? moment(Date()).format('DD-MMM-YYYY') : c.GetDateTimePickerDate('#dtDonationDate')
                };
            },
            success: function () {

            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    });
    ////////////

   /* $("#select2SDPLRProcedures").change(function (e) {
        var preselected = 4;
        if ($(this).select2('data').name == "Packed Red Blood Cells") {
            preselected = 4;
        }
        else {
            c.Select2Clear('#select2BagType');
            c.SetDateTimePicker('#dtExpiryDate', '');
            //$('.hideExpiryDate').hide();
        }

        getBagType(preselected);
    }); */

  /*  $('#select2SDPLRProcedures').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2SDPLR',
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

    });*/

 //   $('#select2VolOfBlood').val(0).trigger('change');
    //get blood volume 
 /*   $.ajax({
        url: baseURL + 'Select2DonorRegBBBagQty',
        data:  {
             
                pageSize: 1,
                pageNum: 1,
                searchTerm: 0
            
        },
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        cache: false,
        success: function (data) {
            console.log(data);
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + xhr.responseText;
            c.MessageBoxErr(errMsg);
        }
    });
    */
   // $('#select2VolOfBlood').select2("val", 1);

    $('#txtFindCondition01').select2({
        data: [
            { id: 1, text: '=' },
            { id: 2, text: '>' },
            { id: 3, text: '>=' },
            { id: 4, text: '<' },
            { id: 5, text: '<=' },
            { id: 6, text: 'Between' }
            //{ id: 7, text: 'like' }
        ],
        minimumInputLength: 0,
        allowClear: true      
    }).change(function (e) {
        var list = e.added;
        if (list.id == 6) { $('#txtFindRegistrationNo2').removeClass("hide"); }
        else { $('#txtFindRegistrationNo2').addClass("hide"); }
    });
    $('#txtFindCondition02').select2({
        data: [
            { id: 1, text: '=' },
            { id: 2, text: '>' },
            { id: 3, text: '>=' },
            { id: 4, text: '<' },
            { id: 5, text: '<=' },
            { id: 6, text: 'Between' }
            //{ id: 7, text: 'like' }
        ],
        minimumInputLength: 0,
        allowClear: true
    }).change(function (e) {
        var list = e.added;
        if (list.id == 6) { $('#dtFindRegistrationDate2').removeClass("hide"); }
        else { $('#dtFindRegistrationDate2').addClass("hide"); }
    });
    $('#txtFindCondition03').select2({
        data: [
            { id: 1, text: '=' },
            { id: 2, text: '>' },
            { id: 3, text: '>=' },
            { id: 4, text: '<' },
            { id: 5, text: '<=' },
            { id: 6, text: 'Between' }
            //{ id: 7, text: 'like' }
        ],
        minimumInputLength: 0,
        allowClear: true
    }).change(function (e) {
        var list = e.added;
        if (list.id == 6) { $('#dtFindDonationDate2').removeClass("hide"); }
        else { $('#dtFindDonationDate2').addClass("hide"); }
    });
    $('#txtFindCondition04').select2({
        data: [
            { id: 1, text: '=' },
            { id: 2, text: '>' },
            { id: 3, text: '>=' },
            { id: 4, text: '<' },
            { id: 5, text: '<=' },
            { id: 6, text: 'Between' }
            //{ id: 7, text: 'like' }
        ],
        minimumInputLength: 0,
        allowClear: true
    }).change(function (e) {
        var list = e.added;
        if (list.id == 6) { $('#txtFindAge2').removeClass("hide"); }
        else { $('#txtFindAge2').addClass("hide"); }
    });


    $('#txtFindDonorType').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2DonorType',
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
    });
    $('#txtFindBloodGroup').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2BloodGroup',
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
    });
    $('#txtFindDonorStatus').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2DonorStatus',
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
    });
    $('#txtFindGender').select2({
        //containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Gender',
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
    });


}
function InitDateTimePicker() {
    $('#dtDateOfIssue').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

        });

    $("#dtDateOfBirth").inputmask();

    //$('#dtDateOfBirth').datetimepicker({
    //    pickTime: false
    //}).on("dp.change", function (e) {
    //    //var age = c.DateDiffYears(c.GetDateTimePickerDate('#dtDateOfBirth'));
    //    //console.log('age');
    //    //console.log(age);
    //    //if (age != 0) {
    //    //    if (age <= 17 | age >= 60) {
    //    //        c.MessageBoxErr('Alert...', ' Age must be 18 years old above and below 60.');
                
    //    //    }
    //    //}
    //    //c.SetValue('#txtAge', age);
    //});
    $('#dtLastDonated').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtAdmitDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtDonationDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtDonationDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtBleedingDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtScreenDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    //$('#dtExpiryDate').datetimepicker({
    //    pickTime: false
    //}).on("dp.change", function (e) {

    //});

    $('#dtFindRegistrationDate1').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtFindRegistrationDate2').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtFindDonationDate1').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtFindDonationDate2').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
}
function InitDataTables() {
    //BindSubCenter([]);
    //BindFilter([]);
}
function SetupDataTables() {
    //    SetupSelectedSurgery();
    SetupFilter();
}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (TblGridList !== undefined) TblGridList.columns.adjust().draw();
    if (TblGridFilter !== undefined) TblGridFilter.columns.adjust().draw();
    if (TblGridDrugAllergies !== undefined) TblGridDrugAllergies.columns.adjust().draw();
    if (TblGridFoodAllergies !== undefined) TblGridFoodAllergies.columns.adjust().draw();
    if (TblGridSurgeries !== undefined) TblGridSurgeries.columns.adjust().draw();
    if (TblGridQuestionaire !== undefined) TblGridQuestionaire.columns.adjust().draw();
    //if (TblGridScreenResults !== undefined) TblGridScreenResults.columns.adjust().draw();
    
}
function Refresh() {
    ShowList(-1);
}

function DefaultReadOnly() {
    c.ReadOnly('#txtBBRegNo', true);
    c.ReadOnly('#txtUnitNo', true);
 
    c.ReadOnly('#txtBilrubin', true);
    c.ReadOnly('#txtSGPT', true);
    c.ReadOnly('#txtAusab', true);
    c.ReadOnly('#txtBloodGroup', true);
    c.ReadOnly('#txtBloodGroup', true);
    c.ReadOnly('#txtPIN1', true);
    c.ReadOnly('#txtPIN2', true);
    c.ReadOnly('#txtRegistration', true);
    
}
function DefaultValues() {
    //c.SetValue('#Id', "0");
    //c.SetDateTimePicker('#dtToday', moment());
    //c.SetSelect2('#select2TypeOfBlood', "0", 'Whole Blood');
    // { id: 0, text: 'IQAMA / S.ID' },

    c.SetSelect2('#select2TypeOfID', "0", 'IQAMA / S.ID');
    c.SetDateTimePicker('#dtDonationDate', moment());
    c.SetDateTimePicker('#dtBleedingDate', moment());
    c.SetDateTimePicker('#dtLastDonated', moment());
    //c.SetDateTimePicker('#dtDateOfBirth', moment());
    
    c.SetValue('#Id', "");
    c.SetValue('#txtRowsPerPage', 500);
    c.SetValue('#txtGetPage', 1);

    c.iCheckSet('#iChkCustom', false);
    c.Disable('#txtRowsPerPage', false);
    c.Disable('#txtGetPage', false);
    $("#CustomFilter").find("*").prop("disabled", true);

    c.SetSelect2('#select2VolOfBlood', 2,'450');

    $('#txtFindCondition01, #txtFindCondition02, #txtFindCondition03, #txtFindCondition04').select2("data", { id:"1", text:"=" });

    



    
}
function DefaultDisable() {
    //c.Disable('#txtOutsideBagNo', true);
    //c.DisableDateTimePicker('#dtFromDate', true);
    //c.DisableSelect2('#select2TypeOfBlood', true);
    //c.iCheckDisable('#iChkCompleted', true);

    c.DisableDateTimePicker('#dtDonationDate', true);
    //c.DisableDateTimePicker('#dtExpiryDate', true);
    c.DisableSelect2('#txtFindGender', true);
    c.DisableSelect2('#txtFindDonorType', true);
    c.DisableSelect2('#txtFindBloodGroup', true);
    c.DisableSelect2('#txtFindDonorStatus', true);

    
}
function DefaultEmpty() {
    c.SetValue('#Id', '');

    //c.SetValue('#Id', '');
    //c.ClearSelect2('#select2ScreeningResult');
    //c.SetDateTimePicker('#dtCollectionDate', '');
    //c.iCheckSet('#iChkCompleted', false);
    //BindSubCenter([]);

    c.SetValue('#PatientRegistrationNO', '');
    c.iCheckSet('#iChkWilling', false);
    c.SetValue('#txtID', '');
    c.SetDateTimePicker('#dtDateOfIssue', '');
    c.SetValue('#txtPlaceOfIssue', '');

    c.SetValue('#txtBBRegNo', '');
    c.SetValue('#txtUnitNo', '');
    c.SetDateTimePicker('#dtDonationDate', '');

    c.Select2Clear('#select2Title');
    c.SetValue('#txtDonorName', '');
    //c.SetDateTimePicker('#dtDateOfBirth', '');
    c.SetValue('#dtDateOfBirth', '');

    c.SetValue('#txtAge', '');
    c.Select2Clear('#select2Gender');
    c.Select2Clear('#select2Nationality');
    c.Select2Clear('#select2BloodGroup');

    c.SetValue('#txtAddress1', '');
    c.SetValue('#txtCellNo', '');
    c.SetValue('#txtPOBox', '');
    c.Select2Clear('#select2City');
    c.Select2Clear('#select2Country');
    c.SetValue('#txtZipCode', '');
    c.SetValue('#txtPhone', '');

    c.SetValue('#txtAddress2', '');
    c.SetValue('#txtEmail', '');
    c.SetValue('#txtPagerNo', '');
    c.Select2Clear('#select2Religion');
    c.Select2Clear('#select2Occupation');
    c.SetDateTimePicker('#dtLastDonated', '');
    c.Select2Clear('#select2MaritalStatus');

    c.Select2Clear('#select2TypeOfDonor');
    c.Select2Clear('#select2IssueBags');
    c.SetValue('#txtPIN1', '');
    c.SetDateTimePicker('#dtAdmitDate', '');
    c.Select2Clear('#select2DonatingFor');
    c.SetValue('#txtBloodGroup', '');
    c.SetValue('#txtPIN2', '');
    c.Select2Clear('#select2BedNo');

    c.SetValue('#txtBP', '');
    c.SetValue('#txtTemp', '');
    c.SetValue('#txtWeight', '');
    c.SetValue('#txtPulse', '');
    c.Select2Clear('#select2Reaction');
    c.Select2Clear('#select2Venipuncture');

    c.Select2Clear('#select2VolOfBlood');
    c.SetValue('#txtHemoglobin', '');
    c.SetValue('#txtPLt', '');
    c.SetValue('#txtHCT', '');
    c.SetValue('#txtBilrubin', '');
    c.SetValue('#txtSGPT', '');
    c.SetValue('#txtAusab', '');
    c.SetValue('#txtreason', '');

    c.SetValue('#txtOtherAllergies', '');
    c.Select2Clear('#select2DrugAllergies');
    c.Select2Clear('#select2FoodAllergies');
    c.Select2Clear('#select2Surgeries');
    c.Select2Clear('#select2DonorSuffers');
    c.Select2Clear('#select2DonorAntiDrugs');
    c.Select2Clear('#select2DonorVaccination');

    c.Select2Clear('#select2DonorStatus');
    c.Select2Clear('#select2SDPLRProcedures');
    //c.Select2Clear('#select2BagType');
    c.Select2Clear('#select2Phlebotomist');
    //c.Select2Clear('#select2BBBagCompany');
    c.SetValue('#txtRemarksDonorState', '');
    c.SetDateTimePicker('#dtBleedingDate', '');
    //c.SetDateTimePicker('#dtExpiryDate', '');
    c.SetDateTimePicker('#dtScreenDate', '');
    c.Select2Clear('#select2ScreenResult');

    c.Select2Clear('#select2DonorStatus');
    $('.hideBleedingDate').show();
    //$('.hideExpiryDate').hide();
    c.SetSelect2('#select2DonorStatus', '4', 'Donated');
    $("#tabcomponent").removeClass("cursordisable");
    c.Disable($("#tabcomponent"), false);
    $('.cancelreason').hide();
}

function Validated() {
    var req = false;
    var required = '';
    var ctr = 0;


    req = c.IsEmptyById('#txtID');
    if (req) {
        c.MessageBoxErr('Required...', 'PIN/ID is required.');
        return false;
    }


    req = c.IsDateEmpty('#dtDonationDate');
    if (req) {
        c.MessageBoxErr('Required...', 'Donation Date is required.');
        return false;
    }
    if (c.IsEmptySelect2('#select2Title')) {
        ctr++;
        required = required + '<br> ' + ctr + '. Select a Title.';
    }
    if (c.IsEmptyById('#txtAge')) {
        ctr++;
        required = required + '<br> ' + ctr + '. Input the Age.';
    } else {
        var age = $('#txtAge').val();
        if (age <= 17 | age >= 61) {
            required = required + '<br> ' + ctr + '.Age must be 18 years old above and below 60.';

        }
    }
    if ($('#txtHemoglobin').val() == "") {
        c.MessageBoxErr('Required...', 'Hemoglobin value required');
        return false;
    }
    else if (Number($('#txtHemoglobin').val()) <= 12.5 || Number($('#txtHemoglobin').val()) >= 17.5) {
        c.MessageBoxErr('Invalid...', 'Please enter valid Hemoglobin value');
        return false;
    }
    //req = c.IsDateEmpty('#dtDateOfBirth');
    //if (req) {
    //    c.MessageBoxErr('Required...', 'Birth Date is required.');
    //    return false;
    //}

    

    if (Action != 2) {

        req = c.IsEmptySelect2('#select2BloodGroup');
        if (req && $("#select2DonorStatus").select2('data').text != "Cancelled") {
            c.MessageBoxErr('Required...', 'Blood Group is required.');
            return false;
        }
 
            if (c.IsEmptySelect2('#select2TypeOfDonor')) {
                ctr++;
                required = required + '<br> ' + ctr + '. Select the type of donor.';
            }
       
            if (c.IsEmptySelect2('#select2DonorStatus')) {
                ctr++;
                required = required + '<br> ' + ctr + '. Select the donor status.';
            }
        //if (c.IsEmptySelect2('#select2BagType') && $("#select2DonorStatus").select2('data').text != "Cancelled") {
        //        ctr++;
        //        required = required + '<br> ' + ctr + '. Select a Bag Type.';
        //    }

            req = c.IsEmptyById('#txtHemoglobin');
            if (req) {
                ctr++;
                required = required + '<br> ' + ctr + '. Select Hemoglobin.';
            }

    }
  
    if (c.IsEmptyById('#txtDonorName')) {
        ctr++;
        required = required + '<br> ' + ctr + '. Enter the Donor Name.';
    }
    
    if (c.IsEmptyById('#txtID')) {
        ctr++;
        required = required + '<br> ' + ctr + '. Enter the Donor Iqama / Saudi ID.';
    }
    if (c.IsEmptySelect2('#select2Nationality')) {
        ctr++;
        required = required + '<br> ' + ctr + '. Select the Nationality.';
    }
    if (c.IsEmptySelect2('#select2Gender')) {
        ctr++;
        required = required + '<br> ' + ctr + '. Select the gender.';
    }
 
    if (isDonatingFor && c.IsEmptySelect2('#select2DonatingFor')) {
        ctr++;
        required = required + '<br> ' + ctr + '. Details for donating for.';
    }
    //if (isDonatingFor && c.IsEmptySelect2('#select2IssueBags')) {
    //    ctr++;
    //    required = required + '<br> ' + ctr + '. Details for donating for (Issue Bags).';
    //}
    
    //if (c.IsEmptySelect2('#select2VolOfBlood')) {
    //    ctr++;
    //    required = required + '<br> ' + ctr + '. Select a Volume of Blood.';
    //}
  
   

    
    if (c.IsEmptySelect2('#select2Phlebotomist')) {
        ctr++;
        required = required + '<br> ' + ctr + '. Select a Phlebotomist.';
    }
    if ($('#txtRemarksDonorState').val() == '' ) {
        ctr++;
        required = required + '<br> ' + ctr + '. Input a Donor Number / Remarks .';
    }
    

    if (required.length > 0) {
        c.MessageBoxErr('Enter the following details...', required);

        if ( c.IsEmptySelect2('#select2TypeOfDonor')) {
            c.SetActiveTab('sectionTypeDonor');
        }
        else if ( c.IsEmptyById('#txtHemoglobin')) {
            c.SetActiveTab('sectionhealthcond');
        }
        else {
            c.SetActiveTab('sectiondonorstate');
        }

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

        c.iCheckDisable('#iChkWilling', true);
        c.DisableSelect2('#select2TypeOfID', true);
        c.Disable('#txtID', true); 
        c.DisableDateTimePicker('#dtDateOfIssue', true);
        c.Disable('#txtPlaceOfIssue', true);

        c.DisableDateTimePicker('#dtDonationDate', true);

        c.DisableSelect2('#select2Title', true);
        c.Disable('#txtDonorName', true);
        //c.DisableDateTimePicker('#dtDateOfBirth', true);
        c.Disable('#dtDateOfBirth', true);

        c.DisableSelect2('#select2Gender', true);
        c.DisableSelect2('#select2Nationality', true);
        c.DisableSelect2('#select2BloodGroup', true);

        c.Disable('#txtreason', true);
        c.Disable('#txtAddress1', true);
        c.Disable('#txtCellNo', true);
        c.Disable('#txtPOBox', true);
        c.DisableSelect2('#select2City', true);
        c.DisableSelect2('#select2Country', true);
        c.Disable('#txtZipCode', true);
        c.Disable('#txtPhone', true);

        c.Disable('#txtAddress2', true);
        c.Disable('#txtEmail', true);
        c.Disable('#txtPagerNo', true);
        c.DisableSelect2('#select2Religion', true);
        c.DisableSelect2('#select2Occupation', true);
        c.DisableDateTimePicker('#dtLastDonated', true);
        c.DisableSelect2('#select2MaritalStatus', true);

        c.DisableSelect2('#select2TypeOfDonor', true);
        c.DisableSelect2('#select2IssueBags', true);
        c.DisableDateTimePicker('#dtAdmitDate', true);
        c.DisableSelect2('#select2DonatingFor', true);
        c.DisableSelect2('#select2BedNo', true);

        c.Disable('#txtBP', true);
        c.Disable('#txtTemp', true);
        c.Disable('#txtWeight', true);
        c.Disable('#txtPulse', true);
        c.DisableSelect2('#select2Reaction', true);
        c.DisableSelect2('#select2Venipuncture', true);

        c.DisableSelect2('#select2VolOfBlood', true);
        c.Disable('#txtHemoglobin', true);
        c.Disable('#txtPLt', true);
        c.Disable('#txtHCT', true);

        c.Disable('#txtOtherAllergies', true);
        c.DisableSelect2('#select2DrugAllergies', true);
        c.DisableSelect2('#select2FoodAllergies', true);
        c.DisableSelect2('#select2Surgeries', true);
        c.DisableSelect2('#select2DonorSuffers', true);
        c.DisableSelect2('#select2DonorAntiDrugs', true);
        c.DisableSelect2('#select2DonorVaccination', true);

        c.DisableSelect2('#select2DonorStatus', true);
        c.DisableSelect2('#select2SDPLRProcedures', true);
        //c.DisableSelect2('#select2BagType', true);
        c.DisableSelect2('#select2Phlebotomist', true);
        //c.DisableSelect2('#select2BBBagCompany', true);
        c.Disable('#txtRemarksDonorState', true);
        c.DisableDateTimePicker('#dtBleedingDate', true);
        //c.DisableDateTimePicker('#dtExpiryDate', true);
        c.DisableDateTimePicker('#dtScreenDate', true);
        c.DisableSelect2('#select2ScreenResult', true);
    }
    else if (Action == 1) { // add
        c.iCheckDisable('#iChkWilling', false);
        c.DisableSelect2('#select2TypeOfID', false);
        c.Disable('#txtID', false);
        c.DisableDateTimePicker('#dtDateOfIssue', false);
        c.Disable('#txtPlaceOfIssue', false);

        c.DisableDateTimePicker('#dtDonationDate', false);

        c.DisableSelect2('#select2Title', false);
        c.Disable('#txtDonorName', false);
        //c.DisableDateTimePicker('#dtDateOfBirth', false);
        c.Disable('#dtDateOfBirth', false);
        c.DisableSelect2('#select2Gender', false);
        c.DisableSelect2('#select2Nationality', false);
        c.DisableSelect2('#select2BloodGroup', false);

        c.Disable('#txtAddress1', false);
        c.Disable('#txtCellNo', false);
        c.Disable('#txtPOBox', false);
        c.DisableSelect2('#select2City', false);
        c.DisableSelect2('#select2Country', false);
        c.Disable('#txtZipCode', false);
        c.Disable('#txtPhone', false);

        c.Disable('#txtAddress2', false);
        c.Disable('#txtEmail', false);
        c.Disable('#txtPagerNo', false);
        c.DisableSelect2('#select2Religion', false);
        c.DisableSelect2('#select2Occupation', false);
        c.DisableDateTimePicker('#dtLastDonated', false);
        c.DisableSelect2('#select2MaritalStatus', false);

        c.DisableSelect2('#select2TypeOfDonor', false);

        c.DisableSelect2('#select2IssueBags', false);
        c.DisableDateTimePicker('#dtAdmitDate', true);
        c.DisableSelect2('#select2DonatingFor', false);
        c.DisableSelect2('#select2BedNo', false);

        c.Disable('#txtreason', false);
        c.Disable('#txtBP', false);
        c.Disable('#txtTemp', false);
        c.Disable('#txtWeight', false);
        c.Disable('#txtPulse', false);
        c.DisableSelect2('#select2Reaction', false);
        c.DisableSelect2('#select2Venipuncture', false);

        c.DisableSelect2('#select2VolOfBlood', false);
        c.Disable('#txtHemoglobin', false);
        c.Disable('#txtPLt', false);
        c.Disable('#txtHCT', false);

        c.Disable('#txtOtherAllergies', false);
        c.DisableSelect2('#select2DrugAllergies', false);
        c.DisableSelect2('#select2FoodAllergies', false);
        c.DisableSelect2('#select2Surgeries', false);
        c.DisableSelect2('#select2DonorSuffers', false);
        c.DisableSelect2('#select2DonorAntiDrugs', false);
        c.DisableSelect2('#select2DonorVaccination', false);

        c.DisableSelect2('#select2DonorStatus', false);
        c.DisableSelect2('#select2SDPLRProcedures', false);
        //c.DisableSelect2('#select2BagType', false);

        c.DisableSelect2('#select2Phlebotomist', false);
        //c.DisableSelect2('#select2BBBagCompany', false);
        c.Disable('#txtRemarksDonorState', false);
        c.DisableDateTimePicker('#dtBleedingDate', false);
        //c.DisableDateTimePicker('#dtExpiryDate', true);
        c.DisableDateTimePicker('#dtScreenDate', false);
        c.DisableSelect2('#select2ScreenResult', false);
    }
    else if (Action == 2) { // edit
        c.iCheckDisable('#iChkWilling', false);
        c.DisableSelect2('#select2TypeOfID', Action == 2);
        c.Disable('#txtID', Action == 2);
        c.DisableDateTimePicker('#dtDateOfIssue', false);
        c.Disable('#txtPlaceOfIssue', false);

        c.DisableDateTimePicker('#dtDonationDate', false);

        c.DisableSelect2('#select2Title', false);
        c.Disable('#txtDonorName', false);
        //c.DisableDateTimePicker('#dtDateOfBirth', false);
        c.Disable('#dtDateOfBirth', false);
        c.DisableSelect2('#select2Gender', false);
        c.DisableSelect2('#select2Nationality', false);
        c.DisableSelect2('#select2BloodGroup', Action == 2);

        c.Disable('#txtreason', false);
        c.Disable('#txtAddress1', false);
        c.Disable('#txtCellNo', false);
        c.Disable('#txtPOBox', false);
        c.DisableSelect2('#select2City', false);
        c.DisableSelect2('#select2Country', false);
        c.Disable('#txtZipCode', false);
        c.Disable('#txtPhone', false);

        c.Disable('#txtAddress2', false);
        c.Disable('#txtEmail', false);
        c.Disable('#txtPagerNo', false);
        c.DisableSelect2('#select2Religion', false);
        c.DisableSelect2('#select2Occupation', false);
        c.DisableDateTimePicker('#dtLastDonated', false);
        c.DisableSelect2('#select2MaritalStatus', false);

        c.DisableSelect2('#select2TypeOfDonor', false);
        if (Action == 2) c.DisableSelect2('#select2TypeOfDonor', true); // if action is edit.

        c.DisableSelect2('#select2IssueBags', false);
        c.DisableDateTimePicker('#dtAdmitDate', true);
        c.DisableSelect2('#select2DonatingFor', false);
        c.DisableSelect2('#select2BedNo', false);

        c.Disable('#txtBP', false);
        c.Disable('#txtTemp', false);
        c.Disable('#txtWeight', false);
        c.Disable('#txtPulse', false);
        c.DisableSelect2('#select2Reaction', false);
        c.DisableSelect2('#select2Venipuncture', false);

        c.DisableSelect2('#select2VolOfBlood', false);
        c.Disable('#txtHemoglobin', false);
        c.Disable('#txtPLt', false);
        c.Disable('#txtHCT', false);

        c.Disable('#txtOtherAllergies', false);
        c.DisableSelect2('#select2DrugAllergies', false);
        c.DisableSelect2('#select2FoodAllergies', false);
        c.DisableSelect2('#select2Surgeries', false);
        c.DisableSelect2('#select2DonorSuffers', false);
        c.DisableSelect2('#select2DonorAntiDrugs', false);
        c.DisableSelect2('#select2DonorVaccination', false);

        c.DisableSelect2('#select2DonorStatus', Action == 2);
        c.DisableSelect2('#select2SDPLRProcedures', Action == 2);
        //c.DisableSelect2('#select2BagType', Action == 2);

        c.DisableSelect2('#select2Phlebotomist', false);
        //c.DisableSelect2('#select2BBBagCompany', false);
        c.Disable('#txtRemarksDonorState', false);
        c.DisableDateTimePicker('#dtBleedingDate', false);
        //c.DisableDateTimePicker('#dtExpiryDate', true);
        c.DisableDateTimePicker('#dtScreenDate', false);
        c.DisableSelect2('#select2ScreenResult', false);
    }
    else {
        c.Show('#Entry', false);
        c.Show('#DashBoard', true);
    }
}
function HandleButtonNotUse() {
    $('.NotUse').hide();
}
function HandleDonorStatus(Id) {

    var Add_Edit = (Action == 1 || Action == 2);

    if (Add_Edit)
    {
        c.DisableDateTimePicker('#dtDonationDate', true);
        //c.SetSelect2('#select2BagType', '', '');  why is this??
    }

    if (Id == 2) // rejected/cancelled
    {
        $('.hideBleedingDate').hide();
        $('.hideExpiryDate').hide();
        $('.cancelreason').show();
        $("#select2SDPLRProcedures").removeClass("RequiredField");
        $(".clstypeofdonation").hide();
        $(".clsbleeding").hide();
        //$("#select2BagType").removeClass("RequiredField");
        $("#tabcomponent").addClass("cursordisable");
        c.Disable($("#tabcomponent"), true);
        c.Select2Clear('#select2BloodGroup');
        //c.Select2Clear('#select2BagType');
        //c.SetDateTimePicker('#dtExpiryDate', '');
    }
    //else if (Id == 3 ) // accepted 
    //{
    //    $('.hideBleedingDate').show();
    //    $('.hideExpiryDate').hide();
    //    $(".cancelreason #txtreason").val('');
    //    $('.cancelreason').hide();
    //}
    else if (Id == 4 ) // donated 
    {
        $("#tabcomponent").removeClass("cursordisable");
        c.Disable($("#tabcomponent"), false);
        //$("#select2BagType").addClass("RequiredField");
        $('.hideBleedingDate').hide();
        $('.hideExpiryDate').show();
        $(".cancelreason #txtreason").val('');
        $('.cancelreason').hide();
        $("#select2SDPLRProcedures").addClass("RequiredField");
        $(".clstypeofdonation").show();
        $(".clsbleeding").show();
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

    entry.ID = c.GetValue('#txtUnitNo');
    entry.idd = c.GetValue('#Id');

    entry.Name = c.GetValue('#txtDonorName');
    entry.ppobox = c.GetValue('#txtPOBox');
    entry.address1 = c.GetValue('#txtAddress1');
    entry.cityname = " ";
    entry.address2 = c.GetValue('#txtAddress2');
    entry.pzipcode = c.GetValue('#txtZipCode');
    entry.pphone = c.GetValue('#txtPhone');
    entry.pcellno = c.GetValue('#txtCellNo');
    //entry.DateTime = '';
    //entry.DateofBirth = c.GetDateTimePickerDate('#dtDateOfBirth');

    entry.DateofBirth = c.GetServerDateFromMask('#dtDateOfBirth');
    entry.Age = c.GetValue('#txtAge');
    entry.Sex = c.GetSelect2Id('#select2Gender');
    entry.BloodGroup = c.GetSelect2Id('#select2BloodGroup');
    entry.Religion = c.GetSelect2Text('#select2Religion'); // gettext
    entry.Occupation = c.GetSelect2Text('#select2Occupation'); // gettext
    entry.Maritialstatus = c.GetSelect2Id('#select2MaritalStatus');
    entry.LastDonatedDate = c.GetDateTimePickerDate('#dtLastDonated');
    entry.DonorType = c.GetSelect2Id('#select2TypeOfDonor');
    entry.ipid = c.GetValue('#select2DonatingFor');
    entry.OPNO = '0';
    entry.Hb = c.GetValue('#txtHemoglobin');
    entry.Weight = c.GetValue('#txtWeight');
    entry.BP = c.GetValue('#txtBP');
    entry.Temperature = c.GetValue('#txtTemp');
    entry.Pulse = c.GetValue('#txtPulse');
    entry.Phlebotomist = c.GetSelect2Id('#select2Phlebotomist');
    entry.volumeDrawn = c.GetSelect2Id('#select2VolOfBlood');

    entry.Procid = $('#select2SDPLRProcedures').val(); //c.GetSelect2Id('#select2SDPLRProcedures');
    //entry.Bagtype = c.GetSelect2Id('#select2BagType'); 
    //entry.Company = c.GetSelect2Id('#select2BBBagCompany');
    entry.Venisite = c.GetSelect2Id('#select2Venipuncture');
    entry.WillingTodonate = c.GetICheck('#iChkWilling');
    entry.HealthHistory = c.GetValue('#txtOtherAllergies');        
    entry.stationid = $('#ListOfStation').val();
    entry.Title = c.GetSelect2Id('#select2Title');
    //entry.District = '';
    entry.HospitalId = 0;
    entry.Type = ' '; // ??
    //entry.GroupOperatorId = '';
    //entry.Status = '';
    //entry.DonorNo = '';
    entry.DonorRegistrationNO = c.GetValue('#txtBBRegNo');
    //entry.ExpiryDate = c.GetDateTimePickerDate('#dtExpiryDate');
    entry.Remarks = c.GetValue('#txtRemarksDonorState');
    entry.DonorStatus = c.GetSelect2Id('#select2DonorStatus');
    entry.DonatedDate = c.GetDateTimePickerDate('#dtDonationDate');
    entry.ReactionId = c.GetSelect2Id('#select2Reaction');
    entry.nationality = c.GetSelect2Id('#select2Nationality');
    entry.bleddingdate = c.GetDateTimePickerDate('#dtBleedingDate');
    entry.iqama = c.GetValue('#txtID');    
    entry.pcity = c.GetValue('#select2City');
    entry.country = c.GetValue('#select2Country');
    entry.countryname = " ";
    entry.pemail = c.GetValue('#txtEmail');
    entry.ppagerno = c.GetValue('#txtPagerNo');
    entry.IssueAuthorityCode = '';
    entry.Iqamaissuedate = c.GetDateTimePickerDate('#dtDateOfIssue');
    entry.IqamaIssuePlace = c.GetValue('#txtPlaceOfIssue');
    entry.Sgpt = c.GetValue('#txtSGPT');
    entry.Bilrubin = c.GetValue('#txtBilrubin');
    entry.hct = c.GetValue('#txtHCT');
    entry.plt = c.GetValue('#txtPLt');
    entry.Reason = c.GetValue("#txtreason");
    var arr;
    //positive questions
    var questPos = 0;
    var questNeg = 0;
    entry.Questionairespos = [];

    $.each(TblGridQuestionaire.rows().data(), function (index, row) {

        var ischked = $($(TblGridQuestionaireId + " > tbody > tr")[index]).find('[id=chkSelectedQuestionaires]').prop('checked');
        var isindeterminate = $($(TblGridQuestionaireId + " > tbody > tr")[index]).find('[id=chkSelectedQuestionaires]').prop('indeterminate');

        if (ischked == true) {
            questPos += row.id;
        }
        else if (isindeterminate == true) {
            questNeg += row.id;
        }
    });
    entry.Questionairespos = questPos;
    entry.Questionairesneg = questNeg;

    entry.DonorDrugAllergies = [];
    arr = $('#select2DrugAllergies').val();
    $.each(arr.split(','), function (i, val) {
        entry.DonorDrugAllergies.push({
            Drugid: val
        });
    });

    entry.DonorFoodAllergies = [];
    arr = $('#select2FoodAllergies').val();
    $.each(arr.split(','), function (i, val) {
        entry.DonorFoodAllergies.push({
            FoodAllergyid: val
        });
    });

    entry.DonorSurgeries = [];
    arr = $('#select2Surgeries').val();
    $.each(arr.split(','), function (i, val) {
        entry.DonorSurgeries.push({
            Surgeryid: val
        });
    });

    entry.ComponentList = [];
    arr = $('#select2SDPLRProcedures').select2('data');
    debugger;
    $.each(arr, function (index, el) {
        var des = this.text.split('Exp:')
        entry.ComponentList.push({
            componentId: arr[index].id,
            componentExp: c.GetDate($.trim(des[1]), "-")
        });
    });

    var sumSuffers = 0;
    arr = $('#select2DonorSuffers').val();
    $.each(arr.split(','), function (i, val) {
        sumSuffers = Number(sumSuffers) + Number(val);
    });
    entry.Suffers = sumSuffers;

    var sumVaccination = 0;
    arr = $('#select2DonorVaccination').val();
    $.each(arr.split(','), function (i, val) {
        sumVaccination = Number(sumVaccination) + Number(val);
    });
    entry.Vaccination = sumVaccination;

    var sumAntidrugs = 0;
    arr = $('#select2DonorAntiDrugs').val();
    $.each(arr.split(','), function (i, val) {
        sumAntidrugs = Number(sumAntidrugs) + Number(val);
    });
    entry.Antidrugs = sumAntidrugs;
   
    var sumscreenvalue = 0;
    //var rowcollection = TblGridScreenResults.$("#chkSelScreenRes:checked", { "page": "all" });
    //rowcollection.each(function (index, elem) {
    //    var tr = $(elem).closest('tr');
    //    var row = TblGridScreenResults.row(tr);
    //    var rowdata = row.data();
    //    sumscreenvalue = Number(sumscreenvalue) + Number(rowdata['id']);
    //});        
    entry.screenvalue = sumscreenvalue;

    //entry.screenresult = ''; 
    //entry.PAmount = '';
        
    entry.screendate = c.GetDateTimePickerDate('#dtScreenDate');
    entry.Ausab = '0';

    entry.PatientRegistrationNO = c.GetValue('#PatientRegistrationNO');
    //entry.BillNo = '';

    entry.IssueID = c.GetSelect2Id('#select2IssueBags');
    //entry.IssueMappedDateTime = null;

    //entry.Aganistbill = '';
    entry.IssueBagnumber = c.GetSelect2Text('#select2IssueBags');
    //entry.PRINTNO = '';
    //entry.labno = '';

    $.ajax({
        url: baseURL + 'Save',
        data: JSON.stringify(entry),
        dataType: 'json',
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            c.ButtonDisable('#btnSave', true);
        },
        success: function (data) {
            c.ButtonDisable('#btnSave', false);

            //if (data.ErrorCode == 0) {
            //    c.MessageBoxErr("Error...", data.Message);
            //    return;
            //}

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
                $('#btnClose').click();
            };

            c.MessageBox(data.Title, data.Message , OkFunc);
        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#btnSave', false);
            var errMsg = err + "<br>" + xhr.responseText;
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

            c.SetValue('#Id', data.idd);

            c.SetValue('#txtID', data.iqama);

            c.SetDateTimePicker('#dtDateOfIssue', data.IqamaissuedateD);
            c.SetValue('#txtPlaceOfIssue', data.IqamaIssuePlace);
            c.SetValue('#txtBBRegNo', data.DonorRegistrationNO);
            c.SetValue('#txtUnitNo', data.ID);
            c.SetSelect2('#select2Title', data.Title, data.TitleName);
            c.SetValue('#txtDonorName', data.Name);
            //c.SetDateTimePicker('#dtDateOfBirth', data.DateofBirthD);

            //c.SetValue('#dtDateOfBirth', data.DateofBirthD);
            c.SetValue('#dtDateOfBirth', c.FetchMaskDate(data.DateofBirthD));

            c.SetValue('#txtAge', data.Age);
            c.SetSelect2('#select2Gender', data.Sex, data.SexName);
            c.SetSelect2('#select2Nationality', data.nationality, data.NationalityName);
            c.SetSelect2('#select2BloodGroup', data.BloodGroup, data.BloodGroupName);

            c.SetValue('#txtAddress1', data.address1);
            c.SetValue('#txtCellNo', data.pcellno);
            c.SetValue('#txtPOBox', data.ppobox);
            c.SetSelect2('#select2City', data.pcity, data.pcityname);
            c.SetSelect2('#select2Country', data.country, data.countryname1);
            c.SetValue('#txtZipCode', data.pzipcode);
            c.SetValue('#txtPhone', data.pphone);

            c.SetValue('#txtAddress2', data.address2);
            c.SetValue('#txtEmail', data.pemail);
            c.SetValue('#txtPagerNo', data.ppagerno);
            c.SetSelect2('#select2Religion', data.ReligionId, data.Religion);
            c.SetSelect2('#select2Occupation', data.OccupationId, data.Occupation);

            c.SetDateTimePicker('#dtDonationDate', data.DonatedDateD);
            c.SetDateTimePicker('#dtBleedingDate', data.bleddingdate);
            c.SetDateTimePicker('#dtLastDonated', data.LastDonatedDateD);
            c.SetSelect2('#select2MaritalStatus', data.Maritialstatus, data.MaritialstatusName);

            var donatingFor = data.DonatingFor[0];
            c.SetSelect2('#select2TypeOfDonor', data.DonorType, data.DonorTypeName);

            if (data.DonorTypeName == undefined || data.DonorTypeName == "Voluntary" || data.DonorTypeName == "Other Donors" ) {
                $('#DonatingFor').hide();
            }
            else if (donatingFor !== undefined) {
                c.SetSelect2('#select2DonatingFor', donatingFor.id, donatingFor.name);
                c.SetValue('#txtPIN1', donatingFor.PIN);
                c.SetValue('#txtPIN2', donatingFor.PIN);
                c.SetValue('#txtBloodGroup', donatingFor.bloodgroup);
                c.SetSelect2('#select2BedNo', donatingFor.BedId, donatingFor.Bed);                
                c.SetDateTimePicker('#dtAdmitDate', donatingFor.AdmitDateTime); 
                $('#DonatingFor').show();
            }
            c.SetSelect2('#select2IssueBags', data.IssueID, data.IssueIDName); 

            c.SetValue('#txtBP', data.BP);
            c.SetValue('#txtTemp', data.Temperature);
            c.SetValue('#txtWeight', data.Weight);
            c.SetValue('#txtPulse', data.Pulse);
            c.SetSelect2('#select2Reaction', data.ReactionId, data.ReactionName);
            c.SetSelect2('#select2Venipuncture', data.Venisite, data.VenisiteName);

            c.SetSelect2('#select2VolOfBlood', data.volumeDrawn, data.volumeDrawnName);
            c.SetValue('#txtHemoglobin', data.Hb);
            c.SetValue('#txtPLt', data.plt);
            c.SetValue('#txtHCT', data.hct);
            c.SetValue('#txtBilrubin', data.Bilrubin);
            c.SetValue('#txtSGPT', data.Sgpt);
            c.SetValue('#txtAusab', data.Ausab);
            c.SetValue('#txtreason', data.Reason);
            c.iCheckSet('#iChkWilling', data.WillingTodonate);

            c.SetValue('#txtOtherAllergies', data.HealthHistory);
            c.SetSelect2List('#select2DrugAllergies', data.GetSelectedDrugAllergies);
            c.SetSelect2List('#select2FoodAllergies', data.GetSelectedFoodAllergies);
            c.SetSelect2List('#select2Surgeries', data.GetSelected2Surgeries);
            c.SetValue('#txtRemarksDonorState', data.Remarks);

            if (data.GetSelected2Suffers != "") {
                c.SetSelect2('#select2DonorSuffers', data.GetSelected2Suffers[0].id, data.GetSelected2Suffers[0].name);
            }
            if (data.GetSelected2DonorVaccination != "") {
                c.SetSelect2('#select2DonorVaccination', data.GetSelected2DonorVaccination[0].id, data.GetSelected2DonorVaccination[0].name);
            }
            if (data.GetSelected2DonorAntiDrugs != "") {
                c.SetSelect2('#select2DonorAntiDrugs', data.GetSelected2DonorAntiDrugs[0].id, data.GetSelected2DonorAntiDrugs[0].name);
            }
            //// Changed List to Dropdown.
            //c.SetSelect2List('#select2DonorSuffers', data.GetSelected2Suffers);
            //c.SetSelect2List('#select2DonorVaccination', data.GetSelected2DonorVaccination);
            //c.SetSelect2List('#select2DonorAntiDrugs', data.GetSelected2DonorAntiDrugs);

            c.SetSelect2('#select2DonorStatus', data.DonorStatus, data.DonorStatusName);
            HandleDonorStatus(data.DonorStatus);
            debugger;
            var expDate = data.ExpirydateD.replace(new RegExp(' ', 'g'), '-');
            c.SetSelect2('#select2SDPLRProcedures', data.Procid, data.ProcidName + ', Exp: ' + expDate);
            //c.SetSelect2('#select2BagType', data.Bagtype, data.BagtypeName);
            c.SetSelect2('#select2Phlebotomist', data.Phlebotomist, data.PhlebotomistName);
            //c.SetSelect2('#select2BBBagCompany', data.Company, data.CompanyName);
            c.SetDateTimePicker('#dtScreenDate', data.screendateD);
            //c.SetDateTimePicker('#dtExpiryDate', data.ExpirydateD);

           // BindScreenResults(data.GetSelected2ScreeningResult);

            HandleEnableButtons();
            HandleEnableEntries();
            bindQuestionaireData(data);
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + xhr.responseText;
            c.MessageBoxErr(errMsg);
        }
    });
}

function bindQuestionaireData(data) {

    $('.chkSelectedQuestionaires').prop('checked', false)
    $('.chkSelectedQuestionaires').prop('indeterminate', false);
    $.each(TblGridQuestionaire.rows().data(), function (index, row) {

        var isfound = false;
        var status = 0;
        
        $.each(data.QuestionaireList, function () {
            if (this.id == row.id) {
                isfound = true;
                status = this.chk;
            }
        });

        if (isfound == true) {
            if (status == 1) {
                $($(TblGridQuestionaireId + " > tbody > tr")[index]).find('[id=chkSelectedQuestionaires]').prop('checked', true);
            }
            else {
                $($(TblGridQuestionaireId + " > tbody > tr")[index]).find('[id=chkSelectedQuestionaires]').prop('indeterminate', true);
            }
        }
    });
}

function Search() {

    var tid = c.GetSelect2Id('#select2TypeOfID');
    var ttext = c.GetSelect2Text('#select2TypeOfID');

    var Value = $('#txtID').val();
    var Url = baseURL + "DonorRegistrationSearch";
    var param = {
        SearchBy: $('#select2TypeOfID').select2('data').id,
        Value: Value
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

            DefaultEmpty();
            DefaultValues();
            
            c.SetValue('#txtID', Value);
            c.SetSelect2('#select2TypeOfID', tid, ttext);

            //if (data.list.length == 0) {
            //    c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
            //    TblGridList.row('tr.selected').remove().draw(false);
            //    RedrawGrid();
            //    return;
            //}

            try {
                if (data.ErrorCode == 0) {
                    c.MessageBoxErr("Error...", data.Message);
                    RedrawGrid();
                    return;
                }
            } catch (err) {                
            }

            var data = data.list[0];
            if (data == undefined) return;
            
            console.log('data.SelectedDrugAllergies');
            console.log(data.SelectedDrugAllergies);
            c.SetValue('#Id', data.Registrationno);
            c.SetDateTimePicker('#dtDateOfIssue', data.DateOfIssue);
            c.SetValue('#txtPlaceOfIssue', data.PlaceOfIssue);
            c.SetSelect2('#select2Title', data.TitleId, data.Title);
            c.SetValue('#txtDonorName', data.DonorName);
            //c.SetDateTimePicker('#dtDateOfBirth', data.DateOfBirthS);
            c.SetValue('#dtDateOfBirth', c.FetchMaskDate(data.DateofBirthD));
            c.SetValue('#txtAge', data.Age);
            c.SetSelect2('#select2Gender', data.TitleId, data.Title);
            c.SetSelect2('#select2Nationality', data.Nationality, data.NationalityName);
            c.SetSelect2('#select2BloodGroup', data.BloodGroup, data.BloodGroupName);

            c.SetValue('#txtAddress1', data.Address1);
            c.SetValue('#txtAddress2', data.Address2);
            //c.SetValue('#txtCellNo', data.Address2);
            c.SetValue('#txtPOBox', data.Address3);
            c.SetSelect2('#select2City', data.PCity, data.CityName);
            c.SetSelect2('#select2Country', data.Country, data.CountryName);
            c.SetValue('#txtZipCode', data.pZipCode);
            c.SetValue('#txtPhone', data.Gphone);
            c.SetValue('#txtEmail', data.PEMail);
            c.SetSelect2('#select2Religion', data.Religion, data.ReligionName);
            c.SetSelect2('#select2Occupation', data.OccupationId, data.Occupation);
            c.SetSelect2('#select2MaritalStatus', data.MaritalStatus, data.MaritalStatusName);            
            
            c.SetSelect2List('#select2DrugAllergies', data.SelectedDrugAllergies);
            c.SetSelect2List('#select2FoodAllergies', data.SelectedFoodAllergies);
            c.SetSelect2List('#select2Surgeries', data.SelectedSurgeries);
            
            
            //HandleEnableButtons();
            //HandleEnableEntries();
            RedrawGrid();


        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + xhr.responseText;
            c.MessageBoxErr(errMsg);
        }
    });
}

function ShowListColumns() {
    var cols = [
        { targets: [0], data: "ctr", title: '#', className: '', visible: true, searchable: true, width: "0%" },
        { targets: [1], data: "W", title: 'W', className: '', visible: true, searchable: false, width: "0%" },
        { targets: [2], data: "UnitNo", title: 'UnitNo', className: '', visible: true, searchable: true, width: "0%" },
        { targets: [3], data: "RegistrationNO", title: 'RegistrationNo', className: '', visible: true, searchable: true, width: "0%" },
        { targets: [4], data: "DonorName", title: 'DonorName', className: '', visible: true, searchable: true, width: "15%" },
        { targets: [5], data: "DonatedDateD", title: 'DonatedDate', className: '', visible: true, searchable: true, width: "0%" },
        { targets: [6], data: "Age", title: 'Age', className: 'Age', visible: true, searchable: true, width: "2%" },
        { targets: [7], data: "Gender", title: 'Gender', className: 'Gender', visible: true, searchable: true, width: "0%" },
        { targets: [8], data: "BloodGroupName", title: 'BloodGroup', className: '', visible: true, searchable: true, width: "0%" },
        { targets: [9], data: "iqama", title: 'iqama', className: '', visible: true, searchable: true, width: "0%" },
        { targets: [10], data: "address1", title: 'Address1', className: '', visible: true, searchable: true, width: "0%" },
        //{ targets: [11], data: "address2", title: 'Address2', className: '', visible: true, searchable: true, width: "0%" },
        { targets: [12], data: "pphone", title: 'Phone', className: '', visible: true, searchable: true, width: "0%" },
        { targets: [13], data: "DonorTypeName", title: 'DonorType', className: '', visible: true, searchable: true, width: "0%" },
        { targets: [14], data: "PIN", title: 'PIN', className: '', visible: true, searchable: true, width: "0%" },
        {
            targets: [15], data: function (row, data) {
                
                return '<span id="donorbarcode" onclick="saveBarcode(this)" class="glyphicon glyphicon-barcode"></span>'
            }, title: 'Action', className: '', visible: true, searchable: true, width: "0%" },
        { targets: [16], data: "idd", title: 'idd', className: '', visible: false, searchable: false, width: "0%" },
        { targets: [17], data: "DonorStatus", title: 'DonorStatus', className: '', visible: false, searchable: false, width: "0%" }
    ];
    return cols;
}

function saveBarcode(element) {

    var tbl = $(TblGridListId).DataTable();
    var idd = tbl.row($(element).closest('tr')).data()['idd'];

    $.ajax({
        type: "POST",
        url: $("#url").data("savebarcode"),
        data: { idd: idd, workStationIp: $("#hidMyIp").val() },
        success: function (data) {
            var result = data;
            printBarcode(result);
        },
        error: function (errorData) {
            var result = JSON.parse(errorData)
        }
    });
}

function printBarcode(result) {
    debugger;
    //Send to PrinterHub
    $.ajax({
        type: "POST",
        url: $("#hidPrinterHubUrl").val(),
        data: { WorkStationIp: $("#hidMyIp").val(), DocumentTypeId: 50, ReferenceId: result.refId },
        success: function (apiData) {
            var result = JSON.parse(apiData)
            if (result.Code == 0) {
                alert(result.Details);
            }
        },
        error: function (errorData) {
            var result = JSON.parse(errorData)
            alert(result.Details);
        }
    })
}

function ShowListRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['Status'];
        var $nRow = $(nRow);
        if (value === 2) {
            $nRow.css({ "background-color": "#fcc9c9" }); // rejected
        }
        else if (value === 3) {
            $nRow.css({ "background-color": "#fff68b" }); // accepted
        }
        else if (value === 1) {
            $nRow.css({ "background-color": "#fff" }); // donated
        }
    };
    return rc;
}
function ShowList(id) {
    
    var Url = baseURL + "ShowList";
    var isCustom = c.GetICheck('#iChkCustom') == 1;

    var para;
    para = [];
    para = {};

    para.DonorRegFilter = [];
    para.Id = isCustom ? -2 : -1;

    var filter = [ 
        { SearchForId: 1, SearchFor: 'Iqama / Saudi ID', OperatorId: 1, Operator: '=', Value1: c.GetValue('#txtFindIqama'), Value2: '', ActualValue1: c.GetValue('#txtFindIqama'), ActualValue2: '', Column: 'iqama' },
        { SearchForId: 2, SearchFor: 'PIN', OperatorId: 1, Operator: '=', Value1: c.GetValue('#txtFindPIN'), Value2: '', ActualValue1: c.GetValue('#txtFindPIN'), ActualValue2: '', Column: 'PatientRegistrationNO' },
        { SearchForId: 3, SearchFor: 'Registration NO', OperatorId: parseInt(c.GetSelect2Id('#txtFindCondition01')), Operator: c.GetSelect2Text('#txtFindCondition01'), Value1: c.GetValue('#txtFindRegistrationNo1'), Value2: c.GetValue('#txtFindRegistrationNo2'), ActualValue1: c.GetValue('#txtFindRegistrationNo1'), ActualValue2: c.GetValue('#txtFindRegistrationNo2'), Column: 'DonorRegistrationNO' },
        { SearchForId: 4, SearchFor: 'Registration Date', OperatorId: parseInt(c.GetSelect2Id('#txtFindCondition02')), Operator: c.GetSelect2Text('#txtFindCondition02'), Value1: c.GetDateTimePickerDate('#dtFindRegistrationDate1'), Value2: c.GetDateTimePickerDate('#dtFindRegistrationDate2'), ActualValue1: c.GetDateTimePickerDate('#dtFindRegistrationDate1'), ActualValue2: c.GetDateTimePickerDate('#dtFindRegistrationDate2'), Column: 'DateTime' },
        { SearchForId: 5, SearchFor: 'Donation Date', OperatorId: parseInt(c.GetSelect2Id('#txtFindCondition03')), Operator: c.GetSelect2Text('#txtFindCondition03'), Value1: c.GetDateTimePickerDate('#dtFindDonationDate1'), Value2: c.GetDateTimePickerDate('#dtFindDonationDate2'), ActualValue1: c.GetDateTimePickerDate('#dtFindDonationDate1'), ActualValue2: c.GetDateTimePickerDate('#dtFindDonationDate2'), Column: 'DonatedDate' },
        { SearchForId: 6, SearchFor: 'Age', OperatorId: parseInt(c.GetSelect2Id('#txtFindCondition04')), Operator: c.GetSelect2Text('#txtFindCondition04'), Value1: c.GetValue('#txtFindAge1'), Value2: c.GetValue('#txtFindAge2'), ActualValue1: c.GetValue('#txtFindAge1'), ActualValue2: c.GetValue('#txtFindAge2'), Column: 'Age' },
        { SearchForId: 7, SearchFor: 'Donor Name', OperatorId: 7, Operator: 'Like', Value1: c.GetValue('#txtFindDonorName'), Value2: '', ActualValue1: c.GetValue('#txtFindDonorName'), ActualValue2: '', Column: 'Name' },
        { SearchForId: 8, SearchFor: 'Gender', OperatorId: 1, Operator: '=', Value1: c.GetSelect2Id('#txtFindGender'), Value2: '', ActualValue1: c.GetSelect2Id('#txtFindGender'), ActualValue2: '', Column: 'Sex' },
        { SearchForId: 9, SearchFor: 'Address 1', OperatorId: 1, Operator: '=', Value1: c.GetValue('#txtFindAddress1'), Value2: '', ActualValue1: c.GetValue('#txtFindAddress1'), ActualValue2: '', Column: 'address1' },
        { SearchForId: 10, SearchFor: 'Address 2', OperatorId: 1, Operator: '=', Value1: c.GetValue('#txtFindAddress2'), Value2: '', ActualValue1: '', ActualValue2: c.GetValue('#txtFindAddress2'), Column: 'address2' },
        { SearchForId: 11, SearchFor: 'Bag No', OperatorId: 1, Operator: '=', Value1: c.GetValue('#txtFindBagNo'), Value2: '', ActualValue1: c.GetValue('#txtFindBagNo'), ActualValue2: '', Column: 'ID' },
        { SearchForId: 12, SearchFor: 'Donor Type', OperatorId: 1, Operator: '=', Value1: c.GetSelect2Id('#txtFindDonorType'), Value2: '', ActualValue1: c.GetSelect2Id('#txtFindDonorType'), ActualValue2: '', Column: 'DonorType' },
        { SearchForId: 13, SearchFor: 'Blood Group', OperatorId: 1, Operator: '=', Value1: c.GetSelect2Id('#txtFindBloodGroup'), Value2: '', ActualValue1: c.GetSelect2Id('#txtFindBloodGroup'), ActualValue2: '', Column: 'BloodGroup' },
        { SearchForId: 14, SearchFor: 'Donor Status', OperatorId: 1, Operator: '=', Value1: c.GetSelect2Id('#txtFindDonorStatus'), Value2: '', ActualValue1: c.GetSelect2Id('#txtFindDonorStatus'), ActualValue2: '', Column: 'DonorStatus' }
    ];
    para.DonorRegFilter = filter;

    para.RowsPerPage = parseInt(c.GetValue('#txtRowsPerPage')),
    para.GetPage = parseInt(c.GetValue('#txtGetPage'));

    $('#preloader').show();
    $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        processData: false,
        data: JSON.stringify(para),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
        },
        success: function (data) {
            BindList(data.list.length == 0 ? []:data.list);
            BindQuestionaires(data.list.length == 0 ? [] : data.list[0].DonorQuestionaires);
           // BindScreenResults(data.list.length == 0 ? [] : data.list[0].ShowScreenResults);
            $('#preloader').hide();
            $("#grid").css("visibility", "visible");           
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            //var errMsg = err + "<br>" + desc;
            var errMsg = err + "<br>" + xhr.responseText;
            
            c.MessageBoxErr(errMsg);
        }
    });

    //$.ajax({
    //    url: Url,
    //    data: JSON.stringify(para),
    //    type: 'post',
    //    contentType: 'application/json; charset=utf-8',
    //    //dataType: 'json',
    //    cache: false,
    //    beforeSend: function () {
    //        $('#preloader').show();
    //        $("#grid").css("visibility", "hidden");
    //    },
    //    success: function (data) {
    //        BindList(data.list);
    //        BindFilter(data.list[0].DonorRegFilter);
    //        BindQuestionaires(data.list[0].DonorQuestionaires);
    //        $('#preloader').hide();
    //        $("#grid").css("visibility", "visible");
    //    },
    //    error: function (xhr, desc, err) {
    //        $('#preloader').hide();
    //        var errMsg = err + "<br>" + xhr.responseText;
    //        c.MessageBoxErr(errMsg);
    //    }
    //});



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
    //    scrollY: 550,
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
        info: true,
        scrollY: 440,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        //scrollCollapse: false,
        pageLength: 150,
        lengthChange: true,
        iDisplayLength: 25,
        fnRowCallback: ShowListRowCallBack(),
        columns: ShowListColumns()

    });
}

function ShowDrugAllergiesColumns() {
    var cols = [
    { targets: [0], data: "", className: '', visible: true, searchable: false, width: "5%", defaultContent: '<input type="checkbox" id="chkSelectedAllergiesDrug"/>' },
    { targets: [1], data: "isChk", className: '', visible: false, searchable: true, width: "3%" },
    { targets: [2], data: "ctr", className: '', visible: false, searchable: true, width: "3%" },
    { targets: [3], data: "Name", className: '', visible: true, searchable: true, width: "95%" },
    { targets: [4], data: "ID", className: '', visible: false, searchable: true, width: "15%" }
    ];
    return cols;
}
function ShowDrugAllergiesRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowDrugAllergies(id) {
    var Url = baseURL + "ShowListOfDrugAllergies";
    var param = {
        Id: id
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
            var errMsg = err + "<br>" + xhr.responseText;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindDrugAllergies(data) {
    TblGridDrugAllergies = $(TblGridDrugAllergiesId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: true,
        searching: true,
        ordering: false,
        info: false,
        columns: ShowDrugAllergiesColumns(),
        bAutoWidth: false,
        scrollY: 200,
        scrollX: true,
        fnRowCallback: ShowDrugAllergiesRowCallBack(),
        iDisplayLength: 50
    });
}

function ShowFoodAllergiesColumns() {
    var cols = [
    { targets: [0], data: "", className: '', visible: true, searchable: false, width: "5%", defaultContent: '<input type="checkbox" id="chkSelectedAllergiesFood"/>' },
    { targets: [1], data: "isChk", className: '', visible: false, searchable: true, width: "3%" },
    { targets: [2], data: "ctr", className: '', visible: false, searchable: true, width: "3%" },
    { targets: [3], data: "Name", className: '', visible: true, searchable: true, width: "95%" },
    { targets: [4], data: "Id", className: '', visible: false, searchable: true, width: "15%" }
    ];
    return cols;
}
function ShowFoodAllergiesRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowFoodAllergies(id) {
    var Url = baseURL + "ShowListOfFoodAllergies";
    var param = {
        Id: id
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
            BindFoodAllergies(data.list);
            $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + xhr.responseText;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindFoodAllergies(data) {
    TblGridFoodAllergies = $(TblGridFoodAllergiesId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: true,
        searching: true,
        ordering: false,
        info: false,
        columns: ShowFoodAllergiesColumns(),
        bAutoWidth: false,
        scrollY: 200,
        scrollX: true,
        fnRowCallback: ShowFoodAllergiesRowCallBack(),
        iDisplayLength: 50
    });
}

function ShowSurgeriesColumns() {
    var cols = [
    { targets: [0], data: "", className: '', visible: true, searchable: false, width: "5%", defaultContent: '<input type="checkbox" id="chkSelectedSurgeries"/>' },
    { targets: [1], data: "isChk", className: '', visible: false, searchable: true, width: "3%" },
    { targets: [2], data: "ctr", className: '', visible: false, searchable: true, width: "3%" },
    { targets: [3], data: "Name", className: '', visible: true, searchable: true, width: "95%" },
    { targets: [4], data: "ID", className: '', visible: false, searchable: true, width: "15%" }
    ];
    return cols;
}
function ShowSurgeriesRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowSurgeries(id) {
    var Url = baseURL + "ShowListOfSurgeries";
    var param = {
        Id: id
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
            BindSurgeries(data.list);
            $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + xhr.responseText;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindSurgeries(data) {
    TblGridSurgeries = $(TblGridSurgeriesId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: true,
        searching: true,
        ordering: false,
        info: false,
        columns: ShowSurgeriesColumns(),
        bAutoWidth: false,
        scrollY: 200,
        scrollX: true,
        fnRowCallback: ShowSurgeriesRowCallBack(),
        iDisplayLength: 50
    });
}

function ShowQuestionairesColumns() {
    var cols = [
        { targets: [0], data: "", className: '', visible: true, searchable: false, width: "5%", defaultContent: '<input type="checkbox" id="chkSelectedQuestionaires" class="chkSelectedQuestionaires" onclick="ChkTriStateInit(this)"/>' },
    { targets: [1], data: "isChk", className: '', visible: false, searchable: true, width: "3%" },
    { targets: [2], data: "ctr", className: '', visible: true, searchable: true, width: "3%" },
    { targets: [3], data: "Name", className: '', visible: true, searchable: true, width: "92%" },
    { targets: [4], data: "id", className: '', visible: false, searchable: true, width: "15%" }
    ];
    return cols;
}
function ShowQuestionairesRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowQuestionaires(id) {
    var Url = baseURL + "ShowListOfDonorQuestionaires";
    var param = {
        Id: id
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
            BindQuestionaires(data.list);
            $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + xhr.responseText;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindQuestionaires(data) {
    //TblGridQuestionaire = $(TblGridQuestionaireId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: false,
    //    columns: ShowQuestionairesColumns(),
    //    bAutoWidth: false,
    //    scrollY: 200,
    //    scrollX: true,
    //    fnRowCallback: ShowQuestionairesRowCallBack(),
    //    iDisplayLength: 50
    //});

    TblGridQuestionaire = $(TblGridQuestionaireId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 200,
        processing: false,
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 50,
        fnRowCallback: ShowQuestionairesRowCallBack(),
        columns: ShowQuestionairesColumns()
    });
}

function ShowFilterColumns() {
    var cols = [
    { targets: [0], data: "SearchForId", defaultContent: '', className: '', visible: true, searchable: true, width: "1%" },
    { targets: [1], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" id="chkFilter"/>' },
    { targets: [2], data: "SearchForId", defaultContent: '', className: '', visible: false, searchable: true, width: "10%" },
    { targets: [3], data: "SearchFor", defaultContent: '', className: '', visible: true, searchable: true, width: "10%" },
    { targets: [4], data: "OperatorId", defaultContent: '', className: '', visible: false, searchable: true, width: "2%" },
    { targets: [5], data: "Operator", defaultContent: '', className: 'ClassOperatorClause', visible: true, searchable: true, width: "2%" },
    { targets: [6], data: "Value1", defaultContent: '', className: '', visible: true, searchable: true, width: "10%" },
    { targets: [7], data: "Value2", defaultContent: '', className: '', visible: true, searchable: true, width: "10%" },
    { targets: [8], data: "ActualValue1", defaultContent: '', className: '', visible: false, searchable: true, width: "10%" },
    { targets: [9], data: "ActualValue2", defaultContent: '', className: '', visible: true, searchable: true, width: "10%" },
    { targets: [10], data: "isChk", className: 'cAR-align-center', visible: false, searchable: false, width: "0%" },    
    { targets: [11], data: "Column", className: '', visible: false, searchable: false, width: "0%"}
    ];

    return cols;
}
function ShowFilterRowCallBack() {
    var rc = function (nRow, aData) {
        var SearchForId = aData['SearchForId'];
        var OperatorId = aData['OperatorId'];
        //var $nRow = $(nRow);        
        //if (value === '1') {
        //    $nRow.css({ "background-color": "#dff0d8" })            
        //}        
        if (SearchForId == ennSearchFor.PIN) {
            $('td:eq(4)', nRow).addClass('ClassTextBoxValue1');
        } else if (SearchForId == ennSearchFor.RegistrationNo) {
            $('td:eq(4)', nRow).addClass('ClassTextBoxValue1');
        } else if (SearchForId == ennSearchFor.RegistrationDate) {
            $('td:eq(4)', nRow).addClass('ClassDateTimePickerValue');
        } else if (SearchForId == ennSearchFor.DonationDate) {
            $('td:eq(4)', nRow).addClass('ClassDateTimePickerValue');
        } else if (SearchForId == ennSearchFor.Age) {
            $('td:eq(4)', nRow).addClass('ClassTextBoxValue1');
        } else if (SearchForId == ennSearchFor.DonorName) {
            $('td:eq(4)', nRow).addClass('ClassTextBoxValue1');
        } else if (SearchForId == ennSearchFor.Gender) {
            $('td:eq(4)', nRow).addClass('ClassSelect2GenderF');
        } else if (SearchForId == ennSearchFor.Address1) {
            $('td:eq(4)', nRow).addClass('ClassTextBoxValue1');
        } else if (SearchForId == ennSearchFor.Address2) {
            $('td:eq(4)', nRow).addClass('ClassTextBoxValue1');
        } else if (SearchForId == ennSearchFor.BagNo) {
            $('td:eq(4)', nRow).addClass('ClassTextBoxValue1');
        } else if (SearchForId == ennSearchFor.DonorType) {
            $('td:eq(4)', nRow).addClass('ClassSelect2DonorTypeF');
        } else if (SearchForId == ennSearchFor.BloodGroup) {
            $('td:eq(4)', nRow).addClass('ClassSelect2BloodGroupF');
        } else if (SearchForId == ennSearchFor.DonorStatus) {
            $('td:eq(4)', nRow).addClass('ClassSelect2DonorStatusF');
        } else if (SearchForId == ennSearchFor.Iqama) {
            $('td:eq(4)', nRow).addClass('ClassTextBoxValue1');
        }

        
    };
    return rc;
}
function BindFilter(data) {

    //TblGridFilter = $(TblGridFilterId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: true,
    //    ordering: false,
    //    info: false,
    //    columns: ShowFilterColumns(),
    //    bAutoWidth: false,
    //    scrollY: 350,
    //    scrollX: true,
    //    fnRowCallback: ShowFilterRowCallBack()
       
    //});
    TblGridFilter = $(TblGridFilterId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 310,
        processing: false,
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        fnRowCallback: ShowFilterRowCallBack(),
        columns: ShowFilterColumns()
    });

    //if (Action == 1 || Action == 2) {
    //    InitSelectedSurgery();
    //}
    
    InitFilter();
}
function SetupFilter() {

    $.editable.addInputType('select2SearchFor', {
        element: function (settings, original) {
            var input = $('<input id="select2SearchFor" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#select2SearchFor').select2({
                data: jSearchFor,
                minimumResultsForSearch: -1

            }).on("select2-blur", function () {
                $("#select2SearchFor").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#select2SearchFor").closest('form').submit(); }
                else { $("#select2SearchFor").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#select2SearchFor').val();
                $("#select2SearchFor").select2("data", { id: a, text: a });
            }).on("change", function () {

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
            if ($("#select2SearchFor", this).select2('val') != null && $("#select2SearchFor", this).select2('val') != '') {
                $("input", this).val($("#select2SearchFor", this).select2("data").text);
            }
            
        }
    });
    $.editable.addInputType('select2OperatorClause', {
        element: function (settings, original) {
            var input = $('<input id="select2OperatorClause" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#select2OperatorClause').select2({
                data: OperationAll,
                minimumResultsForSearch: -1

            }).on("select2-blur", function () {
                $("#select2OperatorClause").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#select2OperatorClause").closest('form').submit(); }
                else { $("#select2OperatorClause").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#select2OperatorClause').val();
                $("#select2OperatorClause").select2("data", { id: a, text: a });
            }).change(function (e) {
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
            if ($("#select2OperatorClause", this).select2('val') != null && $("#select2OperatorClause", this).select2('val') != '') {
                $("input", this).val($("#select2OperatorClause", this).select2("data").text);
            }
            
        }
    });
    $.editable.addInputType('txtBoxValue', {
        element: function (settings, original) {

            var input = $('<input id="txtBoxValue" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        }
    });
    $.editable.addInputType('datetimePickerValue', {
        element: function (settings, original) {
            var input = $('<input id="datetimePickerValue" style="width:100%; height:30px;" type="text" class="form-control date" data-date-format="DD-MMM-YYYY"/>');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            $(this).find('#datetimePickerValue')
					.datetimepicker({
					    pickTime: false
					});
        }
    });
    $.editable.addInputType('Select2DonorTypeF', {
        element: function (settings, original) {
            var input = $('<input id="Select2DonorTypeF" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#Select2DonorTypeF').select2({
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    cache: false,
                    quietMillis: 150,
                    url: baseURL + 'Select2DonorType',
                    dataType: 'jsonp',
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
            }).on("select2-blur", function () {
                $("#Select2DonorTypeF").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#Select2DonorTypeF").closest('form').submit(); }
                else { $("#Select2DonorTypeF").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#Select2DonorTypeF').val();
                $("#Select2DonorTypeF").select2("data", { id: a, text: a });
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
            if ($("#Select2DonorTypeF", this).select2('val') != null && $("#Select2DonorTypeF", this).select2('val') != '') {
                $("input", this).val($("#Select2DonorTypeF", this).select2("data").text);

            }
        }
    });
    $.editable.addInputType('Select2BloodGroupF', {
        element: function (settings, original) {
            var input = $('<input id="Select2BloodGroupF" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#Select2BloodGroupF').select2({
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    cache: false,
                    quietMillis: 150,
                    url: baseURL + 'Select2BloodGroup',
                    dataType: 'jsonp',
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
            }).on("select2-blur", function () {
                $("#Select2BloodGroupF").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#Select2BloodGroupF").closest('form').submit(); }
                else { $("#Select2BloodGroupF").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#Select2BloodGroupF').val();
                $("#Select2BloodGroupF").select2("data", { id: a, text: a });
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
            if ($("#Select2BloodGroupF", this).select2('val') != null && $("#Select2BloodGroupF", this).select2('val') != '') {
                $("input", this).val($("#Select2BloodGroupF", this).select2("data").text);

            }
        }
    });
    $.editable.addInputType('Select2DonorStatusF', {
        element: function (settings, original) {
            var input = $('<input id="Select2DonorStatusF" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#Select2DonorStatusF').select2({
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    cache: false,
                    quietMillis: 150,
                    url: baseURL + 'Select2DonorStatus',
                    dataType: 'jsonp',
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
            }).on("select2-blur", function () {
                $("#Select2DonorStatusF").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#Select2DonorStatusF").closest('form').submit(); }
                else { $("#Select2DonorStatusF").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#Select2DonorStatusF').val();
                $("#Select2DonorStatusF").select2("data", { id: a, text: a });
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
            if ($("#Select2DonorStatusF", this).select2('val') != null && $("#Select2DonorStatusF", this).select2('val') != '') {
                $("input", this).val($("#Select2DonorStatusF", this).select2("data").text);

            }
        }
    });
    $.editable.addInputType('Select2GenderF', {
        element: function (settings, original) {
            var input = $('<input id="Select2GenderF" style="width:100%; height:30px;" type="text" class="form-control">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#Select2GenderF').select2({
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    cache: false,
                    quietMillis: 150,
                    url: baseURL + 'Select2Gender',
                    dataType: 'jsonp',
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
            }).on("select2-blur", function () {
                $("#Select2GenderF").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#Select2GenderF").closest('form').submit(); }
                else { $("#Select2GenderF").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#Select2GenderF').val();
                $("#Select2GenderF").select2("data", { id: a, text: a });
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
            if ($("#Select2GenderF", this).select2('val') != null && $("#Select2GenderF", this).select2('val') != '') {
                $("input", this).val($("#Select2GenderF", this).select2("data").text);

            }
        }
    });


}
function InitFilter() {

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassSearchFor', TblGridFilter.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridFilter.cell($(this).closest('td')).index();
        //var id = c.GetSelect2Id('#select2SearchFor');
        //TblGridFilter.cell(cell.row, cell.column).data(sVal);
        //TblGridFilter.cell(cell.row, 1).data(id);
        //ChangeEditor(this);
        return sVal;
    },
    {
        "type": 'select2SearchFor', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassOperatorClause', TblGridFilter.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridFilter.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#select2OperatorClause');
        TblGridFilter.cell(cell.row, cell.column).data(sVal);
        TblGridFilter.cell(cell.row, ennFilterCols.OperatorId).data(id);
        //ChangeEditor(this);
        return sVal;
    },
    {
        "type": 'select2OperatorClause', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassTextBoxValue1', TblGridFilter.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridFilter.cell($(this).closest('td')).index();
        TblGridFilter.cell(cell.row, cell.column).data(sVal);

        TblGridFilter.cell(cell.row, ennFilterCols.ActualValue1).data(sVal);

        return sVal;
    },
    {
        "type": 'txtBoxValue', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassDateTimePickerValue', TblGridFilter.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridFilter.cell($(this).closest('td')).index();
        TblGridFilter.cell(cell.row, cell.column).data(sVal);

        TblGridFilter.cell(cell.row, ennFilterCols.ActualValue1).data(sVal);
        return sVal;
    },
    {
        "type": 'datetimePickerValue', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassSelect2DonorTypeF', TblGridFilter.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridFilter.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#Select2DonorTypeF');
        TblGridFilter.cell(cell.row, ennFilterCols.ActualValue1).data(id);
        TblGridFilter.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'Select2DonorTypeF', "style": 'display: `inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassSelect2BloodGroupF', TblGridFilter.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridFilter.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#Select2BloodGroupF');
        TblGridFilter.cell(cell.row, ennFilterCols.ActualValue1).data(id);
        TblGridFilter.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'Select2BloodGroupF', "style": 'display: `inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    $('.ClassSelect2DonorStatusF', TblGridFilter.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridFilter.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#Select2DonorStatusF');
        TblGridFilter.cell(cell.row, ennFilterCols.ActualValue1).data(id);
        TblGridFilter.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'Select2DonorStatusF', "style": 'display: `inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    $('.ClassSelect2GenderF', TblGridFilter.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridFilter.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#Select2GenderF');
        TblGridFilter.cell(cell.row, ennFilterCols.ActualValue1).data(id);
        TblGridFilter.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'Select2GenderF', "style": 'display: `inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
  
    // Resize all rows.
    $(TblGridFilterId + ' tr').addClass('trclass');

}

function ShowScreenResultsColumns() {
    var cols = [
    { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" id="chkSelScreenRes"/>' },
    { targets: [1], data: "name", className: '', visible: true, searchable: true, width: "99%" },
    { targets: [2], data: "id", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [3], data: "chk", className: '', visible: false, searchable: false, width: "0%" }
    ];
    return cols;
}
function ShowScreenResultsRowCallBack() {
    var rc = function (nRow, aData) {
        var $nRow = $(nRow);
        if (aData.chk.length != 0) {
            $('#chkSelScreenRes', nRow).prop('checked', aData.chk == 1);
        }
    };
    return rc;
}
function ShowScreenResults(PositionId, ProcessId) {
    var Url = baseURL + "ShowScreenResults";
    var param = {
        Id: -1
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
           // BindScreenResults(data.list);
            $("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindScreenResults(data) {
    //TblGridList = $(TblGridListId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowScreenResultsColumns(),
    //    bAutoWidth: false,
    //    scrollY: 400,
    //    scrollX: true,
    //    fnRowCallback: ShowScreenResultsRowCallBack(),
    //    iDisplayLength: 25
    //});
    TblGridScreenResults = $(TblGridScreenResultsId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 150,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: true,
        columns: ShowScreenResultsColumns(),
        fnRowCallback: ShowScreenResultsRowCallBack()
    });

}
 
function ChkTriStateInit(cb) {

    if (cb.readOnly) cb.checked = cb.readOnly = false;
    else if (!cb.checked) cb.readOnly = cb.indeterminate = true;
}
function ChkTriStateSet(cb, value) {
    if (value == 0) $(cb).prop("checked", false);
    else if (value == 1) $(cb).prop("checked", true);
    else if (value == 2) $(cb).prop("indeterminate", true);
}
function ChangeEditor(e) {
    var dataRow = TblGridFilter.row($(e).parents('tr')).data();
    var SearchForId = dataRow.SearchForId;
    var OperatorClauseId = dataRow.OperatorId;
    var a;

    a = $(e).parents("tr").find("td:nth-child(4)");
    if (a.hasClass('ClassTextBoxValue1')) a.removeClass('ClassTextBoxValue1');
    if (a.hasClass('ClassDateTimePickerValue')) a.removeClass('ClassDateTimePickerValue');

    // ------------------------------------------------------------------------
    if (SearchForId == ennSearchFor.PIN || SearchForId == ennSearchFor.DonorName ||
        SearchForId == ennSearchFor.BagNo || SearchForId == ennSearchFor.Address1 ||
        SearchForId == ennSearchFor.Address2 || SearchForId == ennSearchFor.Iqama) {
        a = $(e).parents("tr").find("td:nth-child(4)");
        a.addClass('ClassTextBoxValue1');
    }
        // ------------------------------------------------------------------------
    else if (SearchForId == ennSearchFor.RegistrationDate && OperatorClauseId == ennOperation.Equal) {
        a = $(e).parents("tr").find("td:nth-child(4)");
        a.addClass(' ClassDateTimePickerValue');
    }
    // ------------------------------------------------------------------------
    window.setTimeout(function () {
        SetupFilter();
        InitFilter()
    }, 1000);

}
function ApplyBetween(e) {
    var dataRow = TblGridFilter.row($(e).parents('tr')).data();
    var SearchForId = dataRow.SearchForId;
    var OperatorClauseId = dataRow.OperatorId;
        
    if (OperatorClauseId == ennOperation.Between) {

        var val1 = $(e).parents("tr").find("td:nth-child(4)");
        var val2 = $(e).parents("tr").find("td:nth-child(5)");

        val1.removeClass('');
        val2.removeClass('');

        if (SearchForId == ennSearchFor.RegistrationDate) {
            
        }

    }
}
function GetLastBBRegNo() {
    var Url = baseURL + "GetLastBBRegNo";
    $.ajax({
        url: Url,
        processData: false,
        //data: JSON.stringify(para),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
        },
        success: function (data) {
            c.MessageBox(data.Title, data.Message, null);
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            //var errMsg = err + "<br>" + xhr.responseText;
            var errMsg = err + "<br>" + xhr.responseText;

            c.MessageBoxErr(errMsg);
        }
    });
}

function DecimalOnly(evt, element) {

    var charCode = (evt.which) ? evt.which : event.keyCode

    if (
        (charCode != 45 || $(element).val().indexOf('-') != -1) &&      // “-” CHECK MINUS, AND ONLY ONE.
        (charCode != 46 || $(element).val().indexOf('.') != -1) &&      // “.” CHECK DOT, AND ONLY ONE.
        (charCode < 48 || charCode > 57))
        return false;

    return true;
}

function getBagType(preselected){

    $.ajax({
        url: baseURL + 'Select2BagType',
        type:'get',
        //dataType: 'json',
        cache: false,
        data: {
            componentId: $('#select2SDPLRProcedures').select2('data')[0] == undefined ? 0: $('#select2SDPLRProcedures').select2('data')[0].id, //c.GetSelect2Id('#select2SDPLRProcedures'),
            currentDate: c.GetDateTimePickerDate('#dtDonationDate') == "" ? moment(Date()).format('DD-MMM-YYYY') : c.GetDateTimePickerDate('#dtDonationDate'),
            pageSize: 20,
            pageNum: 1,
            searchTerm: ''
        },
        success: function (response) {

            var $target = $("#select2BagType");
             $target.select2().empty();

            $.each(response.Results, function (index, item) {

                $("<option>", { value: item.id, text: item.text, "data-list": JSON.stringify(item.list) })
                    .html(item.text)
                    .appendTo($target);
            });
            if (preselected) {
                $target.select2('val', preselected);
            }
            $target.trigger('change');
        }
    });
}




//eto pre
//>http://130.1.8.184/HISWARDS/Wards/Blooddonor/mainindex
