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
    //InitDataTables();
    SetupSelec2Sample();
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
    BindOPListofItem([]);
}

function InitSelect2() {
    // Sample usage


    $('#Select2AdmnDate').select2({
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
        var list = e.added.list;
        var IPID = c.GetSelect2Id('#Select2AdmnDate');
        TransactionDashBoardConnection(IPID);
        View(IPID);
    });

    Sel2Server($("#Select2ReasonforCancel"), $("#url").data("cancelreason"), function (d) {
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
        console.log(e.which);
        if (e.which == 13) {
            var Pin = c.GetValue('#txtPin');
           
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

    //c.SetValue('#txtPatientName', '');
    //c.SetValue('#txtCompanyCode', '');
    //c.SetSelect2('#select2Class', '1', 'NOCLASS');
    //c.SetSelect2('#select2Category', '1', 'CASH PATIENT ACCOUNT');


}

function DefaultDisable() {
    // Sample usage
    //c.DisableDateTimePicker('#dtVisit', true);
    //c.DisableDateTimePicker('#dtEndDate', true);
    //c.DisableSelect2('#Select2RefDoctor', true);
    //c.DisableSelect2('#Select2ProcedureDoneBy', true);
    //c.Disable('#txtPin', true);
    c.Disable('#txtPatientName', true);
    c.Disable('#txtCompanyCode', true);
   




}
//-----------------IP Services--List-------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


function BindListofItem(data) {

    tblItemsList = $(tblItemsListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowListColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    InitSelec2ChangeType();
}

function ShowListColumns() {
    var cols = [
      { targets: [0], data: "ReceiptNo", className: '', visible: true, searchable: false, searchable: true, width: "5%"  },
      { targets: [1], data: "DateTime", className: '', visible: true, searchable: false, width: "5%"},
      { targets: [2], data: "Type", className: '', visible: true, searchable: true, width: "10%" },
      { targets: [3], data: "Amount", className: '', visible: true, searchable: true, width: "10%" },
      { targets: [4], data: "ChangeType", className: 'ClassChangetype', visible: true, searchable: true, width: "10%" },
      { targets: [5], data: "ModeOfPayment", className: '', visible: false},
      { targets: [6], data: "IPID", className: '', visible: false},
      { targets: [7], data: "TypeID", className: '', visible: false},
      { targets: [8], data: "CompanyID", className: '', visible: false },
      { targets: [9], data: "OldTypeId", className: '', visible: false}
    ];
    return cols;

}

function TransactionDashBoardConnection(IPID) {

    var Url = $('#url').data("getfetchadmin");
 //   $('#preloader').show();
   $('#loadingpdf').show();
    // $("#grid").css("visibility", "hidden");
    var param = {
        IPID: IPID
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

function BindOPListofItem(data) {

    tblOPItemsList = $(tblOPItemsListId).DataTable({
        cache: false,
        destroy: true,
        data: data,
        paging: false,
        ordering: false,
        searching: false,
        info: false,
        scrollY: 400,
        //scrollX: true,
        processing: false,
        autoWidth: true,
        dom: 'Rlfrtip',
        scrollCollapse: false,
        pageLength: 150,
        lengthChange: false,
        columns: ShowOPListColumns()
        //fnRowCallback: ShowCompatabilityRowCallBack()
    });

    //InitSelected();
}

function ShowOPListColumns() {
    var cols = [
      { targets: [0], data: "", className: '', visible: true, searchable: false, width: "1%", defaultContent: '<input type="checkbox" name="chkselectedOP" id="chkselectedOP"/>' },
      { targets: [1], data: "ID", className: '', visible: false, searchable: false },
      { targets: [2], data: "ServiceName", className: '', visible: true, searchable: true, width: "10%" }


    ];
    return cols;
}

function CopyOPTariffDashBoardConnection() {

    var Url = $('#url').data("getopservicedash");
    $('#preloader').show();
    //$('#loadingpdf').show();
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

            BindOPListofItem(data.list);
            $('#preloader').hide();
            //RedrawGrid();
        },
        error: function (xhr, desc, err) {
            //$('#loadingpdf').hide();
            $('#preloader').hide();
            var errMsg = err.responseText + "<br>" + desc;
            c.MessageBoxErr(errMsg);

        }
    });
}


function SetupSelec2Sample() {

    $.editable.addInputType('select2ChangeType', {
        element: function (settings, original) {
            var input = $('<input id="txtchangetype" style="width:100%; height:30px;" type="text" class="sel">');
            $(this).append(input);

            return (input);
        },
        plugin: function (settings, original) {
            var select2 = $(this).find('#txtchangetype').select2({
                minimumInputLength: 0,
                allowClear: true,
                ajax: {
                    cache: false,
                    quietMillis: 150,
                    url: $('#url').data("changetype"),
                    //url: baseURL + 'Select2EmployeeRelationShip',
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
            }).on("select2-blur", function () {
                $("#txtSample").closest('td').get(0).reset();
            }).on('select2-close', function () {
                if (Select2IsClicked) { $("#txtchangetype").closest('form').submit(); }
                else { $("#txtchangetype").closest('td').get(0).reset(); }
                Select2IsClicked = false;
            }).on("select2-focus", function (e) {
                var a = $(this).closest('tr').find('#txtchangetype').val();
                $("#txtchangetype").select2("data", { id: a, text: a });
            }).data('select2');

            select2.onSelect = (function (fn) {
                return function (data, options) {
                    var target;
                    if (options != null) {
                        target = $(options.target);
                    }
                    Select2IsClicked = true;
                    return fn.apply(this, arguments);
                }
            })(select2.onSelect);


        },
        submit: function (settings, original) {
            if ($("#txtchangetype", this).select2('val') != null && $("#txtchangetype", this).select2('val') != '') {
                $("input", this).val($("#txtchangetype", this).select2("data").text);

                var rowIndex = tblItemsList.row($(this).closest('tr')).index();
                var id = $("#txtchangetype", this).select2('data').id;
                tblItemsList.cell(rowIndex, 7).data(id);

            }
        }
    });

}


function InitSelec2ChangeType() {
    $('.ClassChangetype', tblItemsList.rows().nodes()).editable(function (sVal, settings) {
        var cell = tblItemsList.cell($(this).closest('td')).index();
        /*to Get ID*/
        //   var id = c.GetSelect2Id('#select2Relationship');
        //   tblFamilyDetails.cell(cell.row, 0).data(id);
        tblItemsList.cell(cell.row, cell.column).data(sVal);
        return sVal;
    },
  {
      "type": 'select2ChangeType', "style": 'display: inline;', "onblur": 'submit', "onreset": '',
      "event": 'click', "submit": '', "cancel": '', "placeholder": '', "cssclass": "coleditor"
  });

    // Resize all rows.
    //$(tblSelectedInvestigationList + 'tr').addClass('trclass');
}

//-----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
function Validated() {

    var ret = false;


    //ret = c.IsEmpty('#txtHomeAdress');

    //if (ret) {
    //    c.MessageBoxErr('Y/N...', 'Please input Y for YES and N for NO');
    //    return false;
    //}


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
    entry.IPID = c.GetSelect2Id('#Select2AdmnDate');
    entry.CancelReasonId = c.GetSelect2Id('#Select2ReasonforCancel');

    entry.ChangeTypeDetailsSave = [];
    $.each(tblItemsList.rows().data(), function (i, row) {
        entry.ChangeTypeDetailsSave.push({
            ReceiptNo: row.ReceiptNo,
            Type: row.TypeID,
            OldTypeId: row.OldTypeId
        });
    });
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
            c.SetValue('#txtPin', data.RegistrationNo);
            c.SetValue('#txtPatientName', data.PatientName);
            c.SetValue('#CompanyId', data.CompanyId);
            c.SetValue('#txtCompanyCode', data.CompanyName);
            //c.SetSelect2('#Select2Department', data.DepartmentId, data.DepartmentName);
            //var SpecialisationId = data.SpecialisationId == 0 ? '' : data.SpecialisationId;
            //var SpecialisationName = data.SpecialisationName == null ? '' : data.SpecialisationName;
            //c.SetSelect2('#Select2Specialization', SpecialisationId, SpecialisationName);
            //c.SetValue('#txtName', data.Name);
            //c.SetValue('#txtCostPrice', data.CostPrice);
            //c.SetValue('#txtCode', data.Code);
            //c.SetValue('#txtInstructions', data.Instructions);
            //c.SetValue('#txtRemarks', data.Remarks);

           // HandleEnableButtons();
            //HandleEnableEntries();
            //c.ModalShow('#modalEntry', true);
        },
        error: function (xhr, desc, err) {
            //$('#preloader').hide();
            $('#loadingpdf').hide();
            var errMsg = err + "<br>" + desc;
            c.MessageBoxErr(errMsg);
        }
    });

}
