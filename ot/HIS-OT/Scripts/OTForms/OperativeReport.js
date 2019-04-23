var c = new Common();
$(document).ready(function () {
    $("#txt_pin").focus();

    $('#txt_ipid').on("select2-selecting", function (e) {
        
        GetPatientBasicDetails($("#txt_pin").val(),e.val);
        c.ButtonDisable('#btnICD', false);
        c.ButtonDisable('#btnProcedures', false);
        OperativeReport_PerformedProcedures_Select($("#txt_pin").val(), e.val);
        OperativeReport_PlannedProcedures_Select($("#txt_pin").val(), e.val);
        OperativeReport_PreOPICDDiagnosis_Select($("#txt_pin").val(), e.val);
        OperativeReport_PostOPDiagnosis_Select($("#txt_pin").val(), e.val);
    });
    
    $('#txt_date').datetimepicker({
        pickTime: true
    }).on("dp.change", function (e) {

    });
    IntegerOnly('txt_estimated_blood_loss');
    //(string id)
    Select2Search('txt_surgeon', baseURL + 'GetDoctors', 'Select Primary Surgeon');
    Select2Search('txt_asst_surgeon', baseURL + 'GetDoctors', 'Select Assitant');
    Select2Search('txt_anes_name', baseURL + 'GetDoctors', 'Select Anesthestist');
    Select2Search('txt_sec_surgeon', baseURL + 'GetDoctors', 'Select Secondary Surgeon');
    
    Select2Search('txt_pre_op_diagnosis', baseURL + 'GetICDCodes', 'Select Pre OP ICD Diagnosis');
    Select2Search('txt_post_op_diagnosis', baseURL + 'GetICDCodes', 'Select Post OP ICD Diagnosis');

    Select2Search('txt_planned_procedure', baseURL + 'GetProcedures', 'Select Planned Procedures');
    Select2Search('txt_performed_procedure', baseURL + 'GetProcedures', 'Select Planned Procedures');

    c.ButtonDisable('#btnICD', true);
    c.ButtonDisable('#btnProcedures', true);
});

// all functions calls
$(document).keypress(function (e) {
    if (e.which == 13) {
        SelectAdmissionNo();
        
        return false;
    }
});
$(document).on("click", "#btn_get_records", function () {
    //GetPatientBasicDetails();
    SelectAdmissionNo();
});
$(document).on("click", "#btnSave", function () {
    OperativeReport_Save();
});
$(document).on("click", "#btnClear", function () {
    window.location = baseURL + "OperativeReport";
});
$(document).on("click", "#btnDelete", function () {
    OperativeReport_Delete();
});
$(document).on("click", "#btnICD", function () {
    c.ModalShow('#frms_ICDs', true);
});
$('#btnFindClose').click(function () {
    c.ModalShow('#frms_procedures', true);
    c.ModalShow('#frms_ICDs', false);
});
$('#btnFindClose2').click(function () {
    c.ModalShow('#frms_procedures', false);
    ClearInputs();
    c.SetValue('#txt_pre_op_diagnosis', '');
    c.SetValue('#txt_post_op_diagnosis', '');
    c.SetValue('#txt_planned_procedure', '');
    c.SetValue('#txt_performed_procedure', '');
    c.SetValue('#txt_anes_name', '');
    c.SetValue('#txt_surgeon', '');
    c.SetValue('#txt_sec_surgeon', '');
    c.SetValue('#txt_asst_surgeon', '');
    c.SetValue('#txt_ipid', '');

    c.Select2Clear('#txt_pre_op_diagnosis');
    c.Select2Clear('#txt_post_op_diagnosis');
    c.Select2Clear('#txt_planned_procedure');
    c.Select2Clear('#txt_performed_procedure');
    c.Select2Clear('#txt_anes_name');
    c.Select2Clear('#txt_surgeon');
    c.Select2Clear('#txt_sec_surgeon');
    c.Select2Clear('#txt_asst_surgeon');
    c.Select2Clear('#txt_ipid');

    c.SetValue('#txt_date', '');
    c.ButtonDisable('#btnICD', true);
    c.ButtonDisable('#btnProcedures', true);
});
$(document).on("click", "#btnProcedures", function () {
    c.ModalShow('#frms_procedures', true);
});

