var c = new Common();
var grid = new GridList('#gridListOfSurgery');

$(document).ready(function () {

    c.SetTitle("Surgery Record");
    c.DefaultSettings();

    ListOfSurgeryRecord();

    InitButton();

});
function InitButton() {
    $('#btnNew').click(function () {
        c.ModalShow('#modalEntry', true);
    });
    $('#btnClose').click(function () {
        c.ModalShow('#modalEntry', false);
    });

}


var ListOfSurgeryDataRow;
function ListOfSurgeryRecord() {

    grid.Url = baseURL + 'List';
    grid.setColumns([
        { targets: [0], data: "Id", className: '', visible: false, searchable: false, width: "0%" },
        { targets: [1], data: "SlNo", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [2], data: "PinName", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [3], data: "Name", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [4], data: "OTStartDateTimeD", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [5], data: "OTEndDateTimeD", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [6], data: "Operator", className: '', visible: true, searchable: true, width: "0%" },
        { targets: [7], data: "DateTimeD", className: '', visible: true, searchable: true, width: "0%" }
    ]);

    var rc = function (nRow, aData) {
        //        var value = aData['Name'];
        //        var $nRow = $(nRow);
        //        if (value === '') {
        //            $nRow.css({ "background-color": "#dff0d8" })
        //        }
        return nRow;
    };
    grid.setRowCallback(rc);

    grid.Display();

    $(document).on(grid.getId() + "_Selected", gridListOfSurgery_SelectedRow);

}
function gridListOfSurgery_SelectedRow(e) {
    ListOfSurgeryDataRow = e.DataRow;
}



