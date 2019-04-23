var c = new Common();
var Action = 1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridSurgery;
var TblGridSurgeryId = "#gridSurgery";
var TblGridSurgeryDataRow;

$(document).ready(function () {
 
    c.SetTitle("Surgery Record");
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

    
    setTimeout(function () {
        ShowList(-1);
    }, 1 * 100);

});
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // for future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();

    TblGridSurgery.columns.adjust().draw();
    
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
$(document).on("click", TblGridSurgeryId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');
        TblGridSurgeryDataRow = TblGridSurgery.row($(this).parents('tr')).data();
    }

});

var computeRecoveryStart = true;

function InitButton() {
    $('#btnRefresh').click(function () {
        ShowList(-1);
    });
    $('#btnFilter').click(function () {
        c.ModalShow('#modalFilter', true);
    });
    $('#btnView').click(function () {

        if (TblGridList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }

        var id = TblGridListDataRow.Id;
        Action = 0;
        View(id);
        c.SetActiveTab('sectionA');
        TblGridSurgery.columns.adjust().draw();
    });
    $('#btnNewEntry').click(function () {

      
        //Action = 1;
        //c.ModalShow('#modalEntry', true);
        //DefaultDisable();
        //DefaultReadOnly();
        //DefaultEmpty();
        //DefaultValues();
        //InitDataTables();
        //HandleEnableButtons();
        //HandleEnableEntries();
        //c.SetActiveTab('sectionA');
        var YesFunc = function () {
            window.location.href = "SurgeryRecord/Onepage";
        };

        c.MessageBoxConfirm("Create a new one?", "Are you sure you want to clear the current entry and create a new one?", YesFunc, null);


    });
    $('#btnCloseFilter').click(function () {
        c.ModalShow('#modalFilter', false);
    });
    $('#btnViewFilter').click(function () {
        var ID = c.GetSelect2Id('#select2EmployeeIDFilter');
        var isChecked = c.GetICheck('#iChkLast3Mos') == "1";
        if (!isChecked && ID.length == 0) {
            c.MessageBoxErr("Required...", "Please select an employee.");
            return;
        }

        LeaveApplicationList();
        c.ModalShow('#modalFilter', false);

    });

    $('#btnClose').click(function () {

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
            c.ModalShow('#modalEntry', false);
        };

        var NoFunc = function () {
        };
       // c.MessageNotification("Block Cancellation and editing of surgery", " As per management Feb 21 2019. ");
           c.MessageBoxConfirm("Cancel Order?", "Are you sure you want to cancel this order?", YesFunc, NoFunc);

    });
    $('#btnEdit').click(function () {
       //  c.MessageNotification("Block Cancellation and editing of surgery", " As per management Feb 21 2019. ");
        // EDIT NOT IN LIVE
        Action = 2;
        View(c.GetValue('#Id'));
        HandleEnableButtons();
        HandleEnableEntries();
        InitSelectedSurgery();
    });
    $('#btnSave').click(function () {
        Save();
    });
    $('#btnNew').click(function () {

        var YesFunc = function () {
            window.location.href = "SurgeryRecord/Onepage";
            //Action = 1;
            //DefaultDisable();
            //DefaultReadOnly();
            //DefaultEmpty();
            //DefaultValues();
            //InitDataTables();
            //HandleEnableButtons();
            //HandleEnableEntries();
            //c.SetActiveTab('sectionA');
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
 

function AdjustTime() {
  
    //  c.SetValue('#dtOTStartDateTime', moment().format("DD MMM YYYY HH:mm"));
    $("#dtOTStartDateTime").trigger('click');
    console.log($("#dtOTStartDateTime").val());
    //Adjust time Anaesthesia
    var IsNoAnaesthetist = c.GetSelect2Id('#select2AnaesthesiaTypeID') == 88 && (Action == 1 || Action == 2); 
    if (IsNoAnaesthetist) { //no anaesthesia
        $("#dtAnaesthesiaStartDateTime").val("");
        $("#dtAnaesthesiaStartDateTime").attr("disabled", "disabled");
        $("#dtAnaesthesiaEndDateTime").val("");
        $("#dtAnaesthesiaEndDateTime").attr("disabled", "disabled");
    } else {
        $('#dtAnaesthesiaStartDateTime').data('daterangepicker').setStartDate(moment(moment($("#dtOTStartDateTime").val(), "DD MMM YYYY HH:mm").add('minutes', 5)).format('DD MMM YYYY HH:mm'));
        $('#dtAnaesthesiaEndDateTime').data('daterangepicker').setStartDate(moment(moment($("#dtOTStartDateTime").val(), "DD MMM YYYY HH:mm").add('minutes', 30)).format('DD MMM YYYY HH:mm'));

    }

    //Adjust time Surgery
    $('#dtIncisionDateTime').data('daterangepicker').setStartDate(moment(moment($("#dtOTStartDateTime").val(), "DD MMM YYYY HH:mm").add('minutes', 15)).format('DD MMM YYYY HH:mm'));
    $('#dtClosureDateTime').data('daterangepicker').setStartDate(moment(moment($("#dtOTStartDateTime").val(), "DD MMM YYYY HH:mm").add('minutes', 25)).format('DD MMM YYYY HH:mm'));
    //Adjust OT Date TIME END
    $('#dtOTEndDateTime').data('daterangepicker').setStartDate(moment(moment($("#dtOTStartDateTime").val(), "DD MMM YYYY HH:mm").add('minutes', 35)).format('DD MMM YYYY HH:mm'));
    //Adjust RECOVERY
    if ($('#iChkRecovery').is(':checked')) {
        $("#dtRecoveryStartDateTime").val("");
        $("#dtRecoveryEndDateTime").val("");
        $("#dtRecoveryStartDateTime").attr("disabled", "disabled");
        $("#dtRecoveryEndDateTime").attr("disabled", "disabled");
 
      
    } else {
        $('#dtRecoveryStartDateTime').data('daterangepicker').setStartDate(moment(moment($("#dtOTStartDateTime").val(), "DD MMM YYYY HH:mm").add('minutes', 40)).format('DD MMM YYYY HH:mm'));
        $('#dtRecoveryEndDateTime').data('daterangepicker').setStartDate(moment(moment($("#dtOTStartDateTime").val(), "DD MMM YYYY HH:mm").add('minutes', 50)).format('DD MMM YYYY HH:mm'));

    }
   

};

function InitICheck() {
    $(document).on("click", "#datef_ot_time", function (e) {
        AdjustTime();
    });
    
    $('#iChkRecovery').iCheck({
        checkboxClass: 'icheckbox_square-red',
        radioClass: 'iradio_square-red'
    }).on("ifChecked ifUnchecked", function (e) {
        var checked = e.type == "ifChecked" ? true : false;
        if (checked) {
            $("#dtRecoveryStartDateTime").val("");
            $("#dtRecoveryEndDateTime").val("");
            $("#dtRecoveryStartDateTime").attr("disabled", "disabled");
            $("#dtRecoveryEndDateTime").attr("disabled", "disabled");
 
          
        } else {
            $("#dtRecoveryStartDateTime").removeAttr("disabled");
            $("#dtRecoveryEndDateTime").removeAttr("disabled");
          
        }
        


        });

    //$('#iChkStart').iCheck({
    //    checkboxClass: 'icheckbox_square-red',
    //    radioClass: 'iradio_square-red'
    //}).on("ifChecked ifUnchecked", function (e) {
    //    var checked = e.type == "ifChecked" ? true : false;
    //    console.log('InitICheck');
    //    AdjustTime();
    //    //var IsNoAnaesthetist = c.GetSelect2Id('#select2AnaesthesiaTypeID') == 88; // if NO ANAESTHESIA

    //    //c.SetDateTimePicker('#dtOTStartDateTime', checked ? moment() : "");
    //    //if (!IsNoAnaesthetist) c.SetDateTimePicker('#dtAnaesthesiaStartDateTime', checked ? moment() : "");
    //    //c.SetDateTimePicker('#dtIncisionDateTime', checked ? moment() : "");
    //    //c.SetDateTimePicker('#dtRecoveryStartDateTime', checked ? moment() : "");
    //});
    //$('#iChkEnd').iCheck({
    //    checkboxClass: 'icheckbox_square-red',
    //    radioClass: 'iradio_square-red'
    //}).on("ifChecked ifUnchecked", function (e) {
    //    var checked = e.type == "ifChecked" ? true : false;
    //    var IsNoAnaesthetist = c.GetSelect2Id('#select2AnaesthesiaTypeID') == 88; // if NO ANAESTHESIA

    //    //c.SetDateTimePicker('#dtOTEndDateTime', checked ? moment() : "");
    //    //if (!IsNoAnaesthetist) c.SetDateTimePicker('#dtAnaesthesiaEndDateTime', checked ? moment() : "");
    //    //c.SetDateTimePicker('#dtClosureDateTime', checked ? moment() : "");
    //    //c.SetDateTimePicker('#dtRecoveryEndDateTime', checked ? moment() : "");
    //});
}
function InitSelect2() {
    $('#select2PIN').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetPIN',
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
        c.SetSelect2('#select2Name', list[2], list[3]);
        c.SetSelect2('#select2BedNo', list[5], list[4]);
        FetchPatientDetails(list);
    });
    $('#select2Name').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetName',
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
        c.SetSelect2('#select2PIN', list[2], list[6]);
        c.SetSelect2('#select2BedNo', list[5], list[4]);
        FetchPatientDetails(list);
    });
    $('#select2BedNo').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetBedNo',
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
        c.SetSelect2('#select2PIN', list[2], list[6]);
        c.SetSelect2('#select2Name', list[2], list[3]);
        FetchPatientDetails(list);
    });

    $('#select2OperationTheatreId').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetOperatingTheatres',
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
    $('#select2AnaesthesiaTypeID').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetAnaesthesia',
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

        var IsNoAnaesthetist = list[0] == 88; // if NO ANAESTHESIA

        c.DisableSelect2('#select2TAnaesthetist', IsNoAnaesthetist);
        if (IsNoAnaesthetist) c.Select2Clear('#select2TAnaesthetist');

      
        if (IsNoAnaesthetist) { //no anaesthesia
            $("#dtAnaesthesiaStartDateTime").val("");
            $("#dtAnaesthesiaStartDateTime").attr("disabled", "disabled");
            $("#dtAnaesthesiaEndDateTime").val("");
            $("#dtAnaesthesiaEndDateTime").attr("disabled", "disabled");
        } else {
            $("#dtAnaesthesiaStartDateTime").removeAttr("disabled");
            $("#dtAnaesthesiaEndDateTime").removeAttr("disabled");
        }
      
    });
    $('#select2ShiftingNurseId').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetShiftingNurse',
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
    $('#select2CirculatoryNurseId').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetCirculatoryNurses',
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

    $("#select2TSurgeon").select2({
        data: [],
        minimumInputLength: 0,
        tags: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2SelectedSurgeon',
            dataType: 'jsonp',
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    SurgeryRecordId: 0,
                    IsSelected: 0
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
    $("#select2TAssistantSurgeon").select2({
        data: [],
        minimumInputLength: 0,
        tags: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2SelectedAsstSurgeon',
            dataType: 'jsonp',
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    SurgeryRecordId: 0,
                    IsSelected: 0
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
    $("#select2TAnaesthetist").select2({
        data: [],
        minimumInputLength: 0,
        tags: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2SelectedAnaesthetist',
            dataType: 'jsonp',
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    SurgeryRecordId: 0,
                    IsSelected: 0
                };
            },
            success: function () {

            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {

        var data = $('#select2TAnaesthetist').select2('data');
        $.each(data, function (i, val) {
            c.SetSelect2('#select2AnaesthetistNotesId', data[0].id, data[0].text);
            return;
        });
    });
    $("#select2TScrubNurse").select2({
        data: [],
        minimumInputLength: 0,
        tags: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2SelectedScrubNurse',
            dataType: 'jsonp',
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    SurgeryRecordId: 0,
                    IsSelected: 0
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
    $("#select2TEquipment").select2({
        data: [],
        minimumInputLength: 0,
        tags: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2SelectedEquipment',
            dataType: 'jsonp',
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    SurgeryRecordId: 0,
                    IsSelected: 0
                };
            },
            success: function () {

            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;

    });

    $('#select2AnaesthetistNotesId').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2SelectedAnaesthetist',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    SurgeryRecordId: 0,
                    IsSelected: 0
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

    $('#dtOTStartDateTime').daterangepicker({
        singleDatePicker: true,
        autoclose:true,
        startDate: new Date(),
        showDropdowns: true,
        timePicker: true,
        //maxDate: new Date(),
        timePicker24Hour: true,
        timePickerIncrement: 10,
        autoUpdateInput: true,
        minYear: 2010,
        maxYear: parseInt(moment().format('YYYY'), 10),
        locale: {
            format: 'DD MMM YYYY HH:mm'
        }

    });

    $('#dtOTStartDateTime').on('apply.daterangepicker', function (ev, picker) {
        console.log(picker.startDate.format('MM/DD/YYYY'));
        console.log('dtOTStartDateTime apply');
        AdjustTime();
    });

   
    $('.dt_datepicker').daterangepicker({
        singleDatePicker: true,
        startDate: new Date(),
        showDropdowns: false,
        timePicker: true,
        timePicker24Hour: true,
        timePickerIncrement: 5,
        autoUpdateInput: true,
        locale: {

            format: 'DD MMM YYYY HH:mm'
        }

    });
 
    $('#dtAdmitted').datetimepicker({
        pickTime: true
    }).on("dp.change", function (e) {

    });
}
function InitDataTables() {
    BindSelectedSurgery([]);
}
function SetupDataTables() {
    SetupSelectedSurgery();
}

function DefaultReadOnly() {
    c.ReadOnly('#txtWard', true);
    c.ReadOnly('#txtSlNo', true);
    c.ReadOnly('#txtDateTime', true);
    c.ReadOnly('#txtPrimaryConsultant', true);
    c.ReadOnly('#txtAge', true);
    c.ReadOnly('#txtGender', true);
    c.ReadOnly('#txtOperator', true);
    c.ReadOnly('#txtCompany', true);
    c.ReadOnly('#txtPackage', true);
    c.ReadOnly('#txtCategory', true);
    
}
function DefaultValues() {
    //    c.SetSelect2('#select2VacationType', '0', 'Normal');
    //    c.SetSelect2('#select2Category', '1', 'Local');
    //    c.iCheckSet('#iChkLast3Mos', true);
    //    c.SetRequired();
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
}
function DefaultEmpty() {
    c.SetValue('#Id', '');

    c.iCheckSet('#iChkStart', false);
    //c.iCheckSet('#iChkEnd', false);

    c.Select2Clear('#select2PIN');
    c.Select2Clear('#select2Name');
    c.Select2Clear('#select2BedNo');
    c.Select2Clear('#select2OperationTheatreId');
    c.Select2Clear('#select2AnaesthesiaTypeID');
    c.Select2Clear('#select2ShiftingNurseId');
    c.Select2Clear('#select2CirculatoryNurseId');
    c.Select2Clear('#select2TSurgeon');
    c.Select2Clear('#select2TAssistantSurgeon');
    c.Select2Clear('#select2TAnaesthetist');
    c.Select2Clear('#select2TScrubNurse');
    c.Select2Clear('#select2TEquipment');
    c.Select2Clear('#select2AnaesthetistNotesId');

    c.SetValue('#txtOperator', '');
    c.SetValue('#txtDateTime', '');
    c.SetValue('#txtPackage', '');
    c.SetValue('#txtWard', '');
    c.SetValue('#txtSlNo', '');
    c.SetValue('#txtPrimaryConsultant', '');
    c.SetValue('#txtAge', '');
    c.SetValue('#txtGender', '');
    c.SetValue('#txtCategory', '');
    c.SetValue('#txtCompany', '');
    c.SetValue('#txtDisease', '');
    c.SetValue('#txtAnaesthetistNotes', '');
    c.SetValue('#txtSurgeonNotes', '');
    
     //c.SetDateTimePicker('#dtOTStartDateTime', '');
    
    c.SetValue('#dtOTEndDateTime', '');
    c.SetValue('#dtAnaesthesiaStartDateTime', '');
    c.SetValue('#dtAnaesthesiaEndDateTime', '');
    c.SetValue('#dtIncisionDateTime', '');
    c.SetValue('#dtClosureDateTime', '');
    c.SetValue('#dtRecoveryStartDateTime', '');
    c.SetValue('#dtRecoveryEndDateTime', '');

    BindSelectedSurgery([]);

}

 
function DateIsRequired() {

 
    var startDateTime_OperationTheatre = $('#dtOTStartDateTime').val();
    var endDatetime_OperationTheatre = $('#dtOTEndDateTime').val();
    var startDateTime_Anaesthesia = $('#dtAnaesthesiaStartDateTime').val();
    var endDateTime_Anaesthesia = $('#dtAnaesthesiaEndDateTime').val();
    var startDateTime_Surgery = $('#dtIncisionDateTime').val();
    var endDateTime_Surgery = $('#dtClosureDateTime').val();
    var startDateTime_RecoveryRoom = $('#dtRecoveryStartDateTime').val();
    var endDateTime_RecoveryRoom = $('#dtRecoveryEndDateTime').val();

    var admitted_date = c.GetDateTimePickerDateTimeCompare('#dtAdmitted');
    var icheckrecovery = $('#iChkRecovery').is(':checked') === false;//not check

    console.log('icheckrecovery');
    console.log(icheckrecovery);
    var getdate = moment().format('DD MMM YYYY HH:mm');
     var IsNoAnaesthetist = c.GetSelect2Id('#select2AnaesthesiaTypeID') == 88; // if NO ANAESTHESIA 123
    var OT_Room = c.GetSelect2Id('#select2OperationTheatreId');
    var OT_patient = c.GetSelect2Id('#select2Name');

    var msg = '';
    var ctr = 0;

    if (OT_patient == "") {
        ctr++;
        msg = msg + ctr.toString() + '. Select Patient. <br>';
    }
    if (OT_Room == "") {
        ctr++;
        msg = msg + ctr.toString() + '. Select OT Room. <br>';
    }
    if (Date.parse(startDateTime_OperationTheatre) < Date.parse(admitted_date)) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Operation Theatre start datetime. It should be greater than the patient admitted datetime. <br>';
    }
    if (Date.parse(endDatetime_OperationTheatre) < Date.parse(admitted_date)) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Operation Theatre end datetime. It should be greater than the patient admitted datetime. <br>';
    }

    if (!IsNoAnaesthetist && Date.parse(startDateTime_Anaesthesia) < Date.parse(admitted_date)) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Anaesthesia start datetime. It should be greater than the patient admitted datetime. <br>';
    }
    if (!IsNoAnaesthetist && Date.parse(endDateTime_Anaesthesia) < Date.parse(admitted_date)) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Anaesthesia end datetime. It should be greater than the patient admitted datetime. <br>';
    }

    if (Date.parse(startDateTime_Surgery) < Date.parse(admitted_date)) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Surgery start datetime. It should be greater than the patient admitted datetime. <br>';
    }
    if (Date.parse(endDateTime_Surgery) < Date.parse(admitted_date)) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Surgery end datetime. It should be greater than the patient admitted datetime. <br>';
    }
    if (icheckrecovery && Date.parse(startDateTime_RecoveryRoom) < Date.parse(admitted_date)) {
        ctr++;
        msg = msg + ctr.toString() + '. Check RecoveryRoom start datetime. It should be greater than the patient admitted datetime. <br>';
    }
    if (icheckrecovery && Date.parse(endDateTime_RecoveryRoom) < Date.parse(admitted_date)) {
        ctr++;
        msg = msg + ctr.toString() + '. Check RecoveryRoom end datetime. It should be greater than the patient admitted datetime. <br>';
    }

    if (Date.parse(startDateTime_OperationTheatre) > Date.parse(endDatetime_OperationTheatre)) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Operation Theatre end datetime. It should be greater than the start datetime <br>';
    }
    if (Date.parse(startDateTime_Anaesthesia) > Date.parse(endDateTime_Anaesthesia)) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Anaesthesia end datetime. It should be greater than the start datetime <br>';
    }
    if (Date.parse(startDateTime_Surgery) > Date.parse(endDateTime_Surgery)) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Surgery end datetime. It should be greater than the start datetime <br>';
    }
    if (icheckrecovery && Date.parse(startDateTime_RecoveryRoom) > Date.parse(endDateTime_RecoveryRoom)) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Recovery Room end datetime. It should be greater than the start datetime <br>';
    }

    if (!IsNoAnaesthetist && !(Date.parse(startDateTime_Anaesthesia) >= Date.parse(startDateTime_OperationTheatre) && Date.parse(startDateTime_Anaesthesia) <= Date.parse(endDatetime_OperationTheatre))) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Anaesthesia start datetime. It should be between Operation Theatre (start) and (end) datetime. <br>';
    }
    if (!IsNoAnaesthetist && !(Date.parse(endDateTime_Anaesthesia) >= Date.parse(startDateTime_OperationTheatre) && Date.parse(endDateTime_Anaesthesia) <= Date.parse(endDatetime_OperationTheatre))) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Anaesthesia end datetime. It should be between Operation Theatre (start) and (end) datetime. <br>';
    }
    if (!(Date.parse(startDateTime_OperationTheatre) <= Date.parse(getdate))) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Operation Theatre start datetime. It should be lesser or equal to the curent datetime. <br>';
    }
    if (!(Date.parse(endDatetime_OperationTheatre) <= Date.parse(getdate))) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Operation Theatre end datetime. It should be lesser or equal to the curent datetime. <br>';
    }
    if (!(Date.parse(startDateTime_Anaesthesia) <= Date.parse(getdate))) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Anaesthesia start datetime. It should be lesser or equal to the curent datetime. <br>';
    }
    if (!(Date.parse(endDateTime_Anaesthesia) <= Date.parse(getdate))) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Anaesthesia end datetime. It should be lesser or equal to the curent datetime. <br>';
    }
    if (!(Date.parse(startDateTime_Surgery) >= Date.parse(startDateTime_OperationTheatre) && Date.parse(startDateTime_Surgery) <= Date.parse(endDatetime_OperationTheatre))) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Surgery start datetime. It should be between Operation Theatre (start) and (end) datetime. <br>';
    }
    if (!(Date.parse(endDateTime_Surgery) >= Date.parse(startDateTime_OperationTheatre) && Date.parse(endDateTime_Surgery) <= Date.parse(endDatetime_OperationTheatre))) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Surgery end datetime. It should be between Operation Theatre (start) and (end) datetime. <br>';
    }
    if (!(Date.parse(startDateTime_Surgery) <= Date.parse(getdate))) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Surgery start datetime. It should be lesser or equal to the curent datetime. <br>';
    }
    if (!(Date.parse(endDateTime_Surgery) <= Date.parse(getdate))) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Surgery end datetime. It should be lesser or equal to the curent datetime. <br>';
    }
    if (icheckrecovery && !(Date.parse(startDateTime_RecoveryRoom) <= Date.parse(getdate)) && startDateTime_RecoveryRoom.length > 0) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Recovery Room start datetime. It should be lesser or equal to the curent datetime. <br>';
    }
    if (icheckrecovery && !(Date.parse(endDateTime_RecoveryRoom) <= Date.parse(getdate)) && endDateTime_RecoveryRoom.length > 0) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Recovery Room end datetime. It should be lesser or equal to the curent datetime. <br>';
    }
    if (icheckrecovery && !(Date.parse(startDateTime_RecoveryRoom) > Date.parse(endDatetime_OperationTheatre))) {
        ctr++;
        msg = msg + ctr.toString() + '. Check Recovery Room start datetime. It should be greater than Operation Theatre end datetime. <br>';
    }

    ///ollldd

    //var ctr = 0;
    //var msg = ''

    //if (c.IsDateEmpty('#dtOTStartDateTime')) {
    //    ctr++;
    //    msg = msg + ctr.toString() + '. Operation Theatre start datetime is required. <br>';
    //}
    //if (c.IsDateEmpty('#dtOTEndDateTime')) {
    //    ctr++;
    //    msg = msg + ctr.toString() + '. Operation Theatre end datetime is required. <br>';
    //}
    //if (c.GetSelect2Id('#select2AnaesthesiaTypeID') != 88 && c.GetSelect2Id('#select2AnaesthesiaTypeID') != "") {
    //    if (c.IsDateEmpty('#dtAnaesthesiaStartDateTime')) {
    //        ctr++;
    //        msg = msg + ctr.toString() + '. Anaesthesia start datetime is required. <br>';
    //    }
    //    if (c.IsDateEmpty('#dtAnaesthesiaEndDateTime')) {
    //        ctr++;
    //        msg = msg + ctr.toString() + '. Anaesthesia end datetime is required. <br>';
    //    }        
    //}
    //if (c.IsDateEmpty('#dtIncisionDateTime')) {
    //    ctr++;
    //    msg = msg + ctr.toString() + '. Surgery (Incision / Closure) start datetime is required. <br>';
    //}
    //if (c.IsDateEmpty('#dtClosureDateTime')) {
    //    ctr++;
    //    msg = msg + ctr.toString() + '. Surgery (Incision / Closure) end datetime is required. <br>';
    //}
    //// ---------------------------------------------------------------------------------------------------------------
    //if (!c.IsDate('#dtOTStartDateTime')) {
    //    ctr++;
    //    msg = msg + ctr.toString() + '. Invalid start datetime on Operation Theatre. <br>';
    //}
    //if (!c.IsDate('#dtOTEndDateTime')) {
    //    ctr++;
    //    msg = msg + ctr.toString() + '. Invalid end datetime on Operation Theatre. <br>';
    //}
    //if (!c.IsDate('#dtAnaesthesiaStartDateTime')) {
    //    ctr++;
    //    msg = msg + ctr.toString() + '. Invalid start datetime on Anaesthesia. <br>';
    //}
    //if (!c.IsDate('#dtAnaesthesiaEndDateTime')) {
    //    ctr++;
    //    msg = msg + ctr.toString() + '. Invalid end datetime on Anaesthesia. <br>';
    //}
    //if (!c.IsDate('#dtIncisionDateTime')) {
    //    ctr++;
    //    msg = msg + ctr.toString() + '. Invalid start datetime on Surgery (Incision / Closure). <br>';
    //}
    //if (!c.IsDate('#dtClosureDateTime')) {
    //    ctr++;
    //    msg = msg + ctr.toString() + '. Invalid end datetime on Surgery (Incision / Closure). <br>';
    //}
    //if (!c.IsDate('#dtRecoveryStartDateTime')) {
    //    ctr++;
    //    msg = msg + ctr.toString() + '. Invalid start datetime on Recovery Room. <br>';
    //}
    //if (!c.IsDate('#dtRecoveryEndDateTime')) {
    //    ctr++;
    //    msg = msg + ctr.toString() + '. Invalid end datetime on Recovery Room. <br>';
    //}

    if (msg.length > 0) {
        var msg1 = "<b>Current DateTime: " + getdate + "<br>" ;
        msg1 += "Admitted DateTime: " + admitted_date + "</b><br><br>"  ;
        c.MessageBoxErr('Required...', 'Please check the following required value(s): <br> <br>' + msg1 + msg);
    }

    return msg.length > 0;

}

