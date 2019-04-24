var c = new Common();
var Action = -1;

var Select2IsClicked = false;

var tblItemsList;
var tblItemsListId = '#gridtransactiondetails'
var tblItemsListDataRow;

//var tblOPItemsList;
//var tblOPItemsListId = '#gridOPService'
//var tblOPItemsListDataRow;

$(document).on('shown.bs.tab', 'a[data-toggle="tab"]', function (e) {
    // For future use... Get the active tab.
    var tabNameSelected = $('.nav-tabs .active').text();
    //if (tabNameSelected == $('.nav-tabs .active').text());
    //{
    //       RedrawGrid();
    //}

    RedrawGrid();

})

$(document).ready(function () {

    InitButton();
    //InitDateTimePicker();
    InitSelect2();
    DefaultValues();
    DefaultDisable();
    //CopyOPTariffDashBoardConnection();
    InitDataTables();
   // SetupSelec2Sample();
    RedrawGrid();
});
    
function RedrawGrid() {
    // TblGridSequence.columns.adjust().draw();

    //if (tblItemsList !== undefined) tblItemsList.columns.adjust().draw();
    //if (tblOPItemsList !== undefined) tblOPItemsList.columns.adjust().draw();
  
    //if (TblGridQuantityAvailable !== undefined) TblGridQuantityAvailable.columns.adjust().draw();
    //if (TblGridIssueingQuantity !== undefined) TblGridIssueingQuantity.columns.adjust().draw();
    //if (TblGridPrevResults !== undefined) TblGridPrevResults.columns.adjust().draw();
}


function InitDataTables() {
    //BindSequence([]);
    BindListofItem([]);
    //BindOPListofItem([]);
}