$(document).on("click", "#btn_pre_op_diag", function () {
    OperativeReport_PreOPICDDiagnosis_Save();
});
$(document).on("click", "#btn_post_op_diag", function () {
    OperativeReport_PostOPDiagnosis_Save();
});
$(document).on("click", "#btn_planned_procedure", function () {
    OperativeReport_PlannedProcedures_Save();
});
$(document).on("click", "#btn_performed_procedures", function () {
    OperativeReport_PerformedProcedures_Save();
});
// all functions
function GetPatientBasicDetails(_regNo, _admNo)
{
    $.ajax(
		{
		    type: "GET",
		    async: false,
		    url: baseURL + 'GetPatientBasicDetails',
		    data: { RegNo:_regNo, AdmNo:_admNo },
		    dataType: 'JSON',
		    beforeSend: function () {
		        c.ButtonDisable('#btn_get_records', true);
		    },
		    success: function (data) {
		        $('#preloader').hide();
		        $('.Show').show();
		        console.log(data);
		        $.each(data, function (i, optiondata) {
		            $('#txt_patient_name').val(optiondata.Name);
		            $('#txt_age').val(optiondata.Age);
		            $('#txt_sex').val(optiondata.Sex);

		            if (moment(JSONDateWithTime(optiondata.AdmissionDate)).format("DD-MMM-YYYY HH:mm A") == "01-Jan-2001 03:00 AM") {
		                $("#txt_date").val('');
		            }
		            else { $("#txt_date").val(moment(JSONDateWithTime(optiondata.AdmissionDate)).format("DD-MMM-YYYY HH:mm A")); }
		            
		            $('#txt_anes_name').select2('data', { id: optiondata.AnesthetistID, text: optiondata.AnesName });
		            $('#txt_surgeon').select2('data', { id: optiondata.SurgeonID, text: optiondata.SurgName });
		            $('#txt_sec_surgeon').select2('data', { id: optiondata.SecondarySurgeonID, text: optiondata.Sec_surgName });
		            $('#txt_asst_surgeon').select2('data', { id: optiondata.AsstSurgeonID, text: optiondata.AsstName });		            
		            $("#txt_type_of_anesthesia").val(optiondata.TypeOfAnesthesia);
		            $("textarea#txt_operative_details").val(optiondata.OperativeDetails);
		            $("#txt_peri_operative_comp").val(optiondata.PeriOpertiveComplications);
		            if (optiondata.EstimatedAmountOfBloodLoss == null || optiondata.EstimatedAmountOfBloodLoss == 0) {
		                $("#txt_estimated_blood_loss").val('');
		            }
		            else {
		                $("#txt_estimated_blood_loss").val(optiondata.EstimatedAmountOfBloodLoss);
		            }
		            
		            if (optiondata.SurgicalSpecimenSentForExamination != null)
		            {
		                if (optiondata.SurgicalSpecimenSentForExamination == true)
		                {
		                    $('#rdo_sent').attr('checked', 'checked');
		                }
		                else if (optiondata.SurgicalSpecimenSentForExamination == false)
		                {
		                    $('#rdo_no_sent').attr('checked', 'checked');
		                }
		            }
		            

		        });

		        c.ButtonDisable('#btn_get_records', false);
		    },
		    error: function (xhr, desc, err) {
		        $('#preloader').hide();
		        $('.Show').show();

		        c.ButtonDisable('#btn_get_records', false);
		        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
		        c.MessageBox("Error...", errMsg, null);
		    }

		});

}
function ClearInputs()
{
    $("#txt_pin").val('');
    $("#txt_ipid").val('');
    $("#txt_patient_name").val('');
    $("#txt_age").val('');
    $("#txt_date").val(moment());
    $("#txt_type_of_anesthesia").val('');
    $("#txt_anes_name").val('');
    $("#txt_surgeon").val('');
    $("#txt_asst_surgeon").val('');
    $("#txt_pre_op_diagnosis").val('');
    $("#txt_post_op_diagnosis").val('');
    $("#txt_planned_procedure").val('');
    $("#txt_performed_procedure").val('');
    $("textarea#txt_operative_details").val('');
    $("#txt_peri_operative_comp").val('');
    $("#txt_estimated_blood_loss").val('');

    // clearing radio 
    var ele = document.getElementsByName("is_sent");
    for (var i = 0; i < ele.length; i++)
        ele[i].checked = false;
}
function OperativeReport_Save()
{
    if ($("#txt_date").val() == null)
    {
        c.MessageBox("Date missed!", "Date cannot be null.", null);
        return;
    }
    var OperativeReport = {};

    OperativeReport.RegistrationNo = $("#txt_pin").val();
    OperativeReport.AdmissionNo = $("#txt_ipid").val();
    OperativeReport.Name = $("#txt_patient_name").val();
    OperativeReport.Age = $("#txt_age").val();
    OperativeReport.Date = $("#txt_date").val();
    OperativeReport.TypeOfAnesthesia = $("#txt_type_of_anesthesia").val();
    OperativeReport.AnesthetistID = $("#txt_anes_name").val();
    OperativeReport.SurgeonID = $("#txt_surgeon").val();
    OperativeReport.SecondarySurgeonID = $("#txt_sec_surgeon").val();
    OperativeReport.AsstSurgeonID = $("#txt_asst_surgeon").val();

    OperativeReport.OperativeDetails = $("textarea#txt_operative_details").val();
    OperativeReport.PeriOpertiveComplications = $("#txt_peri_operative_comp").val();
    OperativeReport.EstimatedAmountOfBloodLoss = $("#txt_estimated_blood_loss").val();
    if ($('input[name=is_sent]:checked').length <= 0)
    {
        OperativeReport.SurgicalSpecimenSentForExamination = false;
    }
    else 
    {
        OperativeReport.SurgicalSpecimenSentForExamination = true;
    }
    OperativeReport.Deleted = false;

    var OperativeReport_Object = JSON.stringify(OperativeReport);
    
    $.ajax(
    {
        type: "POST",
        url: baseURL + 'OperativeReport_Save',
        data: OperativeReport_Object,
        dataType: 'JSON',
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            c.ButtonDisable('#btnSave', true);
        },
        success: function (data) {
            if (data == "Success") {
                $('#preloader').hide();
                $('.Show').show();
                var OkFunc = function () {
                    Action = 0;
                    c.ModalShow('#frms_ICDs', true);
                };
                c.MessageBox("Operative Report Saved Success", "Operative Report saved successfully.", OkFunc);
                c.ButtonDisable('#btnSave', false);
                
            }
            else {
                var OkFunc = function () {
                    Action = 0;
                    HandleEnableButtons();
                    HandleEnableEntries();
                };
                c.MessageBox("Operative Report Saved Failed", "Operative Report saved Failed. Please try it later", OkFunc);
                c.ButtonDisable('#btnProcedures', true);
                c.ButtonDisable('#btnICD', true);
            }
        },
        error: function (xhr, desc, err) {
                $('#preloader').hide();
                $('.Show').show();

                c.ButtonDisable('#btnSave', false);
                var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc + "<br/><h4><label class='label label-danger'>Make Sure you have filled all data</label></h4>";
                c.MessageBox("Error...", errMsg, null);
                c.ButtonDisable('#btnProcedures', true);
                c.ButtonDisable('#btnICD', true);
            }
    });
}
function SelectAdmissionNo()
{
    //string RegNo
    var clist = {};
    $.ajax(
	{
	    type: "GET",
	    async: false,
	    data: { RegNo: $("#txt_pin").val() },
	    url: baseURL + 'SelectAdmissionNo',
	    dataType: 'JSON',
	    beforeSend: function () {
	        c.ButtonDisable('#btn_get_records', true);
	    },
	    success: function (data) {
	        $('#preloader').hide();
	        $('.Show').show();
	        clist = [];
	        $.each(data, function (i, optiondata) {
	            clist.push({ id: optiondata.AdmissionNo, text: "Adm No: "+ optiondata.AdmissionNo + " ( Admission: " + moment(JSONDateWithTime(optiondata.AdmissionDate)).format("DD-MMM-YYYY HH:mm A") + " )" });
	        });
	        ConvertSelect2Advance('#txt_ipid', clist, 'Select Admission No');
	        c.ButtonDisable('#btn_get_records', false);
	    },
	    error: function (xhr, desc, err) {
	        $('#preloader').hide();
	        $('.Show').show();

	        c.ButtonDisable('#btn_get_records', false);
	        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
	        c.MessageBox("Error...", errMsg, null);
	    }
	});
}
function OperativeReport_Delete()
{
    $.ajax(
		{
		    type: "GET",
		    async: false,
		    url: baseURL + 'OperativeReport_Delete',
    	    data: { RegNo: $("#txt_pin").val(), AdmNo: $("#txt_ipid").val() },
		    dataType: 'JSON',
		    beforeSend: function () {
		        c.ButtonDisable('#btnDelete', true);
		    },
		    success: function (data) {
		        $('#preloader').hide();
		        $('.Show').show();
		        var OkFunc = function () {
		            Action = 0;
		            ClearInputs();
		            c.Select2Clear('#txt_ipid');
		        };
		        c.MessageBox("Operative Report Delete Success", "Operative Report deleted successfully.", OkFunc);
		        c.ButtonDisable('#btnDelete', false);
		    },
		    error: function (xhr, desc, err) {
		        $('#preloader').hide();
		        $('.Show').show();

		        c.ButtonDisable('#btnDelete', false);
		        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
		        c.MessageBox("Error...", errMsg, null);
		    }
		});
}

