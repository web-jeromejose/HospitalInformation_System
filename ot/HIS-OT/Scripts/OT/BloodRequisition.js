var c = new Common();
var NEW_ORDER = "0";
var COMPLETE_ORDER = "1";
var PARTIAL_DEMAND = "2";
var TblGridList;
var TblGridListId = "#gridList";

function loadInitialValues() {
    $("#txtDateTime").val(c.MomentDDMMMYYYY(Date()));
}

function loadDataControlers() {

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
        //c.SetSelect2('#select2BedNo', list[5], list[4]);
        fetchPatientDetails(list);
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
        //c.SetSelect2('#select2BedNo', list[5], list[4]);
        fetchPatientDetails(list);
        });

    $('#select2Doctor').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetDoctor',
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
    });

    $('#select2Item').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetBloodItem',
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
    }).change(function (d) {
        debugger;
        var dt = moment().format("DD MMM YYYY HH:mm:ss");
        var isExist = false;

        if ($('#tbl-bloodItems > tbody > tr').length > 0) {
            $.each($("#tbl-bloodItems > tbody > tr"), function (i, e) {
                if ($(this).prop('id') == d.added.id) {
                    isExist = true;
                    return;
                }
            });
        }
        if (!isExist) {

            //$("#tbl-bloodItems > tbody").append("<tr id=" + d.id + "><td>" + d.text + "</td><td>" + dt + "</td><td><input type='text' class='brdata_qty_" + d.id + "' data-id='" + d.id + "' data-name='" + d.name + "' style='width:70px;' value='1'  /></td><td><input type='text' class='brdata_rem_" + d.id + "' data-id='" + d.id + "' data-name='" + d.name + "' style='width:100%;' value=''  /><td><span class='btn btn-sm btn-danger _remove'><span class='glyphicon glyphicon-remove'></span></span></td></tr>");
            $("#tbl-bloodItems > tbody").append("<tr id=" + d.added.id + "><td>" + d.added.text + "</td><td><input type='number' class='brdata_qty_" + d.added.id + "' data-id='" + d.added.id + "' data-name='" + d.added.name + "' style='width:70px;' value='1'  /></td><td><input type='text' class='brdata_rem_" + d.added.id + "' data-id='" + d.added.id + "' data-name='" + d.added.name + "' style='width:100%;' value=''  /><td><span class='btn btn-xs btn-danger _remove'><span class='glyphicon glyphicon-remove'></span></span></td></tr>");
        }
    });
}

function loadEditDetails(bloodOrderId) {

    if (Number(bloodOrderId) == 0) {
        return;
    }
    var url = baseURL + 'GetBloodRequest';
    ajaxWrapper.Get(url, { id: bloodOrderId }, function (x) {
        fetchEditPatientDetails(x);
    });
}

function fetchEditPatientDetails(list) {

    if ($("#hdIsEdit").val() == "true") {
        $("#txtOrderNo").val(list.CombineOrderNo);
        $("#txtDateTime").val(c.MomentDDMMMYYYY(list.EntryDateTime));
        c.SetSelect2('#select2PIN', list.IPID, list.PIN);
        c.SetSelect2('#select2Name', list.IPID, list.IPID + ' - ' + list.PIN);        
        c.SetSelect2('#select2Doctor', list.DoctorId, list.DoctorName);
        c.SetValue('#txtBedNo', list.Bed);
        c.SetValue('#txtAge', list.Age);
        c.SetValue('#txtGender', list.Sex);
        c.SetValue('#txtPackage', list.Package);
        c.SetValue('#txtCompany', list.CompanyName);
        c.SetValue('#txtBloodGroup', list.BloodGroup);
        c.SetValue('#txtDiagnosis', list.Diagnosis);
        //Type of Request
        if (list.ReqType == 0) {
            c.iCheckSet("#reqRoutine", true);
        }
        else if (list.ReqType == 0) {
            c.iCheckSet("#reqStat", true);
        }
        else {
            c.iCheckSet("#reqEmergency", true);
        }
        //Type of Transfusion
        if (list.TransType == 0) {
            c.iCheckSet("#transSurgery", true);
        }
        else {
            c.iCheckSet("#transTherapeutic", true);
        }
        //Donor Provided
        if (list.Replace == 0) {
            c.iCheckSet("#replYes", true);
        }
        else {
            c.iCheckSet("#replNo", true);
        }

        c.SetValue('#wbc', list.WBC);
        c.SetValue('#rbc', list.RBC);
        c.SetValue('#hb', list.HB);
        c.SetValue('#pt', list.PT);
        c.SetValue('#pcv', list.PCV);
        c.SetValue('#plate', list.Platelet);
        c.SetValue('#other', list.Others);
        c.SetValue('#pttk', list.PTTK);

        c.ClearTable("#tbl-bloodItems");
        $.each(list.BloodRequestDetails, function (index, d) {
            $("#tbl-bloodItems > tbody").append("<tr id=" + d.ComponentID + "><td>" + d.Code + ' - ' + d.ComponentName + "</td><td>" + d.Quantity + "</td><td>"+ d.Remarks +"</tr>");
        })
        return;
    }
}

