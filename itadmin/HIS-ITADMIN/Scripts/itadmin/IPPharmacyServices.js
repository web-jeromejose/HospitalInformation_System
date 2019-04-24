var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridIPPharmacy'
var tblItemsListDataRow;


//var tblItemsMapListId = '#gridItemCodeMap'
//var tblItemsMapListDataRow;


$(document).ready(function () {
    SetupSelectedMarkup();
    //SetupSelectedMarkup();
    InitButton();
    IPPharmacyConnection();
    //ShowRangeMax();
    //InitDateTimePicker();
    //InitSelect2();
 
    InitDataTables();

    RedrawGrid();
    
});
    


function InitDataTables() {
    //BindSequence([]);
    BindIPPharmacy([]);
    //BindMapListofItem([]);
}

function InitSelect2() {
    // Sample usage

}

function InitButton() {
    var NoFunc = function () {
    };
    // Sample usage
    //$('#btnProcess').click(function () {
    
    //    var RegNo = c.GetValue('#txtRegno');
    //    if (RegNo == '') {
    //       RegNo = -1
    //    } 
    //    var FromDate = c.GetDateTimePickerDate('#dtFrom');
    //    var ToDate = c.GetDateTimePickerDate('#dtTo');
    //    Requisitionlist(RegNo, FromDate, ToDate);
    //});

    $('#btnProcess').click(function () {

        var YesFunc = function () {
            Action = 1;
            Process();
        };
        c.MessageBoxConfirm("Mapping Code Entry?", "Are you sure you want to Map NewCode?", YesFunc, null);
        //c.ModalShow('#modalEntry', true);
     
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
        
        //  print_preview();

        $('#myModal').modal('show');
        PrintPreview();

    });


    //$('#btnAddScientificAchievement').click(function () {
    //    var ctr = $(tblScientificAchievementListId).DataTable().rows().nodes().length + 1;
    //    tblScientificAchievement.row.add({
    //        "SNo": ctr,
    //        "ScientificAchievement": "",
    //        "TransAchievementYear": "",
    //        "Awards": "",
    //        "Remarks": "",
    //        "EmpId": Action == 1 ? "" : GetID,
    //        "AchievementYear": ""
    //    }).draw();
    //    InitSelectedScientificAchievement();
    //});
}

function Momentdatetime(value) {
    return moment().format('l h:mm:ss A');
}


//--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

function BindIPPharmacy(data) {

    tblItemsList = $(tblItemsListId).DataTable({
        data: data,
        cache: false,
        destroy: true,
        paging: false,
        searching: true,
        ordering: false,
        info: false,
        bAutoWidth: false,
        dom: 'Rlfrtip',
        scrollY: 400,
        scrollX: true,
        fixedHeader: true,
        columns: ShowIPPharmacyColumns(),
        fnRowCallback: ShowIPPharmacyCallBack()
    });

    InitSelectedPharmacyMarkUp();
}

function ShowIPPharmacyCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['selected'];
        var $nRow = $(nRow);

        if (aData.selected.length != 1) {
            $('#chkselected', nRow).prop('checked', aData.selected === 1);
        }
        //var value = aData['Price'];
        //var $nRow = $(nRow);

        ////WardDemand
        //if (value == '') {
        //    $nRow.css({ "background-color": "#d7ffea" })
        //}
            //ISSUED
        //else if (value == 1) {
        //    $nRow.css({ "background-color": "#d7ffea" })
        //}
        //    //Partial Issues
        //else if (value == 3) {
        //    $nRow.css({ "background-color": "#f5b044" })
        //}

    };
    return rc;

}

function ShowIPPharmacyColumns() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected"/>' },
      { targets: [1], data: "BedType", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [2], data: "CurrentMarkUp", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [3], data: "NewMarkUp", className: 'ClassNewMarkup', visible: true, searchable: true, width: "5%" },
      { targets: [4], data: "Id", className: '', visible: false, searchable: false}
    
    ];
    return cols;
}

function IPPharmacyConnection() {

    var Url = $('#url').data("getippharmcy");

    $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");

    $.ajax({
        url: Url,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {

            BindIPPharmacy(data.list);
            $('#preloader').hide();
            RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
            //$('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}

function SetupSelectedMarkup() {

    $.editable.addInputType('txtNewMarkup', {
        element: function (settings, original) {

            var input = $('<input id="txtNewMarkup" style="width:100%; height:30px; margin:0px, padding:0px;" type="text" class="form-control ">');
            $(this).append(input);

            return (input);

        },

        plugin: function (settings, original) {
            //$(this).find('input').inputmask("decimal", { radixPoint: ".", autoGroup: true, groupSize: 3, digits: 2 });
        }
    });



}

function InitSelectedPharmacyMarkUp() {

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------
    $('.ClassNewMarkup', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        tblItemsList.cell(cell.row, 3).data(sVal);


        return sVal;
    },
    {
        "type": 'txtNewMarkup', "style": 'display: inline;', "onblur": 'submit', "onreset": function () { setTimeout(function () { keys.block = false; }, 0); },
        "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
    });

    //----------------------------------------------------------------------------------------------------------------------------------------------------------------

    // Resize all rows.
    $(tblItemsListId + ' tr').addClass('trclass');

}



function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();
    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}


//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Validated() {

    var ret = false;

    //ret = c.IsEmpty('#txtHomeAdress');

    //if (ret) {
    //    c.MessageBoxErr('Y/N...', 'Please input Y for YES and N for NO');
    //    return false;
    //}







    return true;

}

function Save() {

    var ret = Validated();
    if (!ret) return ret;

    var entry;
    entry = []
    entry = {}
    entry.Action = 1;
    //entry.CashMarkUpDefault = $('#txtMarkUp').val();
    entry.IPPharmacyDetailsSave = [];
    var rowcollection = tblItemsList.$("#chkselected:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsList.row(tr);
        var rowdata = row.data();

        entry.IPPharmacyDetailsSave.push({
            BedTypeId: rowdata.Id,
            MarkupPer: rowdata.NewMarkUp
           
            
        });
    });


    console.log(entry);
    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

            c.ButtonDisable('#btnSave', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
            //c.ButtonDisable('#btnModify', false);
            c.ButtonDisable('#btnSave', false);

            if (data.ErrorCode == 0) {
                c.MessageBoxErr("Error...", data.Message);
                return;
            }

            var OkFunc = function () {

                if (Action == 3) {
                    //                    tblScientificAchievement.row('tr.selected').remove().draw(false);
                    //                    tblTrainingDetails.row('tr.selected').remove().draw(false);
                    //tblFamilyDetails.row('tr.selected').remove().draw(false);
                    //                    tblRelationShipDetails.row('tr.selected').remove().draw(false);
                    //                    tblPreviousExpDetails.row('tr.selected').remove().draw(false);
                    //                    tblQualificationDetails.row('tr.selected').remove().draw(false);
                }

                Action = 0;
                //HandleEnableButtons();
                //HandleEnableEntries();
                IPPharmacyConnection();
            };

            c.MessageBox(data.Title, data.Message, OkFunc);
        },
        error: function (xhr, desc, err) {
            c.ButtonDisable('#btnSave', false);
            var errMsg = "Error in posting the data." + "<br>" + err + "<br>" + desc;
            c.MessageBox("Error...", errMsg, null);
        }
    });

    return ret;
}
