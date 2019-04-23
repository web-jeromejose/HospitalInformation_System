/****
 * LEGEND  
 *      //for CAIRO ONLY 2017 
        //CheckPermissionNEWBtn(); -- permission on the entry and the reserve and confirm button
        //for hail jeddah
        -- no restriction
 * 
 * */


var c = new Common();
var Action = -1;

var TblGridList;
var TblGridListId = "#gridList";
var TblGridListDataRow;

var TblGridResults;
var TblGridResultsId = "#gridResults";
var TblGridResultsDataRow;

var SchedViewType;

var IsDoctorAllowed;
var CheckPermissionNEW = -1;

$(document).ready(function () {

    c.Show('#FrmCalendar', false);
    c.Show('#ButtonsOnBoard', true);
    c.Show('#ButtonsOnEntry', false);
    c.Show('#DashBoard', true);
    c.Show('#Entry', false);
    
    c.SetTitle("OT Scheduler");
    c.DefaultSettings();

    SetupDataTables();

    InitButton();
    InitICheck();
    InitSelect2();
    InitDateTimePicker();
    InitDataTables();
    InitCalendar();

    DefaultDisable();
    DefaultReadOnly();
    DefaultValues();

    HandleEnableButtons();
    HandleEnableEntries();

    //ShowList(-1);
    ShowCalendar();
//    ShowAllowedDoctor();
    $('#Dashboard').hide();
    $('#FrmFindPatient').hide();
    $('#ButtonsOnFilter').hide();


  


    

});
$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // for future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();

    if (tabNameSelected == "Fields") {
        $('#btnPatientFilterSearch').show();
        $('#btnPatientFilterOK').hide();
    }
    else if (tabNameSelected == "Results") {
        $('#btnPatientFilterSearch').hide();
        $('#btnPatientFilterOK').show();
    }

    RedrawPlugins();
    TblGridResults.columns.adjust().draw();

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
        Action = 0;
        View(TblGridListDataRow.ID);
    }
});

$(document).on("click", TblGridResultsId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        tr.removeClass('selected');
        $('tr.selected').removeClass('selected');
        tr.addClass('selected');

        TblGridResultsDataRow = TblGridResults.row($(this).parents('tr')).data();

    }
});
$(document).on("dblclick", TblGridResultsId + " td", function (e) {
    e.preventDefault();

    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');

        TblGridResultsDataRow = TblGridResults.row($(this).parents('tr')).data();
   
        $("#btnPatientFilterOK").click();
        
    }
});

