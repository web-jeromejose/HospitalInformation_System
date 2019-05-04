var c = new Common();
var Action = 1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridBloodComponent;
var TblGridBloodComponentId = "#gridBloodComponent";
var TblGridBloodComponentDataRow;

var emptyData = [{
    "ctr": "",
    "UnitNumber": "",
    "Quantity": ""
}];

$(document).ready(function () {

    c.SetTitle("Broken Bag");
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

    //LoadTreeBlood();
    //LoadTreeComponent();

    ShowBlood(-1);

    $('#txtUnitNo').focus();
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

        TblGridListDataRow = TblGridList.row($(this).parents('tr')).data();
        $('#btnView').click();

    }
});

$(document).on("click", TblGridBloodComponentId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected');
        
        var table = $(TblGridBloodComponentId).DataTable();
        TblGridBloodComponentDataRow = table.rows($(this).parents('tr')).data()[0];


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
$(document).on("keypress", "#txtUnitNo", function (e) {
    if (e.which == 13) {
        View(c.GetValue('#txtUnitNo'));
    }
});
$(document).on("blur", "#txtUnitNo", function (e) {
    //View(c.GetValue('#txtUnitNo'));
});
$(document).on("keyup", "#txtSplitNo", function (e) {
    SplitItNow();
});




function SplitItNow() {

    BindSplittedBags([]);
    var count = c.GetValue('#txtSplitNo');
    if (count == 1) return;

    $('#preloader').show();

    var qty = c.GetValue('#txtQuantity');
    var quotient = Math.round(Number(qty) / Number(count));

    var ctr = 1;

    for (i = 0; i < count; i++) {
        if (ctr == count) {
            TblGridSplittedBags.row.add({
                "ctr": ctr,
                "UnitNumber": c.GetValue('#txtUnitNo') + '/' + ctr,
                "Quantity": qty
            }).draw();
        } else {
            TblGridSplittedBags.row.add({
                "ctr": ctr,
                "UnitNumber": c.GetValue('#txtUnitNo') + '/' + ctr,
                "Quantity": quotient
            }).draw();
        }
        qty = qty - quotient;

        InitSplittedBags();
        ctr++;
    }
    CalculateQty();

    $('#preloader').hide();
}
function CalculateQty() {
    var sumQty = 0;
    $.each(TblGridSplittedBags.rows().data(), function (i, row) {
        sumQty = Number(sumQty) + Number(row.Quantity);
    });
    $('#txtSumQty').val(sumQty);
}

function InitButton() {
    $('#btnRefresh').click(function () {
        //ShowList(-1);
        $('#btnViewFilter').click();
    });
    $('#btnFilter').click(function () {
        c.ModalShow('#modalFilter', true);
        RedrawGrid();

        var isCustomFilter = c.GetICheck('#iChkCustom') == 1;

        c.Show('#btnClearFilter', isCustomFilter);
        c.Show('#btnRemoveFilter', isCustomFilter);
        c.Show('#btnAddFilter', isCustomFilter);
        c.iCheckSet('#iChkCustom', true);
        c.Disable('#txtRowsPerPage', true);
        c.Disable('#txtGetPage', true);

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

        var isCustom = c.GetICheck('#iChkCustom') == 1;
        var rowcollection = TblGridFilter.$("#chkFilter:checked", { "page": "all" });
        if (isCustom && rowcollection.length == 0) {
            c.MessageBox("Error...", "Please check a row for filter criteria.", null);
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

        if (!Validated()) return;

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

    $('#iChkNeonatalUnit').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });
    $('#iChkCryo').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;

    });

}
function InitSelect2() {
    $('#select2FoodAllegies').select2({
        //containerCssClass: "RequiredField",
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
    });
    $('#select2DrugAllegies').select2({
        //containerCssClass: "RequiredField",
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
    });
    $('#select2OtherAllegies').select2({
        //containerCssClass: "RequiredField",
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
    });
    $('#select2BloodGroup').select2({
        containerCssClass: "RequiredField",
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



    //$('#select2BloodGroup').select2({
    //    containerCssClass: "RequiredField",
    //    minimumInputLength: 0,
    //    allowClear: true,
    //    ajax: {
    //        quietMillis: 150,
    //        url: baseURL + 'Select2OutsideBloodCollectionBloodGroup',
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
    //    DisableDefault(false);
    //});

    //$('#select2ScreeningResult').select2({
    //    containerCssClass: "RequiredField",
    //    data: [
    //        { id: 0, text: 'Negative' },
    //        { id: 1, text: 'Positive' }
    //    ],
    //    minimumResultsForSearch: -1
    //}).change(function (e) {
    //    var list = e.added;


    //});




}
function InitDateTimePicker() {
    $('#dtExpiryDate').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });

}
function InitDataTables() {
    //BindSubCenter([]);
    BindBlood([]);
}
function SetupDataTables() {
    //    SetupSelectedSurgery();
    //SetupSplittedBags();
}
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    //if (TblGridList !== undefined) TblGridList.columns.adjust().draw();
    if (TblGridBloodComponent !== undefined) TblGridBloodComponent.columns.adjust().draw();

}