function InitSelect2() {
    // Sample usage


    $('#Select2Company').select2({
        minimumInputLength: 0,
        allowClear: true,
        ajax: {
            quietMillis: 150,
            url: $("#url").data("getadmdate"),
            dataType: 'jsonp',
            cache: false,
            data: function (term, page) {
                return {
                    pageSize: pageSize,
                    pageNum: page,
                    searchTerm: term,
                    id: $('#txtPin').val()//c.GetValue('#txtPin')
                   
                };
            },
            results: function (data, page) {
                var more = (page * pageSize) < data.Total;
                return { results: data.Results, more: more };
            }

        }
    }).change(function (e) {
        //var list = e.added.list;
        //var IPID = c.GetSelect2Id('#Select2AdmnDate');
        //TransactionDashBoardConnection(Id);
        //View(IPID);
    });

    Sel2Server($("#Select2Company"), $("#url").data(""), function (d) {
        //alert(d.tariffid);
        var Cancelid = (d.id);
        //var tarrifId = (d.tariffid);

    });

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
        Process();
    });

    $('#btnSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            Save();
        };
        c.MessageBoxConfirm("Save Entry?", "Are you sure you want to Add the Entry?", YesFunc, null);
      
    });

    $('#btnOPSave').click(function () {
        var YesFunc = function () {
            Action = 1;
            SaveOP();
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

    
    $(document).keypress(function (e) {
        if (e.which == 13) {
            var IPID = c.GetValue('#txtPin');
            View(IPID);
           
        }   
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

function DefaultValues() {

    c.SetValue('#txtPin', '');
    c.SetValue('#txtPatientName', '');
    c.SetValue('#txtBedNo', '');
    c.SetValue('#txtadmitdatetime', '');
    InitDataTables();
    //c.SetValue('#txtCompanyCode', '');
    c.SetSelect2('#Select2Company', '0', ' ');
    //c.SetSelect2('#select2Category', '1', 'CASH PATIENT ACCOUNT');


}

function DefaultDisable() {

    c.DisableSelect2('#Select2Company', true);
    c.Disable('#txtBedNo', true);
    c.Disable('#txtPatientName', true);
    c.Disable('#txtadmitdatetime', true);



}
//-----------------IP Services--List-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


function BindListofItem(data) {

    tblItemsList = $(tblItemsListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: true,
        ordering: false,
        searching: true,
        info: true,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowListColumns(),
        fnRowCallback: ShowListCallBack()
    });

  //  InitSelec2ChangeType();
}

function ShowListColumns() {
    var cols = [
      { targets: [0], data: "DepartmentName", className: '', visible: true, searchable: true, searchable: true, width: "10%" },
      { targets: [1], data: "OrderID", className: '', visible: true, searchable: true, width: "5%" },
      { targets: [2], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselected" id="chkselected"/>' },
      { targets: [3], data: "DateTime", className: '', visible: true, searchable: false, width: "10%" },
      { targets: [4], data: "StationName", className: '', visible: true, searchable: false, width: "5%", colspan:"5"},
      { targets: [5], data: "Name", className: '', visible: true, searchable: true, width: "20%" },
      { targets: [6], data: "DisPatchQuantity", className: '', visible: true, searchable: false, width: "1%" },
      { targets: [7], data: "Unit", className: '', visible: true, searchable: false, width: "5%" },
      { targets: [8], data: "SerialNo", className: '', visible: true, searchable: false, width: "5%" },
      { targets: [9], data: "Operator", className: '', visible: true, searchable: false, width: "15%" },
      { targets: [10], data: "Status", className: '', visible: true, searchable: false, width: "5%" },
      { targets: [11], data: "id", className: '', visible: false, searchable: false },
      { targets: [12], data: "serviceid", className: '', visible: false, searchable: false},
      { targets: [13], data: "stationId", className: '', visible: false, searchable: false },
      { targets: [14], data: "groupId", className: '', visible: false, searchable: false }
    ];
    return cols;

}

function ShowListCallBack() {
    var rc = function (nRow, aData) {
        var value = aData['selected'];
        var group = aData['groupId'];
        var $nRow = $(nRow);

        if (aData.selected.length != 1) {
            $('#chkselected', nRow).prop('checked', aData.selected === 1);
            if (aData.selected === 1) {
                $('#chkselected', nRow).prop("disabled", "disabled");
            }
        }

        //if (aData.selected.length != 1) {
        //    $('#chkselected', nRow).prop('checked', aData.selected === 1);
        //    if (aData.selected === 1) {
        //        $('#chkselected', nRow).prop("disabled", "disabled");
        //    }
        //}
        //var value = aData['Price'];
        //var $nRow = $(nRow);

        //CatORder
        if (group == 1) {
            $nRow.css({ "background-color": "#ffff5e" })
        }
        //RequestedTest
        if (group == 2) {
            $nRow.css({ "background-color": "#CEFFC9" })
        }
        //FoodOrderDetail
        if (group == 3) {
            $nRow.css({ "background-color": "#fbf3b0" })
        }
        //BSPExecutionDetail
        if (group == 4) {
            $nRow.css({ "background-color": "#fbb673" })
        }
        //ProceduresOrder
        if (group == 5) {
            $nRow.css({ "background-color": "#ffa4f2" })
        }

        //RHOrder
        if (group == 6) {
            $nRow.css({ "background-color": "#15739E" })
        }
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

function PatientOrderCancelDashBoardConnection(Id) {

    var Url = $('#url').data("fetchpatientorderdashboard");
 //   $('#preloader').show();
   $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");
    var param = {
        Id: Id
    };
    $.ajax({
        url: Url,
        data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (data) {

            BindListofItem(data.list);

            var data = data.list;
            if (data == undefined) {
                c.MessageBoxErr("Invalid Pin...", "The selected record doesn't exist.", null);
                //tblRequisitionLisgetviewt.row('tr.selected').remove().draw(false);
                //c.SetDateTimePicker('#dtCutOffTime', '');
              //  c.Select2Clear('#select2WardStation');
                return;
            }



            $('#loadingpdf').hide();
            //RedrawGrid();
        },
        error: function (xhr, desc, err) {
            $('#loadingpdf').hide();
        //    $('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}

//function InitSelec2ChangeType() {
//    $('.ClassChangetype', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
//        var cell = tblItemsList.cell($(this).closest('td')).index();
//        /*to Get ID*/
//        //   var id = c.GetSelect2Id('#select2Relationship');
//        //   tblFamilyDetails.cell(cell.row, 0).data(id);
//        tblItemsList.cell(cell.row, cell.column).data(sVal);
//        return sVal;
//    },
//  {
//      "type": 'select2ChangeType', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
//      "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
//  });

//    // Resize all rows.
//    //$(tblSelectedInvestigationList + 'tr').addClass('trclass');
//}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Validated() {

    var ret = false;


    ret = c.IsEmpty('#txtPin');

    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a Pin');
        return false;
    }


    ret = c.IsEmptySelect2('#Select2ReasonforCancel');
    if (ret) {
        c.MessageBoxErr('Empty...', 'Please select a From Cancel Reasons');
        return false;
    }


    //ret = c.IsEmptySelect2('#select2FromTariff');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a To Tariff');
    //    return false;
    //}


    //ret = c.IsEmptySelect2('#select2FromOPTariff');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a From Tariff');
    //    return false;
    //}

    //ret = c.IsEmptySelect2('#select2ToIPTariff');
    //if (ret) {
    //    c.MessageBoxErr('Empty...', 'Please select a To Tariff');
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


    entry.PatientCancelOrderSave = [];
    var rowcollection = tblItemsList.$("#chkselected:checked", { "page": "all" });
    rowcollection.each(function (index, elem) {
        var tr = $(elem).closest('tr');
        var row = tblItemsList.row(tr);
        var rowdata = row.data();

        entry.PatientCancelOrderSave.push({
            OrderId: rowdata.id,
            TypeId:  rowdata.serviceid,
            groupId: rowdata.groupId

        });
    });

    if (entry.PatientCancelOrderSave == '') {
        c.MessageBox("Error...", 'Please select data!!', null);
        return false;
    }

    console.log(entry);
    $.ajax({
        url: $('#url').data("save"),
        data: JSON.stringify(entry),
        type: 'post',
        cache: false,
        contentType: "application/json; charset=utf-8",
        beforeSend: function () {

           // c.ButtonDisable('#btnCalculate', true);
            //c.ButtonDisable('#btnModify', true);
        },
        success: function (data) {
         //   c.ButtonDisable('#btnCalculate', false);
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
                DefaultValues();
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

function View(IPID) {

    var Url = $('#url').data("fetchpatientinfo");
    //var Url = baseURL + "ShowSelected";
    var param = {
        IPID: IPID
    };
    $('#loadingpdf').show();
    //$('#preloader').show();
    //$('.Hide').hide();

    $.ajax({
        url: Url,
        data: param,
        type: 'get',
        contentType: 'application/json; charset=utf-8',
        dataType: 'json',
        cache: false,
        beforeSend: function () {

        },
        success: function (result) {
            $('#loadingpdf').show();
          //  $('#preloader').hide();
            //$('.Show').show();
            var data = result.list[0];

            var data = result.list[0];
            if (data == undefined) {
                c.MessageBoxErr("Invalid Pin...", "The selected record doesn't exist.", null);
                //tblRequisitionLisgetviewt.row('tr.selected').remove().draw(false);
                //c.SetDateTimePicker('#dtCutOffTime', '');
                //  c.Select2Clear('#select2WardStation');
                return;
            }
            c.SetValue('#txtPin', data.RegistrationNo);
            c.SetValue('#txtPatientName', data.PatientName);
            c.SetValue('#CompanyId', data.CompanyId);
            c.SetValue('#txtadmitdatetime', data.AdmitDateTime);
            c.SetValue('#txtBedNo', data.BedName);
            c.SetSelect2('#Select2Company', data.CompanyId, data.CompanyName);
            c.SetValue('#IPID', data.IPID);

            var Id = c.GetValue('#IPID');
            PatientOrderCancelDashBoardConnection(Id);




        },
        error: function (xhr, desc, err) {
            //$('#preloader').hide();
            $('#loadingpdf').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