function BindSelect2(el, datalist, ph) {
    ConvertSelect2Advance("#" + el, datalist, ph);
}
function CommonEmployeeFormatResult(inp) {
    return inp.text;
}
function ConvertSelect2Advance(el, datalist, ph) {
    $(el).select2({
        placeholder: ph,
        allowClear: true,
        closeOnSelect: false,
        initSelection: function (element, callback) {
            var selection = _.find(datalist, function (metric) {
                return metric.id === element.val();
            })
            callback(selection);
        },
        formatResult: CommonEmployeeFormatResult,
        query: function (options) {
            var pageSize = 200;
            var startIndex = (options.page - 1) * pageSize;
            var filteredData = datalist;
            var stripDiacritics = window.Select2.util.stripDiacritics;

            if (options.term && options.term.length > 0) {
                if (!options.context) {
                    var term = stripDiacritics(options.term.toLowerCase());
                    options.context = datalist.filter(function (metric) {
                        if (!metric.stripped_text) {
                            metric.stripped_text = stripDiacritics(metric.text.toLowerCase());
                        }
                        return (metric.stripped_text.indexOf(term) !== -1 || metric.text.toString().toUpperCase().indexOf(term.toUpperCase()) != -1);
                    });
                }
                filteredData = options.context;
            }
            options.callback({
                context: filteredData,
                results: filteredData.slice(startIndex, startIndex + pageSize),
                more: (startIndex + pageSize) < filteredData.length
            });
        }
    });
    $(el).attr({ width: '100%' });
    $(el).prop('disabled', false);
}
function JSONDateWithTime(dateStr) {
    var jsonDate = dateStr;
    var d = new Date(parseInt(jsonDate.substr(6)));
    var m, day;
    m = d.getMonth() + 1;
    if (m < 10)
        m = '0' + m
    if (d.getDate() < 10)
        day = '0' + d.getDate()
    else
        day = d.getDate();
    var formattedDate = m + "/" + day + "/" + d.getFullYear();
    var hours = (d.getHours() < 10) ? "0" + d.getHours() : d.getHours();
    var minutes = (d.getMinutes() < 10) ? "0" + d.getMinutes() : d.getMinutes();
    var formattedTime = hours + ":" + minutes + ":" + d.getSeconds();
    formattedDate = formattedDate + " " + formattedTime;
    return formattedDate;
}
function parseJsonDate(jsonDateString) {
    var d = new Date(parseInt(jsonDateString.replace('/Date(', '')));
    return dateFormate(d);
}
function dateFormate(_date) {
    now = _date;
    year = "" + now.getFullYear();
    month = "" + (now.getMonth() + 1); if (month.length == 1) { month = "0" + month; }
    day = "" + now.getDate(); if (day.length == 1) { day = "0" + day; }
    hour = "" + now.getHours(); if (hour.length == 1) { hour = "0" + hour; }
    minute = "" + now.getMinutes(); if (minute.length == 1) { minute = "0" + minute; }
    second = "" + now.getSeconds(); if (second.length == 1) { second = "0" + second; }
    return month + '/' + day + '/' + year + " " + hour + ":" + minute;
    //return _date;
}
// select2 searching
function Select2Search(_control_id, _url, _placeholder) {
    Sel2Server($("#" + _control_id), _url, function (d) { }, _placeholder);
}
function Sel2Server(input, url, Callback, _placeholder) {
    $(input).select2({
        allowClear: false,
        placeholder: _placeholder,
        minimumInputLength: 1,
        ajax: {
            cache: false,
            type: 'GET',
            dataType: "json",
            url: url,
            data: function (searchTerm) {
                return { id: searchTerm };
            },
            results: function (data) {
                return { results: data };
            }
        },
        dropdownAutoWidth: true,
        formatResult: selectFormatName
    }).on("change", function () {
        Callback($(this).select2('data'));
    });
}
function selectFormatName(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td>" + data.text + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;
}