function CheckOTHeadUser()
{

    var entry;
    entry = [];
    entry = {};
    entry.Action = 0;

    $.ajax({
        url: $('#url').data('checkotheaduser'),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
  
        },
        success: function (data) {
            /*cairo  if user exist ..
            they can edit the Anaesthetist dropdown as cairo change request
            */
            //if (data.ErrorCode == 0) {
            //    c.DisableSelect2('#select2TAnaesthetist', true);
            //} else {          
            //    c.DisableSelect2('#select2TAnaesthetist', false);
            //}
        },
        error: function (xhr, desc, err) {
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });


}
function InitButton() {
    $('#btnRefresh').click(function () {
        location.reload();
    });
    $('#btnFilter').click(function () {
        c.ModalShow('#modalFilter', true);
    });
    $('#btnView').click(function () {

        c.Notify("View", "This is a sample view...");

        return;

        if (TblGridList.rows('.selected').data().length == 0) {
            c.MessageBoxErr("Select...", "Please select a row to view.", null);
            return;
        }

        var id = TblGridListDataRow.Id;
        Action = 0;
        View(id);
        c.SetActiveTab('sectionA');
    });
    $('#btnNewEntry').click(function () {
        //for CAIRO ONLY
        //CheckPermissionNEWBtn();
        //for hail jeddah
    
            Action = 1;
            c.ModalShow('#modalEntry', true);
            DefaultDisable();
            DefaultReadOnly();
            DefaultEmpty();
            DefaultValues();
            InitDataTables();
            HandleEnableButtons();
            HandleEnableEntries();
            c.SetActiveTab('sectionA');
            

            var id = c.GetSelect2Id('#select2OperationTheatreIdSearch');
            var text = c.GetSelect2Text('#select2OperationTheatreIdSearch');
            c.SetSelect2('#select2OperationTheatreId', id, text);

            //if (IsDoctorAllowed == 1) {
            //    c.DisableSelect2('#Select2Status', true);
            //}
            //else {
            //    c.DisableSelect2('#Select2Status', false);
            //}

            if (IsDoctorAllowed == 1) {
                
                c.ButtonDisable('#btnReserve', true);
                c.ButtonDisable('#btnConfirm', false);

            } else {
                c.ButtonDisable('#btnReserve', false);
                c.ButtonDisable('#btnConfirm', true); 
            }

            c.DisableSelect2('#Select2Status', true);

     

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
    $('.btnCalendar').click(function () {
        c.ModalShow('#FrmCalendar', true);
        InitCalendar();
    });

    $('#btnClose').click(function () {

        Action = -1;
        HandleEnableButtons();
        HandleEnableEntries();
        c.ModalShow('#modalEntry', false);
        RedrawPlugins();

        

        var msg = "";
        if (Action == 0) {
            msg = "Are you sure you want to cancel the update?";
        }
        else if (Action == 1) {
            msg = "Are you sure you want to cancel the creation of new entry?";
        }
        else if (Action == 2) {
            msg = "Are you sure you want to cancel updating this entry?";
        } else {
            msg = "Are you sure you want to close this entry?";
        }

        var YesFunc = function () {
            location.reload();
            //Action = -1;
            //HandleEnableButtons();
            //HandleEnableEntries();
            //c.Show('#modalEntry', false);
            //c.Show('#DashBoard', true);
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
    $('#btnCancel').click(function () {
        c.ModalShow('#FrmReason', true);
    });

    $('#btnCloseReason').click(function () {

        c.ModalShow('#FrmReason', false);
        
    });
    $('#btnSaveReason').click(function () {

        req = c.IsEmptyById('#txtReasonCancelled');
        if (req) {
            c.MessageBoxErr('Required...', 'A reason for cancelling is required.');
            return false;
        }

        Action = 3;
        ExistingEditAndSave();


    });

    $('#btnEdit').click(function () {
        Action = 2;
        HandleEnableButtons();
        HandleEnableEntries();
        //for CAIRO ONLY
          // CheckOTHeadUser();
       var checkifconfirm = c.GetSelect2Id('#Select2Status');

     
       c.DisableSelect2('#Select2Status', false);
       //start comment on oct 10 2017 
        //if (checkifconfirm == 2) {
        //    c.DisableSelect2('#Select2Status', true);
        //}

        //else {
        //    c.DisableSelect2('#Select2Status', false);

        //}

        //if (IsDoctorAllowed == 1) {
        //    c.DisableSelect2('#Select2Status', true);
        //}
        //end comment on oct 10 2017 



        //if (IsDoctorAllowed == 1) {

        //    c.ButtonDisable('#btnReserve', true);
        //    c.ButtonDisable('#btnConfirm', false);
        //    c.DisableSelect2('#Select2Status', true);

        //} else {
        //    c.ButtonDisable('#btnReserve', false);
        //    c.ButtonDisable('#btnConfirm', true);
        //    c.DisableSelect2('#Select2Status', false);
        //}




    });
    $('#btnSave').click(function () {
        ExistingEditAndSave();
    });
    $('#btnReserve').click(function () {
        c.SetSelect2('#ReservedConfirmed', 'Reserve', 1);
        Save(1);
    });
    $('#btnConfirm').click(function () {
        c.SetSelect2('#ReservedConfirmed', 'Confirm', 2);
        Save(2);
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

    $('#btnFindPatient').click(function () {
        $('#btnPatientFilterOK').hide();
        c.SetActiveTab('sectionFilter');
        $('#Entry').hide();
        $('#FrmFindPatient').show();
        $('#ButtonsOnFilter').show();
        $('#ButtonsOnEntry').hide();
    });
    $('#btnPatientFilterClose').click(function () {        
        $('#btnPatientFilterSearch').show();
        $('#btnPatientFilterOK').hide();
        $('#Entry').show();
        $('#FrmFindPatient').hide();
        $('#ButtonsOnFilter').hide();
        $('#ButtonsOnEntry').show();
    });
    $('#btnPatientFilterOK').click(function () {
        var data = TblGridResultsDataRow;
        c.SetValue('#IssueAuthorityCode', data.IssueAuthorityCode);
        c.SetValue('#txtAge', data.Age);
        c.SetValue('#txtGender', data.SEX);
        c.SetValue('#txtCategory', data.CategoryCode);
        c.SetValue('#txtCompany', data.CompanyCode);
        c.SetSelect2('#select2PIN', data.Registrationno, data.PIN);
        c.SetSelect2('#select2Name', data.Registrationno, data.name);

        c.DisableSelect2('#select2PIN', true);
        c.DisableSelect2('#select2Name', true);
        c.DisableSelect2('#select2BedNo', true);

        
        $("#btnPatientFilterClose").click();
    });
    $('#btnPatientFilterSearch').click(function () {
        ShowResults();
    });

    $('#btnCalendar1').click(function () {
        c.Show('#FrmCalendar', true);
        c.Show('#ButtonsOnBoard', false);
        c.Show('#ButtonsOnEntry', false);
        c.Show('#DashBoard', false);
        c.Show('#Entry', false);
        InitCalendar();
    });
}
function InitICheck() {
//    $('#iChkStart').iCheck({
//        checkboxClass: 'icheckbox_square-red',
//        radioClass: 'iradio_square-red'
//    }).on("ifChecked ifUnchecked", function (e) {
//        var checked = e.type == "ifChecked" ? true : false;
//        c.SetDateTimePicker('#dtOTStartDateTime', checked ? moment() : "");
//        c.SetDateTimePicker('#dtAnaesthesiaStartDateTime', checked ? moment() : "");
//        c.SetDateTimePicker('#dtIncisionDateTime', checked ? moment() : "");
//        c.SetDateTimePicker('#dtRecoveryStartDateTime', checked ? moment() : "");
//    });
}
function InitSelect2() {

    ///----Client Side
    $("#Select2Status").select2({
        data: [{ id: 1, text: 'Reserve' },
               { id: 2, text: 'Confirm' }],
        minimumResultsForSearch: -1
    }).change(function (e) {
        //var list = e.added.list;
        //var CategoryId = c.GetSelect2Id('#Select2DeptStation');
        //var TypeId = c.GetSelect2Id('#Select2Type');
        //InvenItemMarkupConnection(CategoryId, TypeId);
    });

    $('#select2OperationTheatreIdSearch').select2({
        placeholder:"Please specify...",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetOperatingTheatres',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                var StationId = $("#ListOfStation").val();
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    type: 0,
                    StationId: StationId
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        var list = e.added.list;
        ShowCalendar();
    });
    $('#select2OperationTheatreId').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetOperatingTheatres',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                var StationId = $("#ListOfStation").val();
                console.log(StationId);
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    type: 0,
                    StationId: StationId
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
    $('#select2PIN').select2({
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            //url: baseURL + 'Select2GetPIN',
            url: baseURL + 'Select2GetPINParam',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    type: c.GetSelect2Id('#select2PatientType')
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
        containerCssClass: "RequiredField",
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            //url: baseURL + 'Select2GetName',
            url: baseURL + 'Select2GetNameParam',
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
        containerCssClass: "RequiredField",
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

    $("#select2PatientType").select2({
        containerCssClass: "RequiredField",
        data: [{ id: 1, text: 'In-Patient' }, { id: 2, text: 'Out-Patient'}],
        minimumResultsForSearch: -1
    }).change(function (e) {
        var Disable = e.val == 1;

        if (Disable) {
            $('#btnFindPatient').hide();
            c.DisableSelect2('#select2PIN', false);
            c.DisableSelect2('#select2Name', false);
            c.DisableSelect2('#select2BedNo', false);
        }
        else {
            $('#btnFindPatient').show();
            c.DisableSelect2('#select2PIN', false);
            c.DisableSelect2('#select2Name', true);
            c.DisableSelect2('#select2BedNo', true);

            c.SetValue('#txtWard', '');
            c.SetValue('#txtAge', '');
            c.SetValue('#txtGender', '');
            c.SetValue('#txtCategory', '');
            c.SetValue('#txtPackage', '');
            c.SetValue('#txtCompany', '');

            NotifyIssueInfo('OutPatient should have bill first before scheduling...');

           // $('#btnFindPatient').click();
            
        }

        c.Select2Clear('#select2PIN');
        c.Select2Clear('#select2Name');
        c.Select2Clear('#select2BedNo');
        //c.DisableSelect2('#select2PIN', !Disable);
        //c.DisableSelect2('#select2Name', !Disable);
        //c.DisableSelect2('#select2BedNo', !Disable);

    });

    $('#select2AnaesthetiaType').select2({
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
    });
    $("#select2TAssistantSurgeon").select2({
        containerCssClass: "RequiredField",
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
    $("#select2TSurgery").select2({
        containerCssClass: "RequiredField",
        data: [],
        minimumInputLength: 0,
        tags: true,
        ajax: {
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
            success: function () {

            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    });
    $("#select2TSurgeon").select2({
        containerCssClass: "RequiredField",
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
        containerCssClass: "RequiredField",
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
        containerCssClass: "RequiredField",
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


    });
    $("#select2TEquipment").select2({
        containerCssClass: "RequiredField",
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
    $("#select2Country").select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Country',
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
            },
            error: function (xhr, desc, err) {
                var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                c.MessageBox("Error...", errMsg, null);
            }
        }
    }).change(function (e) {
        var list = e.added.list;

    });
    $("#select2Cities").select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2Cities',
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
            },
            error: function (xhr, desc, err) {
                var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                c.MessageBox("Error...", errMsg, null);
            }
        }
    }).change(function (e) {
        var list = e.added.list;

    });
    $("#select2Gender").select2({
        minimumInputLength: 0,
        allowClear: true,
        minimumInputLength: -1,
        ajax: {
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
            success: function () {

            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            },
            error: function (xhr, desc, err) {
                var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                c.MessageBox("Error...", errMsg, null);
            }
        }
    }).change(function (e) {
        var list = e.added.list;

    });



}
function InitDateTimePicker() {
    var dateToday = new Date();

    $('#dtSurgeryDate').datetimepicker({
       pickTime: false, //for test
       minDate: dateToday
    }).on("dp.change", function (e) {

    });
    $('#dtSurgeryTimeFrom').datetimepicker({
        pickDate: false
    }).on("dp.change", function (e) {

    });
    $('#dtSurgeryTimeTo').datetimepicker({
        pickDate: false
    }).on("dp.change", function (e) {

    });

    $('#dtRegDateTimeF').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
    $('#dtRegDateTimeT').datetimepicker({
        pickTime: false
    }).on("dp.change", function (e) {

    });
}
function InitDataTables() {
    BindResults([]);
}
function InitCalendar() {
    scheduler.attachEvent("onClick", function (id, e) {
        Action = 0;
        View(id);
        return true;
    });
    scheduler.templates.tooltip_text = function (start, end, ev) { 
        return " " +
            "<b>OT:</b> " + ev.text + "<br/>"+
            "<b>Start date:</b > " + moment(start).format("HH:mm A DD-MMM-YYYY") + // scheduler.templates.tooltip_date_format(start) +
            "<br/><b>End date:</b> " +  moment(end).format("HH:mm A DD-MMM-YYYY"); //scheduler.templates.tooltip_date_format(end);
    };
 
    scheduler.templates.event_bar_text = function (start, end, ev) {
        return   ev.text;
    };



     

}
function SetupDataTables() {
//    SetupSelectedSurgery();
}
function RedrawPlugins() {
    RedrawCalendar();
}
function RedrawCalendar() {
    scheduler.config.update_render = true;

    //if (SchedViewType == 1) { scheduler.init('Calendar', new Date(), "day"); }
    //else if (SchedViewType == 2) { scheduler.init('Calendar', new Date(), "week"); }
    //else if (SchedViewType == 3) { scheduler.init('Calendar', new Date(), "month"); }
}


function DefaultReadOnly() {
    c.ReadOnly('#txtWard', true);
    c.ReadOnly('#txtAge', true);
    c.ReadOnly('#txtGender', true);
    c.ReadOnly('#txtCompany', true);
    c.ReadOnly('#txtPackage', true);
    c.ReadOnly('#txtCategory', true);
    c.ReadOnly('#txtDuration', true);
    c.ReadOnly('#txtStatus', true);
    c.ReadOnly('#txtOperator', true);
}
function DefaultValues() {
    c.SetDateTimePicker('#dtSurgeryDate', moment());
    c.SetSelect2('#select2PatientType',1 , 'In-Patient');
}
function DefaultDisable() {
    //    c.DisableDateTimePicker('#dtFromDate', true);
}
function DefaultEmpty() {

    c.ClearAllText();

    c.SetDateTimePicker('#dtSurgeryDate', '');
    c.SetDateTimePicker('#dtSurgeryTimeFrom', '');
    c.SetDateTimePicker('#dtSurgeryTimeTo', '');
        
    c.Select2Clear('#select2OperationTheatreId');
    c.Select2Clear('#select2AnaesthetiaType');
    c.Select2Clear('#select2PIN');
    c.Select2Clear('#select2Name');
    c.Select2Clear('#select2BedNo');
    c.Select2Clear('#select2PatientType');

    c.Select2Clear('#select2TSurgery');
    c.Select2Clear('#select2TSurgeon');
    c.Select2Clear('#select2TAssistantSurgeon');
    c.Select2Clear('#select2TAnaesthetist');
    c.Select2Clear('#select2TEquipment');
    c.Select2Clear('#Select2Status');

    c.SetValue('#txtDisease', '');
    c.SetValue('#txtRemarks', '');


    $('#btnFindPatient').hide();
    
//    BindSelectedSurgery([]);

}

function Validated() {
    var ret = false;

    var station = $('#ListOfStation').val();
    if (station == null) {
        c.MessageBoxErr('Error...', 'Please select a station in the upper right.');
        return false;
    }


    


    ret = c.IsEmptySelect2('#select2AnaesthetiaType');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select an Anaesthesia Type. If none type no anaesthesia (none)');
        return false;
    }


    ret = c.IsEmptySelect2('#select2OperationTheatreId');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select an Operation Theatre.');
        return false;
    }

    ret = !c.IsDate('#dtSurgeryDate');
    if (ret) {
        c.MessageBoxErr('Invalid...', 'Invalid Date on SurgeryDate.');
        return false;
    }

    
    ret = $('#select2TSurgery').val();
    if (!ret) {
        c.MessageBoxErr('Empty...', 'Please select a Surgery.');
        return false;
    }

    ret = $('#select2TSurgeon').val();  
    if (!ret) {
        c.MessageBoxErr('Empty...', 'Please select a Surgeon.');
        return false;
    }
    ret = $('#select2TAssistantSurgeon').val(); 
    if (!ret) {
        c.MessageBoxErr('Empty...', 'Please select a Asst Surgeon.');
        return false;
    }
    
    
    ret = c.IsDateEmpty('#dtSurgeryTimeFrom');
    //ret = from.length == 0;
    if (ret) {
        c.MessageBoxErr('Invalid...', 'Invalid Time on SurgeryTime From.');
        return false;
    }

    ret = c.IsDateEmpty('#dtSurgeryTimeTo');
    //ret = to.length == 0;
    if (ret) {
        c.MessageBoxErr('Invalid...', 'Invalid Time on SurgeryTime To.');
        return false;
    }

    ret = c.IsEmptySelect2('#select2PatientType');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Patient Type.');
        return false;
    }

    ret = c.IsEmptySelect2('#select2PIN');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a PIN / Name / BedNo.');
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
        c.DisableSelect2('#select2OperationTheatreId', true);
        c.DisableSelect2('#select2AnaesthetiaType', true);
        c.DisableSelect2('#select2PIN', true);
        c.DisableSelect2('#select2Name', true);
        c.DisableSelect2('#select2BedNo', true);
        c.DisableSelect2('#select2PatientType', true);
        c.DisableSelect2('#select2TSurgery', true);
        c.DisableSelect2('#select2TSurgeon', true);
        c.DisableSelect2('#select2TAssistantSurgeon', true);
        c.DisableSelect2('#select2TAnaesthetist', true);
        c.DisableSelect2('#select2TEquipment', true);
        c.DisableSelect2('#Select2Status', true);

        c.DisableDateTimePicker('#dtSurgeryDate', true);
        c.DisableDateTimePicker('#dtSurgeryTimeFrom', true);
        c.DisableDateTimePicker('#dtSurgeryTimeTo', true);

        
        c.Disable('#txtDisease', true);
        c.Disable('#txtRemarks', true);
        c.Disable('#SurgeryPosition', true);

    }
    else if (Action == 1) { // add
        c.DisableSelect2('#select2OperationTheatreId', false);
        c.DisableSelect2('#select2AnaesthetiaType', false);
        c.DisableSelect2('#select2PIN', false);
        c.DisableSelect2('#select2Name', false);
        c.DisableSelect2('#select2BedNo', false);
        c.DisableSelect2('#select2PatientType', false);
        c.DisableSelect2('#select2TSurgery', false);
        c.DisableSelect2('#select2TSurgeon', false);
        c.DisableSelect2('#select2TAssistantSurgeon', false);
        c.DisableSelect2('#select2TAnaesthetist', false);
        c.DisableSelect2('#select2TEquipment', false);
        c.DisableSelect2('#Select2Status', true);
        c.DisableDateTimePicker('#dtSurgeryDate', false);
        c.DisableDateTimePicker('#dtSurgeryTimeFrom', false);
        c.DisableDateTimePicker('#dtSurgeryTimeTo', false);

        c.Disable('#txtDisease', false);
        c.Disable('#txtRemarks', false);
        c.Disable('#SurgeryPosition', false);
    }
    else if (Action == 2) { // edit  
        c.DisableSelect2('#select2OperationTheatreId', false);
        c.DisableSelect2('#select2AnaesthetiaType', false);
        c.DisableSelect2('#select2PIN', false);
        c.DisableSelect2('#select2Name', false);
        c.DisableSelect2('#select2BedNo', false);
        c.DisableSelect2('#select2PatientType', false);
        c.DisableSelect2('#select2TSurgery', false);
        c.DisableSelect2('#select2TSurgeon', false);
        c.DisableSelect2('#select2TAssistantSurgeon', false);
        c.DisableSelect2('#select2TAnaesthetist', false);
        c.DisableSelect2('#select2TEquipment', false);
       // c.DisableSelect2('#Select2Status', false);

        c.DisableDateTimePicker('#dtSurgeryDate', false);
        c.DisableDateTimePicker('#dtSurgeryTimeFrom', false);
        c.DisableDateTimePicker('#dtSurgeryTimeTo', false);

        c.Disable('#txtDisease', false);
        c.Disable('#txtRemarks', false);
        c.Disable('#SurgeryPosition', false);
    }
    
    else if (IsDoctorAllowed == 1) {
        console.log('handleentriesdoctor-'+IsDoctorAllowed);
        //$('#btnReserve').hide();
        //$('#btnConfirm').show();
        //c.ButtonDisable('#btnReserve', false);
        //c.ButtonDisable('#btnConfirm', true);
        c.ButtonDisable('#btnEdit', true);
        c.DisableSelect2('#Select2Status', true);
    }
    else {
        console.log('handleentriesdoctor-' + IsDoctorAllowed);
        c.Show('#Entry', false);
        c.Show('#DashBoard', true);
        //$('#btnReserve').show();
        //$('#btnConfirm').hide();
        //c.ButtonDisable('#btnConfirm', false);
        //c.ButtonDisable('#btnReserve', true);
        c.ButtonDisable('#btnEdit', false);
        c.DisableSelect2('#Select2Status', false);
    }

    if (IsDoctorAllowed == 1) {

        c.ButtonDisable('#btnReserve', true);
        c.ButtonDisable('#btnConfirm', false);
        c.DisableSelect2('#Select2Status', true);

    } else {
        c.ButtonDisable('#btnReserve', false);
        c.ButtonDisable('#btnConfirm', true);
        c.DisableSelect2('#Select2Status', false);
    }




}

function CheckPermissionNEWBtn() 
{

url = $('#url').data('checkpermissionnewbtn');

$.ajax({
    url: url,
    data: "",//JSON.stringify(entry),
    type: 'post',
    cache: false,
    contentType: "application/json; charset=utf-8",
    beforeSend: function () {
    },
    success: function (data) {
        console.log('checkpermissionnewbtn');
        console.log(data);
        CheckPermissionNEW = 0;
        if (data.ErrorCode == 0) {
            c.MessageBoxErr("Error...", data.Message);
            return;
        }

        var OkFunc = function () {



            if (CheckPermissionNEW == 0) {

                Action = 1;
                c.ModalShow('#modalEntry', true);
                DefaultDisable();
                DefaultReadOnly();
                DefaultEmpty();
                DefaultValues();
                InitDataTables();
                HandleEnableButtons();
                HandleEnableEntries();
                c.SetActiveTab('sectionA');
                //FOR CAIRO ONLY
                //CheckOTHeadUser();

                var id = c.GetSelect2Id('#select2OperationTheatreIdSearch');
                var text = c.GetSelect2Text('#select2OperationTheatreIdSearch');
                c.SetSelect2('#select2OperationTheatreId', id, text);


                c.DisableSelect2('#Select2Status', true);

                if (IsDoctorAllowed == 1) {
                    //    $('#btnReserve').hide();
                    //    $('#btnConfirm').show();
                    //   // c.ButtonDisable('#btnReserve', false);
                    //   // c.ButtonDisable('#btnConfirm', true);
                    //    c.ButtonDisable('#btnEdit', true);
                    //   c.DisableSelect2('#Select2Status', true);
                }
                else {
                    //    c.Show('#Entry', false);
                    //    c.Show('#DashBoard', true);
                    //    $('#btnConfirm').hide();
                    //    $('#btnReserve').show();
                    //    //c.ButtonDisable('#btnConfirm', false);
                    //    //c.ButtonDisable('#btnReserve', true);
                    //    c.ButtonDisable('#btnEdit', false);
                    // c.DisableSelect2('#Select2Status', false);
                }

            }


           
        };

        OkFunc();
 

    },
    error: function (xhr, desc, err) {
        c.ButtonDisable('#btnSave', false);
        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
        c.MessageBox("Error...", errMsg, null);
    }
});
            
}


function HandleButtonNotUse() {
    $('.NotUse').hide();
}
function ExistingEditAndSave()
{
    console.log('ExistingEditAndSave');

    

    var dtt = moment($("#dtSurgeryDate").find("input").val()).format('DD MMM YYYY')
    var dttf = dtt + ' ' + $("#dtSurgeryTimeFrom").find("input").val();
    var dttt = dtt + ' ' + $("#dtSurgeryTimeTo").find("input").val();
    var dtoid = $("#select2OperationTheatreId").select2('data').id;
    var chk = "0";
 
            var ret = Validated();
            if (!ret) return ret;

            c.ButtonDisable('#btnSave', true);

            var entry;
            entry = [];
            entry = {};
            entry.Action = Action;
            entry.ID = c.GetValue('#Id');
            entry.IPIDOPID = c.GetSelect2Id('#select2PIN');

            entry.IssueAuthorityCode = c.GetValue('#IssueAuthorityCode');
            entry.OTID = c.GetSelect2Id('#select2OperationTheatreId');
            entry.AnaesthesiaID = c.GetSelect2Id('#select2AnaesthetiaType');

            var a = c.GetDateTimePickerDateTime('#dtSurgeryDate');
            var b = a.substring(0, 10);

            var from = c.GetDateTimePickerDateTime('#dtSurgeryTimeFrom');
            var to = c.GetDateTimePickerDateTime('#dtSurgeryTimeTo');
            var fromtime = from.substring(11, 22);
            var totime = to.substring(11, 22);

            entry.DateOfBooking = a;
            entry.FromDateTime = b + ' ' + fromtime;
            entry.ToDateTime = b + ' ' + totime;
            entry.TheReason = c.GetValue('#txtReasonCancelled');

            entry.Remarks = c.GetValue('#txtRemarks');
            entry.Disease = c.GetValue('#txtDisease');
            entry.PatientType = c.GetSelect2Id('#select2PatientType');
            entry.PatientName = c.GetSelect2Text('#select2Name');
            entry.ReservedConfirmed = c.GetValue('#ReservedConfirmed');
            entry.ReservedConfirmedId = c.GetSelect2Id('#Select2Status');

          
            var arr = $('#select2TSurgery').val();
            entry.OTSSurgery = [];
            $.each(arr.split(','), function (i, val) {
                entry.OTSSurgery.push({
                    OTScheduleId: c.GetValue('#Id'),
                    SurgeryId: val
                });
            });

            arr = $('#select2TSurgeon').val();
            entry.OTSSurgeon = [];
            $.each(arr.split(','), function (i, val) {
                entry.OTSSurgeon.push({
                    OTScheduleId: c.GetValue('#Id'),
                    SurgeonId: val
                });
            });

            arr = $('#select2TAssistantSurgeon').val();
            entry.OTSAssistantSurgeon = [];
            $.each(arr.split(','), function (i, val) {
                entry.OTSAssistantSurgeon.push({
                    OTScheduleId: c.GetValue('#Id'),
                    AssistantsurgeonId: val
                });
            });

            arr = $('#select2TAnaesthetist').val();
            entry.OTSAnaesthetist = [];
            $.each(arr.split(','), function (i, val) {
                entry.OTSAnaesthetist.push({
                    OTScheduleId: c.GetValue('#Id'),
                    AnaesthetistId: val
                });
            });
            console.log('entry.OTSAnaesthetist');
            console.log(entry.OTSAnaesthetist);
            entry.SurgeryPosition = $('#SurgeryPosition').val();


            arr = $('#select2TEquipment').val();
            entry.OTSEquipment = [];
            $.each(arr.split(','), function (i, val) {
                entry.OTSEquipment.push({
                    OTScheduleId: c.GetValue('#Id'),
                    EquipmentId: val
                });
            });
            console.log(entry);

            var url = $('#url').data('confirm');
            if (c.GetSelect2Id('#Select2Status') == 1) { //Reserve
                url = $('#url').data('reserved');
            }
 
            $.ajax({
                 url: url,
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

                        //dhtmlx.message.position = "bottom";
                        dhtmlx.message({
                            text: data.Message,
                            expire: 2500
                        })


                        if (Action == 3 || Action == 2) {
                            c.Show('#ButtonsOnBoard', true);
                            c.Show('#ButtonsOnEntry', false);
                            c.Show('#DashBoard', true);
                            c.Show('#Entry', false);
                            c.ModalShow('#FrmReason', false);
                            ShowCalendar();
                            return;
                        }
                        else if (Action == 1) {
                            ShowCalendar();
                        }

                        Action = 0;
                        HandleEnableButtons();
                        HandleEnableEntries();
                        RedrawPlugins();
                    };

                    OkFunc();
                    // c.MessageBox(data.Title, data.Message, OkFunc);
                    //Command: toastr["success"](data.Message, data.Title)

                },
                error: function (xhr, desc, err) {
                    c.ButtonDisable('#btnSave', false);
                    var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                    c.MessageBox("Error...", errMsg, null);
                }
            });
            

            return ret;
        
   



}
function Save(confirmOrReserved) {
    var dtt = moment($("#dtSurgeryDate").find("input").val()).format('DD MMM YYYY')
    var dttf = dtt + ' ' + $("#dtSurgeryTimeFrom").find("input").val();
    var dttt = dtt + ' ' + $("#dtSurgeryTimeTo").find("input").val();
    var dtoid = $("#select2OperationTheatreId").select2('data').id;    
    var chk = "0";
    console.log('save');
    ValidDate(dtoid, dttf, dttt, function (d) {
        console.log(d);
      
        
        if (d.trim() == "0" || d.trim() == '0' || d.trim() == 0) {
            c.MessageBox("Error...", "Overlap in Schedule. Please change the schedule", null);
        }
        else {
                var ret = Validated();
                if (!ret) return ret;

                c.ButtonDisable('#btnSave', true);

                var entry;
                entry = [];
                entry = {};
                entry.Action = Action;
                entry.ID = c.GetValue('#Id');
                entry.IPIDOPID = c.GetSelect2Id('#select2PIN');

                entry.IssueAuthorityCode = c.GetValue('#IssueAuthorityCode');
                entry.OTID = c.GetSelect2Id('#select2OperationTheatreId');
                entry.AnaesthesiaID = c.GetSelect2Id('#select2AnaesthetiaType');

                var a = c.GetDateTimePickerDateTime('#dtSurgeryDate');
                var b = a.substring(0, 10);

                var from = c.GetDateTimePickerDateTime('#dtSurgeryTimeFrom');
                var to = c.GetDateTimePickerDateTime('#dtSurgeryTimeTo');
                var fromtime = from.substring(11, 22);
                var totime = to.substring(11, 22);

                entry.DateOfBooking = a;
                entry.FromDateTime = b + ' ' + fromtime;
                entry.ToDateTime = b + ' ' + totime;
                entry.TheReason = c.GetValue('#txtReasonCancelled');

                entry.Remarks = c.GetValue('#txtRemarks');
                entry.Disease = c.GetValue('#txtDisease');
                entry.PatientType = c.GetSelect2Id('#select2PatientType');
                entry.PatientName = c.GetSelect2Text('#select2Name');
                entry.ReservedConfirmed = c.GetValue('#ReservedConfirmed');
            

                entry.SurgeryPosition = $('#SurgeryPosition').val();
         
                var arr = $('#select2TSurgery').val();
                entry.OTSSurgery = [];
                $.each(arr.split(','), function (i, val) {
                    entry.OTSSurgery.push({
                        OTScheduleId: c.GetValue('#Id'),
                        SurgeryId: val
                    });
                });

                arr = $('#select2TSurgeon').val();
                entry.OTSSurgeon = [];
                $.each(arr.split(','), function (i, val) {
                    entry.OTSSurgeon.push({
                        OTScheduleId: c.GetValue('#Id'),
                        SurgeonId: val
                    });
                });

                arr = $('#select2TAssistantSurgeon').val();
                entry.OTSAssistantSurgeon = [];
                $.each(arr.split(','), function (i, val) {
                    entry.OTSAssistantSurgeon.push({
                        OTScheduleId: c.GetValue('#Id'),
                        AssistantsurgeonId: val
                    });
                });

                arr = $('#select2TAnaesthetist').val();
                entry.OTSAnaesthetist = [];
                $.each(arr.split(','), function (i, val) {
                    entry.OTSAnaesthetist.push({
                        OTScheduleId: c.GetValue('#Id'),
                        AnaesthetistId: val
                    });
                });

                arr = $('#select2TEquipment').val();
                entry.OTSEquipment = [];
                $.each(arr.split(','), function (i, val) {
                    entry.OTSEquipment.push({
                        OTScheduleId: c.GetValue('#Id'),
                        EquipmentId: val
                    });
                });
                console.log(entry);

                var url = $('#url').data('confirm');
                entry.ReservedConfirmedId = confirmOrReserved;//c.GetSelect2Id('#Select2Status');
                if (confirmOrReserved == 1)
                { //Reserve
                    url = $('#url').data('reserved');
                }

     
                $.ajax({
                    url: url,
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

                            //dhtmlx.message.position = "bottom";
                            dhtmlx.message({
                                text: data.Message,
                                expire: 2500
                            })

                           

                            //if (Action == 3 || Action == 2) {
                               // c.Show('#ButtonsOnBoard', true);
                               // c.Show('#ButtonsOnEntry', false);
                               // c.Show('#DashBoard', true);
                               //c.Show('#Entry', false);
                               // c.ModalShow('#FrmReason', false);
                               // ShowCalendar();
                               // return;
                            //}
                            //else if (Action == 1) {
                            //    ShowCalendar();
                            //}

                            Action = 0;
                            HandleEnableButtons();
                            HandleEnableEntries();
                            RedrawPlugins();


                            c.Show('#ButtonsOnBoard', true);
                            c.Show('#ButtonsOnEntry', false);
                            c.Show('#DashBoard', true);
                            c.Show('#Entry', false);
                            c.ModalShow('#FrmReason', false);
                            ShowCalendar();
                            return;

                            
                             
                        };

                        OkFunc();
                        // c.MessageBox(data.Title, data.Message, OkFunc);
                        //Command: toastr["success"](data.Message, data.Title)

                    },
                    error: function (xhr, desc, err) {
                        c.ButtonDisable('#btnSave', false);
                        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
                        c.MessageBox("Error...", errMsg, null);
                    }
                });


                return ret;
        }
    });

}

