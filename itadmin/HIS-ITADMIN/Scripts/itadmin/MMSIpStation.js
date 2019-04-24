var tblItemsListId = '#tblMMSIPStation'
var tblItemsList;
var tblItemsListDataRow;
var action = -1;
var c = new Common();

var setData = function (action) {
    var entry = {};
    if (action == 1) {
        entry = {
            Action: action,
            IPAddress: c.IsEmptyById('#IPAddress') ? $('#txtIpAddress').val() : $('#IPAddress').val(),
            StationId: c.IsEmptySelect2('#StationId') ? $('#select2Station').val() : $('#StationId').val(),
            LoginName: c.IsEmptyById('#LoginName') ? $('#txtLoginName').val() : $('#LoginName').val(),
            Location: c.IsEmptyById('#Location') ? $('#txtLocation').val() : $('#Location').val()
        }
    }
    else if (action == 2) {
        entry = {
            Action: action,
            IPAddress: $('#txtIpAddress').val(),
            OldStationId: $('#hdstationId').val(),
            StationId: $('#select2Station').val(),
            LoginName: $('#txtLoginName').val(),
            Location: $('#txtLocation').val()
        }
    }
    else if (action == 3) {
        entry = {
            Action: action,
            IPAddress: $('#txtIpAddress').val(),
            StationId: $('#select2Station').val()
        }
    }
    return entry;
};

var validate = function (data) {
    debugger;
    var isValid = false;
    if (data.Action == undefined || $.inArray(data.Action, [1, 2, 3]) == -1) {
        c.MessageBox("MMS IPStation", "Invalid Action", "info");
    }
    else {
        if (data.Action == 1 || data.Action == 2) {
            if (data.IPAddress == undefined || data.IPAddress == "") {
                c.MessageBox("MMS IPStation", "Invalid IP Address", function () {
                });
            }
            else if (data.StationId == undefined || data.StationId == "") {
                c.MessageBox("MMS IPStation", "Invalid StationId", function () {
                });
            }
            else if (data.LoginName == undefined || data.LoginName == "") {
                c.MessageBox("MMS IPStation", "Invalid LoginName", function () {
                });
            }
            else {
                isValid = true;
            }
        }
        if (data.Action == 3) {
            if (data.StationId == undefined || data.StationId == "") {
                c.MessageBox("MMS IPStation", "Invalid StationId", function () {
                });
            }
            else {
                isValid = true;
            }
        }
    }
    return isValid;
};

var clearForm = function () {
    action = -1;
    debugger
    //disableElements();
    $('#txtIpAddress').attr('disabled');
    $("#FormMMSIpStation input[type='hidden']").val("");
    $("#FormMMSIpStation input[type='text']").val("");
    $("#StationId").val(null).trigger("change");
    c.SetValue('#hdstationId', "");
    //Reload Datatable
    loadDataTable();
}

var saveMMSIpStation = function (action) {
    var data = setData(action);
    if (!validate(data)) {
        return;
    }
    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(data),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforesend: function () {
            //c.buttondisable('#btnservicesave', true);
        },
        success: function (data) {
            if (data.ErrorCode == 0) {
                c.MessageBoxErr("error...", data.Message);
                return;
            }
            c.MessageBox(data.Title, data.Message, function () {
                clearForm();
            });
        },
        error: function (xhr, desc, err) {
            // c.buttondisable('#btnservicesave', false);
            var errmsg = "error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("error...", errmsg, null);
        }
    });
};

var loadStations = function () {
    ajaxWrapper.Get($("#url").data("select2station"), null, function (result, e) {
        Sel2Client($("#StationId"), result, function (x) {
            $.each(result, function (index, itemData) {
                $("#StationId").prepend("<option value=" + itemData.id + ">" + itemData.name + "</option>");
            });
        });
    });
};

var bindListofItem = function (data) {
    tblItemsList = $(tblItemsListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: true,
        info: false,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: showListColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });
};