function IntegerOnly(_control_id) {
    $("#" + _control_id).keydown(function (e) {
        // Allow: backspace, delete, tab, escape, enter and .
        if ($.inArray(e.keyCode, [46, 8, 9, 27, 13, 110, 190]) !== -1 ||
            // Allow: Ctrl+A, Command+A
            (e.keyCode == 65 && (e.ctrlKey === true || e.metaKey === true)) ||
            // Allow: home, end, left, right, down, up
            (e.keyCode >= 35 && e.keyCode <= 40)) {
            // let it happen, don't do anything
            return;
        }
        // Ensure that it is a number and stop the keypress
        if ((e.shiftKey || (e.keyCode < 48 || e.keyCode > 57)) && (e.keyCode < 96 || e.keyCode > 105)) {
            e.preventDefault();
        }
    })
}
function OperativeReport_PerformedProcedures_Save()
{
    var OperativeReport_PerformedProcedures = {};
    OperativeReport_PerformedProcedures.RegNo = $("#txt_pin").val();
    OperativeReport_PerformedProcedures.AdmNo = $("#txt_ipid").val();
    OperativeReport_PerformedProcedures.ProcedureID = $("#txt_performed_procedure").val();

    var OperativeReport_PerformedProcedures_Object = JSON.stringify(OperativeReport_PerformedProcedures);

    $.ajax(
    {
        type: "POST",
        url: baseURL + 'OperativeReport_PerformedProcedures_Save',
        data: OperativeReport_PerformedProcedures_Object,
        dataType: 'JSON',
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            c.ButtonDisable('#btn_performed_procedures', true);
        },
        success: function (data) {
            if (data == "Success") {
                $('#preloader').hide();
                $('.Show').show();
            } c.ButtonDisable('#btn_performed_procedures', false);
            OperativeReport_PerformedProcedures_Select($("#txt_pin").val(), $("#txt_ipid").val());
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            $('.Show').show();
            c.ButtonDisable('#btn_performed_procedures', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc + "<br/><h4><label class='label label-danger'>Make Sure not duplicate selected</label></h4>";
            c.MessageBox("Error...", errMsg, null);
        }
    });
}
function OperativeReport_PlannedProcedures_Save()
{
    var OperativeReport_PlannedProcedures = {};
    OperativeReport_PlannedProcedures.RegNo = $("#txt_pin").val();
    OperativeReport_PlannedProcedures.AdmNo = $("#txt_ipid").val();
    OperativeReport_PlannedProcedures.ProcedureID = $("#txt_planned_procedure").val();

    var OperativeReport_PlannedProcedures_Object = JSON.stringify(OperativeReport_PlannedProcedures);

    $.ajax(
    {
        type: "POST",
        url: baseURL + 'OperativeReport_PlannedProcedures_Save',
        data: OperativeReport_PlannedProcedures_Object,
        dataType: 'JSON',
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            c.ButtonDisable('#btn_planned_procedure', true);
        },
        success: function (data) {
            if (data == "Success") {
                $('#preloader').hide();
                $('.Show').show();
            } c.ButtonDisable('#btn_planned_procedure', false);
            OperativeReport_PlannedProcedures_Select($("#txt_pin").val(), $("#txt_ipid").val());
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            $('.Show').show();
            c.ButtonDisable('#btn_planned_procedure', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc + "<br/><h4><label class='label label-danger'>Make Sure not duplicate selected</label></h4>";
            c.MessageBox("Error...", errMsg, null);
        }
    });
}
function OperativeReport_PostOPDiagnosis_Save()
{
    var OperativeReport_PostOPDiagnosis = {};
    OperativeReport_PostOPDiagnosis.RegNo = $("#txt_pin").val();
    OperativeReport_PostOPDiagnosis.AdmNo = $("#txt_ipid").val();
    OperativeReport_PostOPDiagnosis.ICDID = $("#txt_post_op_diagnosis").val();

    var OperativeReport_PostOPDiagnosis_Object = JSON.stringify(OperativeReport_PostOPDiagnosis);

    $.ajax(
    {
        type: "POST",
        url: baseURL + 'OperativeReport_PostOPDiagnosis_Save',
        data: OperativeReport_PostOPDiagnosis_Object,
        dataType: 'JSON',
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            c.ButtonDisable('#btn_post_op_diag', true);
        },
        success: function (data) {
            if (data == "Success") {
                $('#preloader').hide();
                $('.Show').show();
            }
            c.ButtonDisable('#btn_post_op_diag', false);
            OperativeReport_PostOPDiagnosis_Select($("#txt_pin").val(), $("#txt_ipid").val());
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            $('.Show').show();
            c.ButtonDisable('#btn_post_op_diag', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc + "<br/><h4><label class='label label-danger'>Make Sure not duplicate selected</label></h4>";
            c.MessageBox("Error...", errMsg, null);
        }
    });
}
function OperativeReport_PreOPICDDiagnosis_Save()
{
    var OperativeReport_PreOPICDDiagnosis = {};
    OperativeReport_PreOPICDDiagnosis.RegNo = $("#txt_pin").val();
    OperativeReport_PreOPICDDiagnosis.AdmNo = $("#txt_ipid").val();
    OperativeReport_PreOPICDDiagnosis.ICDID = $("#txt_pre_op_diagnosis").val();

    var OperativeReport_PreOPICDDiagnosis_Object = JSON.stringify(OperativeReport_PreOPICDDiagnosis);

    $.ajax(
    {
        type: "POST",
        url: baseURL + 'OperativeReport_PreOPICDDiagnosis_Save',
        data: OperativeReport_PreOPICDDiagnosis_Object,
        dataType: 'JSON',
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            c.ButtonDisable('#btn_pre_op_diag', true);
        },
        success: function (data) {
            if (data == "Success") {
                $('#preloader').hide();
                $('.Show').show();
                
            } c.ButtonDisable('#btn_pre_op_diag', false);
            OperativeReport_PreOPICDDiagnosis_Select($("#txt_pin").val(), $("#txt_ipid").val());
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            $('.Show').show();
            c.ButtonDisable('#btn_pre_op_diag', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc + "<br/><h4><label class='label label-danger'>Make Sure not duplicate selected</label></h4>";
            c.MessageBox("Error...", errMsg, null);
        }
    });
}