function ShowIsDoctor() {

    var Url = $('#url').data("getrangemax");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (MaxRangeMarkup) {

            GetMaxRange = MaxRangeMarkup[0].MaxRange;

        }
    });

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
            $("#url").data("id", id);
            if (data.list.length == 0) {
                c.MessageBoxErr("Deleted...", "The selected record doesn't exist and already been deleted.", null);
                TblGridList.row('tr.selected').remove().draw(false);
                return;
            }

            var data = data.list[0];

            c.SetValue('#Id', data.ID);
            c.SetValue('#ReservedConfirmed', data.ReservedConfirmed);

            c.SetSelect2('#select2OperationTheatreId', data.OTID, data.OperationTheatreName);
            c.SetSelect2('#select2AnaesthetiaType', data.AnaesthesiaID, data.AnaesthesiaName);
            c.SetSelect2('#select2PIN', data.IPIDOPID, data.PIN);
            c.SetSelect2('#select2Name', data.IPIDOPID, data.PTName);
            c.SetSelect2('#select2BedNo', data.IPIDOPID, data.bedname);
            c.SetSelect2('#select2PatientType', data.PatientType, data.PatientTypeName);

            c.DisableSelect2('#select2PIN', data.PatientType==2);
            c.DisableSelect2('#select2Name', data.PatientType == 2);
            c.DisableSelect2('#select2BedNo', data.PatientType == 2);

            c.SetSelect2List('#select2TSurgery', data.OTSSurgeryT);
            c.SetSelect2List('#select2TSurgeon', data.OTSSurgeonT);
            c.SetSelect2List('#select2TAssistantSurgeon', data.OTSAssistantSurgeonT);
            c.SetSelect2List('#select2TAnaesthetist', data.OTSAnaesthetistT);
            c.SetSelect2List('#select2TEquipment', data.OTSEquipmentT);

            c.SetValue('#txtWard', data.wardname);
            c.SetValue('#txtAge', data.Age);
            c.SetValue('#txtGender', data.Gender);
            c.SetValue('#txtCategory', data.CategoryName);
            c.SetValue('#txtPackage', data.Package);
            c.SetValue('#txtCompany', data.CompanyName);

            c.SetValue('#SurgeryPosition', data.SurgeryPosition);
            
            c.SetValue('#txtDisease', data.Disease);
            c.SetValue('#txtRemarks', data.Remarks);
            c.SetValue('#txtOperator', data.OperatorName);
            c.SetValue('#txtDuration', data.Duration);
            c.SetSelect2('#Select2Status', data.ReservedConfirmed, data.Status);
            //c.SetValue('#txtStatus', data.Status);

            c.SetDateTimePicker('#dtSurgeryDate', data.DateFrom);
            c.SetDateTimePicker('#dtSurgeryTimeFrom', data.TimeFrom);
            c.SetDateTimePicker('#dtSurgeryTimeTo', data.TimeTo);
            var checkifconfirm = c.GetSelect2Id('#Select2Status');
            if (checkifconfirm == 2) {
              //$('#btnReserve').hide();
              //  $('#btnEdit').show();
              //  c.ButtonDisable('#btnEdit', true);
                c.DisableSelect2('#Select2Status', true);
            }
            else {
                $('#btnEdit').hide();
               // c.ButtonDisable('#btnEdit', false);
                c.DisableSelect2('#Select2Status', false);
            }
            HandleEnableButtons();
            HandleEnableEntries();
            RedrawPlugins();
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });
}