function Validated() {
    var req = false;
    var startDateTime_Anaesthesia = $('#dtAnaesthesiaStartDateTime').val();
    var endDateTime_Anaesthesia = $('#dtAnaesthesiaEndDateTime').val();
 
    if ($('#ListOfStation').val() == null) {
        c.MessageBoxErr('Error...', 'Please select a station in the upper right.');
        
    }
    else if (c.IsEmptySelect2('#select2PIN')) {
        c.MessageBoxErr('Required...', 'Please select a PIN / Name.' );
        c.SetActiveTab('sectionA');
     
    }
    else if (c.IsEmptySelect2('#select2OperationTheatreId')) {
        c.MessageBoxErr('Empty...', 'Please select an operation theatre.');
        c.SetActiveTab('sectionA');
    }
    else if (c.IsEmptySelect2('#select2AnaesthesiaTypeID')) {
        c.MessageBoxErr('Required...', 'Anaesthesia is required.');
        c.SetActiveTab('sectionA');
    } 
    else if (c.GetSelect2Id('#select2AnaesthesiaTypeID') != 88 &&  c.GetSelect2Id('#select2AnaesthesiaTypeID') != "" && (startDateTime_Anaesthesia == "" || endDateTime_Anaesthesia == ""))
    {
        c.MessageBoxErr('Required...', 'Anaesthetist Date is required.');
        c.SetActiveTab('sectionA');
    }
    else if (DateIsRequired()) {
    }
    // Check if there is an Anaesthetist if with anaesthesia is selected.
    else if (c.GetSelect2Id('#select2AnaesthesiaTypeID') != 88 &&
        c.GetSelect2Id('#select2AnaesthesiaTypeID') != "" &&
        $('#select2TAnaesthetist').val() == "") {
        c.MessageBoxErr('Required...', 'Anaesthetist is required.');
        c.SetActiveTab('sectionB');
    }
    else if ($(TblGridSurgeryId).DataTable().rows().nodes().length == 0) {
        c.MessageBoxErr('Required...', 'Surgery is required. Please add an item on the list.');
        c.SetActiveTab('sectionB');
    }
    else if ($('#select2TSurgeon').val() == "") {
        c.MessageBoxErr('Required...', 'Surgeon is required.');
        c.SetActiveTab('sectionB');
    }
  
    else if ($('#select2TScrubNurse').val() == "") {
        c.MessageBoxErr('Required...', 'Scrub nurse is required.');
        c.SetActiveTab('sectionB');
    }
    else {
        req = true;
    }

    return req;
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
function HandleEnableEntries() {
    console.log('HandleEnableEntries' + Action);
    // VAED
    if (Action == 0 || Action == 3) { // view or delete
        c.iCheckDisable('#iChkStart', true);
        //c.iCheckDisable('#iChkEnd', true);

        c.DisableSelect2('#select2PIN', true);
        c.DisableSelect2('#select2Name', true);
        c.DisableSelect2('#select2BedNo', true);
        c.DisableSelect2('#select2OperationTheatreId', true);
        c.DisableSelect2('#select2AnaesthesiaTypeID', true);
        c.DisableSelect2('#select2ShiftingNurseId', true);
        c.DisableSelect2('#select2CirculatoryNurseId', true);
        c.DisableSelect2('#select2TSurgeon', true);
        c.DisableSelect2('#select2TAssistantSurgeon', true);
        c.DisableSelect2('#select2TAnaesthetist', true);
        c.DisableSelect2('#select2TScrubNurse', true);
        c.DisableSelect2('#select2TEquipment', true);
        c.DisableSelect2('#select2AnaesthetistNotesId', true);


        $("#dtOTStartDateTime").attr("disabled", "disabled");
        $("#dtOTEndDateTime").attr("disabled", "disabled");
        $("#dtAnaesthesiaStartDateTime").attr("disabled", "disabled");
        $("#dtAnaesthesiaEndDateTime").attr("disabled", "disabled");
        $("#dtIncisionDateTime").attr("disabled", "disabled");
        $("#dtClosureDateTime").attr("disabled", "disabled");
        $("#dtRecoveryStartDateTime").attr("disabled", "disabled");
        $("#dtRecoveryEndDateTime").attr("disabled", "disabled");

 
        c.DisableDateTimePicker('#dtAdmitted', true);

        c.Disable('#txtDisease', true);
        c.Disable('#txtAnaesthetistNotes', true);
        c.Disable('#txtSurgeonNotes', true);

        //c.ButtonDisable('#btnAddSurgery', true);
        //c.ButtonDisable('#btnRemoveSurgery', true);
        $('#btnAddSurgery').hide();
        $('#btnRemoveSurgery').hide();

    }
    else if (Action == 1 || Action == 2) { // add or edit
        c.iCheckDisable('#iChkStart', false);
        //c.iCheckDisable('#iChkEnd', false);

        c.DisableSelect2('#select2PIN', false);
        c.DisableSelect2('#select2Name', false);
        c.DisableSelect2('#select2BedNo', false);
        c.DisableSelect2('#select2OperationTheatreId', false);
        c.DisableSelect2('#select2AnaesthesiaTypeID', false);
        c.DisableSelect2('#select2ShiftingNurseId', false);
        c.DisableSelect2('#select2CirculatoryNurseId', false);
        c.DisableSelect2('#select2TSurgeon', false);
        c.DisableSelect2('#select2TAssistantSurgeon', false);
        c.DisableSelect2('#select2TAnaesthetist', false);
        c.DisableSelect2('#select2TScrubNurse', false);
        c.DisableSelect2('#select2TEquipment', false);
        c.DisableSelect2('#select2AnaesthetistNotesId', false);

        $("#dtOTStartDateTime").removeAttr("disabled");
        $("#dtOTEndDateTime").removeAttr("disabled");
        $("#dtAnaesthesiaStartDateTime").removeAttr("disabled");
        $("#dtAnaesthesiaEndDateTime").removeAttr("disabled");
        $("#dtIncisionDateTime").removeAttr("disabled");
        $("#dtClosureDateTime").removeAttr("disabled");
        $("#dtRecoveryStartDateTime").removeAttr("disabled");
        $("#dtRecoveryEndDateTime").removeAttr("disabled");
 
        c.DisableDateTimePicker('#dtAdmitted', true);

        c.Disable('#txtDisease', false);
        c.Disable('#txtAnaesthetistNotes', false);
        c.Disable('#txtSurgeonNotes', false);

        //c.ButtonDisable('#btnAddSurgery', false);
        //c.ButtonDisable('#btnRemoveSurgery', false);
        $('#btnAddSurgery').show();
        $('#btnRemoveSurgery').show();

    }
    else {
        c.Show('#Entry', false);
        c.Show('#DashBoard', true);
    }

    var Is24 = c.GetValue('#Is24') == 1;
    var en = !((Action == 2 && Is24 == false) || Action == 1);
    c.DisableSelect2('#select2TSurgeon', en);
    c.DisableSelect2('#select2TAssistantSurgeon', en);
    c.DisableSelect2('#select2TAnaesthetist', en);
    c.DisableSelect2('#select2TScrubNurse', en);
    c.DisableSelect2('#select2TEquipment', en);
    if (en) {
        $('#btnAddSurgery').hide();
        $('#btnRemoveSurgery').hide();
    }

    var IsNoAnaesthetist = c.GetSelect2Id('#select2AnaesthesiaTypeID') == 88 && (Action == 1 || Action == 2);
    //if (IsNoAnaesthetist) {
    //    c.SetDateTimePicker('#dtAnaesthesiaStartDateTime', '');
    //    c.SetDateTimePicker('#dtAnaesthesiaEndDateTime', '');
    //}
    if (IsNoAnaesthetist) { //no anaesthesia
        $("#dtAnaesthesiaStartDateTime").val("");
        $("#dtAnaesthesiaStartDateTime").attr("disabled", "disabled");
        $("#dtAnaesthesiaEndDateTime").val("");
        $("#dtAnaesthesiaEndDateTime").attr("disabled", "disabled");
    } else {
        $("#dtAnaesthesiaStartDateTime").removeAttr("disabled");
        $("#dtAnaesthesiaEndDateTime").removeAttr("disabled");
    }
 
    if (Action == 0) {
        $("#dtAnaesthesiaStartDateTime").attr("disabled", "disabled");
        $("#dtAnaesthesiaEndDateTime").attr("disabled", "disabled");
       
    }
 

}
function HandleButtonNotUse() {
    $('.NotUse').hide();
}

function Save() {
     if (Action != 3) {
        var ret = Validated();
        if (!ret) return;
    }

    $.each(TblGridSurgery.rows().data(), function (i, row) {
        ctrC = 0;
        while (ctrC < row.Count) {
           
            if (row.id == null || row.id == "") {
                c.MessageBoxErr('Required...', 'Please select surgery..');
                c.SetActiveTab('sectionB');
                return false;
            }
            ctrC++;
        }
    });


    c.ButtonDisable('#btnSave', true);


    var entry;
    entry = [];
    entry = {};
    entry.Action = Action;
    entry.CurrentStationID = $("#ListOfStation").val();
    entry.ID = c.GetValue('#Id');
    entry.IPIDOPID = c.GetSelect2Id('#select2PIN');
    entry.OTID = c.GetSelect2Id('#select2OperationTheatreId');
    entry.AnaesthesiaTypeID = c.GetSelect2Id('#select2AnaesthesiaTypeID');
 
    entry.OTStartDateTime = $('#dtOTStartDateTime').val();
    entry.OTEndDateTime = $('#dtOTEndDateTime').val();
    entry.AnaesthesiaStartDateTime= $('#dtAnaesthesiaStartDateTime').val();
    entry.AnaesthesiaEndDateTime  = $('#dtAnaesthesiaEndDateTime').val();
    entry.IncisionDateTime  = $('#dtIncisionDateTime').val();
    entry.ClosureDateTime= $('#dtClosureDateTime').val();
    entry.RecoveryStartDateTime  = $('#dtRecoveryStartDateTime').val();
    entry.RecoveryEndDateTime = $('#dtRecoveryEndDateTime').val();
 
    entry.disease = c.GetValue('#txtDisease');
    entry.BedId = c.GetSelect2Id('#select2BedNo');
    entry.CirculatoryNurseId = c.GetSelect2Id('#select2CirculatoryNurseId');

    entry.OTNotes = [];
    entry.OTNotes.push({
        orderid: c.GetValue('#Id'),
        DoctorNotes: c.GetValue('#txtSurgeonNotes'),
        anaesthesianotes: c.GetValue('#txtAnaesthetistNotes'),
        doctorid: c.GetSelect2Id('#select2AnaesthetistNotesId')
    });

    var ctrC = 0;
    entry.OTOrderDetail = [];
    $.each(TblGridSurgery.rows().data(), function (i, row) {
        ctrC = 0;
        while (ctrC < row.Count) {
            ctrC++;
            entry.OTOrderDetail.push({
                type: 1,
                typeid: row.id,
                SpecialisationId: "",  // ?
                charges: "0",
                priority: row.No,
                count: 1
            });            
        }        
    });

    ctrC = 0;
    var arr = $('#select2TSurgeon').val();
    $.each(arr.split(','), function (i, val) {
        ctrC++;
        entry.OTOrderDetail.push({
            type: 2,
            typeid: val,
            charges: "0",
            priority: ctrC
        });
    });

    ctrC = 0;
    arr = $('#select2TAssistantSurgeon').val();
    $.each(arr.split(','), function (i, val) {
        ctrC++;
        entry.OTOrderDetail.push({
            type: 3,
            typeid: val,
            charges: "0",
            priority: ctrC
        });
    });

    ctrC = 0;
    arr = $('#select2TAnaesthetist').val();
    $.each(arr.split(','), function (i, val) {
        ctrC++;
        entry.OTOrderDetail.push({
            type: 4,
            typeid: val,
            charges: "0",
            priority: ctrC
        });
    });

    ctrC = 0;
    arr = $('#select2TScrubNurse').val();
    $.each(arr.split(','), function (i, val) {
        ctrC++;
        entry.OTOrderDetail.push({
            type: 5,
            typeid: val,
            charges: "0",
            priority: ctrC
        });
    });

    ctrC = 0;
    arr = $('#select2TEquipment').val();
    $.each(arr.split(','), function (i, val) {
        ctrC++;
        entry.OTOrderDetail.push({
            type: 6,
            typeid: val,
            charges: "0",
            priority: ctrC
        });
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
                    TblGridList.row('tr.selected').remove().draw(false);
                }

                Action = 0;
                HandleEnableButtons();
                HandleEnableEntries();
            };

            c.MessageBox(data.Title, data.Message.replace('100-',''), OkFunc);
            var s = data.Message;
            var on = s.split(':');
            c.SetValue('#txtSlNo', on[1]);
            c.SetActiveTab('sectionA');

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
    var param = {
        Id: id,
        CurrentStationID:$("#ListOfStation").val()
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
        success: function (list) {
            $('#preloader').hide();
            $('.Show').show();

            if (list.length == 0) {
                c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
                TblGridList.row('tr.selected').remove().draw(false);
                return;
            }

            var data = list[0];
            console.log(data);
            c.SetValue('#Id', data.Id);
            c.SetValue('#Is24', data.Is24);

            c.SetSelect2('#select2PIN', data.IPID, data.PIN);
            c.SetSelect2('#select2Name', data.IPID, data.Name);
            c.SetSelect2('#select2BedNo', data.BedId, data.BedNo);
            c.SetSelect2('#select2OperationTheatreId', data.OperationTheatreId, data.OperationTheatreName);
            c.SetSelect2('#select2AnaesthesiaTypeID', data.AnaesthesiaTypeID, data.AnaesthesiaTypeName);
            c.SetSelect2('#select2ShiftingNurseId', data.ShiftingNurseId, data.ShiftingNurseName);
            c.SetSelect2('#select2CirculatoryNurseId', data.CirculatoryNurseId, data.CirculatoryNurseName);

            BindSelectedSurgery(data.SelectedSurgeryList);
            c.SetSelect2List('#select2TSurgeon', data.SelectedSurgeonList);
            c.SetSelect2List('#select2TAssistantSurgeon', data.SelectedAsstSurgeonList);
            c.SetSelect2List('#select2TAnaesthetist', data.SelectedAnaesthetistList);
            c.SetSelect2List('#select2TScrubNurse', data.SelectedScrubNurseList);
            c.SetSelect2List('#select2TEquipment', data.SelectedEquipmentList);

            c.SetValue('#txtOperator', data.Operator);
            c.SetValue('#txtDateTime', data.DateTime);
            c.SetValue('#txtPackage', data.Package);
            c.SetValue('#txtWard', data.Ward);
            c.SetValue('#txtSlNo', data.SlNo);
            c.SetValue('#txtPrimaryConsultant', data.PrimaryConsultant);
            c.SetValue('#txtAge', data.Age);
            c.SetValue('#txtGender', data.Gender);
            c.SetValue('#txtCategory', data.Category);
            c.SetValue('#Company', data.Company);
            c.SetValue('#txtDisease', data.Disease);

            console.log('#dtOTStartDateTime');
            console.log(data);
          //  c.SetValue('#dtOTStartDateTime', data.OTStartDateTime);

            $('#dtOTStartDateTime').data('daterangepicker').setStartDate(moment(data.OTStartDateTime).format('DD MMM YYYY HH:mm'))

            $('#dtOTEndDateTime').data('daterangepicker').setStartDate(moment(data.OTEndDateTime).format('DD MMM YYYY HH:mm'))
            $('#dtIncisionDateTime').data('daterangepicker').setStartDate(moment(data.IncisionDateTime).format('DD MMM YYYY HH:mm'))
            $('#dtClosureDateTime').data('daterangepicker').setStartDate(moment(data.ClosureDateTime).format('DD MMM YYYY HH:mm'))

            if (data.AnaesthesiaStartDateTime !== null ) {
                $('#dtAnaesthesiaStartDateTime').data('daterangepicker').setStartDate(moment(data.AnaesthesiaStartDateTime).format('DD MMM YYYY HH:mm'))
                $('#dtAnaesthesiaEndDateTime').data('daterangepicker').setStartDate(moment(data.AnaesthesiaEndDateTime).format('DD MMM YYYY HH:mm'))
            } else {
                c.SetValue('#dtAnaesthesiaStartDateTime', '');
                c.SetValue('#dtAnaesthesiaEndDateTime', '');
            }
          
            if (data.RecoveryStartDateTime !== null) {
                $('#dtRecoveryStartDateTime').data('daterangepicker').setStartDate(moment(data.RecoveryStartDateTime).format('DD MMM YYYY HH:mm'))
                $('#dtRecoveryEndDateTime').data('daterangepicker').setStartDate(moment(data.RecoveryEndDateTime).format('DD MMM YYYY HH:mm'))
            } else {
                c.SetValue('#dtRecoveryStartDateTime','');
                c.SetValue('#dtRecoveryEndDateTime','');
            }
 
            if (data.OTNotes.length > 0) {
                var r = data.OTNotes[0];
                c.SetSelect2('#select2AnaesthetistNotesId', r.DoctorId, r.DoctorIdName);
                c.SetValue('#txtAnaesthetistNotes', r.AnaesthesiaNotes);
                c.SetValue('#txtSurgeonNotes', r.DoctorNotes);
            }

            HandleEnableButtons();
            HandleEnableEntries();

            var IsNoAnaesthetist = data.AnaesthesiaTypeID == 88; // if NO ANAESTHESIA
            c.DisableSelect2('#select2TAnaesthetist', IsNoAnaesthetist);
            if (IsNoAnaesthetist) c.Select2Clear('#select2TAnaesthetist');

            c.ModalShow('#modalEntry', true);
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });
}
function Refresh() {
    ShowList(-1);
}

function ShowListColumns() {
    var cols = [
    { targets: [0], data: "Action", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "W", className: '', visible: true, searchable: false, width: "0%" },
    { targets: [2], data: "Id", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [3], data: "SlNo", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [4], data: "PIN", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [5], data: "Name", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [6], data: "OTStartDateTimeD", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [7], data: "OTEndDateTimeD", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [8], data: "Operator", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [9], data: "DateTime", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [10], data: "Ward", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [11], data: "IPID", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [12], data: "BedId", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [13], data: "BedNo", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [14], data: "PrimaryConsultant", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [15], data: "Age", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [16], data: "Gender", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [17], data: "OperatorId", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [18], data: "AnaesthetistNotes", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [19], data: "SurgeonNotes", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [20], data: "OperationTheatreId", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [21], data: "OperationTheatreName", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [22], data: "OTStartDateTime", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [23], data: "OTEndDateTime", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [24], data: "AnaesthesiaStartDateTime", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [25], data: "IncisionDateTime", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [26], data: "ClosureDateTime", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [27], data: "RecoveryStartDateTime", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [28], data: "RecoveryEndDateTime", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [29], data: "ScheduleRequestedById", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [30], data: "ScheduleRequestedByName", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [31], data: "Category", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [32], data: "Company", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [33], data: "Package", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [34], data: "Disease", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [35], data: "ShiftingNurseId", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [36], data: "ShiftingNurseName", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [37], data: "CirculatoryNurseId", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [38], data: "CirculatoryNurseName", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [39], data: "AnaesthesiaTypeID", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [40], data: "AnaesthesiaTypeName", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [41], data: "RequestedById", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [42], data: "RequestedByName", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [43], data: "stationid", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [44], data: "DateTimeD", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [45], data: "AnaesthesiaStartDateTimeD", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [46], data: "AnaesthesiaEndDateTimeD", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [47], data: "IncisionDateTimeD", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [48], data: "ClosureDateTimeD", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [49], data: "RecoveryStartDateTimeD", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [50], data: "RecoveryEndDateTimeD", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [50], data: "Is24", className: '', visible: true, searchable: false, width: "0%" }
    ];
    return cols;
}
function ShowListRowCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['Is24'];
        var $nRow = $(nRow);
        if (value === 1) {
            $nRow.css({ "background-color": "#4fb5b0" });
        } else {
            $nRow.css({ "background-color": "#cfd0d6" });
 
        }
    };
    return rc;
}
function ShowList(id) {
    var Url = baseURL + "ShowList";
    var CurrentStationID=$("#ListOfStation").val();
    var param = {
        Id: id,
        CurrentStationID: CurrentStationID == null ? 0 : CurrentStationID   
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
            BindList(data);
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
    //    scrollY: 400,
    //    scrollX: true,
    //    fnRowCallback: ShowListRowCallBack
    //});
    TblGridList = $(TblGridListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 380    ,
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
}

function ShowSelectedSurgeryColumns() {
    var Is24 = c.GetValue('#Is24') == 1;
    var cols = [
    { targets: [0], data: "id", className: '', visible: false, searchable: false, width: "0%" },
    { targets: [1], data: "No", className: '', visible: true, searchable: false, width: "10%" },
    {
        targets: [2], data: "name"
        , className: (Action == 2 && Is24 == false) || Action == 1 ? 'ClassSelect2TSurgery' : ''
        , visible: true, searchable: true, width: "60%"
    },
    {
        targets: [3], data: "Count"
        , className: (Action == 2 && Is24 == false) || Action == 1 ? 'ClassMskQty' : ''
        , visible: true, searchable: true, width: "20%"
    },
    ];
    return cols;
}
function ShowSelectedSurgeryRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function BindSelectedSurgery(data) {
    console.log('BindSelectedSurgery');
    console.log(data);
    //TblGridSurgery = $(TblGridSurgeryId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: false,
    //    searching: false,
    //    ordering: false,
    //    info: false,
    //    columns: ShowSelectedSurgeryColumns(),
    //    bAutoWidth: false,
    //    scrollY: 400,
    //    scrollX: true,
    //    fnRowCallback: ShowSelectedSurgeryRowCallBack
    //});
    TblGridSurgery = $(TblGridSurgeryId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 380,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        fnRowCallback: ShowSelectedSurgeryRowCallBack(),
        columns: ShowSelectedSurgeryColumns()
    });

    if (Action == 1 || Action == 2) {
        InitSelectedSurgery();
    }
}
function SetupSelectedSurgery() {

    $.editable.addInputType('txtCount', {
        element: function (settings, original) {

            var input = $('<input id="txtCount" style="width:100%; height:30px; margin:0px, padding:0px;" type="number" class="form-control">');
            $(this).append(input);

            return (input);
        }
    });
    $.editable.addInputType('select2TSurgery', {
        element: function (settings, original) {
            var input = $('<input id="select2TSurgery" style="width:100%; height:30px;" type="text" class="form-control required">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#select2TSurgery').select2({
                //minimumInputLength: 1,
                allowClear: true,
                ajax: {
                    cache: false,
                    quietMillis: 150,
                    url: baseURL + 'Select2SelectedSurgery',
                    dataType: 'jsonp',
                    data: function (term, page) {
                        return {
                            pageSize: pageSize,
                            pageNum: page,
                            searchTerm: term,
                            SurgeryRecordId: 0,
                            IsSelected: 0
                        };
                    },
                    results: function (data, page) {
                        var more = (page * pageSize) < data.Total;
                        return { results: data.Results, more: more };
                    }
                }
            }).on("select2-blur", function () {
                $("#select2TSurgery").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#select2TSurgery").closest('form').submit(); }
                else { $("#select2TSurgery").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#select2TSurgery').val();
                $("#select2TSurgery").select2("data", { id: a, text: a });
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
            if ($("#select2TSurgery", this).select2('val') != null && $("#select2TSurgery", this).select2('val') != '') {
                $("input", this).val($("#select2TSurgery", this).select2("data").text);

            }
        }
    });
    $.editable.addInputType('mskQty', {
        element: function (settings, original) {
            var input = $('<input id="mskQty" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control">');
            $(this).append(input);
            return (input);
        }
        //plugin: function (settings, original) {
        //    $(this).find('#mskQty').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        //}
    });
}
function InitSelectedSurgery() {

    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassTxtCount', TblGridSurgery.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridSurgery.cell($(this).closest('td')).index();
        TblGridSurgery.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'txtCount', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });
    // ------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassSelect2TSurgery', TblGridSurgery.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridSurgery.cell($(this).closest('td')).index();
        var id = c.GetSelect2Id('#select2TSurgery');
        TblGridSurgery.cell(cell.row, 0).data(id);
        TblGridSurgery.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'select2TSurgery', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
        "event": 'click', "submit": '', "cancel": '', "placeholder": 'select surgery here...', "cssclass": "coleditor"
    });
    $('.ClassMskQty', TblGridSurgery.rows().nodes()).editable(function (sVal, settings) {
        var cell = TblGridSurgery.cell($(this).closest('td')).index();
        TblGridSurgery.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
    {
        "type": 'mskQty', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    // Resize all rows.
    $(TblGridSurgeryId + ' tr').addClass('trclass');

}

function FetchPatientDetails(list) {
    c.SetValue('#txtWard', list[7]);
    c.SetValue('#txtAge', list[8]);
    c.SetValue('#txtGender', list[9]);
    c.SetValue('#txtPrimaryConsultant', list[10]);
    c.SetValue('#txtPackage', list[11]);
    c.SetValue('#txtCategory', list[14]);
    c.SetValue('#txtCompany', list[13]);
    c.SetDateTimePicker('#dtAdmitted', list[17]);
    
}
