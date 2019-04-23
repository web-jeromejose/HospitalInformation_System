var c = new Common();
var NEW_ORDER = "0";
var COMPLETE_ORDER = "1";
var PARTIAL_DEMAND = "2";
var TblGridList;
var TblGridListId = "#gridList";

function loadUsers() {

    $("#empid").select2({
        allowClear: false,
        placeholder: "Username",
        minimumInputLength: 2,
        ajax: {
            cache: false,
            type: 'GET',
            dataType: "json",
            url: baseURL + "Select2User",
            data: function (searchTerm) {
                return { id: searchTerm };
            },
            success: function () {
                $("#emppw").focus();
            },
            results: function (data) {
                return { results: data };
            }
        },
        dropdownAutoWidth: true,
        formatResult: selectFormatResultUser
    }).on("change", function () {
        $("#emppw").focus();
    });
}

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
}

function loadEditDetails(bloodOrderId) {

    if (Number(bloodOrderId) == 0) {
        return;
    }
    var url = baseURL + 'GetBloodDemand';
    ajaxWrapper.Get(url, { id: bloodOrderId }, function (x) {
        fetchEditPatientDetails(x);
    });
}

function selectFormatResultUser(data) {
    var markup = "<table><tr>";
    if (data.name !== undefined) {
        markup += "<td style='width:100px;' >" + data.id + "</td>" + "<td>" + data.name + "</td>";
    }
    markup += "</td></tr></table>"
    return markup;
}

function fetchEditPatientDetails(list) {

    if ($("#hdIsEdit").val() == "true") {
        $("#txtOrderNo").val(list.CombineOrderNo);
        $("#txtDateTime").val(c.MomentDDMMMYYYY(list.EntryDateTime == undefined ? Date() : list.EntryDateTime));
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
        enableDisableEditing(list);
    }
}

function enableDisableEditing(list) {

    if ($("#hdIsEdit").data("iscomplorder") != undefined && $("#hdIsEdit").data("iscomplorder") == COMPLETE_ORDER) {
        disableEditControls(true);
    }
    else if ($("#hdIsEdit").data("iscomplorder") != undefined && $("#hdIsEdit").data("iscomplorder") == PARTIAL_DEMAND &&
             $("#hdIsEdit").data("isextcomplorder") != undefined && $("#hdIsEdit").data("isextcomplorder") == COMPLETE_ORDER) {
        disableEditControls(true);
    }
    else {
        disableEditControls(false);
    }
    c.ClearTable("#tbl-bloodItems");
    $.each(list.BloodDemandDetails, function (index, d) {
        debugger
        var editControls = "<td><input type='number' class='data_demqty data_demqty_" + d.ComponentID + "' value=0 /></td><td><input type='text' class='data_rem_" + d.ComponentID + "' value=" + d.Remarks + " /></td>"
        if ($("#hdIsEdit").data("iscomplorder") != undefined && $("#hdIsEdit").data("iscomplorder") == COMPLETE_ORDER) {
            editControls = "<td class='data_demqty data_demqty_" + d.ComponentID + "'></td><td class='data_rem_" + d.ComponentID + ">" + d.Remarks + "</td>"
        }
        else if ($("#hdIsEdit").data("iscomplorder") != undefined && $("#hdIsEdit").data("iscomplorder") == PARTIAL_DEMAND &&
                 $("#hdIsEdit").data("isextcomplorder") != undefined && $("#hdIsEdit").data("isextcomplorder") == COMPLETE_ORDER) {
            editControls = "<td class='data_demqty data_demqty_" + d.ComponentID + "'></td><td class='data_rem_" + d.ComponentID + ">" + d.Remarks + "</td>"
        }
        $("#tbl-bloodItems > tbody").append("<tr id=" + d.ComponentID + "><td>" + d.ComponentName + "</td><td class='data_qty_" + d.ComponentID + "'>" + d.Quantity + "</td><td>" + d.PrevQty + "</td>" + editControls + "</tr>");
    });
}

function disableControls(isDisable) {
    c.DisableSelect2("#select2PIN", isDisable);
    c.DisableSelect2("#select2Name", isDisable);
    c.DisableSelect2("#select2Doctor", isDisable);
}

function disableEditControls(isDisable) {
    if (isDisable) {
        $("#btnSave").off('click');
    }
    else {
        $("#btnSave").on('click', save);
    }
    c.ButtonDisable("#btnSave", isDisable);
}