function DefaultReadOnly() {
    //c.ReadOnly('#txtQuantity', true);
    //c.ReadOnly('#txtSumQty', true);


}
function DefaultValues() {
    c.SetValue('#Id', "");
    //c.SetValue('#txtRowsPerPage', 500);
    //c.SetValue('#txtGetPage', 1);

    //c.iCheckSet('#iChkCustom', true);
    //c.Disable('#txtRowsPerPage', true);
    //c.Disable('#txtGetPage', true);


}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
    //c.DisableSelect2('#select2BloodGroup', true);
    //DisableDefault(true);

    //c.Disable('#txtSplitNo', true);
    //c.DisableDateTimePicker('#dtExpiryDate', true);
}
function DefaultEmpty() {
    c.SetValue('#Id', '');
    //c.SetValue('#Bagid', '');
    //c.SetValue('#t', '');

    //c.SetValue('#txtUnitNo', '');
    //c.SetValue('#txtSplitNo', '');
    //c.SetDateTimePicker('#dtExpiryDate', '');

    //c.iCheckSet('#iChkNeonatalUnit', false);
    //c.iCheckSet('#iChkCryo', false);

    //BindSplittedBags([]);
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

    if ($('#ListOfStation').val() == null) {
        c.MessageBoxErr('Error...', 'Please select a station in the upper right.');
        return false;
    }

    req = c.IsEmptyById('#txtReason');
    if (req) {
        c.MessageBoxErr('Required...', 'Reason is required.');
        $('#txtReason').focus();
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
        c.Disable('#txtUnitNo', true);
        c.Disable('#txtSplitNo', true);
        c.iCheckDisable('#iChkNeonatalUnit', true);
        c.iCheckDisable('#iChkCryo', true);
    }
    else if (Action == 1 || Action == 2) { // add or edit
        c.Disable('#txtUnitNo', false);
        c.Disable('#txtSplitNo', true);
        c.iCheckDisable('#iChkNeonatalUnit', false);
        c.iCheckDisable('#iChkCryo', false);
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
    entry.t = $('#t').val();
    entry.CurentId = c.GetValue('#Id') //c.GetValue('#t') == '1' ? c.GetValue('#Id') : c.GetValue('#txtUnitNo');

    var Tvolume = 0;
    var Cvolume = 0;

    entry.Screen = [];
    entry.ComponentScreen = [];
    $.each(TblGridSplittedBags.rows().data(), function (i, row) {

        Tvolume = 0;
        Cvolume = 0;

        if (c.GetICheck('#iChkNeonatalUnit') == 1 && c.GetICheck('#iChkCryo') == 1) {
            Tvolume = row.Quantity;
            Cvolume = row.Quantity;
        }
        else if (c.GetICheck('#iChkNeonatalUnit') == 1) {
            Tvolume = row.Quantity;
            Cvolume = row.Quantity;
        }
        else if (c.GetICheck('#iChkCryo') == 1) {
            Tvolume = row.Quantity;
            Cvolume = row.Quantity;
        }
        else {
            Tvolume = row.Quantity;
            Cvolume = row.Quantity;
        }

        entry.Screen.push({
            Bagid: $('#Bagid').val(),
            Bagnumber: row.UnitNumber,
            Tvolume: Tvolume,
            Cvolume: Cvolume,
            StationID: $("#ListOfStation").val()
        });
        entry.ComponentScreen.push({
            id: $('#Id').val(),
            bagnumber: row.UnitNumber,
            Qty: Tvolume
        });

    });

    $.ajax({
        url: baseURL + 'Save',
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

                Action = 1;
                DefaultDisable();
                DefaultReadOnly();
                DefaultEmpty();
                DefaultValues();
                InitDataTables();
                HandleEnableButtons();
                HandleEnableEntries();

                setTimeout(function () {
                    $('#txtUnitNo').focus();
                }, 1 * 100);

            };

            c.MessageBox(data.Title, data.Message, OkFunc);
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
    if (id.length == 0) return;

    DefaultEmpty();
    c.SetValue('#txtUnitNo', id);

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
                TblGridSplittedBags.row('tr.selected').remove().draw(false);
                RedrawGrid();
                return;
            }

            var data = data.list[0];

            c.SetValue('#Id', data.Id);
            c.SetValue('#Bagid', data.Bagid);
            c.SetValue('#t', data.t);

            //c.SetValue('#txtUnitNo', data.ID);
            c.SetValue('#txtQuantity', data.qty);
            c.SetDateTimePicker('#dtExpiryDate', data.ExpiryDate);


            Action = 2;

            HandleEnableButtons();
            HandleEnableEntries();
            RedrawGrid();

            c.Disable('#txtSplitNo', false);
            $('#txtSplitNo').focus();
        },
        error: function (xhr, desc, err) {
            c.Disable('#txtSplitNo', false);
            $('#preloader').hide();
            var errMsg = err + "<br>" + xhr.responseText;
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
    { targets: [0], data: "ctr", title: '#', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [1], data: "W", title: 'W', className: '', visible: true, searchable: false, width: "0%" },
    { targets: [2], data: "UnitNo", title: 'UnitNo', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [3], data: "RegistrationNO", title: 'RegistrationNO', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [4], data: "DonorName", title: 'DonorName', className: '', visible: true, searchable: true, width: "15%" },
    { targets: [5], data: "DonatedDateD", title: 'DonatedDateD', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [6], data: "Age", title: '', className: 'Age', visible: true, searchable: true, width: "2%" },
    { targets: [7], data: "Gender", title: '', className: 'Gender', visible: true, searchable: true, width: "0%" },
    { targets: [8], data: "BloodGroupName", title: 'BloodGroupName', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [9], data: "iqama", title: 'iqama', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [10], data: "address1", title: 'Address1', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [11], data: "address2", title: 'Address2', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [12], data: "pphone", title: 'Phone', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [13], data: "DonorTypeName", title: 'DonorTypeName', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [14], data: "PIN", title: 'PIN', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [15], data: "idd", title: 'idd', className: '', visible: false, searchable: false, width: "0%" }
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

    $('#preloader').show();
    $("#grid").css("visibility", "hidden");

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
            

            //$('#treeComponent').jstree({
            //        'data': [
            //           { "id": "ajson1", "parent": "#", "text": "Simple root node" },
            //           { "id": "ajson2", "parent": "#", "text": "Root node 2" },
            //           { "id": "ajson3", "parent": "ajson2", "text": "Child 1" },
            //           { "id": "ajson4", "parent": "ajson2", "text": "Child 2" },
            //        ]
            //});
            $('#treeBlood').jstree(data.list);

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

function ShowBloodColumns() {
    var cols = [
    { targets: [0], data: "type", title: 'type', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [1], data: "col3", title: 'TempName', className: '', visible: true, searchable: true, width: "0%" },
    { targets: [2], data: "date1", title: 'Date', className: '', visible: false, searchable: false, width: "0%" },    
    { targets: [3], data: "bagnumber", title: 'BagNumber', className: '', visible: true, searchable: true, width: "0%" }
    ];
    return cols;
}
function ShowBloodRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowBlood(id) {

    var Url = baseURL + "ShowList";

    $('#preloader').show();
    $("#grid").css("visibility", "hidden");

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

            BindBlood(data.list);

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

 


}
function BindBlood(data) {
    TblGridBloodComponent = $(TblGridBloodComponentId).dataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 380,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        //pageLength: 150,
        lengthChange: false,
        //iDisplayLength: 25,

        //cache: false,
        //destroy: true,
        //data: data,
        //paging: false,
        //ordering: false,
        //searching: true,
        //info: false,
        //scrollY: 440,
        //processing: false,
        //autoWidth: false,
        //dom: 'Rlfrtip',
        ////scrollCollapse: false,
        ////pageLength: 150,
        //lengthChange: false,
        ////iDisplayLength: 25,
        fnRowCallback: ShowBloodRowCallBack(),
        columns: ShowBloodColumns()
    });    TblGridBloodComponent.rowGrouping({
        bExpandableGrouping: true,
        asExpandedGroups: ["Component"]
    });

}
