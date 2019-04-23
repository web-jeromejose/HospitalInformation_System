var momentDateTimeFormat = "DD-MMM-YYYY HH:mm A";
var dateFormatOnDisplay = "D-MMM-YYYY";
var dateFormatOnPost = "YYYY-MM-DD hh:mm:ss a";
var optionSet1;
var to = moment().format(dateFormatOnPost);
var from = moment().subtract(29, 'days').format(dateFormatOnPost);
var reportrangeIsSubmitted = false;
var selectedId = "";
var pageSize = 20;
var Action = 1;

var headercaptionId = $('#header-caption');
var headercaption = $(headercaptionId).html();
$(headercaptionId).html(headercaption + " - Departmental Incidents");


$(document).ready(function () {

    InitDateRangePicker();
    InitButton();
    InitSelect2();
    InitDateTimePicker();
    InitModal();

    Display('', '');

    DefaultDisable();
    DefaultValues();

    $(document).on("click", "#grid" + " td", function () {
        if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
            var tr = $(this).closest('tr');

            if (tr.hasClass('selected')) {
                tr.removeClass('selected');
            }
            else {
                $('tr.selected').removeClass('selected');
                tr.addClass('selected');
            }
            selectedId = tbl.row($(this).parents('tr')).data();

        }
    });

});

function InitDateRangePicker() {

}
function InitButton() {
    $("#btnDisplay").click(function () {
        var from = GetDateTimePicker('#dtFrom').format(momentDateTimeFormat);
        var to = GetDateTimePicker('#dtTo').format(momentDateTimeFormat);
        Display(from, to);
    });
    $("#btnFilter").click(function () {
        ModalShow('#modalFilter', true);
    });
    $("#btnNew").click(function () {
        this.Action = 1;
        ClearEntries();
        SetValue('#Action', '1');
        ModalShow('#modalEntry', true);
    });
    $("#btnRefresh").click(function () {
    });
    $("#btnEdit").click(function () {
        if (selectedId.ID == "") {
            return;
        }
        SetValue('#Action', '2');
        ViewEntry(selectedId.ID);
    });
    $('#btnSave').click(function () {
        SaveEntry();
    });

}
function InitSelect2() {
    $("#select2IncidentType").select2({
        data: [{ id: 1, text: 'Equipment' }, { id: 0, text: 'General'}],
        minimumResultsForSearch: -1
    }).change(function () {
        var id = GetSelect2Id('#select2IncidentType');
        if (id == "0") {
            DisableSelect2('#select2ControlNo')
            SetSelect2('#select2ControlNo', '', '');
            SetValue('#txtEquipmentInfo', '');
            Enable('#txtExtension');
            Enable('#txtItemName');
        } else {
            EnableSelect2('#select2ControlNo');
            FocusSelect2('#select2ControlNo');
            Disable('#txtExtension');
            Disable('#txtItemName');
            SetValue('#txtItemName', '');
        }
    });
    $("#select2IncidentDueToMisUsed").select2({
        data: [{ id: 1, text: 'Yes' }, { id: 0, text: 'No'}],
        minimumResultsForSearch: -1
    });
    $('#select2ControlNo').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            cache: false,
            quietMillis: 150,
            url: baseURL + 'GetControlNo',
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
    }).change(function () {
        var id = GetSelect2Id('#select2ControlNo');
        $.ajax({
            url: baseURL + 'FetchControlNo',
            data: { "pid": id },
            type: 'get',
            contentType: 'application/json; charset=utf-8',
            dataType: 'json',
            cache: false,
            beforeSend: function () {

            },
            success: function (data) {
                var EquipmentInfo = "Name: " + data[0].EquipmentName + "\n" +
                        "Manufacturer: " + data[0].Manufacturer + "\n" +
                        "ModelNo: " + data[0].ModelNo + "\n" +
                        "SerialNo: " + data[0].SerialNo;
                SetValue('#txtEquipmentInfo', EquipmentInfo);
                FocusSelect2('#select2IncidentCausedBy');
            },
            error: function (xhr, desc, err) {
                var errMsg = err + "<br>" + desc;
                MessageBox(1, "Error...", errMsg);
            }
        });
    });
    $("#select2IncidentCausedBy").select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            cache: false,
            quietMillis: 150,
            url: baseURL + 'GetEmployee',
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
    }).change(function () {

    });
}
function InitDateTimePicker() {
    $('#dtIncidentDateTime').datetimepicker({
        pickTime: true,
        defaultDate: moment()
    });
    $('#dtFrom').datetimepicker({
        pickTime: true,
        defaultDate: moment()
    });
    $('#dtTo').datetimepicker({
        pickTime: true,
        defaultDate: moment()
    });


}
function InitModal() {
    $('.modal').modal({
        show: false,
        keyboard: false,
        backdrop: 'static'
    }).on('hidden.bs.modal', function () {
        $('#select2-drop').css('display', 'none');
    });
}