function Refresh() {
    //ShowList(-1);
    ShowCalendar();
}


function ShowAllowedDoctor() {
    var Url = baseURL + "GetAllowedDoctor";

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (AllowedID) {
            console.log('AllowedID');
            console.log(AllowedID);
            //var data = data.IsPractisingDoctor[0];
            IsDoctorAllowed = AllowedID[0].IsPractisingDoctor;
            console.log(IsDoctorAllowed);
            //UserLogin = AllowedID[0].OperatorId;

        }
    });

}



function ShowListColumns() {
    var cols = [
    { targets: [0], data: "ID", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [1], data: "W", className: '', visible: true, searchable: true, width: "0%" },
    { targets: [2], data: "IPIDOPID", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [3], data: "PIN", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [4], data: "PTName", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [5], data: "PatientType", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [6], data: "PatientTypeName", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [7], data: "wardname", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [8], data: "CategoryName", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [9], data: "CompanyName", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [10], data: "bedname", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [11], data: "Age", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [12], data: "Gender", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [13], data: "Package", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [14], data: "Remarks", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [15], data: "Disease", className: '', visible: false, searchable: true, width: "10%" },
    { targets: [16], data: "OTID", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [17], data: "OperationTheatreName", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [18], data: "DateFromS", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [19], data: "DateToS", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [20], data: "AnaesthesiaID", className: '', visible: false, searchable: true, width: "0%" },
    { targets: [21], data: "AnaesthesiaName", className: '', visible: true, searchable: true, width: "5%" }
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
        ID:id
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
    //    scrollY: 510,
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
        scrollY: 430,
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

function ShowResultsColumns() {
    var cols = [
    { targets: [0], data: "chk", className: '', visible: true, searchable: true, width: "2%" },
    { targets: [1], data: "PIN", className: '', visible: true, searchable: true, width: "5%" },
    { targets: [2], data: "date", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [3], data: "name", className: '', visible: true, searchable: true, width: "20%" },
    { targets: [4], data: "Age", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [5], data: "SEX", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [6], data: "PLACE", className: '', visible: true, searchable: true, width: "15%" },
    { targets: [7], data: "PPhone", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [8], data: "CategoryCode", className: '', visible: true, searchable: true, width: "10%" },
    { targets: [9], data: "CompanyCode", className: '', visible: true, searchable: true, width: "10%" }
    ];
    return cols;
}
function ShowResultsRowCallBack() {
    var rc = function (nRow, aData) {
        //var value = aData['Name'];
        //var $nRow = $(nRow);
        //if (value === '') {
        //    $nRow.css({ "background-color": "#dff0d8" })
        //}
    };
    return rc;
}
function ShowResults() {
    var Url = baseURL + "PatientFilterResults";
    var param = {
        AFamilyName: c.GetValue('#txtFather'),
        AFirstName: c.GetValue('#txtFirstName'),
        AMiddleName: c.GetValue('#txtMiddleName'),
        ALastName: c.GetValue('#txtLastName'), 
        AFamilyName: c.GetValue('#txtFamilyName'),
        Age: c.GetValue('#txtAgeF'),
        AgeType: c.GetSelect2Id('#select2Gender'),
        PCity: c.GetSelect2Id('#select2Cities'),
        Country: c.GetSelect2Id('#select2Country'),
        RegDateTimeF: c.GetDateTimePickerDateTime('#dtRegDateTimeF'),
        RegDateTimeT: c.GetDateTimePickerDateTime('#dtRegDateTimeT')
    };

    console.log(param);
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
            BindResults(data.list);
            $("#grid").css("visibility", "visible");

            c.SetActiveTab('sectionFilterResult');
            $('#btnPatientFilterSearch').hide();
            $('#btnPatientFilterOK').show();
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
function BindResults(data) {
    //TblGridResults = $(TblGridResultsId).DataTable({
    //    data: data,
    //    cache: false,
    //    destroy: true,
    //    paging: true,
    //    searching: true,
    //    ordering: false,
    //    info: true,
    //    columns: ShowResultsColumns(),
    //    bAutoWidth: false,
    //    scrollY: 450,
    //    scrollX: true,
    //    //fnRowCallback: ShowResultsRowCallBack(),
    //    iDisplayLength: 25
    //});
    TblGridResults = $(TblGridResultsId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 430,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        fnRowCallback: ShowResultsRowCallBack(),
        columns: ShowResultsColumns()
    });


}
function ShowCalendar() {
    var Url = baseURL + "ShowCalendar";
    var otid = c.GetSelect2Id('#select2OperationTheatreIdSearch');
    var param = { Id: -1, OTID: otid };

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
            console.log('ShowCalendar');
 
            scheduler.clearAll();
            // 1. Configure Scheduler Basic Settings
 
            scheduler.config.first_hour = 6;
            scheduler.config.last_hour = 24;
            scheduler.config.limit_time_select = true;
            scheduler.config.details_on_create = true;
            // Disable event edition with single click
            scheduler.config.select = false;
            scheduler.config.details_on_dblclick = true;
           
            scheduler.config.resize_month_events = true;
 
            scheduler.config.update_render = true;
            scheduler.config.readonly = true;


 

            // 3. Start calendar with custom settings
            var initSettings = {
                // Element where the scheduler will be started
                elementId: "Calendar",
                // Date object where the scheduler should be started
                startDate: new Date(),
                // Start mode
                mode: "month"
            };



            scheduler.init(initSettings.elementId, initSettings.startDate, initSettings.mode);
 
           
            scheduler.parse(data.list, "json");
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });
}
function FetchPatientDetails(list) {
    c.SetValue('#IssueAuthorityCode', list[1]);
    c.SetValue('#txtWard', list[7]);
    c.SetValue('#txtAge', list[8]);
    c.SetValue('#txtGender', list[9]);
    c.SetValue('#txtPrimaryConsultant', list[10]);
    c.SetValue('#txtPackage', list[11]);
    c.SetValue('#txtCategory', list[14]);
    c.SetValue('#txtCompany', list[13]);
}

function ValidDate(id, df, dt, CallBack) {
    $.ajax({
        url: baseURL + "ValidateDate",
        data: {id : id,df : df, dt:dt},
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        success: function (d) {
            CallBack(d);            
        },
        error: function (xhr, desc, err) {
        }
    });
}