function OperativeReport_PerformedProcedures_Select(_regNo, _admNo)
{
    var table = $('#tbl_performed_procedure').dataTable();
    table.fnClearTable();
    $.ajax(
		{
		    type: "GET",
		    async: false,
		    url: baseURL + 'OperativeReport_PerformedProcedures_Select',
		    data: { RegNo: _regNo, AdmNo: _admNo },
		    dataType: 'JSON',
		    beforeSend: function () {},
		    success: function (data) {
		       
		        var str = "";
		        $('#preloader').hide();
		        $('.Show').show();
		        console.log(data);
		        $.each(data, function (i, optiondata) {
		            str ='<a class="btn btn-sm btn-danger" onclick ="DeletePerformedProcedures('+ optiondata.ID +')"><span class="glyphicon glyphicon-trash"></span></a>'
		            $('#tbl_performed_procedure').dataTable().fnAddData([
					optiondata.Name,
                    str
		            ]);
		        });
		    },
		    error: function (xhr, desc, err) {
		        $('#preloader').hide();
		        $('.Show').show();
		        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
		        c.MessageBox("Error...", errMsg, null);
		    }
		});
}
function OperativeReport_PlannedProcedures_Select(_regNo, _admNo) {
    var table = $('#tbl_planned_procedure').dataTable();
    table.fnClearTable();
    $.ajax(
		{
		    type: "GET",
		    async: false,
		    url: baseURL + 'OperativeReport_PlannedProcedures_Select',
		    data: { RegNo: _regNo, AdmNo: _admNo },
		    dataType: 'JSON',
		    beforeSend: function () { },
		    success: function (data) {
		        $('#preloader').hide();
		        $('.Show').show();
		        console.log(data);
		        $.each(data, function (i, optiondata) {
		            str = '<a class="btn btn-sm btn-danger" onclick ="DeletePlannedProcedures(' + optiondata.ID + ')"><span class="glyphicon glyphicon-trash"></span></a>'
		            $('#tbl_planned_procedure').dataTable().fnAddData([
					optiondata.Name,
                    str
		            ]);
		        });
		    },
		    error: function (xhr, desc, err) {
		        $('#preloader').hide();
		        $('.Show').show();
		        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
		        c.MessageBox("Error...", errMsg, null);
		    }
		});
}
function OperativeReport_PostOPDiagnosis_Select(_regNo, _admNo) {
    var table = $('#tbl_post_op_diag').dataTable();
    table.fnClearTable();
    $.ajax(
		{
		    type: "GET",
		    async: false,
		    url: baseURL + 'OperativeReport_PostOPDiagnosis_Select',
		    data: { RegNo: _regNo, AdmNo: _admNo },
		    dataType: 'JSON',
		    beforeSend: function () { },
		    success: function (data) {
		        $('#preloader').hide();
		        $('.Show').show();
		        console.log(data);
		        $.each(data, function (i, optiondata) {
		            str = '<a class="btn btn-sm btn-danger" onclick ="DeletePostOPDiagnosis(' + optiondata.ID + ')"><span class="glyphicon glyphicon-trash"></span></a>'
		            $('#tbl_post_op_diag').dataTable().fnAddData([
					optiondata.Name,
                    str
		            ]);
		        });
		    },
		    error: function (xhr, desc, err) {
		        $('#preloader').hide();
		        $('.Show').show();
		        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
		        c.MessageBox("Error...", errMsg, null);
		    }
		});
}
function OperativeReport_PreOPICDDiagnosis_Select(_regNo, _admNo) {
    
    var table = $('#tbl_pre_op_diag').dataTable();
    table.fnClearTable();
    $.ajax(
		{
		    type: "GET",
		    async: false,
		    url: baseURL + 'OperativeReport_PreOPICDDiagnosis_Select',
		    data: { RegNo: _regNo, AdmNo: _admNo },
		    dataType: 'JSON',
		    beforeSend: function () { },
		    success: function (data) {
		        $('#preloader').hide();
		        $('.Show').show();
		        console.log(data);
		        $.each(data, function (i, optiondata) {
		            str = '<a class="btn btn-sm btn-danger" onclick ="DeletePreOPICDDiagnosis(' + optiondata.ID + ')"><span class="glyphicon glyphicon-trash"></span></a>'
		            $('#tbl_pre_op_diag').dataTable().fnAddData([
					optiondata.Name,
                    str
		            ]);
		        });
		    },
		    error: function (xhr, desc, err) {
		        $('#preloader').hide();
		        $('.Show').show();
		        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
		        c.MessageBox("Error...", errMsg, null);
		    }
		});
}

