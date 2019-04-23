var dateFormatOnDisplay = "D MMM YYYY";
var dateFormatOnPost = "YYYY-MM-DD hh:mm:ss a";
var dateFormatOnDisplayWithTime = "D MMM YYYY hh:mm A";
var IncidentDateTime = moment().format(dateFormatOnDisplayWithTime);
var currentAction = 0;
var Id = "-1";
var pageSize = 20;

var select2IncidentTypeName = $('#select2IncidentTypeName');
var select2ControlNo = $('#select2ControlNo');
var select2IncidentCausedByName = $('#select2IncidentCausedByName');
var optionCausedDuetoMisUseName = $('#optionCausedDuetoMisUseName');
var select2CausedDuetoMisUseName = $('#select2CausedDuetoMisUseName');

$(document).ready(function () {
    Show();
    $('#select2ControlNo').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: '/SGHOT_FileDepartmentalIncidents/GetControlNo',
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
    });
    $('#select2IncidentCausedByName').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: '/Common/GetEmployee',
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
    });
    $("#select2IncidentTypeName").select2({
        data: [{ id: 1, text: 'Equipment' }, { id: 0, text: 'General'}],
        minimumResultsForSearch: -1
    });
    $("#select2CausedDuetoMisUseName").select2({
        data: [{ id: 1, text: 'Yes' }, { id: 0, text: 'No'}],
        minimumResultsForSearch: -1
    });

});

$(select2IncidentTypeName).change(function () {
    var id = $(select2IncidentTypeName).select2('data').id;
    var text = $(select2IncidentTypeName).select2('data').text;
    $('#IncidentTypeId').val(id);
    $('#IncidentTypeName').val(text);

    var enable = $(select2IncidentTypeName).val() === "1";
    $('#ItemName').prop('disabled', enable);
    $('#Extension').prop('disabled', enable);
    $('#select2ControlNo').select2("enable", enable);

    if (enable) {
        $('#ItemName').val('');
        $('#select2ControlNo').select2('open');
    }
    else {
        $('#select2ControlNo').select2('val', '');
        $('#EquipmentInfo').val('');
        $('#select2IncidentCausedByName').select2('open');
    }
});
$(select2ControlNo).change(function () {
    var id = $(select2ControlNo).select2('data').id;
    var text = $(select2ControlNo).select2('data').text;
    $('#ControlNoId').val(id);
    $('#ControlNo').val(text);
    ShowControlNo(id);
});
$(select2IncidentCausedByName).change(function () {
    var id = $(select2IncidentCausedByName).select2('data').id;
    var text = $(select2IncidentCausedByName).select2('data').text;
    $('#IncidentCausedById').val(id);
    $('#IncidentCausedByName').val(text);
});
$(optionCausedDuetoMisUseName).change(function () {
    var id = $(this).val();
    var text = $('#optionCausedDuetoMisUseName option:selected').html();
    $('#CausedDuetoMisUseId').val(id);
    $('#CausedDuetoMisUseName').val(text);
});
$(select2CausedDuetoMisUseName).change(function () {
    var id = $(select2CausedDuetoMisUseName).select2('data').id;
    var text = $(select2CausedDuetoMisUseName).select2('data').text;
    $('#CausedDuetoMisUseId').val(id);
    $('#CausedDuetoMisUseName').val(text);
});
$('#btnClear').click(function () {
    ClearAllEntries();
});
$('#btnSave').click(function () {
    var f = $("#formEntry");
    var url = f.attr("action");
    var formData = f.serialize();
    $.post(url, formData, function (data) {
        if (data) {
            alert("Successfully saved...");
            $('#myModal').modal('hide');
        }
        else alert('There was an error during saving.');
    });
});