function fetchPatientDetails(list) {
    c.SetValue('#txtBedNo', list[4]);
    c.SetValue('#txtAge', list[8]);
    c.SetValue('#txtGender', list[9]);
    c.SetValue('#txtPackage', list[11]);
    c.SetValue('#txtCompany', list[13]);
    c.SetValue('#txtCategory', list[14]);
    c.SetValue('#txtBloodGroup', list[15]);
    c.SetSelect2('#select2Doctor', list[16], list[10]);
    c.SetValue('#txtDiagnosis', list[18]);
}

function disableControls(isDisable) {
    debugger;
    if (isDisable) {
        $("#btnSave").off('click');
        $("#btnClear").off('click');
    }
    else {
        $("#btnSave").on('click', save);
        $("#btnClear").on('click', clear);
    }
    c.ButtonDisable("#btnSave", isDisable);
    c.ButtonDisable("#btnClear", isDisable);
    c.DisableSelect2("#select2PIN", isDisable);
    c.DisableSelect2("#select2Name", isDisable);
    c.DisableSelect2("#select2Doctor", isDisable);
    c.DisableSelect2("#select2Item", isDisable);
    c.iCheckDisable(".clsRequestType", isDisable);
    c.iCheckDisable(".clsTransfusionType", isDisable);
    c.iCheckDisable(".clsReplacement", isDisable);
}

function clearAll() {
    c.ClearAllText();
    c.ClearAllTextArea();
    c.Select2ClearAll();
    c.InputSelect2ClearAll();
    c.ClearAlliCheckCheckbox();
    c.ClearAlliCheckRadio();
    c.ClearTable("#tbl-bloodItems");
    loadInitialValues();
}

function ShowList() {
    var Url = baseURL + "ShowList";
    //var param = {
    //    FromDateF: "",
    //    FromDateT: "",
    //    StationId: "-1",
    //    CurrentStationID: $("#ListOfStation").val()
    //}

    $('#preloader').show();
    $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        //data: param,
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
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        //order: [[ 1, "desc" ]],
        ordering: false,
        searching: true,
        info: true,
        scrollY: 380,
        processing: false,
        autoWidth: false,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        iDisplayLength: 25,
        //fnRowCallback: ShowListRowCallBack(),
        columns: ShowListColumns()
    });
}

function ShowListColumns() {
    var cols = [
        { targets: [0], data: "ID", className: '', visible: false, searchable: false, width: "0%" },
        { targets: [1], data: "CombineOrderNo", className: '', visible: true, searchable: true, width: "0%" },
        {
            targets: [2], className: '', 
            data: function (row, data) {
                var priority = "";
                var status = "";
                var colour = "";
                if (row.Status == "7" || row.Status == "0") {

                    if (row.Demand == NEW_ORDER) {
                        colour = "label-warning";
                        status = "New Order";
                    }
                    else if (row.Demand == COMPLETE_ORDER || row.Demand == PARTIAL_DEMAND) {
                        colour = "label-success";
                        status = "Moved To Demand";
                    }
                }
                else if (row.Status == "1") {
                    colour = "label-success";
                    status = "Moved To Demand";
                }
                else if (row.Status == "10") {
                    colour = "label-default";
                    status = "Order Unreserved";
                }
                return priority + '<span class="label ' + colour + ' lb-sm">' + status + '</span>'
            }
        },
        {
            targets: [3], data: function (row, index) {
                var dateTime;
                c.DTFormat(row.DateTime, function (r) { dateTime = r });
                return dateTime;
            }, className: '', visible: true, searchable: true, width: "0%" },
        { targets: [4], data: "PIN", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [5], data: "PatientName", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [6], data: "OperatorName", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [7], data: "StationName", className: '', visible: true, searchable: true, width: "0%" }
    ]
    return cols;
}

function initialLoad() {
    ShowList();
    loadInitialValues();
    loadDataControlers();
}

