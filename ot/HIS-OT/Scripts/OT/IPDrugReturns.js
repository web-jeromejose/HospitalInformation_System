var c = new Common();
var TblGridList;
var TblGridListId = "#gridList";
var NEW_ORDER = "0";
var ACK_RETURN = "1";

function initialLoad() {
    ShowList();
    loadInitialValues();
    loadDataControlers();
}

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

function loadOrderNoList() {

    $('#select2OrderNo').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: baseURL + 'Select2GetOrders',
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    ipid: Number($('#select2PIN').val())
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }
        }
    }).change(function (e) {
        fetchDrugItemDetails();
    });
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
        fetchEditPatientDetails(list, loadOrderNoList);
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
        fetchEditPatientDetails(list);
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

function loadEditDetails(drugOrderId) {

    if (Number(drugOrderId) == 0) {
        return;
    }
    var url = baseURL + 'GetDrugReturn';
    ajaxWrapper.Get(url, { id: drugOrderId }, function (x) {
        fetchEditPatientDetails(x);
    });
}

function fetchDrugItemDetails() {

    var drugOrderId = $("#select2OrderNo").val();
    if (drugOrderId == undefined || drugOrderId == 0) {
        return;
    }
    ajaxWrapper.Get(baseURL + 'GetDrugs', { "orderId": drugOrderId }, function (data, e) {

        $("#tbl-drugItems").DataTable({
            destroy: true,
            paging: false,
            searching: false,
            ordering: true,
            info: false,
            data: data,
            columns: [
                { data: "ServiceID", visible: false },
                { data: "DrugName" },
                { data: "UnitName" },
                { data: "Quantity" },
                {
                    data: function (row, index) {

                        return "<input class='clsqty' type='number' value='0' />"
                    }
                },
                {
                    data: function (row, index) {

                        return "<input class='clsremark' type='text' value='' />"
                    }
                },
                { data: "Batchno" },
                { data: "BatchID", visible: false }
            ]
        });
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

function fetchEditPatientDetails(list, callback) {
    if ($("#hdIsEdit").val() == "true") {
        $("#txtOrderNo").val(list.CombineOrderNo);
        //c.SetSelect2('#select2OrderNo', list.DrugOrderId, list.DrugOrderNo);
        $("#select2OrderNo").val(list.DrugOrderNo);
        feedElements(list, enableDisableEditing(list));
    }
    else {
        feedElements(list, callback);
    }
}

function feedElements(list, callback) {
    $("#txtDateTime").val(c.MomentDDMMMYYYY(list.EntryDateTime == undefined ? Date() : list.EntryDateTime));
    c.SetSelect2('#select2PIN', list.IPID, list.PIN);
    c.SetSelect2('#select2Name', list.IPID, c.getCodeName(list.PIN, list.Name));
    c.SetSelect2('#select2Doctor', list.DoctorId, c.getCodeName(list.DoctorCode, list.DoctorName));
    c.SetValue('#txtBedNo', list.BedNo);
    c.SetValue('#txtAge', list.Age);
    c.SetValue('#txtGender', list.Sex);
    c.SetValue('#txtPackage', list.Package);
    c.SetValue('#txtCompany', list.CompanyName);
    c.SetValue('#txtBloodGroup', list.BloodGroup);
    if (typeof callback === "function") callback();
}

function enableDisableEditing(list) {
    c.ClearTable("#tbl-drugItems");
    $.each(list.DrugDetail, function (index, d) {
        $("#tbl-drugItems > tbody").append("<tr id=" + d.ServiceID + "><td>" + d.Drug + "</td><td>" + d.Units + "</td><td>" + d.Qty + "</td><td>" + d.RetQty + "</td><td>" + d.Remarks + "</td><td>" + d.BatchNo + "</td></tr>");
    });
}

function disableControlsAdd(isDisable) {
    c.DisableSelect2("#select2Doctor", isDisable);
}

function disableControls(isDisable) {
    c.DisableSelect2("#select2PIN", isDisable);
    c.DisableSelect2("#select2Name", isDisable);
    c.DisableSelect2("#select2Doctor", isDisable);
    c.Disable("#select2OrderNo", isDisable);
}

function disableControlsButton(mode) {
    if (mode == "NEW") {
        $("#btnSave").on('click', save);
        $("#btnCancel").off('click');
        $("#btnSave").show();
        $("#btnCancel").hide();
    }
    else if (mode == "EDIT") {
        $("#btnSave").off('click');
        $("#btnCancel").on('click', cancel);
        $("#btnSave").hide();
        $("#btnCancel").show();
        $("#select2OrderNo").select2('destroy');
    }
}

function clearAll() {
    c.ClearAllText();
    c.ClearAllTextArea();
    c.Select2ClearAll();
    c.InputSelect2ClearAll();
    c.ClearTable("#tbl-drugItems");
    loadInitialValues();
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
                if (row.Status == ACK_RETURN) {
                    colour = "label-warning";
                    status = "Acknowledge Returns";
                }
                else if (row.Status == NEW_ORDER) {
                    colour = "label-default";
                    status = "New Return";
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
        { targets: [7], data: "Bed", className: '', visible: true, searchable: true, width: "0%" }
    ]
    return cols;
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

function validate(isCancel) {
    var result = {
        isValid: false
    };

    if (c.IsEmptySelect2('#select2PIN')) {
        c.MessageBoxErr('Empty...', 'Please select a [PIN/Name]');
    }
    else if (c.IsEmptySelect2('#select2OrderNo') && !isCancel) {
        c.MessageBoxErr('Empty...', "Please select a [D/Order No]");
    }
    else if (c.IsEmptySelect2('#select2Doctor') && !isCancel) {
        c.MessageBoxErr('Empty...', "Please select a [Doctor]");
    }
    else if ($('#tbl-drugItems > tbody > tr').length == 0) {
        c.MessageBoxErr('Empty...', "There are'nt any valid items to return");
    }
    else {
        result.isValid = true;
        if (!isCancel) {
            var isQtyAvail = false;
            if (result.isValid && $('#tbl-drugItems > tbody > tr').length > 0) {
                $.each($('#tbl-drugItems > tbody > tr'), function () {
                    if ($(this).find('td .clsqty').val() > 0) {
                        isQtyAvail = true;
                    }
                });
            }
            if (!isQtyAvail) {
                result.isValid = false;
                c.MessageBoxErr('Empty...', "Please add valid [R/Qty]");
            }
        }
    }
    return result;
}

function validateLogin() {

    verifyCredentials(function (d, action) {
        if (d == $("#hdIsEdit").data("userid")) {
            if (action == "save") {
                saveDrugReturn();
            }
            else if (action == "cancel") {
                cancelDrugReturn();
            }
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

var cancelDrugReturn = function () {

    try {
        var url = baseURL + 'Cancel';
        $('#preloader').show();
        ajaxWrapper.Post(url, JSON.stringify({ drugReturnId: Number($("#hdIsEdit").attr("drugreturnid")) }), function (x) {
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

var saveDrugReturn = function () {

    try {
        var ListDrugDetailModel = [];
        if ($('#tbl-drugItems > tbody > tr').length > 0) {
            $.each($('#tbl-drugItems > tbody > tr'), function (index, val) {

                if (Number($(this).find('.clsqty').val()) > 0) {
                    var row = $("#tbl-drugItems").DataTable().row(this).data();
                    ListDrugDetailModel.push({
                        ServiceID: row.ServiceID,
                        BatchID: row.BatchID,
                        Quantity: $(this).find('.clsqty').val(),
                        Remarks: $(this).find('.clsremark').val()
                    });
                }
            });
        }
        var url = baseURL + 'Save';
        $('#preloader').show();
        ajaxWrapper.Post(url, JSON.stringify({ doctorId: Number(c.GetSelect2Id("#select2Doctor")), ipid: Number(c.GetSelect2Id("#select2PIN")), drugReturnId: Number($("#hdIsEdit").attr("drugreturnid")), drugOrderId: Number(c.GetSelect2Id("#select2OrderNo")), entry: ListDrugDetailModel }), function (x) {
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

var loginCredential = function () {
    $('#empid').val('');
    $('#emppw').val('');
    var empId = $("#hdIsEdit").data("userid");
    var empName = $("#hdIsEdit").data("username");
    c.ModalShow("#modalLogin", true);
    loadUsers();
    $("#empid").select2("data", { "id": empId, "text": empId + " - " + empName });
}

var clear = function () {
    $("#hdIsEdit").val(false);
    clearAll();
};

var cancel = function () {
    var result = validate(true);
    if (!result.isValid) {
        return false;
    }
    try {
        loginCredential();
    } catch (e) {

    }
}

var save = function () {
    var result = validate(false);
    if (!result.isValid) {
        return false;
    }
    try {
        loginCredential();
    } catch (e) {
    }
};

$('#btnNew').click(function (e) {
    clear();
    disableControls(false);
    disableControlsButton("NEW");
    $("#hdIsEdit").val(false).prop("drugreturnid", "0").data("action", "save");
    c.ModalShow('#modalEntry', true);
});

$('#btnClose').click(function (e) {
    c.ModalShow('#modalEntry', false);
});

$("#btnRefresh").click(function () {
    ShowList();
});

$("#btnLogin").click(function () {
    validateLogin();
});

$("#btnSave").on('click', save);

$("#btnCancel").on('click', cancel);

$(document).on("click", "#gridList td", function (e) {
    var row = $("#gridList").DataTable().row($(this).closest('tr')).data();
    var drugReturnId = row['ID'];
    $("#hdIsEdit").val(true).attr("drugReturnId", drugReturnId).data("action", "cancel");
    disableControls(true);
    disableControlsButton("EDIT");
    loadEditDetails(drugReturnId);
    c.ModalShow('#modalEntry', true);
});

$(document).ready(function () {
    initialLoad();
    disableControlsAdd(true);
});