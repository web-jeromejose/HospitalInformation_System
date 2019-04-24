var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblRequisitionList;
var tblRequisitionListId = '#gridListRequisition'
var tblRequisitionListDataRow;

var tblFindingsList;
var tblFindingsListId = '#gridtblSpecialty'
var tblFindingsListDataRow;
var OrderId;
var ProcedureId;
var RequestedId;


$(document).ready(function () {
    InitButton();
    InitDateTimePicker();
});


function InitButton() {
    var NoFunc = function () {
    };

    $('#btnProcess').click(function () {
        Process();
    });

    $('#btnSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);

    });


    $('#btnModify').click(function () {
        var YesFunc = function () {
            Action = 2;
            Save();
        };
        c.MessageBoxConfirm("Modify Entry?", "Are you sure you want to Modify the Entry?", YesFunc, null);

    });

    $('#btnReportGen').click(function () {
        $('#myModal').modal('show');
        PrintPreview();

    });
}


function InitDateTimePicker() {
    // Sample usage
    $('#dtMonth').datetimepicker({
        picktime: false,
        format: 'dd-mm-yyyy'
    }).on('dp.change', function (e) {
    //    c.SetDateTimePicker('#dtfrom', new Date(year, month, 1));
    });

}


function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}

function Process() {


    var entry;
    entry = []
    entry = {}
    entry.Action = 1;
    entry.MonthYear = c.GetDateTimePicker('#dtMonth');

    console.log(entry);
    $.ajax({
        url: $('#url').data("process"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

        },
        success: function (data) {

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                if (Action == 3) {

                }

                Action = 0;

            };

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {

            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

}