function ClearEntries() {
    SetValue('#txtStationName', '');
    SetSelect2('#select2ControlNo', '', '');
    SetSelect2('#select2IncidentCausedBy', '', '');
    SetValue('#txtEquipmentInfo', '');
    SetValue('#txtIncidentNo', '');
    SetSelect2('#select2IncidentDueToMisUsed', '0', 'No');
    SetValue('#txtItemName', '');
    SetDateTimePicker('#dtIncidentDateTime', moment());
    SetValue('#txtReasonRemarks', '');
    SetValue('#txtExtension', '');
}
function DefaultDisable() {
    Disable('#txtStationName');
    Disable('#txtIncidentNo');
    DisableSelect2('#select2ControlNo');
}
function DefaultValues() {
    SetSelect2('#select2IncidentType', '0', 'General');
    SetSelect2('#select2IncidentDueToMisUsed', '0', 'No');    
    SetDateTimePicker('#dtFrom', moment().startOf('month'));
    SetDateTimePicker('#dtTo', moment().endOf('month'));
}
function SaveEntry() {
    var jsonEntry = [];
    jsonEntry = {};
    jsonEntry.Action = GetValue('#Action');
    jsonEntry.Id = GetValue('#Id');
    jsonEntry.StationId = "";
    jsonEntry.StationName = "";
    jsonEntry.IncidentTypeId = GetSelect2Id('#select2IncidentType');
    jsonEntry.IncidentTypeName = GetSelect2Text('#select2IncidentType');
    jsonEntry.ControlNoId = GetSelect2Id('#select2ControlNo');
    jsonEntry.ControlNo = GetSelect2Text('#select2ControlNo');
    jsonEntry.IncidentCausedById = GetSelect2Id('#select2IncidentCausedBy');
    jsonEntry.IncidentCausedByName = GetSelect2Text('#select2IncidentCausedBy');
    jsonEntry.CausedDuetoMisUseId = GetSelect2Id('#select2IncidentDueToMisUsed');
    jsonEntry.CausedDuetoMisUseName = GetSelect2Text('#select2IncidentDueToMisUsed');
    jsonEntry.ItemName = GetValue('#txtItemName');
    jsonEntry.IncidentDatetime = GetDateTimePicker('#dtIncidentDateTime');
    jsonEntry.ReasonRemarks = GetValue('#txtReasonRemarks');
    jsonEntry.Extension = GetValue('#txtExtension');

    $.ajax({
        url: baseURL + 'Save',
        data: JSON.stringify(jsonEntry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {
            ButtonDisable('#btnSave', true);
        },
        success: function (data) {
            ButtonDisable('#btnSave', false);
            ClearEntries();
            var YesFunc = null;
            var NoFunc = function () {
                $("#btnRefresh").click();
                ModalShow('#modalEntry', false);
            };
            if (data.ErrorCode != "-1") {
                MessageBoxConfirm(data.Title, data.Message + "<br>Create a new entry?", YesFunc, NoFunc);
            }
            else {
                MessageBox(data.Title, data.Message, null);
            }
        },
        error: function (xhr, desc, err) {
            ButtonDisable('#btnSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            MessageBox("Error...", errMsg, null);
        }
    });

}
function ViewEntry(id) {
    ClearEntries();
    $.ajax({
        url: baseURL + 'Fetch',
        data: { "pid": id },
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {
            ButtonDisable('#btnEdit', true);
        },
        success: function (data) {
            ButtonDisable('#btnEdit', false);
            SetValue('#Id', data[0].Id);
            SetValue('#StationId', data[0].StationId);
            SetValue('#txtStationName', data[0].StationName);
            SetValue('#txtIncidentNo', data[0].Id);
            SetSelect2('#select2IncidentType', data[0].IncidentTypeId, data[0].IncidentTypeName);
            SetSelect2('#select2IncidentDueToMisUsed', data[0].CausedDuetoMisUseId, data[0].CausedDuetoMisUseName);
            SetSelect2('#select2ControlNo', data[0].ControlNoId, data[0].ControlNo);
            SetValue('#txtItemName', data[0].ItemName);
            SetSelect2('#select2IncidentCausedBy', data[0].IncidentCausedById, data[0].IncidentCausedByName);
            SetDateTimePicker('#dtIncidentDateTime', moment(data[0].IncidentDatetime).format(momentDateTimeFormat));

            var EquipmentInfo = "Name: " + data[0].EquipmentName + "\n" +
                    "Manufacturer: " + data[0].EquipmentManufacturer + "\n" +
                    "ModelNo: " + data[0].EquipmentModelNo + "\n" +
                    "SerialNo: " + data[0].EquipmentSerialNumber;

            if (data[0].ControlNo.length > 0) SetValue('#txtEquipmentInfo', EquipmentInfo);

            SetValue('#txtReasonRemarks', data[0].ReasonRemarks);
            SetValue('#txtExtension', data[0].Extension);
            ModalShow('#modalEntry', true);
        },
        error: function (xhr, desc, err) {
            ButtonDisable('#btnEdit', false);
            var errMsg = err + "<br>" + desc;
            MessageBox(1, "Error...", errMsg);
        }
    });
};


var grid;
var editor;
var ajaxWrapper = $.ajaxWrapper();
var tblList
function Display(pFrom, pTo) {
    showindicator.Body();

    var url = baseURL + 'List';

    if (pFrom.length == 0) pFrom = moment().startOf('month').format(momentDateTimeFormat);
    if (pTo.length == 0) pTo = moment().endOf('month').format(momentDateTimeFormat);

    var filter = { pFrom: pFrom, pTo: pTo };

    $.ajax({
        url: url,
        data: filter,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {
            tbl = $("#grid").DataTable({
                destroy: true,
                paging: true,
                searching: true,
                ordering: false,
                info: false,
                data: data,
                columns: [
                { targets: [0], data: "ID", className: '', visible: false, searchable: false, width: "0%" },
                { targets: [1], data: "SNo", className: '', visible: true, searchable: true, width: "0%" },
                { targets: [2], data: "GeneralItemName", className: '', visible: true, searchable: true, width: "0%" },
                { targets: [3], data: "CausedByEmp", className: '', visible: true, searchable: true, width: "0%" },
                { targets: [4], data: "IncidentDatetime", className: '', visible: true, searchable: true, width: "0%" },
                { targets: [5], data: "CausedDuetoMisUse", className: '', visible: true, searchable: true, width: "0%" },
                { targets: [6], data: "RemarksByUser", className: '', visible: true, searchable: true, width: "0%" },
                { targets: [7], data: "EXTN", className: '', visible: true, searchable: true, width: "0%" },
                { targets: [8], data: "ControlNumber", className: '', visible: false, searchable: true, width: "0%" },
                { targets: [9], data: "IncidentType", className: '', visible: false, searchable: true, width: "0%" },

            ],
            fnRowCallback: function (nRow, aData) {
                var id = aData["IncidentType"];
                var $nRow = $(nRow); // cache the row wrapped up in jQuery
                if (id == "1") { // equipment
                    $nRow.css({ "background-color": "#ffc0c0" })
                }
                else if (id == "0") { // General
                    $nRow.css({ "background-color": "#c0c0ff" })
                }
                return nRow
            }
            });
            ModalShow('#modalFilter', false);
            showindicator.Stop();
        },
        error: function (xhr, desc, err) {
            showindicator.Stop();
            var errMsg = err + "<br>" + desc;
            MessageBox(1, "Error...", errMsg);
        }
    });

}







function Enable(o) {
    $(o).prop('disabled', false);
}
function EnableSelect2(o) {
    $(o).select2('enable');
}
function EnableDateTimePicker(o) {
    $(o).data("DateTimePicker").enable();
}
function Disable(o) {
    $(o).prop('disabled', true);
}
function DisableSelect2(o) {
    $(o).select2('disable');
}
function DisableDateTimePicker(o) {
    $(o).data("DateTimePicker").disable();
}
function ClearInput(o) {
    return SetValue(o, "");
}
function ClearSelect2(o) {
    $(o).select2('data', { id: "", text: "" });
}
function SetValue(o, value) {
    try {
        return $(o).val(value);
    } catch (err) {
        return "";
    }
}
function SetDateTimePicker(o, value) {
    $(o).data("DateTimePicker").setDate(value);
}
function SetSelect2(o, valueId, valueText) {
    $(o).select2("data", { id: valueId, text: valueText });
}
function GetValue(o) {
    try {
        return $(o).val();
    } catch (err) {
        return "";
    }
}
function GetSelect2Id(o) {
    try {
        return $(o).select2('data').id;
    } catch (err) {
        return "0";
    }
}
function GetSelect2Text(o) {
    try {
        return $(o).select2('data').text;
    } catch (err) {
        return "";
    }
}
function GetDateTimePicker(o) {
    return $(o).data("DateTimePicker").getDate();
}
function GetICheck(o) {
    var id = o + ':checked';
    return $(id).val();
}
function FocusSelect2(o) {
    $(o).select2('open');
}
function MomentDDMMMYYYY(value) {
    return moment(value).format('DD-MMM-YYYY');
}
function MessageBox(Title, Message, OkFunc) {
    bootbox.dialog({
        message: Message,
        title: Title,
        buttons: {
            Ok: {
                label: "Ok",
                className: "btn-success",
                callback: OkFunc
            }
        }
    }).find("div.modal-dialog").addClass("bootbox-top");
}
function MessageBoxConfirm(Title, Message, YesFunc, NoFunc) {
    bootbox.dialog({
        message: Message,
        title: Title,
        buttons: {
            Yes: {
                label: "Yes",
                className: "btn-success",
                callback: YesFunc
            },
            No: {
                label: "No",
                className: "btn-primary",
                callback: NoFunc
            }
        }
    }).find("div.modal-dialog").addClass("bootbox-top");
}
function ModalShow(o, flag) {
    if (flag) $(o).modal('show');
    else $(o).modal('hide');
}
function ButtonDisable(o, flag) {
    $(o).prop("disabled", flag);
}
