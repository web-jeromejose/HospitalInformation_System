var c = new Common();
$(document).ready(function () {
    $("#txt_pin").focus();

    $('#txt_ipid').on("select2-selecting", function (e) {

        UTIBundle_GetPatientDetails($("#txt_pin").val(), e.val)
        //OperativeReport_PerformedProcedures_Select($("#txt_pin").val(), e.val);
        //OperativeReport_PlannedProcedures_Select($("#txt_pin").val(), e.val);
        //OperativeReport_PreOPICDDiagnosis_Select($("#txt_pin").val(), e.val);
        //OperativeReport_PostOPDiagnosis_Select($("#txt_pin").val(), e.val);
    });

    $('#txt_date').datetimepicker({
        pickTime: true
    }).on("dp.change", function (e) {

    });
    //IntegerOnly('txt_estimated_blood_loss');
    ////(string id)
    //Select2Search('txt_surgeon', baseURL + 'GetDoctors', 'Select Primary Surgeon');
    //Select2Search('txt_asst_surgeon', baseURL + 'GetDoctors', 'Select Assitant');
    //Select2Search('txt_anes_name', baseURL + 'GetDoctors', 'Select Anesthestist');
    //Select2Search('txt_sec_surgeon', baseURL + 'GetDoctors', 'Select Secondary Surgeon');

    //Select2Search('txt_pre_op_diagnosis', baseURL + 'GetICDCodes', 'Select Pre OP ICD Diagnosis');
    //Select2Search('txt_post_op_diagnosis', baseURL + 'GetICDCodes', 'Select Post OP ICD Diagnosis');

    //Select2Search('txt_planned_procedure', baseURL + 'GetProcedures', 'Select Planned Procedures');
    //Select2Search('txt_performed_procedure', baseURL + 'GetProcedures', 'Select Planned Procedures');

    //c.ButtonDisable('#btnICD', true);
    //c.ButtonDisable('#btnProcedures', true);
});


$(document).on("click", "#btn_get_records", function () {
    UTIBundle_GetAdmission();
});
$(document).on("click", "#btnClear", function () {
    window.location = baseURL + "UTIBundle";
});
$(document).on("click", "#btnSave", function () {
    UTIBundle_Insert();
});

$(document).on("click", "#btnDelete", function () {
    UTIBundle_Delete();
});
// all functions

