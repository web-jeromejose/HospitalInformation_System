var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsTestList;
var tblItemsTestListId = '#gridListTest'
var tblItemsTestListDataRow;

var tblProcedureList;
var tblProcedureListId = '#gridlistProced'
var tblProcedureDataRow;

var OrderId;
var ProcedureId;
var RequestedId;


$(document).ready(function () {
    SetupSelectedProced();
    SetupSelectedTest();
    // SetupDataTables();
    //InitICheck();
    //SetupSelectedPrice();
    InitButton();
    //InitDateTimePicker();
    var Service = 7;
    //ShowListPackage(Service);
    InitSelect2();
    InitDataTables();
    DefaultValues();
    DefaultDisable();
  
});


$(document).on("click", tblItemsTestListId + " td", function (e) {
    //e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');



        //// Multiple selection
       // tr.toggleClass('selected');
        ////r.removeClass('selected');
        //// Single selection
        ////tr.removeClass('selected');
        ////$('tr.selected').removeClass('selected');
        ////tr.addClass('selected')

        tblItemsTestListDataRow = tblItemsTestList.row($(this).parents('tr')).data();


    }
});


$(document).on("click", tblProcedureListId + " td", function (e) {
  //  e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        // Multiple selection
       // tr.toggleClass('selected');

        // Single selection
        ////tr.removeClass('selected');
        ////$('tr.selected').removeClass('selected');
        ////tr.addClass('selected')

        tblProcedureDataRow = tblProcedureList.row($(this).parents('tr')).data();


    }
});


//});
function InitDataTables() {
    BindListofItemTest([]);
    BindListofItemProcedure([]);
    //BindWithPriceListofItem([]);
}

function InitSelect2() {
    // Sample usage

  
    $("#select2PackageType").select2({
        data: [{ id: 7, text: 'Procedure' },
               { id: 3, text: 'Investigation'}],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var list = e.added.list;
        var Service = c.GetSelect2Id('#select2PackageType');
        ShowListPackage(Service);
    });


    $('#select2Service').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getserviceid"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    ServiceId: c.GetSelect2Id('#select2PackageType')
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added;

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
            Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);

    });

    $('#btnPreview').click(function () {
        var Pin = $('#txtPin').val();
        ShowListTest(Pin);
        ShowListProcedure(Pin);
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
        c.ModalShow('#modalEntry', true);
        

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
    c.SetSelect2('#select2PackageType', '7', 'Procedure');
    // c.iCheckSet('#iChkLast3Mos', true);

    //c.SetSelect2('#select2PatientTypeId', '1', 'In-patient');

}


function DefaultDisable() {
    // Sample usage
    // c.DisableDateTimePicker('#dtFromDate', true);
    //c.DisableSelect2('#Select2RefDoctor', true);
    //c.DisableSelect2('#Select2ProcedureDoneBy', true);
    c.Disable('#txtName', true);




}

function DefaultEmpty() {

    c.SetValue('#txtNoofDays', '');
    c.SetValue('#txtNoofVisit', '');
    c.Select2Clear('#select2Service');
   

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


//function InitICheck()
// {
//    $('#iChkAllProced').iCheck({
//        checkboxClass: 'icheckbox_square-red',
//        radioClass: 'iradio_square-red'
//    }).on("ifChecked ifUnchecked", function (e) {
//        var checked = e.type == "ifChecked" ? 1 : 0;

//    });
    
// }
//-------------------List of Test-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindListofItemTest(data) {

    tblItemsTestList = $(tblItemsTestListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 450,
        scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowListTestColumns(),
        fnRowCallback: ShowListItemRowCallBack()
    });

    InitSelectedTest();
}

function ShowListItemRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['selected'];
        var $nRow = $(nRow);
       
    //    if ($.trim(value).length > 0) {
    //        $nRow.css({ "background-color": "#b7d7ff" })
    //    }
    //};
        if (aData.selected.length != 0) {
            $('#chkselectedtest', nRow).prop('checked', aData.selected === 1);
        }

        //bindCheckBox();
    };
    return rc;

}

$(document).on("click", "#iChkAllTest", function () {
    if ($('#iChkAllTest').is(':checked')) {
        $.each(tblItemsTestList.rows().data(), function (i, row) {
            tblItemsTestList.cell(i, 0).data('<input id="chkselectedtest" type="checkbox" checked="checked" >');
        });
    }
    else {
        $.each(tblItemsTestList.rows().data(), function (i, row) {
            tblItemsTestList.cell(i, 0).data('<input id="chkselectedtest" type="checkbox">');
        });
    }
});