function DeletePreOPICDDiagnosis(_id)
{
    $.ajax(
		{
		    type: "GET",
		    async: false,
		    url: baseURL + 'OperativeReport_PreOPICDDiagnosis_Delete',
		    data: { ID: _id},
		    dataType: 'JSON',
		    beforeSend: function () { },
		    success: function (data) {
		        $('#preloader').hide();
		        $('.Show').show();
		        OperativeReport_PreOPICDDiagnosis_Select($("#txt_pin").val(), $("#txt_ipid").val());
		    },
		    error: function (xhr, desc, err) {
		        $('#preloader').hide();
		        $('.Show').show();
		        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
		        c.MessageBox("Error...", errMsg, null);
		    }
		});
}
function DeletePostOPDiagnosis(_id) {
    $.ajax(
		{
		    type: "GET",
		    async: false,
		    url: baseURL + 'OperativeReport_PostOPDiagnosis_Delete',
		    data: { ID: _id },
		    dataType: 'JSON',
		    beforeSend: function () { },
		    success: function (data) {
		        $('#preloader').hide();
		        $('.Show').show();
		        OperativeReport_PostOPDiagnosis_Select($("#txt_pin").val(), $("#txt_ipid").val());
		    },
		    error: function (xhr, desc, err) {
		        $('#preloader').hide();
		        $('.Show').show();
		        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
		        c.MessageBox("Error...", errMsg, null);
		    }
		});
}
function DeletePlannedProcedures(_id)
{
    $.ajax(
		{
		    type: "GET",
		    async: false,
		    url: baseURL + 'OperativeReport_PlannedProcedures_Delete',
		    data: { ID: _id },
		    dataType: 'JSON',
		    beforeSend: function () { },
		    success: function (data) {
		        $('#preloader').hide();
		        $('.Show').show();
		        OperativeReport_PlannedProcedures_Select($("#txt_pin").val(), $("#txt_ipid").val());
		    },
		    error: function (xhr, desc, err) {
		        $('#preloader').hide();
		        $('.Show').show();
		        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
		        c.MessageBox("Error...", errMsg, null);
		    }
		});
}
function DeletePerformedProcedures(_id)
{
    $.ajax(
		{
		    type: "GET",
		    async: false,
		    url: baseURL + 'OperativeReport_PerformedProcedures_Delete',
		    data: { ID: _id },
		    dataType: 'JSON',
		    beforeSend: function () { },
		    success: function (data) {
		        $('#preloader').hide();
		        $('.Show').show();
		        OperativeReport_PerformedProcedures_Select($("#txt_pin").val(), $("#txt_ipid").val());
		    },
		    error: function (xhr, desc, err) {
		        $('#preloader').hide();
		        $('.Show').show();
		        var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
		        c.MessageBox("Error...", errMsg, null);
		    }
		});
}