function clearAll() {
    c.ClearAllText();
    c.ClearAllTextArea();
    c.Select2ClearAll();
    c.InputSelect2ClearAll();
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
                if (row.Demand == NEW_ORDER) {
                    colour = "label-warning";
                    status = "New Order";
                }
                else if (row.Demand == COMPLETE_ORDER) {
                    colour = "label-success";
                    status = "Completed Order";
                }
                else if (row.Demand == PARTIAL_DEMAND) {
                    if (row.ExtendStatus == COMPLETE_ORDER) {
                        colour = "label-success";
                        status = "Completed Order";
                    }
                    else {
                        colour = "label-default";
                        status = "Partial Demand";
                    }
                }
                return priority + '<span class="label ' + colour + ' lb-sm">' + status + '</span>'
            }
        },
        {
            targets: [3], data: function (row, index) {
                var dateTime;
                c.DTFormat(row.DateTime, function (r) { dateTime = r });
                return dateTime;
            }, className: '', visible: true, searchable: true, width: "0%"
        },
        { targets: [4], data: "PIN", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [5], data: "PatientName", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [6], data: "OperatorName", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [7], data: "Bed", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [8], data: "StationName", className: '', visible: true, searchable: true, width: "0%" }
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
        c.MessageBoxErr('Empty...', 'Please select a [PIN/Name]');
    }
    else if (c.IsEmptySelect2('#select2Doctor')) {
        c.MessageBoxErr('Empty...', "Please select a [Doctor]");
    }
    else if ($('#tbl-bloodItems > tbody > tr').length == 0) {
        c.MessageBoxErr('Empty...', "Please select at least one item at Blood Request screen");
    }
    else {
        result.isValid = true;
    }

    if (result.isValid && $('#tbl-bloodItems > tbody > tr').length > 0) {
        $.each($('#tbl-bloodItems > tbody > tr'), function () {
            if ($(this).find('td .data_demqty').val() == 0) {
                result.isValid = false;
                c.MessageBoxErr('Empty...', "Please add valid [Demand Qty]");
                return;
            }
        });
    }
    return result;
}

function validateLogin() {

    verifyCredentials(function (d, action) {

        if (d == $("#hdIsEdit").data("userid")) {
            if (action == "save") {
                saveBloodDemand();
            }
            else if (action == "cancel") {
                //cancel();
            }
            ShowList();
            c.ModalShow('#modalLogin', false);
            c.ModalShow("#modalEntry", false);
            return false;
        }
        else {
            swal("Invalid Password!", "Please try again!", "warning");
        }
    });
}

function verifyCredentials(CallBack) {
    var data = {
        "id": $("#empid").val(), "pass": $("#emppw").val()
    }
    $.ajax({
        cache: false,
        type: 'POST',
        url: $("#btnLogin").data("transsign"),
        data: JSON.stringify(data),
        contentType: 'application/json',
        success: function (data, e) {
            if (CallBack) {
                CallBack(data, $("#hdIsEdit").data("action"));
            }
        },
        error: function (xhr) {
            alert('Request Status: ' + xhr.status + ' Status Text: ' + xhr.statusText + ' ' + xhr.responseText);
        }
    });
}

var clear = function () {
    $("#hdIsEdit").val(false);
    clearAll();
};

var saveBloodDemand = function () {

    try {
        debugger
        var ListBloodDetailModel = [];
        if ($('#tbl-bloodItems > tbody > tr').length > 0) {
            $.each($('#tbl-bloodItems > tbody > tr'), function (index, val) {

                var id = $(this).prop('id');
                ListBloodDetailModel.push({
                    id: id,
                    Quantity: $($(val).find('.data_qty_' + id)).text(),
                    DemandQuantity: $($(val).find('td .data_demqty_' + id)).val(),
                    Remarks: $($(val).find('td .data_rem_' + id)).val()
                });
            });
        }

        var url = baseURL + 'Save';
        $('#preloader').show();
        ajaxWrapper.Post(url, JSON.stringify({ ipid: c.GetSelect2Id("#select2PIN"), bloodOrderId: $("#hdIsEdit").prop("bloodOrderId"), detail: ListBloodDetailModel }), function (x) {
            $('#preloader').hide();
            swal({
                title: $(".logo-mod-name").text(),
                text: x.Message,
                html: true, type: "info", showCancelButton: false, confirmButtonColor: "#DD6B55", confirmButtonText: "OK", closeOnConfirm: true
            }, function () {
                clear();
                ShowList();
            });
        });
    } catch (e) {
        $('#preloader').hide();
    }
}

var save = function () {
    var result = validate();
    if (!result.isValid) {
        return false;
    }
    try {
        $('#empid').val('');
        $('#emppw').val('');
        var empId = $("#hdIsEdit").data("userid");
        var empName = $("#hdIsEdit").data("username");
        c.ModalShow("#modalLogin", true);
        loadUsers();
        $("#empid").select2("data", { "id": empId, "text": empId + " - " + empName });
    } catch (e) {
    }
};

$('#btnClose').click(function (e) {
    c.ModalShow('#modalEntry', false);
});

$('#btnCloseLogin').click(function (e) {
    c.ModalShow('#modalLogin', false);
});

$("#btnLogin").click(function () {
    validateLogin();
});

$("#btnSave").on('click', save);

$("#btnRefresh").click(function () {
    ShowList();
});

$(document).on("click", "#gridList td", function (e) {
    var row = $("#gridList").DataTable().row($(this).closest('tr')).data();
    var bloodOrderId = row['ID'];
    var isCompleteOrder = row['Demand'];
    var isExtendCompleteOrder = row['ExtendStatus'];
    $("#hdIsEdit").val(true).prop("bloodOrderId", bloodOrderId).data("action", "save").data("iscomplorder", isCompleteOrder).data("isextcomplorder", isExtendCompleteOrder);
    disableControls(true);
    loadEditDetails(bloodOrderId);
    c.ModalShow('#modalEntry', true);
});

$(document).ready(function () {
    initialLoad();
});