function ShowListTestColumns() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselectedtest" id="chkselectedtest"/>' },
      { targets: [1], data: "SNo", className: '', visible: true, searchable: true, width: "1%" },
      { targets: [2], data: "TestId", className: '', visible: false, searchable: false },
      { targets: [3], data: "TestName", className: '', visible: true, searchable: true, width: "10%" },
      { targets: [4], data: "doctor", className: '', visible: true, searchable: true, width: "10%" },
      { targets: [5], data: "PackDays", className: '', visible: true, searchable: true, width: "1%" },
      { targets: [6], data: "PackVisits", className: '', visible: true, searchable: true, width: "1%" },
      { targets: [7], data: "PinNo", className: '', visible: false, searchable: false},
      { targets: [8], data: "Patient", className: '', visible: false, searchable: false},
      { targets: [9], data: "Days", className: 'ClassDays', visible: true, searchable: true, width: "1%" },
      { targets: [10], data: "visits", className: 'ClassVisits', visible: true, searchable: true, width: "1%" },
      { targets: [11], data: "Remarks", className: 'ClassRemarks', visible: true, searchable: true, width: "20%" },
      { targets: [12], data: "doctorid", className: '', visible: false, searchable: false },
      { targets: [13], data: "ItemId", className: '', visible: false, searchable: false }

    ];
    return cols;
}