function Show() {
    currentAction = $("#Action").val();
    Id = $("#Id").val();

    ClearAllEntries();

    if (Id === "-100") {
        ShowModal();
        return;
    }

    var url = "/SGHOT_FileDepartmentalIncidents/Fetch";
    $.getJSON(url, { pId: Id }, function (data) {
        $("#Action").val(data.Action);
        $("#Id").val(data.Id);
        $("#StationId").val(data.StationId);
        $("#StationName").val(data.StationName);
        $("#IncidentTypeId").val(data.IncidentTypeId);
        $("#IncidentTypeName").val(data.IncidentTypeName);
        $('#select2IncidentTypeName').select2('data', { id: data.IncidentTypeId, text: data.IncidentTypeName });
        $("#ControlNoId").val(data.ControlNoId);
        $("#ControlNo").val(data.ControlNo);
        $('#select2ControlNo').select2('data', { id: data.ControlNoId, text: data.ControlNo });
        $("#IncidentCausedById").val(data.IncidentCausedById);
        $("#IncidentCausedByName").val(data.IncidentCausedByName);
        $('#select2IncidentCausedByName').select2('data', { id: data.IncidentCausedById, text: data.IncidentCausedByName });

        var EquipmentInfo = "Name: " + data.EquipmentName + "\n\n" +
                        "Manufacturer: " + data.EquipmentManufacturer + "\n\n" +
                        "ModelNo: " + data.EquipmentModelNo + "\n" +
                        "SerialNo: " + data.EquipmentSerialNumber;
        $('#EquipmentInfo').val(EquipmentInfo);

        $('#IncidentNo').val(data.IncidentNo);
        $('#CausedDuetoMisUseId').val(data.CausedDuetoMisUseId);
        $('#CausedDuetoMisUseName').val(data.CausedDuetoMisUseName);
        $('#select2CausedDuetoMisUseName').select2('data', { id: data.CausedDuetoMisUseId, text: data.CausedDuetoMisUseName });
        $('#ItemName').val(data.ItemName);
        $('#IncidentDateTime').val(moment(data.IncidentDatetime).format(dateFormatOnDisplayWithTime));
        $('#ReasonRemarks').val(data.ReasonRemarks);
        $('#Extension').val(data.Extension);

        ShowModal();

    });
}; 
function ShowModal() {
    $('#myModal').on('shown.bs.modal', function () {
        HandleEnableEntries();
        $('#select2IncidentTypeName').focus();
        $('#preloader').hide();
    }).on('hidden.bs.modal', function () {
        $('#select2-drop').css('display', 'none');
    }).modal('show');
}
function ClearAllEntries() {
    $("#Action").val('');
    $("#Id").val('');
    $("#StationId").val('');
    $("#StationName").val('');
    $("#IncidentTypeId").val('');
    $("#IncidentTypeName").val('');
    $('#select2IncidentTypeName').select2('val', '');
    $("#ControlNoId").val('');
    $("#ControlNo").val('');
    $('#select2ControlNo').select2('val','');
    $("#IncidentCausedById").val('');
    $("#IncidentCausedByName").val('');
    $('#select2IncidentCausedByName').select2('val', '');
    $('#EquipmentInfo').val('');
    $('#IncidentNo').val('');
    $('#CausedDuetoMisUseId').val('');
    $('#CausedDuetoMisUseName').val('');
    $('#select2CausedDuetoMisUseName').select2('val', '');
    $('#ItemName').val('');
    $('#IncidentDateTime').val('');
    $('#ReasonRemarks').val('');
    $('#Extension').val('');
}
function DefaultDisable() {
    $('#StationName').prop('disabled', true);
    $('#select2ControlNo').select2('enable', false);
    $('#EquipmentInfo').prop('disabled', true);
    $('#IncidentNo').prop('disabled', true);
}
function HandleEnableEntries() {
    DefaultDisable();
}
function ShowControlNo(pId) {
    var url = "/SGHOT_FileDepartmentalIncidents/FetchDepartmentalIncidentControlNo";
    $.getJSON(url, { pId: pId }, function (data) {
        var EquipmentInfo = "Name: " + data.EquipmentName + "\n\n" +
                        "Manufacturer: " + data.Manufacturer + "\n\n" +
                        "ModelNo: " + data.ModelNo + "\n" +
                        "SerialNo: " + data.SerialNo;

        $('#EquipmentInfo').val(EquipmentInfo);
    });
}




 