function showListColumns() {
    var cols = [
        { targets: [0], data: "IPAddr", className: '', visible: true, searchable: true, width: "10%" },
        { targets: [1], data: "StationName", className: '', visible: true, searchable: true, width: "10%" },
        { targets: [2], data: "LoginName", className: '', visible: true, searchable: true, width: "30%" },
        { targets: [3], data: "Location", className: '', visible: true, searchable: true, width: "30%" }
    ];
    return cols;
};

var loadDataTable = function () {
    var url = $('#url').data("getmmsipstationdt");
    $('#preloader').show();

    $.ajax({
        url: url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () { },
        success: function (data) {
            bindListofItem(data.list);
            $('#preloader').hide();
            //RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });
};

$('#btnDelete').click(function () {
    var YesFunc = function () {
        saveMMSIpStation(3);
    };
    c.MessageBoxConfirm("Delete Entry?", "Are you sure you want to Delete the Entry?", YesFunc, null);
});

$('#btnNew').click(function () {
    defaultEmpty();
    enableElements();
    action = 1;
    c.ModalShow('#modalEntry', true);
});

$(document).on("click", tblItemsListId + " td", function (e) {
    e.preventDefault();
    if (typeof $(this).closest("tr").find('td:eq(0)').html() != 'undefined') {
        var tr = $(this).closest('tr');
        tr.toggleClass('selected');
        tblItemsListDataRow = tblItemsList.row($(this).parents('tr')).data();
        var ipAddress = tblItemsListDataRow.IPAddr;
        var stationId = tblItemsListDataRow.StationId;
        //Action = 2;
        view(ipAddress, stationId);
    }
});

var view = function (ipAddress, stationId) {
    if (ipAddress == undefined || ipAddress == "") {
        return;
    }
    else if (stationId == undefined || stationId == "") {
        return;
    }
    var Url = $('#url').data("getmmsipstation");
    var param = {
        ipAddress: ipAddress,
        stationId: stationId
    };
    $('#preloader').show();
    //$('.Hide').hide();
    $.ajax({
        url: Url,
        data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () { },
        success: function (result) {
            $('#preloader').hide();
            $('.Show').show();
            var data = result.list;
            c.SetValue('#hdstationId', data.StationId);
            c.SetValue('#txtIpAddress', data.IPAddr);
            c.SetSelect2('#select2Station', data.StationId, data.StationName);
            c.SetValue('#txtLoginName', data.LoginName);
            c.SetValue('#txtLocation', data.Location);
            handleEnableButtons(2);
            c.ModalShow('#modalEntry', true);
        },
        error: function (xhr, desc, err) {
            $('#preloader').hide();

            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });
};

var handleEnableButtons = function (action) {
    // VAED
    if (action == 0) {
        $('.HideOnView').hide();
        $('.ShowOnView').show();
    }
    else if (action == 1) {
        $('.HideOnAdd').hide();
        $('.ShowOnAdd').show();
    }
    else if (action == 2) {
        $('.HideOnEdit').hide();
        $('.ShowOnEdit').show();
    }
    else if (action == 3) {
        $('.HideOnDelete').hide();
        $('.ShowOnDelete').show();
    }
    handleButtonNotUse();
};

var handleButtonNotUse = function () {
    $('.NotUse').hide();
};

var defaultEmpty = function () {
    c.SetValue('#hdstationId', '');
    c.SetValue('#txtIpAddress', '');
    c.SetSelect2('#Select2Station', '0', ' ');
    c.SetValue('#txtLoginName', '');
    c.SetValue('#txtLocation', '');
};

var enableElements = function () {
    c.Enable('#txtIpAddress');
}

var disableElements = function () {
    c.Disable('#txtIpAddress');
}

var defaultValues = function () {
    //c.SetSelect2('#Select2Station', '1', 'Vacant');
}

var InitSelect2 = function () {
    Sel2Server($("#select2Station"), $("#url").data("select2station"), function (d) {
    });
};

(function () {
    $("#IPAddress").inputmask();
    $("#txtIpAddress").inputmask();
    loadStations();
    loadDataTable();
    InitSelect2();
})();

$("#btnSave").click(function () {
    saveMMSIpStation(1);
});

$("#btnModify").click(function () {
    if (action == -1) {
        action = 2;
    }
    saveMMSIpStation(action);
});