function UTIBundle_GetAdmission()
{
    var clist = {};
    $.ajax(
	{
	    type: "GET",
	    async: false,
	    data: { RegNo: $("#txt_pin").val() },
	    url: baseURL + 'UTIBundle_GetAdmission',
	    dataType: 'JSON',
	    beforeSend: function () {
	        c.ButtonDisable('#btn_get_records', true);
	    },
	    success: function (data) {
	        $('#preloader').hide();
	        $('.Show').show();
	        clist = [];
	        $.each(data, function (i, optiondata) {
	            clist.push({ id: optiondata.AdmissionNo, text: "Adm No: " + optiondata.AdmissionNo + " ( Admission: " + moment(JSONDateWithTime(optiondata.AdmissionDate)).format("DD-MMM-YYYY HH:mm A") + " )" });
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
function UTIBundle_GetPatientDetails(_RegNo, _AdmNo)
{
    $.ajax(
		{
		    type: "GET",
		    async: false,
		    url: baseURL + 'UTIBundle_GetPatientDetails',
		    data: { RegNo: _RegNo, AdmNo: _AdmNo },
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

		            if (moment(JSONDateWithTime(optiondata.CatheterInsertedDateTime)).format("DD-MMM-YYYY HH:mm A") == "01-Jan-2001 03:00 AM") {
		                $("#txt_date").val('');
		            }
		            else { $("#txt_date").val(moment(JSONDateWithTime(optiondata.CatheterInsertedDateTime)).format("DD-MMM-YYYY HH:mm A")); }

		            $("textarea#txt_ByTrainedPerson").val(optiondata.ByTrainedPersonRemarks);
		            $("textarea#txt_CatheterIndication").val(optiondata.CatheterIndicationRemarks);
		            $("textarea#txt_HandHygiene").val(optiondata.HandHygieneRemarks);
		            $("textarea#txt_GlovesWorn").val(optiondata.GlovesWornRemarks);
		            $("textarea#txt_PatientCovered").val(optiondata.PatientCoveredRemarks);
		            $("textarea#txt_InsertionSiteCleaned").val(optiondata.InsertionSiteCleanedRemarks);
		            $("textarea#txt_SiteLubricated").val(optiondata.SiteLubricatedRemarks);
		            $("textarea#txt_AppropriateSize").val(optiondata.AppropriateSizeRemarks);
		            $("textarea#txt_ClosedSystem").val(optiondata.ClosedSystemRemarks);
		            $("textarea#txt_DrainageBagAttached").val(optiondata.DrainageBagAttachedRemarks);
		            $("textarea#txt_DrainageBagOffFloor").val(optiondata.DrainageBagOffFloorRemarks);
		            $("textarea#txt_CatheterSecured").val(optiondata.CatheterSecuredRemarks);
		            $("textarea#txt_TubingSecured").val(optiondata.TubingSecuredRemarks);
		            

		            if (optiondata.ByTrainedPerson != null) {
		                if (optiondata.ByTrainedPerson == true) {
		                    $('#rdo_ByTrainedPerson_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.ByTrainedPerson == false) {
		                    $('#rdo_ByTrainedPerson_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('ByTrainedPerson');
		            }

		            if (optiondata.CatheterIndication != null) {
		                if (optiondata.CatheterIndication == true) {
		                    $('#rdo_CatheterIndication_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.CatheterIndication == false) {
		                    $('#rdo_CatheterIndication_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('CatheterIndication');
		            }

		            // 
		            if (optiondata.HandHygiene != null) {
		                if (optiondata.HandHygiene == true) {
		                    $('#rdo_HandHygiene_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.HandHygiene == false) {
		                    $('#rdo_HandHygiene_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('HandHygiene');
		            }
		            //
		            if (optiondata.GlovesWorn != null) {
		                if (optiondata.GlovesWorn == true) {
		                    $('#rdo_GlovesWorn_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.GlovesWorn == false) {
		                    $('#rdo_GlovesWorn_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('GlovesWorn');
		            }
		            //
		            if (optiondata.PatientCovered != null) {
		                if (optiondata.PatientCovered == true) {
		                    $('#rdo_PatientCovered_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.PatientCovered == false) {
		                    $('#rdo_PatientCovered_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('PatientCovered');
		            }
		            //
		            if (optiondata.InsertionSiteCleaned != null) {
		                if (optiondata.InsertionSiteCleaned == true) {
		                    $('#rdo_InsertionSiteCleaned_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.InsertionSiteCleaned == false) {
		                    $('#rdo_InsertionSiteCleaned_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('InsertionSiteCleaned');
		            }
		            //
		            if (optiondata.SiteLubricated != null) {
		                if (optiondata.SiteLubricated == true) {
		                    $('#rdo_SiteLubricated_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.SiteLubricated == false) {
		                    $('#rdo_SiteLubricated_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('SiteLubricated');
		            }
		            //
		            if (optiondata.AppropriateSize != null) {
		                if (optiondata.AppropriateSize == true) {
		                    $('#rdo_AppropriateSize_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.AppropriateSize == false) {
		                    $('#rdo_AppropriateSize_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('AppropriateSize');
		            }
		            //
		            if (optiondata.ClosedSystem != null) {
		                if (optiondata.ClosedSystem == true) {
		                    $('#rdo_ClosedSystem_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.ClosedSystem == false) {
		                    $('#rdo_ClosedSystem_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('ClosedSystem');
		            }
		            //
		            if (optiondata.DrainageBagAttached != null) {
		                if (optiondata.DrainageBagAttached == true) {
		                    $('#rdo_DrainageBagAttached_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.DrainageBagAttached == false) {
		                    $('#rdo_DrainageBagAttached_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('DrainageBagAttached');
		            }
		            //
		            if (optiondata.DrainageBagOffFloor != null) {
		                if (optiondata.DrainageBagOffFloor == true) {
		                    $('#rdo_DrainageBagOffFloor_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.DrainageBagOffFloor == false) {
		                    $('#rdo_DrainageBagOffFloor_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('DrainageBagOffFloor');
		            }
                    //
		            if (optiondata.CatheterSecured != null) {
		                if (optiondata.CatheterSecured == true) {
		                    $('#rdo_CatheterSecured_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.CatheterSecured == false) {
		                    $('#rdo_CatheterSecured_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('CatheterSecured');
		            }
		            //
		            if (optiondata.TubingSecured != null) {
		                if (optiondata.TubingSecured == true) {
		                    $('#rdo_TubingSecured_yes').attr('checked', 'checked');
		                }
		                else if (optiondata.TubingSecured == false) {
		                    $('#rdo_TubingSecured_no').attr('checked', 'checked');
		                }
		            }
		            else {
		                ClearRadio('TubingSecured');
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
function UTIBundle_Insert()
{
    var UTIBundle = {};
    UTIBundle.RegistrationNo = $("#txt_pin").val();
    UTIBundle.AdmissionNo = $("#txt_ipid").val();
    UTIBundle.Name = $("#txt_patient_name").val();
    UTIBundle.Age = $("#txt_age").val();
    UTIBundle.CatheterInsertedDateTime = $("#txt_date").val();
    UTIBundle.ByTrainedPerson = GetRadioVal('ByTrainedPerson');
    UTIBundle.ByTrainedPersonRemarks = $("textarea#txt_ByTrainedPerson").val();
    UTIBundle.CatheterIndication = GetRadioVal('CatheterIndication');
    UTIBundle.CatheterIndicationRemarks = $("textarea#txt_CatheterIndication").val()
    UTIBundle.HandHygiene = GetRadioVal('HandHygiene');
    UTIBundle.HandHygieneRemarks = $("textarea#txt_HandHygiene").val();
    UTIBundle.GlovesWorn = GetRadioVal("GlovesWorn");
    UTIBundle.GlovesWornRemarks = $("textarea#txt_GlovesWorn").val();
    UTIBundle.PatientCovered = GetRadioVal('PatientCovered');
    UTIBundle.PatientCoveredRemarks = $("textarea#txt_PatientCovered").val();
    UTIBundle.InsertionSiteCleaned = GetRadioVal('InsertionSiteCleaned');
    UTIBundle.InsertionSiteCleanedRemarks = $("textarea#txt_InsertionSiteCleaned").val();
    UTIBundle.SiteLubricated = GetRadioVal('SiteLubricated');
    UTIBundle.SiteLubricatedRemarks = $("textarea#txt_SiteLubricated").val();
    UTIBundle.AppropriateSize = GetRadioVal('AppropriateSize');
    UTIBundle.AppropriateSizeRemarks = $("textarea#txt_AppropriateSize").val();
    UTIBundle.ClosedSystem = GetRadioVal('ClosedSystem');
    UTIBundle.ClosedSystemRemarks = $("textarea#txt_ClosedSystem").val();
    UTIBundle.DrainageBagAttached = GetRadioVal("DrainageBagAttached");
    UTIBundle.DrainageBagAttachedRemarks = $("textarea#txt_DrainageBagAttached").val();
    UTIBundle.DrainageBagOffFloor = GetRadioVal('DrainageBagOffFloor');
    UTIBundle.DrainageBagOffFloorRemarks = $("textarea#txt_DrainageBagOffFloor").val();
    UTIBundle.CatheterSecured = GetRadioVal('CatheterSecured');
    UTIBundle.CatheterSecuredRemarks = $("textarea#txt_CatheterSecured").val();
    UTIBundle.TubingSecured = GetRadioVal("TubingSecured");
    UTIBundle.TubingSecuredRemarks = $("textarea#txt_TubingSecured").val();
    var UTIBundle_Object = JSON.stringify(UTIBundle);
    console.log(UTIBundle_Object);
    $.ajax(
    {
        type: "POST",
        url: baseURL + 'UTIBundle_Insert',
        data: UTIBundle_Object,
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
                };
                c.MessageBox("UTI Bundle Saved Success", "Operative Report saved successfully.", OkFunc);
                c.ButtonDisable('#btnSave', false);
                ClearAll();
            }
            else {
                var OkFunc = function () {
                    Action = 0;
                };
                c.MessageBox("UTI Bundle Saved Failed", "UTI Bundle saved Failed. Please try it later", OkFunc);
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
function UTIBundle_Delete()
{
    //_RegNo, _AdmNo
    $.ajax(
		{
		    type: "GET",
		    async: false,
		    url: baseURL + 'UTIBundle_Delete',
		    data: { RegNo: $("#txt_pin").val(), AdmNo: $("#txt_ipid").val()},
		    dataType: 'JSON',
		    beforeSend: function () {
		        c.ButtonDisable('#btnDelete', true);
		    },
		    success: function (data) {
		        $('#preloader').hide();
		        $('.Show').show();
		        c.MessageBox("Success...", "Delete success", null);
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

// all important functions 
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
function ClearRadio(_control_id) {
    var ele = document.getElementsByName(_control_id);
    for (var i = 0; i < ele.length; i++)
        ele[i].checked = false;
}
$(document).keypress(function (e) {
    if (e.which == 13) {
        UTIBundle_GetAdmission();
        return false;
    }
});
function GetRadioVal(_control_name)
{
    return $('input[name=' + _control_name + ']:checked').val();
}
function ClearAll()
{
    $("#txt_pin").val('');
    $("#txt_ipid").val('');
    $("#txt_patient_name").val('');
    $("#txt_age").val('');
    $("#txt_date").val('');
    ClearRadio('ByTrainedPerson');
    $("textarea#txt_ByTrainedPerson").val('');
    ClearRadio('CatheterIndication');
    $("textarea#txt_CatheterIndication").val('');
    ClearRadio('HandHygiene');
    $("textarea#txt_HandHygiene").val('');
    ClearRadio('GlovesWorn');
    $("textarea#txt_GlovesWorn").val('');
    ClearRadio('PatientCovered');
    $("textarea#txt_PatientCovered").val('');
    ClearRadio('InsertionSiteCleaned');
    $("textarea#txt_InsertionSiteCleaned").val('');
    ClearRadio('SiteLubricated');
    $("textarea#txt_SiteLubricated").val('');
    ClearRadio('AppropriateSize');
    $("textarea#txt_AppropriateSize").val('');
    ClearRadio('ClosedSystem');
    $("textarea#txt_ClosedSystem").val('');
    ClearRadio('DrainageBagAttached');
    $("textarea#txt_DrainageBagAttached").val('');
    ClearRadio('DrainageBagOffFloor');
    $("textarea#txt_DrainageBagOffFloor").val('');
    ClearRadio('CatheterSecured');
    $("textarea#txt_CatheterSecured").val('');
    ClearRadio('TubingSecured');
    $("textarea#txt_TubingSecured").val('');

}