function ShowListTest(Pin) {
    var Url = $("#url").data("getlistoftest");
    var param = {
        Pin: Pin
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

            //if (tblItemsTestList.rows('.selected').data().length == 0) {
            //    c.MessageBoxErr("Empty...", "No Test Found.", null);
            //    return;
            //}


            BindListofItemTest(data.list);
            var data = data.list[0];
            //var Patient =
            var Patient = data.Patient == null ? '' : data.Patient;
            c.SetValue('#txtName', data.Patient);
       
            //$("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

function SetupSelectedTest() {

    $.editable.addInputType('txtDays', {
        element: function (settings, original) {

            var input = $('<input id="txtDays" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

    $.editable.addInputType('txtVisits', {
        element: function (settings, original) {

            var input = $('<input id="txtVisits" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

    $.editable.addInputType('txtRemarks', {
        element: function (settings, original) {

            var input = $('<input id="txtRemarks" style="width:100%; height:30px; margin:0px, padding:0px;" type="textarea" class="form-control ">');
            //var input = $('<div id="txtDescription" contenteditable="true" style="height:50px; style="width:100%;"></div>');
            $(this).append(input);

            return (input);
        }
    });

}

function InitSelectedTest() {

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassDays', tblItemsTestList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsTestList.cell($(this).closest('td')).index();
        tblItemsTestList.cell(cell.row, 9).data(sVal);


        return sVal;
    },
    {
        "type": 'txtDays', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassVisits', tblItemsTestList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsTestList.cell($(this).closest('td')).index();
        tblItemsTestList.cell(cell.row, 10).data(sVal);


        return sVal;
    },
    {
        "type": 'txtVisits', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassRemarks', tblItemsTestList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsTestList.cell($(this).closest('td')).index();
        tblItemsTestList.cell(cell.row, 11).data(sVal);


        return sVal;
    },
    {
        "type": 'txtRemarks', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });


    // Resize all rows.
    $(tblItemsTestListId + ' tr').addClass('trclass');

}

//-------------------List of Procedure-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindListofItemProcedure(data) {

    tblProcedureList = $(tblProcedureListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 450,
        scrollX: true,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowListProcedureColumns(),
        fnRowCallback: ShowListItemProcedureRowCallBack()
    });

    InitSelectedProced();
}

function ShowListItemProcedureRowCallBack() {
    var rc = function (nRow, aData) {
        var $nRow = $(nRow);
        if (aData.selected.length != 0) {
            $('#chkselectedproc', nRow).prop('checked', aData.selected === 1);
        }

    };
    return rc;

}

$(document).on("click", "#iChkAllProced", function () {
    if ($('#iChkAllProced').is(':checked')) {
        $.each(tblProcedureList.rows().data(), function (i, row) {
            tblProcedureList.cell(i, 0).data('<input id="chkselectedproc" type="checkbox" checked="checked" >');
        });
    }
    else {
        $.each(tblProcedureList.rows().data(), function (i, row) {
            tblProcedureList.cell(i, 0).data('<input id="chkselectedproc" type="checkbox">');
        });
    }
});

function ShowListProcedureColumns() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselectedproc" id="chkselectedproc"/>' },
      { targets: [1], data: "SNo", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [2], data: "ProcedureName", className: '', visible: true, searchable:  true, width: "20%" },
      { targets: [3], data: "doctor", className: '', visible: true, searchable: true, width: "25%" },
      { targets: [4], data: "PackDays", className: '', visible: true, searchable: true, width: "1%" },
      { targets: [5], data: "PackVisits", className: '', visible: true, searchable: true, width: "1%" },
      { targets: [6], data: "Days", className: 'ClassDays', visible: true, searchable: true, width: "1%" },
      { targets: [7], data: "visits", className: 'ClassVisits', visible: true, searchable: true, width: "1%" },
      { targets: [8], data: "Remarks", className: 'ClassRemarks', visible: true, searchable: true, width: "20%" },
      { targets: [9], data: "Patient", className: '', visible: false, searchable: false },
      { targets: [10], data: "TestId", className: '', visible: false, searchable: false},
      { targets: [11], data: "doctorid", className: '', visible: false, searchable: false },
      { targets: [12], data: "PinNo", className: '', visible: false, searchable: false },
      { targets: [13], data: "ItemId", className: '', visible: false, searchable: false }
      //{ targets: [13], data: "OriginalDays", className: '', visible: false, searchable: false }
      

    ];

    return cols;
}

function ShowListProcedure(Pin) {
    var Url = $("#url").data("getlistofprocedure");
    var param = {
        Pin: Pin
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

            //if (tblItemsTestList.rows('.selected').data().length == 0) {
            //    c.MessageBoxErr("Empty...", "No Test Found.", null);
            //    return;
            //}


            BindListofItemProcedure(data.list);
            var data = data.list[0];
            //var Patient =
            var Patient = data.Patient == null ? '' : data.Patient;
            c.SetValue('#txtName', data.Patient);

            //$("#grid").css("visibility", "visible");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}

function SetupSelectedProced() {

    $.editable.addInputType('txtDays', {
        element: function (settings, original) {

            var input = $('<input id="txtDays" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

    $.editable.addInputType('txtVisits', {
        element: function (settings, original) {

            var input = $('<input id="txtVisits" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });

    $.editable.addInputType('txtRemarks', {
        element: function (settings, original) {

            var input = $('<input id="txtRemarks" style="width:100%; height:30px; margin:0px, padding:0px;" type="textarea" class="form-control ">');
            //var input = $('<div id="txtDescription" contenteditable="true" style="height:50px; style="width:100%;"></div>');
            $(this).append(input);

            return (input);
        }
    });

}

function InitSelectedProced() {

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassDays', tblProcedureList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblProcedureList.cell($(this).closest('td')).index();
        tblProcedureList.cell(cell.row, 6).data(sVal);


        return sVal;
    },
    {
        "type": 'txtDays', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassVisits', tblProcedureList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblProcedureList.cell($(this).closest('td')).index();
        tblProcedureList.cell(cell.row, 7).data(sVal);


        return sVal;
    },
    {
        "type": 'txtVisits', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassRemarks', tblProcedureList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblProcedureList.cell($(this).closest('td')).index();
        tblProcedureList.cell(cell.row, 8).data(sVal);


        return sVal;
    },
    {
        "type": 'txtRemarks', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });


    // Resize all rows.
    $(tblProcedureListId + ' tr').addClass('trclass');

}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

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
    //entry.Deleted = 0;
    //entry.TestId = c.GetSelect2Id('#select2Service');
    //entry.NoOfDays = $('#txtNoofDays').val();
    //entry.NoOfVisits = $('#txtNoofVisit').val();
    //entry.ServiceId = c.GetSelect2Id('#select2PackageType');

    entry.PackageDetailsTestSave = [];
    var rowcollection = tblItemsTestList.$("#chkselectedtest:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsTestList.row(tr);
        var rowdata = row.data();

        entry.PackageDetailsTestSave.push({
            SNo: rowdata.SNo,
            PinNo: rowdata.PinNo,
            DoctorId: rowdata.doctorid,
            ItemId: rowdata.ItemId,
            dayscompleted: rowdata.Days,
            visitscompleted: rowdata.visits,
            Remarks: rowdata.Remarks
        });
    });

    entry.PackageDetailsProcedSave = [];
    var rowcollection = tblProcedureList.$("#chkselectedproc:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
            var tr = $(elem).closest('tr');
            var row = tblProcedureList.row(tr);
            var rowdata = row.data();

            entry.PackageDetailsProcedSave.push({
                SNo: rowdata.SNo,
                PinNo: rowdata.PinNo,
                DoctorId: rowdata.doctorid,
                ItemId: rowdata.ItemId,
                dayscompleted: rowdata.Days,
                visitscompleted: rowdata.visits,
                Remarks: rowdata.Remarks   
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
                //c.ButtonDisable('#btnModify', true);
            },
            success: function (data) {
                //c.ButtonDisable('#btnModify', false);
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