function validate() {
    var result = {
        isValid: false
    };
    
    if (c.IsEmptySelect2('#select2PIN')) {
        c.MessageBoxErr('Empty...', 'Please select a PIN / Name ');
    }
    else if (c.IsEmptySelect2('#select2Doctor')) {
        c.MessageBox("Please select a [Doctor]", "Error Detected");
    }
    else if (!$("#reqRoutine").is(':checked') && !$("#reqStat").is(':checked') && !$("#reqEmergency").is(':checked')) {
        c.MessageBoxErr("Please select [Type of Request]", "Error Detected");
    }
    else if (!$("#transSurgery").is(':checked') && !$("#transTherapeutic").is(':checked')) {
        c.MessageBoxErr("Please select [Type of Transfusion]", "Error Detected");
    }
    else if (!$("#replYes").is(':checked') && !$("#replNo").is(':checked')) {
        c.MessageBoxErr("Please select [Replacement Donor Provided]", "Error Detected");
    }
    else if ($('#tbl-bloodItems > tbody > tr').length == 0) {
        c.MessageBoxErr("Please select at least one item!", "Error Detected");
    }
    else {
        result.isValid = true;
    }

    var req = undefined;
    if ($("#reqRoutine").is(':checked')) {
        req = 0;
    }
    if ($("#reqStat").is(':checked')) {
        req = 1;
    }
    if ($("#reqEmergency").is(':checked')) {
        req = 2;
    }
    var trans = undefined;
    if ($("#transSurgery").is(':checked')) {
        trans = 0;
    }
    if ($("#transTherapeutic").is(':checked')) {
        trans = 1;
    }
    var donor = undefined;
    if ($("#replYes").is(':checked')) {
        donor = 0;
    }
    if ($("#replNo").is(':checked')) {
        donor = 1;
    }

    if (result.isValid && req !== undefined && trans !== undefined && donor !== undefined) {
        result.isValid = true;
        result.req = req;
        result.trans = trans;
        result.donor = donor;
    }
    return result;
}

var clear = function () {
    $("#hdIsEdit").val(false);
    clearAll();
};

var save = function () {
    var result = validate();
    if (!result.isValid) {
        return false;
    }
    var BloodRequestModel = {
        WBC: $("#wbc").val(),
        RBC: $("#rbc").val(),
        HB: $("#hb").val(),
        PT: $("#pt").val(),
        PCV: $("#pcv").val(),
        Platelet: $("#plate").val(),
        Others: $("#other").val(),
        PTTK: $("#pttk").val(),
        //EarlierDefect: Defects,

        Diagnosis: c.GetValue("#txtDiagnosis"),
        DoctorId: c.GetSelect2Id("#select2Doctor"),
        IPID: c.GetSelect2Id("#select2PIN"),
        StationID: $("#ListOfStation").val(),
        TypeofRequest: result.req,
        TypeofTransfusion: result.trans,
        Donor: result.donor,
        BloodOrderID: $("#hdIsEdit").prop("bloodOrderId")
    }

    var ListBloodDetailModel = [];
    var reqDate;
    c.DTFormat(new Date(), function (r) {
        reqDate = r;
    });
    if ($('#tbl-bloodItems > tbody > tr').length > 0) {
        $.each($('#tbl-bloodItems > tbody > tr'), function (index, val) {
            var id = $(this).prop('id');
            ListBloodDetailModel.push({
                ID: id,
                RequiredDate: reqDate,
                Quantity: $($(val).find('td .brdata_qty_' + id)).val(),
                Remarks: $($(val).find('td .brdata_rem_' + id)).val()
            });
        });
    }
    try {
        var url = baseURL + 'Save';
        $('#preloader').show();
        ajaxWrapper.Post(url, JSON.stringify({ entry: BloodRequestModel, detail: ListBloodDetailModel }), function (x) {
            $('#preloader').hide();
            debugger;
            swal({
                title: $(".logo-mod-name").text(),
                text: x.Message,
                html: true, type: "info", showCancelButton: false, confirmButtonColor: "#DD6B55", confirmButtonText: "OK", closeOnConfirm: true
            }, function () {
                clearAll();
            });
        });
    } catch (e) {
        $('#preloader').hide();
    }
};

$('#btnClose').click(function () {
    $("#hdIsEdit").val(false);
    c.ModalShow('#modalEntry', false);
});

$('#btnNewEntry').click(function () {
    $("#hdIsEdit").val(false);
    clearAll();
    disableControls(false);
    c.ModalShow('#modalEntry', true);
});

$("#btnRefresh").click(function () {
    ShowList();
});

$(document).on('click', '._remove', function () {
    $(this).closest('tr').remove();
});

$(document).on("click", "#gridList td", function (e) {
    var bloodOrderId = $("#gridList").DataTable().row($(this).closest('tr')).data()['ID'];
    $("#hdIsEdit").val(true).prop("bloodOrderId", bloodOrderId);
    disableControls(true);
    loadEditDetails(bloodOrderId);
    c.ModalShow('#modalEntry', true);
});

$(document).ready(function () {
    RedCheck($(".clsRequestType"));
    RedCheck($(".clsTransfusionType"));
    RedCheck($(".clsReplacement"));
    RedCheck($(".chkEDef"));
    initialLoad();
});